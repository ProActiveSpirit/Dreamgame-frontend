import * as Yup from 'yup';

export const FormSchema = Yup.object().shape({
  Region: Yup.array()
    .of(Yup.object().shape({ title: Yup.string().required() }))
    .required('Region is required')
    .min(1, 'At least one region must be selected'),
  Quantity: Yup.number()
    .required('Quantity is required')
    .min(1, 'Quantity must be at least 1')
    .typeError('Quantity must be a number'),
  costCurrency: Yup.string()
    .required('Purchase Currency is required')
    .oneOf(['EUR', 'Dollar'], 'Invalid Currency'),
  costExtVat: Yup.number()
    .required('cost Ext Vat is required')
    .min(0, 'cost Ext Vat must be at least 0')
    .typeError('cost Ext Vat must be a number'),
  costVat: Yup.number()
    .required('cost Vat is required')
    .min(0, 'cost Vat must be at least 0')
    .max(100, 'cost Vat cannot exceed 100')
    .typeError('cost Vat must be a number'),
  costIncVat: Yup.number()
    .required('cost Inc Vat is required')
    .min(0, 'cost Inc Vat must be at least 0')
    .typeError('cost Inc Vat must be a number'),
});

// Default values for the form
export const defaultValues = {
  orderDate: new Date(),
  Region: '',
  Product: '',
  startDate: new Date(),
  endDate: null,
  Quantity: '1',
  costCurrency: 'EUR',
  costExtVat: '1',
  costVat: '0',
  costIncVat: '0',
  };