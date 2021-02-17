<template>
  <div class="home">
    <Header
      header="Student portal"
      subtitle="Portal for students of the School of Computing"
      description="Portal is meant for the students to share information and news about
        subjects they attend"
    />
    <b-container class="bv-example-row">
      <b-row cols="2">
        <b-col v-for="subject in subjects" :key="subject._id">
          <b-card
            :header="subject.name"
            style="font-weight: bold; margin-top: 40px"
          >
            <p v-line-clamp="6" style="font-weight: normal">
              {{ subject.description }}
            </p>

            <b-button
              style="margin-right: 20px"
              variant="outline-primary"
              @click="showSubjectNews(subject)"
              >News and information</b-button
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
import Header from "@/components/Header";

export default {
  name: "home",
  computed: {
    ...mapState(["subjects"]),
  },
  components: {
    Header,
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
    ...mapActions(["load_subjects", "new_subject", "delete_subject"]),
    showSubjectNews: function (subject) {
      router.push({ path: `/subject/${subject._id}` });
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
          console.log(subject._id);
          if (value) this.delete_subject(subject._id);
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted: function () {
    this.load_subjects();
  }
};
</script>
