<template>
  <div class="home">
    <b-jumbotron
      header-level="4"
      header="Student portal"
      lead="Portal for students of the School of Computing"
    >
      <p>
        Portal is meant for the students to share information and news about
        subjects they attend
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
      >Create New Subject</b-button
    >
    <b-modal
      id="modal-prevent-closing"
      ref="modal"
      title="New Subject"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          :state="nameState"
          label="Name"
          label-for="name-input"
          invalid-feedback="Name is required"
        >
          <b-form-input
            id="name-input"
            v-model="name"
            :state="nameState"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          :state="descriptionState"
          label="Description"
          label-for="description-input"
          invalid-feedback="Description is required"
        >
          <b-form-input
            id="description-input"
            v-model="description"
            :state="descriptionState"
            required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
    <b-container class="bv-example-row">
      <b-row cols="2">
        <b-col v-for="subject in subjects" :key="subject.subject_id">
          <b-card
            :header="subject.name"
            style="font-weight: bold; margin-top: 40px"
          >
            <b-card-text style="font-weight: normal">{{
              subject.description
            }}</b-card-text>

            <b-button
              style="margin-right: 20px"
              variant="outline-primary"
              @click="showSubjectNews(subject)"
              >News and information about subject</b-button
            >
            <b-button
              variant="danger"
              @click="showDeleteConfirmationDialog(subject)"
              >Delete subject</b-button
            >
          </b-card></b-col
        >
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import router from "@/router";

export default {
  name: "home",
  computed: {
    ...mapState(["subjects"]),
  },
  data() {
    return {
      name: "",
      description: "",
      nameState: null,
      descriptionState: null,
    };
  },
  methods: {
    ...mapActions(["new_subject", "delete_subject"]),
    showSubjectNews: function (subject) {
      router.push({ path: `/subject/${subject.subject_id}` });
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.nameState = valid;
      this.descriptionState = valid;
      return valid;
    },
    resetModal() {
      this.name = "";
      this.nameState = null;
      this.description = "";
      this.descriptionState = null;
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmit();
    },
    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return;
      }
      // Push the name to submitted names
      const subjectData = JSON.stringify({
        name: this.name,
        description: this.description,
      });

      this.new_subject(subjectData);

      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide("modal-prevent-closing");
      });
    },
    showDeleteConfirmationDialog(subject) {
      this.$bvModal
        .msgBoxConfirm(`Are you sure you want to delete ${subject.name}?`, {
          title: "Confirmation",
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "YES",
          cancelTitle: "NO",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        .then((value) => {
          if (value) this.delete_subject(subject.subject_id);
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>
