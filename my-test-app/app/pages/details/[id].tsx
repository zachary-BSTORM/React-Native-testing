import { View, Text, StyleSheet, TextInput, Pressable, TouchableOpacity } from "react-native";
import useTodoContext from "../../hooks-perso/useTodoContext";
import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";

export default function Details() {
    const { id } = useLocalSearchParams();
    const { todos, toggleTodo, updateTodo } = useTodoContext();

    const todo = todos.find(t => t.id === Number(id));

    // États locaux pour édition
    const [title, setTitle] = useState(todo?.title || "");
    const [description, setDescription] = useState(todo?.description || "");

    if (!todo) {
        return (
            <View style={styles.container}>
                <Text style={styles.notFound}>Todo introuvable</Text>
            </View>
        );
    }

    // Fonction pour sauvegarder les modifications
    const handleSave = () => {
        // On retire l'ancien todo et on ajoute le modifié (simple, car pas d'update dans le context)
        updateTodo({
            ...todo,
            title,
            description
        });
        router.replace("/pages/list" );
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text style={styles.label}>Titre :</Text>
                <TextInput
                    style={styles.title}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Titre du todo"
                />
                <Text style={styles.label}>Description :</Text>
                <TextInput
                    style={styles.description}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Description du todo"
                    multiline
                />
                <Pressable onPress={() => toggleTodo(todo.id)}>
                    <Text style={styles.label}>Statut :</Text>
                    <Text style={[styles.status, todo.completed ? styles.completed : styles.incomplete]}>
                        {todo.completed ? "Complété" : "En cours"}
                    </Text>
                </Pressable>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Enregistrer et revenir à la liste</Text>
                </TouchableOpacity>
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
    label: {
        fontWeight: 'bold',
        marginTop: 10,
    },
    description: {
        fontSize: 16,
        marginBottom: 10,
    },
    status: {
        fontSize: 16,
        marginTop: 5,
    },
    completed: {
        color: 'green',
        fontWeight: 'bold',
    },
    incomplete: {
        color: 'orange',
        fontWeight: 'bold',
    },
    notFound: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginTop: 50,
    },
    saveButton: {
        marginTop: 30,
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});