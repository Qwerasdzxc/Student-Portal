<template>
  <div class="home">
    <Header
      :header="subject.name"
      subtitle=""
      :description="subject.description"
    />
    <b-button variant="primary" v-b-modal.modal-create-subject-news
      >Create News</b-button
    >
    <b-modal
      id="modal-create-subject-news"
      ref="modal"
      title="New Subject News"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleCreateOk"
    >
      <form ref="form_create" @submit.stop.prevent="handleSubmit">
        <b-form-group
          :state="titleState"
          label="Title"
          label-for="title-input-create"
          invalid-feedback="Title is required"
        >
          <b-form-input
            id="title-input-create"
            v-model="title"
            :state="titleState"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          :state="contentState"
          label="Content"
          label-for="content-input-create"
          invalid-feedback="Content is required"
        >
          <b-form-input
            id="content-input-create"
            v-model="content"
            :state="contentState"
            required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
    <b-modal
      id="modal-update-subject-news"
      ref="modal"
      title="Update Subject News"
      @show="setModalData"
      @hidden="resetModal"
      @ok="handleUpdateOk"
    >
      <form ref="form_update" @submit.stop.prevent="handleSubmit">
        <b-form-group
          :state="titleState"
          label="Title"
          label-for="title-input-update"
          invalid-feedback="Title is required"
        >
          <b-form-input
            id="title-input-update"
            v-model="title"
            :state="titleState"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          :state="contentState"
          label="Content"
          label-for="content-input-update"
          invalid-feedback="Content is required"
        >
          <b-form-input
            id="content-input-update"
            v-model="content"
            :state="contentState"
            required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
    <b-container class="bv-example-row">
      <b-row cols="1">
        <b-col
          v-for="subject_news_item in subject_news"
          :key="subject_news_item._id"
        >
          <b-card
            :header="subject_news_item.title"
            style="font-weight: bold; margin-top: 40px"
          >
            <b-card-text style="font-weight: normal">{{
              subject_news_item.content
            }}</b-card-text>

            <b-button
              style="margin-right: 20px"
              variant="outline-primary"
              v-b-modal.modal-update-subject-news
              @click="selectSubjectNewsForUpdate(subject_news_item)"
              >Update news</b-button
            >
            <b-button
              variant="danger"
              @click="showDeleteConfirmationDialog(subject_news_item)"
              >Delete news</b-button
            >
          </b-card></b-col
        >
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Header from "@/components/Header";

export default {
  name: "SubjectNews",
  components: {
    Header,
  },
  data() {
    return {
      title: "",
      content: "",
      titleState: null,
      contentState: null,
      selected_subject_news: null,
    };
  },
  computed: {
    ...mapState(["subjects", "subject_news"]),

    subject: function () {
      for (let i = 0; i < this.subjects.length; i++)
        if (this.subjects[i]._id === this.$route.params.id) {
          return this.subjects[i];
        }

      return null;
    },
  },
  methods: {
    ...mapActions([
      "load_subject_news",
      "delete_subject_news",
      "change_subject_news",
      "new_subject_news",
    ]),
    selectSubjectNewsForUpdate(subject_news) {
      this.selected_subject_news = subject_news;
    },
    checkCreateFormValidity() {
      const valid = this.$refs.form_create.checkValidity();
      this.titleState = valid;
      this.contentState = valid;
      return valid;
    },
    checkUpdateFormValidity() {
      const valid = this.$refs.form_update.checkValidity();
      this.titleState = valid;
      this.contentState = valid;
      return valid;
    },
    setModalData() {
      this.title = this.selected_subject_news.title;
      this.content = this.selected_subject_news.content;

      this.titleState = true;
      this.contentState = true;
    },
    resetModal() {
      this.title = "";
      this.titleState = null;
      this.content = "";
      this.contentState = null;
    },
    handleCreateOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmitCreate();
    },
    handleUpdateOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmitUpdate();
    },
    handleSubmitCreate() {
      // Exit when the form isn't valid
      if (!this.checkCreateFormValidity()) {
        return;
      }

      // Push the name to submitted names
      const subjectNewsData = JSON.stringify({
        title: this.title,
        content: this.content,
      });

      this.new_subject_news({
        subject_id: this.subject._id,
        subject_news: subjectNewsData,
      });

      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide("modal-create-subject-news");
      });
    },
    handleSubmitUpdate() {
      // Exit when the form isn't valid
      if (!this.checkUpdateFormValidity()) {
        return;
      }
      // Push the name to submitted names
      const subjectNewsData = JSON.stringify({
        title: this.title,
        content: this.content,
      });

      this.change_subject_news({
        subject_news: this.selected_subject_news,
        json: subjectNewsData,
      });

      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide("modal-update-subject-news");
      });
    },
    showDeleteConfirmationDialog(subject_news) {
      this.$bvModal
        .msgBoxConfirm(
          `Are you sure you want to delete ${subject_news.title}?`,
          {
            title: "Confirmation",
            size: "sm",
            buttonSize: "sm",
            okVariant: "danger",
            okTitle: "YES",
            cancelTitle: "NO",
            footerClass: "p-2",
            hideHeaderClose: false,
            centered: true,
          }
        )
        .then((value) => {
          if (value)
            this.delete_subject_news({
              subject_id: subject_news._id,
              subject_news_id: subject_news._id,
            });
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted: function () {
    console.log("mounted");
    this.load_subject_news(this.subject._id);
  },
};
</script>
