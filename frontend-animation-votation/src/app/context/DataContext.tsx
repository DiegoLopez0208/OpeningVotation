"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import { Vote, Opening } from "../interfaces/interfaces";

interface DataContextType {
    data: Opening[];
    loading: boolean;
    userId: string;
    username: string;
    votesMapping: Record<string, Vote[]>;
    elevenVote: boolean;
    ceroVote: boolean;
  
    // Métodos
    fetchOpenings: () => Promise<void>;
    fetchVotes: () => Promise<void>;
    setUserIdAndUsername: (userId: string, username: string) => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
    const [data, setData] = useState<Opening[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [userId, setUserId] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [votesMapping, setVotesMapping] = useState<Record<string, Vote[]>>({});
    const [elevenVote, setElevenVote] = useState<boolean>(false);
    const [ceroVote, setCeroVote] = useState<boolean>(false);


  const fetchOpenings = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/openings`
        );
        const result = await response.json();
        setData(result.openings);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }      
  }

  const fetchVotes = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/votes/${userId}`
      );
      const { data } = await response.json();

      const voteMapping: Record<string, Vote[]> = {};

      data.forEach((vote: Vote) => {
        if (!voteMapping[vote.openingId]) {
          voteMapping[vote.openingId] = [];
        }
        voteMapping[vote.openingId].push(vote);

        //find elevenVote
        if (vote.vote === 11) {
          setElevenVote(true);
        }

        //find ceroVote
        if (vote.vote === 0) {
          setCeroVote(true);
        }
      });

      setVotesMapping(voteMapping);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    } 
  }

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);
  
  useEffect(() => {
    if (userId) {
      fetchVotes(); // Ahora solo se llama a fetchVotes cuando userId está disponible
    }
    fetchOpenings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]); 
  
  return (
    <DataContext.Provider
      value={{
        data,
        loading,
        votesMapping,
        userId,
        username,
        elevenVote,
        ceroVote,
        fetchOpenings,
        fetchVotes,
        setUserIdAndUsername: (id, name) => {
          setUserId(id);
          setUsername(name);
        },
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Hook para consumir el contexto
export const useDataContext = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("useDataContext must be used within a DataContextProvider");
    return context;
  };
  
  export default DataContextProvider;