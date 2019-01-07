import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login-page',
      component: () => import('@/components/Login'),
    },
    {
      path: '/main/',
      name: 'main-page',
      component: require('@/components/main').default,
      children: [
        {
          path: '/myInfo/',
          name: 'my-info-page',
          component: require('@/components/My/MyInfo').default,
        }
      ]
    },
    {
      path: '/login/',
      name: 'login-page',
      component: require('@/components/Login').default,
    },
    {
      path: '/register/',
      name: 'register-page',
      component: require('@/components/register').default,
    },
  ],
});
