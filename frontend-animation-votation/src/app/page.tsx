"use client";
import { useEffect, useState } from "react";
import LoadingIcon from "@/app/components/LoadingIcon";
import OpeningsTable from "@/app/components/OpeningsTable";
import {
  BiArrowToRight,
  BiArrowToLeft,
  BiRightArrowAlt,
  BiLeftArrowAlt,
} from "react-icons/bi";

interface Opening {
  _id: string;
  title: string;
  url: string;
}

interface Vote {
  openingId: string;
  userId: string;
  vote: number;
}

export default function Leaderboard() {
  const [ops, setOps] = useState<Opening[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(12);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [votes, setVotes] = useState<Vote[]>([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    async function fetchOpenings() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/openings`
        );
        const votes = await fetch(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL
          }/api/votes/${localStorage.getItem("userId")}`
        );

        if (!res.ok || !votes.ok) throw new Error(`Error: ${res.status}`);

        const opData = await res.json();
        const votesData = await votes.json();

        setOps(opData.openings);
        setVotes(votesData.data || []);
        setTotalPages(Math.ceil(opData.openings.length / pageSize));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOpenings();
  }, [pageSize]);

  if (loading) {
    return <LoadingIcon />;
  }

  return (
    <div className="sm:w-4/6 sm:mx-auto h-auto">
      <div className="h-full flex justify-center items-center flex-col mx-4 my-3">
        <OpeningsTable
          ops={ops}
          votes={votes}
          page={page}
          pageSize={pageSize}
        />
        <div className="fixed bottom-4 w-fit text-center text-xl bg-white shadow-xl rounded-xl p-2 mt-5 flex justify-center align-middle gap-2">
          <button
            className="p px-3 text-white bg-blue-400 rounded-lg"
            onClick={() => {
              if (page > 1) setPage(1);
            }}
          >
            <BiArrowToLeft />
          </button>
          <button
            className="p-2 px-3 text-white bg-blue-400 rounded-lg"
            onClick={() => {
              if (page > 1) setPage(page - 1);
            }}
          >
            <BiLeftArrowAlt />
          </button>

          <span className="p-2">
            Página {page} de {totalPages}
          </span>

          <button
            className="p-2 px-3 text-white bg-blue-400 rounded-lg"
            onClick={() => {
              if (page < totalPages) setPage(page + 1);
            }}
          >
            <BiRightArrowAlt />
          </button>
          <button
            className="p-2 px-3 text-white bg-blue-400 rounded-lg"
            onClick={() => {
              if (page < totalPages) setPage(totalPages);
            }}
          >
            <BiArrowToRight />
          </button>
        </div>
      </div>
    </div>
  );
}
