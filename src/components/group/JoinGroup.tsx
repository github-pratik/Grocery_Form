import { doc, collection, query, where, getDocs, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import toast from "react-hot-toast";

export const JoinGroup: React.FC = () => {
  const { currentUser } = useAuth();
  const [groupCode, setGroupCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoinGroup = async () => {
    if (!groupCode.trim()) {
      toast.error("Group code is required!");
      return;
    }

    if (!currentUser?.uid) {
      toast.error("User not logged in!");
      return;
    }

    setLoading(true);

    try {
      // Query the group document
      const groupQuery = query(
        collection(db, "groups"),
        where("code", "==", groupCode.trim())
      );
      const querySnapshot = await getDocs(groupQuery);

      if (querySnapshot.empty) {
        toast.error("No group found with this code.");
        setLoading(false);
        return;
      }

      // Get the first document's reference
      const groupDoc = querySnapshot.docs[0];
      const groupRef = doc(db, "groups", groupDoc.id); // Ensure it's a valid reference

      // Update the members array
      await updateDoc(groupRef, {
        members: arrayUnion(currentUser.uid),
      });

      toast.success("Successfully joined the group!");
      navigate(`/group/${groupDoc.id}`);
    } catch (error) {
      console.error("Error joining group:", error);
      toast.error("Failed to join the group. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Join a Group</h1>
      <input
        type="text"
        placeholder="Enter group code"
        value={groupCode}
        onChange={(e) => setGroupCode(e.target.value)}
        className="w-full px-4 py-2 border rounded mb-4"
      />
      <button
        onClick={handleJoinGroup}
        disabled={loading}
        className={`w-full px-4 py-2 rounded ${
          loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
        } text-white`}
      >
        {loading ? "Joining..." : "Join Group"}
      </button>
    </div>
  );
};
