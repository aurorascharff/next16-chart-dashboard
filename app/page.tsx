import Link from 'next/link';
import { Suspense } from 'react';
import { ViewTransition } from 'react';
import { FilterPanel, FilterPanelSkeleton } from '@/components/FilterPanel';
import { RevenueGoal, RevenueGoalSkeleton } from '@/components/RevenueGoal';
import { SummaryCards, SummaryCardsSkeleton } from '@/components/SummaryCards';
import { UserGreeting, UserGreetingSkeleton } from '@/components/UserGreeting';
import { CategoryPieChart, CategoryChartSkeleton } from '@/components/charts/CategoryPieChart';
import { RevenueBarChart, RevenueChartSkeleton } from '@/components/charts/RevenueBarChart';
import { UnitsAreaChart, UnitsChartSkeleton } from '@/components/charts/UnitsAreaChart';
import { getRevenueGoal } from '@/data/queries/preferences';
import { getCategoryData, getMonthlyData } from '@/data/queries/sales';
import type { FilterValues } from '@/types/filters';
import type { Route } from 'next';

export default function Page({ searchParams }: PageProps<'/'>) {
  const goalPromise = getRevenueGoal();

  return (
    <>
      <div className="fixed top-4 left-4 z-60 hidden lg:flex">
        <Link
          href={'/slides/1' as Route}
          className="bg-foreground text-background inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium tracking-wide transition-opacity hover:opacity-80"
        >
          Start Slides →
        </Link>
      </div>
      <div className="group mx-auto flex max-w-7xl flex-col gap-6 p-6 md:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Sales Dashboard</h1>
          <Suspense fallback={<FilterPanelSkeleton />}>
            <FilterPanel />
          </Suspense>
        </div>
        <Suspense
          fallback={
            <ViewTransition enter="slide-down">
              <UserGreetingSkeleton />
            </ViewTransition>
          }
        >
          <ViewTransition enter="slide-up">
            <UserGreeting />
          </ViewTransition>
        </Suspense>
        <Suspense fallback={<RevenueGoalSkeleton />}>
          <RevenueGoal goalPromise={goalPromise} />
        </Suspense>
        <div className="flex flex-col gap-6 group-has-data-pending:animate-pulse">
          <Suspense fallback={<SummaryCardsSkeleton />}>
            <ViewTransition>
              <SummaryCards searchParams={searchParams} />
            </ViewTransition>
          </Suspense>
          <h2 className="text-lg font-semibold tracking-tight">Monthly Trends</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <Suspense
              fallback={
                <>
                  <RevenueChartSkeleton />
                  <UnitsChartSkeleton />
                </>
              }
            >
              <ViewTransition>
                <RevenueChartWrapper searchParams={searchParams} />
                <UnitsChartWrapper searchParams={searchParams} />
              </ViewTransition>
            </Suspense>
          </div>
          <h2 className="text-lg font-semibold tracking-tight">Breakdown</h2>
          <Suspense fallback={<CategoryChartSkeleton />}>
            <ViewTransition>
              <CategoryChartWrapper searchParams={searchParams} />
            </ViewTransition>
          </Suspense>
        </div>
      </div>
    </>
  );
}

type WrapperProps = {
  searchParams: PageProps<'/'>['searchParams'];
};

async function RevenueChartWrapper({ searchParams }: WrapperProps) {
  const { category, city, country, region, subcategory } = (await searchParams) as FilterValues;
  const monthlyDataPromise = getMonthlyData({ category, city, country, region, subcategory });
  const hasFilters = !!(category || city || country || region || subcategory);
  const revenueGoal = hasFilters ? null : await getRevenueGoal();
  return <RevenueBarChart monthlyData={monthlyDataPromise} revenueGoal={revenueGoal} />;
}

async function UnitsChartWrapper({ searchParams }: WrapperProps) {
  const { category, city, country, region, subcategory } = (await searchParams) as FilterValues;
  const monthlyDataPromise = getMonthlyData({ category, city, country, region, subcategory });
  return <UnitsAreaChart monthlyData={monthlyDataPromise} />;
}

async function CategoryChartWrapper({ searchParams }: WrapperProps) {
  const { category, city, country, region, subcategory } = (await searchParams) as FilterValues;
  const categoryDataPromise = getCategoryData({ category, city, country, region, subcategory });
  return <CategoryPieChart categoryData={categoryDataPromise} />;
}
