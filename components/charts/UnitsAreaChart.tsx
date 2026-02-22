'use client';

import { use } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { MonthlyData } from '@/types/sales';
import { Skeleton } from '../ui/skeleton';

const chartConfig = {
  units: {
    color: 'var(--chart-2)',
    label: 'Units Sold',
  },
} satisfies ChartConfig;

type Props = {
  monthlyData: Promise<MonthlyData[]>;
};

export function UnitsAreaChart({ monthlyData }: Props) {
  const data = use(monthlyData);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Units Sold Trend</CardTitle>
        <CardDescription>Monthly units sold over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={data} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={v => {
                const [, m] = v.split('-');
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return months[parseInt(m, 10) - 1] ?? v;
              }}
            />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillUnits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-units)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-units)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area dataKey="units" type="natural" fill="url(#fillUnits)" stroke="var(--color-units)" strokeWidth={2} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function UnitsChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-56" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[305px] w-full" />
      </CardContent>
    </Card>
  );
}
