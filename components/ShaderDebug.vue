<script setup lang="ts">
import { PALETTE } from "@/utils/webgl/models/gradient";

const isDev = import.meta.dev;
const { gradients } = useShaderDebug();

const colors = ref<string[]>([...PALETTE]);
const open = ref(false);

type Edge = "top" | "right" | "bottom" | "left";
const edge = ref<Edge>("right");
const offset = ref(0.5);
const dragging = ref(false);
const dragPos = ref({ x: 0, y: 0 });

const clamp = (v: number, lo: number, hi: number) =>
    Math.min(hi, Math.max(lo, v));

const panelStyle = computed<Record<string, string>>(() => {
    if (dragging.value) {
        return {
            left: `${dragPos.value.x}px`,
            top: `${dragPos.value.y}px`,
            transform: "translate(-50%, -50%)",
            flexDirection: "row",
        };
    }
    const isVertical = edge.value === "left" || edge.value === "right";
    const along = isVertical ? "top" : "left";
    const translate = isVertical ? "translateY(-50%)" : "translateX(-50%)";
    const flexMap: Record<Edge, string> = {
        right: "row-reverse",
        left: "row",
        top: "column",
        bottom: "column-reverse",
    };
    return {
        [edge.value]: "0",
        [along]: `${offset.value * 100}%`,
        transform: translate,
        flexDirection: flexMap[edge.value],
    };
});

function onColorPick(i: number, e: Event) {
    const value = (e.target as HTMLInputElement).value;
    colors.value[i] = value;
    for (const g of gradients.value) g.setColor(i, value);
}

async function copyPalette() {
    await navigator.clipboard.writeText(JSON.stringify(colors.value, null, 2));
}

let dragStarted = false;
let dragOrigin = { x: 0, y: 0 };
const DRAG_THRESHOLD = 4;

function onTogglePointerDown(e: PointerEvent) {
    dragStarted = false;
    dragOrigin = { x: e.clientX, y: e.clientY };
    dragPos.value = { x: e.clientX, y: e.clientY };
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    el.addEventListener("pointermove", onTogglePointerMove);
    el.addEventListener("pointerup", onTogglePointerUp, { once: true });
    el.addEventListener("pointercancel", onTogglePointerUp, { once: true });
}

function onTogglePointerMove(e: PointerEvent) {
    const dx = e.clientX - dragOrigin.x;
    const dy = e.clientY - dragOrigin.y;
    if (!dragStarted && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
        dragStarted = true;
        dragging.value = true;
        open.value = false;
    }
    if (dragStarted) {
        dragPos.value = { x: e.clientX, y: e.clientY };
    }
}

function onTogglePointerUp(e: PointerEvent) {
    const el = e.currentTarget as HTMLElement;
    el.removeEventListener("pointermove", onTogglePointerMove);
    if (dragStarted) {
        snapToNearestEdge(e.clientX, e.clientY);
        dragging.value = false;
    } else {
        open.value = !open.value;
    }
}

function snapToNearestEdge(x: number, y: number) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dists = {
        top: y,
        bottom: h - y,
        left: x,
        right: w - x,
    };
    const nearest = (Object.keys(dists) as Edge[]).reduce((a, b) =>
        dists[a] <= dists[b] ? a : b,
    );
    edge.value = nearest;
    const isVertical = nearest === "left" || nearest === "right";
    offset.value = clamp(isVertical ? y / h : x / w, 0.04, 0.96);
}
</script>

<template>
    <Teleport to="body">
        <div
            v-if="isDev"
            class="shader-debug"
            :class="{ dragging }"
            :style="panelStyle"
        >
            <button
                class="shader-debug__toggle"
                type="button"
                :aria-label="open ? 'Collapse' : 'Expand'"
                @pointerdown="onTogglePointerDown"
            >
                {{ open ? "−" : "🎨" }}
            </button>
            <div
                v-if="open && !dragging"
                class="shader-debug__body"
            >
                <div class="shader-debug__title">Gradient colors</div>
                <div
                    v-for="(c, i) in colors"
                    :key="i"
                    class="shader-debug__row"
                >
                    <input
                        type="color"
                        :value="c"
                        @input="onColorPick(i, $event)"
                    >
                    <span class="shader-debug__hex">{{ c }}</span>
                    <span class="shader-debug__label">uColor[{{ i }}]</span>
                </div>
                <button
                    type="button"
                    class="shader-debug__copy"
                    @click="copyPalette"
                >
                    Copy palette
                </button>
            </div>
        </div>
    </Teleport>
</template>

<style>
.shader-debug {
    position: fixed;
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px;
    color: #fff;
    user-select: none;
    transition: top 0.25s ease, left 0.25s ease, right 0.25s ease,
        bottom 0.25s ease;
}

.shader-debug.dragging {
    transition: none;
}

.shader-debug__toggle {
    width: 32px;
    height: 32px;
    background: rgba(20, 20, 24, 0.18);
    backdrop-filter: blur(18px) saturate(140%);
    -webkit-backdrop-filter: blur(18px) saturate(140%);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 8px;
    cursor: grab;
    font-size: 14px;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
    touch-action: none;
}

.shader-debug__toggle:hover {
    background: rgba(20, 20, 24, 0.3);
}

.shader-debug.dragging .shader-debug__toggle {
    cursor: grabbing;
}

.shader-debug__title {
    font-weight: 600;
    opacity: 0.8;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    font-size: 10px;
    margin-bottom: 2px;
}

.shader-debug__body {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 220px;
    padding: 10px 12px;
    background: rgba(20, 20, 24, 0.18);
    backdrop-filter: blur(18px) saturate(140%);
    -webkit-backdrop-filter: blur(18px) saturate(140%);
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 10px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
}

.shader-debug__row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.shader-debug__row input[type="color"] {
    width: 28px;
    height: 24px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    padding: 0;
    background: transparent;
    cursor: pointer;
}

.shader-debug__hex {
    font-variant-numeric: tabular-nums;
    width: 64px;
}

.shader-debug__label {
    opacity: 0.55;
}

.shader-debug__copy {
    margin-top: 4px;
    padding: 4px 8px;
    background: rgba(255, 255, 255, 0.06);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 4px;
    cursor: pointer;
    font-family: inherit;
    font-size: 11px;
}

.shader-debug__copy:hover {
    background: rgba(255, 255, 255, 0.14);
}
</style>
