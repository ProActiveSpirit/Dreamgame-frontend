import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
// next
import { useRouter } from 'next/router';
// @mui
import { Tab, Card, Tabs, Container, Box } from '@mui/material';
// redux
import { useDispatch, useSelector } from 'src/redux/store';
import { getProducts } from 'src/redux/slices/product';
// routes
import { PATH_DASHBOARD } from 'src/routes/paths';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// sections
import {
  ProductInformation,
  ProductSalesOrder,
  ProductPurchaseOrder,
} from '../detailed';
//_mock
import {
  _userAbout,
  _userFeeds,
  _userFriends,
  _userGallery,
  _userFollowers,
} from 'src/_mock/arrays';
// ----------------------------------------------------------------------

SalesOrderEditPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function SalesOrderEditPage() {
  const { themeStretch } = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('Product Information');

  const dispatch = useDispatch();


  const {
    query: { name },
  } = useRouter();

  const currentProduct = useSelector((state) =>
    state.product.products.find((product) => paramCase(product.name) === name)
  );

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const TABS = [
    {
      value: 'Product Information',
      label: 'Product Information',
      component: <ProductInformation />,
    },
    {
      value: 'Sales Orders',
      label: 'Sales Orders',
      component: <ProductSalesOrder />,
    },
    {
      value: 'Purchase Orders',
      label: 'Purchase Orders',
      component: (
        <ProductPurchaseOrder />
      ),
    }
  ];

  return (
    <>
      <Container maxWidth={themeStretch ? 'lg' : false}>
        <CustomBreadcrumbs
          heading="Edit Sales Order"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Sales Order',
              href: PATH_DASHBOARD.sa,
            },
            { name: currentProduct?.name },
          ]}
        />
        <Card
          sx={{
            mb: 3,
            height: 50,
            position: 'relative',
          }}
        >
          <Tabs
            value={currentTab}
            onChange={(event, newValue) => setCurrentTab(newValue)}
            sx={{
              width: 1,
              zIndex: 9,
              position: 'absolute',
              bgcolor: 'background.paper',
              '& .MuiTabs-flexContainer': {
                pl: { md: 3 },
                justifyContent: {
                  sm: 'center',
                  md: 'flex-start',
                },
              },
            }}
          >
            {TABS.map((tab) => (
              <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
            ))}
          </Tabs>
        </Card>

        {TABS.map(
          (tab) => tab.value === currentTab && <Box key={tab.value}> {tab.component} </Box>
        )}
      </Container>
    </>
  );
}
