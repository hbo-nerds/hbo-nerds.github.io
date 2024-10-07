<template>
  <nav class="mobile-menubar d-sm-none fixed-bottom border-top pb-4 px-3">
    <ul class="nav align-items-center justify-content-evenly mb-0">
      <li class="nav-item">
        <RouterLink :to="{ name: 'home' }" class="nav-link text-body">
          <i class="fs-5 lh-1 bi bi-house-door"></i>
          <i class="fs-5 lh-1 bi bi-house-door-fill active"></i>
          <span class="small">Home</span>
        </RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink :to="{ name: 'series' }" class="nav-link text-body">
          <i class="fs-5 lh-1 bi bi-collection-play"></i>
          <i class="fs-5 lh-1 bi bi-collection-play-fill active"></i>
          <span class="small">Series</span>
        </RouterLink>
      </li>
      <li class="nav-item">
        <div class="nav-link">
          <button
            class="btn btn-dark btn-circle rounded-circle border-0"
            type="button"
            @click="startSearch"
          >
            <i class="bi bi-search"></i>
          </button>
        </div>
      </li>
      <li class="nav-item">
        <RouterLink :to="{ name: 'about' }" class="nav-link text-body">
          <i class="fs-5 lh-1 bi bi-question-circle"></i>
          <i class="fs-5 lh-1 bi bi-question-circle-fill active"></i>
          <span class="small">Over</span>
        </RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink :to="{ name: 'you' }" class="nav-link text-body">
          <i class="fs-5 lh-1 bi bi-person"></i>
          <i class="fs-5 lh-1 bi bi-person-fill active"></i>
          <span class="small">Jij</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup>
/**
 * On mobile, activate the search input and focus on it.
 */
function startSearch() {
  const el = document.getElementById("mobile-search-btn");
  if (el) el.click();
}
</script>

<style scoped>
.mobile-menubar {
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 1000;
  backdrop-filter: blur(8px);
}
.nav {
  display: flex;
  flex-direction: row;
  width: 100%;
}
.nav-item {
  flex: 1;
  display: flex;
  justify-content: center;
}

.nav-link {
  text-align: center;
  font-size: 14px;
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

.nav-link i {
  display: block;
}
</style>
