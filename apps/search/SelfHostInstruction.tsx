import { Alert, Stack, Text, Divider } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";

export const SelfHostInstruction: React.FC = () => {
  return (
    <Stack p={0}>
      <Stack px={20} pt={20} spacing={0}>
        <Text fw={700} size={16}>
          Sign up on TiDB Cloud
        </Text>
        <Text size={14} color="#666666">
          To connect to a database,{" "}
          <a
            href="https://tidbcloud.com/"
            target="_blank"
            rel="noopener noreferrer"
            data-mp-event="Click Sign Up TiDB Cloud Link"
          >
            click here
          </a>{" "}
          to sign up on TiDB Cloud for free!
        </Text>
      </Stack>
      <Divider />
      <Stack px={20} spacing={0}>
        <Text fw={700} size={16}>
          Download code
        </Text>
        <Text size={14} color="#666666">
          <a
            href="https://github.com/tidbcloud/vercel-fortune500-demo/tree/ai-insight"
            target="_blank"
            rel="noopener noreferrer"
            data-mp-event="Click AI Insight GitHub Repo Link"
          >
            Click here
          </a>{" "}
          to download the code and follow instructions in README to get it
          running.
        </Text>

        <Alert color="green" icon={<IconAlertCircle />} mt={8}>
          You will need a Node.js environment ready, refer to{" "}
          <a
            href="https://nodejs.org/"
            target="_blank"
            rel="noopener noreferrer"
            data-mp-event="Click Nodejs Site Link"
          >
            here
          </a>{" "}
          to get one.
        </Alert>
      </Stack>
      <Divider />
      <Stack px={20} pb={20} spacing={0}>
        <Text fw={700} size={16}>
          Start to explore!
        </Text>
        <Text size={14} color="#666666">
          Enjoy exploring your own dataset and for some advanced features or dev
          help, please{" "}
          <a
            href="https://github.com/tidbcloud/vercel-fortune500-demo/issues"
            target="_blank"
            rel="noopener noreferrer"
            data-mp-event="Click GitHub Issue Link"
          >
            open an issue
          </a>{" "}
          on GitHub.
        </Text>
      </Stack>
    </Stack>
  );
};
