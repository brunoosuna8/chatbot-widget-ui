import React from "react";
import "./style.css";
interface ChatWidgetIOProps {
    chatbotName?: string;
    isTypingMessage?: string;
    IncommingErrMsg?: string;
    primaryColor?: string;
    inputMsgPlaceholder?: string;
    chatIcon?: any;
}
declare const ChatBotWidget: ({chatbotName, isTypingMessage, IncommingErrMsg, primaryColor, inputMsgPlaceholder, chatIcon, }: ChatWidgetIOProps) => React.JSX.Element;
export default ChatBotWidget;
