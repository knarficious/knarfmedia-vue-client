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
      <VueMultiSelect
      v-model="item.tags"
          :options="options"
          :multiple="true"
          :close-on-select="false"
          :clear-on-select="false"
          :preserve-search="true"
          placeholder="Pick some"
          label="name"
          track-by="name"
          @update="handleTags"
          >

          </VueMultiSelect>
      <div
        v-if="violations?.tags"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        {{ violations.tags }}
      </div>
    </div>
    <div class="mb-2">
      <label
        for="publication_file"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        file
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
      Submit
    </button>
  </form>
</template>

<script lang="ts" setup>
import { toRef, ref, type Ref, onMounted, onBeforeMount, isProxy, toRaw } from "vue";
import { formatDateInput } from "@/utils/date";
import type { Publication } from "@/types/publication";
import type { SubmissionErrors } from "@/types/error";
import VueMultiSelect from 'vue-multiselect';
import { useTagListStore } from "@/stores/tag/_list";
import { storeToRefs } from "pinia";

const useTagStore = useTagListStore();
const { items } = storeToRefs(useTagStore);

const props = defineProps<{
  values?: Publication;
  errors?: SubmissionErrors;
}>();

const fileInput: Ref<Publication> = ref({});

onMounted( () => {
  useTagStore.getItems();
})
  

const emit = defineEmits<{
  (e: "submit", item: Publication): void;
  (e: "change", item: Publication): void;
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

const arr1: any[] = [];
const arr2: any[] = [];

arr1.push(Object.values(toRaw(items.value)));
console.log("Array= ", arr1);

let options: any[] = [];
for (let index = 0; index < arr1.length; index++) {
  options = arr1[index];
}

function handleTags() {
  arr2.push(Object.values(toRaw(items.value)));
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
