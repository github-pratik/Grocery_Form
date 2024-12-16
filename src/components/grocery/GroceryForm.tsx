import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { addGroceryItem } from "../../services/groceryService";
import toast from "react-hot-toast";

const UNITS = ["pieces", "kg", "g", "l", "ml", "pack"];

export const GroceryForm: React.FC = () => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState(UNITS[0]);
  const [loading, setLoading] = useState(false); // New loading state
  const authContext = useAuth();
  const currentUser = authContext?.currentUser;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Permission check
    if (!name.trim()) {
      toast.error("Item name cannot be empty.");
      return;
    }

    if (!currentUser) {
      toast.error("You must be logged in to add an item.");
      console.error("Current User:", currentUser);
      return;
    }

    setLoading(true);
    try {
      await addGroceryItem({
        name: name.trim(),
        quantity,
        unit,
        createdBy: {
          uid: currentUser.uid,
          email: currentUser.email || "",
          displayName: currentUser.displayName || currentUser.email || "",
        },
      });
      toast.success("Item added successfully!");
      setName("");
      setQuantity(1);
      setUnit(UNITS[0]);
    } catch (error: any) {
      console.error("Error adding item:", error);
      toast.error("Failed to add item. Check your permissions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Add new item..."
        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="number"
        value={quantity}
        min="1"
        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
        className="w-24 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        className="w-32 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {UNITS.map((unit) => (
          <option key={unit} value={unit}>
            {unit}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 disabled:opacity-50"
        disabled={loading} // Disable button when loading
      >
        {loading ? "Adding..." : <><Plus size={20} /> Add Item</>}
      </button>
    </form>
  );
};
