# Nexora — System Architecture

This document describes the technical architecture of Nexora.

It explains how the system is structured, how the main components interact, and the architectural decisions behind the project.

For AI modification rules and operational AI context see

AI_CONTEXT.md

---

# Overview

Nexora is a local AI coding assistant designed for developers who want a fast private and extensible development environment.

The application runs primarily locally and relies on

React + TypeScript + Vite  
Ollama for local model inference  
Node.js backend proxy

The architecture emphasizes

local-first operation  
streaming AI responses  
simple extensibility  
modular UI components  
predictable state management  

---

# High Level Architecture

The system is composed of three layers.

UI Layer  
Logic Layer  
Infrastructure Layer  

Each layer has a clearly defined responsibility.

---

# UI Layer

The UI layer renders the interface and handles user interaction.

Main UI components

App.tsx  
Sidebar.tsx  
DocumentSidebar.tsx  
AdminPanel.tsx  
SettingsModal.tsx  

Landing.tsx  
Login.tsx  
Register.tsx  
ImpressumT.tsx  
PrivacyPolicyT.tsx  

Shared layout

AuthLayout.tsx  

Background system

LandingWaveCanvas.tsx  

Primary responsibilities

render the chat interface  
render sidebars  
display streaming AI responses  
render markdown and code blocks  
handle theme switching  
handle routing  

The UI layer should remain mostly presentational and delegate state management to logic modules.

---

# Logic Layer

The logic layer manages application state and behaviour.

Core modules

useChat.ts  
AuthContext.tsx  

Responsibilities

conversation state management  
message sending and streaming  
local conversation persistence  
authentication state  

This layer acts as the bridge between UI components and infrastructure services.

---

# Infrastructure Layer

The infrastructure layer handles communication with the AI runtime.

Main components

backend/server.js  
Ollama runtime  

Responsibilities

proxy requests from frontend to Ollama  
stream responses back to the UI  
keep model communication isolated from the frontend  

This separation allows the frontend to remain independent from the model provider.

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

# Routing Architecture

Routing is defined in main.tsx.

Routes are divided into two groups

Public pages  
Application interface  

Public pages share a common layout.

```

AuthLayout
├ /
├ /login
└ /register

```

Application interface

```

/chat → App.tsx

```

Legal pages

```

/impressum
/privacy-policy

```

These render independently.

---

# Public Page Layout

Public pages use a shared layout component.

Component

AuthLayout.tsx

Responsibilities

render animated canvas background  
render topbar  
render legal links  
render page content using React Router Outlet  

Structure

```

AuthLayout
↓
LandingWaveCanvas
↓
Overlay
↓
Topbar
↓
Outlet
↓
Legal Links

```

Pages rendered inside the layout

Landing.tsx  
Login.tsx  
Register.tsx  

This ensures the canvas animation is mounted only once.

---

# Canvas Background System

The animated background is implemented using

LandingWaveCanvas.tsx

Usage rules

The canvas must only be mounted inside AuthLayout.

Incorrect usage

Landing.tsx importing LandingWaveCanvas  
Login.tsx importing LandingWaveCanvas  
Register.tsx importing LandingWaveCanvas  

Correct usage

AuthLayout.tsx

Benefits

prevents animation remounting  
keeps animation persistent during route changes  
simplifies page components  

---

# Chat Interface

Main chat interface

App.tsx

This is the primary application workspace.

Responsibilities

render sidebar navigation  
render document sidebar  
display chat messages  
display streaming responses  
render message input system  

The chat interface prioritizes

readability  
code clarity  
performance  

Animated canvases are intentionally not used inside the chat interface.

---

# UI Layout Model

The main application interface uses a three column layout.

```

| Left Sidebar | Chat | Right Sidebar |

```

Left sidebar

conversation navigation

Chat

main interaction surface

Right sidebar

document management

---

# Left Sidebar Architecture

Component

Sidebar.tsx

Responsibilities

conversation history  
new chat action  
settings access  
admin access  
logout  

Layout structure

Top  
Middle  
Bottom  

Top

sidebar toggle

Middle

new chat  
settings  
admin  
conversation history  

Bottom

logout  
user avatar  

Conversation history uses internal scrolling.

---

# Right Sidebar Architecture

Component

DocumentSidebar.tsx

Purpose

document management system

Current UI features

document search UI  
upload document button  
print action  
document list  

Future capabilities

document preview  
AI document context  
document summarization  

Layout

Top  
Toggle

Middle  
Search  
Upload  
Print  
Document history

Bottom  
Document tools  

---

# Sidebar Behaviour

Both sidebars share identical interaction patterns.

Closed state

icons only

Open state

icons and labels

Sidebars use animated width transitions.

---

# Responsive Behaviour

Breakpoint

1450px

Desktop

both sidebars may be open simultaneously

Tablet and mobile

only one sidebar may be open

Sidebars operate as drawer panels.

---

# Conversation System

Nexora stores conversation history locally.

Storage key

```

nexora_conversations_<userId>

```

Example

```

nexora_conversations_12

```

This ensures conversation history remains isolated between users.

---

# Active Conversation Tracking

Active conversation key

```

nexora_active_conversation_<userId>

```

This allows Nexora to restore the last active chat after reload.

---

# Draft Conversation Model

Chat uses a draft conversation lifecycle.

```

New Chat
↓
Draft conversation
↓
First user message
↓
Conversation becomes permanent
↓
Saved to history

```

This design avoids saving empty conversations.

---

# Logout Behaviour

Logout clears active chat state.

```

Logout
↓
Active conversation cleared
↓
Next login
↓
Fresh draft chat

```

This guarantees session privacy.

---

# Chat Streaming Architecture

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

Messages update incrementally while tokens arrive.

---

# Message Rendering

Assistant messages are parsed into segments.

Segment types

text  
code  

Rendering stack

ReactMarkdown  
Prism.js  
Custom CodeBlock component  

This allows mixed text and code responses.

---

# Syntax Highlighting

Syntax highlighting is handled by Prism.js.

Supported languages

HTML  
CSS  
JavaScript  
TypeScript  
JSX  
TSX  

Additional languages can be registered later if required.

---

# Copy System

Two copy features exist.

copy code block  
copy entire assistant message  

Both use the Clipboard API.

---

# Theme System

Nexora supports two themes.

dark  
light  

Theme classes

.theme-dark  
.theme-light  

Theme switching is CSS-class based.

---

# CSS Architecture

Styles are organized into modular files.

```

styles/

index.css
base.css
layout.css
chat.css
sidebar.css
document-sidebar.css
landing.css

```

Responsibilities

index.css → global imports  
base.css → reset and utilities  
layout.css → application shell layout  
chat.css → chat interface styling  
sidebar.css → left sidebar styling  
document-sidebar.css → right sidebar styling  

---

# Document System (Future)

The right sidebar will evolve into a document context system.

Possible storage key

```

nexora_documents_<userId>

```

Example structure

```

{
id
name
content
createdAt
}

```

Future workflow

```

Upload document
↓
Extract text
↓
Store locally
↓
Inject into AI context

```

This enables RAG-style AI workflows.

---

# Performance Strategy

Nexora is designed to remain lightweight.

Strategies

local AI models  
streaming responses  
minimal global state  
local persistence  
simple component hierarchy  

---

# Running Nexora

Install dependencies

```

npm install

```

Start development server

```

npm run dev

```

Application runs at

http://localhost:5173

---

# Ollama Setup

Pull model

```

ollama pull llama3.2:3b

```

Run model

```

ollama run llama3.2:3b

```

---

# Maintainer

Armin

Nexora is an experimental local AI coding assistant project focused on learning and experimentation with local AI systems.
```