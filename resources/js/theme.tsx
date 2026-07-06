"use client"
import { ThemeProvider,createTheme } from "@mui/material";
import React from "react"
import {create} from "zustand"
type Theme={
    darkmode:boolean,
    toggleMode:()=>void;
}
export const ThemeSwith=create<Theme>((set)=>({
    darkmode:true,
    toggleMode:()=>set((s)=>({darkmode:!s.darkmode}))
}));
export default function ProvideTheme({children}:{children:React.ReactNode}){
    const darkmode=ThemeSwith(state=>state.darkmode);
    const theme=createTheme({
        palette:{mode:darkmode?"dark":"light"}
    })
    return(
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
    );
}