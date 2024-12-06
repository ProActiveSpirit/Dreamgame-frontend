import PropTypes from 'prop-types';
import { useState } from 'react';

// @mui
import {
  Stack,
  TableRow,
  Checkbox,
  TableCell,
  IconButton,
  MenuItem,
  Link,
  Button
} from '@mui/material';
// components
import Iconify from '../../../../components/iconify';
import ConfirmDialog from '../../../../components/confirm-dialog';
import Label from '../../../../components/label';
import MenuPopover from '../../../../components/menu-popover';

// ----------------------------------------------------------------------

SalesOrderTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
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

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
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
        <TableCell align="center">{customer}</TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <p>{product}</p>
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
        <TableCell align="right">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >

        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </MenuPopover>

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
