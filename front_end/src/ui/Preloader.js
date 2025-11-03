import React from 'react';
import "./CubeSpinner.css";

export default function Preloader() {
    return (
        <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-50">
            <div className="cube-spinner">
                <div className="cube-face cube-face-front"></div>
                <div className="cube-face cube-face-back"></div>
                <div className="cube-face cube-face-right"></div>
                <div className="cube-face cube-face-left"></div>
                <div className="cube-face cube-face-top"></div>
                <div className="cube-face cube-face-bottom"></div>
            </div>
            {/* Optional text */}
            <p className="absolute bottom-1/3 mt-16 text-gray-700 text-lg font-semibold">Loading...</p>
        </div>
    );
}