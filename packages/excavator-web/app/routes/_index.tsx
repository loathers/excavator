import { Button, Code, Link, Stack, Text, Heading } from "@chakra-ui/react";
import { LuExternalLink } from "react-icons/lu";
import { Link as RRLink } from "react-router";

export default function Index() {
  return (
    <Stack gap={10}>
      <Heading size="4xl" alignSelf="center">
        <Link variant="plain" asChild>
          <RRLink to="/">Excavator ♠️</RRLink>
        </Link>
      </Heading>
      <Stack gap={8}>
        <Stack>
          <Text>
            excavator is a <Code>spadingScript</Code> for{" "}
            <Link asChild>
              <RRLink to="https://github.com/kolmafia/kolmafia">
                KoLmafia <LuExternalLink />
              </RRLink>
            </Link>{" "}
            (at least r20145) for collaboratively gathering data while playing
            the Kingdom of Loathing. It collects sends data via kmail to the
            player <Code>Excavator</Code> when possible (i.e. when you're not in
            an encounter), otherwise it is cached in the{" "}
            <Code>spadingData</Code> property. The cache can be processed by
            running the <Code>spade</Code> command in the CLI.
          </Text>

          <Text>
            Only data pertinent to the{" "}
            <Link asChild>
              <RRLink to="/projects">current projects</RRLink>
            </Link>{" "}
            are reported (outcomes from combats, state of flags or counters on
            your player etc) and each packet of data can be reviewed and
            approved before it is sent. No personal information will ever be
            transmitted.
          </Text>

          <Text>
            These data are pulled every 15 minutes to a database and displayed
            on this web app. Before this site they were imported to{" "}
            <Link asChild>
              <RRLink to="https://tinyurl.com/excavatordata">
                Google Sheets <LuExternalLink />
              </RRLink>
            </Link>
            , where some data remains for posterity.
          </Text>

          <Text>
            It is maintained by{" "}
            <Link asChild>
              <RRLink to="https://github.com/gausie">
                gausie <LuExternalLink />
              </RRLink>
            </Link>{" "}
            (#1197090).
          </Text>
        </Stack>

        <Button asChild>
          <RRLink to="/projects">Take me to the data →</RRLink>
        </Button>
      </Stack>
    </Stack>
  );
}
