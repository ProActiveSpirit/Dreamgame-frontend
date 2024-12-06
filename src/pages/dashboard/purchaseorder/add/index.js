import {useState , useEffect } from 'react';
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
import { useDispatch, useSelector } from '../../../../redux/store';
import { getProducts } from '../../../../redux/slices/product';
import { createPurchaseOrder } from '../../../../redux/slices/purchaseorder';

// Components
import { useSettingsContext } from '../../../../components/settings';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import FormProvider, { RHFTextField } from '../../../../components/hook-form';
// Routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// Layouts
import DashboardLayout from '../../../../layouts/dashboard';

import RegionPrice from '../../e-commerce/product/detailed/regionPrice';

// ----------------------------------------------------------------------

// Default values for the form
export const defaultValues = {
  orderDate: new Date(),
  Region: '',
  Product: '',
  startDate: new Date(),
  endDate: null,
  Quantity: '1',
  purchaseCurrency: 'EUR',
  costExtVat: '1',
  costVat: '0',
  costIncVat: '0',
};

// ----------------------------------------------------------------------

PurchaseOrderAddPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

// Validation schema using Yup
const FormSchema = Yup.object().shape({
  Region: Yup.array()
    .of(Yup.object().shape({ title: Yup.string().required() })) // Ensure each option has a title
    .required('Region is required')
    .min(1, 'At least one region must be selected'), // Require at least one region
//   Product: Yup.string().required('Product is required'),
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
  purchaseCurrency: Yup.string()
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

export default function PurchaseOrderAddPage() {
  const { themeStretch } = useSettingsContext();

  const { products } = useSelector((state) => state.product); // Fetch products from Redux
  const [selectedRegions, setSelectedRegions] = useState([top100Films[1]]);

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
  const costExtVat = watch('costExtVat');
  const costVat = watch('costVat');
  // const Quantity = watch('Quantity');


  // Update purchaseIncVat dynamically
  useEffect(() => {
    if (costExtVat && costVat) {
      const vatAmount = (costExtVat * costVat) / 100;
      const costIncVat = (parseFloat(costExtVat) + parseFloat(vatAmount));
      setValue('costIncVat', costIncVat.toFixed(2)); // Keep 2 decimal places
    }
  }, [costExtVat, costVat, setValue]);

  const onSubmit = async (data) => {
    console.log('DATA', data); // Debug the form data
    dispatch(createPurchaseOrder(data));
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate API call
    reset(defaultValues); // Reset the form explicitly, including Autocomplete fields
  };

  useEffect(() => {
    dispatch(getProducts()); // Fetch products when the component mounts
  }, [dispatch]);

  return (
    <>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Purchase Order Add"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Purchase Order',
              href: PATH_DASHBOARD.purchaseorder.list,
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

                <Autocomplete
                  multiple
                  fullWidth
                  options={top100Films || []}
                  getOptionLabel={(option) => option?.title || ''}
                  value={watch('Region') || []}
                  onChange={(event, newValue) => setValue('Region', newValue)}
                  filterSelectedOptions
                  filterOptions={(options, state) =>
                    options.filter((option) =>
                      !(watch('Region') || []).some((selected) => selected.title === option.title)
                    )
                  } // Custom filter logic to exclude already selected items
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Template Regions"
                      placeholder="Country Code"
                      error={!!errors.Region}
                      helperText={errors.Region?.message}
                    />
                  )}
                />

                {/* Product Field */}
                <Autocomplete
                    fullWidth
                    options={products}
                    getOptionLabel={(option) => `${option?.name || ''} (${option?.sku || ''})`}
                    value={products.find((product) => product.id === watch('Product')) || null}
                    isOptionEqualToValue={(option, value) => option.name === value?.name}
                    onChange={(event, newValue) => setValue('Product', newValue?.id || '')}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Product"
                        error={!!errors.Product}
                        helperText={errors.Product?.message}
                    />
                    )}
                />
                {/* Start Date and End Date */}
                <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
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
                    <DateTimePicker
                    renderInput={(props) => (
                        <TextField
                        {...props}
                        fullWidth
                        error={!!errors.endDate}
                        helperText={errors.endDate?.message}
                        />
                    )}
                    label="End Date"
                    value={watch('endDate')}
                    onChange={(newValue) => setValue('endDate', newValue, { shouldValidate: true })}
                    />
                </Stack>

                {/* Quantity */}
                <RHFTextField
                    name="Quantity"
                    label="Quantity"
                    InputProps={{ type: 'number' }}
                    error={!!errors.Quantity}
                    helperText={errors.Quantity?.message}
                />

                {/* Purchase Currency */}
                <Autocomplete
                    fullWidth
                    disableClearable
                    value={watch('purchaseCurrency')}
                    options={['EUR', 'Dollar']}
                    onChange={(event, newValue) => setValue('purchaseCurrency', newValue)}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Purchase Currency"
                        error={!!errors.purchaseCurrency}
                        helperText={errors.purchaseCurrency?.message}
                    />
                    )}
                />

                {/* Cost Fields */}
                <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                    <RHFTextField
                    name="costExtVat"
                    label="Cost Ext Vat"
                    InputProps={{
                        type: 'number',
                        endAdornment: <InputAdornment position="end">EUR</InputAdornment>,
                    }}
                    error={!!errors.costExtVat}
                    helperText={errors.costExtVat?.message}
                    />
                    <RHFTextField
                    name="costVat"
                    label="Cost Vat"
                    InputProps={{
                        type: 'number',
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    error={!!errors.costVat}
                    helperText={errors.costVat?.message}
                    />
                    <RHFTextField
                    name="costIncVat"
                    label="Cost Inc Vat"
                    InputProps={{
                        type: 'number',
                        endAdornment: <InputAdornment position="end">EUR</InputAdornment>,
                    }}
                    error={!!errors.costIncVat}
                    helperText={errors.costIncVat?.message}
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

export const top100Films = [
    { title: 'BE' },
    { title: 'DE' },
    { title: 'ES' },
    { title: 'FR' },
    { title: 'NL' },
    { title: 'PT' },
    { title: 'PL' },
    { title: 'NO' },
    { title: 'GB' },
  ];