import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
// next
import { useRouter } from 'next/router';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Masonry, LoadingButton } from '@mui/lab'; // Combined single import from @mui/lab
import {
  Box,
  Radio,
  TextField,
  Stack,
  RadioGroup,
  FormControlLabel,
  Container,
  Autocomplete,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import Iconify from '../../../components/iconify';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/label';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider from '../../../components/hook-form';

// ----------------------------------------------------------------------

const GENDER_OPTION = [
  { label: 'Men', value: 'Men' },
  { label: 'Women', value: 'Women' },
  { label: 'Kids', value: 'Kids' },
];

const CATEGORY_OPTION = [
  { group: 'Clothing', classify: ['Shirts', 'T-shirts', 'Jeans', 'Leather'] },
  { group: 'Tailored', classify: ['Suits', 'Blazers', 'Trousers', 'Waistcoats'] },
  { group: 'Accessories', classify: ['Shoes', 'Backpacks and bags', 'Bracelets', 'Face masks'] },
];

const TAGS_OPTION = [
  'Toy Story 3',
  'Logan',
  'Full Metal Jacket',
  'Dangal',
  'The Sting',
  '2001: A Space Odyssey',
  "Singin' in the Rain",
  'Toy Story',
  'Bicycle Thieves',
  'The Kid',
  'Inglourious Basterds',
  'Snatch',
  '3 Idiots',
];

// ----------------------------------------------------------------------

ProductNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
};

export default function ProductNewEditForm({ isEdit, currentProduct }) {
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const Status = ['Generated keys', 'Pending keys to generate', 'Sold keys', 'Sold keys pending generate'];
  const VatPrice = ['Cost-EUR', 'Cost Vat', 'Sales Exc Vat', 'Sales Exc Vat'];

  const CONTINENTS = [
    'All',
    'Africa',
    'Asia',
    'Europe',
    'Australia',
    'North America',
    'South America',
  ];

  const EUROPEAN_COUNTRIES = [
  'Belgium ( BE  )',
  'Denmark ( DK  )',
  'Estonia ( EE  )',
  'Finland ( FI  )',
  'France ( FR  )',
  'Germany ( DE  )',
  'Greece ( GR  )',
  'Ireland ( IE  )',
  'Italy ( IT  )',
  'Luxembourg ( LU  )',
  'Netherlands ( NL  )',
  'North Macedonia ( MK  )',
  'Norway ( NO  )',
  'Poland ( PL  )',
  'Portugal ( PT  )',
  'Romania ( RO  )',
  'Spain ( ES  )',
  'Sweden ( SE  )',
  'Switzerland ( CH  )',
  'Ukraine ( UA  )',
  'United Kingdom ( GB  )',
  ];

  const REGION_OPTIONS = [
    {
      group: 'Continents',
      options: CONTINENTS.map(continent => ({ 
        label: continent, 
        value: continent,
        group: 'Continents' 
      }))
    },
    {
      group: 'European Countries',
      options: EUROPEAN_COUNTRIES.map(country => ({ 
        label: country, 
        value: country,
        group: 'European Countries'
      }))
    }
  ];
  

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    images: Yup.array().min(1, 'Images is required'),
    tags: Yup.array().min(2, 'Must have at least 2 tags'),
    price: Yup.number().moreThan(0, 'Price should not be $0.00'),
    description: Yup.string().required('Description is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      description: currentProduct?.description || '',
      images: currentProduct?.images || [],
      code: currentProduct?.code || '',
      sku: currentProduct?.sku || '',
      price: currentProduct?.price || 0,
      priceSale: currentProduct?.priceSale || 0,
      tags: currentProduct?.tags || [TAGS_OPTION[0]],
      inStock: true,
      taxes: true,
      gender: currentProduct?.gender || GENDER_OPTION[2].value,
      category: currentProduct?.category || CATEGORY_OPTION[0].classify[1],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentProduct) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentProduct]);

  const [skuRegions, setSkuRegions] = useState([
    { id: 1, sku: '', region: null }
  ]);

  const handleAddSkuRegion = () => {
    setSkuRegions([
      ...skuRegions,
      { id: skuRegions.length + 1, sku: '', region: null }
    ]);
  };

  const handleRemoveSkuRegion = (id) => {
    setSkuRegions(skuRegions.filter(item => item.id !== id));
  };

  const handleSkuRegionChange = (id, field, value) => {
    setSkuRegions(skuRegions.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const onSubmit = async (data) => {
    try {
      const isValidSkuRegions = skuRegions.every(item => 
        item.sku && item.region
      );

      if (!isValidSkuRegions) {
        enqueueSnackbar('Please fill in all SKU and Region fields', { variant: 'error' });
        return;
      }

      const submitData = {
        ...data,
        skuRegions: skuRegions.map(item => ({
          sku: item.sku,
          region: item.region.value,
          regionName: item.region.label
        }))
      };

      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      push(PATH_DASHBOARD.eCommerce.list);
      console.log('DATA', submitData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const files = values.images || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('images', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.images]
  );

  const handleRemoveFile = (inputFile) => {
    const filtered = values.images && values.images?.filter((file) => file !== inputFile);
    setValue('images', filtered);
  };

  const handleRemoveAllFiles = () => {
    setValue('images', []);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Container >
        <Masonry columns={{ xs: 1 }} spacing={4}>
          <TextField
            variant="outlined"
            required
            label="Name"
            size="small"
          />
          <Stack spacing={1} direction="row" alignItems="center">
            {Status.map((State) => (
              <TextField
                key={State} // Added key to avoid React warning
                variant="outlined"
                required
                label={State}
                size="small"
                defaultValue="0"
              />
            ))}
          </Stack>
          <Stack spacing={1} direction="row" alignItems="center">
            {VatPrice.map((Price) => (
              <TextField
                key={Price} // Added key to avoid React warning
                variant="outlined"
                required
                label={Price}
                size="small"
                defaultValue="0"
              />
            ))}
          </Stack>
          <TextField
            variant="outlined"
            required
            fullWidth
            label="Provider"
            size="small"
            defaultValue=""
          />
          <Box sx={{ width: '100%' }}>
            <Stack 
              direction="row" 
              justifyContent="space-between" 
              alignItems="center" 
              sx={{ mb: 2 }}
            >
              <Typography variant="subtitle1">SKU and Region Mapping</Typography>
              <Button
                size="small"
                startIcon={<Iconify icon="eva:plus-fill" width={20} height={20} />}
                onClick={handleAddSkuRegion}
              >
                Add SKU-Region
              </Button>
            </Stack>

            {skuRegions.map((item) => (
              <Stack 
                key={item.id} 
                direction="row" 
                spacing={2} 
                sx={{ mb: 2 }}
                alignItems="center"
              >
                <TextField
                  variant="outlined"
                  required
                  size="small"
                  label="SKU"
                  value={item.sku}
                  onChange={(e) => handleSkuRegionChange(item.id, 'sku', e.target.value)}
                  sx={{ width: '40%' }}
                />

                <Autocomplete
                  value={item.region}
                  onChange={(event, newValue) => 
                    handleSkuRegionChange(item.id, 'region', newValue)
                  }
                  options={[...REGION_OPTIONS[0].options, ...REGION_OPTIONS[1].options]}
                  groupBy={(option) => option.group}
                  getOptionLabel={(option) => option?.label || ''}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Region"
                      required
                      size="small"
                      variant="outlined"
                    />
                  )}
                  sx={{ width: '50%' }}
                  renderGroup={(params) => (
                    <Box key={params.key}>
                      <Typography
                        variant="subtitle2"
                        sx={{ 
                          p: 1, 
                          fontWeight: 'bold', 
                          color: 'text.secondary',
                          backgroundColor: 'background.neutral'
                        }}
                      >
                        {params.group}
                      </Typography>
                      {params.children}
                    </Box>
                  )}
                />

                <IconButton 
                  onClick={() => handleRemoveSkuRegion(item.id)}
                  disabled={skuRegions.length === 1}
                >
                  <Iconify icon="eva:trash-2-outline" width={20} height={20} />
                </IconButton>
              </Stack>
            ))}
          </Box>
          <TextField
            variant="outlined"
            required
            fullWidth
            label="Publisher"
            size="small"
            defaultValue="Activision"
          />
          <Box
            sx={{
              p: 1,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'left',
              justifyContent: 'left',
              '& > *': { mx: 2 },
            }}
          >
            <RadioGroup row defaultValue="g" label="Status">
              <FormControlLabel value="g" control={<Radio />} label="Yes" />
              <FormControlLabel value="p" control={<Radio size="small" />} label="No" />
            </RadioGroup>
          </Box>

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
        </Masonry>
      </Container>
    </FormProvider>
  );
}