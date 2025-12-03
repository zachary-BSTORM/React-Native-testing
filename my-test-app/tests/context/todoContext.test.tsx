import { describe, test, expect } from "@jest/globals";
import TestRenderer, { act } from "react-test-renderer";
import { TodoProvider, TodoContext } from "../../app/context/todoContext";
import { useContext, useEffect } from "react";
import { Todo } from "@/app/models/todo";

// Composant pour capturer et exposer le context dans les tests
const TestConsumer = ({ onUpdate }: { onUpdate: (ctx: any) => void }) => {
  const ctx = useContext(TodoContext);

  useEffect(() => {
    if (ctx) onUpdate(ctx);
  }, [ctx]);

  return null;
};

describe("TodoContext (avec react-test-renderer)", () => {
  let contextValue: any;

  const renderWithProvider = () => {

    act(() => {

      TestRenderer.create(

        <TodoProvider>
          <TestConsumer onUpdate={(ctx) => (contextValue = ctx)} />
        </TodoProvider>

      );

    });

  };

  test("fournit une liste vide par défaut", () => {
    renderWithProvider();
    expect(contextValue.todos).toEqual([]);
  });

  test("addTodo ajoute un todo", () => {
    renderWithProvider();
    const newTodo: Todo = { id: 1, title: "Acheter du lait", description: "test", completed: false };

    act(() => contextValue.addTodo(newTodo));

    expect(contextValue.todos).toHaveLength(1);
    expect(contextValue.todos[0]).toEqual(newTodo);
  });

  test("removeTodo supprime le bon todo", () => {
    renderWithProvider();
    const t1: Todo = { id: 1, title: "Todo 1", description: "test", completed: false };
    const t2: Todo = { id: 2, title: "Todo 2", description: "test", completed: false };

    act(() => {
      contextValue.addTodo(t1);
      contextValue.addTodo(t2);
    });

    act(() => contextValue.removeTodo(1));

    expect(contextValue.todos).toHaveLength(1);
    expect(contextValue.todos[0].id).toBe(2);
  });

  test("toggleTodo inverse completed", () => {
    renderWithProvider();
    const t: Todo = { id: 1, title: "Test", description: "test", completed: false };

    act(() => contextValue.addTodo(t));
    act(() => contextValue.toggleTodo(1));
    expect(contextValue.todos[0].completed).toBe(true);

    act(() => contextValue.toggleTodo(1));
    expect(contextValue.todos[0].completed).toBe(false);
  });

  test("updateTodo met à jour le todo", () => {
    renderWithProvider();
    const t: Todo = { id: 1, title: "Ancien", description: "test", completed: false };

    act(() => contextValue.addTodo(t));

    const updated: Todo = { id: 1, title: "Nouveau texte", description: "test", completed: true };

    act(() => contextValue.updateTodo(updated));

    expect(contextValue.todos[0]).toEqual(updated);
  });
  
});
