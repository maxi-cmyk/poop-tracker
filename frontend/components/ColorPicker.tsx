import { COLOR_INFO, StoolColor } from "@/types";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ColorPickerProps {
  selected: StoolColor | null;
  onSelect: (color: StoolColor) => void;
}

export function ColorPicker({ selected, onSelect }: ColorPickerProps) {
  const colors: StoolColor[] = [
    "brown",
    "dark-brown",
    "light-brown",
    "green",
    "yellow",
    "black",
    "red",
    "white",
  ];

  const selectedInfo = selected ? COLOR_INFO[selected] : null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Color</Text>
      <Text style={styles.subtitle}>What color was it?</Text>

      <View style={styles.grid}>
        {colors.map((color) => {
          const info = COLOR_INFO[color];
          const isSelected = selected === color;
          const isWarning = !!info.warning;

          return (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorOption,
                isSelected && styles.colorSelected,
                isWarning && styles.colorWarning,
              ]}
              onPress={() => onSelect(color)}
              activeOpacity={0.7}
            >
              <View style={[styles.colorCircle, { backgroundColor: info.hex }]}>
                {isSelected && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.colorName}>{info.name}</Text>
              {isWarning && <Text style={styles.warningIcon}>⚠️</Text>}
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedInfo?.warning && (
        <View style={styles.warningBox}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningText}>{selectedInfo.warning}</Text>
        </View>
      )}
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
  colorOption: {
    width: "23%",
    alignItems: "center",
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#FFF8F0",
    borderWidth: 2,
    borderColor: "#E8DDD4",
  },
  colorSelected: {
    borderColor: "#8B5A2B",
    backgroundColor: "#FFF0E0",
  },
  colorWarning: {
    borderColor: "#FFA500",
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 6,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.1)",
  },
  checkmark: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  colorName: {
    fontSize: 10,
    color: "#4A3728",
    textAlign: "center",
  },
  warningIcon: {
    fontSize: 12,
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3CD",
    padding: 12,
    borderRadius: 10,
    marginTop: 16,
    gap: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: "#856404",
  },
});
