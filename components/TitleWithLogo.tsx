import { Group, Text } from "@mantine/core";
import Image from "next/image";
import { useRouter } from "next/router";
import { useMemoizedFn } from "ahooks";

export const TitleWithLogo: React.FC = () => {
  const router = useRouter();
  const onClick = useMemoizedFn(() => {
    router.push("/");
  });
  return (
    <Group>
      <Image
        src="/ai.svg"
        alt="TiDB Cloud Logo"
        width={36}
        height={36}
        priority
      />

      <Text fw={600} size={26} onClick={onClick} sx={{ cursor: "pointer" }}>
        AI Insight
      </Text>
    </Group>
  );
};
