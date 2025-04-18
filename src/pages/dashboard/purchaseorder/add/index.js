import {useState , useEffect } from 'react';
// @mui
import {
  Grid,
  Stack,
  Box,
  Divider,
  Typography,
  Container,
  TextField,
  Autocomplete,
  InputAdornment,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// Validation schema
import { useRouter } from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { LoadingButton } from '@mui/lab';
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
// Custom imports
import RegionPrice from '../../e-commerce/product/detailed/regionPrice';
import { getSalesOrders } from '../../../../redux/slices/salesorder';

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

// ----------------------------------------------------------------------

PurchaseOrderAddPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

// Validation schema using Yup
const FormSchema = Yup.object().shape({
  Region: Yup.array()
    .required('Region is required'),
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

  // Columns definition
  const columns = [
    { field: "Product", headerName: "Product", width: 350 },
    { field: "Quantity", headerName: "Quantity", width: 150 },
    {
      field: "CostExtVat",
      headerName: "Cost (Ext. VAT)",
      width: 250,
      valueGetter: (params) => `${params.row.CostExtVat} ${params.row.CostCurrency}`,
    },
    {
      field: "CostVat",
      headerName: "Cost VAT",
      width: 200,
      valueGetter: (params) => `${params.row.CostVat} %`,
    },
    {
      field: "CostIncVat",
      headerName: "Cost (Inc. VAT)",
      width: 200,
      valueGetter: (params) => `${params.row.CostIncVat} ${params.row.CostCurrency}`,
    },
  ];

export default function PurchaseOrderAddPage() {
  const { themeStretch } = useSettingsContext();

  const [rows, setRows] = useState([]);
  const [totals, setTotals] = useState({ totalQuantity: 0, totalCostIncVat: 0 });

  const { products } = useSelector((state) => state.product);
  const allOrders = useSelector((state) => state.salesorder.allOrders);

  const dispatch = useDispatch();
  const router = useRouter();


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

  const watchedCostExtVat = watch('costExtVat');
  const watchedCostVat = watch('costVat');

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (['costExtVat', 'costVat', 'costIncVat'].includes(name)) {
        const watchedProduct = value.Product;
        const newCostExtVat = parseFloat(value.costExtVat) || 0;
        const newCostVat = parseFloat(value.costVat) || 0;
        const newCostIncVat = parseFloat(value.costIncVat) || 0;

        if (name === 'costExtVat' && newCostVat) {
          const calculatedIncVat = newCostExtVat * (1 + newCostVat / 100);
          setValue('costIncVat', calculatedIncVat.toFixed(2));
        } else if (name === 'costVat') {
          if (newCostExtVat) {
            const calculatedIncVat = newCostExtVat * (1 + newCostVat / 100);
            setValue('costIncVat', calculatedIncVat.toFixed(2));
          } else if (newCostIncVat) {
            const calculatedExtVat = newCostIncVat / (1 + newCostVat / 100);
            setValue('costExtVat', calculatedExtVat.toFixed(2));
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  useEffect(() => {
    if (watchedCostExtVat && watchedCostVat) {
      const vatAmount = (watchedCostExtVat * watchedCostVat) / 100;
      const costIncVat = (parseFloat(watchedCostExtVat) + parseFloat(vatAmount));
      setValue('costIncVat', costIncVat.toFixed(2));
    }
  }, [watchedCostExtVat, watchedCostVat, setValue]);

  const onSubmit = async (data) => {
    console.log("data: ", data);
    const result = await dispatch(createPurchaseOrder(data));
    console.log("result" , result);
    if (result.success) {
      router.push(PATH_DASHBOARD.purchaseorder.view(result.data[0].id));
    }
    else{
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate API call
      reset(defaultValues); // Reset the form explicitly, including Autocomplete fields
    }
  };

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getSalesOrders());
  }, [dispatch]);

  return (
    <>
      <Container maxWidth={themeStretch ? false : 'xl'}>
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
        <Grid container justifyContent="left" alignItems="center" spacing={5}>
      {/* Order Information */}
      <Grid item xs={12} md={12}>
        <Box sx={{ padding: 2, border: '1px solid #e0e0e0', borderRadius: 2, marginBottom: 3 }}>
          <Typography variant="h7" gutterBottom>
            Order Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={3}>
            <Autocomplete
              fullWidth
              options={allOrders}
              getOptionLabel={(option) => `${option?.id || ''} - ${option?.salesOrder || ''}`}
              value={watch('currentOrder') || null}
              onChange={(event, newValue) => {
                if (newValue) {
                  router.push(`/dashboard/salesorder/detailed/${newValue.id}`);
                }
              }}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Select Sales Order" 
                  placeholder="Search by ID or SalesOrder"
                  size="small"
                />
              )}
              size="small"
            />
            <TextField name="friendlyName" variant="outlined" fullWidth label="Friendly Name" size="small" />
            <Stack spacing={2} direction={{ xs: 'column', sm: 'column' }}>
              <Autocomplete
                fullWidth
                options={products}
                getOptionLabel={(option) => `${option?.name || ''} (${option?.sku || ''})`}
                value={products.find((product) => product.id === watch('Product')) || null}
                isOptionEqualToValue={(option, value) => option.name === value?.name}
                onChange={(event, newValue) => setValue('Product', newValue?.id || '')}
                renderInput={(params) => (
                  <TextField {...params} label="Product" error={!!errors.Product} helperText={errors.Product?.message} />
                )}
                size="small"
              />
              {watch('Product') ? 
                <RegionPrice price={products.find((product) => product.id === watch('Product')).price} SalesVat={0}/>: <></>}
            </Stack>
            <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
              <Autocomplete 
                fullWidth
                options={['Nexway', 'Epay', 'Nintendo']}
                getOptionLabel={(option) => `${option || ''}`}
                value={watch('Vendor') || null}
                isOptionEqualToValue={(option, value) => option === value}
                onChange={(event, newValue) => setValue('Vendor', newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Vendor" error={!!errors.Vendor} helperText={errors.Vendor?.message} />
                )}
                size="small"
              />
              <Autocomplete
                fullWidth
                multiple // Allow multiple region selection
                options={['NO', 'BE', 'DE', 'ES', 'FR', 'NL', 'PT', 'PL', 'GB']} // Region options
                value={watch('Region') || []}
                isOptionEqualToValue={(option, value) => option === value}
                onChange={(event, newValue) => setValue('Region', newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Region" error={!!errors.Region} helperText={errors.Region?.message} />
                )}
                size="small"
              />
            </Stack>
            <RHFTextField 
              name="Quantity" 
              label="Quantity" 
              variant="outlined" 
              fullWidth 
              size="small"
              InputProps={{
                type: 'number',
              }}
              error={!!errors.Quantity}
              helperText={errors.Quantity?.message}
            />
          </Stack>
        </Box>
      </Grid>

      {/* Cost Information */}
      <Grid key={4} container spacing={10}>
        <Grid key={1} item xs={6} md={6}>
          <Box sx={{ padding: 2, border: '1px solid #e0e0e0', borderRadius: 2, marginBottom: 3 }}>
            <Typography variant="h7" gutterBottom>
              Cost Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          <Stack spacing={2}>

            {/* Cost Currency */}
            <Autocomplete
              fullWidth
              disableClearable
              value={watch('costCurrency')}
              options={['EUR', 'Dollar']}
              onChange={(event, newValue) => setValue('costCurrency', newValue)}
              size="small"
              renderInput={(params) => (
              <TextField
                  {...params}
                  label="Cost Currency"
                  error={!!errors.costCurrency}
                  helperText={errors.costCurrency?.message}
              />
              )}
            />
            <RHFTextField
              name="costExtVat"
              label="Cost Ext Vat"
              InputProps={{
                type: 'number',
                endAdornment: <InputAdornment position="end" disableTypography>EUR</InputAdornment>,
              }}
              size="small"
              error={!!errors.costExtVat}
              helperText={errors.costExtVat?.message}
            />
            <RHFTextField
              name="costVat"
              label="Cost Vat"
              InputProps={{
                type: 'number',
                endAdornment: <InputAdornment position="end" disableTypography>%</InputAdornment>,
              }}
              size="small"
              error={!!errors.costVat}
              helperText={errors.costVat?.message}
            />
            <RHFTextField
              name="costIncVat"
              label="Cost Inc Vat"
              InputProps={{
                type: 'number',
                endAdornment: <InputAdornment position="end" disableTypography>EUR</InputAdornment>,
              }}
              size="small"
              error={!!errors.costIncVat}
              helperText={errors.costIncVat?.message}
            />
          </Stack>
          </Box>
        </Grid>
        <Grid key={2} item xs={6} md={6}>
          <Box sx={{ padding: 2, border: '1px solid #e0e0e0', borderRadius: 2, marginBottom: 3 }}>
          
            <Typography variant="h7" gutterBottom>
              Stock Order API Sales Information
            </Typography>
            <Divider  sx={{ mb: 2 }}  />
            <Stack spacing={2}>
            {/* Cost Currency */}
            <Autocomplete
              fullWidth
              disableClearable
              value={watch('costCurrency')}
              options={['EUR', 'Dollar']}
              onChange={(event, newValue) => setValue('costCurrency', newValue)}
              size="small"
              renderInput={(params) => (
              <TextField
                  {...params}
                  label="Stock Sales Currency"
                  error={!!errors.costCurrency}
                  helperText={errors.costCurrency?.message}
              />
              )}
            />
            <RHFTextField
              name="stockSalesIncVat"
              label="Stock Sales Inc Vat"
              InputProps={{
                type: 'number',
                endAdornment: <InputAdornment position="end" disableTypography>EUR</InputAdornment>,
              }}
              size="small"
              error={!!errors.costExtVat}
              helperText={errors.costExtVat?.message}
            />
            </Stack>
          </Box>
        </Grid>
      </Grid>
      {/* Summary Information */}
      
      {/* Submit Information */}
      <Grid item xs={12}>
        <Box sx={{ textAlign: 'center', marginTop: 3 }}>
          <LoadingButton fullWidth color="info" size="large" type="submit" variant="contained" loading={isSubmitting}>
            Submit to Add
          </LoadingButton>
        </Box>
      </Grid>
    </Grid>
        </FormProvider>
      </Container>
    </>
  );
}
