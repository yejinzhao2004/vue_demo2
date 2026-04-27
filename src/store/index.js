import { createStore } from 'vuex'
export default createStore({
  // state 是 Vuex 中存储全局共享数据的地方。
  state: {
    ifUpload: false,
    oldUpload: null,
    avatar: '',
    HouseListStatus: 0,
    editableTabsValue: '/system/index',
    editableTabs: [
      {
        title: '首页',
        name: '/system/index',
      },
    ],
  },
  // getters 类似于 Vue 组件中的计算属性（computed），用于对 state 中的数据进行派生计算或过滤。
  getters: {},
  // mutations 是唯一可以修改 state 的地方。
  mutations: {
    ADD_TABS: (state, tab) => {
      // 如果在 tabs 中没有该路径，则添加一个标签
      if (state.editableTabs.findIndex((e) => e.name === tab.path) === -1) {
        state.editableTabs.push({
          title: tab.name,
          name: tab.path,
        })
      }
      // 将高亮标签设置为该标签
      state.editableTabsValue = tab.path
    },
    RESET_TAB: (state) => {
      state.editableTabsValue = '/system/index'
      state.editableTabs = [
        {
          title: '首页',
          name: '/system/index',
        },
      ]
    },
  },
  // actions 用于处理异步操作（如 API 请求）。
  actions: {},
  // modules 用于将 Vuex 分割成多个模块，每个模块拥有自己的 state、getters、mutations 和 actions。
  modules: {},
})
