import React from 'react';

interface IconProps {
  name: string;
  className?: string;
  size?: number | string;
  fill?: boolean;
}

export const Icon: React.FC<IconProps> = ({ name, className = '', size = 18, fill = false }) => {
  return (
    <span
      className={`material-symbols-outlined select-none inline-flex items-center justify-center ${className}`}
      style={{
        fontSize: typeof size === 'number' ? `${size}px` : size,
        fontVariationSettings: fill ? "'FILL' 1, 'wght' 400" : "'FILL' 0, 'wght' 400"
      }}
    >
      {name}
    </span>
  );
};
