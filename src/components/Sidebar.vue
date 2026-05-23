<template>
  <aside class="sidebar" :class="{ open: state.sidebarOpen }">
    <div class="sidebar-header">
      <div class="logo">
        <span class="logo-icon">🤖</span>
        <span class="logo-text">MiMo Chat</span>
      </div>
      <button class="btn-icon" @click="toggleSidebar" title="收起侧栏">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
    </div>

    <button class="btn-new-chat" @click="handleNew">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
      新建对话
    </button>

    <div class="conv-list">
      <div
        v-for="conv in state.conversations"
        :key="conv.id"
        class="conv-item"
        :class="{ active: conv.id === state.activeConversationId }"
        @click="setActive(conv.id)"
      >
        <span class="conv-title">{{ conv.title }}</span>
        <div class="conv-actions">
          <button class="btn-icon-sm" @click.stop="startRename(conv)" title="重命名">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-icon-sm danger" @click.stop="handleDelete(conv.id)" title="删除">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          </button>
        </div>
      </div>
      <div v-if="!state.conversations.length" class="conv-empty">
        暂无对话，点击上方开始
      </div>
    </div>

    <div class="sidebar-footer">
      <div class="model-badge">MiMo-V2.5-Pro</div>
    </div>

    <div v-if="renaming" class="modal-overlay" @click.self="renaming = false">
      <div class="modal">
        <h3>重命名对话</h3>
        <input
          ref="renameInput"
          v-model="renameValue"
          class="modal-input"
          @keyup.enter="confirmRename"
          @keyup.escape="renaming = false"
        />
        <div class="modal-actions">
          <button class="btn-secondary" @click="renaming = false">取消</button>
          <button class="btn-primary" @click="confirmRename">确定</button>
        </div>
      </div>
    </div>
  </aside>

  <button
    v-if="!state.sidebarOpen"
    class="btn-toggle-sidebar"
    @click="toggleSidebar"
    title="展开侧栏"
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
  </button>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { state, createConversation, deleteConversation, renameConversation, setActive } from '../stores/chat.js'

const renaming = ref(false)
const renameValue = ref('')
const renameId = ref(null)
const renameInput = ref(null)

function toggleSidebar() {
  state.sidebarOpen = !state.sidebarOpen
}

function handleNew() {
  createConversation()
}

function handleDelete(id) {
  if (confirm('确定删除该对话？')) {
    deleteConversation(id)
  }
}

function startRename(conv) {
  renameId.value = conv.id
  renameValue.value = conv.title
  renaming.value = true
  nextTick(() => renameInput.value?.focus())
}

function confirmRename() {
  if (renameValue.value.trim()) {
    renameConversation(renameId.value, renameValue.value.trim())
  }
  renaming.value = false
}
</script>
