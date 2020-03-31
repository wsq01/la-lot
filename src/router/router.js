import Main from '@/components/main/main.vue'

/**
 * meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */
export const defaultRoutes = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/views/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          title: '资产管理大屏',
          // hideInMenu: true,
          // hideInBread: true,
          notCache: true,
          icon: 'ios-desktop'
        },
        component: () => import('@/views/single-page/home/home.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/views/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/views/error-page/500.vue')
  },
  {
    path: '/missed',
    name: '_missed',
    component: Main,
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    children: [
      {
        path: 'missed',
        name: 'missed',
        meta: {
          icon: '',
          title: '资产丢失'
        },
        component: () => import('@/views/single-page/missed/missed.vue')
      }
    ]
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/views/error-page/404.vue')
  }
]

export const dynamicRoutes = [
  {
    path: '/user',
    name: '_user',
    redirect: 'user',
    component: Main,
    meta: {
      userControl: true,
      hideInBread: true,
      hideInMenu: true
    },
    children: [
      {
        path: 'user',
        name: 'user',
        meta: {
          userControl: true,
          icon: 'md-globe',
          title: '用户管理'
        },
        component: () => import('@/views/user-page/user.vue')
      },
      {
        path: 'edit',
        name: 'edit-user',
        meta: {
          icon: 'md-globe',
          hideInMenu: true,
          notCache: true,
          title: '编辑用户'
        },
        component: () => import('@/views/user-page/edit-user.vue')
      },
      {
        path: 'add',
        name: 'add-user',
        meta: {
          icon: 'md-globe',
          notCache: true,
          hideInMenu: true,
          title: '添加用户'
        },
        component: () => import('@/views/user-page/edit-user.vue')
      }
    ]
  },
  {
    path: '/menus',
    name: '_menus',
    redirect: 'menus',
    component: Main,
    meta: {
      userControl: true,
      hideInBread: true,
      hideInMenu: true
    },
    children: [
      {
        path: 'menus',
        name: 'menus',
        meta: {
          userControl: true,
          icon: 'md-globe',
          title: '菜单管理'
        },
        component: () => import('@/views/user-page/menus.vue')
      },
      {
        path: 'edit',
        name: 'edit-menus',
        meta: {
          icon: 'md-globe',
          hideInMenu: true,
          title: '编辑菜单'
        },
        component: () => import('@/views/user-page/edit-menus.vue')
      },
      {
        path: 'add',
        name: 'add-menus',
        meta: {
          icon: 'md-globe',
          hideInMenu: true,
          title: '添加菜单'
        },
        component: () => import('@/views/user-page/edit-menus.vue')
      }
    ]
  },
  {
    path: '/organization',
    name: '_organization',
    redirect: 'organization',
    component: Main,
    meta: {
      userControl: true,
      hideInBread: true,
      hideInMenu: true
    },
    children: [
      {
        path: 'organization',
        name: 'organization',
        meta: {
          userControl: true,
          icon: 'md-globe',
          title: '机构管理'
        },
        component: () => import('@/views/user-page/organization.vue')
      },
      {
        path: 'edit',
        name: 'edit-organization',
        meta: {
          icon: 'md-globe',
          hideInMenu: true,
          title: '编辑机构'
        },
        component: () => import('@/views/user-page/edit-organization.vue')
      },
      {
        path: 'add',
        name: 'add-organization',
        meta: {
          icon: 'md-globe',
          hideInMenu: true,
          title: '添加机构'
        },
        component: () => import('@/views/user-page/edit-organization.vue')
      }
    ]
  },
  {
    path: '/role',
    name: '_role',
    redirect: 'role',
    component: Main,
    meta: {
      userControl: true,
      hideInBread: true,
      hideInMenu: true
    },
    children: [
      {
        path: 'role',
        name: 'role',
        meta: {
          userControl: true,
          icon: 'md-globe',
          title: '角色管理'
        },
        component: () => import('@/views/user-page/role.vue')
      },
      {
        path: 'edit',
        name: 'edit-role',
        meta: {
          icon: 'md-globe',
          hideInMenu: true,
          title: '编辑角色'
        },
        component: () => import('@/views/user-page/edit-role.vue')
      },
      {
        path: 'add',
        name: 'add-role',
        meta: {
          icon: 'md-globe',
          hideInMenu: true,
          title: '添加角色'
        },
        component: () => import('@/views/user-page/edit-role.vue')
      }
    ]
  },
  {
    path: '/btn',
    name: '_btn',
    redirect: 'btn',
    component: Main,
    meta: {
      userControl: true,
      hideInBread: true,
      hideInMenu: true
    },
    children: [
      {
        path: 'btn',
        name: 'btn',
        meta: {
          userControl: true,
          icon: 'md-globe',
          title: '按钮管理'
        },
        component: () => import('@/views/user-page/btn.vue')
      },
      {
        path: 'edit',
        name: 'edit-btn',
        meta: {
          icon: 'md-globe',
          hideInMenu: true,
          title: '编辑按钮'
        },
        component: () => import('@/views/user-page/edit-btn.vue')
      },
      {
        path: 'add',
        name: 'add-btn',
        meta: {
          icon: 'md-globe',
          hideInMenu: true,
          title: '添加按钮'
        },
        component: () => import('@/views/user-page/edit-btn.vue')
      }
    ]
  },
  {
    path: '/relresource',
    name: '_relresource',
    redirect: 'relresource',
    component: Main,
    meta: {
      userControl: true,
      hideInBread: true,
      hideInMenu: true
    },
    children: [
      {
        path: 'relresource',
        name: 'relresource',
        meta: {
          userControl: true,
          icon: 'md-globe',
          title: '资源角色关联管理'
        },
        component: () => import('@/views/user-page/relresource.vue')
      },
      {
        path: 'edit',
        name: 'edit-relresource',
        meta: {
          icon: 'md-globe',
          hideInMenu: true,
          title: '编辑关联'
        },
        component: () => import('@/views/user-page/edit-relresource.vue')
      },
      {
        path: 'add',
        name: 'add-relresource',
        meta: {
          icon: 'md-globe',
          hideInMenu: true,
          title: '添加关联'
        },
        component: () => import('@/views/user-page/edit-relresource.vue')
      }
    ]
  },
  {
    path: '/relmenu',
    name: '_relmenu',
    redirect: 'relmenu',
    component: Main,
    meta: {
      userControl: true,
      hideInBread: true,
      hideInMenu: true
    },
    children: [
      {
        path: 'relmenu',
        name: 'relmenu',
        meta: {
          userControl: true,
          icon: 'md-globe',
          title: '菜单角色关联管理'
        },
        component: () => import('@/views/user-page/relmenu.vue')
      },
      {
        path: 'edit',
        name: 'edit-relmenu',
        meta: {
          icon: 'md-globe',
          hideInMenu: true,
          title: '编辑关联'
        },
        component: () => import('@/views/user-page/edit-relmenu.vue')
      },
      {
        path: 'add',
        name: 'add-relmenu',
        meta: {
          icon: 'md-globe',
          hideInMenu: true,
          title: '添加关联'
        },
        component: () => import('@/views/user-page/edit-relmenu.vue')
      }
    ]
  },
  {
    path: '/reluser',
    name: '_reluser',
    redirect: 'reluser',
    component: Main,
    meta: {
      userControl: true,
      hideInBread: true,
      hideInMenu: true
    },
    children: [
      {
        path: 'reluser',
        name: 'reluser',
        meta: {
          userControl: true,
          icon: 'md-globe',
          title: '用户角色关联管理'
        },
        component: () => import('@/views/user-page/reluser.vue')
      },
      {
        path: 'edit',
        name: 'edit-reluser',
        meta: {
          icon: 'md-globe',
          hideInMenu: true,
          title: '编辑关联'
        },
        component: () => import('@/views/user-page/edit-reluser.vue')
      },
      {
        path: 'add',
        name: 'add-reluser',
        meta: {
          icon: 'md-globe',
          hideInMenu: true,
          title: '添加关联'
        },
        component: () => import('@/views/user-page/edit-reluser.vue')
      }
    ]
  },
  {
    path: '/area',
    name: '_area',
    redirect: 'area',
    component: Main,
    meta: {
      hideInBread: true
    },
    children: [
      {
        path: 'area',
        name: 'area',
        meta: {
          icon: 'md-globe',
          title: '区域管理'
        },
        component: () => import('@/views/single-page/area/area.vue')
      },
      {
        path: 'edit',
        name: 'edit-area',
        meta: {
          hideInMenu: true,
          notCache: true,
          title: '编辑区域'
        },
        component: () => import('@/views/single-page/area/edit-area.vue')
      },
      {
        path: 'add',
        name: 'add-area',
        meta: {
          hideInMenu: true,
          notCache: true,
          title: '新增区域'
        },
        component: () => import('@/views/single-page/area/edit-area.vue')
      }
    ]
  },
  {
    path: '/repository',
    name: 'repository',
    redirect: 'repository',
    component: Main,
    meta: {
      hideInBread: true
    },
    children: [
      {
        path: 'repository',
        name: 'repository',
        meta: {
          icon: 'md-globe',
          title: '区域管理'
        },
        component: () => import('@/views/single-page/repository/repository.vue')
      },
      {
        path: 'edit',
        name: 'edit-repository',
        meta: {
          hideInMenu: true,
          notCache: true,
          title: '编辑区域'
        },
        component: () => import('@/views/single-page/repository/edit-repository.vue')
      },
      {
        path: 'add',
        name: 'add-repository',
        meta: {
          hideInMenu: true,
          notCache: true,
          title: '新增区域'
        },
        component: () => import('@/views/single-page/repository/edit-repository.vue')
      }
    ]
  },
  {
    path: '/scene',
    name: '_scene',
    redirect: 'scene',
    component: Main,
    meta: {
      hideInBread: true
    },
    children: [
      {
        path: 'scene',
        name: 'scene',
        meta: {
          icon: 'md-pin',
          title: '场景管理'
        },
        component: () => import('@/views/single-page/scene/scene.vue')
      },
      {
        path: 'edit',
        name: 'edit-scene',
        meta: {
          hideInMenu: true,
          notCache: true,
          title: '编辑场景'
        },
        component: () => import('@/views/single-page/scene/edit-scene.vue')
      },
      {
        path: 'add',
        name: 'add-scene',
        meta: {
          hideInMenu: true,
          notCache: true,
          title: '新增场景'
        },
        component: () => import('@/views/single-page/scene/edit-scene.vue')
      }
    ]
  },
  {
    path: '/deviceManager',
    name: 'deviceManager',
    component: Main,
    meta: {
      title: '设备管理',
      icon: 'md-keypad'
    },
    children: [
      {
        path: 'receiver',
        name: 'receiver',
        meta: {
          icon: 'md-menu',
          title: '接收器',
          hideInMenu: true
        },
        component: () => import('@/views/single-page/receiver/receiver.vue')
      },
      {
        path: 'device',
        name: 'device',
        meta: {
          icon: 'md-menu',
          title: '流动资产',
          hideInMenu: true
        },
        component: () => import('@/views/single-page/device/device.vue')
      },
      {
        path: 'devicetype',
        name: 'devicetype',
        meta: {
          icon: 'md-menu',
          title: '资产编码',
          hideInMenu: true
        },
        component: () => import('@/views/single-page/device-type/device-type.vue')
      },
      {
        path: 'editType',
        name: 'edit-type',
        meta: {
          hideInMenu: true,
          notCache: true,
          title: '编辑接收器'
        },
        component: () => import('@/views/single-page/device-type/edit-type.vue')
      },
      {
        path: 'addType',
        name: 'add-type',
        meta: {
          hideInMenu: true,
          notCache: true,
          title: '新增接收器'
        },
        component: () => import('@/views/single-page/device-type/edit-type.vue')
      },
      {
        path: 'editReceiver',
        name: 'edit-receiver',
        meta: {
          hideInMenu: true,
          notCache: true,
          title: '编辑接收器'
        },
        component: () => import('@/views/single-page/receiver/edit-receiver.vue')
      },
      {
        path: 'addReceiver',
        name: 'add-receiver',
        meta: {
          hideInMenu: true,
          notCache: true,
          title: '新增接收器'
        },
        component: () => import('@/views/single-page/receiver/edit-receiver.vue')
      },
      {
        path: 'editDevice',
        name: 'edit-device',
        meta: {
          hideInMenu: true,
          notCache: true,
          title: '编辑接收器'
        },
        component: () => import('@/views/single-page/device/edit-device.vue')
      },
      {
        path: 'addDevice',
        name: 'add-device',
        meta: {
          hideInMenu: true,
          notCache: true,
          title: '新增接收器'
        },
        component: () => import('@/views/single-page/device/edit-device.vue')
      }
    ]
  },
  {
    path: '/allot',
    name: '_allot',
    redirect: 'allot',
    component: Main,
    meta: {
      hideInBread: true
    },
    children: [
      {
        path: 'allot',
        name: 'allot',
        meta: {
          icon: '_qq',
          title: '流动资产调拨'
        },
        component: () => import('@/views/single-page/allot/allot.vue')
      }
    ]
  },
  {
    path: '/check',
    name: '_check',
    redirect: 'check',
    component: Main,
    meta: {
      hideInBread: true
    },
    children: [
      {
        path: 'check',
        name: 'check',
        meta: {
          icon: 'md-calculator',
          title: '盘点'
        },
        component: () => import('@/views/single-page/check/check.vue')
      }
    ]
  },
  {
    path: '/devicedata',
    name: '_devicedata',
    redirect: 'devicedata',
    component: Main,
    meta: {
      hideInBread: true
    },
    children: [
      {
        path: 'devicedata',
        name: 'devicedata',
        meta: {
          icon: 'md-analytics',
          title: '资产数据'
        },
        component: () => import('@/views/single-page/devicedata/devicedata.vue')
      }
    ]
  }
]
