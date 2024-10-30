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
import ConfirmDialog from 'src/components/confirm-dialog';
import { CustomAvatar } from 'src/components/custom-avatar';
import Label from 'src/components/label';
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
  const { NUMBER, CUSTOMER, PRODUCT, DETAILED, PRICE, QUANTITY, TOTAL, CREATEDON, STATUS, N_A } = row;

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
              {NUMBER}
            </Link>
          </Stack>
        </TableCell>
        <TableCell align="center">{CUSTOMER}</TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Link
              noWrap
              color="inherit"
              variant="subtitle2"
              // onClick={onViewRow}
              sx={{ cursor: 'pointer' }}
            >
              <p>{PRODUCT}</p>
            </Link>
          </Stack>
        </TableCell>

        <TableCell align="right">{PRICE}</TableCell>
        <TableCell align="center">{QUANTITY}</TableCell>
        <TableCell align="center">{TOTAL}</TableCell>
        <TableCell align="center">{CREATEDON}</TableCell>
        <TableCell align="center">
          {(() => {
            const color = (STATUS == "Processing" ? "info" : "success");
            return <Label color={color} variant="filled">{STATUS}</Label>;
          })()}
        </TableCell>
        <TableCell align="center">{N_A}</TableCell>
        <TableCell align="center" width={50}>
          <IconButton  onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
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
