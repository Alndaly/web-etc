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
			console.log('开始获取视频流权限');
			const [stream, err] = await to(
				navigator.mediaDevices.getUserMedia({ video: true, audio: true })
			);
			if (stream) {
				console.log('获取视频流成功');
				setStream(stream);
			} else {
				console.log('获取视频流失败', err);
			}
			return [stream, err];
		} catch (error) {
			console.log('获取视频流失败', error);
			return [null, error];
		}
	};

	useEffect(() => {
		const meId = v4();
		const peer = new Peer(meId, { debug: 2 });
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
		ws.on('get-users', ({ participants }: { participants: string[] }) => {
			console.log('当前房间用户', participants);
		});
		ws.on('user-disconnected', ({ peerId }) => {
			console.log('用户断开连接/离开房间', peerId);
			// dispatch(removePeer(peerId));
		});
	}, []);

	useEffect(() => {
		if (!me) return;
		if (!stream) return;
		ws.on('user-joined', ({ peerId }) => {
			// 不是自己才请求对方视频流
			if (me.id !== peerId) {
				console.log('用户不是自己，请求对方视频流');
				// 请求对方视频流
				const call1 = me.call(peerId, stream);
				call1.on('stream', function () {
					console.log(111);
				});
				return;
			}
			console.log('自己进入房间', peerId);
		});
	}, [me, stream]);

	useEffect(() => {
		if (!me) return;
		if (!stream) return;
		// 接收
		me.on('call', function (call2) {
			console.log('收到视频流邀请');
			// 回复对方视频流
			call2.answer(stream);
			call2.on('stream', function (peerStream) {
				console.log(222);
				// 	console.log('接收到发起邀请方的视频流');
				// dispatch(addPeer({ peerId: call.peer, stream: peerStream }));
			});
		});
	}, [me, stream]);

	return (
		<RoomContext.Provider value={{ ws, me, stream, peers, initStream }}>
			{children}
		</RoomContext.Provider>
	);
};
