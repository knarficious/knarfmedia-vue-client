<template>
  <div class="space-y-4">
    <CommentItem
      v-for="comment in rootComments"
      :key="comment['@id']"
      :comment="comment"
    />
  </div>
</template>

<script setup lang="ts">
import CommentItem from '@/components/comment/CommentItem.vue'

const props = defineProps<{
  comments: any[]
}>()

// 🧠 UNIQUEMENT les commentaires racine
const rootComments = props.comments.filter(
  comment => !comment.parent
)
</script>
