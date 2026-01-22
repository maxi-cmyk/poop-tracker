import { HealthAlert, MonthlyStats } from "@/types";
import React, { useState } from "react";
import {
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function MonthlyReportScreen() {
  // Mock data - will be generated from actual logs
  const [report] = useState<MonthlyStats>({
    month: new Date().toISOString(),
    total_logs: 47,
    total_duration_seconds: 8400, // 2h 20m
    avg_duration_seconds: 179, // ~3 mins
    avg_bristol_type: 3.8,
    most_common_time: "9 AM",
    achievements_unlocked: 3,
    health_score: 82,
    health_alerts: [
      {
        type: "info",
        message: "Your average Bristol type is close to ideal!",
        recommendation: "Keep up the good fiber and hydration habits.",
      },
    ],
  });

  const monthName = new Date(report.month).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} min`;
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "#4CAF50";
    if (score >= 60) return "#FFC107";
    return "#F44336";
  };

  const getAlertStyle = (type: HealthAlert["type"]) => {
    switch (type) {
      case "caution":
        return { bg: "#FFEBEE", border: "#EF5350", text: "#C62828" };
      case "warning":
        return { bg: "#FFF3E0", border: "#FF9800", text: "#E65100" };
      default:
        return { bg: "#E8F5E9", border: "#4CAF50", text: "#2E7D32" };
    }
  };

  const shareReport = async () => {
    try {
      await Share.share({
        message:
          `📊 My PooPals ${monthName} Wrapped!\n\n` +
          `💩 ${report.total_logs} logs\n` +
          `⏱ ${formatDuration(report.total_duration_seconds)} total throne time\n` +
          `📈 Health Score: ${report.health_score}/100\n` +
          `🏆 ${report.achievements_unlocked} achievements unlocked\n\n` +
          `#PooPals #MonthlyWrapped`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>📊</Text>
        <Text style={styles.headerTitle}>{monthName}</Text>
        <Text style={styles.headerSubtitle}>Monthly Wrapped</Text>
      </View>

      {/* Health Score Circle */}
      <View style={styles.scoreSection}>
        <View
          style={[
            styles.scoreCircle,
            { borderColor: getHealthScoreColor(report.health_score) },
          ]}
        >
          <Text
            style={[
              styles.scoreValue,
              { color: getHealthScoreColor(report.health_score) },
            ]}
          >
            {report.health_score}
          </Text>
          <Text style={styles.scoreLabel}>Health Score</Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>💩</Text>
          <Text style={styles.statValue}>{report.total_logs}</Text>
          <Text style={styles.statLabel}>Total Logs</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>⏱</Text>
          <Text style={styles.statValue}>
            {formatDuration(report.total_duration_seconds)}
          </Text>
          <Text style={styles.statLabel}>Throne Time</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>📏</Text>
          <Text style={styles.statValue}>
            {formatDuration(report.avg_duration_seconds)}
          </Text>
          <Text style={styles.statLabel}>Avg Session</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>📊</Text>
          <Text style={styles.statValue}>{report.avg_bristol_type}</Text>
          <Text style={styles.statLabel}>Avg Bristol</Text>
        </View>
      </View>

      {/* Highlight Cards */}
      <View style={styles.highlights}>
        <View style={styles.highlightCard}>
          <Text style={styles.highlightEmoji}>🕐</Text>
          <View>
            <Text style={styles.highlightLabel}>Peak Poop Time</Text>
            <Text style={styles.highlightValue}>{report.most_common_time}</Text>
          </View>
        </View>
        <View style={styles.highlightCard}>
          <Text style={styles.highlightEmoji}>🏆</Text>
          <View>
            <Text style={styles.highlightLabel}>Achievements</Text>
            <Text style={styles.highlightValue}>
              {report.achievements_unlocked} Unlocked
            </Text>
          </View>
        </View>
      </View>

      {/* Health Alerts */}
      {report.health_alerts.length > 0 && (
        <View style={styles.alertsSection}>
          <Text style={styles.sectionTitle}>🏥 Health Insights</Text>
          {report.health_alerts.map((alert, index) => {
            const alertStyle = getAlertStyle(alert.type);
            return (
              <View
                key={index}
                style={[
                  styles.alertCard,
                  {
                    backgroundColor: alertStyle.bg,
                    borderLeftColor: alertStyle.border,
                  },
                ]}
              >
                <Text style={[styles.alertMessage, { color: alertStyle.text }]}>
                  {alert.message}
                </Text>
                {alert.recommendation && (
                  <Text
                    style={[
                      styles.alertRecommendation,
                      { color: alertStyle.text },
                    ]}
                  >
                    💡 {alert.recommendation}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      )}

      {/* Fun Comparison */}
      <View style={styles.funFact}>
        <Text style={styles.funFactEmoji}>🎬</Text>
        <Text style={styles.funFactText}>
          You spent enough time on the throne to watch{" "}
          {Math.floor(report.total_duration_seconds / 5400)} episodes of your
          favorite show!
        </Text>
      </View>

      {/* Share Button */}
      <TouchableOpacity style={styles.shareButton} onPress={shareReport}>
        <Text style={styles.shareButtonText}>📤 Share My Wrapped</Text>
      </TouchableOpacity>
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
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4A3728",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#8B7355",
  },
  scoreSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  scoreCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 8,
    backgroundColor: "#FFF8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: "bold",
  },
  scoreLabel: {
    fontSize: 14,
    color: "#8B7355",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    width: "47%",
    backgroundColor: "#FFF8F0",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8DDD4",
  },
  statEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A3728",
  },
  statLabel: {
    fontSize: 12,
    color: "#8B7355",
  },
  highlights: {
    gap: 12,
    marginBottom: 20,
  },
  highlightCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8F0",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E8DDD4",
    gap: 16,
  },
  highlightEmoji: {
    fontSize: 36,
  },
  highlightLabel: {
    fontSize: 12,
    color: "#8B7355",
  },
  highlightValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A3728",
  },
  alertsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A3728",
    marginBottom: 12,
  },
  alertCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  alertMessage: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  alertRecommendation: {
    fontSize: 13,
    opacity: 0.9,
  },
  funFact: {
    backgroundColor: "#E8F5E9",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  funFactEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  funFactText: {
    fontSize: 14,
    color: "#2E7D32",
    textAlign: "center",
    lineHeight: 20,
  },
  shareButton: {
    backgroundColor: "#8B5A2B",
    padding: 18,
    borderRadius: 30,
    alignItems: "center",
  },
  shareButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
