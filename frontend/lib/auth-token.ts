let accessToken: string | null = null;

export const tokenService = {
  getToken: () => {
    if (accessToken) {
      return accessToken;
    }
    if (typeof window !== "undefined") {
      accessToken = localStorage.getItem("accessToken");
    }

    return accessToken;
  },

  setToken: (token: string) => {
    accessToken = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", token);
    }
  },

  clearToken: () => {
    accessToken = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
    }
  },
};
