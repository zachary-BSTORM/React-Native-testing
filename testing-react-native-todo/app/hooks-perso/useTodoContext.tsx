import { useContext } from "react";
import { TodoContext } from "../context/todoContext";


export default function useTodoContext() {
    const context = useContext(TodoContext);
    if (context === undefined) {
  throw new Error("useTodoContext must be used within a TodoProvider");
}
return context;
}