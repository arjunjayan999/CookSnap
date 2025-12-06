import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecipeCardSkeleton() {
  return (
    <Card className="overflow-hidden flex flex-col">
      <Skeleton className="w-full h-40" />

      <CardHeader className="space-y-3">
        <Skeleton className="h-5 w-3/4" />

        <div className="space-y-1">
          <Skeleton className="h-3 w-1/3" />
          <div className="space-y-1 pl-1">
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>

        <Skeleton className="h-3 w-1/4" />
      </CardHeader>

      <CardFooter className="flex flex-col gap-3 mt-auto items-center">
        <div className="flex gap-2 w-full justify-center mt-1">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-7 w-28" />
        </div>

        <Skeleton className="h-4 w-20" />
      </CardFooter>
    </Card>
  );
}
