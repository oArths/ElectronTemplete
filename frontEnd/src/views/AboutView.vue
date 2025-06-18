<template>
    <div class="about">
        <h1>Welcome to the about Page</h1>
        <p>This is a simple Vue.js application.</p>
        <router-link to="/about">Go to About Page</router-link>
    </div>
</template>

<script>

export default {
  name: 'AboutView',
  data() {
    return {
      message: 'Welcome to the About View!'
    };
  },
  mounted() {
    console.log(this.message);
  }
};

</script>