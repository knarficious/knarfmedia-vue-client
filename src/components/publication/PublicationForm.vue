<template>
  <form class="py-4" @submit.prevent="emitSubmit">
    <div class="mb-2">
      <label
        for="publication_title"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        title
      </label>
      <input
        id="publication_title"
        v-model="item.title"
        :class="[
          'mt-1 w-full px-3 py-2 border rounded',
          violations?.title ? 'border-red-500' : 'border-gray-300',
        ]"
        type="text"
        placeholder=""
      />
      <div
        v-if="violations?.title"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        {{ violations.title }}
      </div>
    </div>
    <div class="mb-2">
      <label
        for="publication_summary"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        summary
      </label>
      <input
        id="publication_summary"
        v-model="item.summary"
        :class="[
          'mt-1 w-full px-3 py-2 border rounded',
          violations?.summary ? 'border-red-500' : 'border-gray-300',
        ]"
        type="text"
        placeholder=""
      />
      <div
        v-if="violations?.summary"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        {{ violations.summary }}
      </div>
    </div>
    <div class="mb-2">
      <label
        for="publication_content"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        content
      </label>
      <input
        id="publication_content"
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
    <div class="mb-2">
      <label
        for="publication_tags"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        tags
      </label>
      <FormRepeater
        :values="item.tags"
        @update="(values: any[]) => (item.tags = values)"
      />
      <div
        v-if="violations?.tags"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        {{ violations.tags }}
      </div>
    </div>
    <div class="mb-2">
      <label
        for="publication_filePath"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        filePath
      </label>
      <input
        id="publication_filePath"
        v-model="item.filePath"
        :class="[
          'mt-1 w-full px-3 py-2 border rounded',
          violations?.filePath ? 'border-red-500' : 'border-gray-300',
        ]"
        type="text"
        placeholder=""
      />
      <div
        v-if="violations?.filePath"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        {{ violations.filePath }}
      </div>
    </div>

    <button
      type="submit"
      class="px-6 py-2 bg-green-500 text-white font-medium rounded shadow-md hover:bg-green-600"
    >
      Submit
    </button>
  </form>
</template>

<script lang="ts" setup>
import { toRef, ref, type Ref } from "vue";
import FormRepeater from "@/components/common/FormRepeater.vue";
import { formatDateInput } from "@/utils/date";
import type { Publication } from "@/types/publication";
import type { SubmissionErrors } from "@/types/error";

const props = defineProps<{
  values?: Publication;
  errors?: SubmissionErrors;
}>();

const emit = defineEmits<{
  (e: "submit", item: Publication): void;
}>();

const violations = toRef(props, "errors");

let item: Ref<Publication> = ref({});

if (props.values) {
  item.value = {
    ...props.values,
    publishedAt: formatDateInput(props.values.publishedAt),
    updatedAt: formatDateInput(props.values.updatedAt),
  };
}

function emitSubmit() {
  emit("submit", item.value);
}
</script>
