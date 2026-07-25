<template>
  <form class="form" @submit.prevent="submitForm">
    <h2>Login</h2>
    <label>
      Email
      <input type="email" v-model="email" required />
    </label>
    <label>
      Password
      <input type="password" v-model="password" required />
    </label>
    <button class="button" type="submit">Login</button>
  </form>
</template>

<script setup>
import { defineEmits, ref } from 'vue';
const emit = defineEmits(['submit-login']);

const email = ref('');
const password = ref('');

const submitForm = () => {
  emit('submit-login', { email: email.value, password: password.value });
};
</script>
