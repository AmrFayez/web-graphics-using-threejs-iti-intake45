import './style.css'
import '@mdi/font/css/materialdesignicons.css'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { marked } from 'marked'

// ✅ Initialize Gemini AI (v1 and gemini-pro)
const genAI = new GoogleGenerativeAI('AIzaSyB2qLavZyxvLLnM0Ds2Xt6w5Is1THtdeaQ') // Replace with your real key
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

// DOM Elements
const chatContainer = document.getElementById('chatContainer')
const messageInput = document.getElementById('messageInput')
const sendButton = document.getElementById('sendButton')

// Add message to chat
function addMessage(content, isUser = false) {
  const messageDiv = document.createElement('div')
  messageDiv.className = `message ${isUser ? 'user' : 'ai'}`

  const avatar = document.createElement('div')
  avatar.className = 'avatar'
  avatar.textContent = isUser ? 'U' : 'AI'

  const contentDiv = document.createElement('div')
  contentDiv.className = 'content'
  contentDiv.innerHTML = isUser ? content : marked.parse(content)

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
var chat =await model.startChat({history:[]})
// Handle send
async function handleSend() {
  const message = messageInput.value.trim()
  if (!message) return

  addMessage(message, true)
  messageInput.value = ''
  messageInput.style.height = 'auto'

  addMessage('Thinking...')

  try {
    const result =await chat.sendMessage(message);
    const response = result.response.text()

    chatContainer.removeChild(chatContainer.lastChild)
    addMessage(response)
  } catch (error) {
    console.error('Error:', error)
    chatContainer.removeChild(chatContainer.lastChild)
    addMessage('Sorry, an error occurred.')
  }
}

// Send on button click or Enter key
sendButton.addEventListener('click', handleSend)
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
})
