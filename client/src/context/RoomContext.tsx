import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Peer from 'peerjs';
import { v4 } from 'uuid';
import { useSelector, useDispatch } from 'react-redux';
import { addPeer, removePeer } from '@/reducers/peerSlice';
import { to } from '@/common/util';
import socketIoClient from 'socket.io-client';

interface Props {
	children: React.ReactNode;
}

const ws = socketIoClient('http://localhost:3000');

export const RoomContext = createContext<any>(null);

export const RoomProvider: React.FunctionComponent<Props> = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const peers = useSelector((state: any) => state.peer.value);

	const [me, setMe] = useState<Peer>();
	const [stream, setStream] = useState<MediaStream>();

	const initStream = async () => {
		try {
			const [stream, err] = await to(
				navigator.mediaDevices.getUserMedia({ video: true, audio: true })
			);
			if (stream) {
				setStream(stream);
			}
			return [stream, err];
		} catch (error) {
			return [null, error];
		}
	};

	useEffect(() => {
		const meId = v4();
		const peer = new Peer(meId);
		setMe(peer);
	}, []);

	useEffect(() => {
		ws.on('room-created', ({ roomId }: { roomId: string }) => {
			navigate(`/room/${roomId}`);
		});
		ws.on('get-users', ({ participants }: { participants: string[] }) => {
			console.log('当前房间用户', participants);
		});
		ws.on('user-disconnected', ({ peerId }) => {
			console.log('用户断开连接/离开房间', peerId);
			dispatch(removePeer(peerId));
		});
	}, []);

	useEffect(() => {
		if (!me) return;
		if (!stream) return;
		ws.on('user-joined', ({ peerId }) => {
			console.log('用户进入房间', peerId);
			// 不是自己才请求对方视频流
			if (peerId !== me.id) {
				console.log('非自己进入，请求对方视频流');
				const call = me.call(peerId, stream);
				call.on('stream', (peerStream) => {
					console.log('接收到对方视频流', peerStream);
					dispatch(addPeer({ peerId, stream: peerStream }));
					return;
				});
			}
			return;
		});
		// 接收
		me.on('call', (call) => {
			console.log('收到视频流邀请', call);
			call.answer(stream);
			call.on('stream', (peerStream) => {
				dispatch(addPeer({ peerId: call.peer, stream: peerStream }));
			});
			return;
		});
	}, [me, stream]);

	return (
		<RoomContext.Provider value={{ ws, me, stream, peers, initStream }}>
			{children}
		</RoomContext.Provider>
	);
};
