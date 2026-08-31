'use client';

import { Provider } from 'react-redux';
import { store } from '../utils/store';
import { AdminAuthProvider } from '../lib/admin-auth';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AdminAuthProvider>{children}</AdminAuthProvider>
    </Provider>
  );
}
