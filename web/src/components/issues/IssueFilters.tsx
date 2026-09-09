"use client";

import clsx from "@/lib/clsx";
import { IssueStatus, IssuePriority } from "@/types/issue";

const STATUSES: IssueStatus[] = ["open", "in_progress", "resolved", "closed", "reopened"];
const PRIORITIES: IssuePriority[] = ["low", "medium", "high", "critical"];

export function IssueSearchBar({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "flex items-center gap-sm rounded-md border border-border bg-surface px-md py-sm md:w-72",
        className
      )}
    >
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

function Select<T extends string>({
  value,
  onChange,
  options,
  placeholder,
  format,
}: {
  value?: T;
  onChange: (v?: T) => void;
  options: T[];
  placeholder: string;
  format?: (v: T) => string;
}) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange((e.target.value || undefined) as T | undefined)}
      className="rounded-md border border-border bg-surface px-md py-sm text-caption capitalize text-text outline-none focus:border-primary"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {format ? format(o) : o}
        </option>
      ))}
    </select>
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
    <div className="flex gap-sm">
      <Select
        value={status}
        onChange={onChangeStatus}
        options={STATUSES}
        placeholder="All statuses"
        format={(s) => s.replace("_", " ")}
      />
      <Select value={priority} onChange={onChangePriority} options={PRIORITIES} placeholder="All priorities" />
    </div>
  );
}