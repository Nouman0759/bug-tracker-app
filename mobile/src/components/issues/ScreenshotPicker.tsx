import React from "react";
import { View, Image, Pressable, StyleSheet, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../theme";

interface ScreenshotPickerProps {
  uris: string[];
  onChange: (uris: string[]) => void;
}

export function ScreenshotPicker({ uris, onChange }: ScreenshotPickerProps) {
  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      const newUris = result.assets.map((a) => a.uri);
      onChange([...uris, ...newUris]);
    }
  }

  function removeAt(index: number) {
    onChange(uris.filter((_, i) => i !== index));
  }

  return (
    <View>
      <Text style={styles.label}>Screenshots</Text>
      <View style={styles.row}>
        {uris.map((uri, i) => (
          <View key={uri + i} style={styles.thumbWrapper}>
            <Image source={{ uri }} style={styles.thumb} />
            <Pressable style={styles.removeBtn} onPress={() => removeAt(i)}>
              <Ionicons name="close" size={12} color="#fff" />
            </Pressable>
          </View>
        ))}
        <Pressable style={styles.addBtn} onPress={pickImage}>
          <Ionicons name="add" size={24} color={colors.textMuted} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.xs },
  row: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  thumbWrapper: { position: "relative" },
  thumb: { width: 64, height: 64, borderRadius: radius.sm },
  removeBtn: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: colors.danger,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtn: {
    width: 64,
    height: 64,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
});
