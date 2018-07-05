import BillFormRoute from '../routes/BillFormRoute'

export default router => [{
  path: '/bill-form',
  component: BillFormRoute,
}, {
  path: '*',
  redirect: '/bill-form',
}]
