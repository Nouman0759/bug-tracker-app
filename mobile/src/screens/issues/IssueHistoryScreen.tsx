import React from "react";
import { FlatList, View, Text, StyleSheet } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { Loader } from "../../components/common/Loader";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { EmptyState } from "../../components/common/EmptyState";
import { useIssueHistory } from "../../hooks/useIssues";
import { IssuesStackParamList } from "../../navigation/types";
import { IssueHistoryEntry } from "../../types/issue";
import { colors, spacing, radius, typography } from "../../theme";

type Route = RouteProp<IssuesStackParamList, "IssueHistory">;

function describeEntry(entry: IssueHistoryEntry): string {
  const actor = entry.user?.name || "Someone";
  switch (entry.action) {
    case "ISSUE_CREATED":
      return `${actor} created this issue`;
    case "STATUS_CHANGED":
      return `${actor} changed status: ${entry.oldValue} → ${entry.newValue}`;
    case "PRIORITY_CHANGED":
      return `${actor} changed priority: ${entry.oldValue} → ${entry.newValue}`;
    case "ASSIGNED_CHANGED":
      return `${actor} changed the assignee`;
    case "TITLE_CHANGED":
      return `${actor} changed the title`;
    case "DESCRIPTION_CHANGED":
      return `${actor} updated the description`;
    default:
      return `${actor} updated this issue`;
  }
}

export function IssueHistoryScreen() {
  const { params } = useRoute<Route>();
  const { data: history, isLoading, isError, error, refetch } = useIssueHistory(params.issueId);

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage message={(error as Error).message} onRetry={refetch} />;
  if (!history || history.length === 0) return <EmptyState title="No history yet" />;

  return (
    <ScreenContainer>
      <FlatList
        data={history}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.dot} />
            <View style={{ flex: 1 }}>
              <Text style={styles.time}>{new Date(item.createdAt).toLocaleString()}</Text>
              <Text style={styles.text}>{describeEntry(item)}</Text>
            </View>
          </View>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginTop: 6 },
  time: { ...typography.small, color: colors.textMuted },
  text: { ...typography.body, color: colors.text, marginTop: 2 },
});
