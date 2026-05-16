import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
    DotScreenEffect,
    EffectComposer,
    EffectPass,
    RenderPass,
} from "postprocessing";
import Time from "./lib/time";
import Gradient from "./models/gradient";

export default class Sketch {
    private canvas: HTMLCanvasElement;
    private renderer: THREE.WebGLRenderer;
    private composer: EffectComposer;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private controls: OrbitControls;
    private time: Time = new Time();

    public gradient: Gradient;

    public loaded: Ref<boolean> = useState("loaded", () => false);

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
        );

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            powerPreference: "low-power",
            antialias: false,
            alpha: true,
            premultipliedAlpha: false,
        });
        this.renderer.setClearColor(0x000000, 0);
        this.composer = new EffectComposer(this.renderer, {
            alphaBuffer: true,
        });
        const renderPass = new RenderPass(this.scene, this.camera);
        renderPass.clearPass.overrideClearAlpha = 0;
        this.composer.addPass(renderPass);

        // scale = dot density (higher = smaller, denser dots); angle in radians
        const dots = new DotScreenEffect({
            scale: 5,
            angle: Math.PI * 0.25,
        });
        this.composer.addPass(new EffectPass(this.camera, dots));

        this.gradient = new Gradient();
        this.scene.add(this.gradient.mesh);

        this.setupRenderer();
        this.setupCamera();

        this.controls = new OrbitControls(
            this.camera,
            this.renderer.domElement,
        );

        this.time.animate(() => this.animate());

        window.addEventListener("resize", () => this.resize());

        this.loaded.value = true;
    }

    private setupRenderer() {
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.toneMappingExposure = 0.6;
    }

    private setupCamera() {
        this.camera.position.set(-0.07, 0.22, 0.3);
        this.camera.rotation.set(-0.6, 0.187, 0.139);
        // this.camera.lookAt(this.gradient.mesh.position)s
    }

    private resize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);

        this.renderer.pixelRatio = window.devicePixelRatio;
        this.composer.setPixelRatio(window.devicePixelRatio);

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    private animate() {
        this.composer.render();
        this.gradient.animate();
    }
}
