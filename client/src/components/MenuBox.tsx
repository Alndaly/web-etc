import { ws } from '@/common/ws';
import { UserContext } from '@/context/UserContext';
import { useContext } from 'react';
import { RoomContext } from '@/context/RoomContext';

const MenuBox = () => {
	const { me, setStream } = useContext(UserContext);

	const onTurnOnVideo = () => {
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then((stream) => {
				setStream(stream);
			});
	};
	const onTurnOnAudio = () => {
		navigator.mediaDevices
			.getUserMedia({ video: false, audio: true })
			.then((stream) => {
				setStream(stream);
			});
	};
	const onShareScreen = () => {
		navigator.mediaDevices
			.getDisplayMedia({ video: true, audio: true })
			.then((stream) => {
				setStream(stream);
			});
	};
	return (
		<>
			<div
				className='bg-rose-400 hover:bg-rose-600 text-white py-2 px-8 rounded-lg cursor-pointer'
				onClick={onTurnOnVideo}>
				视频
			</div>
			<div
				className='bg-rose-400 hover:bg-rose-600 text-white py-2 px-8 rounded-lg cursor-pointer'
				onClick={onTurnOnAudio}>
				音频
			</div>
			<div
				className='bg-rose-400 hover:bg-rose-600 text-white py-2 px-8 rounded-lg cursor-pointer'
				onClick={onShareScreen}>
				屏幕共享
			</div>
		</>
	);
};

export default MenuBox;
