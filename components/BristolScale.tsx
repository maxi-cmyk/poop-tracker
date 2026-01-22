import { BRISTOL_DESCRIPTIONS, BristolType } from "@/types";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface BristolScaleProps {
  selected: BristolType | null;
  onSelect: (type: BristolType) => void;
}

export function BristolScale({ selected, onSelect }: BristolScaleProps) {
  const types: BristolType[] = [1, 2, 3, 4, 5, 6, 7];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bristol Stool Scale</Text>
      <Text style={styles.subtitle}>How would you describe it?</Text>

      <View style={styles.grid}>
        {types.map((type) => {
          const info = BRISTOL_DESCRIPTIONS[type];
          const isSelected = selected === type;

          return (
            <TouchableOpacity
              key={type}
              style={[
                styles.option,
                isSelected && styles.optionSelected,
                type === 4 && styles.optionIdeal,
              ]}
              onPress={() => onSelect(type)}
              activeOpacity={0.7}
            >
              <Text style={styles.emoji}>{info.emoji}</Text>
              <Text
                style={[styles.typeNumber, isSelected && styles.textSelected]}
              >
                Type {type}
              </Text>
              <Text
                style={[styles.typeName, isSelected && styles.textSelected]}
              >
                {info.name}
              </Text>
              <Text
                style={[styles.typeDesc, isSelected && styles.textSelected]}
                numberOfLines={2}
              >
                {info.description}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  option: {
    width: "47%",
    backgroundColor: "#FFF8F0",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E8DDD4",
    marginBottom: 10,
  },
  optionSelected: {
    backgroundColor: "#8B5A2B",
    borderColor: "#6B4423",
  },
  optionIdeal: {
    borderColor: "#4CAF50",
    borderWidth: 2,
  },
  emoji: {
    fontSize: 32,
    marginBottom: 6,
  },
  typeNumber: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B4423",
    marginBottom: 2,
  },
  typeName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4A3728",
    textAlign: "center",
    marginBottom: 4,
  },
  typeDesc: {
    fontSize: 11,
    color: "#8B7355",
    textAlign: "center",
  },
  textSelected: {
    color: "#FFF8F0",
  },
});
