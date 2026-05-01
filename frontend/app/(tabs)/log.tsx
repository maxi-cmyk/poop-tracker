import { BristolScale } from "@/components/BristolScale";
import { ColorPicker } from "@/components/ColorPicker";
import { PhotoCapture } from "@/components/PhotoCapture";
import { SessionTimer } from "@/components/SessionTimer";
import { VolumeSelector } from "@/components/VolumeSelector";
import { uploadPhoto } from "@/lib/storage";
import { supabase } from "@/lib/supabase";
import { BristolType, COLOR_INFO, StoolColor, VolumeSize } from "@/types";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LogScreen() {
  // Timer state
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Log data
  const [bristolType, setBristolType] = useState<BristolType | null>(null);
  const [volume, setVolume] = useState<VolumeSize | null>(null);
  const [color, setColor] = useState<StoolColor | null>(null);
  const [notes, setNotes] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [poopPhoto, setPoopPhoto] = useState<string | null>(null);
  const [toiletPhoto, setToiletPhoto] = useState<string | null>(null);

  // Timer logic
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const startTimer = () => {
    setIsTimerRunning(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleFlush = async () => {
    if (!bristolType || !volume || !color) {
      Alert.alert(
        "Incomplete Log",
        "Please select Bristol type, volume, and color.",
      );
      return;
    }

    // Check for health warnings
    const colorInfo = COLOR_INFO[color];
    if (
      colorInfo.warning &&
      (color === "black" || color === "red" || color === "white")
    ) {
      Alert.alert(
        "⚠️ Health Alert",
        `${colorInfo.warning}\n\nPlease consult a healthcare provider if this persists.`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Log Anyway", onPress: submitLog },
        ],
      );
      return;
    }

    submitLog();
  };

  const submitLog = async () => {
    // Haptic feedback for successful flush
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert("Error", "You must be logged in to save logs.");
        return;
      }

      let uploadedPoopUrl = null;
      let uploadedToiletUrl = null;

      // Upload photos if present
      if (poopPhoto) {
        uploadedPoopUrl = await uploadPhoto(poopPhoto, user.id, "poop");
      }
      if (toiletPhoto) {
        uploadedToiletUrl = await uploadPhoto(toiletPhoto, user.id, "toilet");
      }

      const logData = {
        user_id: user.id,
        bristol_type: bristolType,
        volume,
        color,
        duration_seconds: elapsedSeconds,
        notes,
        is_public: isPublic,
        poop_photo_url: uploadedPoopUrl,
        toilet_photo_url: uploadedToiletUrl,
        logged_at: new Date().toISOString(),
      };

      console.log("Submitting log:", logData);

      const { error } = await supabase.from("poop_logs").insert(logData);

      if (error) throw error;

      // Check for Streak update
      const today = new Date().toISOString().split("T")[0];
      const { data: streak } = await supabase
        .from("streaks")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (streak) {
        if (streak.last_log_date !== today) {
          // Logic for streak counting would be more complex (consecutive days), simplified for now
          // Just increment for demo purposes if not logged today
          const { error: streakError } = await supabase
            .from("streaks")
            .update({
              current_streak: streak.current_streak + 1,
              last_log_date: today,
            })
            .eq("user_id", user.id);
        }
      } else {
        // Create initial streak record via trigger or manual insert if trigger fails
        // Our schema has a trigger for new *user* but handling existing users?
        // Insert if missing
        await supabase.from("streaks").upsert({
          user_id: user.id,
          current_streak: 1,
          last_log_date: today,
          longest_streak: 1,
        });
      }

      Alert.alert("🚽 Flushed!", "Your log has been recorded successfully.", [
        { text: "Great!", onPress: resetForm },
      ]);
    } catch (error) {
      console.error("Submission error:", error);
      Alert.alert("Error", "Failed to save your log. Please try again.");
    }
  };

  const resetForm = () => {
    setBristolType(null);
    setVolume(null);
    setColor(null);
    setNotes("");
    setElapsedSeconds(0);
    setIsTimerRunning(false);
    setPoopPhoto(null);
    setToiletPhoto(null);
  };

  const isFormValid = bristolType && volume && color;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Timer Section */}
      <SessionTimer
        isRunning={isTimerRunning}
        onStart={startTimer}
        onStop={stopTimer}
        elapsedSeconds={elapsedSeconds}
      />

      <View style={styles.divider} />

      {/* Bristol Scale */}
      <BristolScale selected={bristolType} onSelect={setBristolType} />

      <View style={styles.divider} />

      {/* Volume Selector */}
      <VolumeSelector selected={volume} onSelect={setVolume} />

      <View style={styles.divider} />

      {/* Color Picker */}
      <ColorPicker selected={color} onSelect={setColor} />

      <View style={styles.divider} />

      {/* Photo Capture */}
      <PhotoCapture
        poopPhoto={poopPhoto}
        toiletPhoto={toiletPhoto}
        onPoopPhotoChange={setPoopPhoto}
        onToiletPhotoChange={setToiletPhoto}
      />

      <View style={styles.divider} />

      {/* Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Any additional notes..."
          placeholderTextColor="#B8A898"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Public Toggle */}
      <TouchableOpacity
        style={styles.toggleRow}
        onPress={() => setIsPublic(!isPublic)}
      >
        <View>
          <Text style={styles.toggleLabel}>Share with friends</Text>
          <Text style={styles.toggleHint}>
            {isPublic
              ? "Friends will see this in their feed"
              : "Only you can see this log"}
          </Text>
        </View>
        <View style={[styles.toggle, isPublic && styles.toggleActive]}>
          <View
            style={[styles.toggleCircle, isPublic && styles.toggleCircleActive]}
          />
        </View>
      </TouchableOpacity>

      {/* Flush Button */}
      <TouchableOpacity
        style={[styles.flushButton, !isFormValid && styles.flushButtonDisabled]}
        onPress={handleFlush}
        disabled={!isFormValid}
        activeOpacity={0.8}
      >
        <Text style={styles.flushButtonText}>🚽 FLUSH IT!</Text>
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
    paddingBottom: 40,
  },
  divider: {
    height: 1,
    backgroundColor: "#E8DDD4",
    marginHorizontal: 16,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A3728",
    marginBottom: 12,
  },
  notesInput: {
    backgroundColor: "#FFF8F0",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#4A3728",
    borderWidth: 1,
    borderColor: "#E8DDD4",
    minHeight: 80,
    textAlignVertical: "top",
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFF8F0",
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A3728",
  },
  toggleHint: {
    fontSize: 12,
    color: "#8B7355",
    marginTop: 2,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E8DDD4",
    padding: 2,
  },
  toggleActive: {
    backgroundColor: "#4CAF50",
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "white",
  },
  toggleCircleActive: {
    marginLeft: 22,
  },
  flushButton: {
    backgroundColor: "#8B5A2B",
    marginHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#4A3728",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  flushButtonDisabled: {
    backgroundColor: "#C4A484",
    shadowOpacity: 0.1,
  },
  flushButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
