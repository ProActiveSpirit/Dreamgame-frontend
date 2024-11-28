import PropTypes from 'prop-types';
import { useState } from 'react';

// @mui
import {
  Stack,
  TableRow,
  Checkbox,
  TableCell,
  IconButton,
  Link,
  Button
} from '@mui/material';
// components

import Iconify from '../../../../components/iconify';
import Label from '../../../../components/label';
// import ConfirmDialog from '../../../../components/confirm-dialog';
import PriceDialog from '../list/PriceDialog';
// ----------------------------------------------------------------------

StockTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function StockTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onDeleteRow,
  onViewRow,
}) {
  const { name, STOCK, provider, region, sku, STATUS, price } = row;

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);

  const onShowPrice = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
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
              onClick={onViewRow}
              sx={{ cursor: 'pointer' }}
            >
              {name}
            </Link>
          </Stack>
        </TableCell>
        <TableCell align="center">
          <Label color="primary" variant="filled">{1}</Label>
        </TableCell>
        <TableCell align="center">{price}</TableCell>
        <TableCell align="center">{price}</TableCell>
        <TableCell align="center">{provider}</TableCell>
        <TableCell align="center">{region}</TableCell>
        <TableCell align="center">{sku}</TableCell>
        <TableCell align="center">
          <IconButton onClick={onShowPrice} >
            <Iconify icon="eva:search-fill" />
          </IconButton>
        </TableCell>
        <TableCell align="center">
          <Iconify icon="icon-park-solid:success" style={{color: "green"}} />
        </TableCell>
      {/*
        <TableCell align="center" width={50}>
          <IconButton  onClick={() => {
            handleOpenConfirm();
          }}>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </TableCell> */}
      </TableRow>
      {/* 
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"  
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      /> */}
       {openDialog && ( 
        <PriceDialog row={row} onCloseDialog={handleCloseDialog} />
      )}
    </>
  );
}
