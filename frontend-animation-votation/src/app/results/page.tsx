"use client";
import { useSettings } from "@/app/context/SettingsContext";
import Image from "next/image";
import {
  Juany,
  Sloth,
  Therose,
  Solobolo,
  Jojo,
  Ale,
  ByCheat,
  Benja,
} from "../lib/images";
import Openings from "../lib/openings";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import { OpeningList } from "../interfaces/interfaces";

export default function ResultsPage() {
  const { isDarkMode } = useSettings();
  const [lookRewards, setLookRewards] = useState(true);
  const [search, setSearch] = useState("");

  const rewards = [
    {
      name: "Hater de nacimiento",
      description: "Para el participante que mas bajo voto en general",
      winners: [
        {
          name: "Juany",
          image: Juany,
          value: 6.645,
        },
        {
          name: "ByCheat",
          image: ByCheat,
          value: 6.665,
        },
        {
          name: "Jojo",
          image: Jojo,
          value: 6.715,
        },
      ],
    },
    {
      name: "El mas hateado",
      description: "Para el participante que sus openings fueron peor votados",
      winners: [
        {
          name: "Benja",
          image: Benja,
          value: 6.42,
        },
        {
          name: "ByCheat",
          image: ByCheat,
          value: 6.67,
        },
        {
          name: "Ale",
          image: Ale,
          value: 6.92,
        },
      ],
    },
    {
      name: "Chill de cojones",
      image: Juany,
      description: "Para el participante que mas alto voto en general",
      winners: [
        {
          name: "Sloth",
          image: Sloth,
          value: 8.2,
        },
        {
          name: "Therose",
          image: Therose,
          value: 7.615,
        },
        {
          name: "Solobolo",
          image: Solobolo,
          value: 7.595,
        },
      ],
    },
    {
      name: "El mas basado",
      description: "Para el participante que sus openings fueron mejor votados",
      winners: [
        {
          name: "Juany",
          image: Juany,
          value: 8.14,
        },
        {
          name: "Jojo",
          image: Jojo,
          value: 8.04,
        },
        {
          name: "Sloth",
          image: Sloth,
          value: 7.78,
        },
      ],
    },
  ];

  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".card",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.2, stagger: 0.03 }
      );
    },
    { dependencies: [lookRewards], scope: containerRef }
  );

  return (
    <div
      className={`min-h-screen w-full ${
        isDarkMode
          ? "dark transition-colors duration-200"
          : "transition-colors duration-200"
      }`}
    >
      <div className="w-full min-h-screen bg-blue-50 dark:bg-gray-900 transition-colors duration-200 flex justify-center">
        <div className="container text-white text-center" ref={containerRef}>
          <button
            onClick={() => setLookRewards(!lookRewards)}
            className="bg-blue-600 text-xl rounded-xl px-4 py-2 my-4"
          >
            {lookRewards ? "Ver leaderboard" : "Ver recompensas"}
          </button>
          {lookRewards ? (
            <div
              className="columns-1 sm:columns-2 space-y-4"
            >
              {rewards.map((reward, rewardIndex) => (
                <div
                  key={rewardIndex}
                  className="card bg-gray-800 p-4 rounded-xl flex flex-col justify-center"
                >
                  <h3 className="text-3xl text-left">{reward.name}</h3>
                  <p className="text-left text-gray-400">
                    {reward.description}
                  </p>
                  <div className="w-full mt-4">
                    {reward.winners.map((winner, winnerIndex) => (
                      <div
                        key={winnerIndex}
                        className={`mb-2 flex flex-row items-center justify-between rounded-xl p-2 ${
                          winnerIndex === 0
                            ? "bg-blue-600 text-3xl"
                            : "bg-gray-700"
                        } ${winnerIndex === 2 ? "mb-0" : ""}`}
                      >
                        <span className="flex flex-row items-center">
                          <Image
                            src={winner.image}
                            className="rounded-lg mr-4"
                            alt="Ganador"
                            width={winnerIndex === 0 ? 75 : 50}
                            height={winnerIndex === 0 ? 75 : 50}
                          />
                          {winner.name}
                        </span>
                        <span className="p-4">{winner.value}</span>
                      </div>
                    ))}
                    <div className="text-blue-200 text-right pr-2">
                      <span>Voto promedio</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="space-y-4" >
                <input
                  type="text"
                  className="bg-gray-800 text-white rounded-lg p-2 w-full"
                  placeholder="🔍 Buscar opening..."
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center">
                  {Openings.filter((opening: OpeningList) =>
                    opening.title.toLowerCase().includes(search.toLowerCase())
                  )
                    .map((opening: OpeningList) => (
                      <div
                        key={opening.index}
                        className="card w-full bg-slate-800 text-white p-4 rounded-lg shadow-xl"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div className="bg-blue-700 text-white px-3 py-1 rounded-lg text-lg font-bold">
                              {opening.index}°
                            </div>
                            <h2 className="text-xl font-bold">
                              {opening.title}
                            </h2>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-yellow-500"
                            >
                              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                              <path d="M4 22h16"></path>
                              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                            </svg>
                            <span className="text-2xl font-bold text-yellow-500">
                              {opening.vote}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                          {opening.participants.map((rating, index) => (
                            <div
                              key={index}
                              className="bg-blue-900/50 rounded-lg sm:p-3 text-center hover:bg-blue-900/70 transition-colors"
                            >
                              <div className="text-sm text-slate-300 mb-1">
                                {rating.name}
                              </div>
                              <div className="text-lg font-bold">
                                {rating.value}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
