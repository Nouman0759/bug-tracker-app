import React, { useState } from "react";
import { ScrollView, View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { ScreenshotPicker } from "../../components/issues/ScreenshotPicker";
import { useCreateIssue } from "../../hooks/useIssues";
import { useProjects } from "../../hooks/useProjects";
import { issueApi } from "../../services/api/issueApi";
import { IssuesStackParamList } from "../../navigation/types";
import { IssuePriority } from "../../types/issue";
import { colors, spacing, radius, typography } from "../../theme";

type Route = RouteProp<IssuesStackParamList, "CreateIssue">;

const PRIORITIES: IssuePriority[] = ["low", "medium", "high", "critical"];

export function CreateIssueScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<IssuesStackParamList>>();
  const { params } = useRoute<Route>();
  const { data: projects } = useProjects();
  const { mutateAsync, isPending } = useCreateIssue();

  const [projectId, setProjectId] = useState(params?.projectId || projects?.[0]?._id || "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<IssuePriority>("medium");
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  async function handleSubmit() {
    if (!projectId) {
      setError("Please select a project");
      return;
    }
    if (title.trim().length < 3) {
      setError("Title must be at least 3 characters");
      return;
    }
    if (!description.trim()) {
      setError("Description is required");
      return;
    }
    setError("");

    const issue = await mutateAsync({
      project: projectId,
      title: title.trim(),
      description: description.trim(),
      priority,
    });

    if (screenshots.length > 0) {
      setUploading(true);
      try {
        await issueApi.uploadScreenshots(issue._id, screenshots);
      } finally {
        setUploading(false);
      }
    }

    navigation.replace("IssueDetails", { issueId: issue._id });
  }

  return (
    <ScreenContainer>
      <ScrollView>
        {!params?.projectId && projects && projects.length > 0 && (
          <View style={{ marginBottom: spacing.md }}>
            <Text style={styles.label}>Project</Text>
            <View style={styles.chipRow}>
              {projects.map((p) => (
                <Pressable
                  key={p._id}
                  onPress={() => setProjectId(p._id)}
                  style={[styles.chip, projectId === p._id && styles.chipActive]}
                >
                  <Text style={[styles.chipText, projectId === p._id && styles.chipTextActive]}>
                    {p.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        <Input label="Title" value={title} onChangeText={setTitle} placeholder="Short summary of the bug" />
        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Steps to reproduce, expected vs actual behavior..."
          multiline
          numberOfLines={5}
          style={{ minHeight: 100, textAlignVertical: "top" }}
        />

        <Text style={styles.label}>Priority</Text>
        <View style={styles.chipRow}>
          {PRIORITIES.map((p) => (
            <Pressable
              key={p}
              onPress={() => setPriority(p)}
              style={[styles.chip, priority === p && styles.chipActive]}
            >
              <Text style={[styles.chipText, priority === p && styles.chipTextActive]}>{p}</Text>
            </Pressable>
          ))}
        </View>

        <View style={{ marginVertical: spacing.md }}>
          <ScreenshotPicker uris={screenshots} onChange={setScreenshots} />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button
          title="Create Issue"
          onPress={handleSubmit}
          loading={isPending || uploading}
          style={{ marginTop: spacing.sm, marginBottom: spacing.xl }}
        />
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
