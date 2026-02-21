'use client';

import { use } from 'react';
import { Cell, Pie, PieChart } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '../ui/skeleton';

const COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'];

const chartConfig = {
  Clothing: { color: 'var(--chart-2)', label: 'Clothing' },
  Electronics: { color: 'var(--chart-1)', label: 'Electronics' },
  Food: { color: 'var(--chart-3)', label: 'Food' },
  'Home & Garden': { color: 'var(--chart-4)', label: 'Home & Garden' },
  Sports: { color: 'var(--chart-5)', label: 'Sports' },
} satisfies ChartConfig;

type Props = {
  dataPromise: Promise<{ category: string; revenue: number }[]>;
};

export function CategoryPieChart({ dataPromise }: Props) {
  const data = use(dataPromise);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by Category</CardTitle>
        <CardDescription>Distribution across product categories</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto h-[300px] w-full">
          <PieChart accessibilityLayer>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={data} dataKey="revenue" nameKey="category" cx="50%" cy="50%" outerRadius={100} label>
              {data.map((_, index) => {
                return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
              })}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function CategoryChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <Skeleton className="mx-auto h-[300px] w-full" />
      </CardContent>
    </Card>
  );
}
