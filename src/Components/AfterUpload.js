/* eslint-disable no-unused-vars */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react/prop-types */
import React, { useContext, useState, useRef } from 'react';
import Alert from '@mui/material/Alert';
import '../assets/css/afterUpload.css';
import { ImageContext } from '../context/ImageContext';
import { saveAs } from 'file-saver';
import { v4 as uuid } from 'uuid';
import imageCompression from 'browser-image-compression';
import JSZip from 'jszip';
import prettyBytes from 'pretty-bytes';

const ProcessFile = ({ file }) => {
	const [src, setSrc] = React.useState(null);

	React.useEffect(() => {
		const reader = new FileReader();
		reader.onload = () => {
			setSrc(reader.result);
		};
		reader.readAsDataURL(file);
	}, [setSrc, file]);

	if (!src) return null;

	return <img className='previewImage' src={src} alt='' />;
};

export const AfterUpload = () => {
	const { data, dispatch } = useContext(ImageContext);
	const folderRef = useRef();
	const sizeRef = useRef();
	const [response, setResponse] = useState({
		isPresent: false,
		loading: false,
		isError: false,
		errorCode: false,
	});

	const compressHandler = async () => {
		console.log('compressHandler');
		setResponse((prev) => ({ ...prev, loading: true }));

		const sizeAfter = [];
		const zip = new JSZip();
		folderRef.current = zip.folder('collection');
		try {
			const options = {
				maxSizeMB: 1,
				maxWidthOrHeight: 1920,
				useWebWorker: true,
			};
			const images = data.files.map((file) => imageCompression(file, options));
			const compressedFiles = await Promise.all(images);

			compressedFiles.forEach((compressedFile, idx) => {
				sizeAfter.push(compressedFile.size);
				console.log('none : ' + prettyBytes(data.files[idx].size) + ' / after : ' + prettyBytes(compressedFile.size));
				folderRef.current.file(`${data.files[idx].name}`, compressedFile, { binary: true });
			});

			sizeRef.current = sizeAfter; // Update the sizeRef after all files are processed
			setResponse((prev) => ({ ...prev, loading: false, isPresent: true })); // Update the response state
		} catch (error) {
			console.error(error);
			setResponse({
				isPresent: false,
				loading: false,
				isError: true,
				errorCode: error.code || 'UNKNOWN_ERROR', // Use a more specific error property if available
			});
		}
	};

	const downloadImages = async () => {
		if (response.isPresent) {
			await folderRef.current.generateAsync({ type: 'blob' }).then((content) => saveAs(content, 'compressio-' + uuid()));
		}
	};

	const downloadSingleImage = async (fileName) => {
		if (response.isPresent && folderRef.current) {
			try {
				const file = folderRef.current.file(fileName);
				if (file) {
					const blob = await file.async('blob');
					saveAs(blob, fileName);
				} else {
					console.error('File not found in zip:', fileName);
				}
			} catch (error) {
				console.error('Error downloading file:', fileName, error);
			}
		}
	};
	return (
		<div className='AfterUpload'>
			{response.isError ? (
				<Alert
					variant='filled'
					severity='error'
					sx={{
						backgroundColor: '#ff686b',
						marginTop: 0,
						marginBottom: 5,
						borderRadius: '6px',
						padding: '0.25rem 1.2rem',
					}}
				>
					{response.errorCode}
				</Alert>
			) : (
				''
			)}
			<div className='allFiles'>
				{response.isPresent ? (
					<div>
						<div className='afterCompress'>
							<button style={{ marginTop: '20px' }} onClick={() => dispatch({ type: 'delete-all' })} className='again'>
								다시하기
							</button>
							<button
								onClick={downloadImages}
								style={{ marginTop: '20px', paddingLeft: '21.5px', paddingRight: '21.5px' }}
								className='download'
							>
								<i style={{ marginRight: 4 }} className='fas fa-cloud-download-alt'></i>
								압축된 이미지 다운로드
							</button>
						</div>
					</div>
				) : (
					<>
						{data.files.length < 5 && (
							<div
								style={{
									position: 'relative',
									marginTop: 20,
									display: 'inline-flex',
									color: '#8B5CF6',
									cursor: 'pointer',
								}}
								className='add'
							>
								<div
									style={{
										display: 'none',
										marginLeft: 3,
										'&:hover': { textDecoration: 'underline' },
									}}
								>
									Add...
									<input
										accept='image/jpeg, image/png, image/gif, image/svg'
										style={{
											cursor: 'pointer',
											position: 'absolute',
											top: 0,
											left: 0,
											bottom: 0,
											right: 0,
											opacity: 0,
											width: '100%',
											height: '100%',
										}}
										type='file'
										onChange={(e) => dispatch({ type: 'add-file', payload: e.target.files })}
									/>
								</div>
							</div>
						)}
						<div
							onClick={() => dispatch({ type: 'delete-all' })}
							style={{
								float: 'right',
								cursor: 'pointer',
								fontSize: '.8rem',
								display: 'inline-flex',
								color: '#8b5cf6',
							}}
						>
							<div style={{ marginTop: 31 }}>
								<i style={{ marginRight: 5, padding: 0 }} className='fas fa-trash-alt'></i>
							</div>
							<div style={{ marginTop: 27, fontSize: '1rem' }}>Clear list</div>
						</div>
						<button className={'uploadButton'} onClick={compressHandler} style={{ marginTop: '20px' }}>
							압축하기
						</button>
					</>
				)}
				{data.files.map((el, idx) => {
					return (
						<div key={el.lastModified} className='itemWrapper' style={{ marginBottom: 15 }}>
							<div className='fileContainer'>
								<div className='fileName'>{el.name}</div>
								<div className='fileSize' style={{ marginBottom: 4 }}>
									<span className='sizeBefore' style={{ textDecoration: response.isPresent ? 'line-through' : 'none' }}>
										{prettyBytes(el.size)}
									</span>
									{response.isPresent ? (
										<span className='sizeAfter'>&nbsp; - &nbsp;{prettyBytes(sizeRef.current[idx])}</span>
									) : (
										''
									)}
								</div>
								<ProcessFile file={el} />
								{response.isPresent ? (
									<div
										onClick={() => downloadSingleImage(data.files[idx].name)}
										style={{
											marginTop: -35,
											display: 'flex',
											float: 'right',
											color: '#8B5CF6',
											cursor: 'pointer',
										}}
									>
										<i style={{ marginTop: 5, marginRight: 5, fontSize: '0.8rem' }} className='fas fa-download'></i>
										<div style={{ fontSize: '0.9rem' }}>Download</div>
									</div>
								) : (
									<div
										onClick={() => dispatch({ type: 'delete-file', payload: idx })}
										style={{
											marginTop: -38,
											fontSize: '0.9rem',
											float: 'right',
											color: 'tomato',
											cursor: 'pointer',
										}}
									>
										<i className='fas fa-trash-alt'></i>
									</div>
								)}
							</div>
							{response.loading ? (
								<div className='loader'>
									<div className='loader__element'></div>
								</div>
							) : (
								<div
									style={{
										backgroundColor: response.isPresent ? '#8B5CF6' : '#e2e8f0',
									}}
									className='fileLine'
								></div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};
