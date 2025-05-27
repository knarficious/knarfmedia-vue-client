<template>
  <div class="tiptap-editor">
    <div class="editor-toolbar">
      <button 
        type="button" 
        @click="toggleBold" 
        :class="{ 'is-active': isActive('bold') }" 
        class="editor-button"
        title="Bold"
      >
        B
      </button>
      <button 
        type="button" 
        @click="toggleItalic" 
        :class="{ 'is-active': isActive('italic') }" 
        class="editor-button"
        title="Italic"
      >
        I
      </button>
      <button 
        type="button" 
        @click="() => toggleHeading(1)" 
        :class="{ 'is-active': isActive('heading', { level: 1 }) }" 
        class="editor-button"
        title="Heading 1"
      >
        H1
      </button>
      <button 
        type="button" 
        @click="() => toggleHeading(2)" 
        :class="{ 'is-active': isActive('heading', { level: 2 }) }" 
        class="editor-button"
        title="Heading 2"
      >
        H2
      </button>
      <button 
        type="button" 
        @click="() => toggleHeading(3)" 
        :class="{ 'is-active': isActive('heading', { level: 3 }) }" 
        class="editor-button"
        title="Heading 3"
      >
        H3
      </button>
      <button 
        type="button" 
        @click="toggleBulletList" 
        :class="{ 'is-active': isActive('bulletList') }" 
        class="editor-button"
        title="Bullet List"
      >
        •
      </button>
      <button 
        type="button" 
        @click="toggleOrderedList" 
        :class="{ 'is-active': isActive('orderedList') }" 
        class="editor-button"
        title="Numbered List"
      >
        1.
      </button>
      <button 
        type="button" 
        @click="setLink" 
        :class="{ 'is-active': isActive('link') }" 
        class="editor-button"
        title="Link"
      >
        🔗
      </button>
    </div>

    <editor-content :editor="editor" class="editor-content" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, defineProps, watch } from 'vue'
import { Editor, EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'

const props = defineProps<{
  modelValue?: string
  placeholder?: string
}>()

const emit = defineEmits(['update:modelValue'])

// Set up the TipTap editor
const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-link underline',
      },
    }),
    Placeholder.configure({
      placeholder: props.placeholder || 'Write something...',
    }),
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

// Watch for external changes to modelValue
watch(
  () => props.modelValue,
  (newContent) => {
    if (editor.value && newContent && editor.value.getHTML() !== newContent) {
      editor.value.commands.setContent(newContent, false)
    }
  }
)

// Clean up editor instance when component is unmounted
onBeforeUnmount(() => {
  editor.value?.destroy()
})

// Editor control methods
const toggleBold = () => {
  editor.value?.chain().focus().toggleBold().run()
}

const toggleItalic = () => {
  editor.value?.chain().focus().toggleItalic().run()
}

const toggleHeading = (level: 1 | 2 | 3) => {
  editor.value?.chain().focus().toggleHeading({ level }).run()
}

const toggleBulletList = () => {
  editor.value?.chain().focus().toggleBulletList().run()
}

const toggleOrderedList = () => {
  editor.value?.chain().focus().toggleOrderedList().run()
}

const setLink = () => {
  const url = window.prompt('URL')
  
  if (url) {
    editor.value?.chain().focus().setLink({ href: url }).run()
  } else {
    editor.value?.chain().focus().unsetLink().run()
  }
}

const isActive = (type: string, options = {}) => {
  return editor.value?.isActive(type, options) ?? false
}

</script>


<style scoped>
.tiptap-editor {
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
}

.editor-toolbar {
  display: flex;
  flex-wrap: wrap;
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
  background-color: #f9f9f9;
}

.editor-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  margin-right: 0.25rem;
  margin-bottom: 0.25rem;
  border: none;
  background-color: transparent;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;
}

.editor-button:hover {
  background-color: #eeeeee;
  transform: translateY(-1px);
}

.editor-button.is-active {
  color: #646cff;
  background-color: rgba(100, 108, 255, 0.1);
}

.editor-content {
  padding: 1rem;
  min-height: 200px;
}

.editor-content :deep(.ProseMirror) {
  outline: none;
  min-height: 150px;
}

.editor-content :deep(p) {
  margin: 0.75em 0;
}

.editor-content :deep(h1) {
  font-size: 1.5em;
  font-weight: 600;
  margin: 1em 0 0.5em;
}

.editor-content :deep(h2) {
  font-size: 1.25em;
  font-weight: 600;
  margin: 1em 0 0.5em;
}

.editor-content :deep(h3) {
  font-size: 1.1em;
  font-weight: 600;
  margin: 1em 0 0.5em;
}

.editor-content :deep(ul), 
.editor-content :deep(ol) {
  padding-left: 1.5rem;
  margin: 0.75em 0;
}

.editor-content :deep(li) {
  margin: 0.25em 0;
}

.editor-content :deep(a) {
  color: #646cff;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .tiptap-editor {
    border-color: #333;
  }
  
  .editor-toolbar {
    background-color: #1a1a1a;
    border-color: #333;
  }
  
  .editor-button:hover {
    background-color: #2a2a2a;
  }
}
</style>
