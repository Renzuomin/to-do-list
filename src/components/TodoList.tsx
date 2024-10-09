import React, { useState, useEffect } from 'react';
import { Todo } from '../types';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import { CheckSquare, LogOut } from 'lucide-react';
import { useAuth } from './AuthContext';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'todos'), where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const todosData: Todo[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          todosData.push({
            id: doc.id,
            ...data,
            date: data.date instanceof Timestamp ? data.date.toDate() : data.date,
          } as Todo);
        });
        setTodos(todosData);
      }, (error) => {
        console.error("Error fetching todos:", error);
        setError("Failed to fetch todos. Please try again.");
      });

      return () => unsubscribe();
    }
  }, [user]);

  const addTodo = async (task: string, date?: Date, location?: string, people?: string) => {
    if (user) {
      try {
        await addDoc(collection(db, 'todos'), {
          userId: user.uid,
          task,
          completed: false,
          date: date ? Timestamp.fromDate(date) : null,
          location,
          people,
          createdAt: serverTimestamp(),
        });
        setError(null);
      } catch (error) {
        console.error("Error adding todo:", error);
        setError("Failed to add todo. Please try again.");
      }
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      const todoRef = doc(db, 'todos', id);
      const todo = todos.find(t => t.id === id);
      if (todo) {
        await updateDoc(todoRef, {
          completed: !todo.completed
        });
      }
      setError(null);
    } catch (error) {
      console.error("Error toggling todo:", error);
      setError("Failed to update todo. Please try again.");
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'todos', id));
      setError(null);
    } catch (error) {
      console.error("Error deleting todo:", error);
      setError("Failed to delete todo. Please try again.");
    }
  };

  const editTodo = async (id: string, task: string, date?: Date, location?: string, people?: string) => {
    try {
      const todoRef = doc(db, 'todos', id);
      await updateDoc(todoRef, {
        task,
        date: date ? Timestamp.fromDate(date) : null,
        location,
        people,
        updatedAt: serverTimestamp(),
      });
      setError(null);
    } catch (error) {
      console.error("Error editing todo:", error);
      setError("Failed to edit todo. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
      setError("Failed to log out. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 flex items-center">
            <CheckSquare className="mr-2" size={32} />
            To-Do List
          </h2>
          <button
            onClick={handleLogout}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <LogOut size={20} className="mr-1" />
            Logout
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <TodoForm onAdd={addTodo} />
        <div className="space-y-2">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TodoList;