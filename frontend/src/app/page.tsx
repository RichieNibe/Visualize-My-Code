"use client";
import Header from "./components/Header/Header";
import Card from "./components/Card/Card";
import Link from 'next/link';
import { useEffect } from 'react';
import axios from 'axios';
import { start } from "repl";

export default function Home() {
  useEffect(() => {
    const startServer = async () => {
      try {
        const response = await axios.get('https://backend-visualize-my-code.onrender.com');
        console.log('API response:', response.data);
      } catch (error) {
        console.error('Error starting server:', error);
      }
    };

    startServer();
  }, []);
  return (
    <div >

      <Header />
      <div
        className="text-container"
      >
        Visualize Your Code Like Never Before
        <div className="subtext">
          Transform your code into powerful visualizations for better understanding and debugging.
        </div>
      </div>
      <div className="card-container__title">
        Practice Data Structures
      </div>
      <div className="card-container">
        {/* <Card label="Arrays" /> */}
        {/* <Card label="LinkedList" /> */}
        <Link href="/pages/Stacks">
          <Card label="Stacks" />
        </Link>
        {/* <Card label="Queues" />
        <Card label="Binary Search Trees" /> */}
        <Link href="/pages/Dictionaries">
          <Card label="Dictionaries" />
        </Link>
      </div>
    </div>
  );
}
