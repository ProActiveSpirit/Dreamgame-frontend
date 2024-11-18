import { useMemo } from 'react';
import { PATH_DASHBOARD } from '../../../routes/paths';
import SvgColor from '../../../components/svg-color';
import { useAuthContext } from '../../../auth/useAuthContext';

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  blog: icon('ic_blog'),
  cart: icon('ic_cart'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

export const useNavConfig = () => {
  const { user } = useAuthContext();

  // Memoize the nav configuration to avoid unnecessary recalculations
  return useMemo(() => [
      {
        items: [{ title: 'DASHBOARD', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard }],
      },
      {
        items: [
          // Only display CUSTOMERS item if user is not an Admin
          ...(user?.role === 'Admin' ? [{
            title: 'USERS',
            path: PATH_DASHBOARD.user.root,
            icon: ICONS.user,
            children: [
              { title: 'list', path: PATH_DASHBOARD.user.list },
            ],
          }] : []),
          {
            title: 'CATALOG',
            path: PATH_DASHBOARD.eCommerce.root,
            icon: ICONS.menuItem,
            children: [
              { title: 'Product', path: PATH_DASHBOARD.eCommerce.list },
              { title: 'Stock', path: PATH_DASHBOARD.eCommerce.stock },
            ],
          },
          {
            title: 'ORDERS',
            path: PATH_DASHBOARD.order.root,
            icon: ICONS.booking,
            children: [
              { title: 'SalesOrders', path: PATH_DASHBOARD.order.salesorder },
              { title: 'PurchaseOrders', path: PATH_DASHBOARD.order.purchaseorder },
              // { title: 'Add', path: PATH_DASHBOARD.salesorder.add },
            ],
          },
          {
            title: 'INVOICE',
            path: PATH_DASHBOARD.invoice.root,
            icon: ICONS.banking,
            children: [
              { title: 'list', path: PATH_DASHBOARD.invoice.list },
              { title: 'details', path: PATH_DASHBOARD.invoice.demoView },
              { title: 'create', path: PATH_DASHBOARD.invoice.new },
              { title: 'edit', path: PATH_DASHBOARD.invoice.demoEdit },
            ],
          },
          {
            title: 'REPORTS',
            path: PATH_DASHBOARD.report.root,
            icon: ICONS.analytics,
            children: [
              { title: 'Best Seller', path: PATH_DASHBOARD.report.bestseller },
              { title: 'Customer Sales', path: PATH_DASHBOARD.report.sales },
              { title: 'Provider Purchase', path: PATH_DASHBOARD.report.purchase },
              { title: 'Provider Monthly Purchase', path: PATH_DASHBOARD.report.monthlypurchase },
            ],
          }
          // APP
          // ----------------------------------------------------------------------
          // {
          //   subheader: 'app',
          //   items: [
          //     {
          //       title: 'mail',
          //       path: PATH_DASHBOARD.mail.root,
          //       icon: ICONS.mail,
          //       info: <Label color="error">+32</Label>,
          //     },
          //     {
          //       title: 'chat',
          //       path: PATH_DASHBOARD.chat.root,
          //       icon: ICONS.chat,
          //     },
          //     {
          //       title: 'calendar',
          //       path: PATH_DASHBOARD.calendar,
          //       icon: ICONS.calendar,
          //     },
          //     {
          //       title: 'kanban',
          //       path: PATH_DASHBOARD.kanban,
          //       icon: ICONS.kanban,
          //     },
          //   ],
          // },

          // DEMO MENU STATES
          // {
          //   subheader: 'Other cases',
          //   items: [
          //     {
          //       // default roles : All roles can see this entry.
          //       // roles: ['user'] Only users can see this item.
          //       // roles: ['admin'] Only admin can see this item.
          //       // roles: ['admin', 'manager'] Only admin/manager can see this item.
          //       // Reference from 'src/guards/RoleBasedGuard'.
          //       title: 'item_by_roles',
          //       path: PATH_DASHBOARD.permissionDenied,
          //       icon: ICONS.lock,
          //       roles: ['admin'],
          //       caption: 'only_admin_can_see_this_item',
          //     },
          //     {
          //       title: 'menu_level',
          //       path: '#/dashboard/menu_level',
          //       icon: ICONS.menuItem,
          //       children: [
          //         {
          //           title: 'menu_level_2a',
          //           path: '#/dashboard/menu_level/menu_level_2a',
          //         },
          //         {
          //           title: 'menu_level_2b',
          //           path: '#/dashboard/menu_level/menu_level_2b',
          //           children: [
          //             {
          //               title: 'menu_level_3a',
          //               path: '#/dashboard/menu_level/menu_level_2b/menu_level_3a',
          //             },
          //             {
          //               title: 'menu_level_3b',
          //               path: '#/dashboard/menu_level/menu_level_2b/menu_level_3b',
          //               children: [
          //                 {
          //                   title: 'menu_level_4a',
          //                   path: '#/dashboard/menu_level/menu_level_2b/menu_level_3b/menu_level_4a',
          //                 },
          //                 {
          //                   title: 'menu_level_4b',
          //                   path: '#/dashboard/menu_level/menu_level_2b/menu_level_3b/menu_level_4b',
          //                 },
          //               ],
          //             },
          //           ],
          //         },
          //       ],
          //     },
          //     {
          //       title: 'item_disabled',
          //       path: '#disabled',
          //       icon: ICONS.disabled,
          //       disabled: true,
          //     },

          //     {
          //       title: 'item_label',
          //       path: '#label',
          //       icon: ICONS.label,
          //       info: (
          //         <Label color="info" startIcon={<Iconify icon="eva:email-fill" />}>
          //           NEW
          //         </Label>
          //       ),
          //     },
          //     {
          //       title: 'item_caption',
          //       path: '#caption',
          //       icon: ICONS.menuItem,
          //       caption:
          //         'Quisque malesuada placerat nisl. In hac habitasse platea dictumst. Cras id dui. Pellentesque commodo eros a enim. Morbi mollis tellus ac sapien.',
          //     },
          //     {
          //       title: 'item_external_link',
          //       path: 'https://www.google.com/',
          //       icon: ICONS.external,
          //     },
          //     {
          //       title: 'blank',
          //       path: PATH_DASHBOARD.blank,
          //       icon: ICONS.blank,
          //     },
          //   ],
          // },
        ],
      },
    ], [user]);
};