"use client";

import clsx from "@/lib/clsx";
import { IssueStatus, IssuePriority } from "@/types/issue";

const STATUSES: IssueStatus[] = ["open", "in_progress", "resolved", "closed", "reopened"];
const PRIORITIES: IssuePriority[] = ["low", "medium", "high", "critical"];

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "whitespace-nowrap rounded-full border px-md py-xs text-caption capitalize",
        active
          ? "border-primary bg-primary text-white"
          : "border-border bg-surface text-text-muted hover:bg-surfaceLight"
      )}
    >
      {label}
    </button>
  );
}

export function IssueSearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-sm flex items-center gap-sm rounded-md border border-border bg-surface px-md py-sm">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6E6A8C" strokeWidth="2">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search issues..."
        className="w-full bg-transparent text-body text-text outline-none"
      />
    </div>
  );
}

export function IssueFilters({
  status,
  priority,
  onChangeStatus,
  onChangePriority,
}: {
  status?: IssueStatus;
  priority?: IssuePriority;
  onChangeStatus: (s?: IssueStatus) => void;
  onChangePriority: (p?: IssuePriority) => void;
}) {
  return (
    <div className="mb-sm space-y-xs">
      <div className="flex gap-sm overflow-x-auto pb-xs">
        <Chip label="All statuses" active={!status} onClick={() => onChangeStatus(undefined)} />
        {STATUSES.map((s) => (
          <Chip
            key={s}
            label={s.replace("_", " ")}
            active={status === s}
            onClick={() => onChangeStatus(s)}
          />
        ))}
      </div>
      <div className="flex gap-sm overflow-x-auto pb-xs">
        <Chip label="All priorities" active={!priority} onClick={() => onChangePriority(undefined)} />
        {PRIORITIES.map((p) => (
          <Chip key={p} label={p} active={priority === p} onClick={() => onChangePriority(p)} />
        ))}
      </div>
    </div>
  );
}
