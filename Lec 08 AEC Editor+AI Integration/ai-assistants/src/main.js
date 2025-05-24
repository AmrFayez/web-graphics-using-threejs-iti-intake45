import './style.css'
import '@mdi/font/css/materialdesignicons.css'
import OpenAI from 'openai'
import { marked } from 'marked'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: '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', // Replace with your actual API key
  dangerouslyAllowBrowser: true
})

// Constants
const ASSISTANT_ID = 'asst_5qlqPtnlm5AlC1PCYwiuMCua'

// DOM Elements
const chatContainer = document.getElementById('chatContainer')
const messageInput = document.getElementById('messageInput')
const sendButton = document.getElementById('sendButton')

// Thread management
let threadId = null

// Initialize thread on page load
async function initializeThread() {
  const thread = await openai.beta.threads.create()
  threadId = thread.id
}

// Initialize thread when the page loads
initializeThread()

// Function to add a message to the chat
function addMessage(content, isUser = false) {
  const messageDiv = document.createElement('div')
  messageDiv.className = `message ${isUser ? 'user' : 'ai'}`

  const avatar = document.createElement('div')
  avatar.className = 'avatar'
  avatar.textContent = isUser ? 'U' : 'AI'

  const contentDiv = document.createElement('div')
  contentDiv.className = 'content'
  
  // Use marked to parse markdown for AI responses
  if (!isUser) {
    contentDiv.innerHTML = marked.parse(content)
  } else {
    contentDiv.textContent = content
  }

  messageDiv.appendChild(avatar)
  messageDiv.appendChild(contentDiv)
  chatContainer.appendChild(messageDiv)
  chatContainer.scrollTop = chatContainer.scrollHeight
}

// Auto-resize textarea
messageInput.addEventListener('input', () => {
  messageInput.style.height = 'auto'
  messageInput.style.height = Math.min(messageInput.scrollHeight, 200) + 'px'
})

// Function to wait for run completion
async function waitForRunCompletion(threadId, runId) {
  while (true) {
    const run = await openai.beta.threads.runs.retrieve(threadId, runId)
    if (run.status === 'completed') {
      return run
    } else if (run.status === 'failed' || run.status === 'cancelled' || run.status === 'expired') {
      throw new Error(`Run ended with status: ${run.status}`)
    }
    // Wait for 1 second before checking again
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}

// Handle message sending
async function handleSend() {
  const message = messageInput.value.trim()
  if (!message) return

  // Add user message to chat
  addMessage(message, true)
  messageInput.value = ''
  messageInput.style.height = 'auto'

  try {
    // Show loading state
    const loadingMessage = 'Thinking...'
    addMessage(loadingMessage)

    // Create message in thread
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message
    })

    // Run the assistant
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: ASSISTANT_ID
    })

    // Wait for the run to complete
    await waitForRunCompletion(threadId, run.id)

    // Get the messages
    const messages = await openai.beta.threads.messages.list(threadId)
    
    // Remove loading message
    chatContainer.removeChild(chatContainer.lastChild)
    
    // Get the latest assistant message
    const assistantMessage = messages.data
      .filter(msg => msg.role === 'assistant')[0]
    
    if (assistantMessage) {
      const messageContent = assistantMessage.content[0].text.value
      addMessage(messageContent)
    }
    
  } catch (error) {
    console.error('Error:', error)
    chatContainer.removeChild(chatContainer.lastChild)
    addMessage('Sorry, there was an error processing your request.')
  }
}

// Send message on button click or Enter (without Shift)
sendButton.addEventListener('click', handleSend)
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
})
