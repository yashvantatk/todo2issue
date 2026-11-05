\# Run log (redacted) - Swytchcode PPI, 4-5 Nov 2026 IST

| # | Time IST | Command | Result / output summary | Exit code | Notes |

|---|---|---|---|---|---|

| 1 | \~21:35 | `npm install -g swytchcode` (Windows PowerShell, folder Desktop\\swytch) | added 2 packages in 4s | 0 | |

| 2 | | `swy --version` | swytchcode version 2.25.1 | 0 | |

| 3 | | `swy login` | "You are already logged in. Run `swytchcode logout` to log out first." + 2 posthog WARN lines (shutdown timeout exceeded, 1 batch in flight) | 0 | |

| 4 | | `git init`, `git init -b main` (ignored: already initialised), `git remote add origin https://github.com/yashvantatk/swytch` | remote set | 0 | |

| 5 | \~21:43 | `git branch -M main` | branch renamed | 0 | |

| 6 | | `swy whoami` | backend https://api-v2.swytchcode.com, user session, <redacted-email>, session valid (expires in 17 minutes); "Provider credentials: not inside a Swytchcode project - run swytchcode init first"; 3 posthog WARN lines incl. context canceled POST to us.i.posthog.com | 0 | |

| 7 | | `swy init` (interactive) | Welcome banner, "signed in as ..."; editor prompt -> 5 gemini; mode prompt -> 1 production; "initialized project at C:\\Users\\yashv\\OneDrive\\Desktop\\swytch"; status: telemetry on | 0 | |

| 8 | \~21:45 | `.swytchcode\\tooling.json` (opened file) | {"editor":"gemini","integrations":{},"mode":"production","tools":{},"version":"2.25.1","workspace":"swytch"} (after get) | 0 | |

| 9 | | `dir` | init created .swytchcode/, GEMINI.md (1188 B), skills.md (18702 B) | 0 | |

| 10 | | `swy search github` | Providers: GitHub.github@1.1.4; hint to `swytchcode add provider <provider.library@version>` after `get` | 0 | |

| 11 | | `swy get github` | "Created workspace "swytch" for this project (saved in .swytchcode/tooling.json - commit it...)", found 1 bundles, saved GitHub/github@1.1.4 | 0 | |

| 12 | \~21:58 | `Get-ChildItem -Recurse .swytchcode`; opened wrekenfile.yaml | found github.issue.create in METHODS: POST /repos/{owner}/{repo}/issues; INPUTS owner (path, req), repo (path, req), body STRUCT (req); returns 201 issue; errors 400/403/404/410/422/503; EXECUTION http sync | 0 | |

| 13 | \~22:00 | `swy list methods \\| Select-String issue` | \~49 github.issue.\* methods (create, list, list1, list2, get, get1, get2, comments.\*, labels.\*, etc.); posthog warnings | 0 | |

| 14 | \~22:02 | `swy info github.issues.create` (ID from docs) | `error: canonical ID "github.issues.create" not found in any fetched providers or installed workflows` | non-zero | |

| 15 | \~22:25 | Ctrl+F in wrekenfile.yaml for `ENDPOINT: /repos/{owner}/{repo}/issues` | GET (list repo issues) block has CANONICAL\_ID `github.issue.get1`; POST is `github.issue.create` | - | |

| 16 | 22:29 | `swy add github.issue.create` | Added method "github.issue.create" to tooling.json (provider: GitHub.github); posthog warnings | 0 | |

| 17 | 22:30 | `swy add github.issue.get1` | Added method "github.issue.get1" to tooling.json; posthog warnings | 0 | |

| 18 | \~22:31 | `swy auth connect github` | Prompt "Select a library to connect: 1) <all> 2) <github>" -> 2; browser OAuth; "Connected github (oauth2)." | 0 | |

| 19 | 22:33 | `swy auth status` | github/github oauth2 default connected; "Note: 3 connected accounts in other workspaces are not shown here" | 0 | |

| 20 | 22:33 | `Set-Content body.json '{"title": "Hello from Swytchcode", "body": "First API call via swy exec"}'` | file written | 0 | |

| 21 | 22:33 | `swy exec github.issue.create --input owner=yashvantatk --input repo=swytch --body body.json --dry-run` | Printed request: POST https://api.github.com/repos/yashvantatk/swytch/issues, Authorization \[REDACTED], JSON body | 0 | |

| 22 | 22:33 | `swy exec github.issue.create ... --body body.json` (live) | "Running live - GitHub (production)"; status\_code 201; issue #1 https://github.com/yashvantatk/swytch/issues/1 created Wed 2026-11-04 10:33 PM IST (UTC+05:30) | 0 | FIRST SUCCESSFUL API CALL |

| 23 | 22:35 | `swy exec github.issue.get1 --input owner=yashvantatk --input repo=swytch` | 200; returned issue #1. CLI filled query defaults itself: direction=desc, page=1, per\_page=30, sort=created, state=open | 0 | defaults from Wrekenfile |

| 24 | 00:33 (5 Nov) | `mkdir sample`; `Set-Content sample\\app.js "// TODO: add input validation`n// FIXME: handle empty cart`n// TODO: write unit tests"` | sample file with 3 comments | 0 | |

| 25 | 00:34 | `node todo2issue.js sample --dry-run` | Found 3; 3x "DRY-RUN would POST https://api.github.com/repos/yashvantatk/swytch/issues"; Node DEP0190 warning (shell:true with args) | 0 | |

| 26 | 00:34 | `node todo2issue.js sample` | CREATED #2, #3, #4 (issues 2-4 on yashvantatk/swytch) | 0 | STEP 4 WORKS |

| 27 | 00:35 | `node todo2issue.js sample` (again) | 3x SKIP (already filed) -> dedupe proven | 0 | |

| 28 | 18:10 (5 Nov) | dry-run after repo rename to todo2issue | POST https://api.github.com/repos/yashvantatk/todo2issue/issues, Authorization \[REDACTED] | 0 | screenshots/dry-run.png |

| 29 | 18:14 | `swy exec github.issue.get1 --input owner=yashvantatk --input repo=todo2issue` | status\_code 200, issues #1-#4 | 0 | screenshots/list-200.png |



Note: the repo was named `swytch` during rows 1-27 and renamed to `todo2issue` on 5 Nov; GitHub redirects the old URLs.

