import { RoomContext } from '@/context/RoomContext';
import { UserContext } from '@/context/UserContext';
import { useContext } from 'react';

const CreateButton = () => {
	const { ws } = useContext(RoomContext);
	const { userName, setUserName } = useContext(UserContext);

	const createRoom = () => {
		console.log('申请创建房间');
		ws.emit('create-room');
	};

	return (
		<div className='flex flex-col'>
			<input
				className='border rounded-md p-2 h-10 my-2 w-full'
				placeholder='输入你的昵称'
				onChange={(e) => setUserName(e.target.value)}
				value={userName}
			/>
			<button
				className='bg-rose-400 hover:bg-rose-600 py-2 px-8 rounded-lg text-white text-lg'
				onClick={createRoom}>
				Start new meeting
			</button>
		</div>
	);
};

export default CreateButton;
