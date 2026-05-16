<script setup lang="ts">
import { useMediaQuery } from "@vueuse/core";

const isMobile = useMediaQuery("(max-width: 678px)");
</script>

<template>
    <header>
        <div class="header-wrapper">
            <NuxtLink v-if="isMobile" to="/">
                <div class="logo mouse-sm">Picunada</div>
            </NuxtLink>
            <NuxtLink v-else to="/">
                <div class="logo mouse-sm">Picunada - Backend Engineer</div>
            </NuxtLink>
            <nav class="navigation">
                <CustomLink link="https://github.com/picunada" target="_blank">
                    <p class="mouse-sm">Github</p>
                </CustomLink>
                <CustomLink
                    link="https://www.linkedin.com/in/daniil-bezuglov/"
                    target="_blank"
                >
                    <p class="mouse-sm">LinkedIn</p>
                </CustomLink>
                <CustomLink
                    link="https://twitter.com/SonzuXlayst"
                    target="_blank"
                >
                    <p class="mouse-sm">Twitter</p>
                </CustomLink>
                <CustomLink
                    link="/resume.pdf"
                    download="Daniil_Bezuglov(@picunada).pdf"
                >
                    <p class="mouse-sm">Resume</p>
                </CustomLink>
            </nav>
        </div>
    </header>
</template>

<style lang="scss" scoped>
header {
    position: fixed;
    width: 100vw;
    font-size: 0.8rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
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

%glass-pill {
    background: rgba(20, 20, 24, 0.18);
    backdrop-filter: blur(18px) saturate(140%);
    -webkit-backdrop-filter: blur(18px) saturate(140%);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
    opacity: 0.9;
}

.navigation {
    display: flex;
    gap: 24px;
    font-weight: 600;
    padding: 8px 16px;
    @extend %glass-pill;

    @media only screen and (max-width: 678px) {
        gap: 8px;
        padding: 6px 10px;
    }
}

.logo {
    font-weight: 600;
    padding: 8px 16px;
    @extend %glass-pill;

    @media only screen and (max-width: 678px) {
        padding: 6px 10px;
    }
}
</style>
