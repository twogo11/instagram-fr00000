"use client";

import { useUser } from "../providers/UserProvider";
import { useEffect, useState } from "react";

interface RecommendedUser {
  id: number;
  name: string;
  username: string;
}

export const Recommend = () => {
  const { user } = useUser();
  const [recommended, setRecommended] = useState<RecommendedUser[]>([]);

  useEffect(() => {
    setRecommended([
      {
        id: 1,
        name: "Emma Johnson",
        username: "emma.j",
      },
      {
        id: 2,
        name: "David Kim",
        username: "davidk",
      },
      {
        id: 3,
        name: "Sakura Tanaka",
        username: "sakura_t",
      },
    ]);
  }, []);

  if (!user) return null;

  return (
    <div className="hidden lg:flex flex-col h-screen fixed right-0 top-0 w-[320px] bg-black border-l border-gray-800 px-6 py-8">
      {/* Хэрэглэгчийн мэдээлэл */}
      <div className="flex items-center gap-3 mb-6 justify-between">
        {/* Зураг + username */}
        <div className="flex items-center gap-3">
          <img
            src="https://www.politico.com/dims4/default/resize/1260/quality/90/format/webp?url=https%3A%2F%2Fstatic.politico.com%2F84%2Ff1%2F28d495534693990f6f40f8309cc0%2Fkanye-running.png"
            alt="Profile"
            className="w-[50px] h-[50px] rounded-full object-cover"
          />
          <p className="text-white font-semibold">{user.username}</p>
        </div>
        {/* Switch button */}
        <button className="text-sm text-blue-500 font-semibold hover:text-white transition">
          switch
        </button>
      </div>

      {/* Recommended хэсэг */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-neutral-400 font-semibold text-sm">
          Suggested for you
        </p>
        <button className="text-xs text-white font-semibold hover:text-neutral-400 transition">
          See All
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {recommended.map((rec) => (
          <div
            key={rec.id}
            className="flex items-center justify-between hover:bg-neutral-900 p-2 rounded-xl transition"
          >
            <div className="flex items-center gap-3">
              <div>
                <p className="text-white text-sm font-semibold">
                  {rec.username}
                </p>
                <p className="text-neutral-500 text-xs">{rec.name}</p>
              </div>
            </div>
            <button className="text-sm text-blue-500 font-semibold hover:text-white transition">
              Follow
            </button>
          </div>
        ))}
      </div>

      <p className="text-neutral-500 text-xs mt-8">
        About.
Help.
Press.
API.
Jobs.
Privacy.
Terms.
Locations.
Language.
Meta Verified.

        © 2025 INSTAGRAM • Built by M.Tuguldur
      </p>
    </div>
  );
};
