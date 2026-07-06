"use client"
import { Box,Paper } from "@mui/material";
import Welcome from "./Welcome";
import AuthForm from "./Form";
import { useSelector } from "react-redux"
import { RootState } from "@/store";
export default function SignUpPage(){
    return(
        <Box className="flex w-screen h-screen justify-center items-center">
            <Paper elevation={3} className="flex w-4/5 rounded-2xl! overflow-hidden h-4/5">
                <Box className="w-1/2 max-w-1/2 justify-center items-center flex bg-blue-500">
                    <Welcome/>
                </Box>
                <Box className="w-1/2 max-w-1/2 justify-center items-center flex">
                    <AuthForm/>
                </Box>
            </Paper>
        </Box>
    )
}
