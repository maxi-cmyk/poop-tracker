import { BlurView } from "expo-blur";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface FeedItem {
  id: string;
  username: string;
  pooDonym: string;
  avatar: string;
  bristolType: number;
  volume: string;
  duration: number;
  loggedAt: string;
  hasPoop: boolean;
}

interface Friend {
  id: string;
  username: string;
  pooDonym: string;
  streak: number;
  isOnline: boolean;
}

export default function SocialScreen() {
  const [activeTab, setActiveTab] = useState<
    "feed" | "leaderboard" | "friends"
  >("feed");
  const [privacyMode, setPrivacyMode] = useState(true);

  // Mock data
  const [feedItems] = useState<FeedItem[]>([
    {
      id: "1",
      username: "john_doe",
      pooDonym: "The Duke",
      avatar: "👨",
      bristolType: 4,
      volume: "medium",
      duration: 180,
      loggedAt: "10 mins ago",
      hasPoop: true,
    },
    {
      id: "2",
      username: "jane_smith",
      pooDonym: "Queen of Thrones",
      avatar: "👩",
      bristolType: 3,
      volume: "large",
      duration: 420,
      loggedAt: "1 hour ago",
      hasPoop: false,
    },
    {
      id: "3",
      username: "bob_wilson",
      pooDonym: "Sir Logs-a-Lot",
      avatar: "🧔",
      bristolType: 5,
      volume: "small",
      duration: 60,
      loggedAt: "2 hours ago",
      hasPoop: true,
    },
  ]);

  const [friends] = useState<Friend[]>([
    {
      id: "1",
      username: "john_doe",
      pooDonym: "The Duke",
      streak: 14,
      isOnline: true,
    },
    {
      id: "2",
      username: "jane_smith",
      pooDonym: "Queen of Thrones",
      streak: 7,
      isOnline: false,
    },
    {
      id: "3",
      username: "bob_wilson",
      pooDonym: "Sir Logs-a-Lot",
      streak: 23,
      isOnline: true,
    },
  ]);

  const leaderboards = {
    sprinter: [
      { rank: 1, name: "SpeedyGonzales", time: "0:42", emoji: "⚡" },
      { rank: 2, name: "QuickDraw", time: "0:58", emoji: "🏃" },
      { rank: 3, name: "FlashPoop", time: "1:05", emoji: "💨" },
    ],
    marathoner: [
      { rank: 1, name: "PhilosoPher", time: "2h 15m", emoji: "📚" },
      { rank: 2, name: "DeepThinker", time: "1h 45m", emoji: "🤔" },
      { rank: 3, name: "ZenMaster", time: "1h 30m", emoji: "🧘" },
    ],
    heavyweight: [
      { rank: 1, name: "MegaLoad", count: 156, emoji: "🪵" },
      { rank: 2, name: "BigBoi", count: 134, emoji: "💪" },
      { rank: 3, name: "ChunkMaster", count: 98, emoji: "🏋️" },
    ],
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      {/* Privacy Toggle */}
      <View style={styles.privacyBar}>
        <Text style={styles.privacyText}>
          {privacyMode ? "🔒 Privacy Mode On" : "👀 Full View"}
        </Text>
        <TouchableOpacity
          style={[
            styles.privacyToggle,
            !privacyMode && styles.privacyToggleOff,
          ]}
          onPress={() => setPrivacyMode(!privacyMode)}
        >
          <Text style={styles.privacyToggleText}>
            {privacyMode ? "Show All" : "Blur"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Buttons */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "feed" && styles.tabActive]}
          onPress={() => setActiveTab("feed")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "feed" && styles.tabTextActive,
            ]}
          >
            📰 Feed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "leaderboard" && styles.tabActive]}
          onPress={() => setActiveTab("leaderboard")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "leaderboard" && styles.tabTextActive,
            ]}
          >
            🏆 Leaderboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "friends" && styles.tabActive]}
          onPress={() => setActiveTab("friends")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "friends" && styles.tabTextActive,
            ]}
          >
            👥 Friends
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Feed Tab */}
        {activeTab === "feed" && (
          <>
            {feedItems.map((item) => (
              <View key={item.id} style={styles.feedCard}>
                {privacyMode && (
                  <BlurView intensity={20} style={styles.blurOverlay}>
                    <Text style={styles.blurText}>Tap to reveal 👀</Text>
                  </BlurView>
                )}
                <View style={styles.feedHeader}>
                  <Text style={styles.avatar}>{item.avatar}</Text>
                  <View style={styles.feedUserInfo}>
                    <Text style={styles.pooDonym}>{item.pooDonym}</Text>
                    <Text style={styles.feedTime}>{item.loggedAt}</Text>
                  </View>
                </View>
                <View style={styles.feedContent}>
                  <View style={styles.feedStat}>
                    <Text style={styles.feedStatLabel}>Bristol</Text>
                    <Text style={styles.feedStatValue}>
                      Type {item.bristolType}
                    </Text>
                  </View>
                  <View style={styles.feedStat}>
                    <Text style={styles.feedStatLabel}>Volume</Text>
                    <Text style={styles.feedStatValue}>{item.volume}</Text>
                  </View>
                  <View style={styles.feedStat}>
                    <Text style={styles.feedStatLabel}>Duration</Text>
                    <Text style={styles.feedStatValue}>
                      {formatDuration(item.duration)}
                    </Text>
                  </View>
                </View>
                <View style={styles.feedActions}>
                  <TouchableOpacity style={styles.feedAction}>
                    <Text>💩 Nice!</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.feedAction}>
                    <Text>💬 Comment</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Leaderboard Tab */}
        {activeTab === "leaderboard" && (
          <>
            {/* The Sprinter */}
            <View style={styles.leaderboardSection}>
              <Text style={styles.leaderboardTitle}>⚡ The Sprinter</Text>
              <Text style={styles.leaderboardSubtitle}>Fastest sessions</Text>
              {leaderboards.sprinter.map((entry) => (
                <View key={entry.rank} style={styles.leaderboardEntry}>
                  <Text style={styles.leaderboardRank}>
                    {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : "🥉"}
                  </Text>
                  <Text style={styles.leaderboardName}>{entry.name}</Text>
                  <Text style={styles.leaderboardValue}>{entry.time}</Text>
                </View>
              ))}
            </View>

            {/* The Marathoner */}
            <View style={styles.leaderboardSection}>
              <Text style={styles.leaderboardTitle}>🏃 The Marathoner</Text>
              <Text style={styles.leaderboardSubtitle}>
                Longest total throne time
              </Text>
              {leaderboards.marathoner.map((entry) => (
                <View key={entry.rank} style={styles.leaderboardEntry}>
                  <Text style={styles.leaderboardRank}>
                    {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : "🥉"}
                  </Text>
                  <Text style={styles.leaderboardName}>{entry.name}</Text>
                  <Text style={styles.leaderboardValue}>{entry.time}</Text>
                </View>
              ))}
            </View>

            {/* The Heavyweight */}
            <View style={styles.leaderboardSection}>
              <Text style={styles.leaderboardTitle}>🏋️ The Heavyweight</Text>
              <Text style={styles.leaderboardSubtitle}>
                Most "massive" volume logs
              </Text>
              {leaderboards.heavyweight.map((entry) => (
                <View key={entry.rank} style={styles.leaderboardEntry}>
                  <Text style={styles.leaderboardRank}>
                    {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : "🥉"}
                  </Text>
                  <Text style={styles.leaderboardName}>{entry.name}</Text>
                  <Text style={styles.leaderboardValue}>{entry.count}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Friends Tab */}
        {activeTab === "friends" && (
          <>
            {/* Add Friend */}
            <View style={styles.addFriendSection}>
              <TextInput
                style={styles.addFriendInput}
                placeholder="Enter username or poo-donym..."
                placeholderTextColor="#8B7355"
              />
              <TouchableOpacity style={styles.addFriendButton}>
                <Text style={styles.addFriendButtonText}>Add</Text>
              </TouchableOpacity>
            </View>

            {/* Online Now */}
            <Text style={styles.sectionTitle}>🟢 Currently on the Throne</Text>
            {friends
              .filter((f) => f.isOnline)
              .map((friend) => (
                <View
                  key={friend.id}
                  style={[styles.friendCard, styles.friendOnline]}
                >
                  <View style={styles.onlineDot} />
                  <View style={styles.friendInfo}>
                    <Text style={styles.friendName}>{friend.pooDonym}</Text>
                    <Text style={styles.friendUsername}>
                      @{friend.username}
                    </Text>
                  </View>
                  <View style={styles.friendStreak}>
                    <Text style={styles.streakText}>🔥 {friend.streak}</Text>
                  </View>
                  <TouchableOpacity style={styles.nudgeButton}>
                    <Text style={styles.nudgeText}>👋 Nudge</Text>
                  </TouchableOpacity>
                </View>
              ))}

            {/* All Friends */}
            <Text style={styles.sectionTitle}>👥 All Friends</Text>
            {friends.map((friend) => (
              <View key={friend.id} style={styles.friendCard}>
                <View
                  style={[
                    styles.statusDot,
                    friend.isOnline && styles.onlineDot,
                  ]}
                />
                <View style={styles.friendInfo}>
                  <Text style={styles.friendName}>{friend.pooDonym}</Text>
                  <Text style={styles.friendUsername}>@{friend.username}</Text>
                </View>
                <View style={styles.friendStreak}>
                  <Text style={styles.streakText}>🔥 {friend.streak}</Text>
                </View>
              </View>
            ))}

            {/* Sync Poop Alert */}
            <View style={styles.syncPoopCard}>
              <Text style={styles.syncPoopEmoji}>💩🤝💩</Text>
              <Text style={styles.syncPoopTitle}>Sync Poop!</Text>
              <Text style={styles.syncPoopText}>
                Get notified when a friend is pooping at the same time as you!
              </Text>
              <TouchableOpacity style={styles.syncPoopButton}>
                <Text style={styles.syncPoopButtonText}>Enable</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF5",
  },
  privacyBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#FFF8F0",
    borderBottomWidth: 1,
    borderBottomColor: "#E8DDD4",
  },
  privacyText: {
    fontSize: 14,
    color: "#4A3728",
    fontWeight: "600",
  },
  privacyToggle: {
    backgroundColor: "#8B5A2B",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  privacyToggleOff: {
    backgroundColor: "#4CAF50",
  },
  privacyToggleText: {
    color: "white",
    fontWeight: "600",
    fontSize: 12,
  },
  tabs: {
    flexDirection: "row",
    padding: 12,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#FFF8F0",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8DDD4",
  },
  tabActive: {
    backgroundColor: "#8B5A2B",
    borderColor: "#6B4423",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8B7355",
  },
  tabTextActive: {
    color: "white",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  feedCard: {
    backgroundColor: "#FFF8F0",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E8DDD4",
    position: "relative",
    overflow: "hidden",
  },
  blurOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    borderRadius: 16,
  },
  blurText: {
    color: "#4A3728",
    fontWeight: "bold",
    fontSize: 16,
  },
  feedHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    fontSize: 36,
    marginRight: 12,
  },
  feedUserInfo: {
    flex: 1,
  },
  pooDonym: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A3728",
  },
  feedTime: {
    fontSize: 12,
    color: "#8B7355",
  },
  feedContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFFAF5",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  feedStat: {
    alignItems: "center",
  },
  feedStatLabel: {
    fontSize: 11,
    color: "#8B7355",
  },
  feedStatValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4A3728",
  },
  feedActions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  feedAction: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  leaderboardSection: {
    backgroundColor: "#FFF8F0",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E8DDD4",
  },
  leaderboardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A3728",
  },
  leaderboardSubtitle: {
    fontSize: 12,
    color: "#8B7355",
    marginBottom: 12,
  },
  leaderboardEntry: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#E8DDD4",
  },
  leaderboardRank: {
    fontSize: 20,
    width: 40,
  },
  leaderboardName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#4A3728",
  },
  leaderboardValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#8B5A2B",
  },
  addFriendSection: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  addFriendInput: {
    flex: 1,
    backgroundColor: "#FFF8F0",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: "#4A3728",
    borderWidth: 1,
    borderColor: "#E8DDD4",
  },
  addFriendButton: {
    backgroundColor: "#8B5A2B",
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: "center",
  },
  addFriendButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A3728",
    marginBottom: 12,
    marginTop: 8,
  },
  friendCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8F0",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E8DDD4",
  },
  friendOnline: {
    borderColor: "#4CAF50",
    backgroundColor: "#F1F8E9",
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E8DDD4",
    marginRight: 12,
  },
  onlineDot: {
    backgroundColor: "#4CAF50",
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4A3728",
  },
  friendUsername: {
    fontSize: 12,
    color: "#8B7355",
  },
  friendStreak: {
    marginRight: 12,
  },
  streakText: {
    fontSize: 14,
    fontWeight: "600",
  },
  nudgeButton: {
    backgroundColor: "#8B5A2B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  nudgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  syncPoopCard: {
    backgroundColor: "#E8F5E9",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#A5D6A7",
  },
  syncPoopEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  syncPoopTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 4,
  },
  syncPoopText: {
    fontSize: 14,
    color: "#388E3C",
    textAlign: "center",
    marginBottom: 12,
  },
  syncPoopButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  syncPoopButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
