"use client";

import { TextField, Box, IconButton } from "@mui/material";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { api } from "@/app/lib/api";
import { useCommentsData } from "./CommentsData";

export default function MessageBox() {
    const { task_id, reload } = useCommentsData();
    const [processing, setProcessing] = useState(false);
    const [data, setData] = useState({ content: "", task_id });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProcessing(true);
        api.post("/comment", data)
            .then(async () => {
                setData({ content: "", task_id });
                await reload();
            })
            .finally(() => setProcessing(false));
    };

    return (
        <form onSubmit={submit}>
            <Box position="fixed" bottom={20} left={20} right={20} display="flex" justifyContent="center">
                <TextField
                    value={data.content}
                    onChange={(e) => setData((prev) => ({ ...prev, content: e.target.value }))}
                    sx={{ width: "80%" }}
                    placeholder="Type Your comment..."
                    disabled={processing}
                />
                <IconButton type="submit" disabled={processing}>
                    <ArrowRightIcon className="w-10 h-10" />
                </IconButton>
            </Box>
        </form>
    );
}
