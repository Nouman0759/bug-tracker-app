import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { Loader } from "../../components/common/Loader";
import { useAuth } from "../../hooks/useAuth";
import { useProjects } from "../../hooks/useProjects";
import { useIssues } from "../../hooks/useIssues";
import { colors, spacing, typography, radius } from "../../theme";
import { IssueStatusBadge } from "../../components/issues/IssueStatusBadge";
import { PriorityBadge } from "../../components/issues/PriorityBadge";

export function DashboardScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { data: projects, isLoading: projectsLoading, refetch: refetchProjects } = useProjects();
  const { data, isLoading: issuesLoading, refetch: refetchIssues, isRefetching } = useIssues({ limit: 50 });

  const isLoading = projectsLoading || issuesLoading;

  // Fixed: useIssues returns { issues, meta }
  const issues = data?.issues ?? [];

  const openCount = issues.filter((i) => i.status === "open").length;
  const inProgressCount = issues.filter((i) => i.status === "in_progress").length;
  const resolvedCount = issues.filter((i) => i.status === "resolved").length;
  const projectCount = projects?.length ?? 0;

  const recentIssues = issues.slice(0, 5);

  const onRefresh = () => {
    refetchProjects();
    refetchIssues();
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  if (isLoading) {
    return (
      <ScreenContainer>
        <Loader />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting()},</Text>
            <Text style={styles.name}>{user?.name || "User"}</Text>
          </View>
          <View style={styles.avatar}>
            <Ionicons name="person" size={22} color={colors.primary} />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard icon="bug-outline" label="Open" value={openCount} color={colors.statusOpen} />
          <StatCard icon="time-outline" label="In Progress" value={inProgressCount} color={colors.statusInProgress} />
          <StatCard icon="checkmark-circle-outline" label="Resolved" value={resolvedCount} color={colors.statusResolved} />
          <StatCard icon="folder-outline" label="Projects" value={projectCount} color={colors.primary} />
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <ActionButton
            icon="add-circle-outline"
            label="New Issue"
            onPress={() => navigation.navigate("IssuesTab", { screen: "CreateIssue" })}
          />
          <ActionButton
            icon="folder-open-outline"
            label="New Project"
            onPress={() => navigation.navigate("ProjectsTab", { screen: "CreateProject" })}
          />
          <ActionButton
            icon="list-outline"
            label="All Issues"
            onPress={() => navigation.navigate("IssuesTab")}
          />
        </View>

        {/* Recent Issues */}
        <Text style={styles.sectionTitle}>Recent Issues</Text>

        {recentIssues.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No issues yet. Create your first one!</Text>
          </View>
        ) : (
          recentIssues.map((issue) => (
            <Pressable
              key={issue._id}
              style={styles.issueCard}
              onPress={() =>
                navigation.navigate("IssuesTab", {
                  screen: "IssueDetails",
                  params: { issueId: issue._id },
                })
              }
            >
              <View style={styles.issueTop}>
                <Text style={styles.issueTitle} numberOfLines={1}>
                  {issue.title}
                </Text>
                <PriorityBadge priority={issue.priority} />
              </View>
              <View style={styles.issueBottom}>
                <IssueStatusBadge status={issue.status} />
                <Text style={styles.issueMeta}>
                  {typeof issue.project === "object" ? issue.project.name : "Project"}
                </Text>
              </View>
            </Pressable>
          ))
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={20} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ActionButton({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.actionBtn} onPress={onPress}>
      <Ionicons name={icon} size={24} color={colors.primary} />
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  greeting: {
    ...typography.caption,
    color: colors.textMuted,
  },
  name: {
    ...typography.h2,
    color: colors.text,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    ...typography.h3,
    color: colors.text,
    marginTop: 4,
  },
  statLabel: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 2,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  actionsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionLabel: {
    ...typography.caption,
    color: colors.text,
    marginTop: 6,
    fontWeight: "600",
  },
  issueCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  issueTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  issueTitle: {
    ...typography.bodyBold,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  issueBottom: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  issueMeta: {
    ...typography.caption,
    color: colors.textMuted,
  },
  emptyBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: {
    ...typography.caption,
    color: colors.textMuted,
  },
});