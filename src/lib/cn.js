// Tiny class-name joiner (shadcn/ui's `cn` without the dependencies).
export function cn(...parts) {
  return parts.flat().filter(Boolean).join(' ');
}
