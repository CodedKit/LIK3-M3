
'use client';

const BASE_XP = 150;
const EXPONENT = 1.5;

export const calculateXpForLevel = (level: number): number => {
  if (level === 1) return 0;
  return Math.floor(BASE_XP * Math.pow(level - 1, EXPONENT));
};

export const calculateLevel = (xp: number = 0) => {
  if (xp <= 0) {
    return {
      level: 1,
      xpForCurrentLevel: 0,
      xpForNextLevel: calculateXpForLevel(2),
      progress: (xp / calculateXpForLevel(2)) * 100,
      totalXpForNextLevel: calculateXpForLevel(2),
    };
  }
  
  let level = 1;
  while (xp >= calculateXpForLevel(level + 1)) {
    level++;
  }

  const xpForCurrentLevel = calculateXpForLevel(level);
  const xpForNextLevel = calculateXpForLevel(level + 1);
  const xpInCurrentLevel = xp - xpForCurrentLevel;
  const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
  const progress = (xpInCurrentLevel / xpNeededForNextLevel) * 100;
  
  return {
    level,
    xpForCurrentLevel,
    xpForNextLevel,
    progress: Math.max(0, Math.min(100, progress)),
    totalXpForNextLevel: xpForNextLevel,
  };
};
