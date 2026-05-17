<script setup lang="ts">
const siteUrl = "https://picunada.dev";
const ogImage = `${siteUrl}/og.jpg`;

useSeoMeta({
    titleTemplate: (title) => {
        if (!title) return "Picunada - Backend Engineer";
        return title.includes("Picunada") ? title : `${title} - Picunada`;
    },
    description:
        "Daniil Bezuglov (Picunada) - Backend Engineer and Tech Lead building high-throughput payment platforms in Go and Python.",
    author: "Daniil Bezuglov",
    ogSiteName: "Picunada",
    ogType: "website",
    ogUrl: siteUrl,
    ogImage,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: "Picunada - Backend Engineer · Payments",
    twitterCard: "summary_large_image",
    twitterSite: "@SonzuXlayst",
    twitterCreator: "@SonzuXlayst",
    twitterImage: ogImage,
    twitterImageAlt: "Picunada - Backend Engineer · Payments",
});
</script>

<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>
