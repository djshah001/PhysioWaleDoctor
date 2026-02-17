import api from "./api";
// Assuming Exercise type exists or using any for now if not strictly defined in models.ts
// Checking models.ts, we don't have Exercise type explicitly defined yet,
// but we have ExercisePreset.js and Exercises.js in server models.
// For now, I'll use generally typed interfaces or any, but strictly better if typed.

export interface Exercise {
  _id: string;
  name: string;
  description: string;
  videoUrl?: string;
  bodyPart?: string;
}

export const exerciseApi = {
  getAll: () => api.get<Exercise[]>("/exercises"),
  getFilters: () => api.get<any>("/exercises/filters"),
  getBodyParts: () => api.get<string[]>("/bodyparts"),
};
