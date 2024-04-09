import {
  Alert,
  Badge,
  Box,
  Button,
  HStack,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { Link as RemixLink, useLoaderData, useParams } from "@remix-run/react";
import { projects } from "excavator-projects";

import Frequency from "../components/Frequency.js";
import { db } from "../db.server.js";
import { fromSlug, getValuesInKeyOrder, toSlug } from "../utils/utils.js";
import { loadProjectData } from "../utils/utils.server.js";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `Excavator ♠️ - ${data?.project.name}` }];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const projectName = fromSlug(params.project || "");

  const project = projects.find((p) => p.name === projectName);

  if (!project) throw new Response("No project found", { status: 404 });

  const total = await db.spadingData.count({
    where: { project: { equals: projectName, mode: "insensitive" } },
  });

  const data = await loadProjectData(projectName);

  return json({
    project,
    data: data.map(({ count, ...rest }) => ({ count: Number(count), ...rest })),
    total,
  });
}

export default function Project() {
  const { data, total, project } = useLoaderData<typeof loader>();

  const headers = Object.keys(data.at(0)?.data ?? {});

  return (
    <Stack spacing={8} mt={8}>
      <HStack>
        <Text>{project.description}</Text>
        <Box flex={1} />
        <Button
          as={RemixLink}
          size="xs"
          rightIcon={<>⬇</>}
          to={`../${toSlug(project.name)}.csv`}
          reloadDocument
        >
          <Text display={["none", null, "block"]}>Download Data</Text>
        </Button>
      </HStack>
      {data.length === 0 ? (
        <Alert>No data for this project yet - you better get excavating!</Alert>
      ) : (
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
                    <Frequency count={d.count} total={total} />
                  </Td>
                  {getValuesInKeyOrder(d.data, headers).map((v, i) => (
                    <Td key={headers[i]}>{String(v)}</Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Stack>
  );
}
