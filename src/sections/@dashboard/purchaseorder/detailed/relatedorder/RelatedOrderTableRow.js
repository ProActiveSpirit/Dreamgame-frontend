import PropTypes from 'prop-types';
import { useState } from 'react';

// @mui
import {
  Stack,
  TableRow,
  TableCell,
  Link,
} from '@mui/material';
// components
import Iconify from '../../../../../components/iconify';
import Label from '../../../../../components/label';
// ----------------------------------------------------------------------

RelatedOrderTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function RelatedOrderTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onDeleteRow,
  onViewRow,
}) {
  const { NUMBER, PRODUCT, DETAILED, PROVIDER, REGION, INCVAT, QUANTITY, STOCKING, TOTALINCVAT, JOB, STATUS,  DATE} = row;

  // const [openConfirm, setOpenConfirm] = useState(false);

  return (
    <>
      <TableRow hover selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}
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
        <TableCell align="right">{PROVIDER}</TableCell>
        <TableCell align="center">{REGION}</TableCell>
        <TableCell align="center">{INCVAT}</TableCell>
        <TableCell align="center">{QUANTITY}</TableCell>
        <TableCell align="center">{STOCKING}</TableCell>
        <TableCell align="center">{TOTALINCVAT}</TableCell>
        <TableCell align="center">
          {(() => {
            const icon = JOB === "true" ? "eva:checkmark-circle-2-fill" : "eva:checkmark-circle-2-fill";
            return   <Iconify icon={icon} sx={{ color: 'primary.main' }} />
          })()}
        </TableCell>
        <TableCell align="center">
          {(() => {
            const color = (STATUS === "Processing" ? "info" : "success");
            return <Label color={color} variant="filled">{STATUS}</Label>;
          })()}
        </TableCell>
        <TableCell align="center">{DATE}</TableCell>
      </TableRow>

      {/* <ConfirmDialog
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
    </>
  );
}
