import { RoomContext } from '@/context/RoomContext';
import { ws } from '@/common/ws';
import { useContext, useEffect, useState } from 'react';
import NameInputMpdal from '@/components/NameInputModal';
import { useParams } from 'react-router-dom';
import { UserContext } from '@/context/UserContext';
import ChatBox from '@/components/ChatBox';
import MenuBox from '@/components/MenuBox';
import UsersBox from '@/components/UsersBox';

const RoomPage = () => {
	const { id } = useParams();
	const { userName, userId } = useContext(UserContext);
	const { setRoomId } = useContext(RoomContext);
	const [showNameModal, setShowNameModal] = useState(false);

	useEffect(() => {
		setRoomId(id || '');
	}, [id, setRoomId]);

	useEffect(() => {
		if (!userName) {
			setShowNameModal(true);
		}
	}, [userName]);

	useEffect(() => {
		userName && ws.emit('join-room', { roomId: id, userId, userName });
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
					<UsersBox />
				</div>
				<div className='w-[30%] overflow-auto p-5 flex flex-col space-y-2 rounded border backdrop-blur-lg bg-white/50 dark:bg-black/50 border-zinc-50 dark:border-zinc-500'>
					<ChatBox />
				</div>
			</div>
			<div className='flex flex-row justify-center gap-5 p-5 border rounded backdrop-blur-lg bg-white/50 dark:bg-black/50 border-zinc-50 dark:border-zinc-500'>
				<MenuBox />
			</div>
		</div>
	);
};

export default RoomPage;
