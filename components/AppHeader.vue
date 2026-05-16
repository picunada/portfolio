<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'

const isMobile = useMediaQuery('(max-width: 678px)')
</script>

<template>
  <header>
    <div class="header-wrapper">
      <NuxtLink v-if="isMobile" to="/">
        <div class="logo mouse-sm">
          Picunada
        </div>
      </NuxtLink>
      <NuxtLink v-else to="/">
        <div class="logo mouse-sm">
          Picunada - Backend Engineer
        </div>
      </NuxtLink>
      <nav class="navigation">
        <CustomLink link="https://github.com/picunada" target="_blank">
          <p class="mouse-sm">
            Github
          </p>
        </CustomLink>
        <CustomLink link="https://www.linkedin.com/in/daniil-bezuglov/" target="_blank">
          <p class="mouse-sm">
            LinkedIn
          </p>
        </CustomLink>
        <CustomLink link="https://twitter.com/SonzuXlayst" target="_blank">
          <p class="mouse-sm">
            Twitter
          </p>
        </CustomLink>
        <CustomLink link="/resume.pdf" download="Daniil_Bezuglov(@picunada).pdf">
          <p class="mouse-sm">
            Resume
          </p>
        </CustomLink>
      </nav>
    </div>
  </header>
</template>

<style lang="scss" scoped>
header {
  position: fixed;
  width: 100vw;
  font-size: 0.9rem;
  z-index: 10;
}

.header-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  width: 100%;

  @media only screen and (max-width: 678px) {
    padding: 8px 12px;
  }
}

.navigation {
  display: flex;
  gap: 24px;
  font-weight: 600;

  @media only screen and (max-width: 678px) {
    gap: 8px;
  }
}

.logo {
  font-weight: 600;
}
</style>
