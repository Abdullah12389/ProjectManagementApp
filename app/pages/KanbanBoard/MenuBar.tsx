
import { PlusIcon,ChartBarIcon,PowerIcon, MoonIcon,SunIcon } from "@heroicons/react/16/solid"
import React, { useState } from "react"
import { MenuItem,Menu, Typography,Switch, Avatar, IconButton,Box } from "@mui/material"
import Search from "../../components/ui/search"
import { api, visit } from "@/app/lib/api"

function ProfileMenu(){
    const [anchorElement,setAnchorElement]=useState<HTMLElement | null>(null);
    return(
        <Box>
            <IconButton onClick={(e:React.MouseEvent<HTMLElement>)=>setAnchorElement(e.currentTarget)}>
                <Avatar src="favicon.svg"/>
            </IconButton>
            <Menu anchorEl={anchorElement} open={Boolean(anchorElement)} onClose={()=>setAnchorElement(null)}>
                {/* <MenuItem sx={{display:"flex",gap:1}}>
                    <ChartBarIcon className="w-5 h-5"/>
                    <Typography>DashBoard</Typography>
                </MenuItem> */}
                {/* <MenuItem sx={{display:"flex",gap:1}}>
                    <MoonIcon className="w-5 h-5"/>
                    <Typography>Theme</Typography>
                    <Switch/>
                </MenuItem> */}
                <MenuItem sx={{display:"flex",gap:1}} onClick={()=>api.post("/auth/logout").then(()=>visit("/"))}>
                    <PowerIcon className="w-5 h-5"/>
                    <Typography>Logout</Typography>
                </MenuItem>
            </Menu>
        </Box>
    )
}
function RightMenuBar(){
    return(
        <div className="right-0 flex gap-5 justify-center items-center">
            <Search/>
            <ProfileMenu/>
        </div>
    )
}
function Logo(){
    return(
        <div className="flex items-center gap-2">
            <Avatar src="logo.svg" className="w-10 h-10 rounded-full"/>
            <div className="font-extrabold text-2xl">Void Walkers</div>
        </div>
    )
}
export default function Profile({className,children}:{className?:string,children?:React.ReactNode}){
    return(
        <Box sx={{display:"flex", justifyContent:"space-between", padding:2}}>
            <Box sx={{display:"flex", gap:2, alignItems:"center"}}>
                {children}
                <Logo/>
            </Box>
            <RightMenuBar/>
        </Box>
    )
}
