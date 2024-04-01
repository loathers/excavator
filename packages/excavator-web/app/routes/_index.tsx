import { Button, Code, Link, Stack, Text } from "@chakra-ui/react";
import { Link as RemixLink } from "@remix-run/react";

export default function Index() {
  return (
    <Stack spacing={8}>
      <Stack>
        <Text>
          excavator is a <Code>spadingScript</Code> for{" "}
          <Link
            as={RemixLink}
            isExternal
            to="https://github.com/kolmafia/kolmafia"
          >
            KoLmafia
          </Link>{" "}
          (at least r20145) for collaboratively gathering data while playing the
          Kingdom of Loathing. It collects sends data via kmail to the player{" "}
          <Code>Excavator</Code> when possible (i.e. when you're not in an
          encounter), otherwise it is cached in the <Code>spadingData</Code>{" "}
          property. The cache can be processed by running the <Code>spade</Code>{" "}
          command in the CLI.
        </Text>

        <Text>
          Only data pertinent to the{" "}
          <Link as={RemixLink} to="/projects">
            current projects
          </Link>{" "}
          are reported (outcomes from combats, state of flags or counters on
          your player etc) and each packet of data can be reviewed and approved
          before it is sent. No personal information will ever be transmitted.
        </Text>

        <Text>
          These data are pulled every 15 minutes to a database and displayed on
          this web app. Before this site they were imported to{" "}
          <Link
            isExternal
            as={RemixLink}
            to="https://tinyurl.com/excavatordata"
          >
            Google Sheets
          </Link>
          , where some data remains for posterity.
        </Text>

        <Text>
          It is maintained by{" "}
          <Link as={RemixLink} isExternal to="https://github.com/gausie">
            gausie
          </Link>{" "}
          (#1197090).
        </Text>
      </Stack>

      <Button as={RemixLink} to="/projects">
        Take me to the data →
      </Button>
    </Stack>
  );
}
