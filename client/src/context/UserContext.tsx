import { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import Peer from 'peerjs';
import { RoomContext } from './RoomContext';

interface UserValue {
	userId: string;
	userName: string;
	me?: Peer;
	stream?: MediaStream;
	setStream: (stream: MediaStream) => void;
	setUserName: (userName: string) => void;
}

interface Props {
	children: React.ReactNode;
}

export const UserContext = createContext<UserValue>({
	userName: '',
	userId: '',
	setStream: (stream) => {},
	setUserName: (userName) => {},
});

export const UserProvider: React.FC<Props> = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [me, setMe] = useState<Peer>();
	const [stream, setStream] = useState<MediaStream>();
	const [userId] = useState(localStorage.getItem('userId') || uuidV4());
	const [userName, setUserName] = useState(
		localStorage.getItem('userName') || ''
	);
	const { participants } = useContext(RoomContext);

	useEffect(() => {
		const peer = new Peer(userId, { debug: 2 });
		setMe(peer);
	}, [userId]);

	useEffect(() => {
		if (me && stream && participants) {
			Object.keys(participants).forEach((participant) => {
				const call = me.call(participant, stream);
				call.on('stream', (remoteStream) => {
					console.log('接收到被邀请方的流');
				});
			});
		}
	}, [participants, me, stream]);

	useEffect(() => {
		if (me && stream) {
			me.on('call', (call) => {
				console.log('接收到流申请');
				call.answer(stream);
			});
		}
	}, [me, stream]);

	useEffect(() => {
		localStorage.setItem('userName', userName);
	}, [userName]);

	useEffect(() => {
		localStorage.setItem('userId', userId);
	}, [userId]);

	return (
		<UserContext.Provider
			value={{ userId, userName, setUserName, me, stream, setStream }}>
			{children}
		</UserContext.Provider>
	);
};
