# Dashboard UI

This project is a **React-based Dashboard UI** that provides a dynamic interface to load, display, group, and tag CSV-based reports. Built using **Material UI (MUI)** and **DataGrid**, the application offers an intuitive way to manage reports and visualize their data.

---

## Features

### 1. **Dynamic File Loading**

- Browse and load CSV files organized into folders like "sales" and "finance."
- Uses the `useCsvLoader` hook to fetch and parse CSV files dynamically.

### 2. **Data Display**

- Displays data from CSV files in an interactive DataGrid.
- Automatically generates rows and columns based on CSV content.

### 3. **Tag Management**

- Add or remove tags for rows in the DataGrid.
- Tags are displayed inline and can be grouped by.

### 4. **Grouping**

- Group data by tags or a specific date field.
- Toggle grouping to view categorized data.

### 5. **Interactive Grid**

- Clickable filenames that load corresponding reports.
- Toggle the active status of files.

### 6. **Error Handling and Loading States**

- Displays loading spinners and error messages for failed data fetches.

---

## Limitations

1. **Frontend-Only Application**

   - There is no backend support. Data fetching and manipulation are limited to the client side.
   - Large data sets may degrade performance.

2. **No Server-Side Pagination**

   - Pagination is entirely client-side due to frontend-only architecture.
   - All data from the CSV files is loaded into memory.

3. **Data Mutability**
   - Changes made (like tagging) are session-only and not persisted after a page refresh.

---

## Installation and Setup

### Prerequisites

- Ensure you have **Node.js (>=16.x)** and **npm/yarn** installed.

### Steps to Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Gautams-GitHub/Dashboard-UI.git
   cd dashboard-ui
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Run Development Server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser to view the app.

4. **Build for Production**

   ```bash
   npm run build
   ```

   The built files will be available in the `dist` directory.

5. **Preview Production Build**
   ```bash
   npm run preview
   ```
   This will serve the production build locally.

---

## How to Use

### Navigating the Dashboard

1. **Select a Folder**

   - Use the folder tabs to switch between report categories like "sales" and "finance."

2. **View Available Reports**

   - A list of filenames is displayed. Active reports can be toggled using the switches.

3. **Load a Report**
   - Click a filename to load and view the report in a DataGrid.

### Managing Tags

- Use the **Add Tag** button in the table to assign tags to rows.
- Remove tags using the close (X) button.

### Grouping Data

- Click "Group by Tags" to group rows by their tags.
- Use "Clear Grouping" to remove grouping.

---

## Project Structure

### Core Files

1. **App.jsx**: Main application logic.
2. **ReportTable.jsx**: Displays the DataGrid and manages tags and grouping.
3. **FilenameGrid.jsx**: Displays filenames and handles file interactions.
4. **useCsvLoader.js**: Custom hook to fetch and parse CSV files.
5. **csvUtils.js**: Utility functions for enhancing and parsing CSV data.

---

## Development Tools and Dependencies

### Key Dependencies

- **React (18.3.1)**: Frontend library.
- **Material UI (6.1.8)**: Component library for styling and interactivity.
- **DataGrid (7.22.3)**: For rendering tabular data.
- **PapaParse (5.4.1)**: Parses CSV data into JSON.

### Dev Tools

- **Vite**: Build tool for development and production.
- **ESLint**: Linting and code quality checks.

---
