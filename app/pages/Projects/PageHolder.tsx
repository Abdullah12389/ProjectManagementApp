"use client"
import SideBar,{Dictionary} from "../KanbanBoard/SideBar";
import Menu from "../KanbanBoard/MenuBar";
import React, { useState } from "react";
import { Bars3Icon,UserGroupIcon,BeakerIcon,Squares2X2Icon } from "@heroicons/react/16/solid";
import { Box } from "@mui/material";
export default function MainPage({children}:{children?:React.ReactNode}){
    const [show,setView]=useState(false);
    const Folders:Dictionary={
        "Projects":["Project1","Project2","Project3"],
        "DashBoard":[],
    }
    const icons=[BeakerIcon,UserGroupIcon,Squares2X2Icon]
    return(
        <Box>
            <SideBar icons={icons} data={Folders} show={show} setView={setView}/>
            <Menu><Bars3Icon className="w-7 h-7" onClick={()=>setView(true)}/></Menu>
            {children}
        </Box>
    )
}