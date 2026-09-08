import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { Button } from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";
import { colors, spacing, radius, typography, shadow } from "../../theme";

export function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <ScreenContainer>
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() || "?"}</Text>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <Button title="Log Out" variant="danger" onPress={logout} style={{ marginTop: spacing.xl }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: "center", marginTop: spacing.xl },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
    ...shadow.card,
  },
  avatarText: { color: "#fff", fontSize: 32, fontWeight: "700" },
  name: { ...typography.h2, color: colors.text },
  email: { ...typography.body, color: colors.textMuted, marginTop: 4 },
});
