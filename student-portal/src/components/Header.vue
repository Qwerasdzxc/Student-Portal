<template>
  <div>
    <b-jumbotron
      header-level="4"
      :header="header"
      :lead="subtitle"
    >
      <p style="margin-top: 30px; padding-left: 300px; padding-right: 300px">
        {{description}}
      </p>
      <b-img
        style="padding-top: 40px"
        src="https://raf.edu.rs/images/logo_cir.png"
        fluid
        alt="Responsive image"
      ></b-img>
    </b-jumbotron>
  </div>
</template>

<script>

export default {
  name: "Header",
  props: {
      header: String,
      subtitle: String,
      description: String
  }
};
</script>

<style scoped>
</style>