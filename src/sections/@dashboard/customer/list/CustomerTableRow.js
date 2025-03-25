import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link, Button, Checkbox, TableRow, MenuItem, TableCell, IconButton } from '@mui/material';
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
import ConfirmDialog from '../../../../components/confirm-dialog';

CustomerTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function CustomerTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const { id, name = '', email = '', ip = '', website = '', region = '' } = row || {};

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
          <Link
            noWrap
            color="inherit"
            variant="subtitle2"
            onClick={() => onEditRow()}
            sx={{ cursor: 'pointer' }}
          >
            {name}
          </Link>
        </TableCell>

        <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
          {email}
        </TableCell>
        <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
          {website}
        </TableCell>
        <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
          {ip}
        </TableCell>
        <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
          {region}
        </TableCell>
        <TableCell align="center" width={10}>
          <IconButton onClick={() => onEditRow()}>
            <Iconify icon="eva:edit-fill" />
          </IconButton>
        </TableCell>
        <TableCell align="center" width={10}>
          <IconButton onClick={() => onDeleteRow()}>
            <Iconify icon="eva:trash-2-outline" />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
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

        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
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
