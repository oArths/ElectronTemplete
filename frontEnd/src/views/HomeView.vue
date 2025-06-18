<template>
    <div class="home">
        <h1>Welcome to the Home Page</h1>
        <p>This is a simple Vue.js application.</p>
        <router-link to="/about">Go to About Page</router-link>
    </div>
</template>

<script>

export default {
  name: 'HomeView',
  data() {
    return {
      message: 'Welcome to the Home View!'
    };
  },
  mounted() {
    console.log(this.message);
  }
};

</script>