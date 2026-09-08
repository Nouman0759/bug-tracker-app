import React from "react";
import { FlatList, View, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { ProjectCard } from "../../components/projects/ProjectCard";
import { Loader } from "../../components/common/Loader";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { EmptyState } from "../../components/common/EmptyState";
import { useProjects } from "../../hooks/useProjects";
import { ProjectsStackParamList } from "../../navigation/types";
import { colors, spacing } from "../../theme";

export function ProjectsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ProjectsStackParamList>>();
  const { data: projects, isLoading, isError, error, refetch, isRefetching } = useProjects();

  return (
    <ScreenContainer>
      <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: spacing.sm }}>
        <Pressable onPress={() => navigation.navigate("CreateProject")}>
          <Ionicons name="add-circle" size={32} color={colors.primary} />
        </Pressable>
      </View>

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <ErrorMessage message={(error as Error).message} onRetry={refetch} />
      ) : !projects || projects.length === 0 ? (
        <EmptyState title="No projects yet" subtitle="Create your first project to start tracking issues." />
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ProjectCard
              project={item}
              onPress={() => navigation.navigate("ProjectDetails", { projectId: item._id })}
            />
          )}
          onRefresh={refetch}
          refreshing={isRefetching}
        />
      )}
    </ScreenContainer>
  );
}
