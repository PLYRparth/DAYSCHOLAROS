import React from 'react';

const StandardCard = ({ 
  eyebrow, 
  title, 
  leftValue, 
  rightCode, 
  children,
  className = ''
}) => {
  return (
    <div className={`bg-[#25221C] border border-[#3A362E] rounded-xl p-4 md:p-5 flex flex-col justify-between ${className}`}>
      
      {/* Top half: Eyebrow and Title */}
      <div className="mb-4">
        {eyebrow && (
          <div className="font-mono text-[10px] text-[var(--color-muted)] tracking-widest uppercase mb-1">
            {eyebrow}
          </div>
        )}
        {title && (
          <div className="font-display font-medium text-lg text-[var(--color-cream)] leading-tight">
            {title}
          </div>
        )}
      </div>
      
      {/* Middle: Content (optional) */}
      {children && (
        <div className="flex-grow mb-4 text-[var(--color-muted)] text-sm">
          {children}
        </div>
      )}

      {/* Bottom half: Stats/Codes */}
      {(leftValue || rightCode) && (
        <div className="flex justify-between items-end mt-auto pt-2">
          {leftValue ? (
            <div className="font-mono text-[var(--color-coral)] text-sm">{leftValue}</div>
          ) : <div />}
          
          {rightCode && (
            <div className="font-mono text-[var(--color-muted)] text-sm">{rightCode}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default StandardCard;
