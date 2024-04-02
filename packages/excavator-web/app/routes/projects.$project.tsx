import {
  Button,
  HStack,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { Link as RemixLink, useLoaderData, useParams } from "@remix-run/react";

import Frequency from "../components/Frequency.js";
import { db } from "../db.server.js";
import { deslug, getValuesInKeyOrder } from "../utils/utils.js";
import { loadProjectData } from "../utils/utils.server.js";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `Excavator ♠️ - ${data?.projectName}` }];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const project = deslug(params.project || "");

  const total = await db.spadingData.count({
    where: { project: { equals: project, mode: "insensitive" } },
  });

  const data = await loadProjectData(project);

  if (data.length === 0) {
    throw new Response("No data found for this project", { status: 404 });
  }

  return json({
    projectName: data.at(0)?.project,
    data: data.map(({ count, ...rest }) => ({ count: Number(count), ...rest })),
    total,
  });
}

export default function Project() {
  const { data, total } = useLoaderData<typeof loader>();
  const { project } = useParams();
  const headers = Object.keys(data.at(0)!.data);

  return (
    <Stack mt={4}>
      <HStack flexDirection="row-reverse">
        <Button
          as={RemixLink}
          size="xs"
          rightIcon={<>⬇</>}
          to={`../${project}.csv`}
          reloadDocument
        >
          Download Data
        </Button>
      </HStack>
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
    </Stack>
  );
}
