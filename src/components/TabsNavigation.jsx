/* eslint-disable react/prop-types */
import { Tabs, Tab } from "@mui/material";

// Props:
// folders: Array of folder names (e.g., ['sales', 'finance'])
// activeFolder: Current active folder
// onFolderChange: Function to handle tab changes

const TabsNavigation = ({ folders, activeFolder, onFolderChange }) => {
  return (
    <Tabs
      value={activeFolder}
      onChange={(event, newValue) => onFolderChange(newValue)}
      variant="scrollable"
      scrollButtons="auto"
      aria-label="Folder Navigation Tabs"
    >
      {folders.map((folder) => (
        <Tab key={folder} label={folder} value={folder} />
      ))}
    </Tabs>
  );
};

export default TabsNavigation;
