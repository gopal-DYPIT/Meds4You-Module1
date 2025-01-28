import React, { useEffect, useRef, useState } from "react";
import ChatbotIcon from "./ChatbotIcon";
import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessage";
import companyInfo from "./companyInfo.json"; // Import company info from the JSON file
import "./style/Chatbot.css";
import { KeyboardArrowDown, ModeComment, Close } from "@mui/icons-material";

const Chatbot = () => {
  const [chatHistory, setChatHistory] = useState([
    {
      hideInChat: true,
      role: "model",
      text: `Hello! I'm ${companyInfo.chatbot_name}. How can I assist you today?`,
    },
  ]);
  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef();

  const generateBotResponse = async (history) => {
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "model", text, isError },
      ]);
    };

    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));

    const requestOption = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history }),
    };

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, requestOption);
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error.message || "Something went wrong");

      const apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();
      updateHistory(apiResponseText);
    } catch (error) {
      updateHistory(error.message, true);
    }
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory]);

  // Function to handle user queries for company info
  const handleCompanyInfo = (query) => {
    // Check if the user is asking for the chatbot's name
    if (query.includes("what is your name") || query.includes("your name")) {
      return `My name is ${companyInfo.chatbot_name}. How can I assist you today?`;
    }
    else if (query.includes("Hello") || query.includes("hello") || query.includes("hii") || query.includes("Hii") || query.includes("Hi") || query.includes("hi")) {
      return `Hi ${companyInfo.chatbot_name} there! How can I help you today?`;
    }
    // Existing checks for company info
    else if (query.includes("name of the company")) {
      return `The company name is ${companyInfo.company.name}.`;
    } else if (query.includes("customer care")) {
      return `You can contact customer care at ${companyInfo.contact_details.customer_care.phone} or email at ${companyInfo.contact_details.customer_care.email}.`;
    } else if (query.includes("address of the company")) {
      return `The company is located at ${companyInfo.company.address}.`;
    } else {
      return null; // Return null if it's not related to company info
    }
  };

  // Function to handle the user query and choose the response mechanism
  const handleUserQuery = async (query) => {
    // Check if the query is related to company info
    const companyResponse = handleCompanyInfo(query);

    if (companyResponse) {
      // If it's company-related, directly respond with company details
      setChatHistory([
        ...chatHistory,
        { role: "user", text: query },
        { role: "model", text: companyResponse },
      ]);
    } else {
      // Otherwise, call Gemini API for general queries
      setChatHistory([
        ...chatHistory,
        { role: "user", text: query },
        { role: "model", text: "Thinking..." }, // Thinking message placeholder
      ]);

      // Call the Gemini API to get the response
      generateBotResponse([...chatHistory, { role: "user", text: query }]);
    }
  };

  return (
    <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
      {/* Button to toggle the chatbot */}
      <button
        onClick={() => setShowChatbot((prev) => !prev)}
        id="chatbot-toggler"
      >
        {showChatbot ? <Close /> : <ModeComment />}
      </button>

      <div className="chatbot-popup">
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">Chatbot</h2>
          </div>
          <button
            onClick={() => setShowChatbot((prev) => !prev)}
            className="material-symbols-rounded"
          >
            <KeyboardArrowDown />
          </button>
        </div>

        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
              <ChatbotIcon />
              <p className="message-text">
                Hey there, I’m {companyInfo.chatbot_name}. <br /> How can I
                assist you today?
              </p>
          </div>

          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        <div className="chat-footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            handleUserQuery={handleUserQuery} // Pass the function to handle user queries
          />
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
