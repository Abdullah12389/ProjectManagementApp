"use client"
import { ChatBubbleLeftIcon } from "@heroicons/react/24/solid";
import { Paper,Stack,Typography,Box } from "@mui/material" 
import { useEffect, useRef } from "react";
type Message={
    id:number;
    content:string;
    user:{ id:number; name:string };
}

function ChatBubble({text,name,isYours}:{text:string,name:string,isYours:boolean}){
    return(
        <Box display={"flex"} width={"100%"} justifyContent={isYours?"flex-end":"flex-start"}>
            <Paper sx={{maxWidth:"40vh", borderRadius:"0 10px 10px 10px", padding:2, backgroundColor:isYours?"blue":""}}>
                <Typography fontSize={"15px"} fontWeight={900} color="green" sx={{textDecoration:"underline"}}>{name}</Typography>
                <Typography variant="h6">
                    {text}
                </Typography>
            </Paper>
        </Box>
    )   
}
export default function CommentBox({messages}:{messages:Message[]}){
    const lastref=useRef<HTMLDivElement>(null);
    useEffect(()=>{
        lastref.current?.scrollIntoView();
    },[messages])
    return(
        <Stack gap={5}>
            <Box display={"flex"} gap={2}>
                <ChatBubbleLeftIcon className="w-10 h-10"/>
                <Typography variant="h5">Comments</Typography>
            </Box>
            {messages.map((message,index)=>(
                <ChatBubble key={index} text={message.content} name={message.user.name} isYours={message.user.name==="You"}/>
            ))}
            <div ref={lastref}/>
        </Stack>
    )
}
