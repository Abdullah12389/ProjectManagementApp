"use client"
import { useEffect, useState } from "react"
import { Button,Box,Avatar, colors } from "@mui/material";
import { UserLoginStates } from "./States";
import { useShallow } from "zustand/react/shallow";
export default function Welcome({className}:{className?:string}){
    const [text,setText]=useState<string>("");
    const { state,toggle }=UserLoginStates(useShallow(
            states=>({
                state:states.userState,
                toggle:states.toogleUserState
            })
      ));
    const welcome="Welcome! Sign In to Get Started with Project Management"
    useEffect(()=>{
      let timers:NodeJS.Timeout[]=[];
      for(let i=0;i<welcome.length;i++){
          const t=setTimeout(()=>{
            setText((prev)=>prev+welcome[i]);
          },i*50);
          timers.push(t)
      }
      return ()=>timers.forEach((t)=>clearTimeout(t))
    },[])
    return(
      <Box className={`${className} flex justify-center items-center flex-col gap-5`}>
        <Avatar src="Logo.png" className="w-20! h-20!"/>
        <Box className="font-extrabold text-2xl text-center">{text}</Box>
        <Button sx={{color:"primary.contrastText"}} className="border-gray-900!" variant="outlined" onClick={toggle}>{state?"Create Account?":"Aleady Have and Account?"}</Button>
      </Box>
    )
}