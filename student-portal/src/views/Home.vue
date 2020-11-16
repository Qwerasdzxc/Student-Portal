<template>
  <div class="home">
    <b-jumbotron
      header="Student portal"
      lead="Portal for students of the School of Computing"
    >
      <p>
        Portal is meant for the students to share information and news about
        subjects that they attend
      </p>
    </b-jumbotron>
    <b-card v-for="subject in subjects" :key="subject.subject_id">
      <b-card-text>{{ subject.name }}</b-card-text>
      <b-card-text>{{ subject.description }}</b-card-text>

      <a href="#" class="card-link">Card link</a>
      <b-link href="#" class="card-link">Another link</b-link>
    </b-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "home",
  computed: {
    ...mapState(["subjects"]),
  },
};
</script>
