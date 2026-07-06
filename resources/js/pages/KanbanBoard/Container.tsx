"use client"
import { PlusIcon } from "@heroicons/react/16/solid"
import Cards from "./Card"
import { Task } from "./Card"
import { Box,Stack,Button,Dialog,DialogActions,DialogTitle,DialogContent, TextField, InputAdornment, Autocomplete, Checkbox } from "@mui/material"
import { DndContext,DragOverlay,DragEndEvent,useDroppable } from "@dnd-kit/core"
import React, { useEffect, useState } from "react"
import { usePage,useForm, router } from "@inertiajs/react"
import { TaskCard } from "./Card"
import CheckBoxIcon from "@mui/icons-material/CheckBox"
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank"
import { route } from "ziggy-js"
type ContainerProps={
    title:string;
    className?:string;
    tasks:Task[];
    OverId:any;
}
type MutipleContainerProp={
    titles:string[];
    className?:string;
}
type User={
    id:number
    name:string
}
type Project={
    id:number
    name:string
}
interface PageProps{
    project:Project
    tasks:Task[]
    users:User[]
    [key:string]:any
}

export default function MultipleContainers({titles,className}:MutipleContainerProp){
    const { tasks:data }=usePage<PageProps>().props;
    const [tasks,setTasks]=useState<Task[]>(data);
    const [activeId,setActiveId]=useState<any>();
    const [OverId,setOverId]=useState<any>(null);

    function handleDragEnd(event:DragEndEvent){
        const {over,active}=event;
        if(!over){
            setActiveId(null);
            return;
        }
        else if(titles.includes(over.id as string)){
            router.patch(route("task.statusupdate",{id:activeId,status:over.id}),{},{
                onSuccess:()=>{
                    setTasks(prev=>{
                        if(!prev) return prev;
                        const temp=[...prev];
                        const oldIndex=temp.findIndex(t=>t.id==active.id);
                        if(oldIndex==-1) return prev;
                        temp[oldIndex].status=over.id as string
                        setActiveId(null);
                        setOverId(null);
                        return temp;
                    })
                },
                onError:()=>{
                    setActiveId(null);
                    setOverId(null);
                }
            })
        }
        else{
            setTasks(prev=>{
                if(!prev) return prev;
                const temp=[...prev];
                const oldIndex=temp.findIndex(t=>t.id==active.id)
                const newIndex=temp.findIndex(t=>t.id==over.id);
                if(oldIndex==-1 || newIndex==-1) return prev;
                temp[oldIndex].status=temp[newIndex].status; 
                const [el]=temp.splice(oldIndex,1)
                temp.splice(newIndex+1,0,el)
                setActiveId(null);
                setOverId(null);
                return temp;
            })
        }
    }

    return(
            <DndContext onDragStart={e=>setActiveId(e.active.id)} onDragEnd={handleDragEnd} onDragMove={(e)=>{setOverId(e.over?.id)}}>
                <Box className={className}>
                    {titles.map((title,index)=>(
                        <Container OverId={OverId} title={title} key={index} tasks={(tasks || []).filter(t=>t.status===title) || []}/>
                    ))}
                </Box>
                <DragOverlay>
                {activeId &&
                    <TaskCard
                    task={tasks[tasks.findIndex(t=>t.id===activeId)]}
                    className="border-2 border-blue-400 rounded-2xl! opacity-60"
                />}
                </DragOverlay>
            </DndContext>
    )
}
const TopTitle=({title}:{title:string})=>{
    return(
        <Box className="flex items-center gap-5 justify-between bg-blue-400 p-3">
            <Box className="text-2xl capitalize">{title}</Box>
        </Box>
    );
}

function UserTagBox({users,assigned,assign}:{users:User[],assigned:number[],assign:any}) {
    const [selected,setSelected]=useState<User[]>([]);
    const handlSelectAll=(e:React.MouseEvent<HTMLButtonElement>)=>{
        e.stopPropagation()
        if(selected.length===users.length){ 
            setSelected([])
            assign('assigned_to',[])
        }
        else{
            setSelected(users)
            assign('assigned_to',users.map(u=>u.id))
        }
    }
    const CustomList=(props:any)=>{
        const {children,...other}=props
        return(
            <ul {...other}>
                <li>
                    <Button onClick={handlSelectAll}>{selected.length===users.length?"Deselect All":"Select All"}</Button>
                </li>
                {children}
            </ul>
        )
    }
    return (
        <Autocomplete
            options={users}
            getOptionLabel={(o)=>o.name}
            multiple
            value={selected}
            onChange={(e,values)=>{
                setSelected(values)
                assign('assigned_to',values.map(v=>v.id))
            }}
            renderOption={(props,options,{selected})=>{
                const {key,...OptionProps}=props
                return(
                    <li key={key} {...OptionProps}>
                        <Checkbox
                            sx={{marginRight:2}} 
                            checked={selected}
                            icon={<CheckBoxOutlineBlankIcon fontSize="small"/>}
                            checkedIcon={<CheckBoxIcon fontSize="small"/>}
                        />
                        {options.name}
                    </li>
                )
            }} 
            slots={{listbox:CustomList}}
            renderInput={(params)=>
                <TextField label="Assignee" margin="dense" {...params}/>
            }
        />
    );
}
function NewTask({open,setOpen}:{open:boolean,setOpen:any}){
    const { project,users}=usePage<PageProps>().props;
    const {data,setData,post,processing}=useForm({
        name:'',
        description:'',
        deadline:'',
        assigned_to:[],
        project_id:project.id
    });
    const submit=(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        post(route('task.store'))
        setOpen(false)
    }
    return(
        <Dialog open={open}>
            <DialogTitle>New Task</DialogTitle>
            <form onSubmit={submit}>
            <DialogContent sx={{display:'flex', flexDirection:"column"}}>
                <TextField
                    value={data.name}
                    label="Name"
                    margin="dense"
                    onChange={(e)=>setData('name',e.target.value)}
                />
                <TextField
                    type="datetime-local"
                    value={data.deadline}
                    margin="dense"
                    onChange={(e)=>setData('deadline',e.target.value)}
                />
                <UserTagBox users={users} assigned={data.assigned_to} assign={setData}/>
                <TextField
                    label="Description"
                    minRows={4}
                    value={data.description}
                    multiline
                    onChange={(e)=>setData('description',e.target.value)}
                    margin="dense"
                    fullWidth
                    slotProps={{
                        htmlInput:{
                            maxLength:100
                        },
                        input:{
                            endAdornment:(
                                <InputAdornment position="end" sx={{position:'absolute', bottom:10, right:10}}>
                                    {100-data.description.length}
                                </InputAdornment>
                            )
                        }
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={()=>setOpen(false)}>Cancel</Button>
                <Button variant="contained" type="submit" disabled={processing}>Create</Button>
            </DialogActions>
            </form>
        </Dialog>
    );
}
function Container({title,className,tasks,OverId}:ContainerProps){
    const {setNodeRef}=useDroppable({id:title});
    const [open,setOpen]=useState(false);
    return(
        <Stack spacing={2} className={`${className} flex rounded-2xl w-1/4 overflow-hidden border-2 border-blue-400 h-screen`}>
            <TopTitle title={title}/>
            <Box className="flex justify-center">{   
                title==="todo" &&
                <Button variant="outlined"  className="w-4/5" onClick={()=>setOpen(true)}>
                    <PlusIcon className="w-5 h-5"/>
                    <Box>Add Task</Box>
                </Button>
            }</Box>
            <Stack ref={setNodeRef} display={"flex"} flex={1} sx={{overflowY:"auto" }} minHeight={0}>
                <Cards OverId={OverId} tasks={tasks}/>
            </Stack>
            <NewTask open={open} setOpen={setOpen}/>
        </Stack>
    )
}