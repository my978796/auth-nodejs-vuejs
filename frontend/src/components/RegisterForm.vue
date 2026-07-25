<template>
  <form class="form" @submit.prevent="submitForm">
    <h2>Register</h2>
    <label>
      Name
      <input type="text" v-model="name" required />
    </label>
    <label>
      Email
      <input type="email" v-model="email" required />
    </label>
    <label>
      Password
      <input type="password" v-model="password" required minlength="6" />
    </label>
    <button class="button" type="submit">Register</button>
  </form>
</template>

<script setup>
import { defineEmits, ref } from 'vue';
const emit = defineEmits(['submit-register']);

const name = ref('');
const email = ref('');
const password = ref('');

const submitForm = () => {
  emit('submit-register', { name: name.value, email: email.value, password: password.value });
};
</script>
