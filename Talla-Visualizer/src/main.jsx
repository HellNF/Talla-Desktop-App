import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import { FileProvider } from "./store/uploadedFileContext.jsx";
import "./index.css";
import UploadPage from "./pages/Upload.jsx";
import Home from "./pages/Home.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import { ModeProvider } from "./store/ModeContext.jsx";
import { FileHandlerProvider } from "./store/FileHandlerContext.jsx";
import { GraphProvider } from "./store/GraphContext.jsx";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css"; // Importa gli stili dei componenti di PrimeReact
import "primeicons/primeicons.css";

const router = (
  <HashRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  </HashRouter>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ModeProvider>
      <FileHandlerProvider>
        <GraphProvider>
          <FileProvider>{router}</FileProvider>
        </GraphProvider>
      </FileHandlerProvider>
    </ModeProvider>
  </React.StrictMode>
);
