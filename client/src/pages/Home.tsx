import { RoomContext } from '@/context/RoomContext';
import { UserContext } from '@/context/UserContext';
import { useContext, useState, useRef } from 'react';

const HomePage = () => {
	const chineseInputting = useRef(false);
	const { ws } = useContext(RoomContext);
	const { userName, setUserName } = useContext(UserContext);
	const onCreateRoom = () => {
		console.log('申请创建房间');
		ws.emit('create-room');
	};
	return (
		<div
			className='w-full h-screen flex justify-center items-center bg-center bg-cover bg-no-repeat dark:saturate-50'
			style={{
				backgroundImage: `url('https://oss.kinda.info/image/202402082229353.jpg')`,
			}}>
			<div className='felx flex-col space-y-5 p-10 rounded-md bg-white/50 dark:bg-black/50 backdrop-blur border border-zinc-50 dark:border-zinc-500 drop-shadow-lg'>
				<div className='text-center text-5xl font-GongFanNuFangTi'>聊天室</div>
				<hr className='border-none bg-white/20 dark:bg-black/20 h-px' />
				<input
					className='border rounded-md p-2 h-10 w-full border-zinc-50 dark:border-zinc-500'
					placeholder='输入你的昵称'
					onChange={(e) => setUserName(e.target.value)}
					value={userName}
					onCompositionStart={(e) => {
						chineseInputting.current = true;
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
							onCreateRoom();
						}
					}}
				/>
				<button
					className='w-full bg-rose-400 hover:bg-rose-600 py-2 px-8 rounded-lg text-white'
					onClick={onCreateRoom}>
					申请创建房间
				</button>
			</div>
		</div>
	);
};

export default HomePage;
