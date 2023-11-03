import React from 'react';
import '../assets/css/navbar.css';

export const Navbar = () => {
	return (
		<nav className='navbar'>
			<ul>
				{/* //<li className='navBrand'>Compressio</li> */}
				<a className='navBrandHref' href='/'>
					<li className='navBrand'>Compressio</li>
				</a>
				<div className='navItem'>
					<a className='contactAnc' href='https://www.linkedin.com/in/abdullahchoudhary/'>
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
