export interface TransformDefinition {
  id: string;
  name: string;
  description: string;
  summary: string;
  builtin: boolean;
}

export interface CustomTransform {
  id: string;
  name: string;
  description: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
}

export const MAX_CUSTOM_TRANSFORMS = 20;

export const TRANSFORM_DESCRIPTION_PLACEHOLDER =
  "Describe the output format. Small examples help — feel free to give example inputs and outputs.";
