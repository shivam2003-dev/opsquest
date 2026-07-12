import { lessonsFor, projectsFor, tiers, tracks } from "../src/catalog";
import { readFileSync } from "node:fs";

const expected = [
  "Linux", "Git", "Docker", "Kubernetes", "Helm", "Ansible", "Terraform", "Jenkins", "GitHub Actions", "GitLab CI", "Argo CD", "OKD (OpenShift)", "Nginx", "HAProxy", "Envoy", "Kong", "Istio", "F5", "cert-manager", "external-dns", "Keycloak", "Vault", "Trivy", "WireGuard", "Prometheus", "Grafana", "OpenTelemetry", "AWS", "Azure", "Google Cloud", "Cloudflare", "Airflow", "Spark", "Kafka", "Flink", "dbt", "Dagster", "Prefect", "BigQuery", "Snowflake", "Databricks", "ClickHouse", "Elasticsearch", "PostgreSQL", "MongoDB", "Redis", "RabbitMQ", "Power BI", "Tableau", "Cypress", "Playwright", "Postman", "Gatling",
];

const failures: string[] = [];
const stylesheet = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
for (const declaration of stylesheet.matchAll(/font(?:-size)?\s*:\s*([^;]+)/g)) {
  for (const size of declaration[1].matchAll(/([0-9]+(?:\.[0-9]+)?)px/g)) {
    if (Number(size[1]) < 12)
      failures.push(`Font size below 12px: ${declaration[0].trim()}`);
  }
}
const actual = tracks.map((track) => track.name);
for (const name of expected) if (!actual.includes(name)) failures.push(`Missing track: ${name}`);
for (const name of actual) if (!expected.includes(name)) failures.push(`Unexpected track: ${name}`);

const lessons = tracks.flatMap((track) => lessonsFor(track).map((lesson) => ({ track, lesson })));
for (const { track, lesson } of lessons) {
  const prefix = `${track.name} lesson ${lesson.id}`;
  if (lesson.deepDive.length < 2) failures.push(`${prefix}: fewer than 2 deep-dive paragraphs`);
  if (lesson.walkthrough.length !== 3) failures.push(`${prefix}: walkthrough must have 3 steps`);
  if (lesson.decisionTable.length !== 3) failures.push(`${prefix}: decision table must have 3 branches`);
  if (lesson.commonMistakes.length !== 3) failures.push(`${prefix}: common mistakes must have 3 entries`);
  if (lesson.successCriteria.length !== 3) failures.push(`${prefix}: success contract must have 3 checks`);
  if (lesson.assessment.options.length !== 3) failures.push(`${prefix}: assessment must have 3 choices`);
}

for (const tier of tiers) {
  const count = lessons.filter(({ lesson }) => lesson.tier === tier).length;
  if (count !== 159) failures.push(`${tier}: expected 159 lessons, found ${count}`);
}

const capstones = tracks.flatMap((track) => projectsFor(track));
if (capstones.length !== 212) failures.push(`Expected 212 capstones, found ${capstones.length}`);
for (const capstone of capstones)
  if (capstone.deliverables.length !== 3 || !capstone.proof || !capstone.brief)
    failures.push(`${capstone.tier} capstone is incomplete`);

const forbidden = [/\.\.\./, /security-context-constraints/, /document-api inspect/, /issue-temporary-certificate/, /healthcheck\/fail/, /stash name:/];
for (const track of tracks) {
  for (const [kind, command] of Object.entries({ diagnostic: track.command, repair: track.fix, validator: track.validator })) {
    if (!command.trim()) failures.push(`${track.name}: empty ${kind}`);
    for (const pattern of forbidden)
      if (pattern.test(command)) failures.push(`${track.name}: forbidden ${kind} pattern ${pattern}`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(JSON.stringify({
  tracks: tracks.length,
  lessons: lessons.length,
  tiers: Object.fromEntries(tiers.map((tier) => [tier, lessons.filter(({ lesson }) => lesson.tier === tier).length])),
  capstones: capstones.length,
  operationalCommands: tracks.length * 3,
  status: "PASS",
}, null, 2));
