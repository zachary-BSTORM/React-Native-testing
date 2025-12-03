import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";


export default function Navbar(){
    return (
        <View style={styles.container}>
        <Link style={styles.title} href="/">Home</Link>
        <Link style={styles.title} href="/pages/list">Todos</Link>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});