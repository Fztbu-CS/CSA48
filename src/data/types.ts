export type CategoryType = 'code' | 'social' | 'words' | 'work' | 'life';

export interface CategoryInfo {
  label: string;
  icon: 'code' | 'social' | 'words' | 'work' | 'life';
  color: string;
  badgeClass: string;
}

export const CATEGORIES: Record<CategoryType, CategoryInfo> = {
  code: {
    label: '代码爆破',
    icon: 'code',
    color: 'emerald',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  social: {
    label: '社死现场',
    icon: 'social',
    color: 'rose',
    badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  },
  words: {
    label: '逆天发言',
    icon: 'words',
    color: 'amber',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  work: {
    label: '乌龙事故',
    icon: 'work',
    color: 'blue',
    badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  life: {
    label: '生活迷糊',
    icon: 'life',
    color: 'purple',
    badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
};

export interface ShameIncident {
  id: string;
  personId: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  severity: 1 | 2 | 3 | 4 | 5; // 1: 1星, 3: 3星, 5: 5星
  category: CategoryType;
  witnesses: string[]; // 目击证人
  defense?: string; // 狡辩陈词
  tags: string[];
}

export interface Person {
  id: string;
  name: string;
  nickname: string;
  avatar: string; // 首字单字 / 头像简称
  bio?: string;
  joinedAt: string;
}

export interface PersonStats extends Person {
  totalCount: number;
  shameScore: number;
  maxSeverity: number;
  recentDate: string;
  incidents: ShameIncident[];
  rank?: number;
}
