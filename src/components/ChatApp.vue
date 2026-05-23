<template>
  <div class="app">
    <Sidebar />
    <div class="main" :class="{ 'sidebar-collapsed': !state.sidebarOpen }">
      <ChatWindow />
    </div>
  </div>
</template>

<script setup>
import { state } from '../stores/chat.js'
import Sidebar from './Sidebar.vue'
import ChatWindow from './ChatWindow.vue'
</script>
