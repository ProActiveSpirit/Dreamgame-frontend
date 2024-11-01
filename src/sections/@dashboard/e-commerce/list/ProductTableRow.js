import PropTypes from 'prop-types';
// @mui
import {
  Stack,
  TableRow,
  Checkbox,
  TableCell,
  IconButton,
  Link,
} from '@mui/material';
// components
import Iconify from '../../../../components/iconify';

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
  const { name, stock, provider, region, sku, publisher, status } = row;

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

        <TableCell align="center">{stock}</TableCell>
        <TableCell align="center">{provider}</TableCell>
        <TableCell align="center">{region}</TableCell>
        <TableCell align="center">{sku}</TableCell>
        <TableCell align="center">{publisher}</TableCell>
        <TableCell align="center">{status}</TableCell>

        <TableCell align="center"  width={50}>
          <IconButton onClick={() => onEditRow()}>
            <Iconify icon="eva:edit-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  );
}
