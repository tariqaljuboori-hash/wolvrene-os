// filepath: app/page.tsx
import { StoreProvider } from '@/store/app-store';
import { AppShell } from '@/components/layout';

export default function Home() {
  return (
    <StoreProvider>
      <AppShell />
    </StoreProvider>
  );
}
