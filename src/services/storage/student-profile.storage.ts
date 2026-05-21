import type { StudentProfile } from "../../domain/students/student.types";
import { todayIso } from "../../shared/utils/date";
import { createId } from "../../shared/utils/id";
import { localStorageService, storageKeys } from "./local-storage.service";

const avatarColors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"];

export class StudentProfileStorage {
  getAll(): StudentProfile[] {
    return localStorageService.getJson<StudentProfile[]>(storageKeys.studentProfiles, []);
  }

  create(displayName: string): StudentProfile {
    const now = todayIso();
    const profiles = this.getAll();
    const profile: StudentProfile = {
      id: createId("student"),
      displayName: displayName.trim(),
      avatarColor: avatarColors[profiles.length % avatarColors.length],
      createdAt: now,
      lastUsedAt: now,
    };

    localStorageService.setJson(storageKeys.studentProfiles, [...profiles, profile]);
    this.setSelectedStudentId(profile.id);
    return profile;
  }

  touch(studentId: string): void {
    const profiles = this.getAll().map((profile) =>
      profile.id === studentId ? { ...profile, lastUsedAt: todayIso() } : profile,
    );
    localStorageService.setJson(storageKeys.studentProfiles, profiles);
  }

  getSelectedStudentId(): string | null {
    return localStorageService.getString(storageKeys.selectedStudentId);
  }

  setSelectedStudentId(studentId: string): void {
    localStorageService.setString(storageKeys.selectedStudentId, studentId);
    this.touch(studentId);
  }

  clearSelectedStudent(): void {
    localStorageService.remove(storageKeys.selectedStudentId);
  }
}

export const studentProfileStorage = new StudentProfileStorage();
