"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import clsx from "@/lib/clsx";
import { Input, Textarea } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { ScreenshotPicker } from "@/components/issues/ScreenshotPicker";
import { useCreateIssue } from "@/hooks/useIssues";
import { useProjects } from "@/hooks/useProjects";
import { IssuePriority } from "@/types/issue";
import { Loader } from "@/components/common/Feedback";

const PRIORITIES: IssuePriority[] = ["low", "medium", "high", "critical"];

export default function CreateIssuePage() {
  return (
    <Suspense fallback={<Loader />}>
      <CreateIssuePageInner />
    </Suspense>
  );
}

function CreateIssuePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetProjectId = searchParams.get("projectId") || "";

  const { data: projects } = useProjects();
  const { mutateAsync: createIssue, isPending } = useCreateIssue();

  const [projectId, setProjectId] = useState(presetProjectId);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<IssuePriority>("medium");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");

  const effectiveProjectId = projectId || projects?.[0]?._id || "";
  const [uploading, setUploading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!effectiveProjectId) {
      setError("Please select a project");
      return;
    }
    if (title.trim().length < 3) {
      setError("Title must be at least 3 characters");
      return;
    }
    if (!description.trim()) {
      setError("Description is required");
      return;
    }
    setError("");

    const issue = await createIssue({
      project: effectiveProjectId,
      title: title.trim(),
      description: description.trim(),
      priority,
    });

    if (files.length > 0) {
      setUploading(true);
      try {
        const { issueApi } = await import("@/lib/api/issueApi");
        await issueApi.uploadScreenshots(issue._id, files);
      } finally {
        setUploading(false);
      }
    }

    router.replace(`/issues/${issue._id}`);
  }

  return (
    <div>
      <h1 className="mb-md text-h1 text-text">Report New Issue</h1>
      <form onSubmit={handleSubmit}>
        {!presetProjectId && projects && projects.length > 0 && (
          <div className="mb-md">
            <p className="mb-xs text-caption text-text-muted">Project</p>
            <div className="flex flex-wrap gap-sm">
              {projects.map((p) => (
                <button
                  key={p._id}
                  type="button"
                  onClick={() => setProjectId(p._id)}
                  className={clsx(
                    "rounded-full border px-md py-xs text-caption",
                    (projectId || projects[0]._id) === p._id
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-surface text-text-muted"
                  )}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Short summary of the bug" />
        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Steps to reproduce, expected vs actual behavior..."
          rows={5}
        />

        <p className="mb-xs text-caption text-text-muted">Priority</p>
        <div className="mb-md flex flex-wrap gap-sm">
          {PRIORITIES.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={clsx(
                "rounded-full border px-md py-xs text-caption capitalize",
                priority === p
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-surface text-text-muted"
              )}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="mb-md">
          <ScreenshotPicker files={files} onChange={setFiles} />
        </div>

        {error ? <p className="mb-sm text-caption text-danger">{error}</p> : null}

        <Button type="submit" loading={isPending || uploading} className="mb-xl mt-sm">
          Create Issue
        </Button>
      </form>
    </div>
  );
}
