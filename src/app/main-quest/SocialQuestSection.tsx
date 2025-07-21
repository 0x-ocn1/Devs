// components/SocialQuestSection.tsx
"use client";
import React, { useEffect, useState } from "react";

type Task = {
  id: string;
  label: string;
  url: string;
  color: string;
  icon: string;
};
type Props = {
  address: string;
  refreshLeaderboard: () => void;
  setPoints: (points: number) => void;
};



const tasks: Task[] = [
  { id: "follow_twitter", label: "Follow on Twitter", url: "https://twitter.com/yourprofile", color: "bg-blue-600", icon: "🐦" },
  { id: "join_discord", label: "Join Discord", url: "https://discord.gg/yourinvite", color: "bg-purple-700", icon: "💬" },
  { id: "tweet_about", label: "Tweet About Us", url: "https://twitter.com/intent/tweet?text=Check%20out%20Raven%20Rush!", color: "bg-blue-500", icon: "📣" },
  { id: "like_tweet", label: "Like our Tweet", url: "https://twitter.com/yourtweet", color: "bg-pink-600", icon: "❤️" },
  { id: "retweet", label: "Retweet", url: "https://twitter.com/yourtweet", color: "bg-green-600", icon: "🔁" },
  { id: "comment", label: "Comment on Tweet", url: "https://twitter.com/yourtweet", color: "bg-yellow-500", icon: "💬" }
];

const SocialQuestSection: React.FC<Props> = ({ address }) => {
  const [clickedTasks, setClickedTasks] = useState<string[]>([]);
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // Fetch completed tasks on load
  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const res = await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address, action: "get_social_state" })
        });
        const data = await res.json();
        if (res.ok && data.clickedTasks) {
          setClickedTasks(data.clickedTasks);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchCompletedTasks();
  }, [address]);

  const handleClick = async (task: Task) => {
  if (loadingTaskId || clickedTasks.includes(task.id)) return;
  window.open(task.url, "_blank");
  setLoadingTaskId(task.id);

  try {
    const res = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, action: "social_quest", taskId: task.id })
    });
    const data = await res.json();

    if (res.ok && data.success && data.clickedTasks) {
      setClickedTasks(data.clickedTasks);

      if (data.newPoints) {
        setPoints(data.newPoints); // 🔥 immediately update points in parent
      }

      refreshLeaderboard(); // also refetch fully to keep everything else in sync
      setMessage(`✅ "${task.label}" completed! +2 points`);
    } else {
      setMessage(data?.message || "❌ Failed to complete task");
    }
  } catch (e) {
    console.error(e);
    setMessage("❌ Server error");
  } finally {
    setLoadingTaskId(null);
    setTimeout(() => setMessage(""), 3000);
  }
};

  return (
    <div className="w-full max-w-5xl bg-black/70 border border-purple-800 rounded-lg p-6 mt-6">
      <h3 className="text-xl font-bold text-purple-300 mb-4">🔥 Social Quests</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {tasks.map(task => {
          const completed = clickedTasks.includes(task.id);
          return (
            <button
              key={task.id}
              onClick={() => handleClick(task)}
              disabled={completed || loadingTaskId === task.id}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white font-semibold shadow transition transform hover:scale-105
                ${completed ? "bg-gray-600 cursor-not-allowed" : `${task.color} hover:opacity-90`}`}
            >
              <span>{task.icon}</span>
              <span>{task.label}</span>
              {completed && <span className="text-green-300">✔</span>}
            </button>
          );
        })}
      </div>
      {message && <p className="text-sm mt-3 text-white">{message}</p>}
    </div>
  );
};

export default SocialQuestSection;
function refreshLeaderboard() {
  throw new Error("Function not implemented.");
}

function setPoints(newPoints: any) {
  throw new Error("Function not implemented.");
}

