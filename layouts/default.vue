<script lang="ts" setup>
useHead({
  title: 'Hey, I\'m Picunada',
  meta: [
    {
      name: 'description',
      content: 'Creative Web Developer.',
    },
  ],
})

onMounted(() => {
  if ('scrollRestoration' in window.history)
    window.history.scrollRestoration = 'auto'
})
</script>

<template>
  <ShaderBackground />
  <Preloader />
  <AppHeader />
  <div class="page-wrapper">
    <slot />
  </div>

  <Cursor />
  <ShaderDebug />
</template>
