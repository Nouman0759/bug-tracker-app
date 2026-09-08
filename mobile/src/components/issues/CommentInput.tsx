import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { colors, spacing, radius } from "../../theme";
import { Button } from "../common/Button";

export function CommentInput({ onSubmit, loading }: { onSubmit: (text: string) => void; loading?: boolean }) {
  const [text, setText] = useState("");

  function handleSubmit() {
    if (!text.trim()) return;
    onSubmit(text.trim());
    setText("");
  }

  return (
    <View style={styles.row}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Write a comment..."
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        multiline
      />
      <Button title="Post" onPress={handleSubmit} loading={loading} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-end", gap: spacing.sm },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxHeight: 100,
  },
  button: { paddingHorizontal: spacing.md },
});
