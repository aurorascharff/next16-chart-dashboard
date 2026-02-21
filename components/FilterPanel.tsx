'use client';

import { Filter, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { startTransition, useOptimistic } from 'react';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { fetcher } from '@/lib/fetcher';
import type { FilterValues } from '@/types/filters';
import { Select } from './design/Select';
import type { Route } from 'next';

export function FilterPanel() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const committedFilters: FilterValues = {
    category: searchParams.get('category'),
    city: searchParams.get('city'),
    country: searchParams.get('country'),
    region: searchParams.get('region'),
    subcategory: searchParams.get('subcategory'),
  };

  const [optimisticFilters, setOptimisticFilters] = useOptimistic(
    committedFilters,
    (current: FilterValues, patch: Partial<FilterValues>) => {
      return { ...current, ...patch };
    },
  );

  const isPending = optimisticFilters !== committedFilters;

  const { data: regions, isLoading: regionsLoading } = useSWR<{ name: string }[]>('/api/regions', fetcher);
  const { data: categories, isLoading: categoriesLoading } = useSWR<{ name: string }[]>('/api/categories', fetcher);
  const { data: countries, isLoading: countriesLoading } = useSWR<{ name: string }[]>(
    optimisticFilters.region ? `/api/countries?region=${encodeURIComponent(optimisticFilters.region)}` : null,
    fetcher,
  );
  const { data: subcategories, isLoading: subcategoriesLoading } = useSWR<{ name: string }[]>(
    optimisticFilters.category ? `/api/subcategories?category=${encodeURIComponent(optimisticFilters.category)}` : null,
    fetcher,
  );
  const { data: cities, isLoading: citiesLoading } = useSWR<{ name: string }[]>(
    optimisticFilters.region
      ? `/api/cities?region=${encodeURIComponent(optimisticFilters.region)}${
          optimisticFilters.country ? `&country=${encodeURIComponent(optimisticFilters.country)}` : ''
        }`
      : null,
    fetcher,
  );

  function applyFiltersAction(patch: Partial<FilterValues>) {
    const next = { ...optimisticFilters, ...patch };
    setOptimisticFilters(patch);
    router.replace(buildUrl(pathname, next) as Route);
  }

  const activeCount = Object.values(optimisticFilters).filter(Boolean).length;

  return (
    <div data-pending={isPending ? '' : undefined}>
      <Sheet>
        <SheetTrigger
          render={
            <Button variant="outline" className="gap-2">
              <Filter className="size-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeCount > 0 && (
                <span className="bg-primary text-primary-foreground flex size-5 items-center justify-center rounded-full text-xs">
                  {activeCount}
                </span>
              )}
            </Button>
          }
        />
        <SheetContent side="right" className="w-[340px] sm:w-[380px]">
          <SheetHeader>
            <SheetTitle>Filter Sales Data</SheetTitle>
            <SheetDescription>
              Filter by location and product category. Country and city both depend on region.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-2">
            <div className="flex flex-col gap-4">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Location</p>
              <Select
                label="Region"
                value={optimisticFilters.region}
                options={regions}
                isLoading={regionsLoading}
                action={value => {
                  applyFiltersAction({ city: null, country: null, region: value });
                }}
              />
              <Select
                label="Country"
                value={optimisticFilters.country}
                options={countries}
                isLoading={countriesLoading}
                disabled={!optimisticFilters.region}
                disabledPlaceholder="Select a region first"
                action={value => {
                  applyFiltersAction({ city: null, country: value });
                }}
              />
              <Select
                label="City"
                value={optimisticFilters.city}
                options={cities}
                isLoading={citiesLoading}
                disabled={!optimisticFilters.region}
                disabledPlaceholder="Select a region first"
                action={value => {
                  applyFiltersAction({ city: value });
                }}
              />
            </div>
            <Separator />
            <div className="flex flex-col gap-4">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Product</p>
              <Select
                label="Category"
                value={optimisticFilters.category}
                options={categories}
                isLoading={categoriesLoading}
                action={value => {
                  applyFiltersAction({ category: value, subcategory: null });
                }}
              />
              <Select
                label="Subcategory"
                value={optimisticFilters.subcategory}
                options={subcategories}
                isLoading={subcategoriesLoading}
                disabled={!optimisticFilters.category}
                disabledPlaceholder="Select a category first"
                action={value => {
                  applyFiltersAction({ subcategory: value });
                }}
              />
            </div>
          </div>
          <SheetFooter>
            <Button
              disabled={!activeCount}
              variant="outline"
              onClick={() => {
                startTransition(() => {
                  applyFiltersAction({
                    category: null,
                    city: null,
                    country: null,
                    region: null,
                    subcategory: null,
                  });
                });
              }}
              className="gap-2"
            >
              <X className="size-4" />
              Clear filters
            </Button>
            <SheetClose render={<Button>Apply & Close</Button>} />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function FilterPanelSkeleton() {
  return (
    <Button variant="outline" className="gap-2">
      <Skeleton className="size-4" />
      <Skeleton className="hidden h-4 w-16 sm:block" />
    </Button>
  );
}

function buildUrl(pathname: string, params: FilterValues): string {
  const sp = new URLSearchParams();
  if (params.region) sp.set('region', params.region);
  if (params.country) sp.set('country', params.country);
  if (params.city) sp.set('city', params.city);
  if (params.category) sp.set('category', params.category);
  if (params.subcategory) sp.set('subcategory', params.subcategory);
  const qs = sp.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}
