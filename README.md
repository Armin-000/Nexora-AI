# Nexora — Local AI Coding Assistant

Nexora is a lightweight **local AI coding assistant** built with **React**, **TypeScript**, and **Vite**.

It communicates with **Ollama models running locally** and provides a clean developer-focused chat interface with streaming responses and syntax highlighted code blocks.

The system runs entirely **locally** and does not depend on external APIs.

---

# Features

Local AI chat powered by **Ollama**

Real-time **streaming responses**

Clean developer-focused UI

Syntax highlighted code blocks using **Prism.js**

Markdown rendering using **ReactMarkdown**

Light and dark **theme system**

Conversation history stored locally

Left **conversation sidebar**

Right **document sidebar**

Admin panel for privileged users

Settings modal

Copy-to-clipboard for

code blocks  
full assistant messages

Fully local processing

No cloud AI APIs required

---

# Technology Stack

Frontend

React  
TypeScript  
Vite  
React Router DOM  
React Markdown  
Prism.js

Backend

Node.js proxy server

AI Runtime

Ollama local models

Storage

Browser localStorage

---

# Project Structure

```

NEXORA-AI-MAIN/

backend/
server.js

src/

components/
AdminPanel.tsx
AuthLayout.tsx
DocumentSidebar.tsx
LandingWaveCanvas.tsx
SettingsModal.tsx
Sidebar.tsx

context/
AuthContext.tsx

hooks/
useChat.ts

pages/
Landing.tsx
Login.tsx
Register.tsx
ImpressumT.tsx
PrivacyPolicyT.tsx

styles/
AdminPanel.css
base.css
chat.css
document-sidebar.css
impressum.css
index.css
landing.css
layout.css
privacypolicy.css
settings.css
sidebar.css

App.tsx
main.tsx
prism.d.ts

```

---

# Application Architecture

Nexora is structured into three main layers.

### UI Layer

Responsible for rendering the interface and user interaction.

Main components

App.tsx  
Sidebar.tsx  
DocumentSidebar.tsx  
AdminPanel.tsx  
SettingsModal.tsx  

Public pages

Landing.tsx  
Login.tsx  
Register.tsx  

Shared public layout

AuthLayout.tsx

Background system

LandingWaveCanvas.tsx

---

### Logic Layer

Handles application state and behaviour.

Main modules

useChat.ts  
AuthContext.tsx

Responsibilities

conversation management  
AI streaming requests  
local conversation persistence  
authentication state  

---

### Infrastructure Layer

Handles communication with the AI runtime.

backend/server.js

Responsibilities

proxy requests to Ollama  
stream responses back to the frontend  

---

# Routing System

Routing is defined in `main.tsx`.

Public routes share a common layout.

```

AuthLayout
├ /
├ /login
└ /register

```

Chat interface

```

/chat → App.tsx

```

Legal pages

```

/impressum
/privacy-policy

```

---

# UI Layout Model

The main application uses a **three column layout**.

```

| Left Sidebar | Chat Interface | Right Sidebar |

```

Left sidebar

conversation history  
chat navigation

Chat interface

main interaction area

Right sidebar

document management

---

# Canvas Background System

Public pages use an animated background canvas.

Component

LandingWaveCanvas.tsx

It is mounted only once inside

AuthLayout.tsx

Pages that use the layout

Landing.tsx  
Login.tsx  
Register.tsx

The chat interface intentionally **does not use the canvas** to preserve readability and performance.

---

# Chat System

The chat interface is implemented in

App.tsx

Messages are handled by

useChat.ts

Assistant responses stream in real time.

Pipeline

```

User input
↓
App.tsx
↓
useChat.ts
↓
backend/server.js
↓
Ollama
↓
token stream
↓
UI updates

```

---

# Conversation Storage

Conversation history is stored locally.

Storage key

```

nexora_conversations_<userId>

```

Active conversation

```

nexora_active_conversation_<userId>

```

This allows Nexora to restore the previous chat session.

---

# Message Rendering

Assistant messages are parsed into segments.

Segment types

text  
code

Rendering stack

ReactMarkdown  
Prism.js

This allows mixed responses containing text and code blocks.

---

# Theme System

Supported themes

light  
dark

Theme classes

```

.theme-light
.theme-dark

```

Theme switching is CSS-class based.

---

# Installation

Install dependencies

```

npm install

```

---

# Running the App

Start the development server

```

npm run dev

```

The application will run at

```

[http://localhost:5173](http://localhost:5173)

```

---

# Ollama Setup

Download Ollama

https://ollama.com/

Pull a model

```

ollama pull llama3.2:3b

```

Run the model

```

ollama run llama3.2:3b

```

---

# Development Notes

Nexora is designed to remain lightweight.

Key principles

local AI models  
streaming responses  
minimal global state  
modular UI architecture  

---

# Documentation

Additional project documentation

AI_CONTEXT.md → AI modification rules and operational context  
ARCHITECTURE.md → detailed system architecture  

---

# Maintainer

Armin

Nexora is an experimental local AI coding assistant focused on learning and experimentation with local AI systems.