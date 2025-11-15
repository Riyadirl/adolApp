import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Animated,
    Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Feather";
import { BASE_URL } from "../scr/config";

// ------------------------
// UNIVERSAL API BASE URL
// ------------------------
const getAPIBaseURL = () => {
    if (Platform.OS === "web") return "http://localhost:8000";
    return BASE_URL; // <-- Replace with your LAN IP
};

const API_URL = `${getAPIBaseURL()}/api/chatbot/`;

const ChatbotScreen = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [typing, setTyping] = useState(false);
    const [dots, setDots] = useState("");
    const [welcomeMessage] = useState("Welcome to CareSerenity! How can I help you?");
    const [isFirstMessage, setIsFirstMessage] = useState(true);
    const [sidebarVisible, setSidebarVisible] = useState(false);

    const sidebarAnim = useRef(new Animated.Value(-300)).current;
    const flatListRef = useRef(null);

    // ------------------------
    // Typing dots animation (...)
    // ------------------------
    useEffect(() => {
        let interval;
        if (typing) {
            interval = setInterval(() => {
                setDots((prev) => (prev.length < 3 ? prev + "." : ""));
            }, 500);
        } else {
            setDots("");
        }
        return () => clearInterval(interval);
    }, [typing]);

    // ------------------------
    // SEND MESSAGE
    // ------------------------
    const sendMessage = async () => {
        if (!input.trim()) return;

        if (isFirstMessage) {
            setMessages([]);  // Clear previous messages if it's the first message
            setIsFirstMessage(false);
        }

        const userMsg = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMsg]);

        const token = await AsyncStorage.getItem("access_token");
        setInput("");
        setLoading(true);
        setTyping(true);

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                },
                body: JSON.stringify({ query: input }),
            });

            if (!response.body) throw new Error("Streaming not supported on this device");

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");

            let botMsg = { sender: "bot", text: "" };
            setMessages((prev) => [...prev, botMsg]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split("\n");

                for (let line of lines) {
                    if (line.startsWith("data:")) {
                        try {
                            const json = JSON.parse(line.replace("data: ", ""));
                            if (json.type === "chunk" && json.content) {
                                for (let char of json.content) {
                                    botMsg.text += char;
                                    setMessages((prev) => {
                                        const updated = [...prev];
                                        updated[updated.length - 1] = { ...botMsg };
                                        return updated;
                                    });
                                    await new Promise((r) => setTimeout(r, 5));
                                }
                            }
                        } catch { }
                    }
                }
            }
        } catch (error) {
            console.log("Chatbot error:", error);
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "⚠️ Error connecting to the chatbot." },
            ]);
        } finally {
            setLoading(false);
            setTyping(false);
        }
    };

    // ------------------------
    // SIDEBAR ANIMATION
    // ------------------------
    const toggleSidebar = () => {
        Animated.timing(sidebarAnim, {
            toValue: sidebarVisible ? -300 : 0,
            duration: 280,
            useNativeDriver: true,
        }).start();
        setSidebarVisible(!sidebarVisible);
    };

    // Dismiss keyboard when tapping outside input box
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
            {/* SIDEBAR */}
            <Animated.View style={[styles.sidebar, { transform: [{ translateX: sidebarAnim }] }]}>
                <Text style={styles.sidebarTitle}>Chat History</Text>
                <FlatList
                    data={messages}
                    keyExtractor={(_, i) => i.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.sidebarMessage}>
                            <Text>
                                {item.sender === "user" ? "You: " : "Bot: "}
                                {item.text}
                            </Text>
                        </View>
                    )}
                />
            </Animated.View>

            {/* OVERLAY */}
            {sidebarVisible && (
                <TouchableWithoutFeedback onPress={toggleSidebar}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
            )}

            {/* WELCOME MESSAGE */}
            {isFirstMessage && !typing && !loading && (
                <View style={styles.welcomeContainer}>
                    <Text style={styles.welcomeMessage}>{welcomeMessage}</Text>
                </View>
            )}

            {/* CHAT LIST */}
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item }) => (
                    <View
                        style={[
                            styles.message,
                            item.sender === "user" ? styles.userMessage : styles.botMessage,
                        ]}
                    >
                        <Text style={styles.messageText}>{item.text}</Text>
                    </View>
                )}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            {/* BOT TYPING */}
            {typing && (
                <View style={[styles.message, styles.botMessage]}>
                    <Text style={styles.typingText}>Typing{dots}</Text>
                </View>
            )}

            {/* INPUT */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={input}
                    onChangeText={setInput}
                    placeholder="Type your message..."
                />
                <TouchableOpacity style={styles.button} onPress={sendMessage}>
                    <Text style={styles.buttonText}>Send</Text>
                </TouchableOpacity>
            </View>

            {/* LOADING INDICATOR */}
            {loading && <ActivityIndicator size="small" color="#007BFF" />}

            {/* HAMBURGER MENU */}
            <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
                <Icon name="menu" size={26} color="#333" />
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

// ------------------------
// STYLES (UNCHANGED)
// ------------------------
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#E8F9FF" },
    message: { margin: 8, padding: 12, borderRadius: 12, maxWidth: "80%" },
    userMessage: {
        backgroundColor: "#DCF8C6",
        alignSelf: "flex-end",
        borderBottomRightRadius: 2,
    },
    botMessage: {
        backgroundColor: "#E5E5EA",
        alignSelf: "flex-start",
        borderBottomLeftRadius: 2,
    },
    messageText: { fontSize: 16, color: "#333" },
    typingText: { fontStyle: "italic", color: "#555" },
    inputContainer: {
        flexDirection: "row",
        padding: 10,
        borderTopWidth: 1,
        borderColor: "#ddd",
        backgroundColor: "#E8F9FF",
    },
    input: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 15,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    button: {
        marginLeft: 10,
        backgroundColor: "#007BFF",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    buttonText: { color: "#fff", fontWeight: "bold" },
    welcomeContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    welcomeMessage: { fontSize: 18, fontWeight: "bold", textAlign: "center", paddingHorizontal: 20 },
    sidebar: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        width: 250,
        backgroundColor: "#fff",
        padding: 20,
        elevation: 6,
        zIndex: 20,
    },
    sidebarTitle: { fontSize: 20, fontWeight: "700", marginBottom: 10, textAlign: "center" },
    sidebarMessage: {
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        zIndex: 10,
    },
    menuButton: {
        position: "absolute",
        top: 22,
        left: 20,
        zIndex: 50,
    },
});

export default ChatbotScreen;
