import * as React from 'react';

import SalesForm from '../components/sales_form';

interface SalesFormContainerProps {
  type: string;
}

export const SalesFormContainer = ({ type }: SalesFormContainerProps) => {
  return <SalesForm type={type} />
}

export default SalesFormContainer
