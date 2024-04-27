<template>
    <div class="items d-flex flex-column">
        <router-link to="/" class="item text-decoration-none py-3 rounded-3">
            <div class="d-flex flex-column align-items-center text-body">
                <i class="bi bi-house-door fs-5"></i>
                <i class="active bi bi-house-door-fill fs-5"></i>
                <span class="fs-7">Home</span>
            </div>
        </router-link>
        <router-link to="/series" class="item text-decoration-none py-3 rounded-3">
            <div class="d-flex flex-column align-items-center text-body">
                <i class="bi bi-collection-play fs-5"></i>
                <i class="active bi bi-collection-play-fill fs-5"></i>
                <span class="fs-7">Series</span>
            </div>
        </router-link>
        <router-link to="/you" class="item text-decoration-none py-3 rounded-3">
            <div class="d-flex flex-column align-items-center text-body">
                <i class="bi bi-play-btn fs-5"></i>
                <i class="active bi bi-play-btn-fill fs-5"></i>
                <span class="fs-7">You</span>
            </div>
        </router-link>
    </div>
</template>

<script setup>
</script>

<style scoped lang="css">
.item {
    width: 64px;
    &:hover {
        background-color: rgba(var(--bs-tertiary-bg-rgb));
    }
    &.router-link-active {
        i:not(.active) {
            display: none;
        }
        i.active {
            display: block;
        }
    }
    i.active {
        display: none;
    }
}
</style>