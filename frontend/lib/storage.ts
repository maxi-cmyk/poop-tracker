import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import { supabase } from "./supabase";

export const uploadPhoto = async (
  uri: string,
  userId: string,
  type: "poop" | "toilet",
): Promise<string | null> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: "base64",
    });

    const fileName = `${userId}/${Date.now()}_${type}.jpg`;

    const { data, error } = await supabase.storage
      .from("poop-photos")
      .upload(fileName, decode(base64), {
        contentType: "image/jpeg",
      });

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("poop-photos").getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error("File reading error:", error);
    return null;
  }
};
