import React from "react";
import './Header.css';
import logo from './logo.png';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
    return (
        <header className="navbar">
            <div className="flex-container">
                <ul className="flex flex-row">
                    <li>
                        <Image
                            src={logo}
                            alt="Description of the image"
                            width={25}  // Specify the desired width
                            height={10} // Specify the desired height
                        />
                    </li>
                    <Link href="/" style={{ fontFamily: 'sans-serif', fontWeight: 'bold' }} > Home</Link>
                    <Link href="/pages/Playground" style={{ fontFamily: 'sans-serif', fontWeight: 'bold' }}>Playground</Link>
                    <Link href="/pages/Problems" style={{ fontFamily: 'sans-serif', fontWeight: 'bold' }}>Problems</Link>
                </ul>
                {/* <Link href="/signin">
                    <div className="button-container">
                        <button className="button" >Sign in</button>
                    </div>
                </Link> */}
            </div>
        </header >
    );
}