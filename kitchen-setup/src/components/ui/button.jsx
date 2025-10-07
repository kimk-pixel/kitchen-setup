/* Minimal Button component */
export function Button({ children, className = '', variant = 'default', size = 'md', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-xl px-4 py-2 transition';
  const variants = {
    default: 'bg-green-600 text-white hover:bg-green-700',
    outline: 'border border-gray-400 text-gray-800 bg-white hover:bg-gray-100',
  };
  const sizes = { icon: 'p-2 w-9 h-9', md: '' };
  return (
    <button className={[base, variants[variant] || '', sizes[size] || '', className].join(' ')} {...props}>
      {children}
    </button>
  );
}
export default Button;