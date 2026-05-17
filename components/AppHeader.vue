<script setup lang="ts">
import { useMediaQuery } from "@vueuse/core";

const isMobile = useMediaQuery("(max-width: 678px)");
</script>

<template>
    <header>
        <div class="header-wrapper">
            <NuxtLink to="/" class="logo mouse-sm">
                {{ isMobile ? "Picunada" : "Picunada — Backend Engineer" }}
            </NuxtLink>
            <span class="divider" aria-hidden="true" />
            <nav class="navigation">
                <CustomLink link="https://github.com/picunada" target="_blank">
                    <span class="nav-item mouse-sm">
                        Github<span class="nav-item__icon">↗</span>
                    </span>
                </CustomLink>
                <CustomLink
                    link="https://www.linkedin.com/in/daniil-bezuglov/"
                    target="_blank"
                >
                    <span class="nav-item mouse-sm">
                        LinkedIn<span class="nav-item__icon">↗</span>
                    </span>
                </CustomLink>
                <CustomLink
                    link="/resume.pdf"
                    download="Daniil_Bezuglov(@picunada).pdf"
                >
                    <span class="nav-item mouse-sm">
                        Resume<span class="nav-item__icon">↓</span>
                    </span>
                </CustomLink>
            </nav>
        </div>
    </header>
</template>

<style lang="scss" scoped>
header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    padding: 16px 24px;
    font-size: 0.8rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    z-index: 10;

    @media only screen and (max-width: 678px) {
        padding: 10px 12px;
    }
}

%glass-pill {
    background: rgba(20, 20, 24, 0.55);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
}

.header-wrapper {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 8px 16px;
    @extend %glass-pill;

    @media only screen and (max-width: 678px) {
        gap: 10px;
        padding: 6px 10px;
    }
}

.logo {
    font-weight: 600;
}

.divider {
    width: 1px;
    height: 14px;
    background: rgba(255, 255, 255, 0.18);
    flex-shrink: 0;
}

.navigation {
    display: flex;
    align-items: center;
    gap: 20px;
    font-weight: 600;

    @media only screen and (max-width: 678px) {
        gap: 12px;
    }
}

.nav-item {
    display: inline-flex;
    align-items: baseline;
    gap: 3px;
    white-space: nowrap;
}

.nav-item__icon {
    color: $secondary;
    font-size: 0.85em;
    line-height: 1;
}
</style>
