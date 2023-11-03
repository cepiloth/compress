import React, { useCallback, useContext, useState } from 'react';
import { BeforeUpload } from './BeforeUpload';
import { AfterUpload } from './AfterUpload';
import { useDropzone } from 'react-dropzone';
import { ImageContext } from '../context/ImageContext';
import Alert from '@mui/material/Alert';

export const UploadFiles = () => {
	const { data, dispatch } = useContext(ImageContext);
	const [isError, setIsError] = useState(false); // isError를 상태로 선언
	const onDrop = useCallback(
		(Uploadedfiles) => {
			if (Uploadedfiles.length > 0 && Uploadedfiles.length < 11) {
				dispatch({ type: 'add-file', payload: Uploadedfiles });
			} 
			else 
			{
				setIsError(true)
				setTimeout(() => {
					setIsError(false);
				}, 2000);
			}
		},
		[dispatch],
	);
	const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/jpeg, image/png, image/gif, image/svg+xml' });
	return (
		<>
			
			{data.totalFiles > 0 ? <AfterUpload /> : <BeforeUpload getInputProps={getInputProps} getRootProps={getRootProps} />}
			{isError && <Alert severity="error">This is an error alert — check it out!</Alert>}
		</>
	);
};
