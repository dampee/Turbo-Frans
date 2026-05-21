import type { EarnedBadge } from "../../domain/race/reward.types";
import type { RaceSession } from "../../domain/race/race-session.types";
import type { ScoreHistoryEntry, Streak } from "../../domain/race/score.types";
import { localStorageService, storageKeys } from "./local-storage.service";

export interface StudentProgress {
  studentId: string;
  activeSession?: RaceSession;
  completedSessions: RaceSession[];
  scoreHistory: ScoreHistoryEntry[];
  streak: Streak;
  badges: EarnedBadge[];
  mistakes: string[];
}

export class StudentProgressStorage {
  get(studentId: string): StudentProgress {
    return localStorageService.getJson<StudentProgress>(storageKeys.studentProgress(studentId), {
      studentId,
      completedSessions: [],
      scoreHistory: [],
      streak: { current: 0, best: 0 },
      badges: [],
      mistakes: [],
    });
  }

  save(progress: StudentProgress): void {
    localStorageService.setJson(storageKeys.studentProgress(progress.studentId), progress);
  }

  setActiveSession(studentId: string, session: RaceSession): void {
    const progress = this.get(studentId);
    this.save({ ...progress, activeSession: session });
  }

  completeSession(studentId: string, session: RaceSession): void {
    const progress = this.get(studentId);
    const scoreEntry: ScoreHistoryEntry = {
      sessionId: session.id,
      trackId: session.trackId,
      points: session.score.points,
      correctAnswers: session.score.correctAnswers,
      mistakes: session.score.mistakes,
      completedAt: session.completedAt ?? new Date().toISOString(),
    };
    const newBadges = session.earnedBadges.filter(
      (earned) => !progress.badges.some((existing) => existing.badgeId === earned.badgeId),
    );

    this.save({
      ...progress,
      activeSession: undefined,
      completedSessions: [...progress.completedSessions, session],
      scoreHistory: [...progress.scoreHistory, scoreEntry],
      streak: {
        current: session.streak.current,
        best: Math.max(progress.streak.best, session.streak.best),
      },
      badges: [...progress.badges, ...newBadges],
      mistakes: [...progress.mistakes, ...session.results.flatMap((result) => result.mistakes)],
    });
  }
}

export const studentProgressStorage = new StudentProgressStorage();
