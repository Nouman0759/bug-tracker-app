import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { Loader } from "../../components/common/Loader";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import {
  useProject,
  useProjectMembers,
  useAddMember,
  useUpdateMemberRole,
  isProjectOwner,
} from "../../hooks/useProjects";
import { useAuth } from "../../hooks/useAuth";
import { userApi } from "../../services/api/userApi";
import { User } from "../../types/user";
import { ProjectsStackParamList } from "../../navigation/types";
import { colors, spacing, radius, typography } from "../../theme";

type Route = RouteProp<ProjectsStackParamList, "ProjectMembers">;

export function ProjectMembersScreen() {
  const { params } = useRoute<Route>();
  const { user } = useAuth();
  const { data: project } = useProject(params.projectId);
  const { data: members, isLoading, isError, error, refetch } = useProjectMembers(params.projectId);
  const { mutateAsync: addMember, isPending } = useAddMember(params.projectId);
  const { mutateAsync: updateRole, isPending: updatingRole } = useUpdateMemberRole(params.projectId);

  const isOwner = isProjectOwner(project, user);

  const [query, setQuery] = useState("");
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
    <ScreenContainer>
      <Text style={styles.sectionLabel}>Current Members</Text>
      <FlatList
        data={members?.filter((m) => m.user)}
        keyExtractor={(item) => item.user._id}
        renderItem={({ item }) => (
          <View style={styles.memberRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.memberName}>{item.user.name}</Text>
              <Text style={styles.memberEmail}>{item.user.email}</Text>
            </View>
            <Text style={[styles.roleBadge, item.role === "manager" && styles.roleBadgeManager]}>
              {item.role}
            </Text>
            {isOwner && (
              <Button
                title={item.role === "manager" ? "Make member" : "Make manager"}
                variant="ghost"
                loading={updatingRole}
                onPress={() =>
                  updateRole({
                    userId: item.user._id,
                    role: item.role === "manager" ? "member" : "manager",
                  })
                }
                style={styles.roleBtn}
              />
            )}
          </View>
        )}
        style={{ maxHeight: 260 }}
      />

      {isOwner ? (
        <>
          <Text style={styles.sectionLabel}>Add a Member</Text>
          <Text style={styles.hint}>Only the project owner can assign members to the team.</Text>
          <Input placeholder="Search by name or email..." value={query} onChangeText={handleSearch} />
          {searching ? <Text style={styles.hint}>Searching...</Text> : null}
          <FlatList
            data={results}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.resultRow}>
                <View>
                  <Text style={styles.memberName}>{item.name}</Text>
                  <Text style={styles.memberEmail}>{item.email}</Text>
                </View>
                <Button title="Add" onPress={() => handleAdd(item._id)} loading={isPending} style={styles.addBtn} />
              </View>
            )}
          />
        </>
      ) : (
        <Text style={styles.hint}>Only the project owner can add or manage team members.</Text>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  sectionLabel: { ...typography.caption, color: colors.textMuted, marginTop: spacing.lg, marginBottom: spacing.xs },
  hint: { ...typography.small, color: colors.textMuted, marginBottom: spacing.xs },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginBottom: spacing.xs,
    gap: spacing.xs,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginBottom: spacing.xs,
  },
  memberName: { ...typography.bodyBold, color: colors.text },
  memberEmail: { ...typography.small, color: colors.textMuted },
  addBtn: { paddingVertical: spacing.xs, paddingHorizontal: spacing.md },
  roleBtn: { paddingVertical: 4, paddingHorizontal: spacing.xs },
  roleBadge: {
    ...typography.small,
    color: colors.textMuted,
    textTransform: "capitalize",
    marginRight: spacing.xs,
  },
  roleBadgeManager: { color: colors.primary },
});
