"use client";

import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import { Drawer, Box, Typography } from "@mui/material";
import { Bars3Icon } from "@heroicons/react/16/solid";
import React, { useEffect, useState } from "react";
import { api, visit } from "@/app/lib/api";
import { BeakerIcon, UserGroupIcon } from "@heroicons/react/16/solid";

export type Dictionary = {
    [key: string]: string[];
};

type Project = {
    id: number;
    name: string;
};

type WorkSpace = {
    id: number;
    name: string;
    projects?: Project[];
    project?: Project[];
};

type SideBarData = {
    workspace: WorkSpace[];
};

export default function SideBar({ show, setView }: { data: Dictionary; show: any; setView: any; icons: any }) {
    const [sidebarData, setSidebarData] = useState<SideBarData>({ workspace: [] });

    useEffect(() => {
        if (show) {
            void api.get<SideBarData>("/sidebar").then((response) => setSidebarData(response.data));
        }
    }, [show]);

    return (
        <Box>
            <Drawer
                open={show}
                onClose={() => setView(false)}
                slotProps={{ paper: { className: "w-1/4" } }}
            >
                <SimpleTreeView>
                    <Box className="flex w-full items-center justify-between mt-10 mb-10">
                        <Bars3Icon className="w-7 h-7 ml-7" onClick={() => setView(false)} />
                    </Box>
                    <Typography variant="h6" sx={{ marginLeft: 2 }} onClick={() => visit("/workspace")}>WorkSpaces</Typography>
                    {sidebarData.workspace.map((workspace, index) => (
                        <TreeItem
                            key={workspace.id}
                            itemId={`${index}`}
                            slotProps={{
                                label: {
                                    children: (
                                        <Box className="flex items-center" onClick={() => visit(`/workspace/${workspace.id}`)}>
                                            <UserGroupIcon className="w-5 h-5" />
                                            <Typography>{workspace.name}</Typography>
                                        </Box>
                                    ),
                                },
                            }}
                        >
                            {(workspace.projects || workspace.project || []).map((project, i) => (
                                <TreeItem
                                    key={project.id}
                                    itemId={`${index}+${i}`}
                                    onClick={() => visit(`/project/${project.id}`)}
                                    slotProps={{
                                        label: {
                                            children: (
                                                <Box className="flex items-center">
                                                    <BeakerIcon className="w-5 h-5" />
                                                    <Typography>{project.name}</Typography>
                                                </Box>
                                            ),
                                        },
                                    }}
                                />
                            ))}
                        </TreeItem>
                    ))}
                </SimpleTreeView>
            </Drawer>
        </Box>
    );
}
