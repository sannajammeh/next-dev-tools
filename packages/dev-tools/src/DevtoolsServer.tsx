import { classed } from "@tw-classed/react";
import { Provider } from "jotai";
import {
  EyeClosedIcon,
  FileArchiveIcon,
  HomeIcon,
  Maximize2,
  RefreshCwIcon,
  SettingsIcon,
} from "lucide-react";
import { DevtoolsWrapper, Sidebar, SidebarToggle } from "./ClientComponents";
import styles from "./index.module.css";
import { OpenGraph } from "./OpenGraph";
import { Overview } from "./Overview";
import { Settings } from "./Settings";
import { DialogClose, DialogTrigger } from "./ui/Dialog";
import { IconButton } from "./ui/IconButton";
import { Logo } from "./ui/Logo";
import { ModalContent, ModalViewport } from "./ui/Modal";
import { Tab, TabsRoot, TabsTrigger } from "./ui/Tabs";
import { Suspense } from "react";

const SidebarItem = classed(TabsTrigger, styles.sidebarItem!);
const SidebarSeparator = classed("span", styles.sidebarSeparator!);
const StyledTab = classed(Tab, styles.tab!);

const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");

interface Props {
  content?: Array<{
    title: string;
    value?: string;
    icon: React.ReactNode;
    content: React.ReactNode;
  }>;
}

export const DevtoolsServer = ({ content }: Props) => {
  return (
    <Provider>
      <DevtoolsWrapper>
        <TabsRoot defaultValue="overview" storageKey="main-nav">
          <DialogTrigger asChild>
            <button className={styles.trigger}>
              <Logo width={"auto"} height="16px" />

              <span className={styles.separator}></span>
              <Maximize2 className={styles.icon} />
            </button>
          </DialogTrigger>
          <ModalViewport portal={false}>
            <ModalContent>
              <Sidebar>
                <header className={styles.logo}>
                  <Logo height={30} width={"auto"} />
                </header>
                <div style={{ flexGrow: 1 }}>
                  <menu>
                    <SidebarItem value="overview">
                      <HomeIcon />
                      <span>Overview</span>
                    </SidebarItem>
                    <SidebarItem value="opengraph">
                      <FileArchiveIcon />
                      <span>Opengraph</span>
                    </SidebarItem>
                    <SidebarItem value="settings">
                      <SettingsIcon />
                      <span>Settings</span>
                    </SidebarItem>
                    {content?.length && (
                      <>
                        <SidebarSeparator />
                        {content.map(({ value, title, icon }) => (
                          <SidebarItem
                            key={value || slugify(title)}
                            value={value || slugify(title)}
                          >
                            {icon}
                            <span>{title}</span>
                          </SidebarItem>
                        ))}
                        <SidebarSeparator />
                      </>
                    )}
                  </menu>
                </div>
                <footer>
                  <DialogClose asChild>
                    <IconButton>
                      <EyeClosedIcon />
                    </IconButton>
                  </DialogClose>
                  <IconButton>
                    <RefreshCwIcon />
                  </IconButton>
                  <SidebarToggle />
                </footer>
              </Sidebar>
              <StyledTab value="overview">
                <Overview />
              </StyledTab>
              <StyledTab value="opengraph">
                <OpenGraph />
              </StyledTab>
              <StyledTab value="settings">
                <Settings />
              </StyledTab>
              {content?.map(({ title, value, content }) => (
                <StyledTab
                  key={value || slugify(title)}
                  value={value || slugify(title)}
                >
                  {content}
                </StyledTab>
              ))}
            </ModalContent>
          </ModalViewport>
        </TabsRoot>
      </DevtoolsWrapper>
    </Provider>
  );
};
