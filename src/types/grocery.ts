export interface GroceryItem {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    completed: boolean;
    createdBy: {
      uid: string;
      email: string;
      displayName: string;
    };
    completedBy?: {
      uid: string;
      email: string;
      displayName: string;
      timestamp: Date;
    };
    createdAt: Date;
  }