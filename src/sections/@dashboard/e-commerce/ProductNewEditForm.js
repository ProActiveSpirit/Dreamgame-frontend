import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
// next
import { useRouter } from 'next/router';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Masonry } from '@mui/lab'; // Ensure this import is correct based on the version you're using
import { Box, Radio, TextField, Stack, RadioGroup, FormControlLabel, Container,Button } from '@mui/material';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { LoadingButton } from '@mui/lab';
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

  const onSubmit = async (data) => {
    try {
    console.log('DATA', data); // Debug the form data

      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      push(PATH_DASHBOARD.eCommerce.list);
      console.log('DATA', data);
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
      <Container maxWidth='md'>
        <Masonry columns={{ xs: 1 }} spacing={4}>
          <TextField     
            variant="outlined"
            required
            label="Name"
            size="small"
            // defaultValue="13000 CALL OF DUTY POINTS (MV IIII, MIW II, Warzone) - [XBOX Series X|S /XBOX One]"
          />
          <Stack spacing={1} direction="row" alignItems="center" sx="xl">
            {Status.map((State) => (
               <TextField     
                variant="outlined"
                required
                label={State}
                size="small"
                defaultValue="0"
             />
            ))}
          </Stack>
          <Stack spacing={1} direction="row" alignItems="center" sx="xl">
            {VatPrice.map((Price) => (
               <TextField     
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
          <TextField
            variant="outlined"
            required
            fullWidth
            label="Sku"
            size="small"
            defaultValue="8806188752425"
          />
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
            <RadioGroup row defaultValue="g" label="Status" >
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
