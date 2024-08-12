import { Threads } from 'openai/resources/beta';
import MessageContent = Threads.MessageContent;
import TextContentBlock = Threads.TextContentBlock;
export declare function isTextContentBlock(content: MessageContent): content is TextContentBlock;
