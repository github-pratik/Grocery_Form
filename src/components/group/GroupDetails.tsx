import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDoc,
  getDocs,
  onSnapshot,
  doc,
  updateDoc,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { arrayUnion } from "firebase/firestore";

interface Item {
  id: string;
  name: string;
  quantity: number;
  addedBy: string[];
  completedBy?: string[];
  completed?: boolean;
}

export const GroupDetails: React.FC = () => {
  const { currentUser } = useAuth();
  const { id: groupId } = useParams();
  const [items, setItems] = useState<Item[]>([]);
  const [groupCode, setGroupCode] = useState("");
  const [newItem, setNewItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  useEffect(() => {
    if (!groupId) return;

    // Fetch group details
    const fetchGroupDetails = async () => {
      const groupRef = doc(db, "groups", groupId);
      const groupSnap = await getDoc(groupRef);
      if (groupSnap.exists()) {
        const groupData = groupSnap.data();
        setGroupCode(groupData.code);
      } else {
        toast.error("Group not found.");
        navigate("/");
      }
    };

    fetchGroupDetails();

    // Fetch group items
    const itemsQuery = query(collection(db, "groupItems"), where("groupId", "==", groupId));
    const unsubscribe = onSnapshot(itemsQuery, (snapshot) => {
      const fetchedItems = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Item[];
      setItems(fetchedItems);
    });

    return () => unsubscribe();
  }, [groupId, navigate]);

  // Add item
  const handleAddItem = async () => {
    if (!newItem.trim()) return toast.error("Item name is required.");

    setLoading(true); // Set loading state
    try {
      await addDoc(collection(db, "groupItems"), {
        groupId,
        name: newItem.trim(),
        quantity,
        addedBy: [
          currentUser?.uid || "unknown-user",
          currentUser?.displayName || "Anonymous",
          currentUser?.email || "No email",
        ],
        completed: false,
        completedBy: [],
        createdAt: serverTimestamp(),
      });
      setNewItem("");
      setQuantity(1);
      toast.success("Item added successfully!");
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Failed to add item.");
    } finally {
      setLoading(false);
    }
  };

  // Leave group
  const handleLeaveGroup = async () => {
    setLoading(true); // Set loading state
    try {
      const groupRef = doc(db, "groups", groupId);
      await updateDoc(groupRef, {
        members: arrayRemove(currentUser?.uid), // Remove user ID from members array
      });
      toast.success("You have left the group.");
      navigate("/"); // Navigate to home page
    } catch (error) {
      console.error("Error leaving group:", error);
      toast.error("Failed to leave group.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Group Details</h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Home
          </button>
          <button
            onClick={handleLeaveGroup}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            {loading ? "Leaving..." : "Leave Group"}
          </button>
        </div>
      </div>
      <p className="mb-4 font-semibold">Special Code: {groupCode}</p>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Item name"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="flex-1 px-4 py-2 border rounded"
          disabled={loading}
        />
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-24 px-4 py-2 border rounded"
          disabled={loading}
        />
        <button
          onClick={handleAddItem}
          disabled={loading}
          className={`px-4 py-2 rounded ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
        >
          {loading ? "Adding..." : "Add Item"}
        </button>
      </div>

      <ul>
        {items.map((item) => (
          <li key={item.id} className="flex justify-between p-2 border-b">
            <div>
              <p>
                {item.name} - {item.quantity}
              </p>
              {item.addedBy && Array.isArray(item.addedBy) && (
                <small>
                  Added by: {item.addedBy[1]} ({item.addedBy[2]})
                </small>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
