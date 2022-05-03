import * as React from 'react';

import SalesForm from '../components/salesForm';

interface SalesFormContainerProps {
  type: string;
}

export const SalesFormContainer = ({ type }: SalesFormContainerProps) => {
  return <SalesForm type={type} />
}

export default SalesFormContainer
