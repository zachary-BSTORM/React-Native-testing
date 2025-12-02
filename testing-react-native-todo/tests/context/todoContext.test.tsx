import { describe, test, expect, beforeEach } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { TodoProvider, TodoContext } from "@/app/context/todoContext";
import { useContext } from "react";
import { Todo } from "@/app/models/todo";

// Petit composant utilitaire pour récupérer le context
const TestConsumer = ({ callback }: { callback: (value: any) => void }) => {
    const ctx = useContext(TodoContext);
    callback(ctx);
    return null;
};

describe("TodoContext", () => {
    let contextValue: any;

    const renderWithProvider = () => {
        render(
            <TodoProvider>
                <TestConsumer callback={(value) => (contextValue = value)} />
            </TodoProvider>
        );
    };

    beforeEach(() => {
        contextValue = null;
    });

    test("fournit une liste vide par défaut", () => {
        renderWithProvider();
        expect(contextValue.todos).toEqual([]);
    });

    test("addTodo ajoute un todo", () => {
        renderWithProvider();

        const newTodo: Todo = { id: 1, title: "Acheter du lait", description: "test", completed: false };
        contextValue.addTodo(newTodo);

        expect(contextValue.todos).toHaveLength(1);
        expect(contextValue.todos[0]).toEqual(newTodo);
    });

    test("removeTodo supprime le bon todo", () => {
        renderWithProvider();

        const t1: Todo = { id: 1, title: "Todo 1", description: "test", completed: false };
        const t2: Todo = { id: 2, title: "Todo 2", description: "test", completed: false };

        contextValue.addTodo(t1);
        contextValue.addTodo(t2);

        contextValue.removeTodo(1);

        expect(contextValue.todos).toHaveLength(1);
        expect(contextValue.todos[0].id).toBe(2);
    });

    test("toggleTodo inverse la valeur completed", () => {
        renderWithProvider();

        const t: Todo = { id: 1, title: "Test", description: "test", completed: false };
        contextValue.addTodo(t);

        contextValue.toggleTodo(1);
        expect(contextValue.todos[0].completed).toBe(true);

        contextValue.toggleTodo(1);
        expect(contextValue.todos[0].completed).toBe(false);
    });

    test("updateTodo met à jour le todo", () => {
        renderWithProvider();

        const t: Todo = { id: 1, title: "Ancien", description: "test", completed: false };
        contextValue.addTodo(t);

        const updated: Todo = { id: 1, title: "Nouveau texte",description : "test", completed: true };
        contextValue.updateTodo(updated);

        expect(contextValue.todos[0]).toEqual(updated);
    });
});
