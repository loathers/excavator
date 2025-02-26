import { Alert, Heading, Link, Spinner, Stack } from "@chakra-ui/react";
import { projects } from "excavator-projects";
import { useEffect } from "react";
import {
  type MetaFunction,
  Outlet,
  useNavigate,
  useNavigation,
  useParams,
  Link as RRLink,
} from "react-router";
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

  return (
    <Stack gap={10}>
      <Heading size="4xl" alignSelf="center">
        <Link variant="plain" asChild>
          <RRLink to="/">Excavator ♠️</RRLink>
        </Link>
      </Heading>
      {projects.length === 0 ? (
        <Alert.Root>No projects found</Alert.Root>
      ) : showSpinner ? (
        <Spinner />
      ) : (
        <Outlet />
      )}
    </Stack>
  );
}
