export default function Skeleton({ className = '' }) {
  return (
    <div className={`bg-clap-muted/40 animate-pulse rounded-lg ${className}`} />
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-36 md:w-44">
      <Skeleton className="w-full aspect-[2/3]" />
      <Skeleton className="mt-2 h-4 w-3/4" />
      <Skeleton className="mt-1 h-3 w-1/2" />
    </div>
  );
}