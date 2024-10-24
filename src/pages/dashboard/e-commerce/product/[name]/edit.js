import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
// next
import Head from 'next/head';
import { useRouter } from 'next/router';
// @mui
import { Tab, Card, Tabs, Container, Box } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../../../redux/store';
import { getProducts } from '../../../../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../../../../routes/paths';
// layouts
import DashboardLayout from '../../../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../../../components/settings';
import CustomBreadcrumbs from '../../../../../components/custom-breadcrumbs';
// sections
import ProductNewEditForm from '../../../../../sections/@dashboard/e-commerce/ProductNewEditForm';
import {
  Profile,
  ProfileFriends,
  ProfileGallery,
  ProfileFollowers,
} from '../../../../../sections/@dashboard/user/profile';
import {
  ProductInformation
} from '../detailed';
//_mock
import {
  _userAbout,
  _userFeeds,
  _userFriends,
  _userGallery,
  _userFollowers,
} from '../../../../../_mock/arrays';
// ----------------------------------------------------------------------

EcommerceProductEditPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function EcommerceProductEditPage() {
  const { themeStretch } = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('profile');

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
      // icon: <Iconify icon="ic:round-account-box" />,
      component: <ProductInformation />,
    },
    {
      value: 'Sales Orders',
      label: 'Sales Orders',
      // icon: <Iconify icon="eva:heart-fill" />,
      component: <ProfileFollowers followers={_userFollowers} />,
    },
    {
      value: 'Purchase Orders',
      label: 'Purchase Orders',
      // icon: <Iconify icon="eva:people-fill" />,
      component: (
        <ProfileFriends
          friends={_userFriends}
          // searchFriends={searchFriends}
          onSearchFriends={(event) => setSearchFriends(event.target.value)}
        />
      ),
    },
    {
      value: 'Stock History',
      label: 'Stock History',
      // icon: <Iconify icon="ic:round-perm-media" />,
      component: <ProfileGallery gallery={_userGallery} />,
    },
  ];

  return (
    <>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit product"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'E-Commerce',
              href: PATH_DASHBOARD.eCommerce.root,
            },
            { name: currentProduct?.name },
          ]}
        />

        {/* <ProductNewEditForm isEdit currentProduct={currentProduct} /> */}

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
              // bottom: 0,
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
