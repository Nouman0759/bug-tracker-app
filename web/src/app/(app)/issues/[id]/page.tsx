"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import clsx from "@/lib/clsx";
import {
  useIssue,
  useComments,
  useAddComment,
  useUpdateComment,
  useDeleteComment,
  useUpdateIssueStatus,
  useUpdateIssuePriority,
  useAssignIssue,
} from "@/hooks/useIssues";
import { useProject, isProjectManager } from "@/hooks/useProjects";
import { useAuth } from "@/context/AuthContext";
import { Loader, ErrorMessage } from "@/components/common/Feedback";
import { Button } from "@/components/common/Button";
import { IssueStatusBadge, PriorityBadge } from "@/components/issues/Badges";
import { CommentItem, CommentInput } from "@/components/issues/Comments";
import { IssueStatus, IssuePriority } from "@/types/issue";

const STATUSES: IssueStatus[] = ["open", "in_progress", "resolved", "closed", "reopened"];
const PRIORITIES: IssuePriority[] = ["low", "medium", "high", "critical"];

export default function IssueDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const { data: issue, isLoading, isError, error, refetch } = useIssue(id);
  const { data: comments, isLoading: commentsLoading } = useComments(id);
  const { mutateAsync: addComment, isPending: postingComment } = useAddComment(id);
  const { mutateAsync: editComment } = useUpdateComment(id);
  const { mutateAsync: removeComment } = useDeleteComment(id);
  const { mutateAsync: setStatus } = useUpdateIssueStatus(id);
  const { mutateAsync: setPriority } = useUpdateIssuePriority(id);
  const { mutateAsync: setAssignee, isPending: assigning } = useAssignIssue(id);

  const projectId = issue ? (typeof issue.project === "string" ? issue.project : issue.project._id) : "";
  const { data: project } = useProject(projectId);

  // Only the project owner or a project manager may open/close issues or
  // assign issues to team members - mirrors mobile's isProjectManager gate.
  const canManageIssue = isProjectManager(project, user);

  const [statusPickerOpen, setStatusPickerOpen] = useState(false);
  const [priorityPickerOpen, setPriorityPickerOpen] = useState(false);
  const [assignPickerOpen, setAssignPickerOpen] = useState(false);

  if (isLoading) return <Loader />;
  if (isError || !issue)
    return <ErrorMessage message={(error as Error)?.message || "Not found"} onRetry={refetch} />;

  return (
    <div>
      <h1 className="mb-sm text-h2 text-text">{issue.title}</h1>

      <div className="mb-sm flex gap-sm">
        <button onClick={() => canManageIssue && setStatusPickerOpen((v) => !v)}>
          <IssueStatusBadge status={issue.status} />
        </button>
        <button onClick={() => setPriorityPickerOpen((v) => !v)}>
          <PriorityBadge priority={issue.priority} />
        </button>
      </div>
      {!canManageIssue && (
        <p className="mb-sm text-small text-text-muted">
          Only the project owner or a project manager can open/close this issue.
        </p>
      )}

      {statusPickerOpen && canManageIssue && (
        <div className="mb-sm flex flex-wrap gap-xs">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatus(s);
                setStatusPickerOpen(false);
              }}
              className="rounded-full bg-surfaceLight px-sm py-1 text-small capitalize text-text"
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
      )}
      {priorityPickerOpen && (
        <div className="mb-sm flex flex-wrap gap-xs">
          {PRIORITIES.map((p) => (
            <button
              key={p}
              onClick={() => {
                setPriority(p);
                setPriorityPickerOpen(false);
              }}
              className="rounded-full bg-surfaceLight px-sm py-1 text-small capitalize text-text"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <p className="mt-sm whitespace-pre-wrap text-body text-text">{issue.description}</p>

      {issue.screenshots.length > 0 && (
        <div className="my-md flex gap-sm overflow-x-auto">
          {issue.screenshots.map((url) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={url}
              src={url}
              alt="Screenshot"
              className="h-[120px] w-[160px] shrink-0 rounded-md object-cover"
            />
          ))}
        </div>
      )}

      <div className="mt-sm flex justify-between">
        <span className="text-caption text-text-muted">Reported by</span>
        <span className="text-caption text-text">{issue.createdBy.name}</span>
      </div>
      <div className="mt-sm flex justify-between">
        <span className="text-caption text-text-muted">Assigned to</span>
        {canManageIssue ? (
          <button
            className="text-caption text-primary underline"
            onClick={() => setAssignPickerOpen((v) => !v)}
          >
            {issue.assignedTo?.name || "Unassigned"}
          </button>
        ) : (
          <span className="text-caption text-text">{issue.assignedTo?.name || "Unassigned"}</span>
        )}
      </div>

      {assignPickerOpen && canManageIssue && (
        <div className="mb-sm mt-xs flex flex-wrap gap-xs">
          <button
            disabled={assigning}
            onClick={() => {
              setAssignee(null);
              setAssignPickerOpen(false);
            }}
            className="rounded-full bg-surfaceLight px-sm py-1 text-small text-text"
          >
            Unassigned
          </button>
          {project?.members
            .filter((m) => m.user)
            .map((m) => (
              <button
                key={m.user._id}
                disabled={assigning}
                onClick={() => {
                  setAssignee(m.user._id);
                  setAssignPickerOpen(false);
                }}
                className="rounded-full bg-surfaceLight px-sm py-1 text-small text-text"
              >
                {m.user.name}
              </button>
            ))}
        </div>
      )}

      <div className="my-md flex gap-sm">
        <Link href={`/issues/${issue._id}/edit`} className="flex-1">
          <Button variant="secondary" fullWidth>
            Edit
          </Button>
        </Link>
        <Link href={`/issues/${issue._id}/history`} className="flex-1">
          <Button variant="ghost" fullWidth>
            History
          </Button>
        </Link>
      </div>

      <h2 className="mb-sm mt-lg text-h3 text-text">Comments</h2>
      {commentsLoading ? (
        <Loader />
      ) : (
        comments?.map((c) => (
          <CommentItem
            key={c._id}
            comment={c}
            onEdit={(text) => editComment({ commentId: c._id, text })}
            onDelete={() => removeComment(c._id)}
          />
        ))
      )}
      <CommentInput onSubmit={(text) => addComment(text)} loading={postingComment} />
    </div>
  );
}
