/* eslint-disable react/prop-types */
import React from 'react';
import Logo from '../assets/images/logo.png';
import '../assets/css/uploadfiles.css';

export const BeforeUpload = ({ getInputProps, getRootProps }) => {
	return (
		<div className='uploadFiles' {...getRootProps()}>
			<input {...getInputProps()} />
			<img className='logo' src={Logo} alt='Hello' />
			<div className='uploadText'>이미지 압축</div>
			<div className='uploadText-1-rem'>최고의 해상도로 이미지를 압축하세요</div>
			<div className='uploadText-1-rem'>온라인에서 한 번은 많은 이미지 파일 크기를 줄이세요</div>
			<div className='or'>
				<div className='line'></div>
				<div className='orText'>OR</div>
				<div className='line'></div>
			</div>
			<button className='uploadButton'>
				<div className='buttonContainer'>
					<i style={{ marginTop: 3 }} className='fas fa-folder'></i>
					<div className='browseBtn'>Browse...</div>
				</div>
			</button>
			<div className='uploadText-2-rem'>여기에 여러 이미지 놓기</div>
		</div>
	);
};
