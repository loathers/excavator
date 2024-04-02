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
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link as RemixLink, useLoaderData, useParams } from "@remix-run/react";

import { db } from "../db.server.js";
import { deslug } from "../utils/utils.js";
import { loadProjectData } from "../utils/utils.server.js";

const getValuesInKeyOrder = <T,>(obj: Record<string, T>, keys: string[]) =>
  Object.entries(obj)
    .sort(([a], [b]) => keys.indexOf(a) - keys.indexOf(b))
    .map(([, v]) => v);

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
    data: data.map(({ count, ...rest }) => ({ count: Number(count), ...rest })),
    total,
  });
}

function Frequency({ count, total }: { count: number; total: number }) {
  const full = (count / total) * 100;
  return (
    <Td title={`${count} times out of ${total} (${full}%)`}>
      {full.toLocaleString(undefined, { maximumFractionDigits: 2 })}%
    </Td>
  );
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
              <Th>&#119891;</Th>
              {headers.map((h) => (
                <Th key={h}>{h.replace(/_/g, " ")}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {data.map((d) => (
              <Tr key={d.dataHash}>
                <Frequency count={d.count} total={total} />
                {getValuesInKeyOrder(d.data, headers).map((v, i) => (
                  <Td key={headers[i]}>{v}</Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
