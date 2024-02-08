import Router from './router/index.tsx';
import store from './store/index.ts';
import { BrowserRouter } from 'react-router-dom';
import { RoomProvider } from '@/context/RoomContext';
import { UserProvider } from './context/UserContext';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<Provider store={store}>
		<BrowserRouter>
			<UserProvider>
				<RoomProvider>
					<Router />
				</RoomProvider>
			</UserProvider>
		</BrowserRouter>
	</Provider>
);
