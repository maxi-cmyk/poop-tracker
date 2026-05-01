import {
  Achievement,
  AchievementType,
  HealthAlert,
  MonthlyStats,
  PoopLog,
} from "@/types";

// Achievement definitions with unlock criteria
export const ACHIEVEMENT_DEFINITIONS: Record<
  AchievementType,
  {
    name: string;
    description: string;
    emoji: string;
    check: (logs: PoopLog[], stats: any) => boolean;
  }
> = {
  first_flush: {
    name: "First Flush",
    description: "Log your first poop!",
    emoji: "🎉",
    check: (logs) => logs.length >= 1,
  },
  early_bird: {
    name: "Early Bird",
    description: "Log a poop before 6 AM",
    emoji: "🌅",
    check: (logs) =>
      logs.some((log) => {
        const hour = new Date(log.logged_at).getHours();
        return hour < 6;
      }),
  },
  night_owl: {
    name: "Night Owl",
    description: "Log a poop after midnight",
    emoji: "🦉",
    check: (logs) =>
      logs.some((log) => {
        const hour = new Date(log.logged_at).getHours();
        return hour >= 0 && hour < 4;
      }),
  },
  speed_demon: {
    name: "Speed Demon",
    description: "Complete a session in under 1 minute",
    emoji: "⚡",
    check: (logs) => logs.some((log) => log.duration_seconds < 60),
  },
  the_philosopher: {
    name: "The Philosopher",
    description: "Spend over 30 minutes on the throne",
    emoji: "🤔",
    check: (logs) => logs.some((log) => log.duration_seconds > 1800),
  },
  globetrotter: {
    name: "Globetrotter",
    description: "Poop at 5 different venues",
    emoji: "🌍",
    check: (logs) => {
      const uniqueVenues = new Set(
        logs.filter((l) => l.venue_id).map((l) => l.venue_id),
      );
      return uniqueVenues.size >= 5;
    },
  },
  iron_gut: {
    name: "Iron Gut",
    description: "Log Bristol Type 4 for 5 days straight",
    emoji: "💪",
    check: (logs) => {
      // Check for 5 consecutive days with type 4
      const sortedLogs = logs
        .filter((l) => l.bristol_type === 4)
        .sort(
          (a, b) =>
            new Date(a.logged_at).getTime() - new Date(b.logged_at).getTime(),
        );

      let consecutiveDays = 1;
      for (let i = 1; i < sortedLogs.length; i++) {
        const prevDate = new Date(sortedLogs[i - 1].logged_at).toDateString();
        const currDate = new Date(sortedLogs[i].logged_at).toDateString();
        const prevDay = new Date(sortedLogs[i - 1].logged_at);
        const currDay = new Date(sortedLogs[i].logged_at);

        if (
          currDay.getTime() - prevDay.getTime() <= 86400000 &&
          prevDate !== currDate
        ) {
          consecutiveDays++;
          if (consecutiveDays >= 5) return true;
        } else if (prevDate !== currDate) {
          consecutiveDays = 1;
        }
      }
      return false;
    },
  },
  the_void: {
    name: "The Void",
    description: 'Log a "Massive" volume poop',
    emoji: "🕳️",
    check: (logs) => logs.some((log) => log.volume === "massive"),
  },
  bidet_connoisseur: {
    name: "Bidet Connoisseur",
    description: "Rate 10 venues with bidets",
    emoji: "💦",
    check: (logs, stats) => stats.bidetVenuesRated >= 10,
  },
  streak_master: {
    name: "Streak Master",
    description: "Maintain a 30-day logging streak",
    emoji: "🔥",
    check: (logs, stats) => stats.longestStreak >= 30,
  },
  social_butterfly: {
    name: "Social Butterfly",
    description: "Add 10 friends to your circle",
    emoji: "🦋",
    check: (logs, stats) => stats.friendCount >= 10,
  },
};

// Check for newly unlocked achievements
export function checkAchievements(
  logs: PoopLog[],
  existingAchievements: Achievement[],
  stats: any,
): AchievementType[] {
  const unlockedTypes = new Set(
    existingAchievements.map((a) => a.achievement_type),
  );
  const newlyUnlocked: AchievementType[] = [];

  for (const [type, definition] of Object.entries(ACHIEVEMENT_DEFINITIONS)) {
    if (!unlockedTypes.has(type as AchievementType)) {
      if (definition.check(logs, stats)) {
        newlyUnlocked.push(type as AchievementType);
      }
    }
  }

  return newlyUnlocked;
}

// Generate health alerts based on log patterns
export function generateHealthAlerts(logs: PoopLog[]): HealthAlert[] {
  const alerts: HealthAlert[] = [];
  const recentLogs = logs.filter((log) => {
    const logDate = new Date(log.logged_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return logDate >= weekAgo;
  });

  if (recentLogs.length === 0) return alerts;

  // Check for concerning colors
  const dangerColors = recentLogs.filter(
    (l) => l.color === "black" || l.color === "red" || l.color === "white",
  );
  if (dangerColors.length >= 2) {
    alerts.push({
      type: "caution",
      message: `You've logged ${dangerColors.length} concerning stool colors this week.`,
      recommendation: "Please consult a healthcare provider if this persists.",
    });
  }

  // Check for persistent diarrhea (Type 6-7)
  const diarrheaLogs = recentLogs.filter((l) => l.bristol_type >= 6);
  if (diarrheaLogs.length >= 3) {
    alerts.push({
      type: "warning",
      message: "You may be experiencing frequent loose stools.",
      recommendation:
        "Stay hydrated and consider consulting a doctor if it continues.",
    });
  }

  // Check for constipation (Type 1-2)
  const constipationLogs = recentLogs.filter((l) => l.bristol_type <= 2);
  if (constipationLogs.length >= 3) {
    alerts.push({
      type: "warning",
      message: "You may be experiencing constipation.",
      recommendation:
        "Increase fiber and water intake. Exercise can also help.",
    });
  }

  // Check for infrequent logging
  if (recentLogs.length < 3) {
    alerts.push({
      type: "info",
      message: "Your logging frequency is lower than usual.",
      recommendation:
        "A healthy adult typically has 1-3 bowel movements per day.",
    });
  }

  return alerts;
}

// Calculate health score (0-100)
export function calculateHealthScore(logs: PoopLog[]): number {
  if (logs.length === 0) return 50;

  const recentLogs = logs.slice(-30); // Last 30 logs
  let score = 70; // Start at 70

  // Bristol type score (ideal is 3-4)
  const avgBristol =
    recentLogs.reduce((sum, l) => sum + l.bristol_type, 0) / recentLogs.length;
  if (avgBristol >= 3 && avgBristol <= 4.5) {
    score += 15;
  } else if (avgBristol >= 2.5 && avgBristol <= 5) {
    score += 10;
  } else {
    score -= 10;
  }

  // Regularity score
  const logsPerDay = recentLogs.length / 30;
  if (logsPerDay >= 0.8 && logsPerDay <= 3) {
    score += 10;
  } else if (logsPerDay < 0.5) {
    score -= 10;
  }

  // Color score (no concerning colors = good)
  const badColors = recentLogs.filter(
    (l) => l.color === "black" || l.color === "red" || l.color === "white",
  ).length;
  if (badColors === 0) {
    score += 5;
  } else {
    score -= badColors * 5;
  }

  return Math.max(0, Math.min(100, score));
}

// Generate monthly wrapped stats
export function generateMonthlyWrapped(
  logs: PoopLog[],
  month: Date,
): MonthlyStats {
  const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
  const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  const monthLogs = logs.filter((log) => {
    const logDate = new Date(log.logged_at);
    return logDate >= monthStart && logDate <= monthEnd;
  });

  const totalDuration = monthLogs.reduce(
    (sum, l) => sum + l.duration_seconds,
    0,
  );
  const avgDuration =
    monthLogs.length > 0 ? totalDuration / monthLogs.length : 0;
  const avgBristol =
    monthLogs.length > 0
      ? monthLogs.reduce((sum, l) => sum + l.bristol_type, 0) / monthLogs.length
      : 0;

  // Find most common time
  const hourCounts: Record<number, number> = {};
  monthLogs.forEach((log) => {
    const hour = new Date(log.logged_at).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  const mostCommonHour =
    Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "0";

  const formatHour = (h: number) => {
    if (h === 0) return "12 AM";
    if (h < 12) return `${h} AM`;
    if (h === 12) return "12 PM";
    return `${h - 12} PM`;
  };

  return {
    month: monthStart.toISOString(),
    total_logs: monthLogs.length,
    total_duration_seconds: totalDuration,
    avg_duration_seconds: Math.round(avgDuration),
    avg_bristol_type: Math.round(avgBristol * 10) / 10,
    most_common_time: formatHour(parseInt(mostCommonHour)),
    achievements_unlocked: 0, // Will be filled in by caller
    health_score: calculateHealthScore(monthLogs),
    health_alerts: generateHealthAlerts(monthLogs),
  };
}
