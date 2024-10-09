import React, { useState } from 'react';
import { Todo } from '../types';
import { Check, Trash2, Calendar, MapPin, Users, Edit2 } from 'lucide-react';
import TodoForm from './TodoForm';
import { format, isValid } from 'date-fns';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, task: string, date?: Date, location?: string, people?: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = (task: string, date?: Date, location?: string, people?: string) => {
    onEdit(todo.id, task, date, location, people);
    setIsEditing(false);
  };

  if (isEditing) {
    return <TodoForm onAdd={handleEdit} initialTodo={todo} />;
  }

  const formatDate = (date: Date | undefined) => {
    if (date && isValid(date)) {
      return format(date, 'yyyy-MM-dd');
    }
    return '';
  };

  return (
    <div className={`flex items-center justify-between p-4 mb-2 bg-white rounded-lg shadow ${todo.completed ? 'opacity-50' : ''}`}>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => onToggle(todo.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            todo.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
          }`}
        >
          {todo.completed && <Check size={16} className="text-white" />}
        </button>
        <div>
          <p className={`text-lg ${todo.completed ? 'line-through' : ''}`}>{todo.task}</p>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            {todo.date && (
              <div className="flex items-center">
                <Calendar size={14} className="mr-1" />
                <span>{formatDate(todo.date)}</span>
              </div>
            )}
            {todo.location && (
              <div className="flex items-center">
                <MapPin size={14} className="mr-1" />
                <span>{todo.location}</span>
              </div>
            )}
            {todo.people && (
              <div className="flex items-center">
                <Users size={14} className="mr-1" />
                <span>{todo.people}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex space-x-2">
        <button onClick={() => setIsEditing(true)} className="text-blue-500 hover:text-blue-700">
          <Edit2 size={20} />
        </button>
        <button onClick={() => onDelete(todo.id)} className="text-red-500 hover:text-red-700">
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;