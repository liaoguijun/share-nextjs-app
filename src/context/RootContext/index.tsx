import React from 'react';
import { RootContext } from './lib';
import useCustomHooks from '@/hooks/useCustomHooks';

export default function (props: { children: React.ReactNode }) {
  const { children } = props;

  const value = {
    ...useCustomHooks(),
  };

  return <RootContext.Provider value={value}>{children}</RootContext.Provider>;
}
