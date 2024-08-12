import React, { useState, useRef, useEffect } from "react";
import "./style.css";
import {Messages} from "openai/resources/beta/threads";
import Message = Messages.Message;
import {isTextContentBlock} from "../../../utils/isTextContentBlock";
import {extractImageUrls} from "../../../utils/extract-images-url";
import {createTuples} from "../../../utils/createTuples";



interface ChatWidgetIOProps {

  chatbotName?: string;
  isTypingMessage?: string;
  IncommingErrMsg?: string;
  primaryColor?: string;
  inputMsgPlaceholder?: string;
  chatIcon?: any;
  conversation?: any;
  handleNewMessage?: any;
}

const ChatBotWidget = ({
  chatbotName = "Chatbot",
  isTypingMessage = "Typing...",
  IncommingErrMsg = "Oops! Something went wrong. Please try again.",
  primaryColor = "#eb4034",
  inputMsgPlaceholder = "Send a Message",
  chatIcon = ChatIcon(),
  conversation,
  handleNewMessage,
}: ChatWidgetIOProps) => {
  const [userMessage, setUserMessage] = useState<any>("");
  const [messages, setMessages] = useState<any>([]);
  const [typing, setTyping] = useState<any>(false);
  const chatInputRef = useRef<any>(null);
  const chatboxRef = useRef<any>(null);

  const handleChat = async () => {
    const trimmedMessage = userMessage.trim();
    if (!trimmedMessage) return;

    setUserMessage("");

    // Display outgoing message
    const outgoingChat = (
      <li key={Date.now()} className="chat outgoing">
        <p style={{ background: primaryColor }}>{trimmedMessage}</p>
      </li>
    );
    setMessages((prevMessages: any) => [...prevMessages, outgoingChat]);
    handleNewMessage((prevMessages: any) => [
      ...prevMessages,
      { type: "user", text: trimmedMessage },
    ]);

    try {
      setTyping(true);

      // Request to API for bot response
      const API_URL = "http://localhost:3000/chat";
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmedMessage,
          threadId:"thread_FHdudAstTaejSk7p6LjipKrR"
        }),
      };

      const response = await fetch(API_URL, requestOptions);
      const data: Message  = await response.json();
      console.log(data);
      let text;
      let imagesUrl: string[] = [];
      let incomingChat: React.JSX.Element;
      if(isTextContentBlock(data.content[0])) {
        text = data.content[0].text.value;
        imagesUrl = extractImageUrls(text);
        if(imagesUrl.length > 0) {
          // 1. Eliminar el patrón `![...]` del texto
          let cleanedText = text.replace(/!\[.*?\]\((.*?)\)/g, '$1');
          // 2. Eliminar los paréntesis de las URLs
          cleanedText = cleanedText.replace(/[()]/g, '');
          // 3. Eliminar el patrón `【...】` del texto
          cleanedText = cleanedText.replace(/【.*?】/g, '');
          const tuples = createTuples(cleanedText, imagesUrl);
          console.log(tuples);
          incomingChat = (
              <li key={Date.now()} className="chat incoming"
                  style={{flexDirection:"column"}}
              >
                <span className="material-symbols-outlined">smart_toy</span>
                {tuples.map((tuple: [string, string], index: number) => {
                  return (
                      <div
                          key={index}
                          className="chatbot-container"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                      >
                        <p style={{marginBottom:"20px"}}>{tuple[0]}</p>
                        <img style={{marginBottom:"20px"}} width={300} alt={tuple[0]} src={tuple[1]} />
                      </div>
                  );
                })}
              </li>
          )

        }else{
          incomingChat = (
              <li key={Date.now()} className="chat incoming">
                <span className="material-symbols-outlined">smart_toy</span>
                <p>{text}</p>
              </li>
          );
        }
      } else {
        incomingChat = (
            <li key={Date.now()} className="chat incoming">
            <span className="material-symbols-outlined">smart_toy</span>
              <p>{text}</p>
            </li>
        );
      }

      // Display incoming bot message

      // [
      //   <li key={Date.now()} className="chat incoming">
      //     <span className="material-symbols-outlined">smart_toy</span>
      //     <p>tenemos un cafe helado</p>
      //     <img src={"https://tb-static.uber.com/prod/image-proc/coffe.jpeg"}/>
      //   </li>,
      //   <li key={Date.now()} className="chat incoming">
      //     <span className="material-symbols-outlined">smart_toy</span>
      //     <p>Un capuccino</p>
      //     <img src={"https://tb-static.uber.com/prod/image-proc/capuccino.jpeg"}/>
      //
      //   </li>,
      //   <li key={Date.now()} className="chat incoming">
      //     <span className="material-symbols-outlined">smart_toy</span>
      //     <p>y un sandwich </p>
      //     <img src={"https://tb-static.uber.com/prod/image-proc/sandiwch.jpeg"}/>
      //
      //   </li>
      // ]
      setMessages((prevMessages: any) => [...prevMessages, incomingChat]);
      handleNewMessage((prevMessages: any) => [
        ...prevMessages,
        { type: "bot", text: data },
      ]);
    } catch (error) {
      // Display error message if API request fails
      const errorChat = (
        <li key={Date.now()} className="chat incoming error">
          <p>{IncommingErrMsg}</p>
        </li>
      );
      setMessages((prevMessages: any) => [...prevMessages, errorChat]);
    } finally {
      setTyping(false);
    }
  };

  const handleInputChange = (event: any) => {
    setUserMessage(event.target.value);
    const btn = document.getElementById("send-btn");
    if(btn) {
      if(event.target.value.length > 0) {
        btn.style.color = "black";

      } else {
        btn.style.color = "grey";

      }
    }

    // chatInputRef.current.style.height = "auto"; // Reset height
    // chatInputRef.current.style.height = `${Math.min(chatInputRef.current.scrollHeight, 2 * 24)}px`; // Limit to 3 lines
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter" && !event.shiftKey && window.innerWidth > 800) {
      event.preventDefault();
      handleChat();
    }
  };

  const toggleChatbot = () => {
    document.body.classList.toggle("show-chatbot");
  };

  useEffect(() => {
    const closeBtn: any = document.querySelector(".close-btn");
    closeBtn.addEventListener("click", toggleChatbot);

    return () => {
      closeBtn.removeEventListener("click", toggleChatbot);
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom of chatbox when messages change
    chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
  }, [messages]);
  const handleFocus = () => {
    chatInputRef.current.parentElement.style.border = "2px solid black";

  };

  const handleBlur = () => {
    chatInputRef.current.parentElement.style.border = "none";
  };
  return (
    <div
      className="chatbot-container"
      style={{
        background: primaryColor,
        backgroundColor: primaryColor,
      }}
    >
      <button
        className="chatbot-toggler"
        onClick={toggleChatbot}
        style={{ background: primaryColor }}
      >
        <span className="material-symbols-rounded">{chatIcon}</span>
        <span className="material-symbols-outlined">Close</span>
      </button>
      <div className="chatbot">
        <header style={{ background: primaryColor }}>
          <h2>{chatbotName}</h2>
          <span
            className="close-btn material-symbols-outlined"
            // onClick={toggleChatbot}
          >
            close
          </span>
        </header>
        <ul className="chatbox" ref={chatboxRef}>
          {messages}
          {typing && (
            <li key={Date.now()} className="chat incoming">
              <p>{isTypingMessage}</p>
            </li>
          )}
        </ul>
        <div className="chat-input">
          <textarea
            ref={chatInputRef}
            placeholder={inputMsgPlaceholder}
            spellCheck="false"
            required
            value={userMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            maxLength={500}
            rows={3}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <span
            id="send-btn"
            className="material-symbols-outlined"
            onClick={handleChat}
            style={{
              color: "grey",
            }}

          >
            send
          </span>
        </div>
      </div>
    </div>
  );
};

const ChatIcon = () => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        width={18}
        height={18}
        fill="#fff"
        stroke="#fff"
        viewBox="0 0 58 58"
      >
        <path
          d="M53 3.293H5c-2.722 0-5 2.278-5 5v33c0 2.722 2.278 5 5 5h27.681l-4.439-5.161a1 1 0 1 1 1.517-1.304l4.998 5.811L43 54.707v-8.414h10c2.722 0 5-2.278 5-5v-33c0-2.722-2.278-5-5-5z"
          style={{
            fill: "#fff",
          }}
        />
        <circle
          cx={15}
          cy={24.799}
          r={3}
          style={{
            fill: "#fff",
          }}
        />
        <circle
          cx={29}
          cy={24.799}
          r={3}
          style={{
            fill: "#fff",
          }}
        />
        <circle
          cx={43}
          cy={24.799}
          r={3}
          style={{
            fill: "#fff",
          }}
        />
      </svg>
    </>
  );
};

export default ChatBotWidget;
