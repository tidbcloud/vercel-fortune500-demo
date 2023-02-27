import { Button, createStyles, Modal } from "@mantine/core";
import Link from "next/link"
import React, { useState } from "react"
import BuildMyOwnAIInsightDialog from "./BuildMyOwnAIInsightDialog";

const useStyles = createStyles(() => ({
  root: {
    marginLeft: 60,
  },
  text: {
    color: '#666666',
    fontSize: 16,
    marginBottom: 18,
 },
  title: {
    color: '#333333',
    fontSize: 24,
    marginBottom: 18,
  },
}));

export const UploadBlock = ({ showingResult }) => {
  const { classes } = useStyles();
  const [showingDIYBuild, setShowingDIYBuild] = useState(false);
  return (
    <div className={classes.root} style={showingResult ? { marginLeft: 0 } : {}}>
      <div className={classes.title}>Explore</div>
      <div className={classes.text}>Build your own AI Insight portal, to persist your data, 
support unlimited file size!</div>
      <div style={{ marginBottom: 18 }}>
        <Button variant="light" onClick={() => setShowingDIYBuild(true) }>
          Build your own AI Insight
        </Button>
        <Modal
          opened={showingDIYBuild}
          onClose={() => setShowingDIYBuild(false)}
          title="Build your own AI Insight!"
        >
          <BuildMyOwnAIInsightDialog />
        </Modal>
      </div>
      <div className={classes.text}>Upload another data file? </div>
      <div>
        <Link href="/">
          <Button variant="light">Explore any dataset</Button>
        </Link>
      </div>
    </div>
  );
};
