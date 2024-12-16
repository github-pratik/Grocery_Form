import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import toast from "react-hot-toast";

export const CreateGroup: React.FC = () => {
  const { currentUser } = useAuth();
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast.error("Group name is required.");
      return;
    }

    const groupCode = nanoid(6).toUpperCase(); // Unique 6-character group code

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "groups"), {
        name: groupName.trim(),
        code: groupCode,
        adminUid: currentUser?.uid,
        members: [currentUser?.uid],
        createdAt: serverTimestamp(),
      });
      toast.success(`Group "${groupName}" created!`);

      // Navigate to GroupDetails page immediately
      navigate(`/group/${docRef.id}`);
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Failed to create group.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a Group</h1>
      <input
        type="text"
        placeholder="Enter group name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        className="w-full px-4 py-2 border rounded mb-4"
      />
      <button
        onClick={handleCreateGroup}
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {loading ? "Creating..." : "Create Group"}
      </button>
    </div>
  );
};
