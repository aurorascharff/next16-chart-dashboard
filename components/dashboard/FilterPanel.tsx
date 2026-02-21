'use client';

import { Filter, X } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { useTransition } from 'react';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { filterSearchParams } from '@/lib/searchParams';

const fetcher = (url: string) => {
  return fetch(url).then(res => {
    return res.json();
  });
};

export function FilterPanel() {
  const [isPending, startTransition] = useTransition();
  const [region, setRegion] = useQueryState('region', {
    ...filterSearchParams.region,
    shallow: false,
    startTransition,
  });
  const [country, setCountry] = useQueryState('country', {
    ...filterSearchParams.country,
    shallow: false,
    startTransition,
  });
  const [city, setCity] = useQueryState('city', { ...filterSearchParams.city, shallow: false, startTransition });
  const [category, setCategory] = useQueryState('category', {
    ...filterSearchParams.category,
    shallow: false,
    startTransition,
  });
  const [subcategory, setSubcategory] = useQueryState('subcategory', {
    ...filterSearchParams.subcategory,
    shallow: false,
    startTransition,
  });

  // Regions and categories fetch at start in parallel
  const { data: regions, isLoading: regionsLoading } = useSWR<{ name: string }[]>('/api/regions', fetcher);
  const { data: categories, isLoading: categoriesLoading } = useSWR<{ name: string }[]>('/api/categories', fetcher);

  // Countries depend on region, subcategories depend on category
  const { data: countries, isLoading: countriesLoading } = useSWR<{ name: string }[]>(
    region ? `/api/countries?region=${encodeURIComponent(region)}` : null,
    fetcher,
  );
  const { data: subcategories, isLoading: subcategoriesLoading } = useSWR<{ name: string }[]>(
    category ? `/api/subcategories?category=${encodeURIComponent(category)}` : null,
    fetcher,
  );

  // Cities depend on region, optionally narrowed by country
  const { data: cities, isLoading: citiesLoading } = useSWR<{ name: string }[]>(
    region
      ? `/api/cities?region=${encodeURIComponent(region)}${country ? `&country=${encodeURIComponent(country)}` : ''}`
      : null,
    fetcher,
  );

  const handleRegionChange = (value: string | null) => {
    setRegion(value);
    setCountry(null);
    setCity(null);
  };

  const handleCountryChange = (value: string | null) => {
    setCountry(value);
    setCity(null);
  };

  const handleCityChange = (value: string | null) => {
    setCity(value);
  };

  const handleCategoryChange = (value: string | null) => {
    setCategory(value);
    setSubcategory(null);
  };

  const handleSubcategoryChange = (value: string | null) => {
    setSubcategory(value);
  };

  const handleClear = () => {
    setRegion(null);
    setCountry(null);
    setCity(null);
    setCategory(null);
    setSubcategory(null);
  };

  const activeCount = [region, country, city, category, subcategory].filter(Boolean).length;

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
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Region</label>
                <Select value={region} onValueChange={handleRegionChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={regionsLoading ? 'Loading...' : 'Select region'} />
                  </SelectTrigger>
                  <SelectContent>
                    {regions?.map(r => {
                      return (
                        <SelectItem key={r.name} value={r.name}>
                          {r.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Country</label>
                <Select value={country} onValueChange={handleCountryChange} disabled={!region}>
                  <SelectTrigger className="w-full" disabled={!region}>
                    <SelectValue
                      placeholder={
                        !region ? 'Select a region first' : countriesLoading ? 'Loading...' : 'Select country'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {countries?.map(c => {
                      return (
                        <SelectItem key={c.name} value={c.name}>
                          {c.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">City</label>
                <Select value={city} onValueChange={handleCityChange} disabled={!region}>
                  <SelectTrigger className="w-full" disabled={!region}>
                    <SelectValue
                      placeholder={!region ? 'Select a region first' : citiesLoading ? 'Loading...' : 'Select city'}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {cities?.map(c => {
                      return (
                        <SelectItem key={c.name} value={c.name}>
                          {c.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Separator />
            <div className="flex flex-col gap-4">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Product</p>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={category} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={categoriesLoading ? 'Loading...' : 'Select category'} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map(c => {
                      return (
                        <SelectItem key={c.name} value={c.name}>
                          {c.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Subcategory</label>
                <Select value={subcategory} onValueChange={handleSubcategoryChange} disabled={!category}>
                  <SelectTrigger className="w-full" disabled={!category}>
                    <SelectValue
                      placeholder={
                        !category
                          ? 'Select a category first'
                          : subcategoriesLoading
                            ? 'Loading...'
                            : 'Select subcategory'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategories?.map(s => {
                      return (
                        <SelectItem key={s.name} value={s.name}>
                          {s.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={handleClear} disabled={isPending} className="gap-2">
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
