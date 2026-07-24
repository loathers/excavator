import { Alert, Stack, Table } from "@chakra-ui/react";
import { projects } from "excavator-projects";
import { useLoaderData } from "react-router";

import { Frequency } from "../components/Frequency.js";
import { Pagination } from "../components/Pagination.js";
import { ProjectHeader } from "../components/ProjectHeader.js";
import { db, getSpadingDataCounts } from "../db.server.js";
import { fromSlug, getValuesInKeyOrder } from "../utils/utils.js";

import { type Route } from "./+types/projects.$project";

export const meta = ({ data }: Route.MetaArgs) => {
  return [{ title: `Excavator ♠️ - ${data?.project.name}` }];
};

const PER_PAGE = 50;

export async function loader({ params, request }: Route.LoaderArgs) {
  const page = (Number(new URL(request.url).searchParams.get("page")) || 1) - 1;
  const projectName = fromSlug(params.project || "");

  const project = projects.find((p) => p.name === projectName);

  if (!project) throw new Response("No project found", { status: 404 });

  const { total } = await db
    .selectFrom("Report")
    .innerJoin("SpadingData", "SpadingData.id", "Report.dataId")
    .select((eb) => eb.cast<number>(eb.fn.countAll(), "integer").as("total"))
    .where("SpadingData.project", "ilike", projectName)
    .executeTakeFirstOrThrow();

  const { count } = await db
    .selectFrom("SpadingData")
    .select((eb) =>
      eb
        .cast<number>(eb.fn.count("dataHash").distinct(), "integer")
        .as("count"),
    )
    .where("project", "ilike", projectName)
    .executeTakeFirstOrThrow();

  const data = await getSpadingDataCounts(project.name)
    .offset(page * PER_PAGE)
    .limit(PER_PAGE)
    .execute();

  return {
    projectNames: projects.map((p) => p.name).sort(),
    project,
    data,
    total,
    count,
    pageSize: PER_PAGE,
    page,
  };
}

export default function Project() {
  const { data, count, total, project, projectNames, pageSize, page } =
    useLoaderData<typeof loader>();

  const headers = Object.keys(data.at(0)?.data ?? {});

  return (
    <Stack gap={8} my={8}>
      <ProjectHeader project={project} projects={projectNames} />
      {project.completed && (
        <Alert.Root>
          This project is completed. It is no longer accepting data.
        </Alert.Root>
      )}
      {data.length === 0 ? (
        <Alert.Root>
          No data for this project yet - you better get excavating!
        </Alert.Root>
      ) : (
        <Stack alignItems="center">
          <Pagination count={count} pageSize={pageSize} page={page} />
          <Table.ScrollArea width="100%">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>
                    <span title="Frequency">&#119891;</span>
                  </Table.ColumnHeader>
                  {headers.map((h) => (
                    <Table.ColumnHeader key={h}>
                      {h.replace(/_/g, " ")}
                    </Table.ColumnHeader>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {data.map((d) => (
                  <Table.Row key={d.dataHash}>
                    <Table.Cell>
                      <Frequency count={d.count ?? 0} total={total} />
                    </Table.Cell>
                    {getValuesInKeyOrder(
                      d.data as Record<string, any>,
                      headers,
                    ).map((v, i) => (
                      <Table.Cell key={headers[i]}>{String(v)}</Table.Cell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
          <Pagination count={count} pageSize={pageSize} page={page} />
        </Stack>
      )}
    </Stack>
  );
}
