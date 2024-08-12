import { Threads } from 'openai/resources/beta';
import MessageContent = Threads.MessageContent;
import TextContentBlock = Threads.TextContentBlock;

export function isTextContentBlock(
    content: MessageContent,
): content is TextContentBlock {
    return (content as TextContentBlock).text !== undefined;
}
