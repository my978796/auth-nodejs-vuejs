<template>
  <div class="app-shell">
    <header>
      <h1>Vue Auth</h1>
      <p>Register, login, and fetch your profile from the Node.js backend.</p>
    </header>

    <section class="card" v-if="!user">
      <div class="tabs">
        <button :class="{ active: view === 'login' }" @click="view = 'login'">Login</button>
        <button :class="{ active: view === 'register' }" @click="view = 'register'">Register</button>
      </div>

      <LoginForm v-if="view === 'login'" @submit-login="login" />
      <RegisterForm v-else @submit-register="register" />
    </section>

    <section class="card profile-card" v-if="user">
      <h2>Welcome, {{ user.name }}</h2>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>User ID:</strong> {{ user.id }}</p>
      <button class="button secondary" @click="logout">Logout</button>
    </section>

    <p class="message" v-if="message">{{ message }}</p>
    <p class="error" v-if="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import LoginForm from './components/LoginForm.vue';
import RegisterForm from './components/RegisterForm.vue';

const API_URL = import.meta.env.VITE_API_URL;
const view = ref('login');
const user = ref(null);
const token = ref(localStorage.getItem('authToken') || '');
const message = ref('');
const error = ref('');

const setAuthState = (authData) => {
  token.value = authData.token;
  user.value = authData.user;
  localStorage.setItem('authToken', authData.token);
  message.value = 'Authentication successful.';
  error.value = '';
};

const login = async (payload) => {
  error.value = '';
  message.value = '';
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Login failed.');

    setAuthState(data);
  } catch (err) {
    error.value = err.message;
  }
};

const register = async (payload) => {
  error.value = '';
  message.value = '';
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Registration failed.');

    setAuthState(data);
  } catch (err) {
    error.value = err.message;
  }
};

const fetchProfile = async () => {
  if (!token.value) return;
  try {
    const response = await fetch(`${API_URL}/api/profile`, {
      headers: { Authorization: `Bearer ${token.value}` }
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to load profile.');
    user.value = data.user;
  } catch (err) {
    error.value = err.message;
    logout();
  }
};

const logout = () => {
  user.value = null;
  token.value = '';
  localStorage.removeItem('authToken');
  message.value = 'Logged out.';
  error.value = '';
};

onMounted(() => {
  if (token.value) {
    fetchProfile();
  }
});
</script>
