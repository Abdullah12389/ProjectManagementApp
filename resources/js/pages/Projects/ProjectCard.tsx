"use client"

import { Card,CardHeader,CardContent, Typography, Box,Dialog,DialogActions,DialogContent,DialogTitle,LinearProgress, IconButton, Menu, MenuItem, TextField, Button } from "@mui/material";
import { EllipsisVerticalIcon,PencilIcon,TrashIcon,DocumentIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";
import { Slide } from "react-awesome-reveal";
import { router, useForm,usePage } from "@inertiajs/react";
import { PlusIcon } from "lucide-react";
import { route } from "ziggy-js";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

function ProjectMenu({id}:{id:number}){
    const [anchorElement,setAnchorElement]=useState<HTMLElement | null>(null);
    function deleteit(){
        if(confirm("Do you really wanna proceed")){
            router.delete(route("project.destroy",{project:id}))
        }
    }
    return(
        <Box>
            <IconButton onClick={(e:React.MouseEvent<HTMLElement>)=>setAnchorElement(e.currentTarget)} onPointerDown={e=>e.stopPropagation()}>
                <EllipsisVerticalIcon className="w-5 h-5" aria-label="settings"/>
            </IconButton>
            <Menu anchorEl={anchorElement} open={Boolean(anchorElement)} onClose={()=>{setAnchorElement(null)}}>
                {/* <MenuItem className="flex gap-2"><PencilIcon className="w-5 h-5"/> <div>Edit</div></MenuItem> */}
                <MenuItem className="flex gap-2" onClick={deleteit}><TrashIcon className="w-5 h5"/><div>Delete</div></MenuItem>
            </Menu>
        </Box>
    )
}
function ProjectCard({project}:{project:any}){
    return(
        <Card sx={{borderRadius:"10px", width:"30vw", background:'linear-gradient(135deg, #1a1a2e, #2c2c54, #6a0dad)'}}>
            <CardHeader 
                title={<Typography onClick={()=>router.visit(`/project/${project.id}`)}>{project.name}</Typography>} 
                subheader={
                    <Box>
                        <Typography>Deadline: {project.deadline}</Typography>
                        <Typography>Process Model: {project.process_model}</Typography>
                    </Box>
                }
                action={<ProjectMenu id={project.id}/>}
            />
            <CardContent>
                <Typography variant="h6">Progress:</Typography>
                <LinearProgress value={project.progress} variant="determinate" sx={{height:"20px", borderRadius:"20px"}}/>
            </CardContent>
        </Card>
    );
}
function NewProject({open,setOpen,id}:{open:boolean,setOpen:React.Dispatch<React.SetStateAction<boolean>>,id:number}){
    const {data,setData,post,processing}=useForm({
        name:'',
        deadline:'',
        process_model:'',
        workspace_id:id 
    })
    const submit=(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        post(route('project.store'))
        setOpen(false);
    }
    return(
            <Dialog open={open}>
                <DialogTitle>New Project</DialogTitle>
                <form onSubmit={submit}>
                <DialogContent sx={{display:"flex", flexDirection:"column"}}>
                    <TextField
                        label='Name'
                        margin="dense"
                        value={data.name}
                        onChange={(e)=>setData('name',e.target.value)}
                    />
                    <TextField
                        type="datetime-local"
                        margin="dense"
                        value={data.deadline}
                        onChange={(e)=>setData('deadline',e.target.value)}
                    />
                    <TextField
                        label='Process Model'
                        margin="dense"
                        value={data.process_model}
                        onChange={(e)=>setData('process_model',e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={()=>setOpen(false)}>Cancel</Button>
                    <Button variant="contained" type="submit" disabled={processing}>Create</Button>
                </DialogActions>
                </form>
            </Dialog>
    )
}

interface PageProps{
    workspace: { id: number; name: string };
    projects: { id: number; name: string; deadline: string;process_model:string }[];
    [key:string]:any
}

export default function MultipleCards(){
    const [open,setOpen]=useState(false);
    const { workspace, projects,isowner } =usePage<PageProps>().props
    const searchTerm=useSelector((state:RootState)=>state.search.term)
    const data=projects.filter(ws=>ws.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()));
    return(
        <Box display={"flex"} sx={{flex:"0 0 auto", flexWrap:"wrap", gap:5, maxWidth:"100vw", justifyContent:"space-around"}}>
            {isowner &&
            <Box display={"flex"} justifyContent={"flex-end"} width={'100vw'} padding={2}>
                <Button variant="contained" onClick={()=>setOpen(true)}>
                    <PlusIcon className="w-5 h-5"/>
                    <Box>New Project</Box>
                </Button>
            </Box>}
            <NewProject open={open} setOpen={setOpen} id={workspace.id}/>
            {projects.length===0 && 
                <Box sx={{height:"80vh",width:"100vw", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                    <DocumentIcon className="w-50 h-50"/>
                    <Typography variant="h4">No Projects Right Now</Typography>
                </Box>}
            {projects && data.map((value,index)=>(
                <Slide direction="up" damping={0.2} triggerOnce cascade key={index}>
                    <ProjectCard project={value}/>
                </Slide>
            ))}
        </Box>
    )
}
