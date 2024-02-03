<template>
    <h6 class="fw-bold mb-2">Verfijn resultaten</h6>
    <div class="mb-3">
        <!-- type -->
        <div class="mb-3">
            <label class="form-label small">Type</label>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                <label class="form-check-label" for="flexCheckDefault">
                    Podcast
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked">
                <label class="form-check-label" for="flexCheckChecked">
                    Video
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked">
                <label class="form-check-label" for="flexCheckChecked">
                    Stream
                </label>
            </div>
        </div>
        <hr>

        <!-- date -->
        <div class="mb-3">
            <label class="form-label">Datum</label>
            <div>
                <label for="afterDate" class="form-label small">Na:</label>
                <input type="date" class="form-control" id="afterDate">
            </div>
            <div>
                <label for="beforeDate" class="form-label small">Voor:</label>
                <input type="date" class="form-control" id="beforeDate">
            </div>
        </div>
        <hr>

        <!-- duration -->
        <div class="mb-3">
            <label class="form-label small">Duur</label>
            <div class="input-group">
                <input type="number" class="form-control" placeholder="0 min">
                <span class="input-group-text"><i class="bi bi-arrows"></i></span>
                <input type="number" class="form-control" placeholder="60 min">
            </div>
        </div>
        <hr>
    </div>
</template>

<script setup>

</script>

<style scoped>

</style>