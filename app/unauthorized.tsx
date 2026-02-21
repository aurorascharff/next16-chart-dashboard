import { LogIn } from 'lucide-react';
import { StatusCard } from '@/components/errors/StatusCard';

export default function Unauthorized() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-lg items-center justify-center p-6">
      <StatusCard icon={LogIn} title="Unauthorized" description="Please log in to access the dashboard." />
    </div>
  );
}
