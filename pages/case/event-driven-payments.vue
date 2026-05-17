<script setup lang="ts">
const { $router } = useNuxtApp();

useSeoMeta({
    title: "Turning single-shot withdrawals into a durable cascade",
    description:
        "How I replaced single-shot withdrawal attempts with an FSM-driven cascade orchestrated over NATS JetStream events and delayed messages - lifting withdrawal success from 10-20% to 50-60%.",
    ogTitle:
        "Turning single-shot withdrawals into a durable cascade - Picunada",
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
                    Turning single-shot withdrawals into a durable cascade
                </h1>
            </RevealOnScroll>
            <RevealOnScroll>
                <p class="case-hero__lede mouse-md">
                    Lifting withdrawal success from 10-20% to 50-60% by
                    replacing single-shot provider attempts with a durable,
                    FSM-driven cascade - orchestrated end-to-end through NATS
                    JetStream events and delayed messages, with no long-lived
                    processes.
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
                        2025 · ~1.5 months build · in production
                    </dd>
                </div>
                <div class="case-meta__row">
                    <dt class="mouse-sm">Stack</dt>
                    <dd class="mouse-sm">
                        Python (FastAPI + SQLAlchemy) · NATS JetStream ·
                        PostgreSQL · Prometheus · OpenTelemetry
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
                        When a user requests a withdrawal, our platform routes
                        it to a payment provider that pushes the money out.
                        Provider behavior varies wildly: some confirm in
                        seconds, others take up to 15 minutes to settle and
                        call back with a webhook. Some reject the order
                        outright, some accept and then fail mid-flight, some
                        never respond at all.
                    </p>
                    <p class="mouse-sm">
                        The old withdrawal path lived inside
                        <code>cascade-core</code> and was effectively
                        single-shot: build the eligibility cascade, take the
                        cheapest provider off the top, create one withdrawal
                        order, return. If that provider declined or timed out,
                        the withdrawal failed - falling to manual handling or
                        a user retry. We were leaving the rest of the cascade,
                        sometimes a dozen otherwise-viable providers, on the
                        floor on every failure.
                    </p>
                    <p class="mouse-sm">Two compounding issues:</p>
                    <ul class="mouse-sm">
                        <li>
                            <strong>Coverage.</strong> A single attempt against
                            the cheapest provider is a poor strategy when
                            provider availability fluctuates minute-to-minute.
                            The best-fee provider's approval rate was nowhere
                            near 100%; every miss was a lost or delayed
                            withdrawal. Successful withdrawals sat at just
                            10-20%.
                        </li>
                        <li>
                            <strong>Time.</strong> Trying providers
                            sequentially when each can take up to 15 minutes
                            to acknowledge means the workflow can't live inside
                            a synchronous HTTP request, an in-memory worker, or
                            anything bound to a single process's lifecycle. It
                            had to be durable and resumable.
                        </li>
                    </ul>
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
                            <strong>Money safety is non-negotiable.</strong>
                            Every withdrawal touches provider balances; partial
                            state from a crash mid-flight cannot translate
                            into double-spends or stuck frozen funds.
                        </li>
                        <li>
                            <strong>API shape preserved.</strong>
                            <code>cascade-core</code>'s external API can't
                            change just because withdrawal execution is being
                            rewired underneath.
                        </li>
                        <li>
                            <strong>Webhook integrity.</strong> Provider
                            webhooks must be HMAC-validated before they touch
                            state.
                        </li>
                        <li>
                            <strong>Sign-off.</strong> Ops (new service to
                            operate, on-call rotation), finance (balance
                            accounting model), CTO (architecture).
                        </li>
                    </ul>
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
                        I built <code>payment-service</code>, a Python
                        microservice that owns withdrawal execution end-to-end.
                        <code>cascade-core</code> no longer attempts providers
                        itself - it hands the full cascade to
                        <code>payment-service</code> and walks away. The
                        service drives the withdrawal through the cascade in
                        its own time.
                    </p>

                    <h3 class="case-subhead">Core abstractions</h3>
                    <ul class="mouse-sm">
                        <li>
                            <code>OrderQueue</code> - one per withdrawal,
                            containing an ordered list of
                            <code>OrderTask</code>s (one per provider from the
                            cascade).
                        </li>
                        <li>
                            <code>OrderTask</code> - one provider attempt,
                            driven by a finite state machine:
                        </li>
                    </ul>
                    <pre
                        class="case-code"
                    ><code>PENDING → CREATING → EXECUTING → SUCCEEDED
                ↘ NEGATIVE_EVAL → SKIPPED
                              ↘ RECHECKING → EXECUTING / FAILED
                EXECUTING → MANUAL_CHECK → SUCCEEDED / FAILED</code></pre>
                    <p class="mouse-sm">
                        Queue rule: any task <code>SUCCEEDED</code> → queue
                        <code>COMPLETED</code>, remaining tasks stop. All tasks
                        terminal without a success → queue
                        <code>FAILED</code>, balances unwound.
                    </p>

                    <h3 class="case-subhead">
                        How "long-running" works without a long-lived process
                    </h3>
                    <p class="mouse-sm">
                        Nothing in the service holds a request open for 15
                        minutes. The state machine is driven entirely by NATS
                        JetStream events and delayed messages
                        (<code>Nats-Delay</code>) acting as durable timers:
                    </p>
                    <ul class="mouse-sm">
                        <li>
                            <code>order.task.recheck.tick</code> -
                            exponential-backoff polls when a provider returned
                            an ambiguous error.
                        </li>
                        <li>
                            <code>order.task.webhook.timeout</code> - fires if
                            the provider hasn't called back by the SLA
                            deadline.
                        </li>
                        <li>
                            <code>order.task.status.tick</code> /
                            <code>order.task.status.timeout</code> - optional
                            status-polling fallback.
                        </li>
                        <li>
                            <code>order.task.webhook.received</code> -
                            forwarded by <code>provider-service</code> after
                            HMAC validation.
                        </li>
                    </ul>
                    <p class="mouse-sm">
                        Each step is a stateless handler that reads the task
                        from Postgres, advances the FSM, persists, and
                        publishes the next event. Consumers are durable with
                        explicit ack and <code>MaxDeliver=N</code>; anything
                        that fails repeatedly republishes to
                        <code>order.task.dlq</code> for alerting. A 15-minute
                        provider wait is just one row in Postgres and one
                        delayed message in JetStream - nothing pinned in
                        memory.
                    </p>

                    <h3 class="case-subhead">Money safety</h3>
                    <p class="mouse-sm">
                        Balance operations route through
                        <code>cascade-core</code> as the single source of
                        truth, keyed by <code>task_id</code> for idempotency:
                    </p>
                    <ul class="mouse-sm">
                        <li><code>freeze</code> on <code>CREATING</code></li>
                        <li>
                            <code>commit</code> on
                            <code>SUCCEEDED</code> (atomic: provider debit +
                            terminal credit)
                        </li>
                        <li>
                            <code>rollback</code> on
                            <code>FAILED</code> / <code>SKIPPED</code> /
                            <code>CANCELLED</code>
                        </li>
                    </ul>
                    <p class="mouse-sm">
                        Task state only advances after the balance call returns
                        200. If the balance API fails, the task doesn't move;
                        the message retries. Idempotent balance calls, an
                        <code>order_task_events</code> audit table, and an
                        optimistic-locking version field on writes mean a
                        duplicate delivery or partial crash cannot produce a
                        double-spend.
                    </p>

                    <h3 class="case-subhead">Operational surface</h3>
                    <ul class="mouse-sm">
                        <li>
                            <strong>Manual check path</strong> for stuck
                            <code>EXECUTING</code> tasks with no SLA or
                            exhausted retries - support resolves them as
                            positive (commit) or negative (rollback), and the
                            decision itself is a typed event with full audit
                            trail.
                        </li>
                        <li>
                            <strong>Cancellation</strong> at task or queue
                            granularity, with balance rollback on every active
                            task.
                        </li>
                        <li>
                            <strong>Observability:</strong> Prometheus metrics
                            (<code>task_time_in_state</code>,
                            <code>dlq_size</code>,
                            <code>core_notifications_total</code>) and
                            structured logs with <code>order_id</code> /
                            <code>queue_id</code> / <code>task_id</code> /
                            <code>trace_id</code> for end-to-end tracing across
                            services.
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
                        Direct cutover - no shadow mode, no percentage gating.
                        The old single-shot path and the new orchestrated path
                        produce fundamentally different outcomes (one attempt
                        vs. many), so a per-request comparison wouldn't have
                        been meaningful. We mitigated risk by leaning on
                        idempotent balance operations, finance reconciliation
                        on day one, and ops on standby.
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
                                Withdrawal success rate
                            </div>
                            <div class="case-metric__value">
                                10-20% → 50-60%
                            </div>
                        </div>
                        <div class="case-metric">
                            <div class="case-metric__label">
                                Manual-check rate
                            </div>
                            <div class="case-metric__value">3-5%</div>
                        </div>
                        <div class="case-metric">
                            <div class="case-metric__label">
                                Provider attempts per withdrawal
                            </div>
                            <div class="case-metric__value">
                                1 → full cascade until success
                            </div>
                        </div>
                        <div class="case-metric">
                            <div class="case-metric__label">
                                Balance discrepancies post-rollout
                            </div>
                            <div class="case-metric__value">
                                0 (finance reconciled)
                            </div>
                        </div>
                    </div>
                    <p class="mouse-sm">
                        A 3-5× lift in withdrawal success translates directly
                        into customer-facing reliability and into revenue we
                        were previously declining by giving up after one
                        provider. The low 3-5% manual-check rate confirms the
                        automated paths (recheck, status polling, DLQ) handle
                        the long tail without dumping work on support.
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
                        The bigger lesson from this project was about rollout.
                        A direct cutover worked, but it worked because of
                        idempotent balance operations and aggressive day-one
                        monitoring - not because the cutover itself was safe.
                        Next time, even when shadow comparison isn't
                        meaningful, I'd ship behind a per-merchant or
                        percentage flag so a regression is bounded.
                    </p>
                    <p class="mouse-sm">
                        The FSM and JetStream-timer-as-durable-state pattern,
                        on the other hand, were the right calls and I'd reach
                        for them again - they're what made a 15-minute
                        external dependency tractable inside a stateless
                        service.
                    </p>
                </div>
            </RevealOnScroll>
        </section>
    </div>
</template>

<style lang="scss" scoped>
.case-page {
    gap: 80px;
    padding: 80px 48px 96px;
    margin: 80px 0 120px;
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

.case-subhead {
    font-size: 1rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: $secondary;
    margin: 16px 0 0;

    @media only screen and (max-width: 678px) {
        font-size: 0.85rem;
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
    grid-template-columns: repeat(2, 1fr);
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
