import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
// Actually process.env.EXPO_PUBLIC_... works in Expo.

interface Venue {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  hasBidet: boolean;
  tpQuality: number;
  type: string;
  source: "google" | "supabase";
}

export default function MapScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<"map" | "list">("map");
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef<MapView>(null);

  const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Location access is required to find nearest toilets.",
        );
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation);

      // Center map initially
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }

      // Initial search for toilets near user
      searchPlaces(
        "public toilet",
        userLocation.coords.latitude,
        userLocation.coords.longitude,
      );
    })();
  }, []);

  const searchPlaces = async (query: string, lat: number, lng: number) => {
    if (!GOOGLE_API_KEY) {
      Alert.alert("Configuration Error", "Google Maps API Key is missing.");
      return;
    }

    setLoading(true);
    try {
      // Use Google Places API Text Search
      // Radius 5km = 5000m
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=${lat},${lng}&radius=5000&key=${GOOGLE_API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK" && data.results) {
        const venues: Venue[] = data.results.map((place: any) => ({
          id: place.place_id,
          name: place.name,
          address: place.formatted_address,
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
          rating: place.rating || 0,
          hasBidet: false, // Google doesn't know this, defaults to false
          tpQuality: 0, // Google doesn't know this
          type: place.types.includes("shopping_mall")
            ? "mall"
            : place.types.includes("cafe")
              ? "cafe"
              : place.types.includes("restaurant")
                ? "restaurant"
                : "public",
          source: "google",
        }));

        setFilteredVenues(venues);

        // Fit map to results
        if (venues.length > 0 && mapRef.current) {
          mapRef.current.fitToCoordinates(
            venues.map((v) => ({
              latitude: v.latitude,
              longitude: v.longitude,
            })),
            {
              edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
              animated: true,
            },
          );
        }
      } else {
        setFilteredVenues([]);
        if (data.status === "ZERO_RESULTS") {
          Alert.alert("No results", "No toilets found in this area.");
        } else {
          console.error(
            "Google Places Error:",
            data.status,
            data.error_message,
          );
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Error", "Failed to fetch places.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    Keyboard.dismiss();
    const query = searchQuery.trim() || "public toilet";

    // If we have location, use it to bias results
    if (location) {
      searchPlaces(query, location.coords.latitude, location.coords.longitude);
    } else {
      // No location, just search (results might be anywhere, bias not applied strongly)
      // Or request location again
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        let userLocation = await Location.getCurrentPositionAsync({});
        setLocation(userLocation);
        searchPlaces(
          query,
          userLocation.coords.latitude,
          userLocation.coords.longitude,
        );
      }
    }
  };

  const centerOnUser = async () => {
    let userLocation = location;
    if (!userLocation) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation);
    }

    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      // Also research near user when recentering?
      searchPlaces(
        "public toilet",
        userLocation.coords.latitude,
        userLocation.coords.longitude,
      );
    }
  };

  const renderTPQuality = (quality: number) => {
    return "🧻".repeat(quality) + "⬜".repeat(5 - quality);
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="🔍 Find toilets (e.g. 'malls')..."
            placeholderTextColor="#8B7355"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Go</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Switcher */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "map" && styles.tabActive]}
          onPress={() => setActiveTab("map")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "map" && styles.tabTextActive,
            ]}
          >
            🗺️ Map View
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "list" && styles.tabActive]}
          onPress={() => setActiveTab("list")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "list" && styles.tabTextActive,
            ]}
          >
            📋 List View
          </Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#8B5A2B" />
        </View>
      )}

      {activeTab === "map" ? (
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            showsUserLocation={true}
            showsMyLocationButton={false}
          >
            {filteredVenues.map((venue) => (
              <Marker
                key={venue.id}
                coordinate={{
                  latitude: venue.latitude,
                  longitude: venue.longitude,
                }}
                title={venue.name}
                description={`⭐ ${venue.rating} • ${venue.address}`}
                pinColor={"red"} // Google results don't have bidet info yet
              />
            ))}
          </MapView>

          <TouchableOpacity
            style={styles.recenterButton}
            onPress={centerOnUser}
          >
            <Text style={styles.recenterText}>📍 Near Me</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.listContent}>
          {filteredVenues.length === 0 ? (
            <Text style={styles.emptyText}>
              No venues found. Try a different search.
            </Text>
          ) : (
            filteredVenues.map((venue) => (
              <TouchableOpacity key={venue.id} style={styles.venueCard}>
                <View style={styles.venueHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.venueName}>{venue.name}</Text>
                    <Text style={styles.venueAddress}>{venue.address}</Text>
                    <Text style={styles.venueType}>
                      {venue.type.toUpperCase()}
                    </Text>
                  </View>
                  {venue.rating > 0 && (
                    <View style={styles.venueRating}>
                      <Text style={styles.ratingText}>⭐ {venue.rating}</Text>
                    </View>
                  )}
                </View>

                {/* For Google results, we don't have this data yet, maybe hide or show 'Unknown' */}
                <View style={styles.venueDetails}>
                  <View
                    style={[styles.bidetBadge, { backgroundColor: "#F5F5F5" }]}
                  >
                    <Text style={[styles.bidetText, { color: "#888" }]}>
                      ❓ Bidet status unknown
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
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
    zIndex: 10,
  },
  searchRow: {
    flexDirection: "row",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#FFF8F0",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#4A3728",
    borderWidth: 1,
    borderColor: "#E8DDD4",
    shadowColor: "#4A3728",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchButton: {
    backgroundColor: "#8B5A2B",
    borderRadius: 12,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4A3728",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  searchButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 8,
    zIndex: 10,
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
  loadingOverlay: {
    position: "absolute",
    top: 200,
    left: 0,
    right: 0,
    zIndex: 20,
    alignItems: "center",
  },
  mapContainer: {
    flex: 1,
    overflow: "hidden",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 8,
    position: "relative",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  recenterButton: {
    position: "absolute",
    bottom: 40,
    right: 16,
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recenterText: {
    fontWeight: "bold",
    color: "#8B5A2B",
  },
  listContent: {
    flex: 1,
    padding: 16,
  },
  emptyText: {
    textAlign: "center",
    color: "#8B7355",
    marginTop: 40,
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
    marginBottom: 4,
  },
  venueType: {
    fontSize: 10,
    color: "#8B5A2B",
    fontWeight: "bold",
    marginTop: 2,
    backgroundColor: "#E8DDD4",
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  venueRating: {
    backgroundColor: "#FFF3CD",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginLeft: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
  },
  venueDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  bidetBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bidetText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
