export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return (
    <div className="flex items-center justify-center">
      <div className={`${sizes[size]} rounded-full border-3 border-[#d4a574]/30 border-t-[#d4a574] animate-spin`} />
    </div>
  );
}
