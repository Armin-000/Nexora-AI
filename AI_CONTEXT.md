```md
# Nexora — AI Context

This file defines the complete operational context for AI assistants working on the Nexora project.

It explains

project architecture  
UI layout  
state flow  
component ownership  
styling structure  
modification rules  

AI must read this file before modifying the project.

The goal is to minimize architectural mistakes and unnecessary rewrites.

---

# Project Overview

Nexora is a local AI coding assistant designed for developers who want a fast private and extensible environment.

The system runs primarily locally.

Core technologies

React  
TypeScript  
Vite  
Node.js  

AI runtime

Ollama local models

Key design goals

local-first AI  
streaming responses  
minimal interface  
modular architecture  
predictable state flow  

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

Node.js  
Express style proxy server  

AI Runtime

Ollama local models

Storage

Browser localStorage

---

# System Architecture

Nexora consists of three logical layers.

UI Layer  
Logic Layer  
Infrastructure Layer  

---

# UI Layer

Responsible for rendering UI and handling user interaction.

Main UI files

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

Responsibilities

render chat interface  
render navigation sidebars  
display conversation history  
display streaming responses  
render markdown and code blocks  
handle theme switching  
handle routing  

---

# Logic Layer

Contains application logic and state management.

Core modules

useChat.ts  
AuthContext.tsx  

Responsibilities

chat state management  
conversation persistence  
AI request handling  
streamed token assembly  
authentication state  

---

# Infrastructure Layer

Handles communication with the AI runtime.

Core infrastructure

backend/server.js  
Ollama runtime  

Responsibilities

proxy requests to Ollama  
handle streaming responses  
keep frontend independent from model runtime  

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

# Naming Conventions

React components

PascalCase

Examples

Sidebar.tsx  
DocumentSidebar.tsx  
AdminPanel.tsx  

Hooks

camelCase

Example

useChat.ts

CSS files

lowercase

Examples

chat.css  
sidebar.css  
document-sidebar.css  

Avoid casing mismatches because the project is used on Windows.

---

# UI Layout Architecture

Nexora uses a three column layout model.

| Left Sidebar | Chat | Right Sidebar |

Left sidebar

navigation and conversations

Chat

main working interface

Right sidebar

document management

---

# Public Page Layout System

Public pages share a common layout.

Component

AuthLayout.tsx

Used by

Landing.tsx  
Login.tsx  
Register.tsx  

Responsibilities

render animated background canvas  
render public topbar  
render legal links  
render page content through React Router Outlet  

Structure

AuthLayout  
↓  
LandingWaveCanvas  
↓  
Overlay  
↓  
Topbar  
↓  
Outlet (Landing Login Register)  
↓  
Legal links  

---

# Landing Canvas System

Nexora uses an animated canvas background on public pages.

Component

LandingWaveCanvas.tsx

Important rule

LandingWaveCanvas must only be mounted inside AuthLayout.

Incorrect usage

Landing.tsx importing LandingWaveCanvas  
Login.tsx importing LandingWaveCanvas  
Register.tsx importing LandingWaveCanvas  

Correct usage

AuthLayout.tsx

Benefits

prevents animation remount  
keeps animation persistent between routes  
simplifies page components  

---

# Routing Architecture

Routing entry point

main.tsx

Structure

AuthLayout  
   ├ /  
   ├ /login  
   └ /register  

Chat interface

/chat  
   └ App.tsx  

Legal pages

/impressum  
/privacy-policy  

These render independently.

---

# Sidebar System

Component

Sidebar.tsx

Purpose

chat navigation and conversation history

Functions

create new chat  
select conversation  
delete conversation  
open settings  
open admin panel  
logout  

Layout sections

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

Conversation history scrolls internally.

---

# Right Sidebar (Document Sidebar)

Component

DocumentSidebar.tsx

Purpose

document management system

Current UI capabilities

document search UI  
upload document button  
print action  
document list  

Future capabilities

document preview  
document summarization  
AI document context  

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

# Responsive Behaviour

Breakpoint

1450px

Desktop

both sidebars may be open simultaneously

Tablet and mobile

only one sidebar may be open

opening one sidebar closes the other

Sidebars operate in drawer mode on smaller screens.

---

# Chat Interface

Main chat interface

App.tsx

Responsibilities

render sidebar  
render document sidebar  
render chat messages  
render streaming responses  
render input system  

Important rule

Animated canvases must not be used inside the chat interface.

Reason

maintain readability  
avoid UI distraction  
preserve performance  

---

# Conversation System

Conversations are stored locally.

Storage key

nexora_conversations_<userId>

Example

nexora_conversations_12

---

# Active Conversation

Active conversation key

nexora_active_conversation_<userId>

Used to restore last open chat.

---

# Draft Conversation Model

Conversation lifecycle

New Chat  
↓  
Draft conversation  
↓  
First user message  
↓  
Conversation becomes permanent  
↓  
Saved to history  

This behaviour must remain stable.

---

# Logout Behaviour

Logout resets chat state.

Flow

Logout  
↓  
clear active conversation  
↓  
next login  
↓  
new draft chat  

Ensures privacy between users.

---

# Chat Streaming Architecture

Pipeline

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
UI update  

Assistant responses stream incrementally.

Streaming must not be removed.

---

# Message Rendering

Messages are parsed into segments.

Segment types

text  
code  

Rendering stack

ReactMarkdown  
Prism.js  
Custom CodeBlock component  

Allows mixed content responses.

---

# Syntax Highlighting

Handled by Prism.js.

Supported languages

HTML  
CSS  
JavaScript  
TypeScript  
JSX  
TSX  

---

# Copy Features

Two copy systems exist.

Copy code block  
Copy full assistant message  

Uses Clipboard API.

---

# Theme System

Supported themes

dark  
light  

Theme classes

.theme-dark  
.theme-light  

Theme switching is CSS class based.

---

# CSS Architecture

Styles are modular.

styles/

index.css  
base.css  
layout.css  
chat.css  
sidebar.css  
document-sidebar.css  
landing.css  

Responsibilities

index.css → imports  
base.css → reset and utilities  
layout.css → app shell layout  
chat.css → chat UI  
sidebar.css → left sidebar  
document-sidebar.css → right sidebar  

---

# AI Modification Rules

AI must follow these rules.

Prefer small targeted changes.

Do not rewrite large components unless necessary.

Preserve conversation lifecycle.

Preserve streaming architecture.

Do not duplicate styling systems.

Keep CSS modular.

Avoid renaming files unnecessarily.

Preserve sidebar responsive behaviour.

Respect component ownership.

Do not add animated canvases or heavy visual effects to the chat interface.

Canvas backgrounds are restricted to public authentication pages.

---

# Safe Modification Strategy

When modifying Nexora

identify the feature being changed  
identify the owning file  
determine whether the change is UI logic or styling  
apply the smallest valid change  
avoid touching unrelated files  

---

# Performance Strategy

Nexora aims to remain lightweight.

Strategies

local AI models  
streaming responses  
minimal global state  
local persistence  
simple component hierarchy  

---

# Running Nexora

Install dependencies

npm install

Start development server

npm run dev

Application runs at

http://localhost:5173

---

# Ollama Setup

Pull model

ollama pull llama3.2:3b

Run model

ollama run llama3.2:3b

---

# Maintainer

Armin

Nexora is an experimental local AI coding assistant focused on learning and local AI development.
```