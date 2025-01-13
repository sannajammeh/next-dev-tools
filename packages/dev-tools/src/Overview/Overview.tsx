import styles from "./Overview.module.css";
import { DT } from "../components";
import { RenderPerformance } from "./RenderPerformance";
import { AwaitHydration } from "../ClientComponents";

export interface OverviewProps {}

export const Overview = ({}: OverviewProps) => {
  return (
    <DT.Content className={styles.root}>
      <DT.Text variant="title">Overview</DT.Text>
      <AwaitHydration>
        <RenderPerformance />
      </AwaitHydration>
    </DT.Content>
  );
};
