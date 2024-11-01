<template>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button
        aria-controls="collapseOne"
        aria-expanded="false"
        class="accordion-button collapsed"
        data-bs-target="#QA_playlist"
        data-bs-toggle="collapse"
        type="button"
      >
        Playlists maken en beheren
      </button>
    </h2>
    <div id="QA_playlist" class="accordion-collapse collapse" data-bs-parent="#accordionQA">
      <div class="accordion-body">
        <p>
          Een playlist is een verzameling video's en/of streams. Iedereen kan playlists maken. Jouw
          gemaakt playlists zijn te vinden op de 'Jij' pagina.
        </p>
        <!-- devices -->
        <ul class="nav nav-underline mb-3">
          <li class="nav-item">
            <button
              :class="{ active: device === 'desktop' }"
              class="nav-link"
              @click="device = 'desktop'"
            >
              Computer
            </button>
          </li>
          <li class="nav-item">
            <button
              :class="{ active: device === 'smartphone' }"
              class="nav-link"
              @click="device = 'smartphone'"
            >
              Smartphone
            </button>
          </li>
        </ul>
        <!-- content -->
        <div class="tab-content">
          <div class="d-flex flex-column gap-3" role="tabpanel" tabindex="0">
            <img
              v-if="device === 'desktop'"
              class="w-50 m-auto mb-4"
              src="@/assets/img/qa/qa_playlist_desktop.gif"
              alt="create_playlist"
            />
            <img
              v-else
              class="w-25 m-auto mb-4"
              src="@/assets/img/qa/qa_playlist_mobile.gif"
              alt="create_playlist"
            />
            <h3 class="fs-5">Een afspeellijst maken</h3>
            <ol>
              <li>Zoek naar de video of stream die je in de afspeellijst wilt opnemen.</li>
              <li>
                Klik op <strong>Meer</strong>&nbsp;<i class="bi bi-three-dots-vertical"></i>&nbsp;<i
                  class="bi bi-chevron-right"
                ></i
                >&nbsp;<strong>Bewaar in afspeellijst</strong>&nbsp;<i class="bi bi-bookmark"></i
                >&nbsp;<i class="bi bi-chevron-right"></i>&nbsp;<strong
                  >Maak nieuwe afspeellijst</strong
                >&nbsp;<i class="bi bi-plus-lg"></i>&nbsp;<i class="bi bi-chevron-right"></i> voer
                een naam in voor de playlist.
              </li>
              <li>
                Klik op <strong>Creëren</strong>. De video of stream wordt automatisch in de nieuwe
                afspeellijst geplaatst.
              </li>
            </ol>
            <h3 class="fs-5">Een afspeellijst beheren</h3>
            <h4 class="fs-6 fw-bolder">Content opslaan in een afspeellijst</h4>
            <ol>
              <li>Zoek naar de video of stream die je in de afspeellijst wilt opnemen.</li>
              <li>
                Klik op <strong>Meer</strong>&nbsp;<i class="bi bi-three-dots-vertical"></i>&nbsp;<i
                  class="bi bi-chevron-right"
                ></i
                >&nbsp;<strong>Bewaar in afspeellijst</strong>&nbsp;<i class="bi bi-bookmark"></i
                >&nbsp;<i class="bi bi-chevron-right"></i> selecteer een afspeellijst die je al hebt
                gemaakt.
              </li>
              <li>
                Onderaan het scherm verschijnt een bericht waarin staat aan welke afspeellijst de
                video of stream is toegevoegd.
              </li>
            </ol>
            <h4 class="fs-6 fw-bolder">Een afspeellijst bewerken</h4>
            <ol>
              <li>
                Ga naar de weergavepagina van een video of stream die je in de afspeellijst wilt
                opnemen.
              </li>
              <li>
                Klik op <strong>Bewerken</strong>&nbsp;<i class="bi bi-pencil"></i>&nbsp;om een
                afspeellijst aan te passen.
              </li>
            </ol>
            <h3 class="fs-5">Een afspeellijst verwijderen</h3>
            <ol>
              <li>
                Navigeer naar de 'Jij' pagina en klik op <strong>Alle afspeellijsten</strong>.
              </li>
              <li>
                Ga naar een van je afspeellijsten en klik op <strong>Meer</strong>&nbsp;<i
                  class="bi bi-three-dots-vertical"
                ></i
                >.
              </li>
              <li>Selecteer <strong>Verwijderen</strong>&nbsp;<i class="bi bi-trash"></i>.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const device = ref("desktop");
</script>

<style scoped></style>
