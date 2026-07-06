import { Typography,Divider,Box } from "@mui/material";
import MainPage from "../Projects/PageHolder";
import { DocumentTextIcon } from "@heroicons/react/24/solid";
import CommentBox from "./MessageCard";
import MessageBox from "./MesssageBox";
import { usePage } from "@inertiajs/react";
type Message={
    senderName:string;
    isSender:boolean;
    text:string;
}
export default function Comments(){
    const {name,comments,description}=usePage().props
    console.log(comments)
    return(
        <MainPage>
            <Box display={"flex"} gap={5} ml={5} mr={5} flexDirection={"column"} maxHeight={"72vh"} sx={{overflowY:"scroll"}}>
                <Typography variant="h3">{name}</Typography>
                <Divider/>
                <Box display={"flex"} gap={2} alignItems={"center"}>
                    <DocumentTextIcon className="w-10 h-10"/>
                    <Typography variant="h5">Description</Typography>
                </Box>
                <Typography variant="body1">{description}</Typography>
                <Divider/>
                <CommentBox messages={comments}/>
            </Box>
            <MessageBox/>
        </MainPage>
    );
}