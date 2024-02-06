import HomePage from '@/pages/Home';
import RoomPage from '@/pages/Room';
import { useRoutes } from 'react-router-dom';

export default function Router() {
	const element = useRoutes([
		{
			path: '/',
			element: <HomePage />,
		},
		{
			path: '/room/:id',
			element: <RoomPage />,
		},
	]);
	return element;
}
