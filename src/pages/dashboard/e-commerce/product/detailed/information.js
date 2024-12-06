import { useEffect } from 'react';
import { paramCase } from 'change-case';
// @mui
import { Box, Radio, TextField, Tooltip, RadioGroup, FormControlLabel, Container, Button } from '@mui/material';
import { Masonry } from '@mui/lab'; // Ensure this import is correct based on the version you're using
// next
import { useRouter } from 'next/router';
// component
import Label from '../../../../../components/label';
import Iconify from '../../../../../components/iconify';
import RegionPrice from './regionPrice';
// redux
import { useSelector } from '../../../../../redux/store';

export default function ProductInformation() {
  const COLORS = ['primary', 'warning', 'info', 'secondary'];
  const Status = ['generated keys', 'pending keys to generate', 'sold keys', 'sold keys pending generations'];

  const {
    query: { name },
  } = useRouter();

  const products = useSelector((state) => state.product.products);

  // Ensure `name` and `products` are available before proceeding
  if (!name) {
    console.log('Waiting for name to load...');
    return <p>Loading product details...</p>; // Show a loading state while name is undefined
  }

  if (!products || products.length === 0) {
    console.log('Products are still loading...');
    return <p>Loading products...</p>; // Show a loading state while products are being fetched
  }

  // Find the current product
  const currentProduct = products.find((product) => paramCase(product.sku) === name);

  if (!currentProduct) {
    console.log('Product not found in the list of products:', products);
    return <p>Product not found.</p>; // Handle the case when the product is not found
  }

  console.log('Current Product:', currentProduct);

  return (
    <>
      <Button
        variant="contained"
        color="info"
        startIcon={<Iconify icon="eva:edit-fill" />}
      >
        Edit Product
      </Button>
      <Button
        variant="contained"
        color="error"
        startIcon={<Iconify icon="eos-icons:arrow-rotate" />}
      >
        Get Processing Orders
      </Button>
      <Container maxWidth="md">
        <Masonry columns={{ xs: 1 }} spacing={4}>
          <TextField
            variant="outlined"
            required
            label="Name"
            size="small"
            defaultValue={currentProduct?.name}
          />
          <Box
            sx={{
              p: 1,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'left',
              justifyContent: 'left',
              '& > *': { mx: 0.5 },
            }}
          >
            {COLORS.map((color, index) => (
              <Tooltip key={color} title={Status[index]}>
                <Label color={color} variant="filled">
                  {currentProduct.stock[index]}
                </Label>
              </Tooltip>
            ))}
          </Box>
          <TextField
            variant="outlined"
            required
            fullWidth
            label="Provider"
            size="small"
            defaultValue={currentProduct?.provider}
          />
          <TextField
            variant="outlined"
            required
            fullWidth
            label="Sku"
            size="small"
            defaultValue={currentProduct?.sku}
          />
          <TextField
            variant="outlined"
            required
            fullWidth
            label="Publisher"
            size="small"
            defaultValue={currentProduct?.publisher}
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
            <RadioGroup row defaultValue="g">
              <FormControlLabel value="g" control={<Radio />} label="Yes" />
              <FormControlLabel value="p" control={<Radio size="small" />} label="No" />
            </RadioGroup>
          </Box>
        </Masonry>
      </Container>
      <RegionPrice price={currentProduct.price} SalesVat={0} />
      {/* {currentProduct?.provider == "Nexway" && <ExtendPrice />} */}
    </>
  );
}