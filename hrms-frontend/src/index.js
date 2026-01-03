import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { GlobalLoaderProvider } from "./context/GlobalLoaderContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalLoaderProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </GlobalLoaderProvider>
    </BrowserRouter>
  </React.StrictMode>
);
