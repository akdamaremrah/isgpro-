import React from 'react';

interface MIconProps {
    name: string;
    size?: number;
    className?: string;
    style?: React.CSSProperties;
    onClick?: (e: React.MouseEvent) => void;
}

const MIcon: React.FC<MIconProps> = ({ name, size = 20, className = '', style, onClick }) => (
    <span
        className={`material-icons-outlined ${className}`}
        style={{ fontSize: size, lineHeight: 1, verticalAlign: 'middle', ...style }}
        onClick={onClick}
    >
        {name}
    </span>
);

export default MIcon;
