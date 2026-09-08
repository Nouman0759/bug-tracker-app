import React, { useState } from "react";
import { ScrollView, View, Text, StyleSheet, Image, Pressable } from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { Loader } from "../../components/common/Loader";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { Button } from "../../components/common/Button";
import { PriorityBadge } from "../../components/issues/PriorityBadge";
import { IssueStatusBadge } from "../../components/issues/IssueStatusBadge";
import { CommentItem } from "../../components/issues/CommentItem";
import { CommentInput } from "../../components/issues/CommentInput";
import {
  useIssue,
  useComments,
  useAddComment,
  useUpdateIssueStatus,
  useUpdateIssuePriority,
  useAssignIssue,
} from "../../hooks/useIssues";
import { useProject, isProjectManager } from "../../hooks/useProjects";
import { useAuth } from "../../hooks/useAuth";
import { IssuesStackParamList } from "../../navigation/types";
import { IssueStatus, IssuePriority } from "../../types/issue";
import { colors, spacing, radius, typography } from "../../theme";

type Route = RouteProp<IssuesStackParamList, "IssueDetails">;

const STATUSES: IssueStatus[] = ["open", "in_progress", "resolved", "closed", "reopened"];
const PRIORITIES: IssuePriority[] = ["low", "medium", "high", "critical"];

export function IssueDetailsScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<NativeStackNavigationProp<IssuesStackParamList>>();
  const { user } = useAuth();

  const { data: issue, isLoading, isError, error, refetch } = useIssue(params.issueId);
  const { data: comments, isLoading: commentsLoading } = useComments(params.issueId);
  const { mutateAsync: addComment, isPending: postingComment } = useAddComment(params.issueId);
  const { mutateAsync: setStatus } = useUpdateIssueStatus(params.issueId);
  const { mutateAsync: setPriority } = useUpdateIssuePriority(params.issueId);
  const { mutateAsync: setAssignee, isPending: assigning } = useAssignIssue(params.issueId);

  const projectId = issue ? (typeof issue.project === "string" ? issue.project : issue.project._id) : "";
  const { data: project } = useProject(projectId);

  // Only the project owner or a project manager may open/close issues
  // or assign issues to team members.
  const canManageIssue = isProjectManager(project, user);

  const [statusPickerOpen, setStatusPickerOpen] = useState(false);
  const [priorityPickerOpen, setPriorityPickerOpen] = useState(false);
  const [assignPickerOpen, setAssignPickerOpen] = useState(false);

  if (isLoading) return <Loader />;
  if (isError || !issue) return <ErrorMessage message={(error as Error)?.message || "Not found"} onRetry={refetch} />;

  return (
    <ScreenContainer>
      <ScrollView>
        <Text style={styles.title}>{issue.title}</Text>

        <View style={styles.badgeRow}>
          <Pressable onPress={() => canManageIssue && setStatusPickerOpen((v) => !v)}>
            <IssueStatusBadge status={issue.status} />
          </Pressable>
          <Pressable onPress={() => setPriorityPickerOpen((v) => !v)}>
            <PriorityBadge priority={issue.priority} />
          </Pressable>
        </View>
        {!canManageIssue && (
          <Text style={styles.hint}>Only the project owner or a project manager can open/close this issue.</Text>
        )}

        {statusPickerOpen && canManageIssue && (
          <View style={styles.pickerRow}>
            {STATUSES.map((s) => (
              <Pressable key={s} style={styles.pickerChip} onPress={() => { setStatus(s); setStatusPickerOpen(false); }}>
                <Text style={styles.pickerChipText}>{s.replace("_", " ")}</Text>
              </Pressable>
            ))}
          </View>
        )}
        {priorityPickerOpen && (
          <View style={styles.pickerRow}>
            {PRIORITIES.map((p) => (
              <Pressable key={p} style={styles.pickerChip} onPress={() => { setPriority(p); setPriorityPickerOpen(false); }}>
                <Text style={styles.pickerChipText}>{p}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <Text style={styles.description}>{issue.description}</Text>

        {issue.screenshots.length > 0 && (
          <ScrollView horizontal style={{ marginVertical: spacing.md }}>
            {issue.screenshots.map((url) => (
              <Image key={url} source={{ uri: url }} style={styles.screenshot} />
            ))}
          </ScrollView>
        )}

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Reported by</Text>
          <Text style={styles.metaValue}>{issue.createdBy.name}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Assigned to</Text>
          {canManageIssue ? (
            <Pressable onPress={() => setAssignPickerOpen((v) => !v)}>
              <Text style={[styles.metaValue, styles.metaValueLink]}>
                {issue.assignedTo?.name || "Unassigned"}
              </Text>
            </Pressable>
          ) : (
            <Text style={styles.metaValue}>{issue.assignedTo?.name || "Unassigned"}</Text>
          )}
        </View>

        {assignPickerOpen && canManageIssue && (
          <View style={styles.pickerRow}>
            <Pressable
              style={styles.pickerChip}
              onPress={() => { setAssignee(null); setAssignPickerOpen(false); }}
              disabled={assigning}
            >
              <Text style={styles.pickerChipText}>Unassigned</Text>
            </Pressable>
            {project?.members.filter((m) => m.user).map((m) => (
              <Pressable
                key={m.user._id}
                style={styles.pickerChip}
                onPress={() => { setAssignee(m.user._id); setAssignPickerOpen(false); }}
                disabled={assigning}
              >
                <Text style={styles.pickerChipText}>{m.user.name}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <View style={{ flexDirection: "row", gap: spacing.sm, marginVertical: spacing.md }}>
          <Button title="Edit" variant="secondary" onPress={() => navigation.navigate("EditIssue", { issueId: issue._id })} style={{ flex: 1 }} />
          <Button title="History" variant="ghost" onPress={() => navigation.navigate("IssueHistory", { issueId: issue._id })} style={{ flex: 1 }} />
        </View>

        <Text style={styles.sectionLabel}>Comments</Text>
        {commentsLoading ? (
          <Loader />
        ) : (
          comments?.map((c) => <CommentItem key={c._id} comment={c} />)
        )}
        <CommentInput onSubmit={(text) => addComment(text)} loading={postingComment} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h2, color: colors.text, marginBottom: spacing.sm },
  badgeRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.sm },
  hint: { ...typography.small, color: colors.textMuted, marginBottom: spacing.sm },
  pickerRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs, marginBottom: spacing.sm },
  pickerChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceLight,
  },
  pickerChipText: { ...typography.small, color: colors.text, textTransform: "capitalize" },
  description: { ...typography.body, color: colors.text, marginTop: spacing.sm },
  screenshot: { width: 160, height: 120, borderRadius: radius.md, marginRight: spacing.sm },
  metaRow: { flexDirection: "row", justifyContent: "space-between", marginTop: spacing.sm },
  metaLabel: { ...typography.caption, color: colors.textMuted },
  metaValue: { ...typography.caption, color: colors.text },
  metaValueLink: { color: colors.primary, textDecorationLine: "underline" },
  sectionLabel: { ...typography.h3, color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm },
});
