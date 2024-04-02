import {
  Alert,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { MetaFunction, json } from "@remix-run/node";
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useParams,
} from "@remix-run/react";
import { useEffect } from "react";

import { db } from "../db.server.js";
import { slug } from "../utils/utils.js";

export const meta: MetaFunction = () => {
  return [{ title: "Excavator ♠️ - Projects" }];
};

export async function loader() {
  const projects = (
    await db.spadingData.findMany({
      distinct: "project",
      select: { project: true },
      orderBy: { project: "asc" },
    })
  ).map(({ project }) => project);

  return json({ projects });
}

export default function Projects() {
  const { projects } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (!params.project && projects.length > 0)
      navigate(`./${slug(projects.at(0)!)}`);
  }, []);

  if (projects.length === 0) return <Alert>No projects found</Alert>;

  return (
    <Tabs isLazy onChange={(i) => navigate(`./${slug(projects[i])}`)}>
      <TabList>
        {projects.map((p) => (
          <Tab key={p}>{p}</Tab>
        ))}
      </TabList>
      <TabPanels>
        <Outlet />
      </TabPanels>
    </Tabs>
  );
}
