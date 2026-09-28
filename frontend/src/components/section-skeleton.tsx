import { Skeleton } from "@/components/ui/skeleton";

export function SectionSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="site-shell space-y-4 py-12">
      <Skeleton className="mx-auto h-10 w-48 max-w-full bg-white/10 sm:w-64" />
      <Skeleton className="mx-auto h-6 w-full max-w-md bg-white/10" />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} className="h-48 bg-white/10" />
        ))}
      </div>
    </div>
  );
}
