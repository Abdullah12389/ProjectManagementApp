"use client";

import { createContext, useContext } from "react";

export type CommentMessage = {
    id: number;
    content: string;
    user: {
        id: number;
        name: string;
    };
};

export type CommentsPageProps = {
    comments: CommentMessage[];
    task_id: number;
    description: string;
    name: string;
    user_id: number;
};

export const CommentsDataProvider = createContext<(CommentsPageProps & { reload: () => Promise<void> }) | undefined>(undefined);

export function useCommentsData() {
    const context = useContext(CommentsDataProvider);
    if (!context) {
        throw new Error("CommentsDataProvider not found");
    }
    return context;
}
