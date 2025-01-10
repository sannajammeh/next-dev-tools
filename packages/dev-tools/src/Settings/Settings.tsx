"use client";

import { useDarkMode } from "../ClientComponents";
import styles from "./Settings.module.css";

export interface SettingsProps {}

export const Settings = ({}: SettingsProps) => {
  const [darkMode, setDarkMode] = useDarkMode();
  return (
    <div className={styles.root}>
      <h1>Settings</h1>
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
