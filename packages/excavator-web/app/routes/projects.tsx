import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { json } from "@remix-run/node";
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useParams,
} from "@remix-run/react";
import { useEffect } from "react";

import { db } from "../db.server.js";

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

const slug = (name: string) => name.replace(/ /g, "-").toLowerCase();

export default function Projects() {
  const { projects } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (!params.project) navigate(`./${slug(projects.at(0)!)}`);
  }, []);

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
