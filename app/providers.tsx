"use client";

import { ThemeProvider, createTheme } from "@mui/material";
import { Provider } from "react-redux";
import React from "react";
import { store } from "./store";

const theme = createTheme({
  palette: { mode: "dark" },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>{children}</Provider>
    </ThemeProvider>
  );
}
