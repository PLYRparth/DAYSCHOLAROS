import React from 'react';

const ElevatedCard = ({ 
  eyebrow, 
  title, 
  leftValue, 
  rightCode, 
  children,
  className = ''
}) => {
  return (
    <div className={`bg-[var(--color-cream)] border border-[#E3DEC9] rounded-xl p-4 md:p-5 flex flex-col justify-between text-[var(--color-dark)] shadow-xl ${className}`}>
      
      {/* Top half: Eyebrow and Title */}
      <div className="mb-4">
        {eyebrow && (
          <div className="font-mono text-[10px] text-[var(--color-muted)] tracking-widest uppercase mb-1">
            {eyebrow}
          </div>
        )}
        {title && (
          <div className="font-display font-bold text-xl leading-tight">
            {title}
          </div>
        )}
      </div>
      
      {/* Middle: Content (optional) */}
      {children && (
        <div className="flex-grow mb-4 text-[#807b71] text-sm">
          {children}
        </div>
      )}

      {/* Bottom half: Stats/Codes */}
      {(leftValue || rightCode) && (
        <div className="flex justify-between items-end mt-auto pt-2">
          {leftValue ? (
            <div className="font-mono text-[var(--color-coral)] text-sm font-medium">{leftValue}</div>
          ) : <div />}
          
          {rightCode && (
            <div className="font-mono text-[var(--color-coral)] font-medium text-sm">{rightCode}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ElevatedCard;
