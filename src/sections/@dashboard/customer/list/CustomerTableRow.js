import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch } from 'react-redux'; // Import useDispatch
import {
  Switch,
  Button,
  Checkbox,
  TableRow,
  MenuItem,
  TableCell,
} from '@mui/material';
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
import ConfirmDialog from '../../../../components/confirm-dialog';
import { updateAdminVerified } from '../../../../redux/slices/user'; // Import the thunk

CustomerTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function CustomerTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const { id, name, email, ip , website,region } = row;
  const dispatch = useDispatch(); // Initialize dispatch

  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);
//   const [checked , setChecked] = useState(role !== "");

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

  const handleToggleVerified = () => {
    setChecked(!role)
    dispatch(updateAdminVerified(id, !role)); // Dispatch the thunk to update the status
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell align="center">{name}</TableCell>

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