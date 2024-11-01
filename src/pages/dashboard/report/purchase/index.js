import PropTypes from 'prop-types';
// @mui
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
// components
import Iconify from 'src/components/iconify';
// _mock_
import _mock, { randomInArray } from 'src/_mock';
// next
import Head from 'next/head';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// _mock_
import { _analyticPost, _analyticOrderTimeline, _analyticTraffic } from 'src/_mock/arrays';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// routes
import { PATH_DASHBOARD } from 'src/routes/paths';

// ----------------------------------------------------------------------

GeneralReportPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function GeneralReportPage() {
  const theme = useTheme();

  const columns = [
    {
      field: 'NUMBER',
      headerName: 'NUMBER',
      width: 420,
    },
    {
      field: 'SKU',
      headerName: 'SKU',
      width: 360,
      editable: true,
    },
    {
      field: 'SOLDCOUNT',
      headerName: 'SOLDCOUNT',
      width: 160,
      editable: true,
    },
    {
      field: 'CREATEDON',
      headerName: 'CREATED ON',
      width: 160,
      editable: true,
    }
  ];

  const _dataGrid = [...Array(36)].map((_, index) => ({
    id: _mock.id(index),
    NUMBER: _mock.id(index),
    SKU: _mock.id(index),
    SOLDCOUNT: _mock.number.age(index),
    CREATEDON: _mock.time(index)
  }));

  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
            heading="Reports"
            links={[
                { name: 'Dashboard', href: PATH_DASHBOARD.root },
                {
                name: 'Reports',
                href: PATH_DASHBOARD.salesorder.list,
                },
                { name: 'BestSeller' },
            ]}
        />
        <DataGrid columns={columns} rows={_dataGrid} checkboxSelection disableSelectionOnClick style={{height: 700}} />
      </Container>
    </>
  );
}
