import React from "react";
import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle } from "react-native";
import { colors, spacing, radius, typography } from "../../theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "ghost" ? colors.primary : "#fff"} />
      ) : (
        <Text
          style={[
            styles.text,
            variant === "ghost" && { color: colors.primary },
            variant === "danger" && { color: "#fff" },
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const variantStyles: Record<string, ViewStyle> = {
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.surfaceLight },
  danger: { backgroundColor: colors.danger },
  ghost: { backgroundColor: "transparent", borderWidth: 1, borderColor: colors.primary },
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.5 },
  text: { ...typography.bodyBold, color: "#fff" },
});
