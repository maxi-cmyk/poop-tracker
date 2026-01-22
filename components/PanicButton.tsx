import * as Haptics from "expo-haptics";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface PanicButtonProps {
  onPress: () => void;
  isActive?: boolean;
}

export function PanicButton({ onPress, isActive = false }: PanicButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onPress();
  };

  return (
    <TouchableOpacity
      style={[styles.button, isActive && styles.buttonActive]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Text style={styles.emoji}>💩</Text>
      <Text style={styles.text}>
        {isActive ? "SESSION ACTIVE" : "PANIC BUTTON"}
      </Text>
      <Text style={styles.subtext}>
        {isActive ? "Tap to view session" : "Tap to start logging"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#8B5A2B",
    paddingVertical: 40,
    paddingHorizontal: 60,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4A3728",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 4,
    borderColor: "#6B4423",
  },
  buttonActive: {
    backgroundColor: "#4CAF50",
    borderColor: "#388E3C",
  },
  emoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  text: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  subtext: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    marginTop: 4,
  },
});
