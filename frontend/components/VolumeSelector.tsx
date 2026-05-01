import { VOLUME_DESCRIPTIONS, VolumeSize } from "@/types";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface VolumeSelectorProps {
  selected: VolumeSize | null;
  onSelect: (size: VolumeSize) => void;
}

export function VolumeSelector({ selected, onSelect }: VolumeSelectorProps) {
  const sizes: VolumeSize[] = ["small", "medium", "large", "massive"];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Volume</Text>
      <Text style={styles.subtitle}>How much are we talking?</Text>

      <View style={styles.row}>
        {sizes.map((size) => {
          const info = VOLUME_DESCRIPTIONS[size];
          const isSelected = selected === size;

          return (
            <TouchableOpacity
              key={size}
              style={[styles.option, isSelected && styles.optionSelected]}
              onPress={() => onSelect(size)}
              activeOpacity={0.7}
            >
              <Text style={[styles.emoji, { fontSize: getSizeEmoji(size) }]}>
                {info.emoji}
              </Text>
              <Text
                style={[styles.sizeName, isSelected && styles.textSelected]}
              >
                {info.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function getSizeEmoji(size: VolumeSize): number {
  switch (size) {
    case "small":
      return 20;
    case "medium":
      return 26;
    case "large":
      return 32;
    case "massive":
      return 40;
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A3728",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#8B7355",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  option: {
    flex: 1,
    backgroundColor: "#FFF8F0",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E8DDD4",
  },
  optionSelected: {
    backgroundColor: "#8B5A2B",
    borderColor: "#6B4423",
  },
  emoji: {
    marginBottom: 8,
  },
  sizeName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4A3728",
  },
  textSelected: {
    color: "#FFF8F0",
  },
});
