import React, { useState } from 'react';

const getFileIcon = (extension) => {
  const iconMap = {
    py: { color: '#3572A5', icon: '◆' },
    js: { color: '#F1E05A', icon: '◆' },
    jsx: { color: '#61DAFB', icon: '⚛' },
    ts: { color: '#3178C6', icon: '◆' },
    tsx: { color: '#3178C6', icon: '⚛' },
    css: { color: '#563D7C', icon: '◈' },
    scss: { color: '#C6538C', icon: '◈' },
    html: { color: '#E34C26', icon: '◇' },
    json: { color: '#B8860B', icon: '{}' },
    md: { color: '#6A737D', icon: '◊' },
    yml: { color: '#CB171E', icon: '◇' },
    yaml: { color: '#CB171E', icon: '◇' },
    sql: { color: '#E38C00', icon: '◇' },
    csv: { color: '#2ECC71', icon: '◇' },
    txt: { color: '#6A737D', icon: '◇' },
    png: { color: '#6A737D', icon: '◑' },
    jpg: { color: '#6A737D', icon: '◑' },
    svg: { color: '#FFB13B', icon: '◐' },
    pkl: { color: '#3572A5', icon: '◇' },
    ipynb: { color: '#DA5B0B', icon: '◆' },
    sh: { color: '#89E051', icon: '◇' },
    ps1: { color: '#012456', icon: '◇' },
    pbix: { color: '#F2C811', icon: '◇' },
    r: { color: '#198CE7', icon: '◆' },
    default: { color: '#6A737D', icon: '◇' },
  };
  return iconMap[extension] || iconMap.default;
};

function FileItem({ node, depth, githubUrl, branch }) {
  const [isOpen, setIsOpen] = useState(depth < 1);
  const [isHovered, setIsHovered] = useState(false);

  const isFolder = node.type === 'folder';
  const hasChildren = isFolder && node.children && node.children.length > 0;
  const fileIcon = getFileIcon(node.extension);

  const fileUrl = githubUrl
    ? `${githubUrl}/blob/${branch}/${node.path}`
    : '#';

  const handleClick = (e) => {
    if (isFolder) {
      setIsOpen(!isOpen);
    } else {
      e.preventDefault();
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="select-none">
      <div
        className={`prx-file-tree-node group relative flex items-center gap-1.5 py-0.5 cursor-pointer rounded transition-colors duration-150 ${
          isHovered ? 'bg-gold/8' : ''
        }`}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ paddingLeft: `${depth * 14 + 6}px` }}
      >
        {/* Expand/collapse indicator */}
        <div
          className={`flex items-center justify-center w-3.5 h-3.5 transition-transform duration-200 ${
            isFolder && isOpen ? 'rotate-90' : ''
          }`}
        >
          {isFolder ? (
            <svg
              width="5"
              height="7"
              viewBox="0 0 6 8"
              fill="none"
              style={{ color: isHovered ? '#B8860B' : '#6A737D' }}
            >
              <path
                d="M1 1L5 4L1 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <span style={{ color: fileIcon.color, fontSize: '9px' }}>{fileIcon.icon}</span>
          )}
        </div>

        {/* Folder/File icon */}
        <div className="flex items-center justify-center w-4 h-4">
          {isFolder ? (
            <svg width="14" height="12" viewBox="0 0 16 14" fill={isOpen ? '#B8860B' : '#6A737D'}>
              <path d="M1.5 1C0.671573 1 0 1.67157 0 2.5V11.5C0 12.3284 0.671573 13 1.5 13H14.5C15.3284 13 16 12.3284 16 11.5V4.5C16 3.67157 15.3284 3 14.5 3H8L6.5 1H1.5Z" />
            </svg>
          ) : (
            <svg width="12" height="14" viewBox="0 0 14 16" fill={fileIcon.color} opacity="0.7">
              <path d="M1.5 0C0.671573 0 0 0.671573 0 1.5V14.5C0 15.3284 0.671573 16 1.5 16H12.5C13.3284 16 14 15.3284 14 14.5V4.5L9.5 0H1.5Z" />
              <path d="M9 0V4.5H14" fill={fileIcon.color} fillOpacity="0.4" />
            </svg>
          )}
        </div>

        {/* Name */}
        <span
          className={`text-xs font-mono transition-colors duration-150 ${
            isFolder
              ? isHovered ? 'text-navy' : 'text-navy/80'
              : isHovered ? 'text-gold' : 'text-navy/60'
          }`}
          style={{ lineHeight: '1.4' }}
        >
          {node.name}
        </span>

        {/* External link indicator for files on hover */}
        {!isFolder && isHovered && (
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#B8860B"
            strokeWidth="2"
            className="ml-auto mr-1 opacity-60"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
          </svg>
        )}
      </div>

      {/* Children */}
      {hasChildren && isOpen && (
        <div className="relative">
          {/* Indent guide line */}
          <div
            className="absolute top-0 bottom-0 border-l border-navy/10"
            style={{ left: `${depth * 14 + 12}px` }}
          />
          {node.children.map((child) => (
            <FileItem
              key={child.path || child.name}
              node={child}
              depth={depth + 1}
              githubUrl={githubUrl}
              branch={branch}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileTree({ data, githubUrl, branch = 'main', className = '' }) {
  if (!data || data.length === 0) return null;

  return (
    <div className={`prx-file-tree-container ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 mb-1.5 border-b border-navy/10">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full" style={{ background: '#E5534B' }} />
          <div className="w-2 h-2 rounded-full" style={{ background: '#C69026' }} />
          <div className="w-2 h-2 rounded-full" style={{ background: '#57AB5A' }} />
        </div>
        <span className="text-[10px] text-navy/40 ml-1 font-mono uppercase tracking-wider">
          explorer
        </span>
      </div>

      {/* Tree */}
      <div className="space-y-0">
        {data.map((node) => (
          <FileItem
            key={node.path || node.name}
            node={node}
            depth={0}
            githubUrl={githubUrl}
            branch={branch}
          />
        ))}
      </div>
    </div>
  );
}
