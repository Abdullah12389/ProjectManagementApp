import ProjectsPage from "@/app/pages/Projects/page";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProjectsPage workspaceId={id} />;
}
