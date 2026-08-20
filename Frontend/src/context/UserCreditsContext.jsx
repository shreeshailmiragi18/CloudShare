import { createContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

export const UserCreditsContext = createContext();

export const UserCreditsProvider = ({ children }) => {
  const [credits, setCredits] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const { getToken, isSignedIn } = useAuth();

  const fetchUserCredits = useCallback(async () => {
    if (!isSignedIn) {
      setCredits(0);
      return;
    }

    setIsLoading(true);

    try {
      const token = await getToken();

      const response = await axios.get(
        "http://localhost:8080/api/v1.0/users/credits",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Axios stores backend response here
      setCredits(response.data.credits);
    } catch (error) {
      console.error(
        "Failed to fetch credits:",
        error.response?.data || error.message,
      );
    } finally {
      setIsLoading(false);
    }
  }, [getToken, isSignedIn]);

  useEffect(() => {
    fetchUserCredits();
  }, [fetchUserCredits]);

  const updateCredits = useCallback((newCredits) => {
    setCredits(newCredits);
  }, []);

  const contextValue = {
    credits,
    setCredits,
    isLoading,
    fetchUserCredits,
    updateCredits,
  };

  return (
    <UserCreditsContext.Provider value={contextValue}>
      {children}
    </UserCreditsContext.Provider>
  );
};

export default UserCreditsContext;
