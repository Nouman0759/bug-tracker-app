import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "../../theme";
import { Comment } from "../../types/comment";

export function CommentItem({ comment }: { comment: Comment }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.author}>{comment.user.name}</Text>
        <Text style={styles.time}>{new Date(comment.createdAt).toLocaleString()}</Text>
      </View>
      <Text style={styles.text}>{comment.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  author: { ...typography.bodyBold, color: colors.text },
  time: { ...typography.small, color: colors.textMuted },
  text: { ...typography.body, color: colors.text },
});
