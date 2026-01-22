import * as Location from "expo-location";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Venue {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  hasBidet: boolean;
  tpQuality: number;
}

export default function MapScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"nearby" | "hotspots" | "top">(
    "nearby",
  );

  // Mock venues data
  const [nearbyVenues] = useState<Venue[]>([
    {
      id: "1",
      name: "Starbucks Reserve",
      address: "123 Coffee Lane",
      distance: "0.2 km",
      rating: 4.5,
      hasBidet: false,
      tpQuality: 4,
    },
    {
      id: "2",
      name: "Marina Bay Sands",
      address: "10 Bayfront Ave",
      distance: "0.5 km",
      rating: 4.8,
      hasBidet: true,
      tpQuality: 5,
    },
    {
      id: "3",
      name: "VivoCity Mall",
      address: "1 HarbourFront Walk",
      distance: "0.8 km",
      rating: 4.2,
      hasBidet: true,
      tpQuality: 4,
    },
    {
      id: "4",
      name: "Local Kopitiam",
      address: "45 Tiong Bahru Rd",
      distance: "1.2 km",
      rating: 3.5,
      hasBidet: false,
      tpQuality: 2,
    },
  ]);

  // Mock hotspots data
  const [hotspots] = useState([
    { id: "1", name: "Home", visits: 156, emoji: "🏠" },
    { id: "2", name: "Office", visits: 89, emoji: "🏢" },
    { id: "3", name: "Gym", visits: 23, emoji: "💪" },
    { id: "4", name: "Mall", visits: 12, emoji: "🛍️" },
  ]);

  const requestLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Location access is required to find nearby toilets.",
      );
      return;
    }
    // TODO: Get location and fetch nearby venues
  };

  const renderTPQuality = (quality: number) => {
    return "🧻".repeat(quality) + "⬜".repeat(5 - quality);
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Search toilets..."
          placeholderTextColor="#8B7355"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Tab Buttons */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "nearby" && styles.tabActive]}
          onPress={() => setActiveTab("nearby")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "nearby" && styles.tabTextActive,
            ]}
          >
            📍 Nearby
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "hotspots" && styles.tabActive]}
          onPress={() => setActiveTab("hotspots")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "hotspots" && styles.tabTextActive,
            ]}
          >
            🔥 My Hotspots
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "top" && styles.tabActive]}
          onPress={() => setActiveTab("top")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "top" && styles.tabTextActive,
            ]}
          >
            ⭐ Top Rated
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Nearby Venues */}
        {activeTab === "nearby" && (
          <>
            <TouchableOpacity
              style={styles.locationButton}
              onPress={requestLocation}
            >
              <Text style={styles.locationButtonText}>
                📍 Update My Location
              </Text>
            </TouchableOpacity>

            {nearbyVenues.map((venue) => (
              <TouchableOpacity key={venue.id} style={styles.venueCard}>
                <View style={styles.venueHeader}>
                  <View>
                    <Text style={styles.venueName}>{venue.name}</Text>
                    <Text style={styles.venueAddress}>{venue.address}</Text>
                  </View>
                  <View style={styles.venueDistance}>
                    <Text style={styles.distanceText}>{venue.distance}</Text>
                  </View>
                </View>

                <View style={styles.venueDetails}>
                  <View style={styles.venueRating}>
                    <Text style={styles.ratingText}>
                      ⭐ {venue.rating.toFixed(1)}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.bidetBadge,
                      venue.hasBidet && styles.bidetBadgeActive,
                    ]}
                  >
                    <Text style={styles.bidetText}>
                      {venue.hasBidet ? "💦 Bidet" : "🚫 No Bidet"}
                    </Text>
                  </View>
                </View>

                <View style={styles.tpQuality}>
                  <Text style={styles.tpLabel}>TP Quality: </Text>
                  <Text style={styles.tpRating}>
                    {renderTPQuality(venue.tpQuality)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* My Hotspots */}
        {activeTab === "hotspots" && (
          <>
            <Text style={styles.sectionTitle}>Your Most Visited 💩 Spots</Text>

            {hotspots.map((spot, index) => (
              <View key={spot.id} style={styles.hotspotCard}>
                <Text style={styles.hotspotRank}>#{index + 1}</Text>
                <Text style={styles.hotspotEmoji}>{spot.emoji}</Text>
                <View style={styles.hotspotInfo}>
                  <Text style={styles.hotspotName}>{spot.name}</Text>
                  <Text style={styles.hotspotVisits}>{spot.visits} visits</Text>
                </View>
                <View style={styles.hotspotBar}>
                  <View
                    style={[
                      styles.hotspotBarFill,
                      { width: `${(spot.visits / hotspots[0].visits) * 100}%` },
                    ]}
                  />
                </View>
              </View>
            ))}

            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapPlaceholderEmoji}>🗺️</Text>
              <Text style={styles.mapPlaceholderText}>
                Heatmap Coming Soon!
              </Text>
              <Text style={styles.mapPlaceholderHint}>
                Your poop location history will appear here
              </Text>
            </View>
          </>
        )}

        {/* Top Rated */}
        {activeTab === "top" && (
          <>
            <Text style={styles.sectionTitle}>Friend-Rated Top Toilets 🏆</Text>

            {nearbyVenues
              .sort((a, b) => b.rating - a.rating)
              .map((venue, index) => (
                <View key={venue.id} style={styles.topVenueCard}>
                  <View
                    style={[styles.topBadge, index === 0 && styles.goldBadge]}
                  >
                    <Text style={styles.topBadgeText}>
                      {index === 0
                        ? "🥇"
                        : index === 1
                          ? "🥈"
                          : index === 2
                            ? "🥉"
                            : `#${index + 1}`}
                    </Text>
                  </View>
                  <View style={styles.topVenueInfo}>
                    <Text style={styles.venueName}>{venue.name}</Text>
                    <View style={styles.topVenueStats}>
                      <Text style={styles.topVenueStat}>
                        ⭐ {venue.rating.toFixed(1)}
                      </Text>
                      {venue.hasBidet && (
                        <Text style={styles.topVenueStat}>💦 Bidet</Text>
                      )}
                      <Text style={styles.topVenueStat}>
                        🧻 {venue.tpQuality}/5
                      </Text>
                    </View>
                  </View>
                </View>
              ))}

            <TouchableOpacity style={styles.addVenueButton}>
              <Text style={styles.addVenueText}>➕ Add New Venue</Text>
            </TouchableOpacity>
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
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchInput: {
    backgroundColor: "#FFF8F0",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#4A3728",
    borderWidth: 1,
    borderColor: "#E8DDD4",
  },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 8,
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
    fontSize: 12,
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
  locationButton: {
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  locationButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  venueCard: {
    backgroundColor: "#FFF8F0",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E8DDD4",
  },
  venueHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  venueName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A3728",
  },
  venueAddress: {
    fontSize: 13,
    color: "#8B7355",
    marginTop: 2,
  },
  venueDistance: {
    backgroundColor: "#E8DDD4",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4A3728",
  },
  venueDetails: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  venueRating: {
    backgroundColor: "#FFF3CD",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
  },
  bidetBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "#FFEBEE",
  },
  bidetBadgeActive: {
    backgroundColor: "#E3F2FD",
  },
  bidetText: {
    fontSize: 12,
  },
  tpQuality: {
    flexDirection: "row",
    alignItems: "center",
  },
  tpLabel: {
    fontSize: 13,
    color: "#8B7355",
  },
  tpRating: {
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4A3728",
    marginBottom: 16,
  },
  hotspotCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8F0",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E8DDD4",
  },
  hotspotRank: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#8B5A2B",
    width: 30,
  },
  hotspotEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  hotspotInfo: {
    flex: 1,
  },
  hotspotName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A3728",
  },
  hotspotVisits: {
    fontSize: 13,
    color: "#8B7355",
  },
  hotspotBar: {
    width: 80,
    height: 8,
    backgroundColor: "#E8DDD4",
    borderRadius: 4,
    overflow: "hidden",
  },
  hotspotBarFill: {
    height: "100%",
    backgroundColor: "#8B5A2B",
    borderRadius: 4,
  },
  mapPlaceholder: {
    backgroundColor: "#FFF8F0",
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
    marginTop: 20,
    borderWidth: 2,
    borderColor: "#E8DDD4",
    borderStyle: "dashed",
  },
  mapPlaceholderEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8B5A2B",
  },
  mapPlaceholderHint: {
    fontSize: 14,
    color: "#8B7355",
    marginTop: 4,
  },
  topVenueCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8F0",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E8DDD4",
  },
  topBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8DDD4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  goldBadge: {
    backgroundColor: "#FFF3CD",
  },
  topBadgeText: {
    fontSize: 18,
  },
  topVenueInfo: {
    flex: 1,
  },
  topVenueStats: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  topVenueStat: {
    fontSize: 12,
    color: "#8B7355",
  },
  addVenueButton: {
    backgroundColor: "#8B5A2B",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  addVenueText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
