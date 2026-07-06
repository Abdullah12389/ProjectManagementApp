//@ts-nocheck
import { TextField,Box,IconButton,InputAdornment } from "@mui/material"
import { router, useForm, usePage } from "@inertiajs/react";
import { ArrowRightIcon } from "@heroicons/react/24/solid"
import { route } from "ziggy-js";
export default function MessageBox(){
    const {task_id,userid}=usePage().props;
    const {data,setData,processing,post}=useForm({
        content:'',
        user_id:userid,
        task_id:task_id
    })
    const submit=(e)=>{
        e.preventDefault()
        post(route('comment.store'),{
            onSuccess:()=>{
                setData('content','')
            }
        })
    } 
    return(
        <form onSubmit={submit}>
            <Box position={"fixed"} bottom={20} left={20} right={20} display={"flex"} justifyContent={"center"}>
                    <TextField
                        value={data.content}
                        onChange={(e)=>setData('content',e.target.value)}
                        sx={{width:"80%"}}
                        placeholder="Type Your comment..."
                    />     
                    <IconButton type="submit">
                        <ArrowRightIcon className="w-10 h-10"/>    
                    </IconButton>  
            </Box>
        </form> 
    );
}