import { RoomContext } from '@/context/RoomContext';
import { useContext } from 'react';

const CreateButton = () => {
	const { ws } = useContext(RoomContext);

	const createRoom = () => {
		ws.emit('create-room');
	};

	return (
		<button
			className='bg-rose-400 hover:bg-rose-600 py-2 px-8 rounded-lg text-white text-lg'
			onClick={createRoom}>
			Start new meeting
		</button>
	);
};

export default CreateButton;
