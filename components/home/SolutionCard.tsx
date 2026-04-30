"use client";

import Image from "next/image";
import { MdArrowForward } from "react-icons/md";
import "./SolutionCard.css";

interface SolutionCardProps {
    image: string;
    title: string;
    isLarge: boolean;
}

const SolutionCard = ({ image, title, isLarge }: SolutionCardProps) => {
    return (
        <div
            className="solution-card"
        >
            {/* Image Container */}
            <div
                className={`solution-card-container ${isLarge ? "large" : "small"}`}
            >
                {/* Image */}
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="solution-card-image"
                    priority={isLarge}
                    onError={(e) => {
                        // Fallback for missing images
                        e.currentTarget.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext x='50%' y='50%' font-size='16' fill='%236b7280' text-anchor='middle' dominant-baseline='middle' font-family='sans-serif'%3EImage%3C/text%3E%3C/svg%3E";
                    }}
                />

                {/* Overlay Gradient */}
                <div className="solution-card-overlay" />

                {/* Content - Title (Bottom Left) */}
                {title && (
                    <div className="solution-card-title">
                        <h3>{title}</h3>
                    </div>
                )}

                {/* Arrow Button (Bottom Right) */}
                <div className="solution-card-button">
                    <button aria-label={`View ${title || "product"}`}>
                        <MdArrowForward />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SolutionCard;
