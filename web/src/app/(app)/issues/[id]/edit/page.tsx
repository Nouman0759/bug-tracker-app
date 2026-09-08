"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import clsx from "@/lib/clsx";
import { Input, Textarea } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { Loader } from "@/components/common/Feedback";
import { useIssue, useUpdateIssue } from "@/hooks/useIssues";
import { IssuePriority } from "@/types/issue";

const PRIORITIES: IssuePriority[] = ["low", "medium", "high", "critical"];

export default function EditIssuePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: issue, isLoading } = useIssue(id);
  const { mutateAsync: updateIssue, isPending: saving } = useUpdateIssue(id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<IssuePriority>("medium");
  const [error, setError] = useState("");

  useEffect(() => {
    if (issue) {
      setTitle(issue.title);
      setDescription(issue.description);
      setPriority(issue.priority);
    }
  }, [issue]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (title.trim().length < 3) {
      setError("Title must be at least 3 characters");
      return;
    }
    setError("");
    try {
      await updateIssue({ title: title.trim(), description: description.trim(), priority });
      router.back();
    } catch (err: any) {
      setError(err.message || "Failed to save changes");
    }
  }

  if (isLoading || !issue) return <Loader />;

  return (
    <div>
      <h1 className="mb-md text-h1 text-text">Edit Issue</h1>
      <form onSubmit={handleSubmit}>
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
        {error ? <p className="mb-sm text-caption text-danger">{error}</p> : null}
        <Button type="submit" loading={saving} className="mt-md">
          Save Changes
        </Button>
      </form>
    </div>
  );
}
