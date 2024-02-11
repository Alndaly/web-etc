import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ws } from '@/common/ws';

interface Props {
	children: React.ReactNode;
}

interface RoomValue {
	roomId: string;
	participants: Participant[];
	setRoomId: (id: string) => void;
}

interface Participant {
	userId: string;
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
	const [participants, setParticipants] = useState<Participant[]>([]);
	const [roomId, setRoomId] = useState<string>('');

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
		ws.on('user-disconnected', ({ userId }) => {
			console.log('用户断开连接/离开房间', userId);
		});
	}, []);

	useEffect(() => {
		ws.on('user-joined', ({ userId }) => {
			console.log('用户进入房间', userId);
		});
	}, []);

	return (
		<RoomContext.Provider value={{ roomId, setRoomId, participants }}>
			{children}
		</RoomContext.Provider>
	);
};
