<template>
  <form class="py-4" @submit.prevent="emitSubmit">
    <div class="mb-2">
      <label
        for="tag_name"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        name
      </label>
      <input
        id="tag_name"
        v-model="item.name"
        :class="[
          'mt-1 w-full px-3 py-2 border rounded',
          violations?.name ? 'border-red-500' : 'border-gray-300',
        ]"
        type="text"
        placeholder=""
      />
      <div
        v-if="violations?.name"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        {{ violations.name }}
      </div>
    </div>
    <div class="mb-2">
      <label
        for="tag_id"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        id
      </label>
      <input
        id="tag_id"
        v-model="item.id"
        :class="[
          'mt-1 w-full px-3 py-2 border rounded',
          violations?.id ? 'border-red-500' : 'border-gray-300',
        ]"
        type="text"
        placeholder=""
      />
      <div
        v-if="violations?.id"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        {{ violations.id }}
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
import type { Tag } from "@/types/tag";
import type { SubmissionErrors } from "@/types/error";

const props = defineProps<{
  values?: Tag;
  errors?: SubmissionErrors;
}>();

const emit = defineEmits<{
  (e: "submit", item: Tag): void;
}>();

const violations = toRef(props, "errors");

let item: Ref<Tag> = ref({});

if (props.values) {
  item.value = {
    ...props.values,
  };
}

function emitSubmit() {
  emit("submit", item.value);
}
</script>
