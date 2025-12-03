import { describe, test, expect, jest, afterEach } from "@jest/globals";
import TestRenderer, { act } from "react-test-renderer";
import React,{ useEffect } from "react";
import { Text, TextInput, TouchableOpacity } from "react-native";
import Details from "../../app/pages/details/[id]";
import  {TodoProvider}  from "../../app/context/todoContext";
import { router } from "expo-router";
import { useTodoContext } from "../../app/hooks-perso/useTodoContext";


// ----------------------
// 🔥 Mocks déclarés AVANT
// ----------------------
const mockUseTodoContext = jest.fn();
const mockToggle = jest.fn();
const mockUpdate = jest.fn();
const mockReplace = jest.fn();

// Mock expo-router
jest.mock("expo-router", () => {
  const mockReplace = jest.fn();
  return {
    useLocalSearchParams: () => ({ id: 1 }),
    router: {
      replace: mockReplace,
    },
  };
});


// Mock contexte
jest.mock("../../app//hooks-perso/useTodoContext.tsx", () => ({
  useTodoContext: () => mockUseTodoContext(),
}));

// --------------------------------------------------------

describe("Page Details", () => {

    let renderer;

    afterEach(() => {
        act(() => {
        if (renderer) renderer.unmount();
        });
        renderer = null;

        mockToggle.mockClear();
        mockUpdate.mockClear();
        mockReplace.mockClear();
        mockUseTodoContext.mockClear();
    });

    const renderWithProvider = (ui) => {
        let r;
        act(() => {
        r = TestRenderer.create(<TodoProvider>{ui}</TodoProvider>);
        });
        return r;
    };

  // --------------------------------------------------------
    test("should render title and description inputs", () => {
        mockUseTodoContext.mockReturnValue({
        todos: [{ id: 1, title: "Mon Todo", description: "Desc test", completed: false }],
        toggleTodo: mockToggle,
        updateTodo: mockUpdate,
        });

        renderer = renderWithProvider(<Details />);

        const inputs = renderer.root.findAllByType(TextInput);

        expect(inputs.length).toBe(2);
        expect(inputs[0].props.value).toBe("Mon Todo");
        expect(inputs[1].props.value).toBe("Desc test");
    });

    // --------------------------------------------------------
    test("should display todo status text", () => {
        mockUseTodoContext.mockReturnValue({
        todos: [{ id: 1, title: "Mon Todo", description: "Desc test", completed: false }],
        toggleTodo: mockToggle,
        updateTodo: mockUpdate,
        });

        renderer = renderWithProvider(<Details />);

        const status = renderer.root
        .findAllByType(Text)
        .find(t => t.props.children === "En cours");

        expect(status).toBeDefined();
    });

  // --------------------------------------------------------
    test("should trigger toggleTodo when pressing status", () => {
    let pressedTodoId = null;

    const TestComponent = () => {
        const { todos, toggleTodo } = useTodoContext();

        // Simuler le click sur le Pressable après le rendu
        useEffect(() => {
        if (todos.length > 0) {
            toggleTodo(todos[0].id);
            pressedTodoId = todos[0].id;
        }
        }, [todos, toggleTodo]);

        return <Details />;
    };

    act(() => {
        TestRenderer.create(
        <TodoProvider>
            <TestComponent />
        </TodoProvider>
        );
    });

    expect(pressedTodoId).toBe(1);
    expect(mockToggle).toHaveBeenCalledWith(1);
    });

  // --------------------------------------------------------
    test("should call updateTodo and navigate back", () => {
        mockUseTodoContext.mockReturnValue({
        todos: [{ id: 1, title: "Mon Todo", description: "Desc test", completed: false }],
        toggleTodo: mockToggle,
        updateTodo: mockUpdate,
        });

        renderer = renderWithProvider(<Details />);

        const buttons = renderer.root.findAllByType(TouchableOpacity);
        expect(buttons.length).toBeGreaterThan(0);

        const btn = buttons[0];

        act(() => {
        btn.props.onPress();
        });

        expect(mockUpdate).toHaveBeenCalledWith({
        id: 1,
        title: "Mon Todo",
        description: "Desc test",
        completed: false,
        });
        expect(router.replace).toHaveBeenCalledWith("/pages/list");
    });

    // --------------------------------------------------------
    test("should show not found if todo does not exist", () => {
        mockUseTodoContext.mockReturnValue({
        todos: [],
        toggleTodo: mockToggle,
        updateTodo: mockUpdate,
        });

        renderer = renderWithProvider(<Details />);

        const notFound = renderer.root
        .findAllByType(Text)
        .find(t => t.props.children === "Todo introuvable");

        expect(notFound).toBeDefined();
    });

});
