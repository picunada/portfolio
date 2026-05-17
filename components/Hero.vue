<script setup lang="ts">
import { gsap } from "gsap";

const preloaded = useState("loaded");
const symbolsRefs = ref<HTMLParagraphElement[] | null>();
const subtitleRef = ref<HTMLParagraphElement | null>(null);
const nick = ref("picunada");

function revealNick() {
    if (!symbolsRefs.value) return;
    symbolsRefs.value.forEach((ref, i) => {
        gsap.fromTo(
            ref,
            { translateY: "-100%" },
            {
                ease: "power3",
                duration: 0.6,
                delay: 0.5 + 0.02 * i,
                translateY: "0",
            },
        );
    });

    if (subtitleRef.value) {
        gsap.fromTo(
            subtitleRef.value,
            { opacity: 0, translateY: 8 },
            {
                ease: "power2.out",
                duration: 0.8,
                delay: 0.9,
                opacity: 1,
                translateY: 0,
            },
        );
    }
}

watch(preloaded, (v) => {
    if (v) revealNick();
});

onMounted(() => {
    if (preloaded.value) revealNick();
});
</script>

<template>
    <section class="hero">
        <div class="identity">
            <div class="nick-container">
                <div class="nick">
                    <p
                        v-for="symbol in nick"
                        :key="nick.indexOf(symbol)"
                        ref="symbolsRefs"
                    >
                        {{ symbol }}
                    </p>
                </div>
            </div>
            <p ref="subtitleRef" class="subtitle">
                backend · fintech · seattle
            </p>
        </div>

        <svg
            class="arrow mouse-sm"
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
        >
            <path
                class="pulse"
                fill="currentColor"
                d="M12 14.975q-.2 0-.375-.062T11.3 14.7l-4.6-4.6q-.275-.275-.275-.7t.275-.7q.275-.275.7-.275t.7.275l3.9 3.9l3.9-3.9q.275-.275.7-.275t.7.275q.275.275.275.7t-.275.7l-4.6 4.6q-.15.15-.325.213t-.375.062Z"
            />
        </svg>
    </section>
</template>

<style scoped>
.hero {
    position: relative;
    width: 100vw;
    height: 100vh;
}

.identity {
    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(12px, calc(100vw / 2560 * 28), 32px);
    padding: 48px;
    background: rgba(15, 15, 15, 0.9);
    backdrop-filter: blur(18px) saturate(140%);
    -webkit-backdrop-filter: blur(18px) saturate(140%);
    z-index: 1;

    @media only screen and (max-width: 678px) {
        padding: 24px;
        border-radius: 12px;
    }
}

.nick-container {
    overflow: hidden;
}

.nick {
    display: flex;
    flex-direction: row;
    color: #ffffff;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: calc(100vw / 2560 * 120);
    font-weight: 400;
    text-transform: uppercase;
    user-select: none;
}

.nick p {
    line-height: 1;
}

.subtitle {
    margin: 0;
    color: rgba(255, 255, 255, 0.78);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: clamp(0.72rem, calc(100vw / 2560 * 22), 1.1rem);
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: lowercase;
    white-space: nowrap;
    user-select: none;
    opacity: 0;
}

.arrow {
    opacity: 1;
    position: absolute;
    bottom: 0;
    right: 0;
    translate: calc(100vw / 2560 * -48) -50%;
    z-index: 3;
}

.pulse {
    animation: pulse 1.5s infinite;
    transform-origin: center;
}

@keyframes pulse {
    0% {
        transform: scale(1.05);
        filter: drop-shadow(0 0 0 rgba(255, 255, 255, 0.7));
    }

    70% {
        transform: scale(1);
        filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0));
    }

    100% {
        transform: scale(1);
        filter: drop-shadow(0 0 0px rgba(255, 255, 255, 0));
    }
}
</style>
