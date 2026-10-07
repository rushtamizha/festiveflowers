'use client';

import { useUi } from '@/lib/store';
import { CheckIcon } from '@/components/ui/Icons';

export default function Toaster() {
  const { toast } = useUi();
  return (
    <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-[76px] z-[80] flex justify-center px-4 lg:bottom-6">
      {toast && (
        <div key={toast.id} className="animate-pop flex items-center gap-2 rounded-full bg-ink-900 px-4 py-2.5 text-[13px] font-semibold text-white shadow-large">
          <span className="grid size-5 place-items-center rounded-full bg-success-500">
            <CheckIcon size={12} strokeWidth={3} />
          </span>
          {toast.message}
        </div>
      )}
    </div>
  );
}
