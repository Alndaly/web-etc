import { RoomContext } from '@/context/RoomContext';
import { VideoPlayer } from '@/components/VideoPlayer';
import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '@/context/UserContext';

const RoomPage = () => {
	const { id } = useParams();
	const { userName } = useContext(UserContext);
	const { ws, me, stream, initStream, peers } = useContext(RoomContext);

	useEffect(() => {
		me &&
			initStream().then((res, err) => {
				ws.emit('join-room', { roomId: id, peerId: me._id, userName });
			});
	}, [me]);

	return (
		<>
			<div className='font-bold text-center p-5'>room id {id}</div>
			<div className='grid grid-cols-4 gap-4'>
				<VideoPlayer stream={stream} />
				{/* {peers.map((peer, index) => (
					<div key={index}>
						<div>{index}</div>
						<VideoPlayer stream={peer.stream} />
					</div>
				))} */}
			</div>
		</>
	);
};

export default RoomPage;
