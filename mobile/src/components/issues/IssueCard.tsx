import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "../../theme";
import { Issue } from "../../types/issue";
import { PriorityBadge } from "./PriorityBadge";
import { IssueStatusBadge } from "./IssueStatusBadge";

export function IssueCard({ issue, onPress }: { issue: Issue; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
    >
      <Text style={styles.title} numberOfLines={1}>
        {issue.title}
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {issue.description}
      </Text>
      <View style={styles.badgeRow}>
        <IssueStatusBadge status={issue.status} />
        <PriorityBadge priority={issue.priority} />
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {issue.assignedTo ? `Assigned to ${issue.assignedTo.name}` : "Unassigned"}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: { ...typography.bodyBold, color: colors.text, marginBottom: 4 },
  description: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.sm },
  badgeRow: { flexDirection: "row", gap: spacing.sm },
  footer: { marginTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm },
  footerText: { ...typography.small, color: colors.textMuted },
});
