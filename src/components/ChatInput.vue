<template>
  <div class="input-area">
    <div class="input-wrapper">
      <textarea
        ref="inputEl"
        v-model="text"
        class="input-field"
        placeholder="输入消息... (Enter 发送, Shift+Enter 换行)"
        rows="1"
        @input="autoResize"
        @keydown="handleKeydown"
        :disabled="state.isStreaming"
      ></textarea>
      <button
        class="btn-send"
        @click="handleSend"
        :disabled="!text.trim() || state.isStreaming"
        title="发送"
      >
        <svg v-if="!state.isStreaming" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
      </button>
    </div>
    <div class="input-hint">
      MiMo-V2.5-Pro · 由小米大模型团队打造
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { state } from '../stores/chat.js'

const emit = defineEmits(['send'])
const text = ref('')
const inputEl = ref(null)

function handleSend() {
  if (!text.value.trim() || state.isStreaming) return
  emit('send', text.value)
  text.value = ''
  autoResize()
}

function handleKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

function autoResize() {
  const el = inputEl.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 200) + 'px'
}
</script>
