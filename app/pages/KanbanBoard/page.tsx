"use client";

import MainPage from "./MainPage";
import { useApiResource } from "@/app/lib/api";
import { KanbanDataProvider, KanbanPageProps } from "./KanbanData";

export default function Home({ projectId }: { projectId: string }) {
    const { data, loading, reload } = useApiResource<KanbanPageProps>(`/project/${projectId}`, {
        project: { id: Number(projectId), name: "" },
        tasks: [],
        users: [],
    });

    if (loading) return <div className="p-8">Loading board...</div>;

    return (
        <KanbanDataProvider.Provider value={{ ...data, reload }}>
            <div className="flex flex-col gap-5 w-screen h-screen">
                <MainPage />
            </div>
        </KanbanDataProvider.Provider>
    );
}
