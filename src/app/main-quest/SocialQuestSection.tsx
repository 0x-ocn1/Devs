// components/SocialQuestSection.tsx
"use client";
import React, { useEffect, useState } from "react";


type Task = {
  id: string;
  label: string;
  url: string;
};

type Props = {
  address: string;
};

const tasks: Task[] = [
  { id: "follow_twitter", label: "Follow Twitter", url: "https://twitter.com/yourprofile" },
  { id: "join_discord", label: "Join Discord", url: "https://discord.gg/yourinvite" },
  { id: "tweet_project", label: "Tweet About Us", url: "https://twitter.com/intent/tweet?text=Check%20out%20Raven%20Rush!" }
];

const SocialQuestSection: React.FC<Props> = ({ address }) => {
  const [taskLoading, setTaskLoading] = useState(false);
  const [clickedTasks, setClickedTasks] = useState<string[]>([]);
  const [cooldownStart, setCooldownStart] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const handleClick = async (task: Task) => {
    if (taskLoading || clickedTasks.includes(task.id)) return;
    window.open(task.url, "_blank");

    setTaskLoading(true);

    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          action: "social_quest",
          taskId: task.id
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const updated = Array.from(new Set([...clickedTasks, task.id]));
        setClickedTasks(updated);
        if (updated.length === 3) {
          setCooldownStart(Date.now());
        }
        setMessage(`✅ "${task.label}" completed! +2 points`);
      } else {
        setMessage("❌ Failed to complete task");
      }
    } catch (e) {
      console.error(e);
      setMessage("❌ Server error");
    } finally {
      setTaskLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const getRemainingTime = () => {
    if (!cooldownStart) return null;
    const endsAt = cooldownStart + 6 * 60 * 60 * 1000;
    const diff = endsAt - Date.now();
    if (diff <= 0) {
      setClickedTasks([]);
      setCooldownStart(null);
      return null;
    }
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="w-full max-w-5xl bg-black/60 border border-purple-800 rounded-lg p-6 mt-6">
      <h3 className="text-xl font-bold text-purple-300 mb-4">🔥 Social Quests</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {tasks.map(task => (
          <button
            key={task.id}
            onClick={() => handleClick(task)}
            disabled={clickedTasks.includes(task.id) || taskLoading}
            className={`px-4 py-2 rounded-lg text-white font-semibold shadow text-center transition
              ${clickedTasks.includes(task.id)
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-800 hover:to-purple-950"}`}
          >
            {task.label}
          </button>
        ))}
      </div>

      {cooldownStart && (
        <p className="mt-2 text-sm text-yellow-300 animate-pulse">
          ⏱ Next quest refresh: {getRemainingTime()}
        </p>
      )}

      <div className="mt-4 text-purple-400 text-xs border-t border-purple-800 pt-2">
        <p>✨ Complete all 3 quests to earn +2 points each. After 6h cooldown, you can do them again!</p>
      </div>

      {message && <p className="text-sm mt-2 text-white">{message}</p>}
    </div>
  );
};

export default SocialQuestSection;
