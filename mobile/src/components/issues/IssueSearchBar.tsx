import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius } from "../../theme";

interface IssueSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function IssueSearchBar({ value, onChangeText }: IssueSearchBarProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color={colors.textMuted} />
      <TextInput
        placeholder="Search issues..."
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  input: { flex: 1, color: colors.text, paddingVertical: spacing.sm, marginLeft: spacing.sm },
});
