"use client";

import { useDarkMode } from "../ClientComponents";
import { Typography } from "../ui/Typography";
import styles from "./Settings.module.css";

export interface SettingsProps {}

export const Settings = ({}: SettingsProps) => {
  const [darkMode, setDarkMode] = useDarkMode();
  return (
    <div className={styles.root}>
      <Typography as="h1" variant="title">
        Settings
      </Typography>
      <br />
      <br />
      <label className={styles.checkbox}>
        <span>Dark Mode</span>
        <input
          type="checkbox"
          name="darkmode"
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
        />
      </label>
    </div>
  );
};
