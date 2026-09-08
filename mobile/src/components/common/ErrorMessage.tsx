import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "./Button";
import { colors, spacing, typography } from "../../theme";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
      {onRetry ? (
        <Button title="Retry" onPress={onRetry} variant="secondary" style={{ marginTop: spacing.md }} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.lg },
  text: { ...typography.body, color: colors.danger, textAlign: "center" },
});
