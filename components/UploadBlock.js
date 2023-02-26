import { Button, createStyles } from "@mantine/core";

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

export const UploadBlock = () => {
  const { classes } = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.title}>Explore</div>
      <div className={classes.text}>
        Try your own data?
      </div>
      <div>
        <Button variant="light">Explore your own data</Button>
      </div>
    </div>
  );
};
