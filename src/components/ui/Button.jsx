const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  disabled = false,
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform-gpu will-change-transform";
  
  const getVariantClasses = (variant) => {
    const variants = {
      primary: "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 focus:ring-blue-500 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95",
      secondary: "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 focus:ring-purple-500 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95",
      outline: "bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-blue-500 hover:text-blue-600 focus:ring-blue-500 shadow-md hover:shadow-lg hover:scale-105 active:scale-95",
      text: "bg-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-50 focus:ring-blue-500 hover:scale-105 active:scale-95",
      ghost: "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 focus:ring-slate-500 hover:scale-105 active:scale-95",
    };
    
    return variants[variant] || variants.primary;
  };
  
  const getSizeClasses = (size) => {
    const sizes = {
      sm: "text-sm px-4 py-2 rounded-xl",
      md: "text-base px-6 py-3 rounded-xl",
      lg: "text-lg px-8 py-4 rounded-2xl",
      xl: "text-xl px-10 py-5 rounded-2xl",
    };
    
    return sizes[size] || sizes.md;
  };
  
  const widthClass = fullWidth ? "w-full" : "";
  
  const allClasses = [
    baseClasses,
    getVariantClasses(variant),
    getSizeClasses(size),
    widthClass,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button 
      className={allClasses} 
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;