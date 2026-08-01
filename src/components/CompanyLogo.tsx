import React from 'react';

interface CompanyLogoProps {
  className?: string;
  showSubtitle?: boolean;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  className = "h-12",
  showSubtitle = true,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col items-center justify-center space-y-3 my-4">
      <div className={`flex items-center justify-center ${className}`}>
        <svg
          viewBox="0 0 230 64"
          className="h-full w-auto max-w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* White Background Container */}
          <rect width="230" height="64" fill="#FFFFFF" />

          {/* 5-Dot ACME Corporate Symbol - Perfect 3x3 Grid Cross */}
          {/* Top Green Dot */}
          <circle cx="32" cy="11" r="10" fill="#008837" />
          
          {/* Left Dark Blue Dot */}
          <circle cx="11" cy="32" r="10" fill="#00529C" />
          
          {/* Center Red Dot */}
          <circle cx="32" cy="32" r="10" fill="#EE2E24" />
          
          {/* Right Yellow Dot */}
          <circle cx="53" cy="32" r="10" fill="#FFD200" />
          
          {/* Bottom Sky Blue Dot (directly under right yellow dot) */}
          <circle cx="53" cy="53" r="10" fill="#3FA9F5" />

          {/* ACME Wordmark - Precision Bold Corporate Typography */}
          <text
            x="74"
            y="45"
            fill="#00529C"
            fontFamily="'Arial Black', 'Trebuchet MS', 'Helvetica Neue', Arial, sans-serif"
            fontWeight="900"
            fontSize="43.2"
            letterSpacing="-0.5px"
          >
            ACME
          </text>
        </svg>
      </div>

      {showSubtitle && (
        <p className="text-[11px] text-slate-500 font-semibold tracking-tight text-center border-t border-slate-100 pt-2.5 w-full">
          제주대학생 글로벌 영어 챌린지 캠프 운영본부
        </p>
      )}
    </div>
  );
};
