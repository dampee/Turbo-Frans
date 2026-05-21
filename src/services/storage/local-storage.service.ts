export class LocalStorageService {
  getJson<T>(key: string, fallback: T): T {
    if (!this.isAvailable()) {
      return fallback;
    }

    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  setJson<T>(key: string, value: T): void {
    if (!this.isAvailable()) {
      return;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
  }

  getString(key: string): string | null {
    if (!this.isAvailable()) {
      return null;
    }

    return window.localStorage.getItem(key);
  }

  setString(key: string, value: string): void {
    if (!this.isAvailable()) {
      return;
    }

    window.localStorage.setItem(key, value);
  }

  remove(key: string): void {
    if (!this.isAvailable()) {
      return;
    }

    window.localStorage.removeItem(key);
  }

  private isAvailable(): boolean {
    return typeof window !== "undefined" && "localStorage" in window;
  }
}

export const localStorageService = new LocalStorageService();

export const storageKeys = {
  studentProfiles: "rallye-des-mots:v1:student-profiles",
  selectedStudentId: "rallye-des-mots:v1:selected-student-id",
  studentProgress: (studentId: string) => `rallye-des-mots:v1:student-progress:${studentId}`,
};
