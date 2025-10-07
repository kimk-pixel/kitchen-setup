export function Card({ className='', children }) {
  return <div className={['rounded-2xl bg-white', className].join(' ')}>{children}</div>;
}
export function CardHeader({ children }) { return <div className="p-4 border-b">{children}</div>; }
export function CardTitle({ children, className='' }) { return <h3 className={['text-lg font-semibold', className].join(' ')}>{children}</h3>; }
export function CardContent({ children }) { return <div className="p-4">{children}</div>; }
export default Card;