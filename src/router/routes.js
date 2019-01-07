export default router => [{
  path: '/bill-form',
  component: () => import('@/views/BillFormView.vue'),
}, {
  path: '*',
  redirect: '/bill-form',
}];
