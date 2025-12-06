import { Skeleton } from "@/components/ui/skeleton";

export default function PantryListSkeleton({ count = 1 }) {
  return (
    <div className="space-y-2">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 border rounded-md p-3">
          <Skeleton className="h-4 w-4 rounded" />

          <Skeleton className="h-6 w-16 rounded-full" />

          <Skeleton className="h-5 flex-1" />

          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-16 rounded" />
            <Skeleton className="h-8 w-20 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
