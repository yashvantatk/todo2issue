// todo2issue: turn TODO/FIXME comments into GitHub issues via the Swytchcode CLI.
// Usage: node todo2issue.js <folder> [--dry-run]
const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawnSync } = require("child_process");

const OWNER = "yashvantatk";
const REPO = "swytch";
const folder = process.argv[2] || ".";
const dryRun = process.argv.includes("--dry-run");

// Run a swy command and return the JSON it prints (stdout + stderr scanned line by line).
function swy(args) {
    const r = spawnSync("swy", args, { encoding: "utf8", shell: true });
    const out = (r.stdout || "") + "\n" + (r.stderr || "");
    for (const line of out.split(/\r?\n/)) {
        const t = line.trim();
        if (t.startsWith("{")) {
            try { return JSON.parse(t); } catch (_) { }
        }
    }
    throw new Error("No JSON from swy " + args.join(" ") + "\n" + out);
}

// 1. Scan files for TODO: / FIXME: comments.
function scan(dir, found = []) {
    for (const name of fs.readdirSync(dir)) {
        if (["node_modules", ".git", ".swytchcode"].includes(name)) continue;
        const p = path.join(dir, name);
        if (fs.statSync(p).isDirectory()) { scan(p, found); continue; }
        fs.readFileSync(p, "utf8").split(/\r?\n/).forEach((text, i) => {
            const m = text.match(/(TODO|FIXME):\s*(.+)/);
            if (m) found.push({ file: p, line: i + 1, title: `${m[1]}: ${m[2].trim()}` });
        });
    }
    return found;
}

const todos = scan(folder);
console.log(`Found ${todos.length} TODO/FIXME comments in ${folder}`);

// 2. Read existing open issues (github.issue.get1) to avoid duplicates.
const existing = swy(["exec", "github.issue.get1", "--input", `owner=${OWNER}`, "--input", `repo=${REPO}`]);
const titles = new Set((existing.data || []).map((i) => i.title));

// 3. Create one issue per new TODO (github.issue.create).
for (const t of todos) {
    if (titles.has(t.title)) { console.log(`SKIP (already filed): ${t.title}`); continue; }
    const bodyFile = path.join(os.tmpdir(), "todo2issue-body.json");
    fs.writeFileSync(bodyFile, JSON.stringify({
        title: t.title,
        body: `Found at ${t.file}:${t.line}\n\nCreated by todo2issue using Swytchcode (github.issue.create).`,
    }));
    const args = ["exec", "github.issue.create", "--input", `owner=${OWNER}`, "--input", `repo=${REPO}`, "--body", bodyFile];
    if (dryRun) args.push("--dry-run");
    const res = swy(args);
    if (dryRun) console.log(`DRY-RUN would ${res.method} ${res.url}: ${t.title}`);
    else if (res.status_code === 201) console.log(`CREATED #${res.data.number}: ${res.data.html_url}`);
    else console.log(`FAILED (${res.status_code}): ${t.title}`);
}