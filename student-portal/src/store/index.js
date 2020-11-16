import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    subjects: []
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
        if (state.subjects[i].subject_id === id) {
          state.subjects.splice(i, 1);
          break;
        }
      }
    },

    update_subject: function (state, payload) {
      for (let i = 0; i < state.subjects.length; i++) {
        if (state.subjects[i].subject_id === parseInt(payload.subject_id)) {
          state.subjects[i].name = payload.subject.name;
          state.subject[i].description = payload.subject.description;
          break;
        }
      }
    }
  },

  actions: {
    load_subjects: function ({ commit }) {
      fetch('http://localhost/api/subjects', { method: 'get' }).then((response) => {
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
      fetch(`http://localhost/api/subjects/${id}`, { method: 'delete' }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json()
      }).then((jsonData) => {
        commit('remove_subject', jsonData.subject_id)
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },

    new_subject: function({ commit }, message) {
      fetch('http://localhost/api/subjects', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: message
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
      fetch(`http://localhost/api/subjects/${payload.subject_id}`, {
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
    }
  }
})
