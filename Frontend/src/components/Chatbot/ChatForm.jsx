import React, { useRef } from "react";

const ChatForm = ({ chatHistory, setChatHistory, handleUserQuery }) => {
  const inputRef = useRef();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;

    inputRef.current.value = "";

    // Update chat history with user's message
    setChatHistory((history) => [...history, { role: "user", text: userMessage }]);

    // Delay before showing "Thinking..." and generating a response
    setTimeout(() => {
      // Add "Thinking..." placeholder for bot's response
      setChatHistory((history) => [...history, { role: "model", text: "Thinking..." }]);

      // Call the function to handle user queries and generate the bot's response
      handleUserQuery(userMessage);  // Call the updated function
    }, 300);
  };

  return (
    <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Message..."
        className="message-input"
        required
      />
      <button className="material-symbols-rounded">arrow_upward</button>
    </form>
  );
};

export default ChatForm;
