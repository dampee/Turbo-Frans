import type { RaceSession } from "../../domain/race/race-session.types";
import { studentProgressStorage } from "./student-progress.storage";

export class RaceSessionStorage {
  getActiveSession(studentId: string): RaceSession | undefined {
    return studentProgressStorage.get(studentId).activeSession;
  }

  saveActiveSession(session: RaceSession): void {
    studentProgressStorage.setActiveSession(session.studentId, session);
  }

  completeSession(session: RaceSession): void {
    studentProgressStorage.completeSession(session.studentId, session);
  }
}

export const raceSessionStorage = new RaceSessionStorage();
