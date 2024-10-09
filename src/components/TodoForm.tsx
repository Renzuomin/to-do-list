import React, { useState } from 'react';
import { PlusCircle, Save } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Todo } from '../types';

interface TodoFormProps {
  onAdd: (task: string, date?: Date, location?: string, people?: string) => void;
  initialTodo?: Todo;
}

const TodoForm: React.FC<TodoFormProps> = ({ onAdd, initialTodo }) => {
  const [task, setTask] = useState(initialTodo?.task || '');
  const [date, setDate] = useState<Date | null>(initialTodo?.date || null);
  const [location, setLocation] = useState(initialTodo?.location || '');
  const [people, setPeople] = useState(initialTodo?.people || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim()) {
      onAdd(task, date || undefined, location, people);
      if (!initialTodo) {
        setTask('');
        setDate(null);
        setLocation('');
        setPeople('');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col space-y-2">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a new task"
          className="p-2 border border-gray-300 rounded-md"
          required
        />
        <DatePicker
          selected={date}
          onChange={(date: Date) => setDate(date)}
          placeholderText="Select a date"
          className="p-2 border border-gray-300 rounded-md w-full"
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location (optional)"
          className="p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          value={people}
          onChange={(e) => setPeople(e.target.value)}
          placeholder="People (optional)"
          className="p-2 border border-gray-300 rounded-md"
        />
      </div>
      <button
        type="submit"
        className="mt-2 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 flex items-center justify-center"
      >
        {initialTodo ? (
          <>
            <Save size={20} className="mr-2" />
            Save Changes
          </>
        ) : (
          <>
            <PlusCircle size={20} className="mr-2" />
            Add Task
          </>
        )}
      </button>
    </form>
  );
};

export default TodoForm;