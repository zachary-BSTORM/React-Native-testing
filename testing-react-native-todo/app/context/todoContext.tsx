import { createContext, useState } from "react";
import { TodoContextType } from "../models/todoContextType";
import { Todo } from "../models/todo";



const TodoContext = createContext<TodoContextType | undefined>(undefined);

const TodoProvider = ({ children }: { children: React.ReactNode }) => {
    
    const [todos,setTodos] = useState<Todo[]>([]);

    const addTodo = (todo: Todo) => {
        setTodos([...todos, todo]);
    };

    const removeTodo = (id: number) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const toggleTodo = (id: number) => {
        setTodos(
            todos.map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const updateTodo = (updatedTodo: Todo) => {
        setTodos(
            todos.map(todo =>
                todo.id === updatedTodo.id ? updatedTodo : todo
            )
        );
    };

    return (
        <TodoContext.Provider value={{ todos, addTodo, removeTodo, toggleTodo, updateTodo }}>
            {children}
        </TodoContext.Provider>
    );
}

export { TodoContext, TodoProvider };