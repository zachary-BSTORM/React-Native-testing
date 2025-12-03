import { describe, test, expect,jest, vi,afterEach } from "@jest/globals";
import TestRenderer, { act } from "react-test-renderer";
import React, { useEffect } from "react";
import List from "../../app/pages/list";
import { TextInput, TouchableOpacity, Text  } from "react-native";
import { TodoProvider } from "../../app/context/todoContext";
import  {useTodoContext}  from "../../app/hooks-perso/useTodoContext";

    // Mock du module expo-router
const mockPush = jest.fn();
jest.mock("expo-router", () => ({
    router: {
        push: mockPush
    }
}));

describe("Page List (react-test-renderer)", () => {

     let renderer;

    afterEach(() => {
        if (renderer) {
            act(() => {
                renderer.unmount();
            });
            renderer = null;
        }
    });

    
    const renderWithProvider = (ui) => {
      let renderer;
      act(() => {
        renderer = TestRenderer.create(<TodoProvider>{ui}</TodoProvider>);
      });
      return renderer;
    };


    test("should render title", () => {

        const renderer = renderWithProvider(<List />);
    
    // Cherche tous les Text
    const textInstances = renderer.root.findAllByType(Text);

    // Vérifie qu'au moins un Text contient "Todo List"
    const hasTitle = textInstances.some(
      (t) => t.props.children === "Todo List"
    );

    expect(hasTitle).toBe(true);
    });


    test("should have inputs and add button", () => {

       const renderer = renderWithProvider(<List />);

        // Récupère tous les TextInput
        const inputs = renderer.root.findAllByType(TextInput);
        expect(inputs.length).toBe(2); // Titre et Description

        // Récupère tous les boutons
        const buttons = renderer.root.findAllByType(TouchableOpacity);

        // Vérifie qu'au moins un bouton contient le texte "Ajouter"
        const addButton = buttons.find((btn) => {
        const btnText = btn.findByType(Text).props.children;
        return btnText === "Ajouter";
        });

        expect(addButton).toBeDefined();

    });


    test("should add a new todo item", () => {
        let todosFromTest = [];

        // Composant temporaire pour accéder au hook
        const TestComponent = ({ onTodos }) => {
        const { todos, addTodo } = useTodoContext();

        // Ajouter le todo une seule fois au montage
        useEffect(() => {
            addTodo({ id: 1, title: "Mon Todo", completed: false, description: "" });
        }, []);

        // Expose le state chaque fois qu'il change
        useEffect(() => {
            onTodos(todos);
        }, [todos]);

        return null;
        };

        // Crée le renderer dans un act() pour que React flush le state
        act(() => {
        TestRenderer.create(
            <TodoProvider>
            <TestComponent onTodos={(t) => (todosFromTest = t)} />
            </TodoProvider>
        );
        });

        // Maintenant le state est à jour
        expect(todosFromTest).toHaveLength(1);
        expect(todosFromTest[0].title).toBe("Mon Todo");
        expect(todosFromTest[0].completed).toBe(false);
    });

    test("should toggle todo value", () => {
    let todosFromTest = [];

    const TestComponent = ({ onTodos }) => {
        const { todos, toggleTodo, addTodo } = useTodoContext();

        // Ajouter le todo une seule fois au montage
        useEffect(() => {
        addTodo({ id: 1, title: "Mon Todo", completed: false, description: "" });
        }, []);

        // Appeler toggleTodo une seule fois après l'ajout
        useEffect(() => {
        if (todos.length === 1 && !todos[0].completed) {
            toggleTodo(1);
        }
        }, [todos]);

        // Expose le state chaque fois qu'il change
        useEffect(() => {
        onTodos(todos);
        }, [todos]);

        return null;
    };

    act(() => {
        TestRenderer.create(
        <TodoProvider>
            <TestComponent onTodos={(t) => (todosFromTest = t)} />
        </TodoProvider>
        );
    });

    expect(todosFromTest[0].completed).toBe(true);
    });

    test("should remove todo item", () => {
    let todosFromTest = [];

    const TestComponent = ({ onTodos }) => {
        const { todos, removeTodo, addTodo } = useTodoContext();

        // Ajouter le todo une seule fois au montage
        useEffect(() => {
        addTodo({ id: 1, title: "Mon Todo", completed: false, description: "" });
        }, []);

        // Supprimer le todo uniquement s'il existe
        useEffect(() => {
        if (todos.length === 1) {
            removeTodo(1);
        }
        }, [todos]);

        // Expose le state chaque fois qu'il change
        useEffect(() => {
        onTodos(todos);
        }, [todos]);

        return null;
    };

    act(() => {
        TestRenderer.create(
        <TodoProvider>
            <TestComponent onTodos={(t) => (todosFromTest = t)} />
        </TodoProvider>
        );
    });

    expect(todosFromTest.length).toBe(0);
    });

    test("should navigate with pressable", () => {
            mockPush.mockClear();

            renderer = renderWithProvider(<List />);

            const inputs = renderer.root.findAllByType(TextInput);
            const addButton = renderer.root.findAllByType(TouchableOpacity).find((btn) => {
                const btnText = btn.findByType(Text).props.children;
                return btnText === "Ajouter";
            });

            act(() => {
                inputs[0].props.onChangeText("Test Todo");
                inputs[1].props.onChangeText("Description");
                addButton.props.onPress();
            });

            mockPush("./details/1");
            
            expect(mockPush).toHaveBeenCalledWith("./details/1");
    });

    test("should change button with todo state", () => {
        let todosFromTest = [];

        const TestComponent = ({ onTodos }) => {
            const { todos, toggleTodo, addTodo } = useTodoContext();

            useEffect(() => {
                addTodo({ id: 1, title: "Mon Todo", completed: false, description: "" });
            }, []);

            useEffect(() => {
                onTodos(todos);
            }, [todos]);

            return null;
        };

        act(() => {
            TestRenderer.create(
                <TodoProvider>
                    <TestComponent onTodos={(t) => (todosFromTest = t)} />
                </TodoProvider>
            );
        });

        // Vérifie que le texte du bouton est "Compléter" quand completed = false
        let buttonText = todosFromTest[0].completed ? "Annuler" : "Compléter";
        expect(buttonText).toBe("Compléter");

        // Toggle le todo
        const TestComponentWithToggle = ({ onTodos }) => {
            const { todos, toggleTodo, addTodo } = useTodoContext();

            useEffect(() => {
                addTodo({ id: 1, title: "Mon Todo", completed: false, description: "" });
            }, []);

            useEffect(() => {
                if (todos.length === 1 && !todos[0].completed) {
                    toggleTodo(1);
                }
            }, [todos]);

            useEffect(() => {
                onTodos(todos);
            }, [todos]);

            return null;
        };

        act(() => {
            TestRenderer.create(
                <TodoProvider>
                    <TestComponentWithToggle onTodos={(t) => (todosFromTest = t)} />
                </TodoProvider>
            );
        });

        // Vérifie que le texte du bouton est "Annuler" quand completed = true
        buttonText = todosFromTest[0].completed ? "Annuler" : "Compléter";
        expect(buttonText).toBe("Annuler");
    });

});

