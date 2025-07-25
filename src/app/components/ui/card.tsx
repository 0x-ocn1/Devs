export function Card({ children }: any) {
  return (
    <div className="max-w-md w-full bg-black/60 text-white backdrop-blur rounded-2xl shadow-lg">
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }: any) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}
