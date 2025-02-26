import {
  Alert,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { getSpadingDataCounts } from "@prisma/client/sql";
import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { projects } from "excavator-projects";
import { useCallback } from "react";

import { Frequency } from "../components/Frequency.js";
import { Pagination } from "../components/Pagination.js";
import { ProjectHeader } from "../components/ProjectHeader.js";
import { db } from "../db.server.js";
import { fromSlug, getValuesInKeyOrder } from "../utils/utils.js";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `Excavator ♠️ - ${data?.project.name}` }];
};

const PER_PAGE = 50;

export async function loader({ params, request }: LoaderFunctionArgs) {
  const page = (Number(new URL(request.url).searchParams.get("page")) || 1) - 1;
  const projectName = fromSlug(params.project || "");

  const project = projects.find((p) => p.name === projectName);

  if (!project) throw new Response("No project found", { status: 404 });

  const total = await db.report.count({
    where: { data: { project: { equals: projectName, mode: "insensitive" } } },
  });

  const pages = Math.ceil(
    (
      await db.spadingData.groupBy({
        by: ["dataHash"],
        where: { project: { equals: projectName, mode: "insensitive" } },
      })
    ).length / PER_PAGE,
  );

  const data = await db.$queryRawTyped(
    getSpadingDataCounts(project.name, page * PER_PAGE, PER_PAGE),
  );

  return {
    projectNames: projects.map((p) => p.name).sort(),
    project,
    data,
    total,
    page,
    pages,
  };
}

export default function Project() {
  const { data, total, project, projectNames, pages, page } =
    useLoaderData<typeof loader>();

  const headers = Object.keys(data.at(0)?.data ?? {});

  const navigate = useNavigate();

  const changePage = useCallback(
    (nextPage: number) => {
      navigate(`?page=${nextPage + 1}`);
    },
    [navigate],
  );

  return (
    <Stack spacing={8} my={8}>
      <ProjectHeader project={project} projects={projectNames} />
      {project.completed && (
        <Alert>
          This project is completed. It is no longer accepting data.
        </Alert>
      )}
      {data.length === 0 ? (
        <Alert>No data for this project yet - you better get excavating!</Alert>
      ) : (
        <Stack>
          <Pagination pages={pages} value={page} onChange={changePage} />
          <TableContainer>
            <Table>
              <Thead>
                <Tr>
                  <Th>
                    <span title="Frequency">&#119891;</span>
                  </Th>
                  {headers.map((h) => (
                    <Th key={h}>{h.replace(/_/g, " ")}</Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {data.map((d) => (
                  <Tr key={d.dataHash}>
                    <Td>
                      <Frequency count={d.count ?? 0} total={total} />
                    </Td>
                    {getValuesInKeyOrder(
                      d.data as Record<string, any>,
                      headers,
                    ).map((v, i) => (
                      <Td key={headers[i]}>{String(v)}</Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Pagination pages={pages} value={page} onChange={changePage} />
        </Stack>
      )}
    </Stack>
  );
}
