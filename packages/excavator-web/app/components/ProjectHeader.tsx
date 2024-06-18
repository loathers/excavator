import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  HStack,
  Text,
  Box,
  Button,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
} from "@chakra-ui/react";
import { Link as RemixLink, useNavigate } from "@remix-run/react";
import { ExcavatorProject } from "excavator-projects";
import React from "react";

import { toSlug } from "../utils/utils.js";

type Props = {
  project: ExcavatorProject;
  projects: string[];
};

export function ProjectHeader({ project, projects }: Props) {
  const navigate = useNavigate();

  return (
    <HStack>
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          {project.name}
        </MenuButton>
        <MenuList>
          {projects.map((p) => (
            <MenuItem key={p} onClick={() => navigate(`../${toSlug(p)}`)}>
              {p}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
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
  );
}
