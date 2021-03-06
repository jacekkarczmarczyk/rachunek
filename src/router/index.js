import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';

Vue.use(VueRouter);
const router = new VueRouter();

router.addRoutes(routes);
router.afterEach(() => {
  window.document.body.scrollTop = 0;
});
export default router;
// # sourceMappingURL=index.js.map
