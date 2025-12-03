import { TodoProvider } from "./context/todoContext";
import {useTodoContext} from "./hooks-perso/useTodoContext";
import { Text,StyleSheet,View } from "react-native";

export default function Index() {
  const { todos } = useTodoContext();
  return (
    <TodoProvider>
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to the Todo App!</Text>
        <Text style={styles.instructions}>Nombre de taches : {todos.length}</Text>
        <Text style={styles.instructions}>Nombre de taches terminées : {todos.filter(todo => todo.completed).length}</Text>
        <Text style={styles.instructions}>Nombre de taches en cours : {todos.filter(todo => !todo.completed).length}</Text>

      </View>
    </TodoProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
