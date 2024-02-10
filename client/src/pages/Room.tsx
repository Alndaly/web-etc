import { RoomContext } from '@/context/RoomContext';
import { ws } from '@/common/ws';
import { useContext, useEffect, useRef, useState } from 'react';
import NameInputMpdal from '@/components/NameInputModal';
import { useParams } from 'react-router-dom';
import { UserContext } from '@/context/UserContext';
import MessageInputBox from '@/components/MessageInputBox';
import { ChatContext } from '@/context/ChatContext';
import { IMessage } from '@/reducers/chatSlice';
import * as dayjs from 'dayjs';
import cls from 'classnames';

const RoomPage = () => {
	const { id } = useParams();
	const chatBox = useRef<HTMLDivElement>(null);
	const { userName, userId } = useContext(UserContext);
	const { messages } = useContext(ChatContext);
	const { participants, setRoomId } = useContext(RoomContext);
	const [showNameModal, setShowNameModal] = useState(false);

	useEffect(() => {
		setRoomId(id || '');
	}, [id, setRoomId]);

	useEffect(() => {
		if (chatBox.current) {
			chatBox.current.scrollTop = chatBox.current.scrollHeight;
		}
	}, [messages]);

	useEffect(() => {
		if (!userName) {
			setShowNameModal(true);
		}
	}, [userName]);

	useEffect(() => {
		userName && ws.emit('join-room', { roomId: id, peerId: userId, userName });
	}, [id, userId, userName]);

	return (
		<div
			className='w-full h-screen flex flex-col p-2 gap-2 bg-center bg-cover bg-no-repeat dark:saturate-50'
			style={{
				backgroundImage: `url('https://oss.kinda.info/image/202402082229353.jpg')`,
			}}>
			{showNameModal && <NameInputMpdal />}
			<div className='font-bold text-center p-5 border rounded backdrop-blur-lg bg-white/50 dark:bg-black/50 border-zinc-50 dark:border-zinc-500'>
				房间号 {id}
			</div>
			<div className='w-full flex flex-row flex-1 overflow-auto gap-2'>
				<div className='flex-1 overflow-auto p-5 grid grid-cols-4 gap-5 rounded border backdrop-blur-lg bg-white/50 dark:bg-black/50 border-zinc-50 dark:border-zinc-500'>
					{participants &&
						Object.keys(participants).map((participant: string) => {
							return (
								<div key={participant} className='p-2 border rounded-lg h-min bg-zinc-100'>
									{participants[participant].userName}
								</div>
							);
						})}
				</div>
				<div className='w-[30%] overflow-auto p-5 flex flex-col space-y-2 rounded border backdrop-blur-lg bg-white/50 dark:bg-black/50 border-zinc-50 dark:border-zinc-500'>
					<div
						className='flex-1 flex-col space-y-2 overflow-auto'
						ref={chatBox}>
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
											<div className='p-2 bg-zinc-100 rounded max-w-64'>
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
				</div>
			</div>
		</div>
	);
};

export default RoomPage;
