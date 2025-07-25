export function Button({ children, onClick, disabled, variant = 'primary' }: any) {
  const base = "px-4 py-2 rounded font-semibold transition";
  const styles = variant === 'secondary'
    ? "bg-gray-600 hover:bg-gray-700 text-white"
    : "bg-purple-600 hover:bg-purple-700 text-white";
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}
