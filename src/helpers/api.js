const baseURL = "https://api.spotify.com/v1/";
import axios from "axios";

export { handleToken, clearSession } from "./auth";

export const getTopItems = async (token, term, type, limit = 10) => {
  try {
    const data = await axios.get(
      `${baseURL}me/top/${type}?time_range=${term}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data.data.items;
  } catch (error) {
    return {
      status: error.status,
      message: error.message,
    };
  }
};

export const getTrack = async (token, id) => {
  try {
    const data = await axios.get(`${baseURL}/tracks/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data.data.items;
  } catch (error) {
    return error;
  }
};
export const getRecentlyPlayed = async (token) => {
  try {
    const data = await axios.get(`${baseURL}me/player/recently-played`, {
      params: {
        limit: 50,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data.data.items;
  } catch (error) {
    return error;
  }
};
export const getAudioFeatures = async (token, ids) => {
  try {
    const data = await axios.get(`${baseURL}audio-features?ids=${ids}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data.data.audio_features;
  } catch (error) {
    // 403 desde a depreciacao de nov/2024; o chamador esconde a secao
    console.warn("audio-features indisponivel:", error?.response?.status);
    return null;
  }
};
export const getUser = async (token) => {
  try {
    const data = await axios.get(`${baseURL}me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data.data;
  } catch (error) {
    return error;
  }
};
export const getUserPlaylists = async (token) => {
  try {
    const userId = await getUser(token);
    const data = await axios.get(`${baseURL}users/${userId.id}/playlists`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data.data;
  } catch (error) {
    return error;
  }
};
