import React from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { ProjectForm } from "../../components/projects/ProjectForm";
import { useCreateProject } from "../../hooks/useProjects";
import { ProjectsStackParamList } from "../../navigation/types";

export function CreateProjectScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ProjectsStackParamList>>();
  const { mutateAsync, isPending } = useCreateProject();

  async function handleSubmit(values: { name: string; description: string }) {
    const project = await mutateAsync(values);
    navigation.replace("ProjectDetails", { projectId: project._id });
  }

  return (
    <ScreenContainer>
      <ProjectForm onSubmit={handleSubmit} loading={isPending} />
    </ScreenContainer>
  );
}
