import { LogIn } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function Unauthorized() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-lg items-center justify-center p-6">
      <Card className="w-full text-center">
        <CardHeader>
          <div className="mx-auto mb-2">
            <LogIn className="text-muted-foreground size-8">{<LogIn />}</LogIn>
          </div>
          <CardTitle className="text-2xl">Unauthorized</CardTitle>
          <CardDescription className="text-base">Please log in to access the dashboard.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
