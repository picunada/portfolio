<script setup lang="ts">
import { useEventListener, useMediaQuery } from "@vueuse/core";

interface Section {
    id: string;
    label: string;
}

const props = defineProps<{
    sections: Section[];
}>();

const { $lenis } = useNuxtApp();

const progress = ref(0);
const activeId = ref(props.sections[0]?.id ?? "");
const isMobile = useMediaQuery("(max-width: 768px)");

const updateProgress = () => {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    if (scrollable <= 0) {
        progress.value = 0;
        return;
    }
    const ratio = window.scrollY / scrollable;
    progress.value = Math.min(1, Math.max(0, ratio));
};

const updateActive = () => {
    if (!props.sections.length) return;
    const doc = document.documentElement;
    const atBottom =
        window.innerHeight + window.scrollY >= doc.scrollHeight - 4;
    if (atBottom) {
        activeId.value = props.sections[props.sections.length - 1]!.id;
        return;
    }

    const activationLine = window.innerHeight * 0.3;
    let current = props.sections[0]!.id;
    for (const s of props.sections) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - activationLine <= 0) {
            current = s.id;
        }
    }
    activeId.value = current;
};

const onScroll = () => {
    updateProgress();
    updateActive();
};

const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = $lenis as unknown as
        | {
              scrollTo: (
                  t: HTMLElement | number,
                  opts?: { offset?: number },
              ) => void;
          }
        | undefined;
    if (lenis?.scrollTo) {
        lenis.scrollTo(el, { offset: -96 });
        return;
    }
    const top = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: "smooth" });
};

onMounted(() => {
    updateProgress();
    updateActive();
});

useEventListener("scroll", onScroll, { passive: true });
useEventListener("resize", onScroll, { passive: true });
</script>

<template>
    <div
        class="case-progress"
        role="progressbar"
        aria-label="Reading progress"
        :aria-valuenow="Math.round(progress * 100)"
        aria-valuemin="0"
        aria-valuemax="100"
    >
        <div
            class="case-progress__bar"
            :style="{ transform: `scaleX(${progress})` }"
        />
    </div>

    <nav v-if="!isMobile" class="case-toc" aria-label="Sections">
        <ul>
            <li v-for="s in sections" :key="s.id">
                <button
                    type="button"
                    class="case-toc__item mouse-sm"
                    :class="{ 'is-active': activeId === s.id }"
                    @click="scrollTo(s.id)"
                >
                    <span class="case-toc__dot" aria-hidden="true" />
                    <span class="case-toc__label">{{ s.label }}</span>
                </button>
            </li>
        </ul>
    </nav>
</template>

<style lang="scss" scoped>
.case-progress {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: rgba(255, 255, 255, 0.06);
    z-index: 11;
    pointer-events: none;
}

.case-progress__bar {
    height: 100%;
    width: 100%;
    background: $primary;
    transform-origin: 0 50%;
    transform: scaleX(0);
    will-change: transform;
    transition: transform 80ms linear;
}

.case-toc {
    position: fixed;
    top: 50%;
    left: 32px;
    transform: translateY(-50%);
    z-index: 9;
    max-height: 70vh;
    padding: 12px 14px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(20, 20, 24, 0.9);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
    overflow-y: auto;

    ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
    }
}

.case-toc__item {
    display: flex;
    align-items: center;
    gap: 10px;
    background: transparent;
    border: 0;
    padding: 6px 8px;
    margin: 0;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.45);
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-family: inherit;
    transition: color 200ms ease;

    &:hover {
        color: rgba(255, 255, 255, 0.85);

        .case-toc__dot {
            background: rgba(255, 255, 255, 0.6);
        }
    }

    &.is-active {
        color: $primary;

        .case-toc__dot {
            background: $primary;
            transform: scale(1.4);
        }

        .case-toc__label {
            opacity: 1;
            transform: translateX(0);
        }
    }
}

.case-toc__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    flex-shrink: 0;
    transition:
        transform 200ms ease,
        background 200ms ease;
}

.case-toc__label {
    opacity: 0.85;
    transition:
        opacity 200ms ease,
        transform 200ms ease;
}

@media only screen and (max-width: 1280px) {
    .case-toc {
        left: 16px;
    }

    .case-toc__label {
        display: none;
    }

    .case-toc__item.is-active .case-toc__label {
        display: inline;
        position: absolute;
        left: 28px;
        background: rgba(20, 20, 24, 0.75);
        backdrop-filter: blur(20px) saturate(160%);
        -webkit-backdrop-filter: blur(20px) saturate(160%);
        padding: 4px 10px;
        border-radius: 999px;
        white-space: nowrap;
        font-size: 0.65rem;
    }
}
</style>
