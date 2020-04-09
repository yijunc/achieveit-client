const state = {
  msg: []
}

const mutations = {
  ADD_MSG: (state, msg) => {
    state.msg.push(msg)
  },
  SET_MSG: (state, msg) => {
    state.msg = msg
  }
}

const actions = {
  addMsg({ commit }, msg) {
    commit('ADD_MSG', msg)
  },
  setMsg({ commit }) {
    var msg = [
      { nid: 1,
        desc: '每周风险跟踪：风险ID: 37，紧急度：p9，所属项目：狗子。',
        time: '2020-4-9 10:00:00',
        unRead: true
      },
      {
        nid: 2,
        desc: '项目立项通过！赶紧拉上你的手下们干活吧！',
        time: '2020-4-9 11:00:00',
        unRead: true
      },
      {
        nid: 3,
        desc: '自动提醒：请确认您所借设备【米忽悠】是否完好，同时注意设备到期时间为2020-05-05。',
        time: '2020-4-9 12:00:00',
        unRead: true
      }
    ]
    commit('SET_MSG', msg)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
