import { BRISTOL_DESCRIPTIONS } from "@/types";
import React, { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");

import { supabase } from "@/lib/supabase";

export default function StatsScreen() {
  const [stats, setStats] = useState({
    totalLogs: 0,
    totalDuration: 0,
    avgDuration: 0,
    avgBristol: 0,
    currentStreak: 0,
    longestStreak: 0,
    thisMonthLogs: 0,
    lastMonthLogs: 0,
  });

  const [loading, setLoading] = useState(true);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Time of day distribution
  const [timeDistribution, setTimeDistribution] = useState([
    { time: "Morning", count: 0, emoji: "🌅" },
    { time: "Afternoon", count: 0, emoji: "☀️" },
    { time: "Evening", count: 0, emoji: "🌆" },
    { time: "Night", count: 0, emoji: "🌙" },
  ]);

  // Bristol type distribution
  const [bristolDistribution, setBristolDistribution] = useState([
    { type: 1, count: 0 },
    { type: 2, count: 0 },
    { type: 3, count: 0 },
    { type: 4, count: 0 },
    { type: 5, count: 0 },
    { type: 6, count: 0 },
    { type: 7, count: 0 },
  ]);

  const maxBristolCount =
    Math.max(...bristolDistribution.map((b) => b.count)) || 1;

  const fetchStatsData = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Fetch Logs
      const { data: logs, error } = await supabase
        .from("poop_logs")
        .select("logged_at, duration_seconds, bristol_type")
        .eq("user_id", user.id);

      if (error) throw error;

      if (logs && logs.length > 0) {
        // Calculate Totals & Averages
        const totalLogs = logs.length;
        const totalDuration = logs.reduce(
          (sum, log) => sum + (log.duration_seconds || 0),
          0,
        );
        const avgDuration = totalDuration / totalLogs;
        const avgBristol =
          logs.reduce((sum, log) => sum + (log.bristol_type || 0), 0) /
          totalLogs;

        // Calculate Monthly Counts
        const now = new Date();
        const currentMonth = now.getMonth();
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;

        let thisMonthCount = 0;
        let lastMonthCount = 0;

        // Distributions
        const timeCounts = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 };
        const bristolCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };

        logs.forEach((log) => {
          const date = new Date(log.logged_at);
          // Monthly
          if (
            date.getMonth() === currentMonth &&
            date.getFullYear() === now.getFullYear()
          ) {
            thisMonthCount++;
          } else if (date.getMonth() === lastMonth) {
            lastMonthCount++;
          }

          // Bristol
          if (log.bristol_type) {
            bristolCounts[log.bristol_type as keyof typeof bristolCounts] =
              (bristolCounts[log.bristol_type as keyof typeof bristolCounts] ||
                0) + 1;
          }

          // Time of Day
          const hour = date.getHours();
          if (hour >= 5 && hour < 12) timeCounts.Morning++;
          else if (hour >= 12 && hour < 17) timeCounts.Afternoon++;
          else if (hour >= 17 && hour < 22) timeCounts.Evening++;
          else timeCounts.Night++;
        });

        // 2. Fetch Streaks
        const { data: streakData } = await supabase
          .from("streaks")
          .select("current_streak, longest_streak")
          .eq("user_id", user.id)
          .single();

        setStats({
          totalLogs,
          totalDuration,
          avgDuration,
          avgBristol,
          currentStreak: streakData?.current_streak || 0,
          longestStreak: streakData?.longest_streak || 0,
          thisMonthLogs: thisMonthCount,
          lastMonthLogs: lastMonthCount,
        });

        setTimeDistribution([
          { time: "Morning", count: timeCounts.Morning, emoji: "🌅" },
          { time: "Afternoon", count: timeCounts.Afternoon, emoji: "☀️" },
          { time: "Evening", count: timeCounts.Evening, emoji: "🌆" },
          { time: "Night", count: timeCounts.Night, emoji: "🌙" },
        ]);

        setBristolDistribution([
          { type: 1, count: bristolCounts[1] },
          { type: 2, count: bristolCounts[2] },
          { type: 3, count: bristolCounts[3] },
          { type: 4, count: bristolCounts[4] },
          { type: 5, count: bristolCounts[5] },
          { type: 6, count: bristolCounts[6] },
          { type: 7, count: bristolCounts[7] },
        ]);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchStatsData();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Stats */}
      <View style={styles.headerStats}>
        <View style={styles.mainStat}>
          <Text style={styles.mainStatValue}>{stats.totalLogs}</Text>
          <Text style={styles.mainStatLabel}>Total Logs</Text>
        </View>
        <View style={styles.mainStatDivider} />
        <View style={styles.mainStat}>
          <Text style={styles.mainStatValue}>
            {formatDuration(stats.totalDuration)}
          </Text>
          <Text style={styles.mainStatLabel}>Throne Time</Text>
        </View>
      </View>

      {/* Streak Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔥 Streak</Text>
        <View style={styles.streakRow}>
          <View style={styles.streakItem}>
            <Text style={styles.streakValue}>{stats.currentStreak}</Text>
            <Text style={styles.streakLabel}>Current</Text>
          </View>
          <View style={styles.streakItem}>
            <Text style={styles.streakValue}>{stats.longestStreak}</Text>
            <Text style={styles.streakLabel}>Best</Text>
          </View>
        </View>
      </View>

      {/* Averages Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 Averages</Text>
        <View style={styles.avgRow}>
          <View style={styles.avgItem}>
            <Text style={styles.avgEmoji}>⏱</Text>
            <Text style={styles.avgValue}>
              {formatDuration(stats.avgDuration)}
            </Text>
            <Text style={styles.avgLabel}>Per Session</Text>
          </View>
          <View style={styles.avgItem}>
            <Text style={styles.avgEmoji}>
              {BRISTOL_DESCRIPTIONS[
                Math.round(stats.avgBristol) as 1 | 2 | 3 | 4 | 5 | 6 | 7
              ]?.emoji || "💩"}
            </Text>
            <Text style={styles.avgValue}>{stats.avgBristol.toFixed(1)}</Text>
            <Text style={styles.avgLabel}>Bristol Type</Text>
          </View>
        </View>
      </View>

      {/* Time of Day Distribution */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>⏰ Time of Day</Text>
        <View style={styles.timeGrid}>
          {timeDistribution.map((item) => (
            <View key={item.time} style={styles.timeItem}>
              <Text style={styles.timeEmoji}>{item.emoji}</Text>
              <Text style={styles.timeCount}>{item.count}</Text>
              <Text style={styles.timeLabel}>{item.time}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Bristol Distribution */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📈 Bristol Distribution</Text>
        <View style={styles.bristolChart}>
          {bristolDistribution.map((item) => {
            const barHeight = (item.count / maxBristolCount) * 100;
            const info =
              BRISTOL_DESCRIPTIONS[item.type as 1 | 2 | 3 | 4 | 5 | 6 | 7];
            return (
              <View key={item.type} style={styles.bristolBar}>
                <Text style={styles.bristolCount}>{item.count}</Text>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      { height: `${barHeight}%` },
                      item.type === 4 && styles.barIdeal,
                    ]}
                  />
                </View>
                <Text style={styles.bristolEmoji}>{info.emoji}</Text>
                <Text style={styles.bristolType}>{item.type}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Monthly Comparison */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📅 Monthly</Text>
        <View style={styles.monthlyRow}>
          <View style={styles.monthlyItem}>
            <Text style={styles.monthlyValue}>{stats.thisMonthLogs}</Text>
            <Text style={styles.monthlyLabel}>This Month</Text>
          </View>
          <View style={styles.monthlyItem}>
            <Text style={styles.monthlyValue}>{stats.lastMonthLogs}</Text>
            <Text style={styles.monthlyLabel}>Last Month</Text>
          </View>
          <View style={styles.monthlyItem}>
            <Text
              style={[
                styles.monthlyValue,
                stats.thisMonthLogs > stats.lastMonthLogs
                  ? styles.positive
                  : styles.negative,
              ]}
            >
              {stats.thisMonthLogs > stats.lastMonthLogs ? "↑" : "↓"}
              {Math.abs(stats.thisMonthLogs - stats.lastMonthLogs)}
            </Text>
            <Text style={styles.monthlyLabel}>Change</Text>
          </View>
        </View>
      </View>

      {/* Health Score */}
      <View style={[styles.card, styles.healthCard]}>
        <Text style={styles.cardTitle}>🏥 Health Report</Text>
        <View style={styles.healthScore}>
          <Text style={styles.healthScoreValue}>85</Text>
          <Text style={styles.healthScoreLabel}>Gut Score</Text>
        </View>
        <Text style={styles.healthMessage}>
          Your digestive health looks good! Your average Bristol type of{" "}
          {stats.avgBristol.toFixed(1)}
          is close to the ideal range (3-4). Keep up the good fiber intake!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF5",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  headerStats: {
    flexDirection: "row",
    backgroundColor: "#8B5A2B",
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
  },
  mainStat: {
    flex: 1,
    alignItems: "center",
  },
  mainStatValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
  },
  mainStatLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  mainStatDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginHorizontal: 16,
  },
  card: {
    backgroundColor: "#FFF8F0",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E8DDD4",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A3728",
    marginBottom: 16,
  },
  streakRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  streakItem: {
    alignItems: "center",
  },
  streakValue: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#E65100",
  },
  streakLabel: {
    fontSize: 14,
    color: "#8B7355",
  },
  avgRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  avgItem: {
    alignItems: "center",
  },
  avgEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  avgValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A3728",
  },
  avgLabel: {
    fontSize: 12,
    color: "#8B7355",
  },
  timeGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeItem: {
    alignItems: "center",
    flex: 1,
  },
  timeEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  timeCount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4A3728",
  },
  timeLabel: {
    fontSize: 11,
    color: "#8B7355",
  },
  bristolChart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 150,
  },
  bristolBar: {
    flex: 1,
    alignItems: "center",
  },
  bristolCount: {
    fontSize: 12,
    color: "#8B7355",
    marginBottom: 4,
  },
  barContainer: {
    width: 24,
    height: 80,
    backgroundColor: "#E8DDD4",
    borderRadius: 4,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  bar: {
    width: "100%",
    backgroundColor: "#8B5A2B",
    borderRadius: 4,
  },
  barIdeal: {
    backgroundColor: "#4CAF50",
  },
  bristolEmoji: {
    fontSize: 20,
    marginTop: 4,
  },
  bristolType: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4A3728",
  },
  monthlyRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  monthlyItem: {
    alignItems: "center",
  },
  monthlyValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4A3728",
  },
  monthlyLabel: {
    fontSize: 12,
    color: "#8B7355",
  },
  positive: {
    color: "#4CAF50",
  },
  negative: {
    color: "#E53935",
  },
  healthCard: {
    backgroundColor: "#E8F5E9",
    borderColor: "#A5D6A7",
  },
  healthScore: {
    alignItems: "center",
    marginBottom: 12,
  },
  healthScoreValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  healthScoreLabel: {
    fontSize: 14,
    color: "#388E3C",
  },
  healthMessage: {
    fontSize: 14,
    color: "#1B5E20",
    lineHeight: 20,
    textAlign: "center",
  },
});
