import { PanicButton } from "@/components/PanicButton";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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

  // Quick stats state
  const [totalTime, setTotalTime] = useState(0);
  const [avgBristol, setAvgBristol] = useState("-");
  const [achievementCount, setAchievementCount] = useState(0);
  const [venuesRated, setVenuesRated] = useState(0);

  const fetchData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Fetch Streak
      const { data: streakData } = await supabase
        .from("streaks")
        .select("current_streak")
        .eq("user_id", user.id)
        .single();
      if (streakData) setStreak(streakData.current_streak);

      // 2. Fetch Today's Logs
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const { count: todayCount } = await supabase
        .from("poop_logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("logged_at", startOfDay.toISOString());
      setTodayLogs(todayCount || 0);

      // 3. Fetch Quick Stats
      // Total Time
      const { data: logs } = await supabase
        .from("poop_logs")
        .select("duration_seconds, bristol_type")
        .eq("user_id", user.id);

      if (logs) {
        const total = logs.reduce(
          (sum, log) => sum + (log.duration_seconds || 0),
          0,
        );
        setTotalTime(total);

        // Avg Bristol
        const avg =
          logs.length > 0
            ? (
                logs.reduce((sum, log) => sum + (log.bristol_type || 0), 0) /
                logs.length
              ).toFixed(1)
            : "-";
        setAvgBristol(avg.toString());
      }

      // Achievement Count
      const { count: achCount } = await supabase
        .from("user_achievements")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      setAchievementCount(achCount || 0);

      // Venues Rated
      const { count: venuesCount } = await supabase
        .from("venue_reviews")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      setVenuesRated(venuesCount || 0);
    } catch (error) {
      console.error("Error fetching home data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePanicPress = () => {
    router.push("/log");
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
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
            <Text style={styles.statValue}>{formatDuration(totalTime)}</Text>
            <Text style={styles.statLabel}>Total Throne Time</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>📊</Text>
            <Text style={styles.statValue}>{avgBristol}</Text>
            <Text style={styles.statLabel}>Avg Bristol</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🏆</Text>
            <Text style={styles.statValue}>{achievementCount}</Text>
            <Text style={styles.statLabel}>Achievements</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>📍</Text>
            <Text style={styles.statValue}>{venuesRated}</Text>
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
