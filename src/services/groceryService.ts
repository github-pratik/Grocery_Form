import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  onSnapshot, 
  query 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { GroceryItem } from "../types/grocery";
import { User } from "firebase/auth";
import toast from "react-hot-toast";

const COLLECTION_NAME = "groceryItems"; // Ensure this matches Firestore rules

interface AddGroceryItemParams {
  name: string;
  quantity: number;
  unit: string;
  createdBy: {
    uid: string;
    email: string;
    displayName: string;
  };
}

// Add a new grocery item
export const addGroceryItem = async (params: AddGroceryItemParams) => {
  try {
    if (!params.name || !params.createdBy.uid) {
      throw new Error("Invalid item data. Name and creator information are required.");
    }

    await addDoc(collection(db, COLLECTION_NAME), {
      ...params,
      completed: false,
      createdAt: serverTimestamp(),
    });
    toast.success("Item added successfully!");
  } catch (error: any) {
    console.error("Error adding item:", error.code, error.message);
    if (error.code === "permission-denied") {
      toast.error("You don't have permission to add items.");
    } else {
      toast.error("Failed to add item. Please try again.");
    }
    throw error;
  }
};

// Toggle grocery item completion status
export const toggleGroceryItem = async (id: string, completed: boolean, user?: User | null) => {
  try {
    if (!id) throw new Error("Item ID is required.");

    const data: any = { completed };
    if (completed && user) {
      data.completedBy = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email,
        timestamp: serverTimestamp(),
      };
    } else {
      data.completedBy = null;
    }

    await updateDoc(doc(db, COLLECTION_NAME, id), data);
    toast.success(completed ? "Item marked as completed" : "Item marked as incomplete");
  } catch (error: any) {
    console.error("Error toggling item:", error.code, error.message);
    toast.error("Failed to update item.");
    throw error;
  }
};

// Delete a grocery item
export const deleteGroceryItem = async (id: string) => {
  try {
    if (!id) throw new Error("Item ID is required.");
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    toast.success("Item deleted successfully.");
  } catch (error: any) {
    console.error("Error deleting item:", error.code, error.message);
    toast.error("Failed to delete item.");
    throw error;
  }
};

// Subscribe to grocery items in real-time
export const subscribeToGroceryItems = (callback: (items: GroceryItem[]) => void) => {
  try {
    const itemsQuery = query(collection(db, COLLECTION_NAME));
    const unsubscribe = onSnapshot(
      itemsQuery,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as GroceryItem[];
        callback(items);
      },
      (error) => {
        console.error("Error in snapshot listener:", error.message);
        toast.error("Failed to fetch grocery items. Check your permissions.");
      }
    );
    return unsubscribe;
  } catch (error) {
    console.error("Error subscribing to grocery items:", error);
    toast.error("Failed to subscribe to items.");
    throw error;
  }
};
