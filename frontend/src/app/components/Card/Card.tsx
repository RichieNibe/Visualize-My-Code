import React from "react";
import './Card.css';

interface CardProps {
    label: string
}

export default function Card({ label }: CardProps) {
    return (
        <button className="card-button">{label}</button>
    );
}