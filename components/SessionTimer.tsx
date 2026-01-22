import { TOILET_FUN_FACTS } from "@/types";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface SessionTimerProps {
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  elapsedSeconds: number;
}

export function SessionTimer({
  isRunning,
  onStart,
  onStop,
  elapsedSeconds,
}: SessionTimerProps) {
  const [funFact, setFunFact] = useState("");
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Show a fun fact when timer is running
    if (isRunning) {
      const randomFact =
        TOILET_FUN_FACTS[Math.floor(Math.random() * TOILET_FUN_FACTS.length)];
      setFunFact(randomFact);

      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [isRunning]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Session Timer</Text>

      <Animated.View
        style={[styles.timerCircle, { transform: [{ scale: pulseAnim }] }]}
      >
        <Text style={styles.timerText}>{formatTime(elapsedSeconds)}</Text>
        <Text style={styles.timerLabel}>
          {isRunning ? "🚽 In Progress..." : "Ready"}
        </Text>
      </Animated.View>

      <TouchableOpacity
        style={[
          styles.button,
          isRunning ? styles.stopButton : styles.startButton,
        ]}
        onPress={isRunning ? onStop : onStart}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          {isRunning ? "⏹ Stop Timer" : "▶️ Start Session"}
        </Text>
      </TouchableOpacity>

      {isRunning && funFact && (
        <View style={styles.funFactBox}>
          <Text style={styles.funFactTitle}>📖 Did you know?</Text>
          <Text style={styles.funFactText}>{funFact}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A3728",
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  timerCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#FFF8F0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 6,
    borderColor: "#8B5A2B",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  timerText: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#4A3728",
    fontVariant: ["tabular-nums"],
  },
  timerLabel: {
    fontSize: 14,
    color: "#8B7355",
    marginTop: 4,
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    minWidth: 200,
    alignItems: "center",
  },
  startButton: {
    backgroundColor: "#4CAF50",
  },
  stopButton: {
    backgroundColor: "#E53935",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  funFactBox: {
    backgroundColor: "#E8F5E9",
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    width: "100%",
  },
  funFactTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 6,
  },
  funFactText: {
    fontSize: 14,
    color: "#1B5E20",
    lineHeight: 20,
  },
});
