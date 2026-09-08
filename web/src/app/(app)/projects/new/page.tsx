"use client";

import { useRouter } from "next/navigation";
import { ProjectForm } from "@/components/projects/ProjectComponents";
import { useCreateProject } from "@/hooks/useProjects";

export default function CreateProjectPage() {
  const router = useRouter();
  const { mutateAsync, isPending } = useCreateProject();

  async function handleSubmit(values: { name: string; description: string }) {
    const project = await mutateAsync(values);
    router.replace(`/projects/${project._id}`);
  }

  return (
    <div>
      <h1 className="mb-md text-h1 text-text">New Project</h1>
      <ProjectForm onSubmit={handleSubmit} loading={isPending} />
    </div>
  );
}
