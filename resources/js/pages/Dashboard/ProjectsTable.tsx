"use client"
import { DataGrid,GridActionsCellItem,GridColDef } from "@mui/x-data-grid";
import { Paper,Box,Menu,MenuItem,IconButton, Typography } from "@mui/material";
import { useState } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";

type Project = {
  id: number;
  name: string;
  team: string;
  progress: number;
  employees: number;
  tasks: number;
  deadline: string;
};

export const demoProjects: Project[] = [
  {
    id: 1,
    name: "Inventory System",
    team: "Voids",
    progress: 78,
    employees: 5,
    tasks: 23,
    deadline: "2025-01-10",
  },
  {
    id: 2,
    name: "AI Chatbot",
    team: "Phoenix",
    progress: 60,
    employees: 3,
    tasks: 15,
    deadline: "2025-02-01",
  },
  {
    id: 3,
    name: "E-Commerce Platform",
    team: "Voids",
    progress: 45,
    employees: 4,
    tasks: 18,
    deadline: "2025-01-20",
  },
  {
    id: 4,
    name: "AR Furniture App",
    team: "Phoenix",
    progress: 90,
    employees: 6,
    tasks: 32,
    deadline: "2025-01-05",
  },
  {
    id: 5,
    name: "HR Portal",
    team: "Voids",
    progress: 55,
    employees: 2,
    tasks: 11,
    deadline: "2025-02-10",
  },
];

const sample: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Project Name", width: 180 },
  { field: "team", headerName: "Team", width: 120 },
  { field: "progress", headerName: "Progress %", width: 120 },
  { field: "employees", headerName: "Employees", width: 110 },
  { field: "tasks", headerName: "Tasks", width: 100 },
  { field: "deadline", headerName: "Deadline", width: 140 },

  {
    field: "actions",
    type: "actions",
    headerName: "",
    width: 50,
    getActions: (params) => [
      <GridActionsCellItem
        icon={<ProjectMenu />}   // your same code
        label="menu"
      />,
    ],
  },
];

function ProjectMenu(){
    const [anchorElement,setAnchorElement]=useState<HTMLElement | null>(null);
    return(
        <>
            <EllipsisVerticalIcon className="w-5 h-5" aria-label="settings"/>
            <Menu anchorEl={anchorElement} open={Boolean(anchorElement)} onClose={()=>{setAnchorElement(null)}}>
                <MenuItem className="flex gap-2">Approve</MenuItem>
                <MenuItem className="flex gap-2">Remove Project</MenuItem>
                <MenuItem className="flex gap2">Edit</MenuItem>
                <MenuItem className="flex gap2">View</MenuItem>
            </Menu>
        </>
    )
}

export default function ProjTable(){
    const [projects,setprojects]=useState<Project[]>(demoProjects);
    const [rowIds,setRowIds]=useState(null);
    return(
        <Box sx={{display:"flex", flexDirection:"column", width:"100vw",alignItems:"center"}}>
            <Paper sx={{display:"inline-block"}}>
                <DataGrid
                    rows={projects}
                    columns={sample}
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