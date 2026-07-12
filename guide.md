 Build "OpsQuest": A Gamified, Animated, 100% Practical DevOps Learning + Interview Prep Platform

You are a senior full-stack engineer and instructional designer. Build a single, unified web platform that combines the best of prepare.sh (hands-on tutorials + real interview questions solved in live environments) and Educative (interactive, in-browser, text-first courses with embedded widgets) — but gamified, beautifully animated, and 100% practical. Every single concept must be taught through working code, animated diagrams, and interview-style challenges. No theory-only pages. No videos required — everything is interactive text, diagrams, and terminals.

---

## 1. TECHNOLOGY COVERAGE (all tracks, nothing skipped)

**DevOps / Infrastructure:** Linux, Git, Docker, Kubernetes, Helm, Ansible, Terraform, Jenkins, GitHub Actions, GitLab CI, Argo CD, OKD (OpenShift), Nginx, HAProxy, Envoy, Kong, Istio, F5, cert-manager, external-dns, Keycloak, Vault, Trivy, WireGuard, Prometheus, Grafana, OpenTelemetry, AWS, Azure, Google Cloud, Cloudflare

**Data Engineering:** Airflow, Spark, Kafka, Flink, dbt, Dagster, Prefect, BigQuery, Snowflake, Databricks, ClickHouse, Elasticsearch, PostgreSQL, MongoDB, Redis, RabbitMQ

**Analytics / BI:** Power BI, Tableau

**Testing / QA:** Cypress, Playwright, Postman, Gatling

Each technology is a **Skill Track** with: Beginner → Intermediate → Advanced → Interview-Ready tiers.

---

## 2. LEARNING FORMAT (per lesson — the non-negotiable template)

Every lesson MUST follow this exact structure:

1. **Real-world scenario hook** (2–3 sentences): "Users report slow file access, disk I/O is maxed out. You're the on-call engineer." — always framed as a production incident or a task a working engineer gets.
2. **Animated diagram** (SVG/Canvas, framer-motion or GSAP): the core concept animated step by step — packets flowing through a load balancer, pods being scheduled, a Git rebase rewriting commits, Kafka partitions receiving messages, an Airflow DAG lighting up task by task. User can play/pause/scrub/step through the animation.
3. **Interactive walkthrough**: every command shown with (a) the exact working command, (b) annotated real output, (c) a one-line "why this flag" explanation. All code copy-paste runnable. No pseudocode, ever.
4. **Embedded live terminal / sandbox** (browser-based: xterm.js + WebContainers/gVisor-style backend, or a simulated terminal with a validated command engine for MVP): the user must actually type the commands and pass automated checks to complete the lesson.
5. **Challenge task** ("Your turn"): a variation of the scenario with automated validation (e.g., "the file /tmp/solution.txt must contain the offending PID").
6. **Interview corner**: 2–3 real interview questions on this exact topic, tagged with company names and difficulty (Easy/Medium/Hard), with a model spoken-answer script ("Here's how you'd explain this in an interview in 60 seconds") plus the hands-on version.
7. **XP awarded + streak update** on completion.

## 3. INTERVIEW QUESTION BANK (prepare.sh-style, first-class section)

A dedicated **/interview** section, structured exactly like prepare.sh/interview-questions/devops:

- Questions grouped by topic: Linux, Docker, Kubernetes, Git, CI/CD, AWS/Azure/GCP, Networking, Terraform, Databases (PostgreSQL/Redis/MongoDB), Kafka & Streaming, Observability (Prometheus/Grafana/OTel), Security (Vault/Keycloak/Trivy/WireGuard), Data Engineering (Airflow/Spark/dbt), Testing (Cypress/Playwright/Postman/Gatling), plus a DSA/Programming section (Two Sum, Valid Parentheses, Binary Search, etc. in Python).
- Each question card shows: **difficulty badge (Easy/Medium/Hard) • company tag with logo • scenario description written like a real incident • "Solve in environment →" button** that opens the lesson-style live sandbox pre-loaded with the broken state (e.g., a pod stuck in CrashLoopBackOff, a port conflict on 8080, a repo in detached HEAD).
- Full model answers hidden behind a "Reveal solution" toggle — first the reasoning, then commands, then an animated diagram of what happened under the hood.
- Filters: topic, difficulty, company, "not yet solved", "failed attempts".
- Counters at the top: total questions, companies, Easy/Med/Hard split (like "42/49/9").
- Seed the bank with at least 15 questions per major topic covering the classic real scenarios: OOMKilled pods, ImagePullBackOff + registry secrets, inode exhaustion, port exhaustion (TIME_WAIT), noisy-neighbor CPU in nginx workers, log-partition analysis, SSH lockout, rate-limit calculation from access logs, systemd on-failure restart policies, Git filter-branch secret removal, reflog recovery, cherry-pick vs checkout-file, multi-stage Dockerfile optimization (800MB→<200MB), SIGTERM/graceful shutdown, Docker log rotation, IAM least-privilege audits, VPC + NAT egress-only design, serverless API (Lambda + API GW + DynamoDB), StatefulSet + headless DNS, CRD schema validation, canary traffic splitting with native Services, GitHub Actions matrix builds, artifact handoff between jobs, path-filtered workflows, and automated rollback on deploy failure.

## 4. GAMIFICATION SYSTEM

- **XP & Levels**: XP per lesson/challenge/interview question (scaled by difficulty). Levels themed by role: "Junior On-Call" → "SRE" → "Platform Engineer" → "Principal Architect".
- **Skill Tree**: a visual, zoomable, animated skill-tree map (think a metro map / tech constellation) where each technology is a node; completing prerequisites unlocks connected nodes with a satisfying unlock animation.
- **Streaks** with freeze tokens, **daily quest** (one random interview question), **weekly boss fight** (a multi-step incident combining 3+ technologies, e.g., "Kafka consumer lag is spiking, Grafana shows pod OOMKills, and the deploy pipeline is red — fix production").
- **Badges**: per-tech mastery badges (e.g., "Kubernetes Firefighter" for solving all K8s Hard questions), company badges ("Solved every Google-tagged question").
- **Leaderboard** (weekly, friends, global) + shareable public profile with solved-question heatmap (GitHub-style contribution grid).
- **Interview Readiness Score** per topic (0–100) computed from solved questions weighted by difficulty and recency — with a "mock interview mode": timed, no hints, randomized 5-question gauntlet that simulates a real screening round.

## 5. UI/UX & ANIMATION REQUIREMENTS

- Stack: **React + TypeScript + Tailwind + framer-motion** (route transitions, micro-interactions), **GSAP or motion-driven SVG** for concept diagrams, **xterm.js** for terminals, **Monaco editor** for YAML/code challenges, **React Flow or custom SVG** for the skill tree and architecture diagrams.
- **Smooth transitions everywhere**: page transitions (shared-element where possible), animated progress rings, XP count-up animations, confetti on badge unlock, terminal output that types in.
- Dark mode default with light mode toggle; clean prepare.sh-like aesthetic — generous whitespace, difficulty color coding (green/amber/red), company logos on question cards.
- Fully responsive; keyboard-first navigation (j/k between questions, Enter to open, / to search).
- Global search (Cmd+K palette) across lessons, questions, commands ("search: fix ImagePullBackOff").
- Performance: lazy-load animations, code-split per track, 60fps transitions.

## 6. CONTENT DEPTH RULES

- Every command must be real and tested — exact flags, exact output.
- Every YAML/HCL/Dockerfile/pipeline file must be complete and applyable as-is — never "..." or "add your config here".
- Every animated diagram must map 1:1 to what the commands actually do (e.g., when the lesson runs `kubectl scale`, the diagram shows new pods appearing on nodes).
- Every topic ends with a **"How to talk about this in an interview"** block: a 60–90 second model verbal answer, common follow-up questions, and the trap the interviewer is setting.
- Explanations must state the *why* (e.g., "SIGKILL can't be trapped because the kernel never delivers it to the process") not just the *how*.

## 7. ARCHITECTURE (what to build)

- Frontend: React SPA as above.
- Backend: Node/Fastify or Python/FastAPI — user auth, progress, XP, leaderboards, question bank API.
- Sandbox service: containerized per-user environments (Docker-in-Docker or Firecracker/gVisor microVMs) with a validation runner that checks task completion (file contents, service state, kubectl output). For MVP, a deterministic simulated-terminal engine with scripted command outputs and validators is acceptable — but design the interface so real environments can be swapped in.
- Content as code: lessons and questions defined in versioned MDX/YAML so contributors can add questions with frontmatter (topic, difficulty, company, validator script, diagram spec).
- Postgres for user data, Redis for sessions/leaderboards.

## 8. DELIVERABLES (in order)

1. Full information architecture + sitemap.
2. Design system (colors, typography, difficulty badges, card components).
3. The skill-tree home page, fully animated.
4. One complete flagship track end-to-end as the template: **Kubernetes** (12 lessons: cluster anatomy → first Deployment → probes → ConfigMaps/Secrets → RBAC → StatefulSets + headless DNS → storage/PVC expansion → CrashLoopBackOff debugging → OOMKilled analysis → canary traffic splitting → CRDs + schema validation → cert-manager TLS), each following the 7-part lesson template with working code and animated diagrams.
5. The interview question bank with 30 fully-written questions (10 Linux, 10 Kubernetes, 5 Docker, 5 Git) including validators and reveal-style solutions.
6. Gamification layer wired end-to-end (XP, streaks, one boss fight, badges, leaderboard).
7. Then scale the same template to all remaining tracks.

Start with deliverable 1 and 2, show me the skill tree and one full Kubernetes lesson ("Debug a CrashLoopBackOff pod") with its animated diagram, live terminal challenge, validator, and interview corner — then wait for my feedback before continuing.