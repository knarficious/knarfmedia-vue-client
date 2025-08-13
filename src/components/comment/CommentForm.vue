<template>
  <form class="py-4" @submit.prevent="emitSubmit">
    <div class="mb-2">
      <label
        for="comment_content"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        Commentaire
      </label>
      <input
        id="comment_content"
        v-model="item.content"
        :class="[
          'mt-1 w-full px-3 py-2 border rounded',
          violations?.content ? 'border-red-500' : 'border-gray-300',
        ]"
        type="text"
        placeholder=""
      />
      <div
        v-if="violations?.content"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        {{ violations.content }}
      </div>
    </div>

    <button
      type="submit"
      class="px-6 py-2 bg-green-500 text-white font-medium rounded shadow-md hover:bg-green-600"
    >
      Enregistrer
    </button>
  </form>
</template>

<script lang="ts" setup>
import { toRef, ref, type Ref } from "vue";
import { formatDateInput } from "@/utils/date";
import type { Comment } from "@/types/comment";
import type { SubmissionErrors } from "@/types/error";

const props = defineProps<{
  values?: Comment;
  errors?: SubmissionErrors;
}>();

const emit = defineEmits<{
  (e: "submit", item: Comment): void;
}>();

const violations = toRef(props, "errors");

let item: Ref<Comment> = ref({});

if (props.values) {
  item.value = {
    ...props.values,
    publishedAt: formatDateInput(props.values.publishedAt),
  };
}

function emitSubmit() {
  emit("submit", item.value);
}
</script>
