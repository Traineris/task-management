import React from 'react';

interface AvatarProps {
  name?: string;
  avatarUrl?: string;
  size?: number;
  showBorder?: boolean;
}

const AVATAR_COLORS = [
  { bg: '#0052CC', text: '#FFFFFF' }, // Jira Blue
  { bg: '#00875A', text: '#FFFFFF' }, // Jira Green
  { bg: '#FF5630', text: '#FFFFFF' }, // Jira Red
  { bg: '#6554C0', text: '#FFFFFF' }, // Jira Purple
  { bg: '#FFAB00', text: '#172B4D' }, // Jira Yellow
  { bg: '#00B8D9', text: '#172B4D' }, // Jira Teal
  { bg: '#403294', text: '#FFFFFF' }, // Deep Navy
];

const getInitials = (name?: string): string => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const getColorByName = (name?: string) => {
  if (!name) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

export const Avatar: React.FC<AvatarProps> = ({
  name = 'User',
  avatarUrl,
  size = 24,
  showBorder = false,
}) => {
  const initials = getInitials(name);
  const color = getColorByName(name);
  const fontSize = Math.max(9, Math.floor(size * 0.42));

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        title={name}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          objectFit: 'cover',
          border: showBorder ? '2px solid #FFFFFF' : '1px solid var(--border-subtle)',
          boxShadow: showBorder ? '0 0 0 1px var(--border-default)' : 'none',
          flexShrink: 0,
        }}
      />
    );
  }

  return (
    <div
      title={name}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: color.bg,
        color: color.text,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${fontSize}px`,
        fontWeight: 700,
        letterSpacing: '-0.02em',
        userSelect: 'none',
        flexShrink: 0,
        border: showBorder ? '2px solid #FFFFFF' : 'none',
        boxShadow: showBorder ? '0 0 0 1px var(--border-default)' : 'none',
      }}
    >
      {initials}
    </div>
  );
};
