<script setup>
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'
import { onUnmounted, watch } from 'vue'

import { editorProps } from './editor.js'

const props = defineProps(editorProps)
const emit = defineEmits(['update:modelValue'])

const editor = new Editor({
  content: props.initialContent,
  extensions: [StarterKit, Underline],
})

let html = editor.getHTML()

editor.on('update', () => {
  html = editor.getHTML()
  emit('update:modelValue', html)
})

onUnmounted(() => {
  editor.destroy()
})

watch(
  () => props.modelValue,
  (value) => {
    if (editor.getHTML() === value) {
      return
    }

    editor.commands.setContent(value, false)
  },
)
</script>

<template>
  <div class="n-editor">
    <div class="n-editor-menubar">
      <div v-for="actionName in activeButtons" :key="actionName">
        <button
          v-if="actionName === 'bold'"
          type="button"
          class="n-editor-menubar__button"
          :class="{ 'is-active': editor.isActive('bold') }"
          @click="editor.chain().focus().toggleBold().run()"
        >
          <svg class="n-editor-menubar__button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>text-bold</title>
            <path
              d="M17.2 11A6.3 6.3 0 0 0 12.8.2H4.3a1.3 1.3 0 0 0 0 2.5h1a.3.3 0 0 1 .3.3v18a.3.3 0 0 1-.3.3h-1a1.3 1.3 0 1 0 0 2.4h10A6.7 6.7 0 0 0 17.2 11Zm-4.4-8.3a3.8 3.8 0 0 1 0 7.6H8.3a.3.3 0 0 1-.2-.3V3a.3.3 0 0 1 .2-.3Zm1.5 18.5h-6a.3.3 0 0 1-.2-.2v-8a.3.3 0 0 1 .2-.2h6a4.2 4.2 0 0 1 0 8.4Z"
            />
          </svg>
        </button>

        <button
          v-if="actionName === 'italic'"
          type="button"
          class="n-editor-menubar__button"
          :class="{ 'is-active': editor.isActive('italic') }"
          @click="editor.chain().focus().toggleItalic().run()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>text-italic</title>
            <path
              d="M22.5.2h-7.6a1.3 1.3 0 0 0 0 2.5h1a.3.3 0 0 1 .3.4l-11.4 18a.5.5 0 0 1-.4.1H1.5a1.3 1.3 0 0 0 0 2.5h7.6a1.3 1.3 0 0 0 0-2.5h-1a.3.3 0 0 1-.3-.3l11.4-18a.5.5 0 0 1 .4-.2h2.9a1.3 1.3 0 0 0 0-2.5Z"
            />
          </svg>
        </button>

        <button
          v-if="actionName === 'strike'"
          type="button"
          class="n-editor-menubar__button"
          :class="{ 'is-active': editor.isActive('strike') }"
          @click="editor.chain().focus().toggleStrike().run()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>text-strike-through</title>
            <path
              d="M23.8 13a1.3 1.3 0 0 0-1.3-1.3h-9a.5.5 0 0 1-.2 0 39 39 0 0 0-2.2-1.5c-2.8-1.7-4.5-3-4.5-4.9 0-2.2 2.2-2.6 3.5-2.6a4.5 4.5 0 0 1 3 .8 2.7 2.7 0 0 1 .5 2v.3a1.3 1.3 0 1 0 2.5 0v-.3A4.9 4.9 0 0 0 15 1.8C14 .8 12.4.2 10.1.2c-3.7 0-6 2-6 5.1 0 2.8 1.9 4.5 4 6a.3.3 0 0 1-.2.4H1.5a1.3 1.3 0 0 0 0 2.5h11a.3.3 0 0 1 .1 0 4.3 4.3 0 0 1 2 3.5c0 3.3-3.5 3.5-4.5 3.5-1.8 0-3.1-.4-3.8-1.1a3.4 3.4 0 0 1-.7-2.7 1.3 1.3 0 0 0-2.5-.3 5.8 5.8 0 0 0 1.3 4.7c1.2 1.3 3.1 2 5.7 2 4.2 0 7-2.5 7-6a6 6 0 0 0-.9-3.2.3.3 0 0 1 .2-.4h6.1a1.3 1.3 0 0 0 1.3-1.2Z"
            />
          </svg>
        </button>

        <button
          v-if="actionName === 'underline'"
          type="button"
          class="n-editor-menubar__button"
          :class="{ 'is-active': editor.isActive('underline') }"
          @click="editor.chain().focus().toggleUnderline().run()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>text-underline</title>
            <path
              d="M22.5 21.2h-21a1.3 1.3 0 0 0 0 2.5h21a1.3 1.3 0 0 0 0-2.5ZM2 2.7h1.3a.3.3 0 0 1 .3.3v8.5a8.4 8.4 0 0 0 16.8 0V3a.3.3 0 0 1 .3-.3H22a1.3 1.3 0 0 0 0-2.5h-5.7a1.3 1.3 0 0 0 0 2.5h1.4a.3.3 0 0 1 .2.3v8.5a6 6 0 0 1-11.8 0V3a.3.3 0 0 1 .2-.3h1.4a1.3 1.3 0 1 0 0-2.5H2a1.3 1.3 0 0 0 0 2.5Z"
            />
          </svg>
        </button>

        <button
          v-if="actionName === 'code'"
          type="button"
          class="n-editor-menubar__button"
          :class="{ 'is-active': editor.isActive('code') }"
          @click="editor.chain().focus().toggleCode().run()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>code</title>
            <path
              d="M9.1 21.6a1.2 1.2 0 0 1-.8-.4L.8 13.6a2.3 2.3 0 0 1 0-3.2l7.5-7.6A1.3 1.3 0 0 1 10 4.6l-6.9 7a.5.5 0 0 0 0 .8l7 7a1.3 1.3 0 0 1-1 2.2ZM14.9 21.6a1.3 1.3 0 0 1-1-2.2l7-7a.5.5 0 0 0 0-.8l-7-7a1.3 1.3 0 0 1 1.8-1.8l7.5 7.6a2.3 2.3 0 0 1 0 3.2l-7.5 7.6a1.2 1.2 0 0 1-.8.4Zm6.5-9.4Z"
            />
          </svg>
        </button>

        <button
          v-if="actionName === 'h1'"
          type="button"
          class="n-editor-menubar__button"
          :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        >
          H1
        </button>

        <button
          v-if="actionName === 'h2'"
          type="button"
          class="n-editor-menubar__button"
          :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        >
          H2
        </button>

        <button
          v-if="actionName === 'h3'"
          type="button"
          class="n-editor-menubar__button"
          :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        >
          H3
        </button>

        <button
          v-if="actionName === 'bulletList'"
          type="button"
          class="n-editor-menubar__button"
          :class="{ 'is-active': editor.isActive('bulletList') }"
          @click="editor.chain().focus().toggleBulletList().run()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>list-bullets</title>
            <circle cx="2.5" cy="4" r="2.5" />
            <path d="M8.5 5H23a1 1 0 0 0 0-2H8.5a1 1 0 0 0 0 2Z" />
            <circle cx="2.5" cy="12" r="2.5" />
            <path d="M23 11H8.5a1 1 0 0 0 0 2H23a1 1 0 0 0 0-2Z" />
            <circle cx="2.5" cy="20" r="2.5" />
            <path d="M23 19H8.5a1 1 0 0 0 0 2H23a1 1 0 0 0 0-2Z" />
          </svg>
        </button>

        <button
          v-if="actionName === 'orderedList'"
          type="button"
          class="n-editor-menubar__button"
          :class="{ 'is-active': editor.isActive('orderedList') }"
          @click="editor.chain().focus().toggleOrderedList().run()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>list-numbers</title>
            <path
              d="M7.8 4.5h15a1 1 0 0 0 0-2h-15a1 1 0 0 0 0 2ZM22.8 11h-15a1 1 0 1 0 0 2h15a1 1 0 0 0 0-2ZM22.8 19.5h-15a1 1 0 0 0 0 2h15a1 1 0 0 0 0-2ZM2.2 17.2a2 2 0 0 0-2 1.5.8.8 0 1 0 1.5.4.5.5 0 1 1 .5.6.8.8 0 1 0 0 1.5.5.5 0 1 1-.5.7.8.8 0 1 0-1.4.4 2 2 0 1 0 3.6-1.7.3.3 0 0 1 0-.2 2 2 0 0 0-1.7-3.2ZM4.3 10.7a2 2 0 0 0-4 0 .8.8 0 0 0 1.4 0 .5.5 0 0 1 1 0 1 1 0 0 1-.2.7L.5 14a.8.8 0 0 0 .5 1.2h2.5a.8.8 0 0 0 0-1.5h-.4a.2.2 0 0 1-.2-.4l.8-1a2.5 2.5 0 0 0 .5-1.6ZM4 5.2h-.3a.3.3 0 0 1-.2-.2V1.6A1.4 1.4 0 0 0 2.1.2h-.6a.8.8 0 0 0 0 1.5h.3A.3.3 0 0 1 2 2v3a.3.3 0 0 1-.3.3h-.2a.8.8 0 0 0 0 1.5H4a.8.8 0 0 0 0-1.5Z"
            />
          </svg>
        </button>

        <button
          v-if="actionName === 'blockquote'"
          type="button"
          class="n-editor-menubar__button"
          :class="{ 'is-active': editor.isActive('blockquote') }"
          @click="editor.chain().focus().toggleBlockquote().run()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>close-quote</title>
            <path
              d="M18.6 4a5 5 0 1 0 0 9.8 4.6 4.6 0 0 0 1-.1.3.3 0 0 1 .3.3 6.8 6.8 0 0 1-5.8 3.6 1.3 1.3 0 0 0 0 2.5 9.7 9.7 0 0 0 9.4-10V9a5 5 0 0 0-5-5ZM6.2 4a5 5 0 0 0 0 9.8 4.6 4.6 0 0 0 1.2-.1.3.3 0 0 1 .2.3 6.8 6.8 0 0 1-5.8 3.6 1.3 1.3 0 0 0 0 2.5 9.7 9.7 0 0 0 9.4-10V9a5 5 0 0 0-5-5Z"
            />
          </svg>
        </button>

        <button
          v-if="actionName === 'codeBlock'"
          type="button"
          class="n-editor-menubar__button"
          :class="{ 'is-active': editor.isActive('codeBlock') }"
          @click="editor.chain().focus().toggleCodeBlock().run()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>angle-brackets</title>
            <path
              d="M9.1 21.6a1.2 1.2 0 0 1-.8-.4L.8 13.6a2.3 2.3 0 0 1 0-3.2l7.5-7.6A1.3 1.3 0 0 1 10 4.6l-6.9 7a.5.5 0 0 0 0 .8l7 7a1.3 1.3 0 0 1-1 2.2ZM14.9 21.6a1.3 1.3 0 0 1-1-2.2l7-7a.5.5 0 0 0 0-.8l-7-7a1.3 1.3 0 0 1 1.8-1.8l7.5 7.6a2.3 2.3 0 0 1 0 3.2l-7.5 7.6a1.2 1.2 0 0 1-.8.4Zm6.5-9.4Z"
            />
          </svg>
        </button>

        <button
          v-if="actionName === 'horizontalRule'"
          type="button"
          class="n-editor-menubar__button"
          @click="editor.chain().focus().setHorizontalRule().run()"
        >
          <svg class="n-editor-menubar__button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>horizontal-rule</title>
            <path d="M5 13a1 1 0 0 1 0-2h14a1 1 0 0 1 0 2H5Z" />
          </svg>
        </button>

        <button
          v-if="actionName === 'undo'"
          class="n-editor-menubar__button"
          type="button"
          @click="editor.chain().focus().undo().run()"
        >
          <svg class="n-editor-menubar__button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>undo</title>
            <path
              d="M17.8 3.8a12.5 12.5 0 0 0-13-.9.2.2 0 0 1-.3 0L2 .3a.5.5 0 0 0-.5-.1.5.5 0 0 0-.3.4v6.7a.5.5 0 0 0 .5.5h6.7a.5.5 0 0 0 .3-.8L6.8 5a.3.3 0 0 1 0-.2.2.2 0 0 1 0-.2 10 10 0 0 1 9.5 1.1 9.8 9.8 0 0 1 .1 15.8 1.3 1.3 0 0 0 1.5 2 12.1 12.1 0 0 0 5-10 12.1 12.1 0 0 0-5.1-9.8Z"
            />
          </svg>
        </button>

        <button
          v-if="actionName === 'redo'"
          class="n-editor-menubar__button"
          type="button"
          @click="editor.chain().focus().redo().run()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>redo</title>
            <path
              d="M22.6.2a.5.5 0 0 0-.5 0L19.5 3a.3.3 0 0 1-.3 0 12.5 12.5 0 0 0-13 .9 12.3 12.3 0 0 0-.1 19.8 1.3 1.3 0 0 0 1.5-2 9.8 9.8 0 0 1 0-15.8 10 10 0 0 1 9.5-1.1.3.3 0 0 1 .1.4L15.4 7a.5.5 0 0 0 .3.8h6.7a.5.5 0 0 0 .5-.5V.6a.5.5 0 0 0-.3-.4Z"
            />
          </svg>
        </button>
      </div>
    </div>

    <EditorContent class="n-editor-content" :editor="editor" />
  </div>
</template>

<style>
.n-editor {
  position: relative;

  /* max-width: 30rem; */

  color: hsl(0deg 0% 0%);

  /* font-size: 18px; */
  line-height: 1.5;

  border: var(--n-sys-border);
}

.n-editor * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizelegibility;
}

.icon {
  position: relative;

  width: 100%;
  height: 100%;
}

.icon.has-align-fix {
  top: -0.1rem;
}

.n-editor-menubar {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  padding: 0.5rem 1rem;

  border-bottom: var(--n-sys-border);

  transition: visibility 0.2s 0.4s, opacity 0.2s 0.4s;
}

.n-editor-menubar.is-hidden {
  visibility: hidden;

  opacity: 0;
}

.n-editor-menubar.is-focused {
  visibility: visible;

  opacity: 1;

  transition: visibility 0.2s, opacity 0.2s;
}

.n-editor-menubar__button {
  display: inline-flex;

  width: 1.8rem;
  height: 1.2rem;
  margin-right: 0.2rem;
  padding: 0.2rem 0.5rem;

  color: hsl(0deg 0% 0%);
  font-weight: 700;
  vertical-align: middle;

  border: 0;
  border-radius: 3px;

  background: transparent;

  cursor: pointer;
}

.n-editor-menubar__button:hover {
  background-color: rgb(0 0 0 / 5%);
}

.n-editor-menubar__button.is-active {
  background-color: rgb(0 0 0 / 10%);
}

.n-editor-content {
  height: 300px;

  font-family: -apple-system, 'Noto Sans', 'Helvetica Neue', Helvetica, 'Nimbus Sans L', Arial, 'Liberation Sans',
    'PingFang SC', 'Hiragino Sans GB', 'Noto Sans CJK SC', 'Source Han Sans SC', 'Source Han Sans CN', 'Microsoft YaHei',
    'Wenquanyi Micro Hei', 'WenQuanYi Zen Hei', 'ST Heiti', SimHei, 'WenQuanYi Zen Hei Sharp', sans-serif;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;

  overflow-y: auto;
}

.n-editor-content * {
  caret-color: currentcolor;
}

.n-editor-content > div {
  height: 100%;
  padding: 0.5rem 1rem;

  line-height: 1.2;

  outline: none;
}

.n-editor-content h1,
.n-editor-content h2,
.n-editor-content h3 {
  line-height: 1.3;
}

.n-editor-content blockquote,
.n-editor-content h1,
.n-editor-content h2,
.n-editor-content h3,
.n-editor-content ol,
.n-editor-content p,
.n-editor-content pre,
.n-editor-content ul {
  margin: 0.2rem 0;
}

.n-editor-content pre {
  padding: 0.7rem 1rem;

  color: hsl(0deg 0% 100%);
  font-size: 0.8rem;

  border-radius: 5px;

  background: hsl(0deg 0% 0%);

  overflow-x: auto;
}

.n-editor-content pre code {
  display: block;
}

.n-editor-content p code {
  padding: 0.2rem 0.4rem;

  color: rgb(0 0 0 / 80%);
  font-weight: 700;
  font-size: 0.8rem;

  border-radius: 5px;

  background: rgb(0 0 0 / 10%);
}

.n-editor-content ol,
.n-editor-content ul {
  padding-left: 1rem;
}

.n-editor-content li > ol,
.n-editor-content li > p,
.n-editor-content li > ul {
  margin: 0;
}

.n-editor-content a {
  color: inherit;
}

.n-editor-content blockquote {
  padding-left: 0.8rem;

  color: rgb(0 0 0 / 80%);
  font-style: italic;

  border-left: 3px solid rgb(0 0 0 / 10%);
}

.n-editor-content blockquote p {
  margin: 0;
}

.n-editor-content img {
  max-width: 100%;

  border-radius: 3px;
}

.n-editor-content table {
  width: 100%;
  margin: 0;

  border-collapse: collapse;

  table-layout: fixed;

  overflow: hidden;
}

.n-editor-content table td,
.n-editor-content table th {
  position: relative;

  min-width: 1em;
  padding: 3px 5px;
  box-sizing: border-box;

  vertical-align: top;

  border: 2px solid hsl(0deg 0% 87%);
}

.n-editor-content table td > *,
.n-editor-content table th > * {
  margin-bottom: 0;
}

.n-editor-content table th {
  font-weight: 700;
  text-align: left;
}

.n-editor-content table .selectedCell::after {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  content: '';
  z-index: 2;

  background: rgb(200 200 255 / 40%);

  pointer-events: none;
}

.n-editor-content table .column-resize-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  right: -2px;
  z-index: 20;

  width: 4px;

  background-color: hsl(204deg 100% 83%);

  pointer-events: none;
}

.n-editor-content .tableWrapper {
  margin: 1em 0;

  overflow-x: auto;
}

.n-editor-content .resize-cursor {
  cursor: ew-resize;
  cursor: col-resize;
}

.n-editor-content blockquote:first-child,
.n-editor-content h1:first-child,
.n-editor-content h2:first-child,
.n-editor-content h3:first-child,
.n-editor-content ol:first-child,
.n-editor-content p:first-child,
.n-editor-content pre:first-child,
.n-editor-content ul:first-child {
  margin-top: 0;
}

.n-editor-content blockquote:last-child,
.n-editor-content h1:last-child,
.n-editor-content h2:last-child,
.n-editor-content h3:last-child,
.n-editor-content ol:last-child,
.n-editor-content p:last-child,
.n-editor-content pre:last-child,
.n-editor-content ul:last-child {
  margin-bottom: 0;
}
</style>
