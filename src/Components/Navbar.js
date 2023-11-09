import React from 'react';
import '../assets/css/navbar.css';

export const Navbar = () => {
	return (
		<nav className='navbar'>
			<ul>
				{/* //<li className='navBrand'>Compressio</li> */}
				<a className='navBrandHref' href='/'>
					<li className='navBrand'>아이♥임이지</li>
				</a>
				<div className='navItem'>
					<a className='contactAnc' href='https://www.linkedin.com/in/%EC%9E%AC%ED%9B%88-%EC%9E%84-671958a3/'>
						<li className='contact'>Contact</li>
					</a>
					<a href='https://github.com/cepiloth'>
						<li>
							{' '}
							<i style={{ color: '#1f2937' }} className='fab fa-github'></i>
						</li>
					</a>
				</div>
			</ul>
		</nav>
	);
};
