"use client";

import React, { createContext, useContext } from "react";
import { Task } from "./Card";

export type KanbanUser = {
    id: number;
    name: string;
};

export type KanbanProject = {
    id: number;
    name: string;
};

export type KanbanPageProps = {
    project: KanbanProject;
    tasks: Task[];
    users: KanbanUser[];
};

export const KanbanDataProvider = createContext<(KanbanPageProps & { reload: () => Promise<void> }) | undefined>(undefined);

export function useKanbanData() {
    const context = useContext(KanbanDataProvider);
    if (!context) {
        throw new Error("KanbanDataProvider not found");
    }
    return context;
}
