import CommentsPage from "@/app/pages/Comments/page";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CommentsPage taskId={id} />;
}
