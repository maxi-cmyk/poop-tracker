import { ACHIEVEMENT_DEFINITIONS } from "@/lib/achievements";
import { AchievementType } from "@/types";
import React, { useState } from "react";
import {
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AchievementsScreen() {
  // Mock unlocked achievements - will be fetched from Supabase
  const [unlockedAchievements] = useState<AchievementType[]>([
    "first_flush",
    "speed_demon",
    "the_void",
  ]);

  const allAchievements = Object.entries(ACHIEVEMENT_DEFINITIONS) as [
    AchievementType,
    (typeof ACHIEVEMENT_DEFINITIONS)[AchievementType],
  ][];
  const unlockedCount = unlockedAchievements.length;
  const totalCount = allAchievements.length;
  const progressPercent = (unlockedCount / totalCount) * 100;

  const shareAchievements = async () => {
    try {
      await Share.share({
        message: `🏆 I've unlocked ${unlockedCount}/${totalCount} achievements on PooPals! 💩`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Progress Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏆 Achievements</Text>
        <Text style={styles.headerSubtitle}>
          {unlockedCount} of {totalCount} unlocked
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${progressPercent}%` }]}
          />
        </View>
      </View>

      {/* Achievement Grid */}
      <View style={styles.grid}>
        {allAchievements.map(([type, definition]) => {
          const isUnlocked = unlockedAchievements.includes(type);

          return (
            <View
              key={type}
              style={[
                styles.achievementCard,
                isUnlocked ? styles.cardUnlocked : styles.cardLocked,
              ]}
            >
              <Text style={[styles.emoji, !isUnlocked && styles.emojiLocked]}>
                {isUnlocked ? definition.emoji : "🔒"}
              </Text>
              <Text style={[styles.name, !isUnlocked && styles.textLocked]}>
                {definition.name}
              </Text>
              <Text
                style={[styles.description, !isUnlocked && styles.textLocked]}
              >
                {definition.description}
              </Text>
              {isUnlocked && (
                <View style={styles.unlockedBadge}>
                  <Text style={styles.unlockedText}>✓ Unlocked</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* Share Button */}
      <TouchableOpacity style={styles.shareButton} onPress={shareAchievements}>
        <Text style={styles.shareButtonText}>📤 Share Progress</Text>
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
    backgroundColor: "#8B5A2B",
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 16,
  },
  progressBar: {
    width: "100%",
    height: 12,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFD700",
    borderRadius: 6,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  achievementCard: {
    width: "47%",
    backgroundColor: "#FFF8F0",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 4,
    borderWidth: 2,
  },
  cardUnlocked: {
    borderColor: "#FFD700",
    backgroundColor: "#FFFEF5",
  },
  cardLocked: {
    borderColor: "#E8DDD4",
    opacity: 0.7,
  },
  emoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  emojiLocked: {
    opacity: 0.5,
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4A3728",
    textAlign: "center",
    marginBottom: 4,
  },
  description: {
    fontSize: 11,
    color: "#8B7355",
    textAlign: "center",
    lineHeight: 14,
  },
  textLocked: {
    color: "#B8A898",
  },
  unlockedBadge: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  unlockedText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  shareButton: {
    backgroundColor: "#8B5A2B",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
  },
  shareButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
