import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  Check,
  ChevronRight,
  CircleHelp,
  Flame,
  GitBranch,
  Layers3,
  Lock,
  Moon,
  Pause,
  Play,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import "./styles.css";

type Page = "home" | "lesson" | "architecture" | "design";
const tracks = [
  { name: "Linux", icon: ">_", x: 8, y: 51, state: "done", color: "#60a5fa" },
  { name: "Git", icon: "⑂", x: 24, y: 28, state: "done", color: "#f97316" },
  {
    name: "Docker",
    icon: "▣",
    x: 41,
    y: 49,
    state: "active",
    color: "#38bdf8",
  },
  {
    name: "Kubernetes",
    icon: "⎈",
    x: 59,
    y: 28,
    state: "active",
    color: "#a78bfa",
  },
  { name: "Helm", icon: "◉", x: 76, y: 49, state: "locked", color: "#818cf8" },
  {
    name: "Terraform",
    icon: "T",
    x: 92,
    y: 27,
    state: "locked",
    color: "#a78bfa",
  },
  {
    name: "CI / CD",
    icon: "↻",
    x: 58,
    y: 72,
    state: "locked",
    color: "#fbbf24",
  },
  { name: "Cloud", icon: "☁", x: 80, y: 78, state: "locked", color: "#34d399" },
];
const lessonSteps = [
  {
    label: "Pod starts",
    detail: "kubelet starts the container from the declared image.",
  },
  { label: "Process exits", detail: "The command fails with exit code 1." },
  {
    label: "Back-off",
    detail: "kubelet waits before trying again to protect the node.",
  },
  {
    label: "Previous logs",
    detail: "kubectl logs --previous reveals the last failed container.",
  },
  {
    label: "Fix & recover",
    detail: "Patch the command; the pod becomes Ready.",
  },
];
const commandMap: Record<string, string> = {
  "kubectl get pods": [
    "NAME        READY   STATUS             RESTARTS   AGE",
    "payments-7c   0/1     CrashLoopBackOff   5          4m",
  ].join("\n"),
  "kubectl describe pod payments-7c": [
    "Containers:",
    "  api:",
    "    State:          Waiting",
    "      Reason:       CrashLoopBackOff",
    "    Last State:     Terminated",
    "      Reason:       Error",
    "      Exit Code:    1",
    "Events:",
    "  Warning  BackOff  Back-off restarting failed container api",
  ].join("\n"),
  "kubectl logs payments-7c --previous": [
    "2026-07-12T08:41:03Z starting payments-api",
    "FATAL: dial tcp: lookup postgres-db: no such host",
  ].join("\n"),
  "kubectl set env deployment/payments DB_HOST=postgres": [
    "deployment.apps/payments env updated",
  ].join("\n"),
  "kubectl rollout status deployment/payments": [
    'Waiting for deployment "payments" rollout to finish: 1 old replicas are pending termination...',
    'deployment "payments" successfully rolled out',
  ].join("\n"),
};

function App() {
  const [page, setPage] = useState<Page>("home");
  const [dark, setDark] = useState(true);
  const [search, setSearch] = useState(false);
  const [xp, setXp] = useState(1280);
  const [streak] = useState(7);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearch(true);
      }
      if (e.key === "/") {
        e.preventDefault();
        setSearch(true);
      }
      if (e.key === "Escape") setSearch(false);
    };
    addEventListener("keydown", h);
    return () => removeEventListener("keydown", h);
  }, []);
  const go = (p: Page) => {
    setPage(p);
    scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="app">
      <Nav
        go={go}
        page={page}
        dark={dark}
        setDark={setDark}
        setSearch={setSearch}
        xp={xp}
        streak={streak}
      />
      <AnimatePresence mode="wait">
        <motion.main
          key={page}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28 }}
        >
          {page === "home" && <Home go={go} />}{" "}
          {page === "lesson" && <Lesson setXp={setXp} />}{" "}
          {page === "architecture" && <Architecture />}{" "}
          {page === "design" && <DesignSystem />}
        </motion.main>
      </AnimatePresence>
      <Footer go={go} />
      {search && <SearchPalette close={() => setSearch(false)} go={go} />}
    </div>
  );
}
function Nav({
  go,
  page,
  dark,
  setDark,
  setSearch,
  xp,
  streak,
}: {
  go: (p: Page) => void;
  page: Page;
  dark: boolean;
  setDark: (v: boolean) => void;
  setSearch: (v: boolean) => void;
  xp: number;
  streak: number;
}) {
  return (
    <header>
      <button className="brand" onClick={() => go("home")}>
        <span className="brandmark">
          <TerminalSquare size={19} />
        </span>
        <span>OpsQuest</span>
        <b>ALPHA</b>
      </button>
      <nav>
        <button
          className={page === "home" ? "on" : ""}
          onClick={() => go("home")}
        >
          Skill tree
        </button>
        <button
          className={page === "lesson" ? "on" : ""}
          onClick={() => go("lesson")}
        >
          Kubernetes lab
        </button>
        <button
          className={page === "architecture" ? "on" : ""}
          onClick={() => go("architecture")}
        >
          Sitemap
        </button>
        <button
          className={page === "design" ? "on" : ""}
          onClick={() => go("design")}
        >
          Design system
        </button>
      </nav>
      <div className="nav-actions">
        <button className="search-btn" onClick={() => setSearch(true)}>
          <Search size={15} /> Search <kbd>⌘K</kbd>
        </button>
        <span className="stat fire">
          <Flame size={16} />
          {streak}
        </span>
        <span className="stat xp">
          <Zap size={15} />
          {xp.toLocaleString()} XP
        </span>
        <button
          className="icon-btn"
          aria-label="Toggle theme"
          onClick={() => setDark(!dark)}
        >
          {dark ? <Moon size={17} /> : <Sparkles size={17} />}
        </button>
        <div className="avatar">SK</div>
      </div>
    </header>
  );
}
function Home({ go }: { go: (p: Page) => void }) {
  return (
    <>
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-copy">
          <motion.div
            className="eyebrow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            THE PRACTICAL DEVOPS MAP <span>•</span> 6 OF 64 SKILLS UNLOCKED
          </motion.div>
          <h1>
            Learn production.
            <br />
            <em>By fixing it.</em>
          </h1>
          <p>
            No videos. No passive theory. Debug real incidents, type real
            commands, and build the muscle memory interviews actually test.
          </p>
          <div className="hero-cta">
            <button className="primary" onClick={() => go("lesson")}>
              Continue Kubernetes <ArrowRight size={17} />
            </button>
            <button className="secondary" onClick={() => go("architecture")}>
              Explore the platform
            </button>
          </div>
        </div>
        <div className="quest-card">
          <div className="quest-top">
            <span>
              <Flame size={16} /> DAILY QUEST
            </span>
            <b>+120 XP</b>
          </div>
          <h3>The pod that won’t stay up</h3>
          <p>
            Find why a production container keeps restarting—and ship the fix.
          </p>
          <div className="quest-meta">
            <span>12 min</span>
            <span>Intermediate</span>
          </div>
          <button onClick={() => go("lesson")}>
            Start incident <ArrowRight size={15} />
          </button>
        </div>
      </section>
      <section className="section tree-section">
        <div className="section-head">
          <div>
            <span className="kicker">YOUR LEARNING PATH</span>
            <h2>The infrastructure constellation</h2>
            <p>
              Every node is a working skill. Follow the paths—or choose your own
              incident.
            </p>
          </div>
          <div className="legend">
            <span>
              <i className="done" />
              Mastered
            </span>
            <span>
              <i className="active" />
              Available
            </span>
            <span>
              <i />
              Locked
            </span>
          </div>
        </div>
        <SkillTree go={go} />
      </section>
      <section className="section continue">
        <div className="section-head">
          <div>
            <span className="kicker">PICK UP WHERE YOU LEFT OFF</span>
            <h2>Active missions</h2>
          </div>
        </div>
        <div className="cards">
          <article className="mission purple">
            <div className="mission-icon">⎈</div>
            <span className="badge medium">INTERMEDIATE</span>
            <h3>Debug a CrashLoopBackOff pod</h3>
            <p>Kubernetes · Incident 8 of 12</p>
            <div className="progress">
              <i style={{ width: "58%" }} />
            </div>
            <footer>
              <span>58% complete</span>
              <button onClick={() => go("lesson")}>
                Resume <ArrowRight size={14} />
              </button>
            </footer>
          </article>
          <article className="mission blue">
            <div className="mission-icon">▣</div>
            <span className="badge easy">BEGINNER</span>
            <h3>Shrink a production image</h3>
            <p>Docker · Incident 3 of 10</p>
            <div className="progress">
              <i style={{ width: "20%" }} />
            </div>
            <footer>
              <span>20% complete</span>
              <button>
                Continue <ArrowRight size={14} />
              </button>
            </footer>
          </article>
          <article className="boss">
            <div>
              <span className="kicker">WEEKLY BOSS FIGHT</span>
              <h3>The midnight cascade</h3>
              <p>Kafka lag. OOMKills. A failed deploy. You have 45 minutes.</p>
            </div>
            <span className="boss-lock">
              <Lock /> Unlock at level 8
            </span>
          </article>
        </div>
      </section>
    </>
  );
}
function SkillTree({ go }: { go: (p: Page) => void }) {
  return (
    <div className="tree">
      <svg viewBox="0 0 1000 430" preserveAspectRatio="none">
        <defs>
          <linearGradient id="path" x1="0" x2="1">
            <stop stopColor="#38bdf8" />
            <stop offset=".65" stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#303344" />
          </linearGradient>
        </defs>
        <motion.path
          d="M85 220 C150 100 210 100 250 125 S350 260 420 215 S510 70 590 125 S690 240 760 215 S850 80 920 120"
          fill="none"
          stroke="url(#path)"
          strokeWidth="4"
          strokeDasharray="9 8"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ duration: 1.6 }}
        />
        <path
          d="M420 215 C510 340 560 350 585 310 S680 260 760 335"
          fill="none"
          stroke="#343749"
          strokeWidth="4"
          strokeDasharray="9 8"
        />
      </svg>
      {tracks.map((t, i) => (
        <motion.button
          key={t.name}
          className={"node " + t.state}
          style={
            {
              left: `${t.x}%`,
              top: `${t.y}%`,
              "--node": t.color,
            } as React.CSSProperties
          }
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ delay: i * 0.07, type: "spring" }}
          onClick={() => t.name === "Kubernetes" && go("lesson")}
        >
          <span>{t.state === "locked" ? <Lock size={17} /> : t.icon}</span>
          <b>{t.name}</b>
          <small>
            {t.state === "done" ? (
              <>
                <Check size={10} /> MASTERED
              </>
            ) : t.state === "active" ? (
              "AVAILABLE"
            ) : (
              "LOCKED"
            )}
          </small>
        </motion.button>
      ))}
    </div>
  );
}

function Lesson({
  setXp,
}: {
  setXp: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [step, setStep] = useState(0),
    [playing, setPlaying] = useState(false),
    [history, setHistory] = useState<{ cmd: string; out: string }[]>([]),
    [input, setInput] = useState(""),
    [fixed, setFixed] = useState(false),
    [complete, setComplete] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(
      () =>
        setStep((s) => {
          if (s >= 4) {
            setPlaying(false);
            return 4;
          }
          return s + 1;
        }),
      1300,
    );
    return () => clearInterval(t);
  }, [playing]);
  const run = () => {
    const cmd = input.trim();
    if (!cmd) return;
    let out =
      commandMap[cmd] ||
      `bash: ${cmd.split(" ")[0]}: command not available in this lab`;
    if (cmd === "kubectl set env deployment/payments DB_HOST=postgres")
      setFixed(true);
    if (cmd === "kubectl rollout status deployment/payments" && !fixed)
      out =
        "error: deployment is still failing — inspect previous logs and correct DB_HOST first";
    setHistory((h) => [...h, { cmd, out }]);
    setInput("");
  };
  const validate = () => {
    if (fixed) {
      setComplete(true);
      setXp((x) => x + 180);
    }
  };
  return (
    <div className="lesson-shell">
      <aside className="lesson-nav">
        <button className="back" onClick={() => window.history.back()}>
          ← Back to skill tree
        </button>
        <div className="track-title">
          <span>⎈</span>
          <div>
            <small>KUBERNETES</small>
            <b>Production debugging</b>
          </div>
        </div>
        <div className="lesson-progress">
          <span>8 of 12 lessons</span>
          <b>67%</b>
          <div>
            <i />
          </div>
        </div>
        {[
          "Cluster anatomy",
          "Your first Deployment",
          "Liveness & readiness probes",
          "ConfigMaps & Secrets",
          "RBAC without regret",
          "StatefulSets & headless DNS",
          "Storage & PVC expansion",
          "Debug a CrashLoopBackOff",
          "Diagnose OOMKilled",
          "Canary traffic splitting",
          "CRDs & schema validation",
          "cert-manager TLS",
        ].map((x, i) => (
          <div
            className={
              "lesson-link " + (i === 7 ? "current" : i < 7 ? "finished" : "")
            }
            key={x}
          >
            <span>{i < 7 ? <Check size={12} /> : i + 1}</span>
            {x}
          </div>
        ))}
      </aside>
      <article className="lesson">
        <div className="lesson-top">
          <span className="badge medium">INTERMEDIATE</span>
          <span>12–15 MIN</span>
          <span>
            <Zap size={13} /> 180 XP
          </span>
        </div>
        <h1>
          Debug a <em>CrashLoopBackOff</em> pod
        </h1>
        <p className="lede">
          Checkout requests are failing. The payments pod starts, crashes, and
          Kubernetes keeps restarting it. You’re primary on-call—find the root
          cause and restore service before the error budget burns.
        </p>
        <section className="lesson-section">
          <div className="number">01</div>
          <div className="content">
            <span className="kicker">SEE THE SYSTEM</span>
            <h2>What Kubernetes is doing</h2>
            <p>
              CrashLoopBackOff is not the crash—it is kubelet slowing its
              restart attempts after the container repeatedly exits.
            </p>
            <div className="diagram">
              <div className="diagram-top">
                <div>
                  <b>Container restart loop</b>
                  <span>{lessonSteps[step].detail}</span>
                </div>
                <div className="diagram-controls">
                  <button onClick={() => setStep(Math.max(0, step - 1))}>
                    ‹
                  </button>
                  <button className="play" onClick={() => setPlaying(!playing)}>
                    {playing ? <Pause size={15} /> : <Play size={15} />}
                  </button>
                  <button onClick={() => setStep(Math.min(4, step + 1))}>
                    ›
                  </button>
                  <button
                    onClick={() => {
                      setStep(0);
                      setPlaying(false);
                    }}
                  >
                    <RotateCcw size={13} />
                  </button>
                </div>
              </div>
              <div className="flow">
                {lessonSteps.map((s, i) => (
                  <React.Fragment key={s.label}>
                    <motion.div
                      className={
                        "flow-node " +
                        (i === step ? "hot" : i < step ? "past" : "")
                      }
                      animate={i === step ? { scale: [1, 1.04, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                    >
                      <span>{i + 1}</span>
                      <b>{s.label}</b>
                    </motion.div>
                    {i < 4 && (
                      <div className={"flow-line " + (i < step ? "past" : "")}>
                        <motion.i
                          animate={i === step - 1 ? { x: ["0%", "500%"] } : {}}
                          transition={{ repeat: Infinity, duration: 1 }}
                        />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="scrub">
                {lessonSteps.map((_, i) => (
                  <button
                    className={i <= step ? "on" : ""}
                    onClick={() => setStep(i)}
                    key={i}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="lesson-section">
          <div className="number">02</div>
          <div className="content">
            <span className="kicker">INVESTIGATE</span>
            <h2>Walk the evidence, in order</h2>
            <Command
              cmd="kubectl get pods"
              output={commandMap["kubectl get pods"]}
              why="Start broad: confirm current state and restart count before drilling down."
            />
            <Command
              cmd="kubectl describe pod payments-7c"
              output={commandMap["kubectl describe pod payments-7c"]}
              why="describe includes container state, exit code and chronological cluster Events."
            />
            <Command
              cmd="kubectl logs payments-7c --previous"
              output={commandMap["kubectl logs payments-7c --previous"]}
              why="--previous reads the terminated container—the evidence a normal logs call can miss."
            />
          </div>
        </section>
        <section className="lesson-section">
          <div className="number">03</div>
          <div className="content">
            <span className="kicker">YOUR TURN</span>
            <h2>Restore the payments API</h2>
            <div className="challenge">
              <div className="challenge-head">
                <div>
                  <ShieldCheck />
                  <span>
                    <b>Mission objective</b>
                    <small>Production namespace · simulated cluster</small>
                  </span>
                </div>
                <span className="badge hard">LIVE LAB</span>
              </div>
              <p>
                The previous logs show DNS lookup failure for{" "}
                <code>postgres-db</code>. The actual Service is named{" "}
                <code>postgres</code>. Correct the Deployment’s{" "}
                <code>DB_HOST</code> and verify the rollout.
              </p>
              <ol>
                <li>Inspect the pods and previous logs.</li>
                <li>
                  Update <code>DB_HOST</code> on deployment{" "}
                  <code>payments</code>.
                </li>
                <li>Confirm the rollout completes.</li>
              </ol>
            </div>
            <div className="terminal">
              <div className="terminal-bar">
                <span>
                  <i />
                  <i />
                  <i />
                </span>
                <b>opsquest-lab / prod-cluster</b>
                <em>CONNECTED</em>
              </div>
              <div className="terminal-body">
                {history.length === 0 && (
                  <div className="term-intro">
                    OpsQuest Kubernetes sandbox ready.
                    <br />
                    Type <b>kubectl get pods</b> to begin.
                  </div>
                )}
                {history.map((h, i) => (
                  <div key={i} className="term-entry">
                    <div>
                      <span>ops@cluster:~$</span> {h.cmd}
                    </div>
                    <pre>{h.out}</pre>
                  </div>
                ))}
                <div className="prompt">
                  <span>ops@cluster:~$</span>
                  <input
                    autoComplete="off"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && run()}
                    placeholder="type a command…"
                  />
                  <button onClick={run}>Run</button>
                </div>
              </div>
            </div>
            <div className="validator">
              <div>
                <span className={fixed ? "check yes" : "check"}>
                  {fixed ? <Check /> : <CircleHelp />}
                </span>
                <div>
                  <b>Automated validator</b>
                  <p>
                    {fixed
                      ? "DB_HOST points to postgres. Ready to ship."
                      : "Waiting for the Deployment environment to be corrected."}
                  </p>
                </div>
              </div>
              <button
                className={fixed ? "primary" : "secondary"}
                onClick={validate}
                disabled={!fixed || complete}
              >
                {complete ? (
                  <>
                    <Check /> Mission complete · +180 XP
                  </>
                ) : (
                  <>
                    Validate fix <ArrowRight />
                  </>
                )}
              </button>
            </div>
            {complete && (
              <motion.div
                className="success"
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <Award />
                <div>
                  <b>Kubernetes Firefighter progress updated</b>
                  <span>8-day streak secured. Interview readiness +4.</span>
                </div>
              </motion.div>
            )}
          </div>
        </section>
        <section className="lesson-section">
          <div className="number">04</div>
          <div className="content">
            <span className="kicker">INTERVIEW CORNER</span>
            <h2>Explain it under pressure</h2>
            <Interview
              q="A pod is in CrashLoopBackOff. Walk me through your debugging sequence."
              company="Google"
              difficulty="MEDIUM"
            >
              <p>
                <b>60-second answer:</b> “I first confirm scope with{" "}
                <code>kubectl get pods</code> and look at restarts. Then I use{" "}
                <code>kubectl describe pod</code> for current and last state,
                exit code, probes, and Events. Because the container has already
                restarted, I run <code>kubectl logs pod-name --previous</code>.
                I correlate that evidence with the pod spec and recent rollout,
                fix the smallest proven cause, then watch{" "}
                <code>kubectl rollout status</code> and verify readiness and
                service health.”
              </p>
              <p>
                <b>The trap:</b> Treating CrashLoopBackOff as a root cause
                instead of a back-off state.
              </p>
            </Interview>
            <Interview
              q="Why can current logs be empty while the pod is still failing?"
              company="Amazon"
              difficulty="EASY"
            >
              <p>
                The current container may have just restarted and not emitted
                anything. <code>--previous</code> targets the logs from the last
                terminated instance, which often contain the actual fatal error.
              </p>
            </Interview>
            <Interview
              q="When would you inspect exit code 137 differently from exit code 1?"
              company="Microsoft"
              difficulty="HARD"
            >
              <p>
                137 means 128 + SIGKILL (9), commonly OOM termination or a
                forced kill. I check <code>lastState.terminated.reason</code>,
                memory limits and node pressure. Exit 1 is application-defined
                and sends me first to application logs and configuration.
              </p>
            </Interview>
          </div>
        </section>
      </article>
    </div>
  );
}
function Command({
  cmd,
  output,
  why,
}: {
  cmd: string;
  output: string;
  why: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="command">
      <div className="cmd-top">
        <code>$ {cmd}</code>
        <button
          onClick={() => {
            navigator.clipboard.writeText(cmd);
            setCopied(true);
            setTimeout(() => setCopied(false), 1000);
          }}
        >
          {copied ? <Check size={14} /> : "Copy"}
        </button>
      </div>
      <pre>{output}</pre>
      <div className="why">
        <b>WHY THIS</b>
        <span>{why}</span>
      </div>
    </div>
  );
}
function Interview({
  q,
  company,
  difficulty,
  children,
}: {
  q: string;
  company: string;
  difficulty: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="interview">
      <button onClick={() => setOpen(!open)}>
        <div>
          <span className={"badge " + difficulty.toLowerCase()}>
            {difficulty}
          </span>
          <span className="company">{company}</span>
          <h3>{q}</h3>
        </div>
        <ChevronRight className={open ? "turn" : ""} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
function Architecture() {
  const groups = [
    [
      "Learn",
      [
        "Skill tree",
        "64 technology tracks",
        "Lesson player",
        "Interactive sandboxes",
        "Command library",
      ],
    ],
    [
      "Practice",
      [
        "Interview question bank",
        "Daily quest",
        "Weekly boss fight",
        "Mock interview mode",
      ],
    ],
    [
      "Progress",
      [
        "XP & role levels",
        "Streaks & freezes",
        "Badges",
        "Readiness score",
        "Public profile",
      ],
    ],
    [
      "Community",
      ["Weekly leaderboard", "Friends", "Team cohorts", "Contributor studio"],
    ],
  ];
  return (
    <div className="doc-page">
      <span className="kicker">DELIVERABLE 01</span>
      <h1>Information architecture</h1>
      <p className="lede">
        A unified loop: discover a skill, resolve a production incident, prove
        it in a sandbox, and translate the work into an interview answer.
      </p>
      <div className="ia-flow">
        <div>
          <Search />
          DISCOVER
        </div>
        <ArrowRight />
        <div>
          <BookOpen />
          LEARN
        </div>
        <ArrowRight />
        <div>
          <TerminalSquare />
          PROVE
        </div>
        <ArrowRight />
        <div>
          <Award />
          ADVANCE
        </div>
      </div>
      <div className="sitemap">
        {groups.map(([title, items]) => (
          <section key={title as string}>
            <h3>{title}</h3>
            {(items as string[]).map((x, i) => (
              <div key={x}>
                <span>0{i + 1}</span>
                {x}
              </div>
            ))}
          </section>
        ))}
      </div>
      <section className="arch">
        <span className="kicker">MVP SYSTEM BOUNDARY</span>
        <h2>Built for real sandboxes later</h2>
        <div className="arch-grid">
          <div>
            React client<small>Lessons · diagrams · terminal adapter</small>
          </div>
          <ArrowRight />
          <div>
            Sandbox interface<small>command → output → validation state</small>
          </div>
          <ArrowRight />
          <div>
            Deterministic MVP engine<small>swap for gVisor / Firecracker</small>
          </div>
        </div>
      </section>
    </div>
  );
}
function DesignSystem() {
  return (
    <div className="doc-page">
      <span className="kicker">DELIVERABLE 02</span>
      <h1>Design system</h1>
      <p className="lede">
        A calm operations console: dense enough for engineers, generous enough
        for learning, with color reserved for state and consequence.
      </p>
      <div className="design-grid">
        <section>
          <h3>Color tokens</h3>
          <div className="swatches">
            {[
              ["Void", "#08090D"],
              ["Surface", "#111218"],
              ["Primary", "#8B5CF6"],
              ["Signal", "#22D3EE"],
              ["Success", "#34D399"],
              ["Warning", "#FBBF24"],
              ["Danger", "#FB7185"],
            ].map((x) => (
              <div>
                <i style={{ background: x[1] }} />
                <b>{x[0]}</b>
                <code>{x[1]}</code>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h3>Difficulty & state</h3>
          <div className="badge-row">
            <span className="badge easy">EASY</span>
            <span className="badge medium">MEDIUM</span>
            <span className="badge hard">HARD</span>
          </div>
          <div className="component-card">
            <span className="kicker">COMPONENT ANATOMY</span>
            <h3>Incident card</h3>
            <p>
              Scenario-first title, visible difficulty, expected time, XP
              reward, and one decisive action.
            </p>
            <button className="primary">
              Start incident <ArrowRight />
            </button>
          </div>
        </section>
        <section>
          <h3>Typography</h3>
          <div className="type-demo">
            <h1>Debug production.</h1>
            <h2>See the system.</h2>
            <p>
              Readable explanations stay neutral. Commands use a crisp monospace
              face and preserve exact output.
            </p>
            <code>kubectl logs pod --previous</code>
          </div>
        </section>
        <section>
          <h3>Motion principles</h3>
          <ul>
            <li>
              <b>Explain</b> — motion reveals system cause and effect.
            </li>
            <li>
              <b>Orient</b> — shared transitions preserve place.
            </li>
            <li>
              <b>Reward</b> — celebration follows validated work.
            </li>
            <li>
              <b>Respect</b> — reduced-motion preferences win.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
function SearchPalette({
  close,
  go,
}: {
  close: () => void;
  go: (p: Page) => void;
}) {
  const [q, setQ] = useState("");
  const items = useMemo(
    () =>
      [
        ["Debug a CrashLoopBackOff", "Kubernetes lesson", "lesson"],
        ["Kubernetes skill tree", "Track", "home"],
        ["Information architecture", "Document", "architecture"],
        ["Design system", "Document", "design"],
        ["kubectl logs --previous", "Command", "lesson"],
      ].filter((x) => x[0].toLowerCase().includes(q.toLowerCase())),
    [q],
  );
  return (
    <div className="modal" onMouseDown={close}>
      <motion.div
        className="palette"
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="palette-input">
          <Search />
          <input
            autoFocus
            placeholder="Search skills, incidents, commands…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button onClick={close}>
            <X />
          </button>
        </div>
        <div className="results">
          {items.map((x) => (
            <button
              key={x[0]}
              onClick={() => {
                go(x[2] as Page);
                close();
              }}
            >
              <span>
                <b>{x[0]}</b>
                <small>{x[1]}</small>
              </span>
              <ArrowRight />
            </button>
          ))}
        </div>
        <footer>
          <span>↑↓ Navigate</span>
          <span>↵ Open</span>
          <span>esc Close</span>
        </footer>
      </motion.div>
    </div>
  );
}
function Footer({ go }: { go: (p: Page) => void }) {
  return (
    <footer className="site-footer">
      <div className="brand">
        <span className="brandmark">
          <TerminalSquare />
        </span>
        OpsQuest
      </div>
      <p>Learn production by fixing it.</p>
      <div>
        <button onClick={() => go("architecture")}>Sitemap</button>
        <button onClick={() => go("design")}>Design system</button>
      </div>
    </footer>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
