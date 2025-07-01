import React from 'react';

interface IconButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string; // Accessibility label, also used for tooltip or if showLabel is true
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties & { '--focus-ring-color'?: string };
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  onMouseEnter?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  showLabel?: boolean; // New prop to control label visibility
}

const IconButton: React.FC<IconButtonProps> = ({ 
  onClick, 
  icon, 
  label, 
  disabled, 
  className,
  style,
  onFocus,
  onBlur,
  onMouseEnter,
  onMouseLeave,
  showLabel = false // Default to false, making label sr-only unless specified
 }) => {
  
  // Base classes for structure and accessibility, a few default interactive behaviors.
  // Color/background related classes are mostly removed to allow CSS vars to dominate.
  const defaultBaseClasses = `inline-flex items-center justify-center focus:outline-none transition-opacity duration-150 ease-in-out`;
  
  const disabledClasses = `disabled:opacity-[var(--button-disabled-opacity,0.6)] disabled:cursor-not-allowed`;

  // Combine default classes with any provided className.
  const combinedClassName = `${defaultBaseClasses} ${disabledClasses} ${className || 'p-2 rounded-md'}`;
  
  // Default focus ring if not overridden by specific button styles
  const defaultFocusStyle = {
    '--focus-ring-color': 'var(--focus-ring-color)', // Fallback to global focus ring color
    ...style // Allow style prop to override --focus-ring-color
  } as React.CSSProperties;


  const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
    const focusRingColor = e.currentTarget.style.getPropertyValue('--focus-ring-color') || 'var(--focus-ring-color)';
    e.currentTarget.style.boxShadow = `0 0 0 2px ${focusRingColor}`;
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
    e.currentTarget.style.boxShadow = '';
    if (onBlur) onBlur(e);
  };


  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label} // Tooltip
      disabled={disabled}
      className={combinedClassName}
      style={defaultFocusStyle}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {icon}
      {showLabel && <span className="ml-2">{label}</span>}
      {!showLabel && <span className="sr-only">{label}</span>}
    </button>
  );
};

export default IconButton;