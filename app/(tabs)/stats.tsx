import { BRISTOL_DESCRIPTIONS } from "@/types";
import React, { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");

export default function StatsScreen() {
  // Mock data - will be replaced with Supabase data
  const [stats] = useState({
    totalLogs: 42,
    totalDuration: 7200, // seconds
    avgDuration: 171, // seconds
    avgBristol: 4.2,
    currentStreak: 7,
    longestStreak: 14,
    thisMonthLogs: 15,
    lastMonthLogs: 18,
  });

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Time of day distribution (mock data)
  const timeDistribution = [
    { time: "Morning", count: 12, emoji: "🌅" },
    { time: "Afternoon", count: 8, emoji: "☀️" },
    { time: "Evening", count: 15, emoji: "🌆" },
    { time: "Night", count: 7, emoji: "🌙" },
  ];

  // Bristol type distribution (mock)
  const bristolDistribution = [
    { type: 1, count: 2 },
    { type: 2, count: 5 },
    { type: 3, count: 8 },
    { type: 4, count: 18 },
    { type: 5, count: 6 },
    { type: 6, count: 2 },
    { type: 7, count: 1 },
  ];
  const maxBristolCount = Math.max(...bristolDistribution.map((b) => b.count));

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
