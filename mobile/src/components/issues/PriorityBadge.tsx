import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, radius, spacing, typography } from "../../theme";
import { IssuePriority } from "../../types/issue";

const PRIORITY_COLORS: Record<IssuePriority, string> = {
  low: colors.priorityLow,
  medium: colors.priorityMedium,
  high: colors.priorityHigh,
  critical: colors.priorityCritical,
};

const PRIORITY_LABELS: Record<IssuePriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export function PriorityBadge({ priority }: { priority: IssuePriority }) {
  return (
    <View style={[styles.badge, { backgroundColor: PRIORITY_COLORS[priority] + "33" }]}>
      <View style={[styles.dot, { backgroundColor: PRIORITY_COLORS[priority] }]} />
      <Text style={[styles.text, { color: PRIORITY_COLORS[priority] }]}>
        {PRIORITY_LABELS[priority]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    alignSelf: "flex-start",
  },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  text: { ...typography.small },
});
