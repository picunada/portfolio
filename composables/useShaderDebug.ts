import { ref } from "vue";
import type Gradient from "~/utils/webgl/models/gradient";

const gradients = ref<Gradient[]>([]);

export function useShaderDebug() {
    function register(g: Gradient) {
        gradients.value.push(g);
        return () => {
            const idx = gradients.value.indexOf(g);
            if (idx >= 0) gradients.value.splice(idx, 1);
        };
    }
    return { gradients, register };
}
