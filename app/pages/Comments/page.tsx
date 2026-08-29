"use client";

import { Typography, Divider, Box } from "@mui/material";
import MainPage from "../Projects/PageHolder";
import { DocumentTextIcon } from "@heroicons/react/24/solid";
import CommentBox from "./MessageCard";
import MessageBox from "./MesssageBox";
import { useApiResource } from "@/app/lib/api";
import { CommentsDataProvider, CommentsPageProps } from "./CommentsData";

export default function Comments({ taskId }: { taskId: string }) {
    const { data, loading, reload } = useApiResource<CommentsPageProps>(`/task/${taskId}`, {
        comments: [],
        task_id: Number(taskId),
        description: "",
        name: "",
        user_id: 0,
    });

    if (loading) return <MainPage><Box padding={4}>Loading comments...</Box></MainPage>;

    return (
        <CommentsDataProvider.Provider value={{ ...data, reload }}>
            <MainPage>
                <Box display="flex" gap={5} ml={5} mr={5} flexDirection="column" maxHeight="72vh" sx={{ overflowY: "scroll" }}>
                    <Typography variant="h3">{data.name}</Typography>
                    <Divider />
                    <Box display="flex" gap={2} alignItems="center">
                        <DocumentTextIcon className="w-10 h-10" />
                        <Typography variant="h5">Description</Typography>
                    </Box>
                    <Typography variant="body1">{data.description}</Typography>
                    <Divider />
                    <CommentBox messages={data.comments} />
                </Box>
                <MessageBox />
            </MainPage>
        </CommentsDataProvider.Provider>
    );
}
