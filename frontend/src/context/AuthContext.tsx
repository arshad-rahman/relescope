import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type { GitHubUser } from "../types/github";

type AuthContextValue = {
  token: string;
  user: GitHubUser | null;
  isAuthenticated: boolean;
  connect: (
    token: string,
    user: GitHubUser,
  ) => void;
  logout: () => void;
};

const TOKEN_STORAGE_KEY =
  "releasepilot.github.token";

const USER_STORAGE_KEY =
  "releasepilot.github.user";

const AuthContext =
  createContext<AuthContextValue | null>(null);

function readStoredUser(): GitHubUser | null {
  const storedUser =
    sessionStorage.getItem(USER_STORAGE_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as GitHubUser;
  } catch {
    sessionStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [token, setToken] = useState(() => {
    return (
      sessionStorage.getItem(TOKEN_STORAGE_KEY) ?? ""
    );
  });

  const [user, setUser] =
    useState<GitHubUser | null>(readStoredUser);

  function connect(
    nextToken: string,
    nextUser: GitHubUser,
  ) {
    sessionStorage.setItem(
      TOKEN_STORAGE_KEY,
      nextToken,
    );

    sessionStorage.setItem(
      USER_STORAGE_KEY,
      JSON.stringify(nextUser),
    );

    setToken(nextToken);
    setUser(nextUser);
  }

  function logout() {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(USER_STORAGE_KEY);

    setToken("");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(token && user),
        connect,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
