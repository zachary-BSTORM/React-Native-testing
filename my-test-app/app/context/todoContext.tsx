import { createContext, useMemo, useState } from "react";
import { TodoContextType } from "../models/todoContextType";
import { Todo } from "../models/todo";

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const TodoProvider = ({ children }: { children: React.ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (todo: Todo) => setTodos((prev) => [...prev, todo]);

  const removeTodo = (id: number) => setTodos((prev) => prev.filter((todo) => todo.id !== id));

  const toggleTodo = (id: number) =>
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );

  const updateTodo = (updatedTodo: Todo) =>
    setTodos((prev) => prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)));

  const value = useMemo(
    () => ({
      todos,
      addTodo,
      removeTodo,
      toggleTodo,
      updateTodo,
    }),
    [todos]
  );

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

export { TodoContext, TodoProvider };
