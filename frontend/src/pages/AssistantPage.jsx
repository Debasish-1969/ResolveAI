import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import AppLayout from '../components/layout/AppLayout.jsx'
import Alert from '../components/ui/Alert.jsx'
import Button from '../components/ui/Button.jsx'
import LoadingState from '../components/ui/LoadingState.jsx'
import Textarea from '../components/ui/Textarea.jsx'

import { sendAssistantMessage } from '../services/aiService.js'

import './AssistantPage.css'

function AssistantPage() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hello! I am ResolveAI Assistant. Describe your issue or ask me a support question.',
      createdAt: new Date().toISOString(),
    },
  ])

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    if (!message.trim()) {
      return
    }

    const userMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: message.trim(),
      createdAt: new Date().toISOString(),
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
    ])

    setMessage('')
    setError('')
    setLoading(true)

    try {
      const response = await sendAssistantMessage(
        userMessage.content,
      )

      setMessages((currentMessages) => [
        ...currentMessages,
        response,
      ])
    } catch (err) {
      setError(
        err.message || 'The assistant could not process your request.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <div className="assistant-page">
        <div className="assistant-header">
          <div>
            <span className="page-eyebrow">AI SUPPORT</span>

            <h1>ResolveAI Assistant</h1>

            <p>
              Get quick answers to common service and technical
              issues using our AI-powered support assistant.
            </p>
          </div>

          <div className="assistant-status">
            <span className="status-dot"></span>
            AI Assistant Online
          </div>
        </div>

        {error ? (
          <Alert type="error">{error}</Alert>
        ) : null}

        <div className="assistant-card">
          <div className="chat-header">
            <div className="assistant-avatar">R</div>

            <div>
              <strong>ResolveAI Assistant</strong>
              <span>AI-powered support</span>
            </div>
          </div>

          <div className="chat-window">
            {messages.map((item) => (
              <div
                key={item.id}
                className={`chat-message ${item.role}`}
              >
                <div className="chat-message-label">
                  <span className="message-avatar">
                    {item.role === 'user' ? 'Y' : 'R'}
                  </span>

                  <strong>
                    {item.role === 'user'
                      ? 'You'
                      : 'ResolveAI Assistant'}
                  </strong>
                </div>

                <div className="chat-message-content">
  {item.role === 'assistant' ? (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
  {item.content}
</ReactMarkdown>
  ) : (
    <p>{item.content}</p>
  )}
</div>
              </div>
            ))}

            {loading ? (
              <div className="assistant-thinking">
                <span className="message-avatar">R</span>

                <div>
                  <strong>ResolveAI Assistant</strong>
                  <LoadingState />
                </div>
              </div>
            ) : null}
          </div>

          <form
            className="assistant-input-area"
            onSubmit={handleSubmit}
          >
            <Textarea
              id="assistant-message"
              label="Ask a question"
              name="message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Example: My laptop is not connecting to Wi-Fi..."
              rows={3}
            />

            <div className="assistant-form-footer">
              <span>
                Describe your issue clearly for a more useful response.
              </span>

              <Button type="submit" disabled={loading}>
                {loading ? 'Thinking...' : 'Send Message'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  )
}

export default AssistantPage