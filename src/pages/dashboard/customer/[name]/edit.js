import { useEffect, useState, useMemo } from 'react';
import { paramCase } from 'change-case';

// @mui
import {
  Grid,
  Stack,
  Divider,
  TextField,
  RadioGroup,
  Autocomplete,
  Radio,
  Container,
  FormControlLabel,
  Typography,
} from '@mui/material';

// Validation schema
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { LoadingButton } from '@mui/lab';
// next
import { useRouter } from 'next/router';
// Redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { updateCustomer, getCustomers } from '../../../../redux/slices/user';

// Components
import { useSettingsContext } from '../../../../components/settings';
import FormProvider, { RHFTextField } from '../../../../components/hook-form';
// Layouts
import DashboardLayout from '../../../../layouts/dashboard';
import axios from '../../../../utils/axios';
import { useSnackbar } from '../../../../components/snackbar';

// ----------------------------------------------------------------------

SalesOrderAddPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

// Validation schema using Yup
const FormSchema = Yup.object().shape({
  company: Yup.string().required('Company Name is required'),
  // name: Yup.string()
  //   .required('Display Name is required')
  //   .min(2, 'Display Name must be at least 2 characters')
  //   .max(50, 'Display Name must not exceed 50 characters'),
  // email: Yup.string().email('Invalid email address').required('Email is required'),
  // website: Yup.string().url('Invalid website URL').required('Website is required'),
  // companyInvoice: Yup.string().required('Company Invoice Name is required'),
  // address: Yup.string().required('Invoice address is required'),
  // zipCode: Yup.string().required('ZipCode is required'),
  // city: Yup.string().required('City is required'),
  // primaryName: Yup.string().required('Name is required'),
  // primarySurname: Yup.string().required('Surname is required'),
  // primaryEmail: Yup.string().required('Email is required'),
});

export default function SalesOrderAddPage() {
  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [regions, setRegions] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [salesRegion, setSalesRegion] = useState();
  const [salesCurrency, setSalesCurrency] = useState();

  const {
    query: { name },
  } = useRouter();

  const currentCustomer = useSelector((state) =>
    state.user.customers.find((customer) => paramCase(customer.name) === name)
  );

  // Wrap defaultValues in useMemo to prevent recreation on every render
  const defaultValues = useMemo(() => ({
    address: currentCustomer?.address || '',
    city: currentCustomer?.city || '',
    company: currentCustomer?.company || '',
    companyInvoice: currentCustomer?.companyInvoice || '',
    countryCode: currentCustomer?.countryCode || '',
    defaultVatRate: currentCustomer?.defaultVatRate || '',
    email: currentCustomer?.email || '',
    facebook: currentCustomer?.facebook || '',
    inActive: currentCustomer?.inActive || false,
    linkedIn: currentCustomer?.linkedIn || '',
    name: currentCustomer?.name || '',
    phone: currentCustomer?.phone || '',
    primaryEmail: currentCustomer?.primaryEmail || '',
    primaryFacebook: currentCustomer?.primaryFacebook || '',
    primaryLinkedIn: currentCustomer?.primaryLinkedIn || '',
    primaryName: currentCustomer?.primaryName || '',
    primaryPhone: currentCustomer?.primaryPhone || '',
    primarySkype: currentCustomer?.primarySkype || '',
    primarySurname: currentCustomer?.primarySurname || '',
    primaryTwitter: currentCustomer?.primaryTwitter || '',
    salesCurrency: currentCustomer?.salesCurrency || '',
    salesRegion: currentCustomer?.salesRegion || '',
    skype: currentCustomer?.skype || '',
    state: currentCustomer?.state || '',
    taxInformation: currentCustomer?.taxInformation || '',
    twitter: currentCustomer?.twitter || '',
    website: currentCustomer?.website || '',
    zipCode: currentCustomer?.zipCode || '',
  }), [currentCustomer]);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First fetch customers from Redux
        await dispatch(getCustomers());
        
        // Then fetch regions and currencies
        const regionsResponse = await axios.get('https://restcountries.com/v3.1/all');

        // Extract regions data
        const fetchedRegions = regionsResponse.data.map((country) => ({
          name: country.name.common,
          code: country.cca2,
        }));

        // Extract unique currency codes
        const fetchedCurrencies = regionsResponse.data
          .flatMap((country) => Object.keys(country.currencies || {}))
          .filter((value, index, self) => self.indexOf(value) === index);

        setRegions(fetchedRegions);
        setCurrencies(fetchedCurrencies);

        // Set the sales region and currency from current customer
        if (currentCustomer?.salesRegion) {
          const region = fetchedRegions.find(r => r.code === currentCustomer.salesRegion.code);
          if (region) setSalesRegion(region);
        }
        if (currentCustomer?.salesCurrency) {
          setSalesCurrency(currentCustomer.salesCurrency);
        }

        // Reset form with current customer data
        reset(defaultValues);
      } catch (error) {
        console.error('Error fetching data:', error);
        enqueueSnackbar('Failed to load customer data', { variant: 'error' });
      }
    };

    fetchData();
  }, [dispatch, currentCustomer, defaultValues, reset, enqueueSnackbar]);

  const inActive = watch('inActive', false);

  const onSubmit = async (data) => {
    try {
      const updatedData = {
        ...data,
        salesRegion,
        salesCurrency,
        countryCode: salesRegion?.code,
      };

      console.log('Updated Data:', updatedData);
      await dispatch(updateCustomer(updatedData));
      enqueueSnackbar('Customer updated successfully', { variant: 'success' });
      reset(defaultValues);
    } catch (error) {
      enqueueSnackbar('Failed to update customer', { variant: 'error' });
    }
  };

  return (
    <Container maxWidth={themeStretch ? false : 'xl'}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h7" gutterBottom>
          General
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={12} md={8}>
            <Stack spacing={1}>
              <RHFTextField
                name="company"
                label="Company Name"
                InputProps={{ type: 'string' }}
                size="small"
                error={!!errors.company}
                helperText={errors.company?.message}
              />
              <RHFTextField
                name="name"
                label="Display Name"
                InputProps={{ type: 'string' }}
                size="small"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
              <RHFTextField
                name="website"
                label="Website Url"
                InputProps={{ type: 'string' }}
                size="small"
                error={!!errors.website}
                helperText={errors.website?.message}
              />
              <RHFTextField
                name="email"
                label="Email"
                InputProps={{ type: 'string' }}
                size="small"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <RHFTextField
                name="phone"
                label="Phone"
                InputProps={{ type: 'string' }}
                size="small"
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
              <RHFTextField
                name="linkedIn"
                label="LinkedIn"
                InputProps={{ type: 'string' }}
                size="small"
                error={!!errors.linkedin}
                helperText={errors.linkedin?.message}
              />
              <RHFTextField
                name="skype"
                label="Skype"
                InputProps={{ type: 'string' }}
                size="small"
                error={!!errors.skype}
                helperText={errors.skype?.message}
              />
              <RHFTextField
                name="facebook"
                label="Facebook"
                InputProps={{ type: 'string' }}
                size="small"
                error={!!errors.facebook}
                helperText={errors.facebook?.message}
              />
              <RHFTextField
                name="twitter"
                label="Twitter"
                InputProps={{ type: 'string' }}
                size="small"
                error={!!errors.twitter}
                helperText={errors.twitter?.message}
              />
            </Stack>
          </Grid>
        </Grid>
        <Typography variant="h7" gutterBottom>
          Invoice Information
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={12} md={8}>
            <Stack spacing={1}>
              <RHFTextField
                name="companyInvoice"
                label="Company Name (Invoice)"
                InputProps={{ type: 'string' }}
                size="small"
                error={!!errors.company}
                helperText={errors.company?.message}
              />
              <RHFTextField
                name="address"
                label="Address"
                InputProps={{ type: 'string' }}
                size="small"
                error={!!errors.address}
                helperText={errors.address?.message}
              />
              <RHFTextField
                name="zipCode"
                label="ZipCode"
                InputProps={{ type: 'string' }}
                size="small"
                error={!!errors.zipCode}
                helperText={errors.zipCode?.message}
              />
              <RHFTextField
                name="city"
                label="City"
                InputProps={{ type: 'string' }}
                size="small"
                error={!!errors.city}
                helperText={errors.city?.message}
              />
              <RHFTextField
                name="state"
                label="State"
                InputProps={{ type: 'string' }}
                size="small"
                error={!!errors.state}
                helperText={errors.state?.message}
              />
              <RHFTextField
                name="countryCode"
                label="CountryCode"
                InputProps={{ type: 'string' }}
                size="small"
                defaultValue="NL"
                error={!!errors.CountryCode}
                helperText={errors.CountryCode?.message}
              />
              {/* Sales Region Autocomplete */}
              <Autocomplete
                fullWidth
                options={regions || []} // Ensure fallback to an empty array
                getOptionLabel={(option) => `${option.code} - ${option.name}`}
                onChange={(event, newValue) => setSalesRegion(newValue)} // Log selected value
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField {...params} label="Sales Regions" placeholder="Select region(s)" />
                )}
              />
              <RHFTextField
                name="taxInformation"
                label="Tax Information"
                InputProps={{ type: 'string' }}
                size="small"
                defaultValue="0"
                error={!!errors.taxInformation}
                helperText={errors.taxInformation?.message}
              />
              {/* Sales Currency Autocomplete */}
              <Autocomplete
                fullWidth
                options={currencies || []} // Ensure options is always an array
                getOptionLabel={(option) => option} // Show currency code directly
                onChange={(event, newValue) => setSalesCurrency(newValue)} // Handle selection
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sales Currencies"
                    placeholder="Select currency(ies)"
                  />
                )}
              />
              <RHFTextField
                name="defaultVatRate"
                label="Default Vat Rate"
                InputProps={{ type: 'string' }}
                size="small"
                defaultValue="0"
                error={!!errors.defaultVatRate}
                helperText={errors.defaultVatRate?.message}
              />
            </Stack>
          </Grid>
        </Grid>
        <Typography variant="h7" gutterBottom>
          Primary Contact Information
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={12} md={8}>
            <Stack spacing={1}>
              <RHFTextField
                name="primaryName"
                label="Name"
                InputProps={{ type: 'string' }}
                size="small"
                error={!!errors.primaryName}
                helperText={errors.primaryName?.message}
              />
              <RHFTextField
                name="primarySurname"
                label="Surname"
                InputProps={{ type: 'string' }}
                size="small"
                error={!!errors.primarySurname}
                helperText={errors.primarySurname?.message}
              />
              <RHFTextField
                name="primaryEmail"
                label="Email"
                InputProps={{ type: 'string' }}
                size="small"
                error={!!errors.primaryEmail}
                helperText={errors.primaryEmail?.message}
              />
              <RHFTextField
                name="primaryPhone"
                label="Phone"
                InputProps={{ type: 'string' }}
                size="small"
                error={!!errors.primaryPhone}
                helperText={errors.primaryPhone?.message}
              />
              <RHFTextField
                name="primarySkype"
                label="Skype"
                InputProps={{ type: 'string' }}
                size="small"
                error={!!errors.primarySkype}
                helperText={errors.primarySkype?.message}
              />
              <RHFTextField
                name="primaryLinkedIn"
                label="LinkedIn"
                InputProps={{ type: 'string' }}
                size="small"
                error={!!errors.primaryLinkedIn}
                helperText={errors.primaryLinkedIn?.message}
              />
              <RHFTextField
                name="primaryFacebook"
                label="Facebook"
                InputProps={{ type: 'string' }}
                size="small"
                error={!!errors.primaryFacebook}
                helperText={errors.primaryFacebook?.message}
              />
              <RHFTextField
                name="primaryTwitter"
                label="Twitter"
                InputProps={{ type: 'string' }}
                size="small"
                error={!!errors.primaryTwitter}
                helperText={errors.primaryTwitter?.message}
              />
            </Stack>
          </Grid>
        </Grid>
        <Divider sx={{ mb: 2 }} />
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={12} md={8}>
            <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                In Active
              </Typography>
              <RadioGroup
                row
                value={inActive} // Bind the form value
                onChange={(event) => setValue('inActive', event.target.value === 'true')} // Update form value
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
            </Stack>
          </Grid>
        </Grid>
        {/* Submit Button */}
        <LoadingButton
          fullWidth
          color="info"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Submit to Save
        </LoadingButton>
      </FormProvider>
    </Container>
  );
}
