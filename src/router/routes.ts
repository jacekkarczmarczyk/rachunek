export default [{
  path: '/bill-form',
  component: () => import('@/views/BillFormView.vue'),
}, {
  path: '/:pathMatch(.*)*',
  redirect: '/bill-form',
}];
