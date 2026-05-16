<script setup lang="ts">
useSeoMeta({
    title: "Picunada — Backend Engineer · Payments",
    description:
        "Backend Engineer and Tech Lead at LUCKYPAY. I build high-throughput payment platforms, event-driven services, and real-time analytics in Go and Python.",
    ogTitle: "Picunada — Backend Engineer · Payments",
});
</script>

<template>
    <Hero />
    <div class="page">
        <div class="page-content">
            <div class="text-wrapper">
                <RevealOnScroll>
                    <h1 class="mouse-lg">
                        Hello, I'm Picunada - a Backend Engineer building
                        payment systems.
                    </h1>
                </RevealOnScroll>
            </div>
            <div class="grid">
                <div class="about-column">
                    <RevealOnScroll>
                        <p class="about mouse-md">
                            I architect and ship high-throughput payment
                            platforms, event-driven services, and data
                            aggregation systems in Go and Python.
                        </p>
                    </RevealOnScroll>
                    <RevealOnScroll>
                        <p class="about mouse-md">
                            Currently leading engineering at a fintech startup,
                            designing P2P payment flows, provider cascades over
                            NATS, and real-time analytics on ClickHouse.
                        </p>
                    </RevealOnScroll>
                    <RevealOnScroll>
                        <p class="about mouse-md">
                            I care about reliability and observability —
                            distributed tracing, structured logs, and dashboards
                            that catch issues before users do.
                        </p>
                    </RevealOnScroll>
                    <RevealOnScroll>
                        <p class="about mouse-md">
                            Originally from Russia, I've lived and worked in
                            Vietnam, and I'm currently based in Seattle, WA.
                        </p>
                    </RevealOnScroll>
                    <RevealOnScroll>
                        <p class="about mouse-md">
                            When I&apos;m not shipping backends, you&apos;ll
                            find me gaming and exploring the outdoors on
                            refreshing walks.
                        </p>
                    </RevealOnScroll>
                </div>
                <div class="experience">
                    <RevealOnScroll>
                        <div class="experience-header">[ experience ]</div>
                    </RevealOnScroll>
                    <RevealOnScroll>
                        <div class="work">
                            <div class="work__company">LUCKYPAY</div>
                            <div class="work__meta">Jun 2024 — Now · 2 yrs</div>
                            <div class="work__role">Tech Lead</div>
                        </div>
                    </RevealOnScroll>
                    <RevealOnScroll>
                        <div class="work">
                            <div class="work__company">Multitender</div>
                            <div class="work__meta">
                                Apr 2023 — Jun 2024 · 1+ yr
                            </div>
                            <div class="work__role">Full Stack Engineer</div>
                        </div>
                    </RevealOnScroll>
                    <RevealOnScroll>
                        <div class="work">
                            <div class="work__company">Lockerbot</div>
                            <div class="work__meta">
                                Apr 2022 — Apr 2023 · 1 yr
                            </div>
                            <div class="work__role">Frontend Engineer</div>
                        </div>
                    </RevealOnScroll>
                    <RevealOnScroll>
                        <div class="work">
                            <div class="work__company">Digital Spirit</div>
                            <div class="work__meta">
                                Sep 2021 — Apr 2022 · 7 mo
                            </div>
                            <div class="work__role">QA Engineer</div>
                        </div>
                    </RevealOnScroll>

                    <RevealOnScroll>
                        <div class="experience-header">[ awards ]</div>
                    </RevealOnScroll>
                    <RevealOnScroll>
                        <div class="work">
                            <div class="work__company">
                                TON Foundation hackathon
                            </div>
                            <div class="work__meta">2nd place</div>
                            <div class="work__role">$10K award</div>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>
            <div class="projects-wrapper">
                <RevealOnScroll>
                    <h2 class="mouse-sm section-header">[ case studies ]</h2>
                </RevealOnScroll>
                <div class="project-grid">
                    <RevealOnScroll>
                        <NuxtLink
                            to="/case/provider-cascade"
                            class="case-card mouse-md"
                        >
                            <div class="case-card__meta">
                                <span class="case-card__tag"
                                    >payments · performance</span
                                >
                                <span class="case-card__year">2025</span>
                            </div>
                            <h3 class="case-card__title">
                                Improving provider cascade performance
                            </h3>
                            <p class="case-card__lede">
                                Reworking the routing layer that picks payment
                                providers — cutting tail latency and surviving
                                partial outages without manual intervention.
                            </p>
                            <span class="case-card__cta"
                                >Read case study →</span
                            >
                        </NuxtLink>
                    </RevealOnScroll>

                    <RevealOnScroll>
                        <NuxtLink
                            to="/case/event-driven-payments"
                            class="case-card mouse-md"
                        >
                            <div class="case-card__meta">
                                <span class="case-card__tag"
                                    >payments · architecture</span
                                >
                                <span class="case-card__year">2025</span>
                            </div>
                            <h3 class="case-card__title">
                                Event-driven payment flow on NATS
                            </h3>
                            <p class="case-card__lede">
                                Moving the payment pipeline off synchronous RPC
                                and onto an event-driven backbone — decoupling
                                services, taming retries, unlocking real-time
                                analytics.
                            </p>
                            <span class="case-card__cta"
                                >Read case study →</span
                            >
                        </NuxtLink>
                    </RevealOnScroll>
                </div>
            </div>
            <RevealOnScroll>
                <h2 class="mouse-sm section-header">[ contacts ]</h2>
            </RevealOnScroll>
            <div class="contacts-wrapper">
                <RevealOnScroll>
                    <div class="contact">
                        <p class="title mouse-sm">email</p>
                        <a href="mailto:xlaystgoku@gmail.com" target="_blank">
                            <p class="value mouse-sm">xlaystgoku@gmail.com</p>
                        </a>
                    </div>
                </RevealOnScroll>
                <RevealOnScroll>
                    <div class="contact">
                        <p class="title mouse-sm">telegram</p>
                        <a href="https://t.me/picunada" target="_blank">
                            <p class="value mouse-sm">@picunada</p>
                        </a>
                    </div>
                </RevealOnScroll>
            </div>
        </div>
    </div>
</template>

<style>
h1,
h2,
h3 {
    text-wrap: balance;
}
</style>

<style lang="scss" scoped>
.page-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 48px;
    margin: 80px 0 120px;
    background: rgba(15, 15, 15, 0.9);
    backdrop-filter: blur(18px) saturate(140%);
    -webkit-backdrop-filter: blur(18px) saturate(140%);

    @media only screen and (max-width: 678px) {
        padding: 24px;
        margin: 48px 0 64px;
        border-radius: 12px;
    }
}

.text-wrapper {
    font-size: 2rem;
    font-weight: 300;
    margin-top: 40px;

    h1 {
        font-weight: 400;
    }

    @media only screen and (max-width: 678px) {
        font-size: 1.2rem;
        margin-top: 16px;
    }
}

.grid {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    gap: 64px;
    margin-top: 80px;
    align-items: start;

    @media only screen and (max-width: 678px) {
        grid-template-columns: 1fr;
        gap: 48px;
        margin-top: 48px;
    }
}

.about-column {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 56ch;
}

.about {
    font-size: 1.25rem;
    font-weight: 400;
    line-height: 1.55;
    color: rgba(255, 255, 255, 0.88);
    margin: 0;
    text-wrap: pretty;

    @media only screen and (max-width: 678px) {
        font-size: 1rem;
        line-height: 1.5;
    }
}

.experience {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 20px;

    @media only screen and (max-width: 678px) {
        gap: 16px;
    }
}

.experience-header {
    font-size: 0.8rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--secondary);
    margin: 8px 0 4px;

    &:first-child {
        margin-top: 0;
    }
}

.work {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);

    &:last-child {
        border-bottom: none;
        padding-bottom: 0;
    }
}

.work__company {
    font-size: 1rem;
    font-weight: 500;
    color: $primary;
    line-height: 1.3;
}

.work__meta {
    font-size: 0.75rem;
    font-weight: 400;
    color: $secondary;
    letter-spacing: 0.02em;
}

.work__role {
    font-size: 0.9rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.75);
    margin-top: 2px;
}

.projects-wrapper {
    margin-top: 80px;
    display: flex;
    flex-direction: column;
    gap: 24px;

    .project-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;

        @media only screen and (max-width: 678px) {
            grid-template-columns: auto;
        }
    }

    .case-card {
        display: flex;
        flex-direction: column;
        gap: 16px;
        min-height: 320px;
        padding: 24px;
        border: 1px solid rgba(255, 255, 255, 0.16);
        border-radius: 12px;
        background: transparent;
        color: $primary;
        text-decoration: none;
        transition:
            border-color 0.25s ease,
            transform 0.25s ease,
            background 0.25s ease;

        &:hover {
            border-color: rgba(255, 255, 255, 0.36);
            transform: translateY(-2px);
            background: rgba(255, 255, 255, 0.04);
        }

        @media only screen and (max-width: 678px) {
            min-height: 240px;
            padding: 16px;
        }
    }

    .case-card__meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: $secondary;
    }

    .case-card__tag {
        font-weight: 500;
    }

    .case-card__title {
        font-size: 1.6rem;
        font-weight: 500;
        line-height: 1.2;
        margin: 0;

        @media only screen and (max-width: 678px) {
            font-size: 1.2rem;
        }
    }

    .case-card__lede {
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        color: rgba(255, 255, 255, 0.78);
        margin: 0;

        @media only screen and (max-width: 678px) {
            font-size: 0.85rem;
        }
    }

    .case-card__cta {
        margin-top: auto;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: $secondary;
    }
}

.contacts-wrapper {
    margin-bottom: 40px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.contact {
    font-size: 1.2rem;
    font-weight: 400;
    display: flex;
    gap: 16px;

    @media only screen and (max-width: 678px) {
        font-size: 0.9rem;
    }

    .title {
        color: $secondary;
    }

    .value {
        text-decoration: underline;
        text-decoration-color: transparent;
        transition: ease-in-out 0.2s;
        transition-property: text-decoration-color;

        &:hover {
            text-decoration-color: $primary;
        }
    }
}

.section-header {
    margin-top: 80px;
    font-size: 1rem;
    font-weight: 400;
    text-transform: uppercase;
    color: var(--secondary);
}
</style>
