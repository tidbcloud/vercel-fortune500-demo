import { Button, createStyles } from "@mantine/core";
import React from "react"

const useStyles = createStyles(() => ({
  root: {
  },
  block: {
    padding: 24,
    borderBottom: `1px solid #EFEFEF`,
  },
  title: {
    fontWeight: 700,
    fontSize: 16,
  },
  paragraph: {
    color: '#666666',
    fontSize: 14,
  },
  ctl: {
    marginTop: 12,
  },
}));

export default function BuildMyOwnAIInsightDialog() {
  const { classes } = useStyles();
  return (
    <div className={classes.root} >
      <div className={classes.block}>
        <div className={classes.title}>
          Register TiDB Cloud
        </div>
        <div className={classes.paragraph}>
        To connect to your clusters in TiDB Cloud, you need to sign up your TiDB Cloud account by several steps in free!
        </div>
        <div className={classes.ctl}>
          <Button variant="light" onClick={() => window.open(`https://tidbcloud.com/`)}>Sign Up TiDB Cloud</Button>
        </div>
      </div>
      <div className={classes.block}>
        <div className={classes.title}>
          Download our open-sourced demo code
        </div>
        <div className={classes.paragraph}>
          Click here to download our demo code, after unzipped, use the command below to get it run!
        </div>
        <div className={classes.ctl}>
          <Button variant="light" onClick={() => window.open(`https://github.com/tidbcloud/vercel-fortune500-demo`)}>GitHub</Button>
        </div>
      </div>
      <div className={classes.block}>
        <div className={classes.title}>
          Feel free to explore!
        </div>
        <div className={classes.paragraph}>
          Now, enjoy your moments exploring your own dataset. For some advanced features or dev help, please go visiting our dev manual.
        </div>
      </div>
    </div>
  );
};
