import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import toast from "react-hot-toast";

interface Group {
  id: string;
  name: string;
}

export const GroupList: React.FC = () => {
  const { currentUser } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    const fetchGroups = async () => {
      try {
        const q = query(
          collection(db, "groups"),
          where("members", "array-contains", currentUser.uid)
        );
        const snapshot = await getDocs(q);
        const userGroups = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Group[];
        setGroups(userGroups);
      } catch (error) {
        toast.error("Failed to fetch groups.");
        console.error("Error fetching groups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [currentUser]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Groups</h1>
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => navigate("/create-group")}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Create Group
        </button>
        <button
          onClick={() => navigate("/join-group")}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Join Group
        </button>
      </div>
      {loading ? (
        <p>Loading groups...</p>
      ) : groups.length > 0 ? (
        <ul>
          {groups.map((group) => (
            <li
              key={group.id}
              className="p-4 bg-gray-100 rounded-lg mb-2 flex justify-between items-center"
            >
              <span>{group.name}</span>
              <button
                onClick={() => navigate(`/group/${group.id}`)}
                className="px-3 py-1 bg-blue-400 text-white rounded hover:bg-blue-500"
              >
                View Group
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No groups joined yet. Create or join a group.</p>
      )}
    </div>
  );
};
