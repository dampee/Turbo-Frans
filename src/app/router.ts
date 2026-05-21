export type AppRoute = "students" | "race" | "finish" | "builder";

export function getInitialRoute(hasSelectedStudent: boolean): AppRoute {
  return hasSelectedStudent ? "race" : "students";
}
