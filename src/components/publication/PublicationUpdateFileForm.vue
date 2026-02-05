<template>
  <form class="py-4" @submit.prevent="emitSubmit">

    <div v-if="$route.name === 'PublicationFileUpdate'" class="mb-2">
      <label
        for="publication_file"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        Fichier
      </label>
      <input
        id="publication_file"
        :class="[
          'mt-1 w-full px-3 py-2 border rounded',
          violations?.file ? 'border-red-500' : 'border-gray-300',
        ]"
        type="file"
        ref="fileInput"
        placeholder=""
        @change="handleFileUpload"
      />
      <div
        v-if="violations?.file"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        {{ violations.file }}
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
import { toRef, ref, type Ref, onMounted, toRaw } from 'vue';
import { formatDateInput } from "@/utils/date";
import type { Publication } from "@/types/publication";
import type { SubmissionErrors } from "@/types/error";

const props = defineProps<{
  values?: Publication;
  errors?: SubmissionErrors;
}>();

const emit = defineEmits<{
  (e: "submit", item: Publication): void;
  (e: "change", item: Publication): void;
}>();

const violations = toRef(props, "errors");

let item: Ref<Publication> = ref({});

if (props.values) {
  item.value = {
    ...props.values,
    updatedAt: formatDateInput(props.values.updatedAt),
  };
}



function emitSubmit() {
  emit("submit", item.value);
}

function handleFileUpload(event: Event) {
  const { files } = event.target as HTMLInputElement;

  if (files) {
    item.value.file = files[0];
  }

}


</script>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>