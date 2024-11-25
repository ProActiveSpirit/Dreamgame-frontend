// @mui
import { Box, Radio, TextField, Tooltip, RadioGroup, FormControlLabel, Container,Button } from '@mui/material';
import { Masonry } from '@mui/lab'; // Ensure this import is correct based on the version you're using

import Label from '../../../../../components/label';
import Iconify from '../../../../../components/iconify';
import ExtendPrice from './extprice';

export default function ProductInformation() { // Correctly destructure the variant prop
  const COLORS = ['primary', 'warning', 'info', 'secondary'];
  const Stock = ['1', '0', '0', '1'];
  const Status = ['generated keys', 'pending keys to generate', 'sold keys', 'sold keys pending generations'];

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
      <Container maxWidth='md'>
        <Masonry columns={{ xs: 1 }} spacing={4}>
          <TextField     
            variant="outlined"
            required
            label="Name"
            size="small"
            defaultValue="13000 CALL OF DUTY POINTS (MV IIII, MIW II, Warzone) - [XBOX Series X|S /XBOX One]"
          />
          <Box
            sx={{
              p: 1,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'left',
              justicfyContent: 'left',
              '& > *': { mx: 0.5 },
            }}
          >
            {COLORS.map((color, index) => (
              <Tooltip key={color} title={Status[index]}>
                <Label color={color} variant="filled">
                  {Stock[index]}
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
          <TextField
            variant="outlined"
            required
            fullWidth
            label="Provider Status"
            size="small"
            defaultValue=""
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
      <ExtendPrice />
    </>
  );
}