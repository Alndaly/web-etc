import { useRef, useState } from 'react';
import { uploadFile } from '@/service/file';

const ImageUpload = () => {
	const uploadButton = useRef<HTMLInputElement>(null);
	const [fileList, setFileList] = useState<FileList>();
	const onUpload = () => {
		if (uploadButton.current) {
			uploadButton.current.click();
		}
	};
	return (
		<div className='flex justify-center items-center'>
			<div
				className='rounded-full w-32 h-32 bg-zinc-100/30 hover:bg-zinc-200/30 transition-all flex items-center justify-center text-xs cursor-pointer'
				onClick={onUpload}>
				上传头像
			</div>
			<input
				className='hidden'
				type='file'
				accept='image/gif,image/jpeg,image/jpg,image/png'
				multiple
				ref={uploadButton}
				onChange={(e) => {
					if (e.target.files) {
						setFileList(e.target.files);
						uploadFile(e.target.files[0]);
					}
				}}
			/>
		</div>
	);
};

export default ImageUpload;
