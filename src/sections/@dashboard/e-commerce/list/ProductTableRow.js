import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Box,
  Stack,
  Tooltip,
  TableRow,
  Checkbox,
  TableCell,
  IconButton,
  Link,
} from '@mui/material';

import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import PriceDialog from './PriceDialog';

// ----------------------------------------------------------------------

ProductTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  // onDeleteRow: PropTypes.func,
};

export default function ProductTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onViewRow,
}) {
  const { name, stock, provider, region, sku, publisher, price } = row;
  const COLORS = ['primary', 'warning', 'info', 'secondary'];
  const Status = ['generated keys', 'pending keys to generate', 'sold keys', 'sold keys pending generations'];
  const Stock = ['1', '0', '0', '0'];


  const [openDialog, setOpenDialog] = useState(false);

  const onShowPrice = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell width={300}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Link
              noWrap
              color="inherit"
              variant="subtitle2"
              onClick={() => onEditRow()}
              sx={{ cursor: 'pointer' }}
            >
              {name}
            </Link>
          </Stack>
        </TableCell>

        <TableCell align="center">
          <Box
            sx={{
              p: 1,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
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
        </TableCell>
        <TableCell align="center">{provider}</TableCell>
        <TableCell align="center">{region}</TableCell>
        <TableCell align="center">{sku}</TableCell>
        <TableCell align="center">
          <IconButton onClick={onShowPrice}>
            <Iconify icon="eva:search-fill" />
          </IconButton>                                                      
        </TableCell>
        <TableCell align="center">{publisher}</TableCell>
        <TableCell align="center">{
          price !== 0 ? <Iconify icon="icon-park-solid:success" style={{color: "green"}} /> 
          : <Iconify icon="ix:namur-failure-filled" style={{color: "red"}} /> }
        </TableCell>

        <TableCell align="center" width={50}>
          <IconButton onClick={() => onEditRow()}>
            <Iconify icon="eva:edit-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      {openDialog && ( 
        <PriceDialog row={row} onCloseDialog={handleCloseDialog} />
      )}
    </>                 
  );
}