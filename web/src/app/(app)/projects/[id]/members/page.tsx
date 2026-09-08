"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  useProject,
  useProjectMembers,
  useAddMember,
  useUpdateMemberRole,
  useRemoveMember,
  isProjectOwner,
} from "@/hooks/useProjects";
import { useAuth } from "@/context/AuthContext";
import { useDebounce } from "@/hooks/useDebounce";
import { userApi } from "@/lib/api/userApi";
import { User } from "@/types/user";
import { Loader, ErrorMessage } from "@/components/common/Feedback";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";

export default function ProjectMembersPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: project } = useProject(id);
  const { data: members, isLoading, isError, error, refetch } = useProjectMembers(id);
  const { mutateAsync: addMember, isPending: adding } = useAddMember(id);
  const { mutateAsync: updateRole, isPending: updatingRole } = useUpdateMemberRole(id);
  const { mutateAsync: removeMember, isPending: removing } = useRemoveMember(id);

  const owner = isProjectOwner(project, user);

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 350);
  const [results, setResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);

  async function handleSearch(text: string) {
    setQuery(text);
    if (text.trim().length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const users = await userApi.search(text.trim());
      setResults(users);
    } finally {
      setSearching(false);
    }
  }

  async function handleAdd(userId: string) {
    await addMember({ userId, role: "member" });
    setQuery("");
    setResults([]);
  }

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage message={(error as Error).message} onRetry={refetch} />;

  return (
    <div>
      <h1 className="mb-md text-h1 text-text">Team Members</h1>

      <p className="mb-xs text-caption text-text-muted">Current Members</p>
      <div className="mb-lg space-y-xs">
        {members
          ?.filter((m) => m.user)
          .map((m) => (
            <div
              key={m.user._id}
              className="flex items-center gap-xs rounded-sm bg-surface p-sm"
            >
              <div className="flex-1">
                <p className="text-bodyBold text-text">{m.user.name}</p>
                <p className="text-small text-text-muted">{m.user.email}</p>
              </div>
              <span
                className={`mr-xs text-small capitalize ${
                  m.role === "manager" ? "text-primary" : "text-text-muted"
                }`}
              >
                {m.role}
              </span>
              {owner && (
                <div className="flex gap-xs">
                  <Button
                    variant="ghost"
                    className="px-xs py-1 text-small"
                    loading={updatingRole}
                    onClick={() =>
                      updateRole({
                        userId: m.user._id,
                        role: m.role === "manager" ? "member" : "manager",
                      })
                    }
                  >
                    {m.role === "manager" ? "Make member" : "Make manager"}
                  </Button>
                  <Button
                    variant="ghost"
                    className="border-danger px-xs py-1 text-small text-danger"
                    loading={removing}
                    onClick={() => removeMember(m.user._id)}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          ))}
      </div>

      {owner ? (
        <>
          <p className="mb-xs text-caption text-text-muted">Add a Member</p>
          <p className="mb-xs text-small text-text-muted">
            Only the project owner can assign members to the team.
          </p>
          <Input
            placeholder="Search by name or email..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searching ? <p className="mb-xs text-small text-text-muted">Searching...</p> : null}
          <div className="space-y-xs">
            {results.map((r) => (
              <div
                key={r._id}
                className="flex items-center justify-between rounded-sm bg-surface p-sm"
              >
                <div>
                  <p className="text-bodyBold text-text">{r.name}</p>
                  <p className="text-small text-text-muted">{r.email}</p>
                </div>
                <Button
                  className="px-md py-1 text-small"
                  loading={adding}
                  onClick={() => handleAdd(r._id)}
                >
                  Add
                </Button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-small text-text-muted">
          Only the project owner can add or manage team members.
        </p>
      )}
    </div>
  );
}
