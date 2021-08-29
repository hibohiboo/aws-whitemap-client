<template>
  <Main />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Main from '@/components/pages/layout/Main.vue';

export default defineComponent({
  name: 'App',
  components: {
    Main,
  },
});
</script>

<style lang="scss">
body {
  background-color: var(--surface-ground);
  color: var(--text-color);
}
a {
  color: var(--text-color);
}
</style>
