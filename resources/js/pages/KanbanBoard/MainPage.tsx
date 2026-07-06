"use client"
import MultipleContainers from "./Container";
import SideBar,{Dictionary} from "./SideBar";
import Menu from "./MenuBar"
import { useState } from "react";
import { Bars3Icon,UserGroupIcon,BeakerIcon,Squares2X2Icon } from "@heroicons/react/16/solid";
export default function MainPage(){
    const [show,setView]=useState(false);
    const Folders:Dictionary={
        "Projects":["Project1","Project2","Project3"],
        "DashBoard":[],
    }
    const icons=[BeakerIcon,UserGroupIcon,Squares2X2Icon]
    return(
        <div>
            <SideBar icons={icons} data={Folders} show={show} setView={setView}/>
            <Menu><Bars3Icon className="w-7 h-7" onClick={()=>setView(true)}/></Menu>
            <MultipleContainers titles={["todo","inprogress","done"]} className="flex justify-around"/>
        </div>
    )
}