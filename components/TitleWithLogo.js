import { createStyles } from "@mantine/core";
import Image from "next/image";

const useStyles = createStyles(() => ({
  main: {
    display: "flex",
    width: 424,
    alignItems: "center",

    "@media (max-width: 700px)": {
      width: "100%",
      justifyContent: "center",
      marginTop: "24px",
    },
  },
  title: {
    fontSize: 66,
    fontWeight: 600,
  },
}));

export default function TitleWidthLogo() {
  const { classes } = useStyles();

  return (
    <div className={classes.main}>
      <div className="test">
        <Image
          src="/ai.svg"
          alt="TiDB Cloud Logo"
          width={100}
          height={100}
          priority
        />
      </div>
      <div className={classes.title}>AI Insight</div>
    </div>
  );
}
