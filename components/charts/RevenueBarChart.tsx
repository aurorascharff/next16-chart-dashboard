'use client';

import { use } from 'react';
import { Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { MonthlyData } from '@/types/sales';
import { Skeleton } from '../ui/skeleton';

const chartConfig = {
  revenue: {
    color: 'var(--chart-1)',
    label: 'Revenue',
  },
} satisfies ChartConfig;

type Props = {
  monthlyData: Promise<MonthlyData[]>;
  revenueGoal?: number | null;
};

export function RevenueBarChart({ monthlyData, revenueGoal }: Props) {
  const data = use(monthlyData);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Revenue</CardTitle>
        <CardDescription>Revenue breakdown by month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={data} accessibilityLayer>
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
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={v => {
                return `$${(v / 1000).toFixed(0)}k`;
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  nameKey="revenue"
                  formatter={value => {
                    return new Intl.NumberFormat('en-US', {
                      currency: 'USD',
                      maximumFractionDigits: 0,
                      style: 'currency',
                    }).format(value as number);
                  }}
                />
              }
            />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
            {revenueGoal != null && (
              <ReferenceLine
                y={revenueGoal}
                stroke="oklch(0.3 0.05 260)"
                strokeDasharray="8 4"
                strokeWidth={2}
              />
            )}
          </BarChart>
        </ChartContainer>
        {revenueGoal != null && (
          <div className="text-muted-foreground mt-3 flex items-center gap-2 text-xs">
            <svg width="16" height="2" aria-hidden="true">
              <line x1="0" y1="1" x2="16" y2="1" stroke="oklch(0.3 0.05 260)" strokeWidth="2" strokeDasharray="4 2" />
            </svg>
            Goal: {new Intl.NumberFormat('en-US', { currency: 'USD', maximumFractionDigits: 0, style: 'currency' }).format(revenueGoal)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function RevenueChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-56" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[330px] w-full" />
      </CardContent>
    </Card>
  );
}
