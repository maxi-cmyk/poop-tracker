// PooPals Type Definitions

export type BristolType = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type VolumeSize = "small" | "medium" | "large" | "massive";

export type StoolColor =
  | "brown"
  | "dark-brown"
  | "light-brown"
  | "green"
  | "yellow"
  | "black"
  | "red"
  | "white";

export interface PoopLog {
  id: string;
  user_id: string;
  bristol_type: BristolType;
  volume: VolumeSize;
  color: StoolColor;
  duration_seconds: number;
  logged_at: string;
  notes?: string;
  is_public: boolean;
  latitude?: number;
  longitude?: number;
  venue_id?: string;
  poop_photo_url?: string;
  toilet_photo_url?: string;
}

export interface Profile {
  id: string;
  username?: string;
  poo_donym?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Venue {
  id: string;
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  has_bidet: boolean;
  created_by: string;
  created_at: string;
  avg_rating?: number;
  avg_tp_quality?: number;
  avg_cleanliness?: number;
  avg_privacy?: number;
  review_count?: number;
}

export interface VenueReview {
  id: string;
  venue_id: string;
  user_id: string;
  overall_rating: number;
  tp_quality: number;
  cleanliness: number;
  privacy: number;
  comment?: string;
  created_at: string;
}

export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  achievement_type: AchievementType;
  unlocked_at: string;
}

export type AchievementType =
  | "early_bird" // Before 6 AM
  | "night_owl" // After midnight
  | "speed_demon" // Under 1 minute
  | "the_philosopher" // Over 30 minutes
  | "globetrotter" // 5+ venues
  | "iron_gut" // Perfect Bristol 4, 5 days straight
  | "the_void" // Massive volume
  | "bidet_connoisseur" // Rated 10+ bidet venues
  | "streak_master" // 30 day streak
  | "social_butterfly" // 10+ friends
  | "first_flush"; // First log ever

export interface Streak {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_log_date: string;
}

export interface MonthlyStats {
  month: string;
  total_logs: number;
  total_duration_seconds: number;
  avg_duration_seconds: number;
  avg_bristol_type: number;
  most_common_time: string;
  favorite_venue?: Venue;
  achievements_unlocked: number;
  health_score: number;
  health_alerts: HealthAlert[];
}

export interface HealthAlert {
  type: "warning" | "caution" | "info";
  message: string;
  recommendation?: string;
}

// Bristol Scale descriptions
export const BRISTOL_DESCRIPTIONS: Record<
  BristolType,
  { name: string; description: string; emoji: string }
> = {
  1: {
    name: "Severe Constipation",
    description: "Separate hard lumps",
    emoji: "🪨",
  },
  2: {
    name: "Mild Constipation",
    description: "Lumpy and sausage-like",
    emoji: "🥜",
  },
  3: { name: "Normal", description: "Sausage with cracks", emoji: "🌭" },
  4: { name: "Ideal", description: "Smooth, soft sausage", emoji: "✨" },
  5: {
    name: "Lacking Fiber",
    description: "Soft blobs with clear edges",
    emoji: "☁️",
  },
  6: {
    name: "Mild Diarrhea",
    description: "Mushy with ragged edges",
    emoji: "💨",
  },
  7: {
    name: "Severe Diarrhea",
    description: "Liquid, no solid pieces",
    emoji: "💦",
  },
};

// Volume descriptions
export const VOLUME_DESCRIPTIONS: Record<
  VolumeSize,
  { name: string; emoji: string }
> = {
  small: { name: "Small", emoji: "🫘" },
  medium: { name: "Medium", emoji: "🥔" },
  large: { name: "Large", emoji: "🥖" },
  massive: { name: "Massive", emoji: "🪵" },
};

// Color info with health indicators
export const COLOR_INFO: Record<
  StoolColor,
  { name: string; hex: string; warning?: string }
> = {
  brown: { name: "Brown", hex: "#8B4513" },
  "dark-brown": { name: "Dark Brown", hex: "#5C4033" },
  "light-brown": { name: "Light Brown", hex: "#C4A484" },
  green: {
    name: "Green",
    hex: "#556B2F",
    warning: "May indicate rapid digestion or leafy greens",
  },
  yellow: {
    name: "Yellow",
    hex: "#DAA520",
    warning: "May indicate fat malabsorption",
  },
  black: {
    name: "Black",
    hex: "#1a1a1a",
    warning: "Seek medical attention - may indicate bleeding",
  },
  red: {
    name: "Red",
    hex: "#8B0000",
    warning: "Seek medical attention - may indicate bleeding",
  },
  white: {
    name: "White/Clay",
    hex: "#F5F5DC",
    warning: "Seek medical attention - may indicate bile duct issue",
  },
};

// Fun facts for toilet reading time
export const TOILET_FUN_FACTS = [
  "The average person spends about 3 years of their life on the toilet.",
  "The first flushing toilet was invented by Sir John Harington in 1596.",
  "Approximately 7 million people drop their phones in the toilet each year.",
  "The world record for the longest poop is over 26 feet!",
  "Astronauts use a $19 million toilet on the International Space Station.",
  "The average person visits the toilet 6-8 times per day.",
  "Ancient Romans used communal toilets as social gathering places.",
  "Your gut contains about 100 trillion bacteria - more than stars in the Milky Way!",
  "The 'Bristol Stool Scale' was developed in 1997 at Bristol Royal Infirmary.",
  "Bidets can reduce toilet paper usage by 75%.",
];
