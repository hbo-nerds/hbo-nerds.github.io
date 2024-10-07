<template>
  <div class="container-fluid py-4">
    <div class="row gy-3 justify-content-center">
      <div class="col-12 col-md-8 col-xl-6 mb-md-0">
        <SingleCard :card="card" :show-close-btn="false"></SingleCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import SingleCard from "@/components/SingleCard.vue";
import { useContentStore } from "@/stores/content.js";
import { onBeforeMount, ref } from "vue";

import { onBeforeRouteUpdate, useRoute } from "vue-router";
const route = useRoute();
const card = ref(null);

const contentStore = useContentStore();

function updateMeta() {
  const title = contentStore.getCardTitle(card.value);
  const url = `${window.location.host}/item/${card.value["id"]}`;
  document.title = "Lekker Speuren | " + title;
  document.querySelector('meta[name="title"]').setAttribute("content", "Lekker Speuren | " + title);
  document
    .querySelector('meta[property="og:title"]')
    .setAttribute("content", "Lekker Speuren | " + title);
  document
    .querySelector('meta[property="twitter:title"]')
    .setAttribute("content", "Lekker Speuren | " + title);
  document.querySelector('meta[property="og:url"]').setAttribute("content", url);
  document.querySelector('meta[property="twitter:url"]').setAttribute("content", url);
  // document.querySelector('meta[property="og:image"]').setAttribute("content", imgScr.value);
  // document.querySelector('meta[property="twitter:image"]').setAttribute("content", imgScr.value);
}

onBeforeMount(() => {
  card.value = contentStore.getSingleCard(route.params.id);
  updateMeta();
});

onBeforeRouteUpdate((to, from) => {
  card.value = contentStore.getSingleCard(to.params.id);
  window.scrollTo({ top: 0, behavior: "smooth" });
});
</script>
