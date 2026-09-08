import React, { useState } from "react";
import { View } from "react-native";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { spacing } from "../../theme";

interface ProjectFormProps {
  initialName?: string;
  initialDescription?: string;
  onSubmit: (values: { name: string; description: string }) => void;
  loading?: boolean;
  submitLabel?: string;
}

export function ProjectForm({
  initialName = "",
  initialDescription = "",
  onSubmit,
  loading,
  submitLabel = "Create Project",
}: ProjectFormProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!name.trim()) {
      setError("Project name is required");
      return;
    }
    setError("");
    onSubmit({ name: name.trim(), description: description.trim() });
  }

  return (
    <View>
      <Input label="Project Name" value={name} onChangeText={setName} error={error} placeholder="e.g. Mobile App v2" />
      <Input
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="What's this project about?"
        multiline
        numberOfLines={3}
      />
      <Button title={submitLabel} onPress={handleSubmit} loading={loading} style={{ marginTop: spacing.sm }} />
    </View>
  );
}
