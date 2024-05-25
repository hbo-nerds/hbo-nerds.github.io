<template>
    <!-- main -->
    <main class="position-relative py-5">
        <div class="row justify-content-center gap-3">
            <div class="col-7">
                <h3>Welkom bij Lekker Speuren!</h3>
                <p>Wij zijn een groep toegewijde communityleden van het populaire Twitch-kanaal <a href="https://www.twitch.tv/lekkerspelen" target="_blank">Lekker Spelen</a>. Gedreven door onze passie voor het kanaal en de geweldige content die ze produceren, hebben we Lekker Speuren gecreëerd - dé zoekmachine waar je alle video's, podcasts en streams van Lekker Spelen kunt vinden.</p>
                <p>Bij Lekker Spelen draait alles om plezier, humor en het delen van geweldige momenten met de community. Of het nu gaat om epische gameplays, hilarische podcasts of live interacties met kijkers, het kanaal brengt mensen samen en laat hen genieten van de unieke sfeer die alleen Lekker Spelen kan bieden.</p>
                <p>Met Lekker Speuren streven we ernaar om deze ervaring nog toegankelijker te maken. Of je nu op zoek bent naar een specifieke video, een favoriete stream wilt herbeleven of gewoon wat lachtijd nodig hebt, wij hebben het allemaal voor je op één plek verzameld.</p>
                <p>Dus ga er lekker voor zitten, speur naar je favoriete content en laat je meevoeren door de wereld van Lekker Spelen. We zijn er trots op om deel uit te maken van deze geweldige community en hopen dat Lekker Speuren je helpt om nog meer te genieten van alles wat Lekker Spelen te bieden heeft!</p>
                <a href="https://github.com/lekkersicko/lekker-speuren" target="_blank"><i class="bi bi-github me-2"></i>Bekijk het project op GitHub.</a>
                <div class="py-4">
                    <hr/>
                </div>
                <div>
                    <div class="d-flex gap-4">
                        <i class="bi bi-search fs-1"></i>
                        <div>
                            <h5>Hoe kan ik zoeken naar items?</h5>
                            <p>Wil je gerichter zoeken naar content op Lekker Speuren? Gebruik dan onze geavanceerde zoekfunctie!</p>
                            <p>Met de geavanceerde zoekopties kun je je zoekopdracht verfijnen en specifieke resultaten vinden die aan jouw criteria voldoen. Je kunt bijvoorbeeld filteren op ...</p>
                            <p>Om gebruik te maken van de geavanceerde zoekfunctie, klik op de "Geavanceerd zoeken" link naast de zoekbalk. Hier kun je verschillende zoekfilters instellen om je zoekopdracht aan te passen aan jouw behoeften.</p>
                            <p>...</p>
                            <p>Of je nu op zoek bent naar recente video's, oude favorieten wilt terugvinden, of specifieke genres of thema's zoekt, met onze geavanceerde zoekfunctie vind je precies wat je zoekt, snel en efficiënt.</p>
                            <p>Dus ga aan de slag en ontdek de volledige mogelijkheden van Lekker Speuren met onze geavanceerde zoekfunctie!</p>

                        </div>
                    </div>
                </div>
            </div>
            <div class="col-3">
                <h3>Met dank aan</h3>
                <ul class="list-group list-group-flush" style="width: fit-content">
                    <li class="list-group-item bg-transparent" v-for="p in people">{{ p }}</li>
                </ul>
            </div>
        </div>
    </main>
</template>

<script setup>
import {computed} from "vue";

const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const people = computed(() => {
    return shuffle([
        'Sheepolution',
        'Superruudje',
        'Braxshinoa',
        'Donnosaurus',
        'Rikels',
    ])
})
</script>

<style scoped></style>
