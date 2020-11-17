<template>
  <div class="home">
    <b-jumbotron
      header-level="4"
      :header="subject.name"
    >
      <p style="margin-top:30px">
        {{subject.description}}
      </p>
      <b-img
        style="padding-top: 40px"
        src="https://raf.edu.rs/images/logo_cir.png"
        fluid
        alt="Responsive image"
      ></b-img>
    </b-jumbotron>
    <!-- <div id="nav"><router-link to="/">Home</router-link> |</div> -->
    <b-button variant="primary" v-b-modal.modal-prevent-closing
      >Create News</b-button
    >
    <!-- <b-container class="bv-example-row">
      <b-row cols="1">
        <b-col v-for="subject in subjects" :key="subject.subject_id">
          <b-card :header="subject.name" style="font-weight: bold; margin-top: 40px">
            <b-card-text style="font-weight: normal">{{ subject.description }}</b-card-text>

            <b-button style="margin-right: 20px" variant="outline-primary"
              >News and information about subject</b-button
            >
            <b-button variant="danger" @click="showDeleteConfirmationDialog(subject)"
              >Delete subject</b-button
            >
          </b-card></b-col
        >
      </b-row>
    </b-container> -->
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "SubjectNews",
  computed: {
    ...mapState(["subjects"]),

    subject: function () {
      for (let i = 0; i < this.subjects.length; i++)
        if (this.subjects[i].subject_id === parseInt(this.$route.params.id))
          return this.subjects[i];

      return null;
    }
  },
};
</script>
