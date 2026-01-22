import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface PhotoCaptureProps {
  poopPhoto: string | null;
  toiletPhoto: string | null;
  onPoopPhotoChange: (uri: string | null) => void;
  onToiletPhotoChange: (uri: string | null) => void;
}

export function PhotoCapture({
  poopPhoto,
  toiletPhoto,
  onPoopPhotoChange,
  onToiletPhotoChange,
}: PhotoCaptureProps) {
  const [showPoopPhoto, setShowPoopPhoto] = useState(false);

  const pickImage = async (type: "poop" | "toilet") => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Camera access is required to take photos.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0]) {
      if (type === "poop") {
        onPoopPhotoChange(result.assets[0].uri);
      } else {
        onToiletPhotoChange(result.assets[0].uri);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Photo Evidence</Text>
      <Text style={styles.subtitle}>Optional - add visual documentation</Text>

      <View style={styles.photoRow}>
        {/* Poop Photo */}
        <View style={styles.photoBox}>
          <Text style={styles.photoLabel}>💩 The Evidence</Text>
          {poopPhoto ? (
            <TouchableOpacity
              style={styles.photoPreview}
              onPress={() => setShowPoopPhoto(!showPoopPhoto)}
            >
              <Image source={{ uri: poopPhoto }} style={styles.photo} />
              {!showPoopPhoto && (
                <BlurView intensity={50} style={styles.blur}>
                  <Text style={styles.blurText}>👁 Tap to reveal</Text>
                </BlurView>
              )}
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => onPoopPhotoChange(null)}
              >
                <Text style={styles.removeBtnText}>✕</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.addPhotoBtn}
              onPress={() => pickImage("poop")}
            >
              <Text style={styles.addPhotoEmoji}>📸</Text>
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Toilet Photo */}
        <View style={styles.photoBox}>
          <Text style={styles.photoLabel}>🚽 The Venue</Text>
          {toiletPhoto ? (
            <View style={styles.photoPreview}>
              <Image source={{ uri: toiletPhoto }} style={styles.photo} />
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => onToiletPhotoChange(null)}
              >
                <Text style={styles.removeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addPhotoBtn}
              onPress={() => pickImage("toilet")}
            >
              <Text style={styles.addPhotoEmoji}>📸</Text>
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Text style={styles.disclaimer}>
        🔒 Poop photos are automatically blurred in the social feed
      </Text>
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
  photoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  photoBox: {
    flex: 1,
  },
  photoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A3728",
    marginBottom: 8,
    textAlign: "center",
  },
  photoPreview: {
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  blur: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  blurText: {
    color: "white",
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  removeBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  removeBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  addPhotoBtn: {
    aspectRatio: 1,
    backgroundColor: "#FFF8F0",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E8DDD4",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  addPhotoEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  addPhotoText: {
    fontSize: 14,
    color: "#8B7355",
  },
  disclaimer: {
    fontSize: 12,
    color: "#8B7355",
    textAlign: "center",
    marginTop: 12,
    fontStyle: "italic",
  },
});
