import { Skeleton } from "@/components/ui/skeleton";

export function SectionSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="container mx-auto px-4 py-12 space-y-4">
      <Skeleton className="h-10 w-64 mx-auto bg-white/10" />
      <Skeleton className="h-6 w-96 max-w-full mx-auto bg-white/10" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} className="h-48 bg-white/10" />
        ))}
      </div>
    </div>
  );
}
