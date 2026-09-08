import React from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { useAuth } from "../hooks/useAuth";
import { AuthNavigator } from "./AuthNavigator";
import { MainNavigator } from "./MainNavigator";
import { Loader } from "../components/common/Loader";
import { colors } from "../theme";

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.background,
    text: colors.text,
    border: colors.border,
    primary: colors.primary,
  },
};

export function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Loader />;

  return (
    <NavigationContainer theme={navTheme}>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
