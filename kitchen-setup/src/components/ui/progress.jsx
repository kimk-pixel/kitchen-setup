export function Progress({ value = 0, className = '' }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className={['w-full h-3 bg-gray-300 rounded-full overflow-hidden', className].join(' ')}>
      <div className="h-3 bg-green-500" style={{ width: v + '%' }}></div>
    </div>
  );
}
export default Progress;