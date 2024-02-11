import * as dayjs from 'dayjs';
import MessageInputBox from './MessageInputBox';
import { useEffect, useRef, useContext } from 'react';
import { IMessage } from '@/reducers/chatSlice';
import { ChatContext } from '@/context/ChatContext';
import { UserContext } from '@/context/UserContext';
import cls from 'classnames';

const ChatBox = () => {
	const { messages } = useContext(ChatContext);
	const { userId } = useContext(UserContext);
	const chatBox = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (chatBox.current) {
			chatBox.current.scrollTop = chatBox.current.scrollHeight;
		}
	}, [messages]);
	return (
		<>
			<div className='flex-1 flex-col space-y-2 overflow-auto' ref={chatBox}>
				{messages &&
					messages.map((message: IMessage, index: number) => {
						return (
							<div
								className={cls('flex', 'flex-row', 'gap-1', {
									'flex-row-reverse': message.userId === userId,
								})}
								key={index}>
								<div className='flex flex-col'>
									<div>
										<img
											className='rounded-full w-8 h-8 object-cover'
											src='https://oss.kinda.info/image/202402082229353.jpg'
											alt='头像'
										/>
									</div>
									<div className='text-xs text-slate-800 max-w-8 whitespace-nowrap text-ellipsis overflow-hidden'>
										{message.userId}
									</div>
								</div>
								<div>
									<div className='p-2 bg-zinc-100 dark:bg-zinc-700 rounded max-w-64'>
										{message.content}
									</div>
									<div
										className={cls('text-xs', 'text-slate-400', {
											'text-right': message.userId === userId,
										})}>
										{dayjs(message.timestamp).format('HH:mm')}
									</div>
								</div>
							</div>
						);
					})}
			</div>
			<hr />
			<MessageInputBox />
		</>
	);
};

export default ChatBox;
