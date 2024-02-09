import { createContext, useEffect } from 'react';
import { addHistory, addMessage } from '@/reducers/chatSlice';
import { IMessage } from '@/reducers/chatSlice';
import { useSelector, useDispatch } from 'react-redux';
import { ws } from '@/common/ws';

interface Props {
	children: React.ReactNode;
}

interface ChatValue {
	messages: IMessage[];
	sendMessage: (message: string, roomId: string, userId: string) => void;
}

export const ChatContext = createContext<ChatValue>({
	messages: [],
	sendMessage: (message: string, roomId: string, userId: string) => {},
});

export const ChatProvider: React.FC<Props> = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const dispatch = useDispatch();
	const messages = useSelector((state: any) => state.chat.value);
	const sendMessage = (message: string, roomId: string, userId: string) => {
		const messageData: IMessage = {
			content: message,
			timestamp: new Date().getTime(),
			userId,
		};
		ws.emit('send-message', { roomId, message: messageData });
	};

	useEffect(() => {
		ws.on('add-message', (message: IMessage) => {
			console.log('接收到新消息', message);
			dispatch(addMessage(message));
		});
		ws.on('get-messages', (messages: IMessage[]) => {
			console.log('存在历史消息，接收', messages);
			dispatch(addHistory(messages));
		});
	}, []);

	return (
		<ChatContext.Provider
			value={{
				messages,
				sendMessage,
			}}>
			{children}
		</ChatContext.Provider>
	);
};
