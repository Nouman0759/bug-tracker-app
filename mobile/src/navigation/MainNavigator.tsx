import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";

import {
  MainTabParamList,
  ProjectsStackParamList,
  IssuesStackParamList,
} from "./types";

import { ProjectsScreen } from "../screens/projects/ProjectsScreen";
import { CreateProjectScreen } from "../screens/projects/CreateProjectScreen";
import { ProjectDetailsScreen } from "../screens/projects/ProjectDetailsScreen";
import { ProjectMembersScreen } from "../screens/projects/ProjectMembersScreen";

import { IssuesScreen } from "../screens/issues/IssuesScreen";
import { CreateIssueScreen } from "../screens/issues/CreateIssueScreen";
import { IssueDetailsScreen } from "../screens/issues/IssueDetailsScreen";
import { EditIssueScreen } from "../screens/issues/EditIssueScreen";
import { IssueHistoryScreen } from "../screens/issues/IssueHistoryScreen";

import { ProfileScreen } from "../screens/profile/ProfileScreen";

const Tab = createBottomTabNavigator<MainTabParamList>();
const ProjectsStack = createNativeStackNavigator<ProjectsStackParamList>();
const IssuesStack = createNativeStackNavigator<IssuesStackParamList>();

const headerOptions = {
  headerStyle: { backgroundColor: colors.background },
  headerTintColor: colors.text,
  headerShadowVisible: false,
};

function ProjectsStackNavigator() {
  return (
    <ProjectsStack.Navigator screenOptions={headerOptions}>
      <ProjectsStack.Screen name="Projects" component={ProjectsScreen} />
      <ProjectsStack.Screen
        name="CreateProject"
        component={CreateProjectScreen}
        options={{ title: "New Project" }}
      />
      <ProjectsStack.Screen
        name="ProjectDetails"
        component={ProjectDetailsScreen}
        options={{ title: "Project" }}
      />
      <ProjectsStack.Screen
        name="ProjectMembers"
        component={ProjectMembersScreen}
        options={{ title: "Members" }}
      />
    </ProjectsStack.Navigator>
  );
}

function IssuesStackNavigator() {
  return (
    <IssuesStack.Navigator screenOptions={headerOptions}>
      <IssuesStack.Screen name="Issues" component={IssuesScreen} />
      <IssuesStack.Screen
        name="CreateIssue"
        component={CreateIssueScreen}
        options={{ title: "New Issue" }}
      />
      <IssuesStack.Screen
        name="IssueDetails"
        component={IssueDetailsScreen}
        options={{ title: "Issue" }}
      />
      <IssuesStack.Screen
        name="EditIssue"
        component={EditIssueScreen}
        options={{ title: "Edit Issue" }}
      />
      <IssuesStack.Screen
        name="IssueHistory"
        component={IssueHistoryScreen}
        options={{ title: "History" }}
      />
    </IssuesStack.Navigator>
  );
}

export function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ color, size }) => {
          const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
            ProjectsTab: "folder-outline",
            IssuesTab: "bug-outline",
            ProfileTab: "person-outline",
          };
          return <Ionicons name={iconMap[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="ProjectsTab" component={ProjectsStackNavigator} options={{ title: "Projects" }} />
      <Tab.Screen name="IssuesTab" component={IssuesStackNavigator} options={{ title: "Issues" }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: "Profile" }} />
    </Tab.Navigator>
  );
}
