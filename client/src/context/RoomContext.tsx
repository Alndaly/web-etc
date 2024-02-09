import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import Peer from 'peerjs';
import { ws } from '@/common/ws';

interface Props {
	children: React.ReactNode;
}

interface RoomValue {
	roomId: string;
	participants: any[];
	setRoomId: (id: string) => void;
}

interface Participant {
	peerId: string;
	userName: string;
}

export const RoomContext = createContext<RoomValue>({
	roomId: '',
	participants: [],
	setRoomId: (id) => {},
});

export const RoomProvider: React.FunctionComponent<Props> = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const navigate = useNavigate();

	const { userId } = useContext(UserContext);

	const [me, setMe] = useState<Peer>();
	const [participants, setParticipants] = useState<Participant[]>([]);
	const [roomId, setRoomId] = useState<string>('');

	useEffect(() => {
		const peer = new Peer(userId, { debug: 2 });
		setMe(peer);
	}, []);

	// 心跳
	useEffect(() => {
		ws.emit('ping');
	}, []);

	useEffect(() => {
		ws.on('room-created', ({ roomId }: { roomId: string }) => {
			console.log(`房间创建成功，ID ${roomId}，跳转房间页面`);
			navigate(`/room/${roomId}`);
		});
		ws.on('room-not-exist', ({ roomId }: { roomId: string }) => {
			console.log(`房间 ${roomId} 不存在，通信已断开`);
		});
		ws.on('get-users', ({ participants }: { participants: Participant[] }) => {
			console.log('当前房间用户', participants);
			setParticipants(participants);
		});
		ws.on('user-disconnected', ({ peerId }) => {
			console.log('用户断开连接/离开房间', peerId);
		});
	}, []);

	useEffect(() => {
		if (!me) return;
		ws.on('user-joined', ({ peerId }) => {
			console.log('用户进入房间', peerId);
		});
	}, [me]);

	return (
		<RoomContext.Provider value={{ roomId, setRoomId, participants }}>
			{children}
		</RoomContext.Provider>
	);
};
