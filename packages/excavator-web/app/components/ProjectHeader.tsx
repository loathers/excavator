import { HStack, Text, Box, Button, Menu, Portal } from "@chakra-ui/react";
import { ExcavatorProject } from "excavator-projects";
import { LuChevronDown } from "react-icons/lu";
import { Link as RRLink, useNavigate } from "react-router";

import { toSlug } from "../utils/utils.js";

type Props = {
  project: ExcavatorProject;
  projects: string[];
};

export function ProjectHeader({ project, projects }: Props) {
  const navigate = useNavigate();

  return (
    <HStack>
      <Menu.Root onSelect={({ value }) => navigate(`../${toSlug(value)}`)}>
        <Menu.Trigger asChild>
          <Button>
            {project.name} <LuChevronDown />
          </Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              {projects.map((p) => (
                <Menu.Item value={p} key={p}>
                  {p}
                </Menu.Item>
              ))}
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
      <Text>{project.description}</Text>
      <Box flex={1} />
      <Button asChild size="xs">
        <RRLink to={`../${toSlug(project.name)}.csv`} reloadDocument>
          <Text display={["none", null, "block"]}>Download Data</Text> ⬇
        </RRLink>
      </Button>
    </HStack>
  );
}
