import { createRouter, createWebHistory } from 'vue-router'

import { loadLayout } from './layout/loadLayout.js'
import auth from './middleware/auth.middleware.js'
import authUnverify from './middleware/authUnverify.middleware.js'
import guest from './middleware/guest.middleware.js'
import middlewarePipeline from './middleware/middlewarePipeline.js'
import verify from './middleware/verify.middleware.js'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/Home.vue'),
    meta: {
      layout: 'default',
      middleware: [auth, verify],
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/Auth/Login/IndexView.vue'),
    meta: {
      layout: 'login',
      middleware: [guest],
    },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../pages/Auth/Register/IndexView.vue'),
    meta: {
      layout: 'login',
      middleware: [guest],
    },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('../pages/Auth/ForgotPassword/IndexView.vue'),
    meta: {
      layout: 'login',
      middleware: [guest],
    },
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('../pages/Auth/ResetPassword/IndexView.vue'),
    meta: {
      layout: 'login',
      middleware: [guest],
    },
  },
  {
    path: '/email/verify',
    name: 'email-verify',
    component: () => import('../pages/Auth/VerifyEmail/IndexView.vue'),
    meta: {
      layout: 'login',
      middleware: [authUnverify],
    },
  },
  {
    path: '/email/verification-notification',
    name: 'verification-notification',
    component: () => import('../pages/Auth/VerificationNotification/IndexView.vue'),
    meta: {
      layout: 'login',
      middleware: [authUnverify],
    },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../pages/Profile/IndexView.vue'),
    meta: {
      layout: 'default',
      middleware: [auth],
    },
  },

  {
    path: '/folders/create',
    name: 'folders-create',
    component: () => import('../pages/Folder/Create/IndexView.vue'),
    meta: {
      layout: 'default',
      middleware: [auth],
    },
  },
  {
    path: '/folders/:id/update',
    name: 'folder-update',
    component: () => import('../pages/Folder/Update/IndexView.vue'),
    meta: {
      layout: 'default',
      middleware: [auth],
    },
    props: true,
  },

  {
    path: '/tasks/create',
    name: 'tasks-create',
    component: () => import('../pages/Task/Create/IndexView.vue'),
    meta: {
      layout: 'default',
      middleware: [auth],
    },
  },
  {
    path: '/tasks/:id/update',
    name: 'task-update',
    component: () => import('../pages/Task/Update/IndexView.vue'),
    meta: {
      layout: 'default',
      middleware: [auth],
    },
    props: true,
  },
  // {
  //   path: '/archive',
  //   name: 'archive',
  //   component: () => import('../pages/Archive/Index.vue'),
  //   meta: {
  //     layout: 'default',
  //     middleware: [auth],
  //   },
  // },
  {
    path: '/menu-edit',
    name: 'menu-edit',
    component: () => import('../pages/MenuEdit/IndexView.vue'),
    meta: {
      layout: 'default',
      middleware: [auth],
    },
  },
  {
    path: '/all',
    name: 'tasks-all',
    component: () => import('../pages/Tasks/All/IndexView.vue'),
    meta: {
      layout: 'default',
      middleware: [auth],
    },
  },
  {
    path: '/author',
    name: 'tasks-author',
    component: () => import('../pages/Tasks/Author/IndexView.vue'),
    meta: {
      layout: 'default',
      middleware: [auth],
    },
  },
  {
    path: '/executor',
    name: 'tasks-executor',
    component: () => import('../pages/Tasks/Executor/IndexView.vue'),
    meta: {
      layout: 'default',
      middleware: [auth],
    },
  },
  {
    path: '/indefinite',
    name: 'tasks-indefinite',
    component: () => import('../pages/Tasks/Indefinite/IndexView.vue'),
    meta: {
      layout: 'default',
      middleware: [auth],
    },
  },
  {
    path: '/folder-me',
    name: 'folder-me',
    component: () => import('../pages/Tasks/FolderMe/IndexView.vue'),
    meta: {
      layout: 'default',
      middleware: [auth],
    },
  },
  {
    path: '/folder-shared',
    name: 'folder-shared',
    component: () => import('../pages/Tasks/FolderShared/IndexView.vue'),
    meta: {
      layout: 'default',
      middleware: [auth],
    },
  },
  {
    path: '/folders/:id/tasks',
    name: 'folder-tasks',
    component: () => import('../pages/Tasks/Folder/IndexView.vue'),
    meta: {
      layout: 'default',
      middleware: [auth],
    },
    props: true,
  },
  // {
  //   path: '/shared',
  //   name: 'shared',
  //   component: () => import('../pages/Shared/Index.vue'),
  //   meta: {
  //     layout: 'default',
  //     middleware: [auth],
  //   },
  // },

  // {
  //   path: '/created-tasks',
  //   name: 'created-tasks',
  //   component: () => import('../pages/Tasks/Created/Index.vue'),
  //   meta: {
  //     layout: 'default',
  //     middleware: [auth],
  //   },
  // },
  // {
  //   path: '/main-tasks',
  //   name: 'main-tasks',
  //   component: () => import('../pages/Tasks/Main/Index.vue'),
  //   meta: {
  //     layout: 'default',
  //     middleware: [auth],
  //   },
  // },
  {
    path: '/search',
    name: 'search',
    component: () => import('../pages/Search/IndexView.vue'),
    meta: {
      layout: 'default',
      middleware: [auth],
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../pages/NotFound.vue'),
    meta: { layout: 'error' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(loadLayout)

router.beforeEach((to, from, next) => {
  const { middleware } = to.meta
  const context = { to, from, next }

  if (!middleware) {
    next()
  } else {
    middleware[0]({
      ...context,
      next: middlewarePipeline(context, middleware, 1),
    })
  }
})

export default router
