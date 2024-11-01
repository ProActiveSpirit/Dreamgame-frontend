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
import ConfirmDialog from '../../../../components/confirm-dialog';
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
  const { NAME, STOCK, COST, PROVIDER, REGION, SKU, STATUS } = row;

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

        <TableCell width={300}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Link
              noWrap
              color="inherit"
              variant="subtitle2"
              onClick={onViewRow}
              sx={{ cursor: 'pointer' }}
            >
              {NAME}
            </Link>
          </Stack>
        </TableCell>

        <TableCell align="center">
          {<Label color={"primary"} variant="filled">{STOCK}</Label>}
        </TableCell>
        <TableCell align="center">{COST}</TableCell>
        <TableCell align="center">{PROVIDER}</TableCell>
        <TableCell align="center">{REGION}</TableCell>
        <TableCell align="center">{SKU}</TableCell>
        <TableCell align="center"></TableCell>
        <TableCell align="center">
          {(() => {
            const icon = STATUS === "true" ? "eva:checkmark-circle-2-fill" : "eva:checkmark-circle-2-fill";
            return   <Iconify icon={icon} sx={{ color: 'primary.main' }} />
          })()}
        </TableCell>

        <TableCell align="center" width={50}>
          <IconButton  onClick={() => {
            handleOpenConfirm();
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
