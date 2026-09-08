import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, radius, spacing, typography } from "../../theme";
import { IssueStatus } from "../../types/issue";

const STATUS_COLORS: Record<IssueStatus, string> = {
  open: colors.statusOpen,
  in_progress: colors.statusInProgress,
  resolved: colors.statusResolved,
  closed: colors.statusClosed,
  reopened: colors.statusReopened,
};

const STATUS_LABELS: Record<IssueStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
  reopened: "Reopened",
};

export function IssueStatusBadge({ status }: { status: IssueStatus }) {
  return (
    <View style={[styles.badge, { backgroundColor: STATUS_COLORS[status] + "33" }]}>
      <Text style={[styles.text, { color: STATUS_COLORS[status] }]}>
        {STATUS_LABELS[status]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    alignSelf: "flex-start",
  },
  text: { ...typography.small },
});
