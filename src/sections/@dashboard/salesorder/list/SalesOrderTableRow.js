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
import ConfirmDialog from '../../../../components/confirm-dialog';
import Label from '../../../../components/label';
// ----------------------------------------------------------------------

SalesOrderTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function SalesOrderTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onDeleteRow,
  onViewRow,
}) {
  const { id, customer, product, salesIncVat, processQuantity, totalQuantity,totalPrice, createdOn, status, N_A } = row;

  const [openConfirm, setOpenConfirm] = useState(false);

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
        <TableCell align="center">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Link
              noWrap
              color="inherit"
              variant="subtitle2"
              onClick={onViewRow}
              sx={{ cursor: 'pointer' }}
            >
              {id}
            </Link>
          </Stack>
        </TableCell>
        <TableCell align="center">{customer.name}</TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <p>{product.name}</p>
          </Stack>
        </TableCell>

        <TableCell align="center">{salesIncVat}</TableCell>
        <TableCell align="center"><Label color="info">{processQuantity} / {totalQuantity}</Label></TableCell>
        <TableCell align="center">{totalPrice}</TableCell>
        <TableCell align="center">{createdOn}</TableCell>
        <TableCell align="center">                
          <Label color="primary">{status}</Label>
        </TableCell>
        <TableCell align="center">{N_A}</TableCell>
        <TableCell align="center" width={50}>
          <IconButton  onClick={() => {
            handleOpenConfirm();
            // handleClosePopover();
          }}>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

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
      />
    </>
  );
}
