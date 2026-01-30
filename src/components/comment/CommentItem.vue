<template>
  <div class="rounded-md bg-sky-100 px-3 py-2">
    <p class="italic">"{{ comment.content }}"</p>

    <div class="mt-1 text-sm text-gray-600">
      par <strong>{{ comment.author.username }}</strong>
      • le {{ formatDateTime(comment.publishedAt) }}
    </div>
  </div>

  <!-- 🔁 ENFANTS -->
  <div
    v-if="comment.children && comment.children.length"
    class="mt-3 ml-6 space-y-3 border-l-2 border-sky-300 pl-4"
  >
    <CommentItem
      v-for="child in comment.children"
      :key="child['@id']"
      :comment="child"
    />
  </div>
</template>

<script setup lang="ts">
import { formatDateTime } from '@/utils/date'

defineProps<{
  comment: any
}>()
</script>
