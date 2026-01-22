import { PanicButton } from "@/components/PanicButton";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [streak, setStreak] = useState(0);
  const [todayLogs, setTodayLogs] = useState(0);

  const handlePanicPress = () => {
    router.push("/log");
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Fetch latest data from Supabase
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.greeting}>Welcome back! 👋</Text>
        <Text style={styles.subtitle}>Ready for today's session?</Text>
      </View>

      {/* Streak Card */}
      <View style={styles.streakCard}>
        <Text style={styles.streakEmoji}>🔥</Text>
        <View style={styles.streakInfo}>
          <Text style={styles.streakNumber}>{streak}</Text>
          <Text style={styles.streakLabel}>Day Streak</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.streakInfo}>
          <Text style={styles.streakNumber}>{todayLogs}</Text>
          <Text style={styles.streakLabel}>Today's Logs</Text>
        </View>
      </View>

      {/* Panic Button */}
      <View style={styles.panicContainer}>
        <PanicButton onPress={handlePanicPress} isActive={isSessionActive} />
      </View>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        <Text style={styles.sectionTitle}>Quick Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>⏱</Text>
            <Text style={styles.statValue}>0h 0m</Text>
            <Text style={styles.statLabel}>Total Throne Time</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>📊</Text>
            <Text style={styles.statValue}>--</Text>
            <Text style={styles.statLabel}>Avg Bristol</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🏆</Text>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Achievements</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>📍</Text>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Venues Rated</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push("/achievements")}
          >
            <Text style={styles.actionEmoji}>🏆</Text>
            <Text style={styles.actionText}>Achievements</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push("/monthly-report")}
          >
            <Text style={styles.actionEmoji}>📊</Text>
            <Text style={styles.actionText}>Monthly Report</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tips Section */}
      <View style={styles.tipsSection}>
        <Text style={styles.sectionTitle}>💡 Health Tip</Text>
        <View style={styles.tipCard}>
          <Text style={styles.tipText}>
            The ideal stool type is Bristol 3-4. Regular fiber intake and
            hydration can help maintain healthy bowel movements!
          </Text>
        </View>
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
    padding: 20,
    paddingBottom: 40,
  },
  welcomeSection: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4A3728",
  },
  subtitle: {
    fontSize: 16,
    color: "#8B7355",
    marginTop: 4,
  },
  streakCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8F0",
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
    shadowColor: "#4A3728",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  streakEmoji: {
    fontSize: 40,
    marginRight: 16,
  },
  streakInfo: {
    flex: 1,
    alignItems: "center",
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#8B5A2B",
  },
  streakLabel: {
    fontSize: 12,
    color: "#8B7355",
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: "#E8DDD4",
    marginHorizontal: 16,
  },
  panicContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  quickStats: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4A3728",
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  statCard: {
    width: "47%",
    backgroundColor: "#FFF8F0",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8DDD4",
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4A3728",
  },
  statLabel: {
    fontSize: 12,
    color: "#8B7355",
    textAlign: "center",
  },
  tipsSection: {
    marginBottom: 20,
  },
  tipCard: {
    backgroundColor: "#E8F5E9",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  tipText: {
    fontSize: 14,
    color: "#2E7D32",
    lineHeight: 20,
  },
  quickActions: {
    marginBottom: 24,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: "#8B5A2B",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#4A3728",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  actionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
});
