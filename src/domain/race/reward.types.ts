export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface EarnedBadge {
  badgeId: string;
  earnedAt: string;
}

export interface Reward {
  id: string;
  title: string;
  points: number;
  badgeId?: string;
}
