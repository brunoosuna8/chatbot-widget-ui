import React from 'react';

interface ButtonProps {
    label: string;
}
declare const Button: ({ label }: ButtonProps) => React.JSX.Element;

interface ChatWidgetIOProps {
    apiKey: string;
    chatbotName?: string;
    isTypingMessage?: string;
    IncommingErrMsg?: string;
    primaryColor?: string;
    inputMsgPlaceholder?: string;
    chatIcon?: any;
}
declare const ChatBotWidget: ({ apiKey, chatbotName, isTypingMessage, IncommingErrMsg, primaryColor, inputMsgPlaceholder, chatIcon, }: ChatWidgetIOProps) => React.JSX.Element;

export { Button, ChatBotWidget };
