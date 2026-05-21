import React, { useState } from 'react';

interface AppLogoProps {
  className?: string;
  size?: number;
}

export const AppLogo: React.FC<AppLogoProps> = ({ className = '', size = 48 }) => {
  const [imgFailed, setImgFailed] = useState(false);

  if (!imgFailed) {
    return (
      <img
        src="/logo.png"
        alt="Rent Myanmar"
        className={`${className} object-contain transition-all duration-300`}
        style={{ width: size, height: size }}
        onError={() => setImgFailed(true)}
      />
    );
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          {/* Metallic Gold Gradient */}
          <linearGradient id="goldGradient" x1="120" y1="220" x2="260" y2="380" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fdf3cd" />
            <stop offset="20%" stopColor="#dfb76c" />
            <stop offset="50%" stopColor="#c29b47" />
            <stop offset="75%" stopColor="#f4e3b1" />
            <stop offset="100%" stopColor="#9a752c" />
          </linearGradient>

          {/* Roof Gold Gradient */}
          <linearGradient id="roofGold" x1="170" y1="120" x2="410" y2="250" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#dfb76c" />
            <stop offset="50%" stopColor="#fcf2cc" />
            <stop offset="100%" stopColor="#9a752c" />
          </linearGradient>

          {/* Flag Gradient for letter M */}
          <linearGradient id="myanmarFlag" x1="240" y1="210" x2="240" y2="380" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FECB00" />    {/* Yellow */}
            <stop offset="35%" stopColor="#FECB00" />
            <stop offset="35.1%" stopColor="#34B233" />  {/* Green */}
            <stop offset="65%" stopColor="#34B233" />
            <stop offset="65.1%" stopColor="#EA1926" />  {/* Red */}
            <stop offset="100%" stopColor="#EA1926" />
          </linearGradient>

          {/* Shadow Filter */}
          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#0d1b2e" floodOpacity="0.30" />
          </filter>
        </defs>

        {/* 1. Behind-all Houses Roof Structure */}
        {/* Navy Blue Outer Roof */}
        <path
          d="M 115 250 L 125 250 L 270 125 L 405 240 L 415 230 L 270 110 Z"
          fill="#112B49"
          stroke="#112B49"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Golden Inner Accent Roof */}
        <path
          d="M 148 245 L 270 143 L 372 230"
          stroke="url(#roofGold)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right Arrow pointing up-right from the roof */}
        {/* Navy outline of arrow */}
        <path
          d="M 315 200 L 400 130 L 380 120 L 415 110 L 410 148 L 392 135 L 310 210 Z"
          fill="#112B49"
          stroke="#112B49"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        {/* Gold fill inner arrow */}
        <path
          d="M 318 202 L 395 136 L 386 128 L 408 120 L 404 142 L 396 135 Z"
          fill="url(#roofGold)"
        />

        {/* 2. Traditional Gold "R" Layer with Kanote Scrollwork Details */}
        <g filter="url(#softShadow)">
          {/* Main 3D Dark Blue Background behind R to act as border/depth */}
          <path
            d="M 140 220 H 230 C 265 220 275 245 275 265 C 275 285 260 305 230 305 H 180 V 375 H 140 V 220 Z"
            fill="#112B49"
          />
          {/* Right leg background */}
          <path
            d="M 215 300 L 265 375 H 220 L 180 300 Z"
            fill="#112B49"
          />

          {/* Golden Letter R Body */}
          <path
            d="M 145 225 H 225 C 255 225 265 245 265 262 C 265 280 250 298 225 298 H 185 V 370 H 145 Z"
            fill="url(#goldGradient)"
            stroke="#112B49"
            strokeWidth="2"
          />
          {/* Elegant serif styling support for R */}
          <path
            d="M 215 298 L 260 370 H 225 L 185 298 Z"
            fill="url(#goldGradient)"
            stroke="#112B49"
            strokeWidth="2"
          />

          {/* Intricate Myanmar "Kanote" (Flame/Scrollwork) detailed overlays inside R */}
          {/* Scroll accent 1 - Main stem vertical curve */}
          <path
            d="M 155 240 C 165 250 170 270 160 290"
            stroke="#9a752c"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.75"
          />
          <path
            d="M 155 300 C 170 310 175 330 160 355"
            stroke="#9a752c"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.75"
          />
          {/* Scroll accent 2 - Loop swirling */}
          <path
            d="M 185 240 C 215 240 245 250 235 270 C 225 285 195 275 190 260 C 185 245 210 245 215 255"
            stroke="#7a541c"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.8"
          />
          {/* Scroll accent 3 - Leg swirl */}
          <path
            d="M 215 315 C 235 340 245 350 250 365"
            stroke="#7a541c"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.8"
          />
        </g>

        {/* 3. Myanmar Tricolor Flag Styled "M" with White Star */}
        <g filter="url(#softShadow)">
          {/* Main 3D Dark Blue border/shadow outline of M */}
          <path
            d="M 235 375 L 235 240 Q 235 220 258 220 Q 275 220 295 245 L 310 270 L 325 245 Q 345 220 362 220 Q 385 220 385 240 L 385 375 H 345 L 345 280 L 320 315 H 300 L 275 280 L 275 375 Z"
            fill="#112B49"
          />

          {/* White border layer around the flag, exactly matching the original sticker outline */}
          <path
            d="M 238 372 L 238 243 Q 238 224 258 224 Q 273 224 292 248 L 310 274 L 328 248 Q 347 224 362 224 Q 382 224 382 243 L 382 372 H 348 L 348 277 L 318 318 H 302 L 272 277 L 272 372 Z"
            fill="#FFFFFF"
          />

          {/* Myanmar horizontal tricolor filled letter M */}
          <path
            d="M 242 368 L 242 246 Q 242 228 258 228 Q 271 228 289 252 L 310 279 L 331 252 Q 349 228 362 228 Q 378 228 378 246 L 378 368 H 352 L 352 274 L 316 322 H 304 L 268 274 L 268 368 Z"
            fill="url(#myanmarFlag)"
          />

          {/* Golden outline accent for M */}
          <path
            d="M 242 368 L 242 246 Q 242 228 258 228 Q 271 228 289 252 L 310 279 L 331 252 Q 349 228 362 228 Q 378 228 378 246 L 378 368"
            stroke="#112B49"
            strokeWidth="1.5"
            fill="none"
          />

          {/* 5-pointed White Star on Myanmar flag (located on the middle green band of 'M') */}
          {/* Coordinates centered perfectly around x=310, y=298 */}
          <g transform="translate(310, 288) scale(0.7)">
            <polygon
              points="0,-25 7,-8 25,-8 11,4 16,21 0,11 -16,21 -11,4 -25,-8 -7,-8"
              fill="#FFFFFF"
              stroke="#2e542e"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};
