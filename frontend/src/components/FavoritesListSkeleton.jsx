import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function FavoritesListSkeleton({ count = 1 }) {
  return (
    <div className="container py-6">
      <div className="space-y-3 ">
        {[...Array(count)].map((_, i) => (
          <Card key={i} className="p-0 h-32 w-full">
            <CardHeader>
              <Skeleton className="h-5 w-48" />
            </CardHeader>

            <CardFooter className="flex justify-end items-center">
              <div className="flex gap-2">
                <Skeleton className="h-8 w-28 rounded" />
                <Skeleton className="h-8 w-24 rounded" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
