<template>
    <div class="bg-dark-subtle">
        <div class="container">
            <nav class="navbar navbar-expand-lg">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#">Lekker Speuren</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                                <a class="nav-link active" aria-current="page" href="#">Home</a>
                            </li>
                        </ul>
                        <div class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="bi bi-sun-fill"></i>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><button class="dropdown-item" :class="{active: store.theme === 'light'}" type="button" @click="switchTheme('light')">Licht</button></li>
                                <li><button class="dropdown-item" :class="{active: store.theme === 'dark'}" type="button" @click="switchTheme('dark')">Donker</button></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    </div>
</template>

<script setup>
import {useGeneralStore} from "@/stores/general.js";

const store = useGeneralStore()

function switchTheme(theme) {
    store.setTheme(theme)
}
</script>

<style scoped></style>