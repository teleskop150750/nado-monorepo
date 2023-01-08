import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/typography',
      name: 'typography',
      component: () => import('../views/TypographyView.vue'),
    },
    {
      path: '/icons',
      name: 'icons',
      component: () => import('../views/IconView.vue'),
    },
    {
      path: '/spinner',
      name: 'spinner',
      component: () => import('../views/SpinnerView.vue'),
    },
    {
      path: '/scrollbar',
      name: 'scrollbar',
      component: () => import('../views/ScrollbarView.vue'),
    },
    {
      path: '/tag',
      name: 'tag',
      component: () => import('../views/TagView.vue'),
    },
    {
      path: '/button',
      name: 'button',
      component: () => import('../views/ButtonView.vue'),
    },
    {
      path: '/form',
      name: 'form',
      component: () => import('../views/FormView.vue'),
    },
    {
      path: '/input',
      name: 'input',
      component: () => import('../views/InputView.vue'),
    },
    {
      path: '/select',
      name: 'select',
      component: () => import('../views/SelectView.vue'),
    },
    {
      path: '/virtual-select',
      name: 'virtualSelect',
      component: () => import('../views/VirtualSelectView.vue'),
    },
    {
      path: '/radio',
      name: 'radio',
      component: () => import('../views/RadioView.vue'),
    },
    {
      path: '/checkbox',
      name: 'checkbox',
      component: () => import('../views/CheckboxView.vue'),
    },
    {
      path: '/toggle',
      name: 'toggle',
      component: () => import('../views/ToggleView.vue'),
    },
    {
      path: '/time-picker',
      name: 'time-picker',
      component: () => import('../views/TimePickerView.vue'),
    },
    {
      path: '/date-picker',
      name: 'date-picker',
      component: () => import('../views/DatePickerView.vue'),
    },
    {
      path: '/dropdown',
      name: 'dropdown',
      component: () => import('../views/DropdownView.vue'),
    },
    {
      path: '/progress',
      name: 'progress',
      component: () => import('../views/ProgressView.vue'),
    },
    {
      path: '/upload',
      name: 'upload',
      component: () => import('../views/UploadView.vue'),
    },
    {
      path: '/tooltip',
      name: 'tooltip',
      component: () => import('../views/TooltipView.vue'),
    },
    {
      path: '/popover',
      name: 'popover',
      component: () => import('../views/PopoverView.vue'),
    },
    {
      path: '/upload',
      name: 'upload',
      component: () => import('../views/UploadView.vue'),
    },
    {
      path: '/virtual-list',
      name: 'virtualList',
      component: () => import('../views/VirtualListView.vue'),
    },
    {
      path: '/virtual-grid',
      name: 'virtualGrid',
      component: () => import('../views/VirtualGridView.vue'),
    },
  ],
})

export default router
