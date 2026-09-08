import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../theme";
import { Project } from "../../types/project";

export function ProjectCard({ project, onPress }: { project: Project; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
    >
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>
          {project.name}
        </Text>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </View>
      {project.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {project.description}
        </Text>
      ) : null}
      <View style={styles.footer}>
        <Ionicons name="people-outline" size={14} color={colors.textMuted} />
        <Text style={styles.footerText}>{project.members.length} members</Text>
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
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { ...typography.h3, color: colors.text, flex: 1 },
  description: { ...typography.caption, color: colors.textMuted, marginTop: 4 },
  footer: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: spacing.sm },
  footerText: { ...typography.small, color: colors.textMuted },
});
