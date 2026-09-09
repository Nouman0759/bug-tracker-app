"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
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
import { Menu, MenuItem } from "@/components/common/Menu";
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

  const canManageIssue = isProjectManager(project, user);

  if (isLoading) return <Loader />;
  if (isError || !issue)
    return <ErrorMessage message={(error as Error)?.message || "Not found"} onRetry={refetch} />;

  return (
    <div className="grid grid-cols-1 gap-xl lg:grid-cols-[1fr_360px]">
      <div>
        <div className="mb-sm flex items-start justify-between gap-md">
          <h1 className="text-h2 text-text">{issue.title}</h1>
          <div className="flex gap-sm">
            <Link href={`/issues/${issue._id}/edit`}>
              <Button variant="secondary">Edit</Button>
            </Link>
            <Link href={`/issues/${issue._id}/history`}>
              <Button variant="ghost">History</Button>
            </Link>
          </div>
        </div>

        <div className="mb-sm flex flex-wrap gap-sm">
          <Menu
            trigger={({ toggle }) => (
              <button onClick={() => canManageIssue && toggle()} disabled={!canManageIssue}>
                <IssueStatusBadge status={issue.status} />
              </button>
            )}
          >
            {(close) =>
              STATUSES.map((s) => (
                <MenuItem
                  key={s}
                  onClick={() => {
                    setStatus(s);
                    close();
                  }}
                >
                  {s.replace("_", " ")}
                </MenuItem>
              ))
            }
          </Menu>

          <Menu
            trigger={({ toggle }) => (
              <button onClick={toggle}>
                <PriorityBadge priority={issue.priority} />
              </button>
            )}
          >
            {(close) =>
              PRIORITIES.map((p) => (
                <MenuItem
                  key={p}
                  onClick={() => {
                    setPriority(p);
                    close();
                  }}
                >
                  {p}
                </MenuItem>
              ))
            }
          </Menu>
        </div>
        {!canManageIssue && (
          <p className="mb-sm text-small text-text-muted">
            Only the project owner or a project manager can open/close this issue.
          </p>
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

        <div className="mt-lg rounded-md border border-border bg-surface p-md">
          <div className="flex items-center justify-between border-b border-border pb-sm">
            <span className="text-caption text-text-muted">Reported by</span>
            <span className="text-caption text-text">{issue.createdBy.name}</span>
          </div>
          <div className="mt-sm flex items-center justify-between">
            <span className="text-caption text-text-muted">Assigned to</span>
            {canManageIssue ? (
              <Menu
                align="right"
                trigger={({ toggle }) => (
                  <button className="text-caption text-primary underline" onClick={toggle}>
                    {issue.assignedTo?.name || "Unassigned"}
                  </button>
                )}
              >
                {(close) => (
                  <>
                    <MenuItem
                      disabled={assigning}
                      onClick={() => {
                        setAssignee(null);
                        close();
                      }}
                    >
                      Unassigned
                    </MenuItem>
                    {project?.members
                      .filter((m) => m.user)
                      .map((m) => (
                        <MenuItem
                          key={m.user._id}
                          disabled={assigning}
                          onClick={() => {
                            setAssignee(m.user._id);
                            close();
                          }}
                        >
                          {m.user.name}
                        </MenuItem>
                      ))}
                  </>
                )}
              </Menu>
            ) : (
              <span className="text-caption text-text">{issue.assignedTo?.name || "Unassigned"}</span>
            )}
          </div>
        </div>
      </div>

      <div className="lg:border-l lg:border-border lg:pl-xl">
        <h2 className="mb-sm text-h3 text-text">Comments</h2>
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
    </div>
  );
}