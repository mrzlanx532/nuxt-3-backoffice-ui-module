<script setup lang="ts">
import { useNuxtApp } from '#app'

const { $modal } = useNuxtApp()

definePageMeta({
  layout: 'default',
})

async function openModal() {
  await $modal.load('ExampleModal')
}
</script>

<template>
  <div>
    <div style="margin-top: 10px;"><code>Для дебага в playground: Необходимо изменить путь </code></div>
    <div style="margin-top: 10px;">
      <button type="button" @click="openModal">Открыть модалку по пути: @/modals/ExampleModal</button>
    </div>
  </div>
  <div style="height: 1200px; width: 1900px; margin-top: 10px;">
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur dolores est fuga incidunt iure maiores, maxime natus necessitatibus non odit officia quos tenetur voluptas voluptatum. Atque excepturi sint voluptas.
  </div>
</template>
