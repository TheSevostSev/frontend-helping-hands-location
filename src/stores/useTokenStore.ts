import { create } from "zustand";

interface TokenStore {
  token: string | null;
  setToken: (token: string, rememberMe: boolean) => void;
  removeToken: () => void;
}

const useTokenStore = create<TokenStore>((set) => {
  // Check if there's a saved token, prioritize localStorage if "Remember Me" was checked
  const savedToken =
    typeof window !== "undefined"
      ? localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
      : null;

  return {
    token: savedToken ? savedToken : null,
    setToken: (token: string, rememberMe: boolean) => {
      if (typeof window !== "undefined") {
        if (rememberMe) {
          // Store token in localStorage for persistent login
          localStorage.setItem("authToken", token);
        } else {
          // Store token in sessionStorage for session-only login
          sessionStorage.setItem("authToken", token);
        }
      }
      set({ token });
    },
    removeToken: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
      }
      set({ token: "" });
    },
  };
});

export default useTokenStore;
