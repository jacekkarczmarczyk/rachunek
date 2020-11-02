export default [{
  path: '/bill-form',
  component: () => import('@/views/BillFormView.vue'),
}, {
  path: '*',
  redirect: '/bill-form',
}];
// # sourceMappingURL=routes.js.map
