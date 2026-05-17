<script setup lang="ts">
import Sketch from "@/utils/webgl/app";

const canvas = ref<HTMLCanvasElement | null>(null);
const { register } = useShaderDebug();
let unregister: (() => void) | null = null;
let sketch: Sketch | null = null;

onMounted(() => {
    if (!canvas.value) return;
    sketch = new Sketch(canvas.value);
    unregister = register(sketch.gradient);
});

onBeforeUnmount(() => {
    unregister?.();
    sketch?.dispose();
});
</script>

<template>
    <div class="shader-bg" aria-hidden="true">
        <canvas ref="canvas" class="shader-bg__canvas" />
    </div>
</template>

<style scoped>
.shader-bg {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    z-index: -10;
    pointer-events: none;
}

.shader-bg__canvas {
    width: 100%;
    height: 100%;
    display: block;
}
</style>
