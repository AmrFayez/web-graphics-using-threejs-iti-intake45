import './style.css'
import '@mdi/font/css/materialdesignicons.css'
import OpenAI from 'openai'
import { marked } from 'marked'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: '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', // Replace with your actual API key
  dangerouslyAllowBrowser: true
})

// DOM Elements
const chatContainer = document.getElementById('chatContainer')
const messageInput = document.getElementById('messageInput')
const sendButton = document.getElementById('sendButton')

// Conversation history with system message
let messages = [
  {
    role: 'system',
    content: 'You are an experienced chef. You have extensive knowledge of cooking techniques, recipes, ingredients, and culinary traditions from around the world. Provide detailed cooking advice, recipe suggestions, and culinary expertise.'
  }
]

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

// Handle message sending
async function handleSend() {
  const message = messageInput.value.trim()
  if (!message) return

  // Add user message to chat and conversation history
  addMessage(message, true)
  messages.push({ role: 'user', content: message })
  
  messageInput.value = ''
  messageInput.style.height = 'auto'

  try {
    // Show loading state
    const loadingMessage = 'Thinking...'
    addMessage(loadingMessage)

    // Get response from OpenAI
    const completion = await openai.chat.completions.create({
      messages: messages, // Send full conversation history
      model: 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: null,
      stream: false,
    })

    // Remove loading message
    chatContainer.removeChild(chatContainer.lastChild)
    
    // Add AI response to chat and conversation history
    const aiResponse = completion.choices[0].message.content
    messages.push({ role: 'assistant', content: aiResponse })
    addMessage(aiResponse)
    
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
