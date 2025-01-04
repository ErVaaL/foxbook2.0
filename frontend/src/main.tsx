import React from "react";
import { createRoot } from "react-dom/client";
import "./globals.css";
import App from "./App";
import { ThemeProvider } from "./contexts/ThemeContext";
import store from "./store";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);
