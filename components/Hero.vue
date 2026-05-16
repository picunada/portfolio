<script setup lang="ts">
import { gsap } from "gsap";
import Sketch from "@/utils/webgl/app";

const canvas = ref<HTMLCanvasElement | null>();
const preloaded = useState("loaded");
const symbolsRefs = ref<HTMLParagraphElement[] | null>();
const nick = ref("picunada");

const { register } = useShaderDebug();
let unregister: (() => void) | null = null;

watch(preloaded, (v) => {
    if (v) {
        if (symbolsRefs.value) {
            symbolsRefs.value.forEach((ref, i) => {
                gsap.fromTo(
                    ref,
                    {
                        translateY: "-100%",
                    },
                    {
                        ease: "power3",
                        duration: 0.6,
                        delay: 0.5 + 0.02 * i,
                        translateY: "0",
                    },
                );
            });
        }
    }
});

onMounted(() => {
    const sketch = new Sketch(canvas.value as HTMLCanvasElement);
    unregister = register(sketch.gradient);
    return sketch;
});

onBeforeUnmount(() => {
    unregister?.();
});
</script>

<template>
    <div class="canvas-container">
        <div id="grained">
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

            <svg
                class="arrow mouse-sm"
                xmlns="http://www.w3.org/2000/svg"
                width="96"
                height="96"
                viewBox="0 0 24 24"
            >
                <path
                    class="pulse"
                    fill="currentColor"
                    d="M12 14.975q-.2 0-.375-.062T11.3 14.7l-4.6-4.6q-.275-.275-.275-.7t.275-.7q.275-.275.7-.275t.7.275l3.9 3.9l3.9-3.9q.275-.275.7-.275t.7.275q.275.275.275.7t-.275.7l-4.6 4.6q-.15.15-.325.213t-.375.062Z"
                />
            </svg>

            <div class="blur" />
            <canvas ref="canvas" class="canvas" />
        </div>
    </div>
</template>

<style>
.canvas-container {
    /* position: absolute; */
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: -10;
}

.canvas {
    position: relative;
    margin: 0;
    z-index: -2;
}

#grained {
    position: relative;
    height: 100%;
}

.blur {
    position: absolute;
    width: 100%;
    height: 120%;
    translate: 0% -10%;
    top: 0;
    left: 0;
    backdrop-filter: blur(1px);
    z-index: -1;
}

.nick-container {
    position: absolute;

    overflow: hidden;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    mix-blend-mode: overlay;
    z-index: 1;
}

.nick {
    display: flex;
    flex-direction: row;
    color: #ffffff;
    z-index: 1;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: calc(100vw / 2560 * 120);
    font-weight: 300;
    text-transform: uppercase;
    user-select: none;
}

.arrow {
    opacity: 0;
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
