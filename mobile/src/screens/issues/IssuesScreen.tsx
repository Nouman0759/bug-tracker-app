import React, { useState } from "react";
import { FlatList, View, Pressable } from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { Loader } from "../../components/common/Loader";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { EmptyState } from "../../components/common/EmptyState";
import { IssueCard } from "../../components/issues/IssueCard";
import { IssueSearchBar } from "../../components/issues/IssueSearchBar";
import { IssueFilters } from "../../components/issues/IssueFilters";
import { useIssues } from "../../hooks/useIssues";
import { useDebounce } from "../../hooks/useDebounce";
import { IssuesStackParamList } from "../../navigation/types";
import { IssueStatus, IssuePriority } from "../../types/issue";
import { colors, spacing } from "../../theme";

type Route = RouteProp<IssuesStackParamList, "Issues">;

export function IssuesScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<NativeStackNavigationProp<IssuesStackParamList>>();
  const projectId = params?.projectId;

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [status, setStatus] = useState<IssueStatus | undefined>(undefined);
  const [priority, setPriority] = useState<IssuePriority | undefined>(undefined);

  const { data, isLoading, isError, error, refetch, isRefetching } = useIssues({
    project: projectId,
    status,
    priority,
    search: debouncedSearch || undefined,
  });

  const issues = data?.issues ?? [];

  return (
    <ScreenContainer>
      <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: spacing.sm }}>
        <Pressable onPress={() => navigation.navigate("CreateIssue", { projectId })}>
          <Ionicons name="add-circle" size={32} color={colors.primary} />
        </Pressable>
      </View>

      <IssueSearchBar value={search} onChangeText={setSearch} />
      <IssueFilters
        status={status}
        priority={priority}
        onChangeStatus={setStatus}
        onChangePriority={setPriority}
      />

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <ErrorMessage message={(error as Error).message} onRetry={refetch} />
      ) : issues.length === 0 ? (
        <EmptyState title="No issues found" subtitle="Try adjusting your filters, or report a new issue." />
      ) : (
        <FlatList
          data={issues}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <IssueCard issue={item} onPress={() => navigation.navigate("IssueDetails", { issueId: item._id })} />
          )}
          onRefresh={refetch}
          refreshing={isRefetching}
        />
      )}
    </ScreenContainer>
  );
}
