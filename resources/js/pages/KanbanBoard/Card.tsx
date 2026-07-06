"use client"
import { useState } from "react";
import { UserIcon,ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/16/solid";
import {Box, IconButton, Menu, MenuItem} from "@mui/material"
import { SortableContext,useSortable,verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Card,CardHeader,Typography,CardActions,CardContent } from "@mui/material";
import { Slide } from "react-awesome-reveal";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { router } from "@inertiajs/react";
import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";
import { route } from "ziggy-js";
export type Task={
    id:number
    title:string;
    description:string;
    due_date:string;
    status:string;
    project_id:number;
    user:[];
}
export default function Cards({tasks,OverId}:{className?:string,tasks:Task[],OverId:any}){
    const searchTerm=useSelector((state:RootState)=>state.search.term)
    const data=tasks.filter(ws=>ws.title.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()));
    return(
            <SortableContext strategy={verticalListSortingStrategy} items={tasks.map(t=>t.title)}>
                <Box minHeight={"100%"} gap={2} padding={2} display={"flex"} flexDirection={"column"} flex={"0 0 auto"} sx={{overflowY:"auto"}}>
                    {data && data.map((task,_)=>(
                        <Box key={task.id}>
                            <Slide direction="up" cascade damping={0.2} triggerOnce>
                                <TaskCard 
                                task={task}
                                className="rounded-2xl!"/>
                            </Slide>
                            {OverId===task.id && 
                            <Box className="text-blue-300">___________________________________</Box>}
                         </Box>
                    ))}
                </Box>
            </SortableContext>
    );
}

function TaskMenu({id}:{id:number}){
    const [anchorElement,setAnchorElement]=useState<HTMLElement | null>(null);
    function deleteit(){
        if(confirm("Do you really wanna proceed")){
            router.delete(route("task.destroy",{task:id}))
        }
    }
    return(
        <Box>
            <IconButton onClick={(e:React.MouseEvent<HTMLElement>)=>setAnchorElement(e.currentTarget)} onPointerDown={e=>e.stopPropagation()}>
                <EllipsisVerticalIcon className="w-5 h-5" aria-label="settings"/>
            </IconButton>
            <Menu anchorEl={anchorElement} open={Boolean(anchorElement)} onClose={()=>{setAnchorElement(null)}}>
                {/* <MenuItem className="flex gap-2"><PencilIcon className="w-5 h-5"/> <div>Edit</div></MenuItem> */}
                <MenuItem className="flex gap-2" onClick={deleteit}><TrashIcon className="w-5 h5"/>   <div>Delete</div></MenuItem>
            </Menu>
        </Box>
    )
}

function AssignedMenu({names}:{names:string[]}){
    const [anchorEl,setAnchorElement]=useState<HTMLElement | null>(null);
    return(
        <Box>
            <IconButton onClick={(e)=>setAnchorElement(e.currentTarget)} onPointerDown={(e)=>e.stopPropagation()}>
                <UserIcon className="w-10 h-10" aria-label="assignedTo"/>
            </IconButton>
            <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={()=>setAnchorElement(null)}>
                {(names || []).map((name,index)=>
                    <MenuItem key={index}>{name.name}</MenuItem>
                )}
            </Menu>
        </Box>
    )
}
export function TaskCard({task,className}:{task:Task,className:string}){
    if(!task) return null;
    const {listeners,setNodeRef,attributes}=useSortable({id:task.id})
    return(
            <Card ref={setNodeRef} className={className} sx={{background:'linear-gradient(135deg, #1a1a2e, #2c2c54, #6a0dad)'}}>
                <CardHeader title={
                    <Typography variant="h5" {...attributes} {...listeners}>{task.title}</Typography>
                } subheader={task.due_date} action={<TaskMenu id={task.id}/>}/>
                <CardContent>
                    <Box className="flex justify-between">
                        <AssignedMenu names={task.user}/>
                        <ChatBubbleOvalLeftEllipsisIcon onClick={()=>router.get(`/task/${task.id}`)} className="w-10 h-10" aria-label="comment"/>
                    </Box>
                </CardContent>
            </Card>
    )
}