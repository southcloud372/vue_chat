<template>
  <div class="chat-window">
    <header class="chat-header">
      <div class="chat-header-left">
        <span class="chat-title">{{ activeConversation?.title || 'MiMo AI Chat' }}</span>
      </div>
      <div class="chat-header-right">
        <button
          v-if="activeConversation?.messages.length"
          class="btn-icon"
          @click="handleClear"
          title="清空对话"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
        </button>
      </div>
    </header>

    <div class="messages" ref="messagesEl">
      <div v-if="!messages.length" class="welcome">
        <div class="welcome-icon">🤖</div>
        <h2>MiMo AI Chat</h2>
        <p>基于 MiMo-V2.5-Pro 模型的智能对话助手</p>
        <div class="welcome-hints">
          <button class="hint-btn" @click="sendHint('帮我写一首关于春天的诗')">帮我写一首诗</button>
          <button class="hint-btn" @click="sendHint('用通俗的语言解释量子计算')">解释量子计算</button>
          <button class="hint-btn" @click="sendHint('写一个快速排序算法')">写排序算法</button>
        </div>
      </div>
      <MessageBubble
        v-for="msg in messages"
        :key="msg.id"
        :message="msg"
      />
      <div v-if="state.isStreaming" class="typing-indicator">
        <span></span><span></span><span></span>
      </div>
      <div ref="messagesBottom"></div>
    </div>

    <ChatInput @send="handleSend" />
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { state, activeConversation, addMessage, updateLastAssistantMessage, clearActiveMessages } from '../stores/chat.js'
import { sendMessageStream } from '../api/chat.js'
import MessageBubble from './MessageBubble.vue'
import ChatInput from './ChatInput.vue'

const messagesEl = ref(null)
const messagesBottom = ref(null)

const messages = computed(() => activeConversation.value?.messages || [])

function scrollToBottom() {
  nextTick(() => {
    messagesBottom.value?.scrollIntoView({ behavior: 'smooth' })
  })
}

watch(messages, scrollToBottom, { deep: true })

function buildApiMessages(convMessages) {
  return convMessages.map(m => ({ role: m.role, content: m.content }))
}

async function handleSend(text) {
  if (state.isStreaming) return
  if (!text.trim()) return

  addMessage('user', text)
  scrollToBottom()

  state.isStreaming = true
  addMessage('assistant', '')

  const conv = activeConversation.value
  const apiMessages = buildApiMessages(conv.messages.slice(0, -1))

  let fullContent = ''
  await sendMessageStream(
    apiMessages,
    (chunk) => {
      fullContent += chunk
      updateLastAssistantMessage(fullContent)
      scrollToBottom()
    },
    () => {
      state.isStreaming = false
      if (!fullContent) updateLastAssistantMessage('抱歉，未能生成回复。')
    },
    (err) => {
      state.isStreaming = false
      updateLastAssistantMessage(`错误: ${err}`)
    }
  )
}

function sendHint(text) {
  handleSend(text)
}

function handleClear() {
  if (confirm('确定清空当前对话？')) {
    clearActiveMessages()
  }
}
</script>
