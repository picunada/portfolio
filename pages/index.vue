<script setup lang="ts">
useSeoMeta({
    title: "Picunada - Backend Engineer · Payments",
    description:
        "Backend Engineer and Tech Lead at a payments startup. I build high-throughput payment platforms, event-driven services, and real-time analytics in Go and Python.",
    ogTitle: "Picunada - Backend Engineer · Payments",
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
                            Backend engineer working on payment systems - Go and
                            Python, mostly. I like the messy parts: provider
                            cascades, retries, idempotency, and the analytics
                            that tell you whether any of it is actually working.
                        </p>
                    </RevealOnScroll>
                    <RevealOnScroll>
                        <p class="about mouse-md">
                            Currently Tech Lead at a payments startup, where I
                            design P2P payment flows, route traffic across
                            providers over NATS, and run our analytics on
                            ClickHouse.
                        </p>
                    </RevealOnScroll>
                    <RevealOnScroll>
                        <p class="about mouse-md">
                            I care most about reliability and observability -
                            distributed tracing, structured logs, and dashboards
                            that catch issues before users do.
                        </p>
                    </RevealOnScroll>
                    <RevealOnScroll>
                        <p class="about mouse-md">
                            Originally from Russia, spent time in Vietnam, now
                            based in Seattle. Outside of work I&apos;m usually
                            gaming or out on a long walk.
                        </p>
                    </RevealOnScroll>
                </div>
                <div class="experience">
                    <RevealOnScroll>
                        <div class="experience-header">[ experience ]</div>
                    </RevealOnScroll>
                    <RevealOnScroll>
                        <div class="work work--current">
                            <div class="work__head">
                                <span class="work__company"
                                    >Payments startup</span
                                >
                                <span class="work__date">2024 — Now</span>
                            </div>
                            <div class="work__role">Tech Lead</div>
                            <div class="work__stack">
                                Go · NATS · ClickHouse · Python
                            </div>
                        </div>
                    </RevealOnScroll>
                    <RevealOnScroll>
                        <div class="work">
                            <div class="work__head">
                                <span class="work__company">Multitender</span>
                                <span class="work__date">2023 — 2024</span>
                            </div>
                            <div class="work__role">Full Stack Engineer</div>
                            <div class="work__stack">
                                Vue · Python · MongoDB · Redis
                            </div>
                        </div>
                    </RevealOnScroll>
                    <RevealOnScroll>
                        <div class="work work--faded">
                            <div class="work__head">
                                <span class="work__company">Lockerbot</span>
                                <span class="work__date">2022 — 2023</span>
                            </div>
                            <div class="work__role">Frontend Engineer</div>
                            <div class="work__stack">Swift · Vue</div>
                        </div>
                    </RevealOnScroll>
                    <RevealOnScroll>
                        <div class="work work--faded">
                            <div class="work__head">
                                <span class="work__company"
                                    >Digital Spirit</span
                                >
                                <span class="work__date">2021 — 2022</span>
                            </div>
                            <div class="work__role">QA Engineer</div>
                            <div class="work__stack">
                                Manual · Postman · SQL
                            </div>
                        </div>
                    </RevealOnScroll>

                    <RevealOnScroll>
                        <div class="experience-header">[ awards ]</div>
                    </RevealOnScroll>
                    <RevealOnScroll>
                        <div class="work">
                            <div class="work__head">
                                <span class="work__company"
                                    >TON Foundation hackathon</span
                                >
                                <span class="work__date">2nd place</span>
                            </div>
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
                                <span class="case-card__year">2026</span>
                            </div>
                            <h3 class="case-card__title">
                                Improving provider cascade performance
                            </h3>
                            <p class="case-card__lede">
                                Cutting provider-discovery latency from 50–60 ms
                                to 3–5 ms - splitting the cascade build into a
                                Go service backed by a NATS JetStream KV cache.
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
                                Single-shot withdrawals to a durable cascade
                            </h3>
                            <p class="case-card__lede">
                                Lifting withdrawal success from 10-20% to 50-60%
                                by replacing one-attempt provider routing with
                                an FSM-driven cascade on NATS JetStream.
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
    border: 1px solid rgba(255, 255, 255, 0.12);
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
    font-size: 1.625rem;
    font-weight: 300;
    line-height: 1.4;
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
    gap: 4px;
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    transition: opacity 0.25s ease;

    &:last-child {
        border-bottom: none;
        padding-bottom: 0;
    }

    &--faded {
        opacity: 0.55;

        &:hover {
            opacity: 0.9;
        }
    }

    &--current .work__company {
        color: $primary;
    }
}

.work__head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
}

.work__company {
    font-size: 1rem;
    font-weight: 500;
    color: $primary;
    line-height: 1.3;
}

.work__date {
    font-size: 0.75rem;
    font-weight: 400;
    color: $secondary;
    letter-spacing: 0.02em;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
}

.work__role {
    font-size: 0.9rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.75);
}

.work__stack {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.72rem;
    font-weight: 400;
    color: $secondary;
    letter-spacing: 0.02em;
    margin-top: 4px;
}

.projects-wrapper {
    margin-top: 80px;
    display: flex;
    flex-direction: column;
    gap: 24px;

    @media only screen and (max-width: 678px) {
        margin-top: 40px;
    }

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

    @media only screen and (max-width: 678px) {
        margin-top: 40px;
    }
}
</style>
