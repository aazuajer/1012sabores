import React from 'react';

const BrandIcon = ({ size = 20, style = {}, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={{ flexShrink: 0, ...style }}>
    <circle cx="12" cy="12" r="10.5" fill="#E62E3B" stroke="#FFD700" strokeWidth="1.5" />
    {/* Tenedor */}
    <path d="M9 7V11M11 7V11M13 7V11M11 11V17" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    {/* Cuchillo */}
    <path d="M16 7V17" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M16 7C16 7 14.5 8.5 14.5 11" stroke="white" strokeWidth="1" strokeOpacity="0.5" />
  </svg>
);

export default BrandIcon;