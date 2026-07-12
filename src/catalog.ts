export type Category =
  | "DevOps / Infrastructure"
  | "Data Engineering"
  | "Analytics / BI"
  | "Testing / QA";
export type Tier = "Beginner" | "Intermediate" | "Advanced" | "Interview-Ready";
export type Track = {
  slug: string;
  name: string;
  category: Category;
  icon: string;
  color: string;
  scenario: string;
  command: string;
  output: string;
  fix: string;
  validator: string;
  concept: [string, string, string, string];
  interview: string;
};
export type LessonSpec = {
  id: number;
  slug: string;
  title: string;
  tier: Tier;
  minutes: number;
  kind: "lesson" | "playground" | "quiz" | "challenge";
  objective: string;
  summary: string;
  hook: string;
  deepDive: string[];
  walkthrough: {
    label: string;
    command: string;
    output: string;
    why: string;
  }[];
  challenge: string;
  successCriteria: string[];
  interviewQuestion: string;
  interviewTrap: string;
  diagramNarration: [string, string, string, string];
  assessment: {
    question: string;
    options: [string, string, string];
    correct: number;
    explanation: string;
  };
  decisionTable: {
    signal: string;
    interpretation: string;
    nextAction: string;
    command: string;
  }[];
  commonMistakes: {
    mistake: string;
    consequence: string;
    safer: string;
  }[];
};
const row = (
  name: string,
  category: Category,
  icon: string,
  color: string,
  scenario: string,
  command: string,
  output: string,
  fix: string,
  validator: string,
  concept: [string, string, string, string],
  interview: string,
): Track => ({
  slug: name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, ""),
  name,
  category,
  icon,
  color,
  scenario,
  command,
  output,
  fix,
  validator,
  concept,
  interview,
});
const infra: Track[] = [
  row(
    "Linux",
    "DevOps / Infrastructure",
    ">_",
    "#60a5fa",
    "A production host is full and writes are failing although df still shows free space.",
    "df -i /var && sudo find /var/log -xdev -type f -printf '%h\\n' | sort | uniq -c | sort -nr | head",
    "Filesystem Inodes IUsed IFree IUse% Mounted on\n/dev/nvme0n1p1 655360 655360 0 100% /",
    "sudo find /var/log/app -type f -name '*.tmp' -delete",
    "df -i /var | grep -qv '100%'",
    ["Syscall", "VFS lookup", "Inode table", "Filesystem"],
    "I distinguish block exhaustion from inode exhaustion with df -h and df -i, identify the high-cardinality directory without crossing filesystems, remove only validated disposable files, and verify application writes recover.",
  ),
  row(
    "Git",
    "DevOps / Infrastructure",
    "⑂",
    "#f97316",
    "A teammate force-pushed main and your known-good deployment commit appears lost.",
    "git reflog --date=iso --all | head",
    "9f2a881 HEAD@{2026-07-12 08:30:12 +0530}: commit: release: known-good checkout",
    "git branch recovery/known-good 9f2a881",
    "git show-ref --verify refs/heads/recovery/known-good",
    ["Reflog", "Object ID", "Recovery branch", "Safe merge"],
    "Reflog records local reference movement. I create a recovery branch at the known-good object before changing anything, inspect the diff, and restore through a reviewed merge rather than rewriting history again.",
  ),
  row(
    "Docker",
    "DevOps / Infrastructure",
    "▣",
    "#38bdf8",
    "A service image is 812 MB, slow to pull, and contains the compiler toolchain.",
    "docker history --no-trunc payments:latest",
    "IMAGE CREATED BY SIZE\nsha256:a1 RUN npm ci 612MB\nsha256:b2 COPY . . 148MB",
    "docker build --target runtime -t payments:slim .",
    "docker image inspect payments:slim --format '{{.Size}}' | awk '$1 < 200000000'",
    ["Build context", "Builder stage", "Runtime copy", "Slim image"],
    "I use a pinned multi-stage build, cache dependency layers, copy only runtime artifacts into a non-root final image, then compare image size and scan the exact digest.",
  ),
  row(
    "Kubernetes",
    "DevOps / Infrastructure",
    "⎈",
    "#a78bfa",
    "Checkout requests fail because a payments pod repeatedly exits and enters CrashLoopBackOff.",
    "kubectl logs payments-7c --previous",
    "FATAL: dial tcp: lookup postgres-db: no such host",
    "kubectl set env deployment/payments DB_HOST=postgres",
    "kubectl rollout status deployment/payments",
    ["Pod starts", "Process exits", "Back-off", "Healthy rollout"],
    "CrashLoopBackOff is a back-off state, not the cause. I inspect last state and Events, read previous-container logs, fix the evidenced configuration error, then verify rollout and readiness.",
  ),
  row(
    "Helm",
    "DevOps / Infrastructure",
    "♜",
    "#818cf8",
    "A production upgrade renders a Service with the wrong port after values drifted.",
    "helm diff upgrade payments ./chart -f values-prod.yaml",
    "- targetPort: 8080\n+ targetPort: 3000",
    "helm upgrade payments ./chart -f values-prod.yaml --atomic --timeout 5m",
    "helm status payments -o json | grep -q 'deployed'",
    ["Values merge", "Template render", "Atomic upgrade", "Revision healthy"],
    "I render and diff with the exact production values, use schema validation, deploy atomically with a timeout, and keep rollback history rather than editing live resources.",
  ),
  row(
    "Ansible",
    "DevOps / Infrastructure",
    "A",
    "#ef4444",
    "Half the web fleet has an unsafe nginx setting after a manual hotfix.",
    "ansible web -m ansible.builtin.command -a 'nginx -T' --check",
    "web-02 | CHANGED | rc=0 >> worker_processes 1;",
    "ansible-playbook -i inventory/prod site.yml --limit web --diff",
    "ansible-playbook site.yml --check | grep -q 'changed=0'",
    ["Inventory", "Idempotent task", "Handler notify", "Fleet converged"],
    "I encode the desired state in an idempotent role, preview with check and diff, roll through a bounded batch, validate nginx before reload, and prove a second run changes nothing.",
  ),
  row(
    "Terraform",
    "DevOps / Infrastructure",
    "T",
    "#a78bfa",
    "A security-group rule was changed manually and production has configuration drift.",
    "terraform plan -refresh-only -out=drift.tfplan",
    "~ aws_security_group.api ingress 0.0.0.0/0 -> 10.0.0.0/8",
    "terraform apply drift.tfplan",
    "terraform plan -detailed-exitcode | grep -q 'No changes'",
    ["Read state", "Refresh remote", "Plan delta", "Apply reviewed state"],
    "I refresh and inspect drift, determine whether code or remote state is authoritative, change configuration through review, apply a saved plan, and confirm a zero-diff plan.",
  ),
  row(
    "Jenkins",
    "DevOps / Infrastructure",
    "J",
    "#ef4444",
    "Parallel builds overwrite the same artifact and deploy inconsistent binaries.",
    'curl -fsS "$JENKINS_URL/job/api/lastBuild/api/json?tree=artifacts[*]"',
    '{"artifacts":[{"fileName":"api-184.tgz"}]}',
    "stash name: 'api-binary', includes: 'dist/api.tgz', useDefaultExcludes: false",
    "test -f dist/api.tgz",
    ["Checkout", "Isolated build", "Stash artifact", "Deploy digest"],
    "I isolate workspaces, create immutable versioned artifacts once, pass them explicitly between stages, use concurrency controls, and deploy the same checksum that passed tests.",
  ),
  row(
    "GitHub Actions",
    "DevOps / Infrastructure",
    "GH",
    "#f8fafc",
    "Only one Node version passes while the matrix job hides which combination failed.",
    "gh run view --log-failed",
    "test (ubuntu-latest, 22) failed: snapshot mismatch",
    "gh workflow run ci.yml -f debug=true",
    "gh run list --workflow ci.yml --limit 1 --json conclusion --jq '.[0].conclusion' | grep -q success",
    ["Event filter", "Matrix expand", "Artifact handoff", "Required check"],
    "I use a named matrix with fail-fast chosen deliberately, pin actions by SHA, keep artifacts immutable across jobs, restrict permissions, and make the aggregate result a required check.",
  ),
  row(
    "GitLab CI",
    "DevOps / Infrastructure",
    "GL",
    "#fb923c",
    "A deploy job runs on feature branches because rules overlap.",
    "glab ci lint .gitlab-ci.yml",
    "Valid configuration",
    "glab pipeline run --branch main",
    "glab pipeline list --per-page 1 | grep -q success",
    ["Pipeline source", "Rules evaluate", "Needs DAG", "Protected deploy"],
    "I use mutually exclusive rules based on pipeline source and protected refs, model dependencies with needs, pass immutable artifacts, and bind production to a protected environment.",
  ),
  row(
    "Argo CD",
    "DevOps / Infrastructure",
    "↻",
    "#fb923c",
    "The application is OutOfSync because a controller mutates a defaulted field.",
    "argocd app diff payments",
    "apps/Deployment payments: /spec/replicas 3 -> 5",
    "argocd app sync payments --prune",
    "argocd app wait payments --health --sync --timeout 300",
    ["Git desired state", "Diff", "Reconcile", "Healthy sync"],
    "I identify whether drift is intentional or controller-owned, encode the desired state or a narrow ignore rule in Git, sync with prune deliberately, and wait for both health and sync.",
  ),
  row(
    "OKD (OpenShift)",
    "DevOps / Infrastructure",
    "O",
    "#ef4444",
    "A workload cannot start because the image assumes root under the restricted SCC.",
    "oc describe pod api-7d9 | tail -20",
    "Error: container has runAsNonRoot and image will run as root",
    "oc set security-context-constraints restricted-v2 deployment/api",
    "oc rollout status deployment/api",
    ["Admission", "SCC policy", "Arbitrary UID", "Ready pod"],
    "I adapt the image for arbitrary non-root UIDs and writable group-owned paths instead of granting anyuid, confirm SCC admission, and verify rollout under restricted-v2.",
  ),
  row(
    "Nginx",
    "DevOps / Infrastructure",
    "N",
    "#22c55e",
    "API latency spikes because every upstream connection is reopened.",
    "nginx -T | grep -A5 upstream",
    "upstream api { server 10.0.2.10:8080; }",
    "sudo nginx -t && sudo systemctl reload nginx",
    "curl -fsS http://localhost/healthz | grep -q ok",
    ["Client request", "Location match", "Upstream keepalive", "Response"],
    "I inspect active configuration, connection reuse, timeouts and upstream timing, validate syntax, reload without dropping connections, and compare latency and error-rate metrics.",
  ),
  row(
    "HAProxy",
    "DevOps / Infrastructure",
    "HA",
    "#f472b6",
    "A backend is healthy over curl but marked DOWN by the load balancer.",
    "echo 'show stat' | socat stdio /run/haproxy/admin.sock",
    "api,api-1,0,0,0,1,DOWN,L7STS,503",
    "sudo haproxy -c -f /etc/haproxy/haproxy.cfg && sudo systemctl reload haproxy",
    "echo 'show stat' | socat stdio /run/haproxy/admin.sock | grep -q ',UP,'",
    ["Frontend", "ACL route", "Health check", "Backend pool"],
    "I compare the configured health check method, path, Host header and expected status with the application, validate config, perform a seamless reload, and confirm state through the runtime API.",
  ),
  row(
    "Envoy",
    "DevOps / Infrastructure",
    "E",
    "#a78bfa",
    "Requests intermittently return 503 UF because the upstream cluster endpoints are wrong.",
    "curl -fsS localhost:9901/clusters | grep api::",
    "api::10.0.3.7:8080::cx_connect_fail::42",
    "curl -X POST localhost:9901/healthcheck/fail",
    "curl -fsS localhost:9901/server_info | grep -q LIVE",
    ["Listener", "Route", "Cluster", "Endpoint health"],
    "I use admin stats to distinguish no healthy upstream from connection failure, verify discovery state and protocol settings, drain bad endpoints, and confirm cluster success counters recover.",
  ),
  row(
    "Kong",
    "DevOps / Infrastructure",
    "K",
    "#f97316",
    "A public API bypasses rate limiting on one route.",
    "deck diff kong.yaml",
    "+ plugin: rate-limiting route: payments minute: 100",
    "deck sync kong.yaml",
    "deck diff kong.yaml | grep -q 'No configuration changes'",
    ["Route match", "Plugin chain", "Rate counter", "Upstream"],
    "I manage declarative gateway state, scope plugins explicitly to service or route, diff before sync, test identity-aware limits, and monitor rejected versus upstream requests.",
  ),
  row(
    "Istio",
    "DevOps / Infrastructure",
    "I",
    "#60a5fa",
    "A canary gets no traffic because the subset label does not match any pods.",
    "istioctl analyze -n payments",
    "Warning IST0101 DestinationRule subset canary has no matching workload",
    "kubectl label deployment/payments-canary version=canary --overwrite",
    "istioctl analyze -n payments | grep -qv Warning",
    ["VirtualService", "Subset select", "Envoy route", "Canary pod"],
    "I validate config, check Gateway and VirtualService hosts, confirm DestinationRule subset labels match workloads, inspect proxy routes, and measure traffic distribution before promotion.",
  ),
  row(
    "F5",
    "DevOps / Infrastructure",
    "F5",
    "#ef4444",
    "A pool member is marked down because the monitor sends the wrong Host header.",
    "tmsh show ltm pool api-pool members",
    "api-pool 10.0.4.10:443 down /Common/https",
    "tmsh modify ltm monitor https api-monitor send 'GET /health HTTP/1.1\\r\\nHost: api.internal\\r\\nConnection: close\\r\\n\\r\\n'",
    "tmsh show ltm pool api-pool members | grep -q up",
    ["Virtual server", "Profile chain", "Health monitor", "Pool member"],
    "I inspect monitor send and receive strings, TLS SNI and pool state, change configuration transactionally, verify member health, then test through the virtual server.",
  ),
  row(
    "cert-manager",
    "DevOps / Infrastructure",
    "🔒",
    "#34d399",
    "A certificate remains Pending after an HTTP-01 challenge cannot reach the solver.",
    "cmctl status certificate api-tls",
    "Ready: False; Reason: FailedHTTP01Challenge",
    "kubectl annotate certificate api-tls cert-manager.io/issue-temporary-certificate=true --overwrite",
    "cmctl status certificate api-tls | grep -q 'Ready: True'",
    ["Certificate", "CertificateRequest", "Order", "Challenge solved"],
    "I follow Certificate to Request, Order and Challenge, verify ingress reachability and issuer account state, fix the routing cause, and confirm a Ready certificate with a valid chain.",
  ),
  row(
    "external-dns",
    "DevOps / Infrastructure",
    "DNS",
    "#38bdf8",
    "A renamed ingress leaves a stale DNS record pointing at the old load balancer.",
    "kubectl logs deploy/external-dns | grep api.example.com",
    "Skipping delete for api.example.com: ownership TXT mismatch",
    "kubectl annotate ingress api external-dns.alpha.kubernetes.io/hostname=api.example.com --overwrite",
    "dig +short api.example.com | grep -q '203.0.113.10'",
    ["Kubernetes source", "Desired endpoint", "TXT ownership", "DNS provider"],
    "I verify source annotations, domain filters, registry ownership and policy, avoid unsafe shared-zone deletion, reconcile the record, and check authoritative DNS rather than a cached resolver.",
  ),
  row(
    "Keycloak",
    "DevOps / Infrastructure",
    "KC",
    "#ef4444",
    "Users receive invalid_redirect_uri after an application hostname change.",
    "kcadm.sh get clients -r prod -q clientId=portal",
    "redirectUris: [https://old.example.com/*]",
    "kcadm.sh update clients/portal-id -r prod -s 'redirectUris=[\"https://portal.example.com/*\"]'",
    "curl -fsS https://sso.example.com/realms/prod/.well-known/openid-configuration | grep -q issuer",
    ["Auth request", "Realm", "Client validation", "Token issue"],
    "I validate issuer, client ID, exact redirect URI and proxy hostname settings, change the narrow client configuration, and verify the OIDC discovery and authorization-code flow.",
  ),
  row(
    "Vault",
    "DevOps / Infrastructure",
    "V",
    "#fbbf24",
    "A service loses database access when its dynamic credential lease expires.",
    "vault lease lookup database/creds/payments/abc",
    "ttl 0s\nrenewable true",
    "vault lease renew database/creds/payments/abc",
    "vault lease lookup database/creds/payments/abc | grep -q 'ttl'",
    ["Authenticate", "Policy check", "Dynamic secret", "Lease renew"],
    "I inspect token and secret lease TTLs separately, verify renewal permissions, renew or rotate through the agent, and avoid copying a new static secret into deployment configuration.",
  ),
  row(
    "Trivy",
    "DevOps / Infrastructure",
    "TV",
    "#60a5fa",
    "A release is blocked by a critical OpenSSL finding in the base image.",
    "trivy image --severity CRITICAL --ignore-unfixed payments:1.4.2",
    "openssl CVE-2026-1234 CRITICAL Fixed 3.0.15-r2",
    "docker build --pull -t payments:1.4.3 .",
    "trivy image --exit-code 1 --severity CRITICAL --ignore-unfixed payments:1.4.3",
    ["Resolve digest", "Scan layers", "Remediate base", "Gate artifact"],
    "I scan the immutable digest with an updated database, confirm exploitability and a fixed version, rebuild from a patched pinned base, produce an SBOM, and gate the exact release artifact.",
  ),
  row(
    "WireGuard",
    "DevOps / Infrastructure",
    "WG",
    "#22c55e",
    "A peer handshakes successfully but cannot reach the private subnet.",
    "sudo wg show wg0",
    "latest handshake: 12 seconds ago\ntransfer: 1.2 KiB received, 3.4 KiB sent",
    "sudo ip route add 10.20.0.0/16 dev wg0",
    "ip route get 10.20.0.10 | grep -q wg0",
    ["Peer key", "Encrypted tunnel", "AllowedIPs route", "Private service"],
    "A handshake proves key exchange, not routing. I inspect AllowedIPs, routes, forwarding, MTU and firewall state on both ends, add the narrow route, and test bidirectionally.",
  ),
  row(
    "Prometheus",
    "DevOps / Infrastructure",
    "P",
    "#f97316",
    "Alerts report missing targets after a Service label was changed.",
    "promtool check config /etc/prometheus/prometheus.yml",
    "SUCCESS: /etc/prometheus/prometheus.yml is valid",
    "kubectl label service api app.kubernetes.io/name=api --overwrite",
    "curl -fsS localhost:9090/api/v1/targets | grep -q 'health.*up'",
    ["Service discovery", "Relabel", "Scrape", "Time series"],
    "I separate discovery failure from scrape failure, inspect dropped targets and relabeling, validate config and query freshness, then verify the target is up and samples advance.",
  ),
  row(
    "Grafana",
    "DevOps / Infrastructure",
    "G",
    "#f59e0b",
    "A latency dashboard is misleading because it averages histogram buckets.",
    `curl -fsS -H 'Authorization: Bearer $GRAFANA_TOKEN' "$GRAFANA_URL/api/dashboards/uid/api-latency"`,
    "dashboard uid api-latency version 18",
    "git apply fix-histogram-quantile.patch",
    `curl -fsS "$PROM_URL/api/v1/query?query=histogram_quantile(0.95,...)" | grep -q success`,
    ["Datasource", "PromQL query", "Panel transform", "Actionable view"],
    "I use histogram_quantile over rate of cumulative buckets grouped by le, preserve units and interval variables, validate against raw queries, and provision dashboards from version control.",
  ),
  row(
    "OpenTelemetry",
    "DevOps / Infrastructure",
    "OT",
    "#a78bfa",
    "Traces stop at the API and never connect to the database span.",
    "curl -fsS localhost:13133/",
    "Server available",
    "otelcol --config /etc/otel/config.yaml --dry-run",
    "curl -fsS localhost:8888/metrics | grep -q 'otelcol_exporter_sent_spans'",
    ["SDK context", "OTLP receive", "Processor", "Backend export"],
    "I verify context propagation, resource attributes, collector health and exporter failures, validate the pipeline, and correlate traces with metrics and logs using consistent service identity.",
  ),
  row(
    "AWS",
    "DevOps / Infrastructure",
    "AWS",
    "#f59e0b",
    "A Lambda function cannot read one DynamoDB table after a least-privilege change.",
    "aws iam simulate-principal-policy --policy-source-arn arn:aws:iam::123456789012:role/api --action-names dynamodb:GetItem --resource-arns arn:aws:dynamodb:ap-south-1:123456789012:table/orders",
    "EvalDecision: implicitDeny",
    "aws iam put-role-policy --role-name api --policy-name orders-read --policy-document file://orders-read.json",
    "aws iam simulate-principal-policy --policy-source-arn arn:aws:iam::123456789012:role/api --action-names dynamodb:GetItem --resource-arns arn:aws:dynamodb:ap-south-1:123456789012:table/orders | grep -q allowed",
    ["Identity", "Policy evaluation", "STS credentials", "DynamoDB"],
    "I reproduce with the caller identity, evaluate identity and resource policies plus boundaries and SCPs, grant only GetItem on the exact table, and verify through simulation and CloudTrail.",
  ),
  row(
    "Azure",
    "DevOps / Infrastructure",
    "AZ",
    "#38bdf8",
    "An application using managed identity receives 403 from a storage container.",
    "az role assignment list --assignee $PRINCIPAL_ID --scope $STORAGE_ID -o table",
    "No assignments found",
    "az role assignment create --assignee-object-id $PRINCIPAL_ID --role 'Storage Blob Data Reader' --scope $CONTAINER_ID",
    "az role assignment list --assignee $PRINCIPAL_ID --scope $CONTAINER_ID --query '[?roleDefinitionName==`Storage Blob Data Reader`]' -o tsv | grep -q Reader",
    ["Managed identity", "ARM token", "Data-plane RBAC", "Blob read"],
    "I distinguish control-plane from data-plane roles, confirm the managed identity object and token audience, assign the narrow container scope, allow propagation, and test with that identity.",
  ),
  row(
    "Google Cloud",
    "DevOps / Infrastructure",
    "GCP",
    "#4285f4",
    "A Cloud Run service cannot publish to one Pub/Sub topic.",
    "gcloud policy-intelligence troubleshoot-policy iam //pubsub.googleapis.com/projects/acme/topics/orders --principal-email=api@acme.iam.gserviceaccount.com --permission=pubsub.topics.publish",
    "Access state: DENIED",
    "gcloud pubsub topics add-iam-policy-binding orders --member=serviceAccount:api@acme.iam.gserviceaccount.com --role=roles/pubsub.publisher",
    "gcloud pubsub topics get-iam-policy orders --flatten=bindings | grep -q api@acme",
    ["Service account", "IAM policy", "Access token", "Pub/Sub"],
    "I confirm the runtime service account, troubleshoot the exact permission across IAM and organization policies, add publisher only on the topic, and validate through audit logs.",
  ),
  row(
    "Cloudflare",
    "DevOps / Infrastructure",
    "CF",
    "#f97316",
    "Legitimate API clients are blocked after a broad WAF rule was deployed.",
    "curl -fsS -H 'Authorization: Bearer $CF_TOKEN' https://api.cloudflare.com/client/v4/zones/$ZONE/rulesets",
    "action: block expression: http.request.uri.path contains /api",
    "curl -X PUT -H 'Authorization: Bearer $CF_TOKEN' --data @ruleset.json https://api.cloudflare.com/client/v4/zones/$ZONE/rulesets/$RULESET",
    "curl -fsS https://api.example.com/health | grep -q ok",
    ["Edge request", "WAF expression", "Origin route", "Cached response"],
    "I inspect the matched rule and event fields, narrow the expression with method, path and identity context, deploy through versioned rulesets, and test both allowed and malicious cases.",
  ),
];
const data: Track[] = [
  row(
    "Airflow",
    "Data Engineering",
    "AF",
    "#38bdf8",
    "A daily DAG is late because one task waits forever for an unavailable pool slot.",
    "airflow tasks states-for-dag-run etl_daily scheduled__2026-07-12T00:00:00+00:00",
    "load waiting pool=warehouse slots=0",
    "airflow pools set warehouse 8 'Warehouse concurrency'",
    "airflow pools get warehouse | grep -q '8'",
    ["Scheduler", "Executor queue", "Pool slot", "Task success"],
    "I inspect task state, dependencies, pool and executor capacity, fix the constrained resource rather than clearing blindly, and verify the next scheduled run meets its data interval.",
  ),
  row(
    "Spark",
    "Data Engineering",
    "SP",
    "#f97316",
    "One shuffle stage runs 20x longer because a hot customer key creates a skewed partition.",
    "spark-submit --conf spark.eventLog.enabled=true jobs/orders.py",
    "Stage 8: median 22s, max task 441s, shuffle read 18.2 GiB",
    "spark-submit --conf spark.sql.adaptive.enabled=true --conf spark.sql.adaptive.skewJoin.enabled=true jobs/orders.py",
    "test -f output/_SUCCESS",
    ["Partitions", "Shuffle", "Adaptive split", "Balanced join"],
    "I confirm skew from task and shuffle distributions, use AQE skew handling or targeted salting, avoid indiscriminate repartitioning, and compare correctness plus tail-task duration.",
  ),
  row(
    "Kafka",
    "Data Engineering",
    "K",
    "#f97316",
    "Consumer lag spikes on one partition while the rest remain current.",
    "kafka-consumer-groups.sh --bootstrap-server kafka:9092 --describe --group payments",
    "payments orders 7 12840 91840 79000 consumer-2",
    "kafka-configs.sh --bootstrap-server kafka:9092 --alter --entity-type topics --entity-name orders --add-config min.insync.replicas=2",
    "kafka-consumer-groups.sh --bootstrap-server kafka:9092 --describe --group payments | awk '$6 > 1000 {exit 1}'",
    ["Producer key", "Partition log", "Consumer group", "Offset commit"],
    "I isolate partition-level lag, compare production rate and consumer processing time, inspect rebalances and hot keys, scale only up to partition count, and protect delivery semantics during recovery.",
  ),
  row(
    "Flink",
    "Data Engineering",
    "FL",
    "#ec4899",
    "A restarted streaming job emits duplicates after checkpoints silently fail.",
    "flink list -r",
    "orders-enricher RUNNING checkpoint failures=12",
    "flink savepoint $JOB_ID s3://state/savepoints",
    "flink list -r | grep -q orders-enricher",
    [
      "Source offsets",
      "State operator",
      "Checkpoint barrier",
      "Transactional sink",
    ],
    "I inspect checkpoint alignment, state backend and sink guarantees, take a savepoint, fix durable checkpoint storage, and restore with stable operator UIDs to preserve exactly-once state.",
  ),
  row(
    "dbt",
    "Data Engineering",
    "dbt",
    "#f97316",
    "An incremental model misses updated orders because its watermark uses created_at.",
    "dbt build --select orders_incremental+",
    "FAIL unique_orders: 184 duplicate rows",
    "dbt build --full-refresh --select orders_incremental",
    "dbt test --select orders_incremental | grep -q PASS",
    ["Source", "Incremental filter", "Merge key", "Tested model"],
    "I validate the incremental predicate and unique key, use updated_at with a safe lookback, rebuild once after correction, and add freshness, uniqueness and reconciliation tests.",
  ),
  row(
    "Dagster",
    "Data Engineering",
    "DG",
    "#6366f1",
    "An asset is stale because its upstream partition mapping skips month boundaries.",
    "dagster asset list",
    "monthly_revenue stale upstream daily_orders",
    "dagster asset materialize -s monthly_revenue --partition 2026-07",
    "dagster asset list | grep -q 'monthly_revenue.*fresh'",
    ["Asset dependency", "Partition mapping", "Materialization", "Freshness"],
    "I reason from asset lineage and partitions, inspect event logs, correct the partition mapping, backfill only affected partitions, and verify freshness policies.",
  ),
  row(
    "Prefect",
    "Data Engineering",
    "PF",
    "#818cf8",
    "A flow retries a permanent schema error and floods the worker queue.",
    "prefect flow-run inspect $FLOW_RUN_ID",
    "State: AwaitingRetry; message: missing required column customer_id",
    "prefect deployment run etl/orders --param schema_version=2",
    "prefect flow-run inspect $FLOW_RUN_ID | grep -q Completed",
    ["Deployment", "Work pool", "Task retry policy", "Flow result"],
    "I classify transient versus permanent failures, retry only idempotent transient work with backoff, fail fast on schema validation, and verify worker and concurrency health.",
  ),
  row(
    "BigQuery",
    "Data Engineering",
    "BQ",
    "#4285f4",
    "A dashboard query scans 12 TB because partition pruning was lost.",
    "bq query --use_legacy_sql=false --dry_run 'SELECT * FROM `acme.events` WHERE DATE(ts)=CURRENT_DATE()'",
    "totalBytesProcessed: 12000000000000",
    "bq query --use_legacy_sql=false 'SELECT event_type,COUNT(*) FROM `acme.events` WHERE event_date=CURRENT_DATE() GROUP BY 1'",
    "bq query --use_legacy_sql=false --dry_run 'SELECT event_type,COUNT(*) FROM `acme.events` WHERE event_date=CURRENT_DATE() GROUP BY 1' | grep -q totalBytes",
    ["Partition filter", "Column pruning", "Slots", "Result"],
    "I dry-run to inspect bytes, filter directly on the partition column, select only needed fields, examine clustering and execution details, then set cost controls.",
  ),
  row(
    "Snowflake",
    "Data Engineering",
    "SF",
    "#38bdf8",
    "Credits spike because a warehouse never suspends after BI queries finish.",
    "snowsql -q 'SHOW WAREHOUSES LIKE '\''BI_WH'\'''",
    "BI_WH RUNNING AUTO_SUSPEND 0",
    "snowsql -q 'ALTER WAREHOUSE BI_WH SET AUTO_SUSPEND=60 AUTO_RESUME=TRUE'",
    "snowsql -q 'SHOW WAREHOUSES LIKE '\''BI_WH'\''' | grep -q 60",
    ["Query queue", "Warehouse cluster", "Result cache", "Auto suspend"],
    "I separate query cost from idle warehouse cost, inspect query history and load, enable a measured suspend interval, right-size clusters, and verify performance plus credits per workload.",
  ),
  row(
    "Databricks",
    "Data Engineering",
    "DB",
    "#ef4444",
    "A Delta merge creates duplicate business keys after concurrent retries.",
    "databricks jobs get-run $RUN_ID",
    "result_state: FAILED; error: concurrent append conflict",
    'databricks jobs run-now $JOB_ID --json \'{"job_parameters":{"mode":"dedupe"}}\'',
    "databricks jobs get-run $RUN_ID | grep -q SUCCESS",
    ["Bronze ingest", "Deduplicate", "Delta MERGE", "Commit log"],
    "I make the source idempotent, deduplicate on a deterministic key and event time, use Delta merge conditions, handle optimistic concurrency retries, and test table constraints.",
  ),
  row(
    "ClickHouse",
    "Data Engineering",
    "CH",
    "#fbbf24",
    "A time-series query reads every part because the filter misses the primary-key prefix.",
    "clickhouse-client -q 'EXPLAIN indexes=1 SELECT count() FROM events WHERE user_id=42'",
    "Parts: 812/812 Granules: 94012/94012",
    "clickhouse-client -q 'ALTER TABLE events ADD INDEX user_idx user_id TYPE bloom_filter GRANULARITY 4'",
    "clickhouse-client -q 'SELECT count() FROM events WHERE user_id=42'",
    ["Partition prune", "Sparse index", "Granule read", "Vector result"],
    "I inspect parts and granules read, align ORDER BY with dominant range filters, use skipping indexes only when selective, and measure compressed bytes and latency on realistic data.",
  ),
  row(
    "Elasticsearch",
    "Data Engineering",
    "ES",
    "#fbbf24",
    "Search latency rises after an index accumulates hundreds of tiny shards.",
    "curl -s localhost:9200/_cat/shards?v",
    "logs-2026.07 0 p STARTED 120mb node-1",
    "curl -X POST localhost:9200/logs-2026.07/_forcemerge?max_num_segments=1",
    "curl -s localhost:9200/_cluster/health | grep -q 'green'",
    ["Query coordinator", "Shard fan-out", "Segment search", "Merge result"],
    "I inspect shard size, fan-out, segment count and heap, correct future rollover and shard count, merge only read-only indices off-peak, and validate cluster health and p95 latency.",
  ),
  row(
    "PostgreSQL",
    "Data Engineering",
    "PG",
    "#60a5fa",
    "Checkout timeouts trace to a query waiting behind an idle transaction lock.",
    'psql -c "SELECT pid,wait_event_type,wait_event,query FROM pg_stat_activity WHERE wait_event IS NOT NULL"',
    "8421 | Lock | transactionid | UPDATE orders SET status='paid'",
    "psql -c 'SELECT pg_terminate_backend(8421)'",
    "psql -c 'SELECT count(*) FROM pg_stat_activity WHERE wait_event_type='\''Lock'\''' | grep -q 0",
    ["Client transaction", "Row lock", "Blocked query", "Commit"],
    "I map blockers to waiters, inspect transaction age and application ownership, cancel or terminate the proven blocker, then fix transaction boundaries and add lock-aware monitoring.",
  ),
  row(
    "MongoDB",
    "Data Engineering",
    "MG",
    "#22c55e",
    "A customer lookup performs a collection scan after a new filter was added.",
    'mongosh --quiet --eval \'db.customers.find({tenantId:42,email:"a@b.com"}).explain("executionStats")\'',
    "stage: COLLSCAN; totalDocsExamined: 920134",
    "mongosh --quiet --eval 'db.customers.createIndex({tenantId:1,email:1},{unique:true})'",
    "mongosh --quiet --eval 'db.customers.find({tenantId:42,email:\"a@b.com\"}).explain().queryPlanner.winningPlan.inputStage.stage' | grep -q IXSCAN",
    ["Query shape", "Compound index", "B-tree seek", "Document fetch"],
    "I use executionStats to compare examined and returned documents, build a compound index matching equality-sort-range order, check cardinality and write cost, and confirm IXSCAN.",
  ),
  row(
    "Redis",
    "Data Engineering",
    "R",
    "#ef4444",
    "Redis evicts session keys because an unbounded cache shares the same instance.",
    "redis-cli INFO memory | grep -E 'used_memory_human|maxmemory_human|evicted_keys'",
    "used_memory_human:3.98G\nmaxmemory_human:4.00G\nevicted_keys:82014",
    "redis-cli CONFIG SET maxmemory-policy volatile-lru",
    "redis-cli CONFIG GET maxmemory-policy | grep -q volatile-lru",
    ["Client key", "Memory allocator", "Eviction policy", "Durable session"],
    "I inspect memory, keyspace and eviction counters, separate durable sessions from disposable cache where possible, set TTLs and an appropriate policy, and watch hit rate and evictions.",
  ),
  row(
    "RabbitMQ",
    "Data Engineering",
    "RMQ",
    "#f97316",
    "A queue grows while consumers appear connected but never acknowledge messages.",
    "rabbitmqctl list_queues name messages_ready messages_unacknowledged consumers",
    "orders 12 84210 8",
    "rabbitmqctl set_policy delivery-limit '^orders$' '{\"delivery-limit\":5}' --apply-to quorum_queues",
    "rabbitmqctl list_queues name messages_unacknowledged | awk '$2 > 1000 {exit 1}'",
    ["Publisher", "Queue", "Prefetch window", "Ack / DLQ"],
    "I separate ready from unacknowledged messages, inspect consumer processing and prefetch, enforce bounded redelivery with a DLQ, and preserve at-least-once idempotency.",
  ),
];
const analytics: Track[] = [
  row(
    "Power BI",
    "Analytics / BI",
    "PBI",
    "#fbbf24",
    "An executive revenue card doubles totals after a many-to-many relationship change.",
    "pbi-tools extract report.pbix -extractFolder report-src",
    "Model extracted: 14 tables, 22 relationships",
    "pbi-tools compile report-src report-fixed.pbix",
    "test -f report-fixed.pbix",
    ["Fact table", "Relationship filter", "DAX context", "Visual total"],
    "I inspect model cardinality and filter direction before changing DAX, restore a star schema or bridge, test measures under multiple contexts, and reconcile totals to the source.",
  ),
  row(
    "Tableau",
    "Analytics / BI",
    "TBL",
    "#60a5fa",
    "A workbook takes 40 seconds because a quick filter issues high-cardinality queries.",
    "tableau document-api inspect sales.twb",
    "Filter customer_id: 2,104,882 domain values",
    "tabcmd publish sales.twbx --project Analytics --overwrite",
    "tabcmd get '/views/Sales/Overview.csv' -f overview.csv",
    ["Data source", "Extract filter", "VizQL query", "Rendered view"],
    "I use performance recording to isolate query versus rendering time, reduce high-cardinality quick filters, push selective filters to the source or extract, and validate workbook output.",
  ),
];
const testing: Track[] = [
  row(
    "Cypress",
    "Testing / QA",
    "CY",
    "#22c55e",
    "Checkout tests are flaky because they wait a fixed five seconds for a network request.",
    "npx cypress run --spec cypress/e2e/checkout.cy.ts",
    "checkout submits order (failed after 5000ms)",
    "npx cypress run --spec cypress/e2e/checkout.cy.ts --config retries=2",
    "npx cypress run --spec cypress/e2e/checkout.cy.ts | grep -q 'All specs passed'",
    ["User action", "Intercept alias", "App response", "Assertion"],
    "I remove arbitrary waits, intercept the observable request before the action, wait on its alias, assert user-visible state, and use retries only for infrastructure noise—not product races.",
  ),
  row(
    "Playwright",
    "Testing / QA",
    "PW",
    "#34d399",
    "A test passes locally but fails in CI because it targets a brittle CSS class.",
    "npx playwright test checkout --trace on",
    "1 failed: locator('.btn-7f3a') resolved to 0 elements",
    "npx playwright test checkout --project=chromium",
    "npx playwright test checkout --project=chromium | grep -q passed",
    [
      "Accessible locator",
      "Auto-wait",
      "Browser action",
      "Web-first assertion",
    ],
    "I use role and accessible-name locators, rely on auto-wait and web-first assertions, isolate test data, inspect the trace, and reproduce in the same browser and viewport as CI.",
  ),
  row(
    "Postman",
    "Testing / QA",
    "PM",
    "#f97316",
    "An API collection passes manually but CI misses authentication because tokens are stored locally.",
    "npx newman run api.postman_collection.json -e ci.postman_environment.json",
    "401 Unauthorized: missing bearer token",
    "npx newman run api.postman_collection.json -e ci.postman_environment.json --env-var token=$API_TOKEN",
    "npx newman run api.postman_collection.json -e ci.postman_environment.json --env-var token=$API_TOKEN | grep -q '0 failures'",
    ["Environment", "Pre-request auth", "HTTP exchange", "Test script"],
    "I keep secrets outside collections, make authentication explicit in CI, assert status, schema and important semantics, isolate state, and publish machine-readable Newman reports.",
  ),
  row(
    "Gatling",
    "Testing / QA",
    "GT",
    "#ec4899",
    "A load test reports great averages while p99 latency violates the SLO.",
    "./mvnw gatling:test -Dgatling.simulationClass=ApiSimulation",
    "p50 120ms p95 480ms p99 2400ms failed 0.8%",
    "./mvnw gatling:test -Dusers=200 -Dramp=120",
    "test -f target/gatling/index.html",
    [
      "Injection profile",
      "Virtual users",
      "Service saturation",
      "Percentile assertion",
    ],
    "I model realistic arrival rates and think time, assert percentiles and error rate instead of averages, separate generator bottlenecks, warm the system, and correlate results with resource metrics.",
  ),
];
export const tracks = [...infra, ...data, ...analytics, ...testing];
export const categories: Category[] = [
  "DevOps / Infrastructure",
  "Data Engineering",
  "Analytics / BI",
  "Testing / QA",
];
export const tiers: Tier[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Interview-Ready",
];
export const tierMeta: Record<
  Tier,
  { label: string; focus: string; xp: number }
> = {
  Beginner: {
    label: "Foundation incident",
    focus: "Run the essential diagnostic and read its real output.",
    xp: 80,
  },
  Intermediate: {
    label: "Production repair",
    focus:
      "Trace the failure, apply the smallest safe fix, and validate recovery.",
    xp: 140,
  },
  Advanced: {
    label: "Reliability hardening",
    focus: "Handle scale, security, rollback, and operational trade-offs.",
    xp: 220,
  },
  "Interview-Ready": {
    label: "Timed interview lab",
    focus: "Solve without hints, then explain reasoning and follow-ups aloud.",
    xp: 300,
  },
};

type LessonBlueprint = Pick<
  LessonSpec,
  "id" | "slug" | "title" | "minutes" | "kind" | "objective" | "summary"
>;

const lessonBlueprints: LessonBlueprint[] = [
  {
    id: 1,
    slug: "production-orientation",
    title: "Production orientation",
    minutes: 7,
    kind: "lesson",
    objective:
      "Identify the job this technology performs in a production system.",
    summary:
      "Start from a real service request and map the technology's responsibility, boundary, and first operational signal.",
  },
  {
    id: 2,
    slug: "architecture-and-control-flow",
    title: "Architecture and control flow",
    minutes: 8,
    kind: "lesson",
    objective: "Trace a request or event through the core components.",
    summary:
      "Use an interactive system diagram to connect inputs, control decisions, state, and observable outputs.",
  },
  {
    id: 3,
    slug: "first-working-operation",
    title: "First working operation",
    minutes: 8,
    kind: "playground",
    objective:
      "Run the essential command and interpret every field of its output.",
    summary:
      "Work in the embedded playground with a known-good environment before diagnosing a failure.",
  },
  {
    id: 4,
    slug: "observe-the-baseline",
    title: "Observe the baseline",
    minutes: 7,
    kind: "lesson",
    objective: "Collect evidence without changing production state.",
    summary:
      "Build a baseline from status, events, logs, metrics, and configuration so later changes are measurable.",
  },
  {
    id: 5,
    slug: "read-the-failure-signal",
    title: "Read the failure signal",
    minutes: 8,
    kind: "quiz",
    objective: "Distinguish symptoms, platform states, and root causes.",
    summary:
      "Classify realistic output and choose the next diagnostic with the smallest cost and blast radius.",
  },
  {
    id: 6,
    slug: "repair-the-incident",
    title: "Repair the incident",
    minutes: 10,
    kind: "challenge",
    objective: "Apply the smallest reversible repair supported by evidence.",
    summary:
      "Resolve the track's flagship production incident and pass automated state validation.",
  },
  {
    id: 7,
    slug: "prove-recovery",
    title: "Prove recovery",
    minutes: 7,
    kind: "playground",
    objective: "Validate system state and the user-visible outcome.",
    summary:
      "Run a technical validator, confirm health signals, and rule out a partial or cosmetic recovery.",
  },
  {
    id: 8,
    slug: "scale-and-performance",
    title: "Scale and performance",
    minutes: 9,
    kind: "lesson",
    objective: "Reason about capacity, bottlenecks, and safe scaling limits.",
    summary:
      "Follow the saturation path and choose a scaling response that preserves correctness and cost control.",
  },
  {
    id: 9,
    slug: "security-and-blast-radius",
    title: "Security and blast radius",
    minutes: 8,
    kind: "challenge",
    objective: "Apply least privilege and contain operational risk.",
    summary:
      "Harden the working solution without breaking its runtime contract or expanding permissions unnecessarily.",
  },
  {
    id: 10,
    slug: "automate-the-runbook",
    title: "Automate the runbook",
    minutes: 8,
    kind: "playground",
    objective:
      "Turn the manual recovery into a repeatable, reviewable workflow.",
    summary:
      "Encode diagnostics, guardrails, rollout, and validation so the same incident is faster and safer next time.",
  },
  {
    id: 11,
    slug: "boss-incident",
    title: "Boss incident: restore production",
    minutes: 10,
    kind: "challenge",
    objective: "Diagnose and recover under a timed multi-signal incident.",
    summary:
      "Combine architecture, evidence, repair, security, and validation in one no-hints production simulation.",
  },
  {
    id: 12,
    slug: "interview-ready",
    title: "Interview-ready explanation",
    minutes: 6,
    kind: "quiz",
    objective: "Explain the diagnosis and trade-offs in 60–90 seconds.",
    summary:
      "Practice the model answer, follow-up questions, common traps, and a final hands-on verification.",
  },
];

const lessonDepth = (track: Track, lesson: (typeof lessonBlueprints)[number]) => {
  const phases = [
    {
      hook: `You have just joined the on-call rotation. ${track.scenario} Before touching the system, your lead asks you to explain exactly where ${track.name} sits in the request path and which signal you would trust first.`,
      deepDive: [
        `${track.name} is not an isolated tool: it owns a boundary between ${track.concept[0]} and ${track.concept[1]}. Inputs cross that boundary, a control decision is made, and the resulting state becomes visible through ${track.concept[3]}.`,
        `A production-safe first response separates identity, scope, current state, and desired state. That prevents a correct command from being run against the wrong object or environment.`,
      ],
      challenge: `Draw the four-stage ${track.name} path, name the owner of each stage, and identify the first observable signal when the incident begins.`,
      question: `Where does ${track.name} sit in a production architecture, and what does it own?`,
      trap: "Listing features without defining the operational boundary or source of truth.",
    },
    {
      hook: `${track.scenario} A dashboard shows the final symptom, but the failing decision happened earlier. Trace the request through every ${track.name} control point before choosing a repair.`,
      deepDive: [
        `The control flow is ${track.concept.join(" → ")}. Each transition has a contract: accepted input, a decision, a state mutation, and an observable result.`,
        `When the final stage is unhealthy, work backward until observed state first diverges from that contract. That first divergence is usually more useful than the loudest downstream error.`,
      ],
      challenge: `Step through the diagram and state what evidence would prove or disprove each transition in the ${track.name} path.`,
      question: `Walk me through ${track.name}'s control flow during this failure.`,
      trap: "Jumping from the user-visible symptom directly to a guessed root cause.",
    },
    {
      hook: `A new engineer needs to operate ${track.name} safely without copying a runbook blindly. Run the baseline operation, read its output field by field, and explain why its scope is safe.`,
      deepDive: [
        `The diagnostic command is read-only in intent: it captures the state that existed before remediation. Preserve that output because it becomes the comparison point for recovery.`,
        `Treat every flag as part of the safety model. Scope and output selection determine whether the command answers this incident or creates distracting, ambiguous evidence.`,
      ],
      challenge: `Run the diagnostic exactly, identify the line that proves the failure, and record it before applying any change.`,
      question: `Which ${track.name} command gives you the highest-information first observation here?`,
      trap: "Reciting a command without interpreting the returned state.",
    },
    {
      hook: `The incident channel is filling with theories. ${track.scenario} Establish a trustworthy baseline so the team can distinguish facts from guesses.`,
      deepDive: [
        `A baseline combines current status, a timestamp, scope, configuration, and the user-visible symptom. One snapshot is not a trend, but it is the minimum evidence needed to evaluate a later change.`,
        `Capture evidence before restarts or edits. Many failure signals are transient and disappear as soon as state is recreated.`,
      ],
      challenge: `Capture the diagnostic output, annotate the failing field, and state what additional observation would falsify your current hypothesis.`,
      question: `How do you establish a ${track.name} baseline during an active incident?`,
      trap: "Changing state first and trying to reconstruct the original failure afterward.",
    },
    {
      hook: `${track.scenario} The visible error is a platform state, not necessarily the cause. Classify the evidence and choose the next action with the smallest cost and blast radius.`,
      deepDive: [
        `Symptoms describe impact; states describe what the platform is doing; causes explain why it entered that state. The line ${JSON.stringify(track.output.split("\n").slice(-1)[0])} is useful because it narrows the failing contract.`,
        `A good next command changes the decision tree. If both possible outputs lead to the same action, the command adds noise rather than information.`,
      ],
      challenge: `Label the supplied output as symptom, state, or cause, then defend the next diagnostic you would run.`,
      question: `How do you distinguish a ${track.name} symptom from its root cause?`,
      trap: "Treating the first recognizable error label as the diagnosis.",
    },
    {
      hook: `You now have evidence for the failure. Apply the narrowest reversible ${track.name} repair, avoid unrelated cleanup, and keep a rollback path open.`,
      deepDive: [
        `The repair must address the observed mismatch and nothing broader. Small changes reduce both blast radius and the number of variables in the recovery test.`,
        `A command reporting success proves only that the control plane accepted the request. It does not prove convergence or restoration of the original user journey.`,
      ],
      challenge: `Apply the repair, explain which state it changes, and name the exact rollback action before you execute it.`,
      question: `Why is this the safest repair for the ${track.name} incident?`,
      trap: "Making several plausible fixes at once and losing causal confidence.",
    },
    {
      hook: `The repair command succeeded, but the incident is not closed. Prove ${track.name} converged and that the original user-facing operation works again.`,
      deepDive: [
        `Validation needs two layers: control-plane state and data-plane or user-visible behavior. Either layer alone can produce a false recovery.`,
        `Use the original baseline as the before-state. A useful recovery claim names what changed, what stayed stable, and how long the healthy signal was observed.`,
      ],
      challenge: `Run the validator only after repair, then describe a user-level smoke check and one regression signal to watch.`,
      question: `What evidence is sufficient to declare this ${track.name} incident recovered?`,
      trap: "Stopping when the mutation command exits zero.",
    },
    {
      hook: `Traffic doubles after recovery and the same path approaches saturation. Decide whether to scale ${track.name}, remove a bottleneck, or protect the dependency first.`,
      deepDive: [
        `Scaling is safe only when the constrained resource and workload semantics are known. More replicas cannot repair serialized work, shared locks, hot partitions, or an exhausted dependency.`,
        `Choose a leading saturation signal, a user-facing SLO, and a rollback threshold. Capacity without guardrails can turn a local bottleneck into a fleet-wide failure.`,
      ],
      challenge: `Name the constrained resource, propose one scaling action, and define the metric that would prove it helped rather than moved the bottleneck.`,
      question: `How would you scale this ${track.name} path without hiding the real bottleneck?`,
      trap: "Assuming horizontal scale is universally safe and linear.",
    },
    {
      hook: `Security review finds that the working recovery path has more privilege than it needs. Harden ${track.name} while preserving the runtime contract.`,
      deepDive: [
        `Least privilege applies to identities, resources, actions, network paths, and time. Remove one unnecessary capability at a time and retest the exact production workflow.`,
        `Availability is part of security. A hardening change that silently blocks health checks, rotation, or recovery creates a different operational vulnerability.`,
      ],
      challenge: `Identify the highest-risk permission or trust boundary, narrow it, and prove the normal workflow plus rollback still works.`,
      question: `How would you reduce the blast radius of this ${track.name} setup?`,
      trap: "Calling a configuration secure because it is restrictive without testing operability.",
    },
    {
      hook: `The same incident has happened twice. Turn the successful ${track.name} diagnosis and repair into an idempotent, reviewable runbook with guardrails.`,
      deepDive: [
        `Automation should encode preconditions, scoped diagnostics, the smallest mutation, validation, and an explicit failure path. A shell script that only repeats commands is not yet an operational control.`,
        `Idempotence means rerunning the workflow leaves an already-correct system unchanged. Auditability means an operator can see inputs, decisions, and the exact state transition.`,
      ],
      challenge: `Write the runbook sequence as precheck → evidence → repair → validation → rollback and identify where human approval belongs.`,
      question: `What makes a ${track.name} recovery runbook safe to automate?`,
      trap: "Automating the mutation while omitting preconditions and post-change proof.",
    },
    {
      hook: `Boss incident: ${track.scenario} You have ten minutes, mixed signals, and no hints. Restore service without destroying evidence or widening impact.`,
      deepDive: [
        `Start by stating impact and scope, then follow the highest-information branch. Keep a timestamped incident log so every mutation is tied to evidence and an expected result.`,
        `The winning sequence is not the fastest typing; it is the shortest defensible path from symptom to cause to verified recovery. Escalate when authority or rollback safety is missing.`,
      ],
      challenge: `Complete diagnostic, repair, and validation in order. Then give a three-sentence incident update covering impact, cause, and recovery evidence.`,
      question: `Lead me through this ${track.name} incident as if I were the incident commander.`,
      trap: "Optimizing for speed while skipping scope, communication, or recovery proof.",
    },
    {
      hook: `You are in the final interview round. Explain the ${track.name} incident in 60–90 seconds, then prove your answer with the same commands used in the lab.`,
      deepDive: [
        `A strong answer follows situation → evidence → decision → result → prevention. It distinguishes the visible state from root cause and names the trade-off behind the chosen repair.`,
        `Interviewers probe depth with counterfactuals: what if the diagnostic were clean, the repair failed, or the validator passed while users still saw errors? Prepare those branches explicitly.`,
      ],
      challenge: `Deliver the model answer aloud, answer one failure-path follow-up, and complete the hands-on validator without hints.`,
      question: `Explain how you diagnosed, repaired, and prevented this ${track.name} failure.`,
      trap: "Giving a polished definition with no evidence, trade-off, or hands-on proof.",
    },
  ][lesson.id - 1];

  return {
    hook: phases.hook,
    deepDive: phases.deepDive,
    walkthrough: [
      { label: "1 · Observe", command: track.command, output: track.output, why: "Preserves the failure evidence and narrows the responsible control point before state changes." },
      { label: "2 · Repair", command: track.fix, output: `Change accepted: ${track.fix}`, why: "Applies the smallest track-specific mutation supported by the observed evidence." },
      { label: "3 · Prove", command: track.validator, output: "PASS — desired state and recovery condition verified.", why: "Tests the explicit success condition instead of treating command acceptance as recovery." },
    ],
    challenge: phases.challenge,
    successCriteria: ["Evidence captured before mutation", "Repair is narrow and reversible", "Validator proves the intended outcome"],
    interviewQuestion: phases.question,
    interviewTrap: phases.trap,
    diagramNarration: [
      `Input enters ${track.concept[0]}; confirm identity, scope, and timestamp.`,
      `${track.concept[1]} evaluates desired state against the current observation.`,
      `${track.concept[2]} is where the evidenced repair changes system state.`,
      `${track.concept[3]} must prove platform health and the original user outcome.`,
    ] as [string, string, string, string],
    assessment: ([
      {
        question: `Which statement best defines ${track.name}'s responsibility in this production path?`,
        options: [`It owns the boundary from ${track.concept[0]} through ${track.concept[3]}`, "It replaces every upstream and downstream dependency", "It guarantees user outcomes without observability"],
        correct: 0,
        explanation: `Correct: ${track.name} owns a specific control boundary. Production reasoning starts by naming that boundary and its observable outcome.`,
      },
      {
        question: `Where should you look first when ${track.concept[3]} is unhealthy?`,
        options: ["Restart every component", `Trace backward through ${track.concept.join(" → ")}`, "Increase capacity before collecting evidence"],
        correct: 1,
        explanation: "Correct: trace backward from the failed outcome and find the first contract that diverges from expected state.",
      },
      {
        question: `What must you do immediately after running ${track.command}?`,
        options: ["Apply every plausible fix", "Discard the output after reading it", "Interpret and preserve the failing field as baseline evidence"],
        correct: 2,
        explanation: "Correct: a command is useful only when its output changes the decision tree and is preserved for comparison after repair.",
      },
      {
        question: `Which baseline is strongest for this ${track.name} incident?`,
        options: ["A timestamped diagnostic plus scope, configuration, and user impact", "A teammate's memory of yesterday", "A successful mutation command"],
        correct: 0,
        explanation: "Correct: a trustworthy baseline combines scoped technical evidence with the original user-visible symptom.",
      },
      {
        question: `What does the supplied ${track.name} output represent before deeper investigation?`,
        options: ["Guaranteed root cause", "Evidence that narrows the failing contract", "Proof that all dependencies are healthy"],
        correct: 1,
        explanation: "Correct: platform output narrows the search, but you must still separate symptom, state, and causal mechanism.",
      },
      {
        question: `Why is ${track.fix} the preferred repair in this lab?`,
        options: ["It changes the most resources", "It avoids the need for validation", "It is the narrowest mutation supported by the evidence"],
        correct: 2,
        explanation: "Correct: a narrow, reversible mutation limits blast radius and preserves confidence about what restored service.",
      },
      {
        question: `What does a passing ${track.validator} prove?`,
        options: ["The explicit recovery condition is now true", "No future incident can occur", "Every user workflow is automatically covered"],
        correct: 0,
        explanation: "Correct: the validator proves its stated contract; pair it with a user-level smoke check for full recovery evidence.",
      },
      {
        question: `When is scaling ${track.name} a defensible response?`,
        options: ["Whenever latency rises", "After identifying the constrained resource and defining an SLO and rollback threshold", "Before checking shared dependencies"],
        correct: 1,
        explanation: "Correct: scaling follows bottleneck identification and must be evaluated against both saturation and user-facing outcomes.",
      },
      {
        question: `Which hardening change best follows least privilege?`,
        options: ["Disable all access", "Grant administrator access temporarily forever", "Narrow identity, action, resource, path, and time while retesting the workflow"],
        correct: 2,
        explanation: "Correct: least privilege is multidimensional and must preserve the required operational contract.",
      },
      {
        question: `What makes the ${track.name} recovery automation safe?`,
        options: ["Preconditions, evidence capture, guarded repair, validation, and rollback", "Running the mutation on a timer", "Suppressing errors to keep the pipeline green"],
        correct: 0,
        explanation: "Correct: operational automation encodes the whole decision path, not just the state-changing command.",
      },
      {
        question: "During the boss incident, what is the best first move?",
        options: ["Try the fastest remembered fix", "State impact and scope, preserve evidence, then follow the highest-information branch", "Wait for every stakeholder before diagnosing"],
        correct: 1,
        explanation: "Correct: incident leadership starts with impact and scope, then pursues the shortest evidence-backed path to recovery.",
      },
      {
        question: `Which structure produces the strongest ${track.name} interview answer?`,
        options: ["A list of product features", "A definition copied from documentation", "Situation, evidence, decision, result, prevention, and hands-on proof"],
        correct: 2,
        explanation: "Correct: this structure demonstrates operational judgment, causal reasoning, verification, and learning.",
      },
    ][lesson.id - 1]) as LessonSpec["assessment"],
    decisionTable: [
      {
        signal: track.output.split("\n").slice(-1)[0],
        interpretation: `The observed ${track.name} state diverges between ${track.concept[1]} and ${track.concept[2]}; this is the evidence-backed incident branch.`,
        nextAction: "Preserve this output, confirm its scope and timestamp, then apply only the narrow repair mapped to this failure.",
        command: track.fix,
      },
      {
        signal: `The diagnostic returns no matching ${track.concept[3]} state`,
        interpretation: `The target identity, environment, time window, or ${track.concept[0]} input may be wrong; absence of evidence is not proof of health.`,
        nextAction: "Reconfirm context and object identity before broadening the query or changing production state.",
        command: track.command,
      },
      {
        signal: "The repair is accepted but the recovery validator still fails",
        interpretation: `The control request succeeded, but ${track.concept[3]} did not converge; a dependency, rollout, cache, or data-plane path remains unhealthy.`,
        nextAction: "Stop further mutation, retain the failed validator output, inspect convergence, and use the reviewed rollback path if impact persists.",
        command: track.validator,
      },
    ],
    commonMistakes: [
      {
        mistake: `Treating ${track.scenario.split(".")[0].toLowerCase()} as the root cause`,
        consequence: "A visible state or symptom can have several causes, so the wrong repair may briefly hide impact while destroying useful evidence.",
        safer: `Use ${track.command} first and tie the next decision to the returned ${track.name} evidence.`,
      },
      {
        mistake: `Running ${track.fix} before recording the baseline`,
        consequence: "The mutation changes the evidence surface and prevents a defensible before/after comparison or causal incident review.",
        safer: "Capture identity, scope, timestamp, output, and rollback authority before changing state.",
      },
      {
        mistake: "Closing the incident when the repair command exits successfully",
        consequence: `Control-plane acceptance does not prove ${track.concept[3]} or the original user journey recovered.`,
        safer: `Run ${track.validator}, then verify the user-visible operation and watch the regression signal.`,
      },
    ],
  };
};

const curriculumTitle = (track: Track, lessonId: number) =>
  [
    `${track.name} in production`,
    `${track.concept[0]} to ${track.concept[3]}`,
    `Operate ${track.concept[1]}`,
    `Baseline ${track.concept[3]}`,
    `Diagnose: ${track.scenario.split(".")[0]}`,
    `Repair the ${track.name} incident`,
    `Prove ${track.concept[3]}`,
    `Scale ${track.name} safely`,
    `Harden ${track.name}`,
    `Automate the ${track.name} runbook`,
    `${track.name} boss incident`,
    `${track.name} interview gauntlet`,
  ][lessonId - 1];

export const lessonsFor = (track: Track): LessonSpec[] =>
  lessonBlueprints.map((lesson) => ({
    ...lesson,
    ...lessonDepth(track, lesson),
    tier:
      lesson.id <= 3
        ? "Beginner"
        : lesson.id <= 6
          ? "Intermediate"
          : lesson.id <= 9
            ? "Advanced"
            : "Interview-Ready",
    title: curriculumTitle(track, lesson.id),
    summary:
      `${lesson.summary} ${lesson.id === 1 ? track.scenario : ""}`.trim(),
  }));

export const courseMinutes = (track: Track) =>
  lessonsFor(track).reduce((total, lesson) => total + lesson.minutes, 0);

export type TierProject = {
  tier: Tier;
  title: string;
  brief: string;
  deliverables: [string, string, string];
  proof: string;
  xp: number;
};

export const projectsFor = (track: Track): TierProject[] => [
  {
    tier: "Beginner",
    title: `Map and operate ${track.name}`,
    brief: `Build an operator-ready map of ${track.concept.join(" → ")} and establish a trustworthy baseline for the production scenario: ${track.scenario}`,
    deliverables: [
      `An annotated four-stage ${track.name} architecture map with ownership boundaries`,
      `A captured baseline from ${track.command}`,
      `A one-page first-response checklist covering identity, scope, timestamp, and escalation`,
    ],
    proof: track.command,
    xp: 120,
  },
  {
    tier: "Intermediate",
    title: `Diagnose and recover the ${track.name} incident`,
    brief: `Use evidence to separate symptom, state, and cause; apply the smallest reversible repair; and prove the original user outcome recovered.`,
    deliverables: [
      "A timestamped before-state with the failing signal highlighted",
      `A change record explaining why ${track.fix} is the narrowest safe repair`,
      "A before/after validation record plus the user-visible smoke result",
    ],
    proof: track.validator,
    xp: 220,
  },
  {
    tier: "Advanced",
    title: `Scale and harden ${track.name}`,
    brief: `Prepare the recovered path for twice the load while reducing privilege and blast radius without breaking ${track.concept[3]}.`,
    deliverables: [
      "A bottleneck hypothesis with leading saturation signal, SLO, and rollback threshold",
      "A least-privilege review across identity, action, resource, network path, and time",
      "A failure-injection test proving the hardened design remains observable and recoverable",
    ],
    proof: track.validator,
    xp: 340,
  },
  {
    tier: "Interview-Ready",
    title: `${track.name} production readiness review`,
    brief: `Automate the runbook, recover a timed SEV-1, and defend the diagnosis, trade-offs, validation, and prevention plan in a 60–90 second interview response.`,
    deliverables: [
      `A validated ${track.slug}-production-recovery.yaml runbook`,
      "A completed 15-minute boss incident with accepted commander update",
      `A spoken answer grounded in ${track.command}, ${track.fix}, and ${track.validator}`,
    ],
    proof: track.validator,
    xp: 500,
  },
];
