<script setup lang="ts">
const { $router } = useNuxtApp();

useSeoMeta({
    title: "Improving provider cascade performance",
    description:
        "How I cut payment provider-discovery latency from 50–60 ms to 3–5 ms by splitting the cascade build into a Go service backed by a NATS JetStream KV cache.",
    ogTitle: "Improving provider cascade performance - Picunada",
});
</script>

<template>
    <button class="back-button mouse-sm" @click="() => $router.go(-1)">
        <svg
            class="mouse-sm"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
        >
            <path
                class="mouse-sm"
                fill="currentColor"
                d="M10 22L0 12L10 2l1.775 1.775L3.55 12l8.225 8.225L10 22Z"
            />
        </svg>
    </button>

    <div class="page case-page">
        <header class="case-hero">
            <RevealOnScroll>
                <span class="case-hero__eyebrow mouse-sm">[ case study ]</span>
            </RevealOnScroll>
            <RevealOnScroll>
                <h1 class="case-hero__title mouse-lg">
                    Improving provider cascade performance
                </h1>
            </RevealOnScroll>
            <RevealOnScroll>
                <p class="case-hero__lede mouse-md">
                    Cutting provider-discovery latency from 50–60 ms to 3–5 ms
                    on the critical path of every transaction - by splitting
                    near-static reference data out of Postgres and into a NATS
                    JetStream KV cache behind a new Go service.
                </p>
            </RevealOnScroll>

            <dl class="case-meta">
                <div class="case-meta__row">
                    <dt class="mouse-sm">Company</dt>
                    <dd class="mouse-sm">Payments startup</dd>
                </div>
                <div class="case-meta__row">
                    <dt class="mouse-sm">Role</dt>
                    <dd class="mouse-sm">Backend Tech Lead</dd>
                </div>
                <div class="case-meta__row">
                    <dt class="mouse-sm">Period</dt>
                    <dd class="mouse-sm">
                        2026 · 3–4 weeks build · ~3 weeks in production
                    </dd>
                </div>
                <div class="case-meta__row">
                    <dt class="mouse-sm">Stack</dt>
                    <dd class="mouse-sm">
                        Go · Python · NATS JetStream · PostgreSQL ·
                        OpenTelemetry · Grafana
                    </dd>
                </div>
            </dl>
        </header>

        <section class="case-section">
            <RevealOnScroll>
                <h2 class="case-section__title mouse-md">Problem</h2>
            </RevealOnScroll>
            <RevealOnScroll>
                <div class="case-section__body">
                    <p class="mouse-sm">
                        Our platform runs payments through a
                        <em>cascade</em> - a per-request, ordered list of
                        eligible providers we try until one approves. The
                        cascade is rebuilt from scratch on every order, with
                        eligibility driven by terminal config, currency and
                        method, tags, fee rules, deposit limits, and provider
                        live state.
                    </p>
                    <p class="mouse-sm">
                        At our scale - ~400 TPS across ~200 providers, 10
                        countries, ~30 payment methods - that build sits
                        squarely on the critical path of every transaction. The
                        legacy implementation lived inside our Python
                        <code>cascade-core</code> monolith as an in-process
                        <code>ProviderDiscoveryService</code>. Each call fanned
                        out into a series of small Postgres queries: external
                        method joins, terminal blocks, accept/decline tags, fee
                        rule scopes, per-provider deposit balances. End-to-end
                        the build took <strong>50–60 ms p50</strong> before we
                        ever sent a byte to a provider.
                    </p>
                    <p class="mouse-sm">
                        Providers take their own time to approve - every
                        millisecond we add to the wrapper directly extends
                        user-perceived latency and shortens the window in which
                        we can retry.
                    </p>
                </div>
            </RevealOnScroll>
        </section>

        <section class="case-section">
            <RevealOnScroll>
                <h2 class="case-section__title mouse-md">Constraints</h2>
            </RevealOnScroll>
            <RevealOnScroll>
                <div class="case-section__body">
                    <ul class="mouse-sm">
                        <li>
                            <strong>Drop-in replacement.</strong> Provider
                            contracts and external API shape were fixed; the new
                            service had to slot in for both
                            <code>cascade-core</code> and
                            <code>pool-service</code> callers without changes on
                            their side.
                        </li>
                        <li>
                            <strong>Provably equivalent semantics.</strong>
                            Filtering, ordering, fee resolution, and deposit
                            checks all drive money movement; any silent drift
                            surfaces as missing routes, mispriced orders, or
                            lost revenue. The new service had to reproduce the
                            ten-step pipeline exactly before traffic was cut
                            over.
                        </li>
                        <li>
                            <strong>Compliance.</strong> No provider identity
                            leaks to clients - provider data stays server-side.
                        </li>
                        <li>
                            <strong>Sign-off.</strong> Ops (who would run the
                            new service) and CTO (architecture and risk of
                            replacing a load-bearing path).
                        </li>
                    </ul>
                </div>
            </RevealOnScroll>
        </section>

        <section class="case-section">
            <RevealOnScroll>
                <h2 class="case-section__title mouse-md">Diagnosis</h2>
            </RevealOnScroll>
            <RevealOnScroll>
                <div class="case-section__body">
                    <p class="mouse-sm">
                        OpenTelemetry traces made the shape of the problem
                        obvious: a single
                        <code>discover_providers</code> span fanned out into
                        6–10 child DB spans, each only 3–8 ms but serialized.
                        Most of those spans queried tables that change
                        minutes-to-hours apart, not per-request - providers,
                        terminals, fee rules, tags, blocks. The remaining
                        real-time signals were provider liveness (rolling
                        response-time metrics) and live deposit balances.
                    </p>
                    <p class="mouse-sm">
                        Two distinct workloads were tangled in one hot path. The
                        root cause wasn't bad SQL or a missing index - it was
                        that we were re-reading near-static reference data on
                        every transaction.
                    </p>
                </div>
            </RevealOnScroll>
        </section>

        <section class="case-section">
            <RevealOnScroll>
                <h2 class="case-section__title mouse-md">Solution</h2>
            </RevealOnScroll>
            <RevealOnScroll>
                <div class="case-section__body">
                    <p class="mouse-sm">
                        I built <code>cascade-builder</code>, a new Go
                        microservice that replaces the in-process discovery and
                        exposes a single NATS request-reply subject
                        (<code>core.cascade.v2.discover-providers</code>). The
                        engine is a faithful Go port of the legacy ten-step
                        pipeline - same filter order, same eligibility rules,
                        same sort priority - so callers receive the same
                        answers, just faster.
                    </p>
                    <p class="mouse-sm">
                        The architecture splits the workload by mutation rate:
                    </p>
                    <pre
                        class="case-code"
                    ><code>Caller (cascade-core / pool-service)
        │  NATS request-reply
        ▼
┌──────────────────────────────┐
│   10-step filter pipeline    │
│   (in-memory, Go)            │
└──────┬──────────────┬────────┘
       ▼              ▼
 NATS KV cache    PostgreSQL
 (steps 1–8)      (step 9: live deposits)</code></pre>
                    <ul class="mouse-sm">
                        <li>
                            <strong>Reference data</strong> (providers,
                            terminals, external methods, fee rules, tags,
                            blocks) is loaded into three NATS JetStream KV
                            buckets at startup, with a 5-minute safety reload.
                        </li>
                        <li>
                            <strong>Real-time invalidation</strong> is driven by
                            <code>core.entity.updated.*</code> messages that
                            <code>cascade-core</code> already emits on every
                            write. A durable JetStream consumer in
                            <code>cascade-builder</code> reloads the affected
                            entity by ID - typically sub-second propagation.
                        </li>
                        <li>
                            <strong>Provider response-time metrics</strong>
                            (rolling 5-minute averages) are computed by our
                            analytics service and published as periodic
                            snapshots; <code>cascade-builder</code> subscribes
                            and keeps the snapshot in memory so the engine reads
                            it in O(1).
                        </li>
                        <li>
                            <strong>One DB query remains</strong> in the hot
                            path - the live deposit balance check, which has to
                            be authoritative.
                        </li>
                    </ul>
                    <p class="mouse-sm">
                        Two non-obvious tradeoffs were worth surfacing
                        explicitly:
                    </p>
                    <ul class="mouse-sm">
                        <li>
                            Sub-second eventual consistency on reference data
                            was acceptable for our use case, but had to be sold
                            to ops as a deliberate choice rather than an
                            artifact.
                        </li>
                    </ul>
                </div>
            </RevealOnScroll>
        </section>

        <section class="case-section">
            <RevealOnScroll>
                <h2 class="case-section__title mouse-md">Rollout</h2>
            </RevealOnScroll>
            <RevealOnScroll>
                <div class="case-section__body">
                    <p class="mouse-sm">
                        Shadow mode did double duty - proving both correctness
                        and speed. For every production request,
                        <code>cascade-core</code> kept calling the legacy path
                        and additionally called <code>cascade-builder</code>,
                        then logged a side-by-side comparison:
                    </p>
                    <pre
                        class="case-code"
                    ><code>discovery_comparison: nats=2(14.2ms) legacy=2(91.7ms)
                     order_match=True missing_in_nats=0 extra_in_nats=0</code></pre>
                    <p class="mouse-sm">
                        We watched four signals in Grafana before flipping any
                        traffic:
                    </p>
                    <ul class="mouse-sm">
                        <li>
                            <code>order_match</code> - provider ordering
                            identical between paths.
                        </li>
                        <li>
                            <code>only_in_legacy</code> /
                            <code>only_in_nats</code> - set-difference of
                            returned providers.
                        </li>
                        <li>
                            <code>speedup_factor</code> -
                            <code>legacy_ms / nats_ms</code>.
                        </li>
                        <li>
                            Per-step latency, to confirm the cache path stayed
                            flat under load.
                        </li>
                    </ul>
                    <p class="mouse-sm">
                        Any divergence funneled back to either a documented
                        known difference or a real bug to fix. Cutover was a
                        config flag, with the legacy path one redeploy away.
                    </p>
                </div>
            </RevealOnScroll>
        </section>

        <section class="case-section">
            <RevealOnScroll>
                <h2 class="case-section__title mouse-md">Result</h2>
            </RevealOnScroll>
            <RevealOnScroll>
                <div class="case-section__body">
                    <div class="case-metrics">
                        <div class="case-metric">
                            <div class="case-metric__label">
                                Provider-discovery latency (p50)
                            </div>
                            <div class="case-metric__value">
                                50–60 ms → 3–5 ms
                            </div>
                        </div>
                        <div class="case-metric">
                            <div class="case-metric__label">
                                Hot-path DB queries per request
                            </div>
                            <div class="case-metric__value">
                                6–10 → 1 (live deposit only)
                            </div>
                        </div>
                        <div class="case-metric">
                            <div class="case-metric__label">Speedup</div>
                            <div class="case-metric__value">~15×</div>
                        </div>
                    </div>
                    <p class="mouse-sm">
                        Directionally: at ~400 TPS the old path spent ~20
                        cumulative DB-seconds per wall second on discovery
                        alone. Most of that is reclaimed. The user-facing win is
                        that the saved 40–55 ms now sits in our retry budget -
                        when a provider declines, we can try the next one sooner
                        without blowing past the client timeout.
                    </p>
                    <p class="mouse-sm">
                        Build took 3–4 weeks; the service has been in production
                        for ~3 weeks with no rollbacks.
                    </p>
                </div>
            </RevealOnScroll>
        </section>

        <section class="case-section">
            <RevealOnScroll>
                <h2 class="case-section__title mouse-md">Reflection</h2>
            </RevealOnScroll>
            <RevealOnScroll>
                <div class="case-section__body">
                    <p class="mouse-sm">
                        Two things shadow mode caught that I'd have missed
                        otherwise: a couple of interval-boundary mismatches
                        around fee-rule <code>max_amount</code> (closed vs.
                        half-open), and an ordering difference because the new
                        sorter ranks on total rate rather than provider fee
                        alone. Both were intentional in the new design but would
                        have looked like regressions in production without the
                        side-by-side comparison log.
                    </p>
                    <p class="mouse-sm">
                        If I were starting over I'd build the comparison harness
                        <em>first</em>, before any of the engine code. It was
                        the single highest-leverage thing in the project and the
                        only reason the cutover was boring.
                    </p>
                </div>
            </RevealOnScroll>
        </section>
    </div>
</template>

<style lang="scss" scoped>
.case-page {
    max-width: 880px;
    gap: 80px;
    padding: 80px 48px 96px;
    margin: 80px auto 120px;
    background: rgba(15, 15, 15, 0.9);
    backdrop-filter: blur(18px) saturate(140%);
    -webkit-backdrop-filter: blur(18px) saturate(140%);

    @media only screen and (max-width: 678px) {
        gap: 48px;
        padding: 48px 24px 64px;
        margin: 48px 0 64px;
        border-radius: 12px;
    }
}

.case-hero {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.case-hero__eyebrow {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: $secondary;
}

.case-hero__title {
    font-size: 3rem;
    font-weight: 500;
    line-height: 1.1;
    margin: 0;
    text-wrap: balance;

    @media only screen and (max-width: 678px) {
        font-size: 1.8rem;
    }
}

.case-hero__lede {
    font-size: 1.3rem;
    font-weight: 400;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.78);
    max-width: 760px;
    margin: 0;

    @media only screen and (max-width: 678px) {
        font-size: 1rem;
    }
}

.case-meta {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px 32px;
    margin: 24px 0 0;
    padding: 24px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.03);

    @media only screen and (max-width: 678px) {
        grid-template-columns: 1fr;
        padding: 16px;
    }
}

.case-meta__row {
    display: flex;
    flex-direction: column;
    gap: 4px;

    dt {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: $secondary;
    }

    dd {
        font-size: 1rem;
        font-weight: 500;
        margin: 0;
    }
}

.case-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.case-section__title {
    font-size: 1.5rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: $primary;
    margin: 0;

    &::before {
        content: "[ ";
        color: $secondary;
    }

    &::after {
        content: " ]";
        color: $secondary;
    }
}

.case-section__body {
    display: flex;
    flex-direction: column;
    gap: 16px;
    font-size: 1.05rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.85);
    max-width: 760px;

    p,
    li {
        font-weight: 400;
    }

    code {
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        font-size: 0.9em;
        padding: 1px 6px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.06);
        color: rgba(255, 255, 255, 0.92);
    }

    ul {
        padding-left: 1.2em;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    @media only screen and (max-width: 678px) {
        font-size: 0.9rem;
    }
}

.case-code {
    margin: 0;
    padding: 16px 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.03);
    overflow-x: auto;
    font-size: 0.85rem;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.88);

    code {
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        background: transparent;
        padding: 0;
        white-space: pre;
    }

    @media only screen and (max-width: 678px) {
        font-size: 0.75rem;
        padding: 12px 14px;
    }
}

.case-metrics {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;

    @media only screen and (max-width: 678px) {
        grid-template-columns: 1fr;
    }
}

.case-metric {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.03);
}

.case-metric__label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: $secondary;
}

.case-metric__value {
    font-size: 1.1rem;
    font-weight: 500;
    color: $primary;
    line-height: 1.3;
}
</style>
