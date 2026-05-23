import { reactive, computed, watch } from 'vue'

const STORAGE_KEY = 'mimo-chat-data'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

const saved = loadFromStorage()

const state = reactive({
  conversations: saved?.conversations || [],
  activeConversationId: saved?.activeConversationId || null,
  isStreaming: false,
  sidebarOpen: true
})

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    conversations: state.conversations,
    activeConversationId: state.activeConversationId
  }))
}

watch(() => [state.conversations, state.activeConversationId], saveToStorage, { deep: true })

const activeConversation = computed(() =>
  state.conversations.find(c => c.id === state.activeConversationId) || null
)

function createConversation() {
  const conv = {
    id: generateId(),
    title: '新对话',
    messages: [],
    createdAt: Date.now()
  }
  state.conversations.unshift(conv)
  state.activeConversationId = conv.id
  return conv
}

function deleteConversation(id) {
  const idx = state.conversations.findIndex(c => c.id === id)
  if (idx === -1) return
  state.conversations.splice(idx, 1)
  if (state.activeConversationId === id) {
    state.activeConversationId = state.conversations[0]?.id || null
  }
}

function renameConversation(id, title) {
  const conv = state.conversations.find(c => c.id === id)
  if (conv) conv.title = title
}

function setActive(id) {
  state.activeConversationId = id
}

function addMessage(role, content) {
  let conv = activeConversation.value
  if (!conv) conv = createConversation()
  conv.messages.push({ role, content, id: generateId() })
  if (conv.messages.filter(m => m.role === 'user').length === 1 && role === 'user') {
    conv.title = content.slice(0, 30) + (content.length > 30 ? '...' : '')
  }
}

function updateLastAssistantMessage(content) {
  const conv = activeConversation.value
  if (!conv) return
  const last = [...conv.messages].reverse().find(m => m.role === 'assistant')
  if (last) last.content = content
}

function clearActiveMessages() {
  const conv = activeConversation.value
  if (conv) conv.messages = []
}

export {
  state,
  activeConversation,
  createConversation,
  deleteConversation,
  renameConversation,
  setActive,
  addMessage,
  updateLastAssistantMessage,
  clearActiveMessages
}
