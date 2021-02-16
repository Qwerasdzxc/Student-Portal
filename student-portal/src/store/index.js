import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    subjects: [],
    subject_news: []
  },

  mutations: {
    set_subjects: function (state, subjects) {
      state.subjects = subjects;
    },

    add_subject: function (state, subject) {
      state.subjects.push(subject);
    },

    remove_subject: function (state, id) {
      for (let i = 0; i < state.subjects.length; i++) {
        if (state.subjects[i]._id === id) {
          state.subjects.splice(i, 1);
          break;
        }
      }
    },

    set_subject_news: function (state, news) {
      state.subject_news = news;
    },

    add_subject_news: function (state, news) {
      state.subject_news.push(news);
    },

    remove_subject_news: function (state, id) {
      for (let i = 0; i < state.subject_news.length; i++) {
        if (state.subject_news[i]._id === id) {
          state.subject_news.splice(i, 1);
          break;
        }
      }
    },

    update_subject_news: function (state, subject_news) {
      for (let i = 0; i < state.subject_news.length; i++) {
        if (state.subject_news[i]._id === subject_news._id) {
          state.subject_news[i].title = subject_news.title;
          state.subject_news[i].content = subject_news.content;
          break;
        }
      }
    }
  },

  actions: {
    load_subjects: function ({ commit }) {
      fetch('http://localhost:3000/api/subjects', { method: 'get' }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json()
      }).then((jsonData) => {
        commit('set_subjects', jsonData)
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },

    delete_subject: function({ commit }, id) {
      fetch(`http://localhost:3000/api/subjects/${id}`, { method: 'delete' }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json()
      }).then((jsonData) => {
        commit('remove_subject', jsonData._id)
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },

    new_subject: function({ commit }, subject) {
      fetch('http://localhost:3000/api/subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: subject
      }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json();
      }).then((jsonData) => {
        commit('add_subject', jsonData);
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },

    change_subject: function({ commit }, payload) {
      fetch(`http://localhost:3000/api/subjects/${payload.subject_id}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: payload.msg
      }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json();
      }).then((jsonData) => {
        commit('update_subject', {id: payload.subject_id, msg:jsonData});
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },

    load_subject_news: function ({ commit }, subject_id) {
      fetch(`http://localhost:3000/api/subjects/${subject_id}/news`, { method: 'get' }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json()
      }).then((jsonData) => {
        commit('set_subject_news', jsonData)
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },

    delete_subject_news: function({ commit }, payload) {
      fetch(`http://localhost:3000/api/subjects/${payload.subject_id}/news/${payload.subject_news_id}`, { method: 'delete' }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json()
      }).then((jsonData) => {
        commit('remove_subject_news', jsonData.subject_news_id)
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },

    new_subject_news: function({ commit }, payload) {
      fetch(`http://localhost:3000/api/subjects/${payload.subject_id}/news`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: payload.subject_news
      }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json();
      }).then((jsonData) => {
        commit('add_subject_news', jsonData);
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },

    change_subject_news: function({ commit }, payload) {
      fetch(`http://localhost:3000/api/subjects/${payload.subject_news.subject_id}/news/${payload.subject_news._id}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: payload.json
      }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json();
      }).then((jsonData) => {
        commit('update_subject_news', jsonData);
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    }
  }
})
