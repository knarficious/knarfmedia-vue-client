<template>
  <form class="py-4" @submit.prevent="emitSubmit">
    <div class="mb-2">
      <label
        for="user_username"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        Nom d'utilisateur
      </label>
      <input
        id="user_username"
        v-model="item.username"
        :class="[
          'mt-1 w-full px-3 py-2 border rounded',
          violations?.username ? 'border-red-500' : 'border-gray-300',
        ]"
        type="text"
        required
        placeholder=""
      />
      <div
        v-if="violations?.username"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        {{ violations.username }}
      </div>
    </div>
    <div class="mb-2">
      <label
        for="user_email"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        email
      </label>
      <input
        id="user_email"
        v-model="item.email"
        :class="[
          'mt-1 w-full px-3 py-2 border rounded',
          violations?.email ? 'border-red-500' : 'border-gray-300',
        ]"
        type="text"
        required
        placeholder=""
      />
      <div
        v-if="violations?.email"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        {{ violations.email }}
      </div>
    </div>
    <div class="mb-2">
      <label
        for="user_plainPassword"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        Mot de passe
      </label>
      <input
        id="user_plainPassword"
        v-model="item.plainPassword"
        :class="[
          'mt-1 w-full px-3 py-2 border rounded',
          violations?.plainPassword ? 'border-red-500' : 'border-gray-300',
        ]"
        type="password"
        required
        placeholder=""
      /> <font-awesome-icon icon="eye" id="eye" @click="togglePassword"/> 
      <div
        v-if="violations?.plainPassword"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        {{ violations.plainPassword }}
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
import type { User } from "@/types/user";
import type { SubmissionErrors } from "@/types/error";

const props = defineProps<{
  values?: User;
  errors?: SubmissionErrors;
}>();

const emit = defineEmits<{
  (e: "submit", item: User): void;
}>();

const violations = toRef(props, "errors");

let item: Ref<User> = ref({});

if (props.values) {
  item.value = {
    ...props.values,
  };
}

function togglePassword() {
  const input = document.getElementById("user_plainPassword");
  if (input?.getAttribute("type") === "password") {
    input?.setAttribute("type", "text");
  }
  else if(input?.getAttribute("type") === "text") {
    input.setAttribute("type", "password");
  }
}

function emitSubmit() {
  emit("submit", item.value);
}
</script>
