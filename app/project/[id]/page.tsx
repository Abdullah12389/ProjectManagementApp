import KanbanPage from "@/app/pages/KanbanBoard/page";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <KanbanPage projectId={id} />;
}
