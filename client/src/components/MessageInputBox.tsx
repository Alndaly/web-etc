import { useRef, useState, useContext } from 'react';
import { ChatContext } from '@/context/ChatContext';
import { RoomContext } from '@/context/RoomContext';
import { UserContext } from '@/context/UserContext';

const MessageInputBox = () => {
	const { sendMessage } = useContext(ChatContext);
	const { roomId } = useContext(RoomContext);
	const { userId } = useContext(UserContext);
	const chineseInputting = useRef(false);
	const [message, setMessage] = useState('');
	return (
		<input
			className='border rounded-md p-2 h-10 w-full border-zinc-100 dark:border-zinc-500'
			placeholder='输入消息'
			value={message}
			onCompositionStart={(e) => {
				chineseInputting.current = true;
			}}
			onChange={(e) => {
				setMessage(e.target.value);
			}}
			onKeyUp={(e) => {
				// 如果是空格，那么就将输入状态改为结束
				if (e.key === ' ') {
					chineseInputting.current = false;
				}
				if (e.key === 'Enter') {
					// 避免中文输入法下的问题
					if (chineseInputting.current) {
						chineseInputting.current = false;
						return;
					}
					if (message.trim()) {
						sendMessage(message, roomId, userId);
						setMessage('');
					}
				}
			}}
		/>
	);
};

export default MessageInputBox;
