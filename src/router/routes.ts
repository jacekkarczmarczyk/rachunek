import { type RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [{
  path: '/bill-form',
  component: () => import('@/views/BillFormView.vue'),
}, {
  path: '/:pathMatch(.*)*',
  redirect: '/bill-form',
}];
