import { FlatList, TextInput, View, Text, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import useTodoContext from "../hooks-perso/useTodoContext";
import { Todo } from "../models/todo";
import { useState } from "react";
import { router } from "expo-router";

export default function List() {
    const { todos , addTodo, removeTodo, toggleTodo } = useTodoContext();
    const [newTodo, setNewTodo] = useState<Todo>({
        id: 0,
        title: "",
        completed: false,
        description: ""
    });

    const addTodoForm = () => {
        if (!newTodo.title.trim()) return;
        const todoToAdd: Todo = {
            id: todos.length + 1,
            title: newTodo.title,
            completed: false,
            description: newTodo.description
        };
        addTodo(todoToAdd);
        setNewTodo({ id: 0, title: "", completed: false, description: "" });
    };

    return (
        <View style={{ flex: 1 }}>

        <View style={styles.container}>
            <Text style={styles.title}>Todo List</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    value={newTodo.title}
                    placeholder="Titre..."
                    onChangeText={text => setNewTodo({ ...newTodo, title: text })}
                    style={styles.input}
                />
                <TextInput
                    value={newTodo.description}
                    placeholder="Description..."
                    onChangeText={text => setNewTodo({ ...newTodo, description: text })}
                    style={styles.input}
                />
                <TouchableOpacity style={styles.addButton} onPress={addTodoForm}>
                    <Text style={styles.addButtonText}>Ajouter</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={todos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Pressable onPress={() => router.push(`./details/${item.id}`) } >
                    <View style={styles.todoItem}>
                        <Text style={[styles.todoTitle, item.completed && styles.completed]}>{item.title}</Text>
                        <View style={styles.actions}>
                            <TouchableOpacity style={styles.actionButton} onPress={() => toggleTodo(item.id)}>
                                <Text>{item.completed ? 'Annuler' : 'Compléter'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton} onPress={() => removeTodo(item.id)}>
                                <Text>Supprimer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    </Pressable>
                )}
            />
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    todoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    todoTitle: {
        fontSize: 18,
    },
    completed: {
        textDecorationLine: 'line-through',
        color: '#888',
    },
    actions: {
        flexDirection: 'row',
        gap: 10,
    },
    actionButton: {
        marginLeft: 10,
    },
});