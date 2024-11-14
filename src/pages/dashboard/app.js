import { useState } from 'react';

// next
import Head from 'next/head';
// @mui
import { useTheme , styled} from '@mui/material/styles';
import { Container, Grid, Button,Collapse,  Paper, Card, Typography, Stack, List, ListItemText, ListItemIcon, ListItemButton} from '@mui/material';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// utils
import { fCurrency } from '../../utils/formatNumber';
// layouts
import DashboardLayout from '../../layouts/dashboard';
// components
import { useSettingsContext } from '../../components/settings';
import Iconify from '../../components/iconify';
import {
  AnalyticsWidgetSummary,
} from '../../sections/@dashboard/general/analytics';
// sections
import {
  AppAreaInstalled,
  AppWidgetSummary,
} from '../../sections/@dashboard/general/app';

// ----------------------------------------------------------------------

const StyledListContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  border: `solid 1px ${theme.palette.divider}`,
}));

function ListItemLink(props) {
  return <ListItemButton component="a" {...props} />;
}

// ----------------------------------------------------------------------

GeneralAppPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function GeneralAppPage() {
  const theme = useTheme();

  const [stopOpen, setStopOpen] = useState(true);
  const [errorOpen, setErrorOpen] = useState(true);

  const handleStopClick = () => {
    setStopOpen(!stopOpen);
  };

  const handleErrorClick = () => {
    setErrorOpen(!errorOpen);
  };

  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Head>
        <title> General: App | Minimal UI</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3}} >
              <Typography variant="subtitle2" gutterBottom>
                SALES SATISTICS
              </Typography>

              <Stack spacing={2}>
                {/* <Typography variant="h3">{fCurrency(62462462)}</Typography> */}
                <Stack direction="row" justifyContent="space-between">
                  <Stack justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Today
                    </Typography>
                    &nbsp;
                    <Typography variant="body2">{fCurrency(625)}</Typography>
                  </Stack>
  
                  <Stack  justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Yesterday
                    </Typography>
                    {/* &nbsp; */}
                    <Typography variant="body2">- {fCurrency(63)}</Typography>
                  </Stack>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Stack justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      This month
                    </Typography>
                    {/* &nbsp; */}
                    <Typography variant="subtitle1">{fCurrency(23434)}</Typography>
                  </Stack>

                  <Stack justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Last month
                    </Typography>
                    &nbsp;
                    <Typography variant="subtitle1">{fCurrency(8345)}</Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              style={{height: "100%"}}
              title="Stock Value"
              percent={0.2}
              total={7235}
              chart={{
                colors: [theme.palette.info.main],
                series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              style={{height: "100%"}}
              title="Pending Stock Cost"
              percent={-0.1}
              total={678}
              chart={{
                colors: [theme.palette.warning.main],
                series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            {/* <AppWidgetSummary
              title="Stopped Purchase Orders"
              percent={-0.1}
              total={678}
              chart={{
                colors: [theme.palette.warning.main],
                series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
              }}
            /> */}
            <StyledListContainer>
              <List
                component="nav"
                aria-labelledby="nested-list-subheader"
              >
                <ListItemButton onClick={handleStopClick}  >
                  <ListItemText primary="Stopped Purchase Orders (4)" style={{color :"red"}}  />
                  <ListItemText primary="Date" style={{ textAlign: "center" }} />
                  {stopOpen ? (
                    <Iconify icon="ic:round-expand-less" width={24} />
                  ) : (
                    <Iconify icon="ic:round-expand-more" width={24} />
                  )}
                </ListItemButton>
                <Collapse in={stopOpen} unmountOnExit>
                  <List component="div" disablePadding > 
                    <ListItemButton>
                      <ListItemText primary="The Legend of Zelda: Skyward Sword HD (SE)" />
                      <ListItemText primary="13.11.2024 14:08" />
                    </ListItemButton>
                    <ListItemButton>
                      <ListItemText primary="The Legend of Zelda: Skyward Sword HD (PL)" />
                      <ListItemText primary="13.11.2024 14:08" />
                    </ListItemButton>
                    <ListItemButton>
                      <ListItemText primary="The Legend of Zelda: Skyward Sword HD (DE)" />
                      <ListItemText primary="13.11.2024 14:08" />
                    </ListItemButton>
                    <ListItemButton>
                      <ListItemText primary="The Legend of Zelda: Skyward Sword HD (NL)" />
                      <ListItemText primary="13.11.2024 14:08" />
                    </ListItemButton>
                  </List>
                </Collapse>
              </List>
            </StyledListContainer>
          </Grid>

          <Grid item xs={12} md={6}>
            {/* <AppWidgetSummary
              title="Purchase orders with api error"
              percent={-0.1}
              total={678}
              chart={{
                colors: [theme.palette.warning.main],
                series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
              }}
            /> */}
                        <StyledListContainer>
              <List
                component="nav"
                aria-labelledby="nested-list-subheader"
              >
                <ListItemButton onClick={handleErrorClick} style={{ textAlign: "center" }}>
                  <ListItemText primary="Purchase orders with api error (0)" style={{color :"red"}} />
                  <ListItemText primary="Date"  />
                  {errorOpen ? (
                    <Iconify icon="ic:round-expand-less" width={24} />
                  ) : (
                    <Iconify icon="ic:round-expand-more" width={24} />
                  )}
                </ListItemButton>
                <Collapse in={errorOpen} unmountOnExit>
                  <List component="div" disablePadding>
                    {/* <ListItemButton>
                      <ListItemText primary="The Legend of Zelda: Skyward Sword HD (SE)" />
                      <ListItemText primary="13.11.2024 14:08" />
                    </ListItemButton>
                    <ListItemButton>
                      <ListItemText primary="The Legend of Zelda: Skyward Sword HD (PL)" />
                      <ListItemText primary="13.11.2024 14:08" />
                    </ListItemButton>
                    <ListItemButton>
                      <ListItemText primary="The Legend of Zelda: Skyward Sword HD (DE)" />
                      <ListItemText primary="13.11.2024 14:08" />
                    </ListItemButton>
                    <ListItemButton>
                      <ListItemText primary="The Legend of Zelda: Skyward Sword HD (NL)" />
                      <ListItemText primary="13.11.2024 14:08" />
                    </ListItemButton> */}
                  </List>
                </Collapse>
              </List>
            </StyledListContainer>
          </Grid>

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppCurrentDownload
              title="Current Download"
              chart={{
                colors: [
                  theme.palette.primary.main,
                  theme.palette.info.main,
                  theme.palette.error.main,
                  theme.palette.warning.main,
                ],
                series: [
                  { label: 'Mac', value: 12244 },
                  { label: 'Window', value: 53345 },
                  { label: 'iOS', value: 44313 },
                  { label: 'Android', value: 78343 },
                ],
              }}
            />
          </Grid> */}

          <Grid item xs={12} md={12} lg={12}>
            <AppAreaInstalled
              title="SALES SATISTICS"
              // subheader="(+43%) than last year"
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                series: [
                  {
                    year: '2023',
                    data: [
                      { name: 'Asia', data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 153, 162, 171] },
                    ],
                  },
                  {
                    year: '2024',
                    data: [
                      { name: 'Asia', data: [171, 162, 153, 148, 91, 69, 62, 49, 51, 35, 41, 10] },
                    ],
                  },
                ],
              }}
            />
          </Grid>

          {/* <Grid item xs={12} lg={8}>
            <AppNewInvoice
              title="New Invoice"
              tableData={_appInvoices}
              tableLabels={[
                { id: 'id', label: 'Invoice ID' },
                { id: 'category', label: 'Category' },
                { id: 'price', label: 'Price' },
                { id: 'status', label: 'Status' },
                { id: '' },
              ]}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppTopRelated title="Top Related Applications" list={_appRelated} />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTopInstalledCountries title="Top Installed Countries" list={_appInstalled} />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTopAuthors title="Top Authors" list={_appAuthors} />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <Stack spacing={3}>
              <AppWidget
                title="Conversion"
                total={38566}
                icon="eva:person-fill"
                chart={{
                  series: 48,
                }}
              />

              <AppWidget
                title="Applications"
                total={55566}
                icon="eva:email-fill"
                color="info"
                chart={{
                  series: 75,
                }}
              />
            </Stack>
          </Grid> */}
        </Grid>
      </Container>
    </>
  );
}
