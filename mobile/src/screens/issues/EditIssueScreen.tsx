import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet, Pressable } from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";
import { useIssue } from "../../hooks/useIssues";
import { issueApi } from "../../services/api/issueApi";
import { useQueryClient } from "@tanstack/react-query";
import { IssuesStackParamList } from "../../navigation/types";
import { IssuePriority } from "../../types/issue";
import { colors, spacing, radius, typography } from "../../theme";

type Route = RouteProp<IssuesStackParamList, "EditIssue">;
const PRIORITIES: IssuePriority[] = ["low", "medium", "high", "critical"];

export function EditIssueScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<NativeStackNavigationProp<IssuesStackParamList>>();
  const queryClient = useQueryClient();
  const { data: issue, isLoading } = useIssue(params.issueId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<IssuePriority>("medium");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (issue) {
      setTitle(issue.title);
      setDescription(issue.description);
      setPriority(issue.priority);
    }
  }, [issue]);

  async function handleSave() {
    if (title.trim().length < 3) {
      setError("Title must be at least 3 characters");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await issueApi.update(params.issueId, {
        title: title.trim(),
        description: description.trim(),
        priority,
      });
      await queryClient.invalidateQueries({ queryKey: ["issues", params.issueId] });
      await queryClient.invalidateQueries({ queryKey: ["issues", params.issueId, "history"] });
      await queryClient.invalidateQueries({ queryKey: ["issues"] });
      navigation.goBack();
    } catch (err: any) {
      setError(err.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  if (isLoading || !issue) return <Loader />;

  return (
    <ScreenContainer>
      <ScrollView>
        <Input label="Title" value={title} onChangeText={setTitle} />
        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
          style={{ minHeight: 100, textAlignVertical: "top" }}
        />
        <Text style={styles.label}>Priority</Text>
        <View style={styles.chipRow}>
          {PRIORITIES.map((p) => (
            <Pressable key={p} onPress={() => setPriority(p)} style={[styles.chip, priority === p && styles.chipActive]}>
              <Text style={[styles.chipText, priority === p && styles.chipTextActive]}>{p}</Text>
            </Pressable>
          ))}
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Save Changes" onPress={handleSave} loading={saving} style={{ marginTop: spacing.md }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  label: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.xs },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.md },
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
  error: { ...typography.caption, color: colors.danger, marginBottom: spacing.sm },
});
