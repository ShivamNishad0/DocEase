import { useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";

export default function Chatbot() {
  const { backendUrl } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages([...messages, userMsg]);

    const res = await axios.post(backendUrl + '/api/chatbot', {
      message: input,
    });

    const botMsg = { sender: "bot", text: res.data.reply };
    setMessages((prev) => [...prev, botMsg]);

    setInput("");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>DocEase AI Assistant</h2>

      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              background: msg.sender === "user" ? "#4f8fff" : "#e6e6e6",
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              color: msg.sender === "user" ? "white" : "black",
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div style={styles.inputArea}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your symptoms..."
        />
        <button style={styles.button} onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "400px",
    margin: "auto",
    background: "white",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    padding: "20px",
  },
  header: { textAlign: "center" },
  chatBox: {
    height: "400px",
    overflowY: "scroll",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
  message: {
    padding: "10px 14px",
    borderRadius: "16px",
    maxWidth: "80%",
  },
  inputArea: {
    marginTop: "10px",
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 14px",
    background: "#0066ff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
