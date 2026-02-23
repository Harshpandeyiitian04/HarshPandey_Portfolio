import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

interface Props {
  onClose: () => void;
}

const AIChat = ({ onClose }: Props) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const question = input;
    setInput("");

    const userMessage = { role: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();

      const aiText =
        data?.answer?.trim() ||
        "I couldn’t find that information in my resume.";

      const aiMessage = { role: "ai", text: aiText };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Sorry, I am having trouble connecting to my AI backend.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999999,
      }}
    >
      <div
        style={{
          width: "600px",
          height: "700px",
          background: "#111",
          borderRadius: "20px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 0 40px rgba(0,0,0,0.5)",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "white",
            marginBottom: "10px",
          }}
        >
          <h2>My Resume AI</h2>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
            }}
          >
            <X />
          </button>
        </div>

        {/* CHAT BODY */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            marginBottom: "10px",
            paddingRight: "5px",
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                textAlign: msg.role === "user" ? "right" : "left",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "10px 15px",
                  borderRadius: "15px",
                  background:
                    msg.role === "user" ? "#ff4ecd" : "#2a2a2a",
                  color: "white",
                  maxWidth: "80%",
                }}
              >
                {msg.text}
              </span>
            </div>
          ))}

          {/* LOADING SPINNER */}
          {loading && (
            <div style={{ textAlign: "left", marginBottom: "10px" }}>
              <div
                style={{
                  width: "25px",
                  height: "25px",
                  border: "3px solid #444",
                  borderTop: "3px solid #ff4ecd",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* INPUT */}
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about my resume..."
            disabled={loading}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              outline: "none",
              opacity: loading ? 0.6 : 1,
            }}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              border: "none",
              background: loading ? "#555" : "#ff4ecd",
              color: "white",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>

      {/* Spinner Animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default AIChat;