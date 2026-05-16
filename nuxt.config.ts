// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    compatibilityDate: "2026-05-15",
    site: {
        url: "https://picunada.dev",
        name: "Picunada",
    },
    app: {
        head: {
            htmlAttrs: { lang: "en" },
            link: [
                { rel: "icon", type: "image/svg+xml", href: "/Icon.svg" },
                { rel: "canonical", href: "https://picunada.dev" },
            ],
            meta: [
                { name: "theme-color", content: "#0f0f0f" },
            ],
        },
    },
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@use "@/assets/_colors.scss" as *;',
                },
            },
        },
    },
    css: ["~/assets/main.scss"],
    modules: ["@nuxtjs/fontaine", "@nuxt/eslint"],
    imports: {
        dirs: ["./stores", "./components/ui", "utils"],
    },
});
