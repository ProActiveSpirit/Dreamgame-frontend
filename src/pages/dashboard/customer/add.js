import { useEffect } from 'react';
// @mui
import {
  Grid,
  Stack,
  Container,
  TextField,
  Autocomplete,
  InputAdornment,
} from '@mui/material';
// Validation schema
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { LoadingButton } from '@mui/lab';
import { DateTimePicker } from '@mui/x-date-pickers';
// Redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getProducts } from '../../../redux/slices/product';
import { getCustomers } from '../../../redux/slices/user';
import { createSalesOrder } from '../../../redux/slices/salesorder';

// Components
import { useSettingsContext } from '../../../components/settings';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
// Routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// Layouts
import DashboardLayout from '../../../layouts/dashboard';

// ----------------------------------------------------------------------

// Default values for the form
export const defaultValues = {
  orderDate: new Date(),
  Customer: '',
  Product: '',
  startDate: new Date(),
  endDate: null,
  Quantity: '1',
  salesCurrency: 'EUR',
  salesExtVat: '1',
  salesVat: '0',
  salesIncVat: '0',
};

// ----------------------------------------------------------------------

SalesOrderAddPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

// Validation schema using Yup
const FormSchema = Yup.object().shape({
  Customer: Yup.string().required('Customer is required'),
  Product: Yup.string().required('Product is required'),
  startDate: Yup.date().required('Start Date is required').typeError('Invalid date'),
  orderDate: Yup.date().required('Order Date is required').typeError('Invalid date'),
  endDate: Yup.date()
    .required('End Date is required')
    .typeError('Invalid date')
    .min(Yup.ref('startDate'), 'End Date must be later than Start Date')
    .typeError('End Date must be later than Start Date'), // Custom validation
  Quantity: Yup.number()
    .required('Quantity is required')
    .min(1, 'Quantity must be at least 1')
    .typeError('Quantity must be a number'),
  salesCurrency: Yup.string()
    .required('Sales Currency is required')
    .oneOf(['EUR', 'Dollar'], 'Invalid Currency'),
  salesExtVat: Yup.number()
    .required('Sales Ext Vat is required')
    .min(0, 'Sales Ext Vat must be at least 0')
    .typeError('Sales Ext Vat must be a number'),
  salesVat: Yup.number()
    .required('Sales Vat is required')
    .min(0, 'Sales Vat must be at least 0')
    .max(100, 'Sales Vat cannot exceed 100')
    .typeError('Sales Vat must be a number'),
  salesIncVat: Yup.number()
    .required('Sales Inc Vat is required')
    .min(0, 'Sales Inc Vat must be at least 0')
    .typeError('Sales Inc Vat must be a number'),
});

export default function SalesOrderAddPage() {
  const { themeStretch } = useSettingsContext();

  const { products } = useSelector((state) => state.product); // Fetch products from Redux
  const { customers } = useSelector((state) => state.user); // Fetch products from Redux

  const dispatch = useDispatch();

  const methods = useForm({
    resolver: yupResolver(FormSchema),
    defaultValues,
  });

  
  const {
    reset,
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = methods;

  // Watch fields for dynamic updates
  const salesExtVat = watch('salesExtVat');
  const salesVat = watch('salesVat');
  // const Quantity = watch('Quantity');


  // Update salesIncVat dynamically
  useEffect(() => {
    if (salesExtVat && salesVat) {
      const vatAmount = (salesExtVat * salesVat) / 100;
      const salesIncVat = (parseFloat(salesExtVat) + parseFloat(vatAmount));
      setValue('salesIncVat', salesIncVat.toFixed(2)); // Keep 2 decimal places
    }
  }, [salesExtVat, salesVat, setValue]);

  const onSubmit = async (data) => {
    console.log('DATA', data); // Debug the form data
    dispatch(createSalesOrder(data));
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate API call
    reset(defaultValues); // Reset the form explicitly, including Autocomplete fields
  };

  useEffect(() => {
    dispatch(getCustomers()); // Fetch Customers when the component mounts
    dispatch(getProducts()); // Fetch products when the component mounts
  }, [dispatch]);

  return (
    <>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Sales Order Add"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Sales Order',
              href: PATH_DASHBOARD.salesorder.list,
            },
            { name: 'Add' },
          ]}
        />

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                {/* Order Date */}
                <DateTimePicker
                  renderInput={(props) => <TextField {...props} fullWidth />}
                  label="Order Date"
                  value={watch('orderDate')}
                  onChange={(newValue) => setValue('orderDate', newValue)}
                />
                {/* Customer Field */}
                <Autocomplete
                  fullWidth
                  options={customers || []} // Ensure options is always an array
                  getOptionLabel={(option) => (option?.name ? option.name : '')} // Safely access name
                  value={
                    customers?.find((customer) => customer.id === watch('Customer')) || null
                  } // Match selected value properly
                  isOptionEqualToValue={(option, value) => option?.name === value?.name} // Compare by unique ID
                  onChange={(event, newValue) => setValue('Customer', newValue?.id || '')} // Update the form state
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Customer"
                      error={!!errors?.Customer} // Display error if it exists
                      helperText={errors?.Customer?.message} // Show error message if available
                    />
                  )}
                />
                {/* Product Field */}
                <Autocomplete
                  fullWidth
                  options={products} // Products fetched from Redux
                  getOptionLabel={(option) => `${option?.name || ''} (${option?.sku || ''})`} // Ensure label is valid
                  value={products.find((product) => product.id === watch('Product')) || null} // Match value properly
                  isOptionEqualToValue={(option, value) => option.name === value?.name} // Compare by name
                  onChange={(event, newValue) => setValue('Product', newValue?.id || '')} // Update form state
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Product"
                      error={!!errors.Product}
                      helperText={errors.Product?.message}
                    />
                  )}
                />
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                {/* Start Date */}
                <DateTimePicker
                  renderInput={(props) => (
                    <TextField
                      {...props}
                      fullWidth
                      error={!!errors.startDate}
                      helperText={errors.startDate?.message}
                    />
                  )}
                  label="Start Date"
                  value={watch('startDate')}
                  onChange={(newValue) => setValue('startDate', newValue, { shouldValidate: true })}
                />

                {/* End Date */}
                <DateTimePicker
                  renderInput={(props) => (
                    <TextField
                      {...props}
                      fullWidth
                      error={!!errors.endDate} // Show error state when validation fails
                      helperText={errors.endDate?.message} // Display the validation error message
                    />
                  )}
                  label="End Date"
                  value={watch('endDate')}
                  onChange={(newValue) => setValue('endDate', newValue, { shouldValidate: true })}
                />
              </Stack>
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                {/* Quantity */}
                <RHFTextField
                  name="Quantity"
                  label="Quantity"
                  // value={watch('Quantity')}
                  InputProps={{ type: 'number' }}
                  error={!!errors.Quantity}
                  helperText={errors.Quantity?.message}
                />

                {/* Sales Currency */}
                  <Autocomplete
                    fullWidth
                    disableClearable
                    value={watch('salesCurrency')}
                    options={['EUR', 'Dollar']}
                    onChange={(event, newValue) => setValue('salesCurrency', newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Sales Currency"
                        error={!!errors.salesCurrency}
                        helperText={errors.salesCurrency?.message}
                      />
                    )}
                  />
                </Stack>
                {/* Sales Ext Vat, Sales Vat, Sales Inc Vat */}
                <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                  <RHFTextField
                    name="salesExtVat"
                    label="Sales Ext Vat"
                    InputProps={{
                      type: 'number',
                      endAdornment: <InputAdornment position="end">EUR</InputAdornment>,
                    }}
                    error={!!errors.salesExtVat}
                    helperText={errors.salesExtVat?.message}
                  />
                  <RHFTextField
                    name="salesVat"
                    label="Sales Vat"
                    InputProps={{
                      type: 'number',
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    error={!!errors.salesVat}
                    helperText={errors.salesVat?.message}
                  />
                  <RHFTextField
                    name="salesIncVat"
                    label="Sales Inc Vat"
                    InputProps={{
                      type: 'number',
                      endAdornment: <InputAdornment position="end">EUR</InputAdornment>,
                    }}
                    error={!!errors.salesIncVat}
                    helperText={errors.salesIncVat?.message}
                  />
                </Stack>

                {/* Submit Button */}
                <LoadingButton
                  fullWidth
                  color="info"
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  Submit to Add
                </LoadingButton>
              </Stack>
            </Grid>
          </Grid>
        </FormProvider>
      </Container>
    </>
  );
}