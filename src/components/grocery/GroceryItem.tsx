import React from 'react';
import { Check, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { GroceryItem as IGroceryItem } from '../../types/grocery';
import { toggleGroceryItem, deleteGroceryItem } from '../../services/groceryService';

interface Props {
  item: IGroceryItem;
  currentUserUid: string;
  currentUserName: string | null;
}

export const GroceryItem: React.FC<Props> = ({ item, currentUserUid }) => {
  const handleToggle = () => toggleGroceryItem(item.id, !item.completed);
  const handleDelete = () => deleteGroceryItem(item.id);

  return (
    <div className={`flex items-center justify-between p-4 rounded-lg border ${
      item.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'
    }`}>
      <div className="flex items-center gap-3">
        <button
          onClick={handleToggle}
          className={`p-2 rounded-full ${
            item.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
          }`}
        >
          <Check size={20} />
        </button>
        <div className="flex flex-col">
          <span className={item.completed ? 'line-through text-gray-500' : ''}>
            {item.name} - {item.quantity} {item.unit}
          </span>
          <span className="text-sm text-gray-500">
            Added by {item.createdBy.displayName}
          </span>
          {item.completed && item.completedBy && (
            <span className="text-sm text-gray-500">
              Completed by {item.completedBy.displayName} on {format(item.completedBy.timestamp, 'MMM d, yyyy HH:mm')}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {item.createdBy.uid === currentUserUid && (
          <button
            onClick={handleDelete}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-red-500"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </div>
  );
};