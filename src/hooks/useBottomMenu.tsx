import { useContext } from 'react';
import { BottomMenuContext } from '../contexts/BottomMenuContext';

export const useBottomMenu = () => {
  const context = useContext(BottomMenuContext);

  if (!context) {
    throw new Error('useBottomMenu must be used within a BottomMenuProvier');
  }

  return context;
};
