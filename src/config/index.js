export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: 'LA-IOT',
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: true,
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    dev: {
      first: '//39.105.79.197:8001',
      second: '//39.105.79.197:8002',
      three: '//1.119.6.206:8003'
    },
    pro: {
      first: '//39.105.79.197:8001',
      second: '//39.105.79.197:8002',
      three: '//1.119.6.206:8003'
    }
  },
  httpUrl: {
    first: '//39.105.79.197:8001',
    second: '//39.105.79.197:8002',
    three: '//1.119.6.206:8003'
  },
  version: '1.1.0',
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'home'
}
