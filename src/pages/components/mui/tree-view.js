// next
import Head from 'next/head';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Container } from '@mui/material';
import { TreeView, TreeItem } from '@mui/x-tree-view'; // Updated import
// routes
import { PATH_PAGE } from '../../../routes/paths';
// layouts
import MainLayout from '../../../layouts/main';
// components
import Iconify from '../../../components/iconify';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
// sections
import { Block } from '../../../sections/_examples/Block';

// ----------------------------------------------------------------------

const StyledTreeView = styled(TreeView)({
  height: 240,
  flexGrow: 1,
  maxWidth: 400,
});

const StyledTreeItem = (props) => (
  <TreeItem
    {...props}
    sx={{
      '& .MuiTreeItem-iconContainer': {
        '& .close': {
          opacity: 0.3,
        },
      },
      '& .MuiTreeItem-group': {
        marginLeft: 15,
        paddingLeft: 18,
        borderLeft: (theme) => `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
      },
    }}
  />
);

// ----------------------------------------------------------------------

MUITreesViewPage.getLayout = (page) => <MainLayout>{page}</MainLayout>;

// ----------------------------------------------------------------------

export default function MUITreesViewPage() {
  return (
    <>
      <Head>
        <title> MUI Components: Tree View | Minimal UI</title>
      </Head>

      <Box
        sx={{
          pt: 6,
          pb: 1,
          bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.200' : 'grey.800'),
        }}
      >
        <Container>
          <CustomBreadcrumbs
            heading="Tree View"
            links={[
              {
                name: 'Components',
                href: PATH_PAGE.components,
              },
              { name: 'Tree View' },
            ]}
            moreLink={['https://mui.com/components/tree-view']}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        <Box
          gap={3}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            md: 'repeat(3, 1fr)',
          }}
        >
          <Block title="Basic">
            <StyledTreeView
              defaultCollapseIcon={<Iconify icon="eva:chevron-down-fill" />}
              defaultExpandIcon={<Iconify icon="eva:chevron-right-fill" />}
              defaultEndIcon={null}
            >
              <StyledTreeItem nodeId="1" label="Applications">
                <StyledTreeItem nodeId="2" label="Calendar" />
                <StyledTreeItem nodeId="3" label="Chrome" />
                <StyledTreeItem nodeId="4" label="Webstorm" />
              </StyledTreeItem>
              <StyledTreeItem nodeId="5" label="Documents">
                <StyledTreeItem nodeId="10" label="OSS" />
                <StyledTreeItem nodeId="6" label="Material-UI">
                  <StyledTreeItem nodeId="7" label="src">
                    <StyledTreeItem nodeId="8" label="index.js" />
                    <StyledTreeItem nodeId="9" label="tree-view.js" />
                  </StyledTreeItem>
                </StyledTreeItem>
              </StyledTreeItem>
            </StyledTreeView>
          </Block>

          <Block title="Multi Select">
            <StyledTreeView
              multiSelect
              defaultCollapseIcon={<Iconify icon="eva:chevron-down-fill" />}
              defaultExpandIcon={<Iconify icon="eva:chevron-right-fill" />}
              defaultEndIcon={null}
            >
              <StyledTreeItem nodeId="1" label="Applications">
                <StyledTreeItem nodeId="2" label="Calendar" />
                <StyledTreeItem nodeId="3" label="Chrome" />
                <StyledTreeItem nodeId="4" label="Webstorm" />
              </StyledTreeItem>
              <StyledTreeItem nodeId="5" label="Documents">
                <StyledTreeItem nodeId="6" label="Material-UI">
                  <StyledTreeItem nodeId="7" label="src">
                    <StyledTreeItem nodeId="8" label="index.js" />
                    <StyledTreeItem nodeId="9" label="tree-view.js" />
                  </StyledTreeItem>
                </StyledTreeItem>
              </StyledTreeItem>
            </StyledTreeView>
          </Block>

          <Block title="Customization">
            <StyledTreeView defaultExpanded={['1']}>
              <StyledTreeItem nodeId="1" label="Main">
                <StyledTreeItem nodeId="2" label="Hello" />
                <StyledTreeItem nodeId="3" label="Subtree with children">
                  <StyledTreeItem nodeId="6" label="Hello" />
                  <StyledTreeItem nodeId="7" label="Sub-subtree with children">
                    <StyledTreeItem nodeId="9" label="Child 1" />
                    <StyledTreeItem nodeId="10" label="Child 2" />
                    <StyledTreeItem nodeId="11" label="Child 3" />
                  </StyledTreeItem>
                  <StyledTreeItem nodeId="8" label="Hello" />
                </StyledTreeItem>
                <StyledTreeItem nodeId="4" label="World" />
                <StyledTreeItem nodeId="5" label="Something something" />
              </StyledTreeItem>
            </StyledTreeView>
          </Block>
        </Box>
      </Container>
    </>
  );
}