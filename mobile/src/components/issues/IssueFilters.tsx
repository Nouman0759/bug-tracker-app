import React from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "../../theme";
import { IssueStatus, IssuePriority } from "../../types/issue";

const STATUSES: IssueStatus[] = ["open", "in_progress", "resolved", "closed", "reopened"];
const PRIORITIES: IssuePriority[] = ["low", "medium", "high", "critical"];

interface IssueFiltersProps {
  status?: IssueStatus;
  priority?: IssuePriority;
  onChangeStatus: (status?: IssueStatus) => void;
  onChangePriority: (priority?: IssuePriority) => void;
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

export function IssueFilters({ status, priority, onChangeStatus, onChangePriority }: IssueFiltersProps) {
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        <Chip label="All statuses" active={!status} onPress={() => onChangeStatus(undefined)} />
        {STATUSES.map((s) => (
          <Chip key={s} label={s.replace("_", " ")} active={status === s} onPress={() => onChangeStatus(s)} />
        ))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        <Chip label="All priorities" active={!priority} onPress={() => onChangePriority(undefined)} />
        {PRIORITIES.map((p) => (
          <Chip key={p} label={p} active={priority === p} onPress={() => onChangePriority(p)} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.sm, paddingVertical: spacing.xs, paddingRight: spacing.md },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { ...typography.caption, color: colors.textMuted, textTransform: "capitalize" },
  chipTextActive: { color: "#fff" },
});
