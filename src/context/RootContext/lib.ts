import { createContext } from 'react';
import type { useGetTranserDetailProps } from '@/hooks/useGetTransferDetail';

interface IRootContextValue extends useGetTranserDetailProps {}

export const RootContext = createContext<IRootContextValue>({
  transferDetail: null,
  setTransferDetail: () => {},
});
