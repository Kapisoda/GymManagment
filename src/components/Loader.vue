<template>
  <div class="loader">
    <p class="loader__inner">Loading...</p>
  </div>
</template>


<script>
export default {
  name: 'Loader'
}
</script>

<style lang="scss" scoped>
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .loader {
    padding: 100px;
  }

  .loader__inner {
    width: 30px;
    height: 30px;
    border: 3px solid #43C69C;
    border-radius: 50%;
    margin: 0 auto;
    border-right: 3px solid transparent;
    font-size: 0;
    animation: 500ms rotate infinite linear;
  }
</style>
