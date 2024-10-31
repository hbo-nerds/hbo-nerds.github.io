<template>
  <!-- main -->
  <main class="pt-3 pb-5">
    <div class="row justify-content-center gap-3">
      <div class="col-md-7">
        <article class="mb-4">
          <h3 class="fw-lighter fs-5 mb-3">Over</h3>
          <div class="card rounded-3 bg-body">
            <div class="card-body p-4">
              <p>
                Welkom bij Lekker Speuren, dé zoekmachine voor alle content van het populaire Twitch
                en YouTube-kanaal Lekker Spelen! Gedreven door onze passie voor het kanaal hebben we
                één plek gecreëerd waar je video's, podcasts en streams kunt vinden.
              </p>
              <p>
                Lekker Spelen draait om plezier, humor en het samenbrengen van de community met
                epische gameplays en hilarische interacties. Met Lekker Speuren maken we deze
                ervaring nog toegankelijker. Zoek je favoriete video’s, beleef streams opnieuw, en
                geniet van alles wat Lekker Spelen te bieden heeft!
              </p>
              <p>Namens het team, veel speurplezier!</p>
            </div>
          </div>
        </article>
        <article class="mb-4">
          <h3 class="fw-lighter fs-5 mb-3">Help</h3>
          <!-- QA -->
          <Accordion class="mb-5" />
          <!-- Community -->
          <div class="card bg-body">
            <div class="card-body p-4 p-md-5 text-center">
              <h3>Meer hulp nodig?</h3>
              <p>De community is er voor je:</p>
              <div class="row justify-content-center">
                <div class="col-12 col-md-8">
                  <a
                    class="d-flex align-items-center gap-3 rounded-4 bg-body-tertiary p-3 shadow-lg text-decoration-none"
                    href="https://www.reddit.com/r/lekkerspelen/"
                    target="_blank"
                  >
                    <i class="fs-2 bi bi-people"></i>
                    <div class="text-body text-start">
                      <span class="d-block">Stel je vraag in de subreddit</span>
                      <span class="fw-lighter">Krijg antwoord van communityleden</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </article>
        <article class="mb-4">
          <h3 class="fw-lighter fs-5 mb-3">Credits</h3>
          <!-- Credits -->
          <div class="card rounded-3 bg-body mb-5">
            <div class="card-body p-4">
              <div class="mb-3">
                <div class="small"><i class="me-2 bi bi-bug"></i>Dev team:</div>
                <template v-for="(p, i) in devTeam">
                  {{ p }} {{ i < devTeam.length - 1 ? "| " : "" }}
                </template>
              </div>

              <div class="mb-3">
                <div class="small"><i class="me-2 bi bi-clipboard-data"></i>Data team:</div>
                <template v-for="(p, i) in dataTeam">
                  {{ p }} {{ i < dataTeam.length - 1 ? "| " : "" }}
                </template>
              </div>

              <div class="mb-3">
                <div class="small"><i class="me-2 bi bi-lightning-charge"></i>Powered by:</div>
                <div class="d-flex align-items-center gap-2">
                  <a target="_blank" href="https://vuejs.org/">
                    <img width="20" src="@/assets/img/vue-icon.svg" alt="Vue icon" />
                  </a>
                  <span>+</span>
                  <a target="_blank" href="https://getbootstrap.com/">
                    <img width="20" src="@/assets/img/bootstrap-icon.png" alt="Vue icon" />
                  </a>
                </div>
              </div>

              <a href="https://www.buymeacoffee.com/superruudje" target="_blank">
                <img
                  src="https://img.buymeacoffee.com/button-api/?text=Buy us a coffee&emoji=☕&slug=superruudje&button_colour=FFDD00&font_colour=000000&font_family=Poppins&outline_colour=000000&coffee_colour=ffffff"
                  alt="bmc-btn"
                />
              </a>
            </div>
          </div>
          <!-- Community -->
          <div class="card bg-body">
            <div class="card-body p-4 p-md-5 text-center">
              <h3>Ook bijdragen?</h3>
              <p>Samen sta je sterker dan alleen:</p>
              <div class="row justify-content-center">
                <div class="col-12 col-md-8">
                  <a
                    class="d-flex align-items-center gap-3 rounded-4 bg-body-tertiary p-3 shadow-lg text-decoration-none"
                    href="https://github.com/hbo-nerds"
                    target="_blank"
                  >
                    <i class="fs-2 bi bi-github"></i>
                    <div class="text-body text-start">
                      <span class="d-block">Bijdragen of gewoon benieuwd</span>
                      <span class="fw-lighter">Bekijk het project op GitHub</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </main>
</template>

<script setup>
import Accordion from "@/components/QA/Accordion.vue";

const dataTeam = ["Braxshinoa", "Sheepolution"];
const devTeam = ["Superruudje", "Krekkie"];
</script>

<style scoped></style>
