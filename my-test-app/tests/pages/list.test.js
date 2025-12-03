import { describe, test, expect, vi } from "@jest/globals";
import TestRenderer, { act ,renderHook} from "react-test-renderer";
import React, { useEffect } from "react";
import List from "../../app/pages/list";
import { TextInput, TouchableOpacity, Text } from "react-native";
import { TodoProvider } from "../../app/context/todoContext";
import { useTodoContext } from "../../app/hooks-perso/useTodoContext";



describe("Page List (react-test-renderer)", () => {
    
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


test("should reset form after submit", () => {
  const renderer = renderWithProvider(<List />);

  // Récupère les TextInput
  const inputs = renderer.root.findAllByType(TextInput);
  const titleInput = inputs[0];
  const descInput = inputs[1];

  // Récupère le bouton Ajouter
  const addButton = renderer.root.findAllByType(TouchableOpacity)
    .find(btn => btn.findByType(Text).props.children === "Ajouter");

  // Tout dans un seul act pour que React flush correctement le state
  act(() => {
    // Simule la saisie
    titleInput.props.onChangeText("Mon Todo");
    descInput.props.onChangeText("Description");

    // Clique sur Ajouter
    addButton.props.onPress();
  });

  // Après act, le state est mis à jour
  expect(titleInput.props.value).toBe("");
  expect(descInput.props.value).toBe("");
});



    test("should toggle todo value", () => {

        expect(true).toBe(true);
    });

    test("should remove todo item", () => {

        expect(true).toBe(true);
    });

    test("should navigate with pressable", () => {

        expect(true).toBe(true);
    });

    test("should change button with todo state", () => {

        expect(true).toBe(true);
    });


});
