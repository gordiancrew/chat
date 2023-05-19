import { useState } from "react";
import "../../App.css";
import "./chat.css";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
  Button,
} from "@chatscope/chat-ui-kit-react";

const API_KEY = "###";
// "Explain things like you would to a 10 year old learning how to code."
const systemMessage = {
  //  Explain things like you're talking to a software professional with 5 years of experience.
  role: "system",
  content:
    "Explain things like you're talking to a software professional with 2 years of experience.",
};

function Chat() {
  const [valueButton, setValueButton] = useState(0);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm ChatGPT! Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    // messages is an array of messages
    // Format messages for chatGPT API
    // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
    // So we need to reformat

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    // Get the request body set up with the model we plan to use
    // and the messages which we formatted above. We add a system message in the front to'
    // determine how we want chatGPT to act.
    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      button: valueButton,
      messages: [
        systemMessage, // The system message DEFINES the logic of our chatGPT
        ...apiMessages, // The messages from our chat with ChatGPT
      ],
    };
    alert(JSON.stringify(apiRequestBody));
    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
          },
        ]);
        setIsTyping(false);
      });
  }

  return (
    <div className="App">
      <div style={{ position: "relative", height: "80vh", width: "80vw" }}>
        <MainContainer>
          {/* <button style={{ backgroundColor: "grey" }}>www</button> */}
          <ChatContainer>
            <MessageList
              style={{ backgroundColor: "rgb(32,32,32)" }}
              scrollBehavior="auto"
              typingIndicator={
                isTyping ? <TypingIndicator content="eduBot is typing" /> : null
              }
            >
              {messages.map((message, i) => {
                console.log(message);
                return (
                  <Message key={i} model={message}>
                    <Message.CustomContent>
                      <div style={{ color: "white" }}>{message.message}</div>
                      <div
                        className="voice"
                        onClick={() => alert(message.message)}
                      >
                        &#128266;
                      </div>
                    </Message.CustomContent>
                  </Message>
                );
              })}
            </MessageList>

            <MessageInput
              className="messageInput"
              attachButton="false"
              style={{
                backgroundColor: "rgb(32,32,32)",
                paddingTop: 30,
                paddingBottom: 15,
                borderTop: "1px solid rgb(254, 155, 98)",
                display: "flex",
                flexDirection: "start",
              }}
              placeholder="Type message here"
              onSend={handleSend}
            />
          </ChatContainer>
        </MainContainer>
        <form
          style={{
            position: "absolute",
            bottom: 60,
            left: 10,
            color: "white",
            zIndex: "20",
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            type="checkbox"
            onChange={() => setValueButton(valueButton === 0 ? 1 : 0)}
          />
          <label>aaa</label>
        </form>
      </div>
    </div>
  );
}

export default Chat;
