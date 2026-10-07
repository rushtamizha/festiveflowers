import { cn } from '@/lib/cn';

export function Skeleton({ className }) {
  return <div className={cn('skeleton rounded-small', className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <Skeleton className="aspect-[4/5] rounded-none" />
      <div className="space-y-2 p-3.5">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="size-9 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="border-b border-ink-200 bg-ink-50">
      <div className="wrap space-y-3 py-7 lg:py-11">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-8 w-72 max-w-full" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
    </div>
  );
}

/** Whole-route placeholder for listing pages while they load. */
export function RouteLoading({ count = 8 }) {
  return (
    <div aria-busy="true" aria-label="Loading">
      <PageHeaderSkeleton />
      <div className="wrap py-7 lg:py-10">
        <ProductGridSkeleton count={count} />
      </div>
    </div>
  );
}

/** Placeholder for a product page while it loads. */
export function ProductLoading() {
  return (
    <div aria-busy="true" aria-label="Loading" className="wrap grid gap-7 py-7 lg:grid-cols-[1.08fr_1fr] lg:gap-12">
      <Skeleton className="aspect-[4/5] rounded-large" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-4/5" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-36 w-full rounded-large" />
      </div>
    </div>
  );
}
