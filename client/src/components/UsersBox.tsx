import { RoomContext } from '@/context/RoomContext';
import { useContext } from 'react';
import { VideoPlayer } from './VideoPlayer';
const UsersBox = () => {
	const { participants } = useContext(RoomContext);

	return (
		<>
			{participants &&
				Object.keys(participants).map((participant: string) => {
					return (
						<div
							key={participant}
							className='p-2 border border-zinc-50 dark:border-zinc-500 rounded-lg h-min bg-zinc-100 dark:bg-zinc-700'>
							<div className='flex flex-row gap-1 items-center'>
								<img
									className='rounded-full w-8 h-8 object-cover'
									src='https://oss.kinda.info/image/202402082229353.jpg'
									alt='头像'
								/>
								<div>{participants[participant].userName}</div>
							</div>
							<VideoPlayer />
						</div>
					);
				})}
		</>
	);
};

export default UsersBox;
