import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { Loader } from "../../components/common/Loader";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { Button } from "../../components/common/Button";
import { useProject } from "../../hooks/useProjects";
import { ProjectsStackParamList } from "../../navigation/types";
import { colors, spacing, typography } from "../../theme";

type Route = RouteProp<ProjectsStackParamList, "ProjectDetails">;

export function ProjectDetailsScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { data: project, isLoading, isError, error, refetch } = useProject(params.projectId);

  if (isLoading) return <Loader />;
  if (isError || !project) return <ErrorMessage message={(error as Error)?.message || "Not found"} onRetry={refetch} />;

  return (
    <ScreenContainer>
      <Text style={styles.name}>{project.name}</Text>
      {project.description ? <Text style={styles.description}>{project.description}</Text> : null}

      <Text style={styles.sectionLabel}>Owner</Text>
      <Text style={styles.value}>{project.owner.name}</Text>

      <Text style={styles.sectionLabel}>Members ({project.members.length})</Text>
      <Text style={styles.value}>
        {project.members
          .filter((m) => m.user)
          .map((m) => m.user.name)
          .join(", ")}
      </Text>

      <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
        <Button
          title="View Issues"
          onPress={() =>
            navigation.navigate("IssuesTab", { screen: "Issues", params: { projectId: project._id } })
          }
        />
        <Button
          title="Manage Members"
          variant="secondary"
          onPress={() => navigation.navigate("ProjectMembers", { projectId: project._id })}
        />
        <Button
          title="Report New Issue"
          variant="ghost"
          onPress={() =>
            navigation.navigate("IssuesTab", { screen: "CreateIssue", params: { projectId: project._id } })
          }
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  name: { ...typography.h1, color: colors.text },
  description: { ...typography.body, color: colors.textMuted, marginTop: spacing.xs },
  sectionLabel: { ...typography.caption, color: colors.textMuted, marginTop: spacing.lg },
  value: { ...typography.body, color: colors.text, marginTop: 4 },
});
