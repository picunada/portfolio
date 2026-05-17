import * as THREE from "three";
import vertex from "../shader/gradient/vertex.glsl?raw";
import fragment from "../shader/gradient/fragment.glsl?raw";

export const PALETTE = ["#2b93b6", "#39bcc6", "#94cbff", "#0f0f0f"];

export default class Gradient {
    private time = 0;
    private material: THREE.ShaderMaterial;
    private geometry: THREE.PlaneGeometry;
    public mesh: THREE.Mesh;

    constructor(colors: string[] = PALETTE) {
        const palette = colors.map((hex) => new THREE.Color(hex));

        this.material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            transparent: true,
            uniforms: {
                time: { value: 0 },
                uColor: { value: palette },
            },
            // wireframe: true,
            vertexShader: vertex,
            fragmentShader: fragment,
        });

        this.geometry = new THREE.PlaneGeometry(1, 1, 300, 300);

        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    public animate() {
        this.time += 0.01;
        this.material.uniforms.time.value = this.time;
    }

    public setColor(index: number, hex: string) {
        const palette = this.material.uniforms.uColor.value as THREE.Color[];
        if (palette[index]) palette[index].set(hex);
    }

    public get colors(): string[] {
        return (this.material.uniforms.uColor.value as THREE.Color[]).map(
            (c) => `#${c.getHexString()}`,
        );
    }
}
