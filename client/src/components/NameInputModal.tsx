import { Transition, Dialog } from '@headlessui/react';
import { Fragment, useState, useRef, useContext } from 'react';
import { UserContext } from '@/context/UserContext';

const NameInputMpdal = () => {
	const [isOpen, setIsOpen] = useState(true);
	const chineseInputting = useRef(false);
	const { userName, setUserName } = useContext(UserContext);
	const [tempName, setTempName] = useState('');

	return (
		<Transition as={Fragment} show={isOpen}>
			<Dialog
				as='div'
				className='relative z-10'
				onClose={() => {
					setIsOpen(false);
				}}>
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'>
					<div className='fixed inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm' />
				</Transition.Child>

				<div className='fixed inset-0 overflow-y-auto'>
					<div className='flex h-full items-center justify-center relative'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 scale-95'
							enterTo='opacity-100 scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 scale-100'
							leaveTo='opacity-0 scale-95'>
							<Dialog.Panel className='border border-zinc-50 dark:border-zinc-800 drop-shadow-lg w-full max-w-xl sm:rounded-xl bg-white dark:bg-[#1E1E1E] p-6 text-left flex flex-col sm:max-h-[50%]'>
								<input
									className='border rounded-md p-2 h-10 w-full border-zinc-50 dark:border-zinc-500 text-center'
									placeholder='输入你的昵称'
									onChange={(e) => setTempName(e.target.value)}
									value={userName || tempName}
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
											if (tempName.trim()) {
												setUserName(tempName);
												setIsOpen(false);
											}
										}
									}}
								/>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};

export default NameInputMpdal;
