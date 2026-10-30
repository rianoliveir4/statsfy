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
