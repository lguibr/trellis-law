<template>
  <div class="loader" />
</template>

<script lang="ts">
export default { name: "Spinner" };
</script>

<style scoped>
.loader {
  width: 60vw;
  height: 60vh;
  border: 5px solid #000;
  padding: 0 8px;
  box-sizing: border-box;
  background:
    linear-gradient(#fff 0 0) 0 0/8px 20px,
    linear-gradient(#fff 0 0) 100% 0/8px 20px,
    radial-gradient(farthest-side, #fff 90%, #0000) 0 5px/8px 8px content-box,
    #000;
  background-repeat: no-repeat;
  animation: l3 1.5s infinite linear;
}

@keyframes l3 {
  25% {
    background-position:
      0 0,
      100% 100%,
      100% calc(100% - 5px);
  }

  50% {
    background-position:
      0 100%,
      100% 100%,
      0 calc(100% - 5px);
  }

  75% {
    background-position:
      0 100%,
      100% 0,
      100% 5px;
  }
}
</style>
