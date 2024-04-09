import {
  Alert,
  Spinner,
  Tab,
  TabIndicator,
  TabList,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { MetaFunction } from "@remix-run/node";
import { Outlet, useNavigate, useNavigation, useParams } from "@remix-run/react";
import { projects } from "excavator-projects";
import { useEffect } from "react";
import { useSpinDelay } from "spin-delay";

import { toSlug } from "../utils/utils.js";

export const meta: MetaFunction = () => {
  return [{ title: "Excavator ♠️ - Projects" }];
};

export default function Projects() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { project } = useParams();
  const showSpinner = useSpinDelay(navigation.state === "loading");

  useEffect(() => {
    if (!project && projects.length > 0)
      navigate(`./${toSlug(projects.at(0)!.name)}`);
  }, []);

  if (projects.length === 0) return <Alert>No projects found</Alert>;

  const projectIndex = projects.findIndex(
    (p) => toSlug(p.name) === project,
  );

  return (
    <Tabs
      defaultIndex={projectIndex}
      maxWidth="100%"
      onChange={(i) => navigate(`./${toSlug(projects[i].name)}`)}
    >
      <TabList
        overflowX="scroll"
        sx={{
          scrollbarWidth: "none",
          "::-webkit-scrollbar": {
            display: "none",
          },
        }}
        pb={1}
      >
        {projects.map((p) => (
          <Tab key={p.name} sx={{ textWrap: "nowrap" }}>
            {p.name}
          </Tab>
        ))}
      </TabList>
      <TabIndicator />
      <TabPanels>{showSpinner ? <Spinner /> : <Outlet />}</TabPanels>
    </Tabs>
  );
}
