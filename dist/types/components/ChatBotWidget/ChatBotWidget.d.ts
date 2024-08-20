import React from "react";
import "./style.css";
interface ChatWidgetIOProps {
    assistantId: string;
    chatbotName?: string;
    isTypingMessage?: string;
    IncommingErrMsg?: string;
    primaryColor?: string;
    inputMsgPlaceholder?: string;
    chatIcon?: any;
    conversation?: any;
    handleNewMessage?: any;
}
declare const ChatBotWidget: ({assistantId, chatbotName, isTypingMessage, IncommingErrMsg, primaryColor, inputMsgPlaceholder, chatIcon, conversation, handleNewMessage, }: ChatWidgetIOProps) => React.JSX.Element;
export default ChatBotWidget;
