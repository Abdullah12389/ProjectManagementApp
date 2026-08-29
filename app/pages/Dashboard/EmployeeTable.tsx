"use client"
import { DataGrid,GridActionsCellItem,GridColDef } from "@mui/x-data-grid";
import { Paper,Box,Menu,MenuItem,IconButton, Typography } from "@mui/material";
import { useState } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";

type employee={
    id:number;
    name:string;
    team:string;
    done:number;
    inprogress:number;
    todo:number;
    projectCount:number;
    email:string;
}
export const demoMembers = [
  { id: 1, name: "Abdullah", team: "Voids", done: 10, inprogress: 5, todo: 7, projectCount: 20, email: "abdullah@gmail.com" },
  { id: 2, name: "Ayesha", team: "Phoenix", done: 8, inprogress: 3, todo: 4, projectCount: 15, email: "ayesha@gmail.com" },
  { id: 3, name: "Bilal", team: "Voids", done: 12, inprogress: 2, todo: 6, projectCount: 18, email: "bilal@gmail.com" },
  { id: 4, name: "Fatima", team: "Phoenix", done: 7, inprogress: 4, todo: 5, projectCount: 12, email: "fatima@gmail.com" },
  { id: 5, name: "Hassan", team: "Voids", done: 15, inprogress: 6, todo: 3, projectCount: 25, email: "hassan@gmail.com" },
  { id: 6, name: "Sara", team: "Phoenix", done: 9, inprogress: 5, todo: 2, projectCount: 14, email: "sara@gmail.com" },
  { id: 7, name: "Zain", team: "Voids", done: 11, inprogress: 3, todo: 4, projectCount: 17, email: "zain@gmail.com" },
  { id: 8, name: "Maryam", team: "Phoenix", done: 6, inprogress: 2, todo: 3, projectCount: 10, email: "maryam@gmail.com" },
];
const sample:GridColDef[]=[
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Name", width: 150 },
  { field: "team", headerName: "Team", width: 120 },
  { field: "done", headerName: "Done", width: 90 },
  { field: "inprogress", headerName: "In Progress", width: 110 },
  { field: "todo", headerName: "To Do", width: 90 },
  { field: "projectCount", headerName: "Projects", width: 100 },
  { field: "email", headerName: "Email", width: 180 },
  {field:"actions", type:"actions", headerName:"",width:50,getActions:(params)=>[
    <GridActionsCellItem icon={<EmployeeMenu/>} label={"menu"}></GridActionsCellItem>
  ]}
]

function EmployeeMenu(){
    const [anchorElement,setAnchorElement]=useState<HTMLElement | null>(null);
    return(
        <>
            <EllipsisVerticalIcon className="w-5 h-5" aria-label="settings"/>
            <Menu anchorEl={anchorElement} open={Boolean(anchorElement)} onClose={()=>{setAnchorElement(null)}}>
                <MenuItem className="flex gap-2">Make Manager</MenuItem>
                <MenuItem className="flex gap-2">Remove Employee</MenuItem>
            </Menu>
        </>
    )
}

export default function EmpTable(){
    const [members,setMembers]=useState<employee[]>(demoMembers);
    const [rowIds,setRowIds]=useState(null);
    return(
        <Box sx={{display:"flex", flexDirection:"column", width:"100vw",alignItems:"center"}}>
            <Paper sx={{display:"inline-block"}}>
                <DataGrid
                    rows={members}
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