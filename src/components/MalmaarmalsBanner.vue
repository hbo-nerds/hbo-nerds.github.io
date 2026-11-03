<script setup lang="ts"></script>

<template>
    <div class="mmm small">
        <img
            alt="malmaarmals_logo"
            style="width: 24px; border-radius: 4px; margin-right: 2px"
            src="../assets/img/malmaarmals/malmaarmals-icon-60x60.png"
        />
        Oude Twitch streams zijn niet meer beschikbaar op Twitch, wel gearchiveerd op
        <a
            href="https://www.malmaarmals.nl/"
            style="color: hsl(252, 70%, 74%); font-weight: bold; font-style: italic"
            target="_blank"
            >malmaarmals.nl</a
        >
    </div>
</template>

<style lang="scss" scoped>
//
.mmm {
    padding: 2px;
    border-radius: 6px;
    background: linear-gradient(90deg, hsla(252, 30%, 34%, 100%) 0%, hsla(252, 30%, 34%, 0) 60%);
}

@media (max-width: 576px) {
    .mmm {
        padding: 4px;
    }
}
</style>
