import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
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

interface Venue {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  hasBidet: boolean;
  tpQuality: number;
  type: "public" | "cafe" | "mall" | "hotel";
}

export default function MapScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<"map" | "list">("map");
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const mapRef = useRef<MapView>(null);

  // Simulated toilet database
  const allVenues: Venue[] = [
    {
      id: "1",
      name: "Starbucks Reserve",
      address: "123 Coffee Lane",
      latitude: 1.3521,
      longitude: 103.8198,
      rating: 4.5,
      hasBidet: false,
      tpQuality: 4,
      type: "cafe",
    },
    {
      id: "2",
      name: "Marina Bay Sands",
      address: "10 Bayfront Ave",
      latitude: 1.2834,
      longitude: 103.8607,
      rating: 4.8,
      hasBidet: true,
      tpQuality: 5,
      type: "hotel",
    },
    {
      id: "3",
      name: "VivoCity Mall",
      address: "1 HarbourFront Walk",
      latitude: 1.2642,
      longitude: 103.8226,
      rating: 4.2,
      hasBidet: true,
      tpQuality: 4,
      type: "mall",
    },
    {
      id: "4",
      name: "Public Restroom (Park)",
      address: "East Coast Park",
      latitude: 1.3,
      longitude: 103.9,
      rating: 3.2,
      hasBidet: false,
      tpQuality: 2,
      type: "public",
    },
    {
      id: "5",
      name: "ION Orchard",
      address: "2 Orchard Turn",
      latitude: 1.304,
      longitude: 103.832,
      rating: 4.9,
      hasBidet: true,
      tpQuality: 5,
      type: "mall",
    },
  ];

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

      // Initial center on user
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
    })();

    // Initially show all venues
    setFilteredVenues(allVenues);
  }, []);

  const handleSearch = () => {
    Keyboard.dismiss();
    if (!searchQuery.trim()) {
      setFilteredVenues(allVenues);
      return;
    }

    // Simulate searching for "toilets near [location]"
    const filtered = allVenues.filter(
      (v) =>
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.address.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    setFilteredVenues(filtered);

    if (filtered.length > 0 && mapRef.current) {
      // Center on first result
      mapRef.current.animateToRegion({
        latitude: filtered[0].latitude,
        longitude: filtered[0].longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    } else {
      Alert.alert(
        "No toilets found",
        "Try searching for a different location.",
      );
    }
  };

  const centerOnUser = async () => {
    if (!location) {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        let userLocation = await Location.getCurrentPositionAsync({});
        setLocation(userLocation);
      } else {
        return;
      }
    }

    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const renderTPQuality = (quality: number) => {
    return "🧻".repeat(quality) + "⬜".repeat(5 - quality);
  };

  const initialRegion = {
    latitude: 1.3521,
    longitude: 103.8198,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="🔍 Find toilets near..."
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

      {activeTab === "map" ? (
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={initialRegion}
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
                description={`⭐ ${venue.rating} • ${venue.hasBidet ? "Bidet" : "No Bidet"}`}
                pinColor={venue.hasBidet ? "blue" : "red"}
              />
            ))}
          </MapView>

          {/* Recenter Button */}
          <TouchableOpacity
            style={styles.recenterButton}
            onPress={centerOnUser}
          >
            <Text style={styles.recenterText}>📍 Near Me</Text>
          </TouchableOpacity>

          {/* Legend Overlay */}
          <View style={styles.legendOverlay}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "blue" }]} />
              <Text style={styles.legendText}>Has Bidet</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "red" }]} />
              <Text style={styles.legendText}>Standard</Text>
            </View>
          </View>
        </View>
      ) : (
        <ScrollView style={styles.listContent}>
          {filteredVenues.length === 0 ? (
            <Text style={styles.emptyText}>
              No toilets found matching your search.
            </Text>
          ) : (
            filteredVenues.map((venue) => (
              <TouchableOpacity key={venue.id} style={styles.venueCard}>
                <View style={styles.venueHeader}>
                  <View>
                    <Text style={styles.venueName}>{venue.name}</Text>
                    <Text style={styles.venueAddress}>{venue.address}</Text>
                    <Text style={styles.venueType}>
                      {venue.type.toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.venueRating}>
                    <Text style={styles.ratingText}>⭐ {venue.rating}</Text>
                  </View>
                </View>

                <View style={styles.venueDetails}>
                  <View
                    style={[
                      styles.bidetBadge,
                      venue.hasBidet && styles.bidetBadgeActive,
                    ]}
                  >
                    <Text style={styles.bidetText}>
                      {venue.hasBidet ? "💦 Bidet Available" : "🚫 No Bidet"}
                    </Text>
                  </View>
                  <View style={styles.tpQuality}>
                    <Text style={styles.tpLabel}>TP: </Text>
                    <Text style={styles.tpRating}>
                      {renderTPQuality(venue.tpQuality)}
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
    bottom: 90,
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
  legendOverlay: {
    position: "absolute",
    bottom: 24,
    right: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8DDD4",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: "#4A3728",
    fontWeight: "600",
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
    backgroundColor: "#FFEBEE",
  },
  bidetBadgeActive: {
    backgroundColor: "#E3F2FD",
  },
  bidetText: {
    fontSize: 12,
    fontWeight: "500",
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
    fontSize: 12,
  },
});
