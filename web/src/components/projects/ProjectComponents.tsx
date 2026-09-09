"use client";

import { useState } from "react";
import Link from "next/link";
import { Project } from "@/types/project";
import { Input, Textarea } from "../common/Input";
import { Button } from "../common/Button";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project._id}`}
      className="block rounded-md border border-border bg-surface p-md shadow-card transition-all hover:-translate-y-0.5 hover:shadow-raised focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="flex items-center justify-between">
        <p className="truncate text-h3 text-text">{project.name}</p>
        <span className="text-text-muted">›</span>
      </div>
      {project.description ? (
        <p className="mt-1 line-clamp-2 text-caption text-text-muted">{project.description}</p>
      ) : null}
      <div className="mt-sm flex items-center gap-1 text-small text-text-muted">
        <span>{project.members.length} members</span>
      </div>
    </Link>
  );
}

export function ProjectForm({
  initialName = "",
  initialDescription = "",
  onSubmit,
  loading,
  submitLabel = "Create Project",
}: {
  initialName?: string;
  initialDescription?: string;
  onSubmit: (values: { name: string; description: string }) => void;
  loading?: boolean;
  submitLabel?: string;
}) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Project name is required");
      return;
    }
    setError("");
    onSubmit({ name: name.trim(), description: description.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg">
      <Input
        label="Project Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={error}
        placeholder="e.g. Mobile App v2"
      />
      <Textarea
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="What's this project about?"
        rows={3}
      />
      <Button type="submit" loading={loading} className="mt-sm">
        {submitLabel}
      </Button>
    </form>
  );
}