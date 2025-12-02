import { Todo } from "./todo";

export interface TodoContextType {
    todos : Todo[];
    addTodo: (todo: Todo) => void;
    removeTodo: (id: number) => void;
    toggleTodo: (id: number) => void;
    updateTodo: (updatedTodo: Todo) => void;
    
}