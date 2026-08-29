"use client"
import { DataGrid,GridActionsCellItem,GridColDef } from "@mui/x-data-grid";
import { Paper,Box,Menu,MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";

type team={
    id:number;
    name:string;
    members:number;
    projects:number;
    progress:number;
    lead:string;
}

export const demoTeams:team[] = [
  { id: 1, name: "Voids", members: 8, projects: 4, progress: 75, lead: "Abdullah" },
  { id: 2, name: "Phoenix", members: 6, projects: 3, progress: 62, lead: "Ayesha" },
  { id: 3, name: "Nebula", members: 10, projects: 5, progress: 84, lead: "Bilal" },
  { id: 4, name: "Spectra", members: 7, projects: 2, progress: 58, lead: "Fatima" },
  { id: 5, name: "Quantum", members: 5, projects: 3, progress: 71, lead: "Hassan" },
];

const teamColumns:GridColDef[]=[
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Team", width: 150 },
  { field: "members", headerName: "Members", width: 120 },
  { field: "projects", headerName: "Projects", width: 120 },
  { field: "progress", headerName: "Progress %", width: 120 },
  { field: "lead", headerName: "Team Lead", width: 150 },
  {
    field:"actions",
    type:"actions",
    headerName:"",
    width:50,
    getActions:(params)=>[
      <GridActionsCellItem icon={<TeamMenu/>} label={"menu"} />
    ]
  }
]

function TeamMenu(){
    const [anchorElement,setAnchorElement]=useState<HTMLElement | null>(null);
    return(
        <>
            <EllipsisVerticalIcon className="w-5 h-5" aria-label="settings"/>
            <Menu anchorEl={anchorElement} open={Boolean(anchorElement)} onClose={()=>{setAnchorElement(null)}}>
                <MenuItem className="flex gap-2">View Team</MenuItem>
                <MenuItem className="flex gap-2">Manage Team</MenuItem>
            </Menu>
        </>
    )
}

export default function TeamTable(){
    const [teams,setTeams]=useState<team[]>(demoTeams);
    const [rowIds,setRowIds]=useState(null);
    return(
        <Box sx={{display:"flex", flexDirection:"column", width:"100vw",alignItems:"center"}}>
            <Paper sx={{display:"inline-block"}}>
                <DataGrid
                    rows={teams}
                    columns={teamColumns}
                    onRowSelectionModelChange={(ids)=>{
                        setRowIds(rowIds);
                    }}
                    checkboxSelection
                    pageSizeOptions={[5,10]}
                />
            </Paper>
        </Box>
    )
}
