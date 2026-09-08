"use client";

import { useState } from "react";
import { Comment } from "@/types/comment";
import { useAuth } from "@/context/AuthContext";
import { Button } from "../common/Button";

export function CommentItem({
  comment,
  onEdit,
  onDelete,
}: {
  comment: Comment;
  onEdit: (text: string) => void;
  onDelete: () => void;
}) {
  const { user } = useAuth();
  const isAuthor = user?._id === comment.user._id;
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(comment.text);

  return (
    <div className="mb-sm rounded-md border border-border bg-surface p-sm shadow-subtle">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-bodyBold text-text">{comment.user.name}</span>
        <span className="text-small text-text-muted">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
      </div>
      {editing ? (
        <div className="space-y-xs">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full rounded-md border border-border bg-surface p-xs text-body text-text outline-none focus:border-primary"
            rows={2}
          />
          <div className="flex gap-xs">
            <Button
              variant="primary"
              className="px-sm py-1 text-small"
              onClick={() => {
                if (text.trim()) onEdit(text.trim());
                setEditing(false);
              }}
            >
              Save
            </Button>
            <Button variant="ghost" className="px-sm py-1 text-small" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-body text-text">{comment.text}</p>
      )}
      {isAuthor && !editing && (
        <div className="mt-xs flex gap-md">
          <button className="text-small text-primary" onClick={() => setEditing(true)}>
            Edit
          </button>
          <button className="text-small text-danger" onClick={onDelete}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export function CommentInput({
  onSubmit,
  loading,
}: {
  onSubmit: (text: string) => void;
  loading?: boolean;
}) {
  const [text, setText] = useState("");

  function handleSubmit() {
    if (!text.trim()) return;
    onSubmit(text.trim());
    setText("");
  }

  return (
    <div className="flex items-end gap-sm">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
        rows={1}
        className="max-h-[100px] flex-1 rounded-md border border-border bg-surface px-md py-sm text-body text-text outline-none focus:border-primary"
      />
      <Button onClick={handleSubmit} loading={loading} className="px-md">
        Post
      </Button>
    </div>
  );
}
