---
name: blogger-publishing
description: Prepare or perform authorized Blogger publication, in-place post/Page updates, theme installation and hosted verification using this repository's packets and build artifacts. Use when publishing or verifying content rather than drafting it.
---

# Blogger publishing and verification

Read [WRITING.md](../../WRITING.md) for native authoring, [APPLY-UPDATES.md](../../APPLY-UPDATES.md) for existing exported entries, and the actual packet's `publish.md`. Read the selected config/build manifest before choosing a blog or output directory. Do not assume the default owner, branch, post count or most recent successful report is still current.

Choose the workflow that matches the request:

| Request | Action |
| --- | --- |
| New native post | Validate the packet, set native Title/Labels/Search description, paste body-only HTML, choose a new slug before first publication and Preview. No theme rebuild is normally needed. |
| New native Page | Set Title/Search description, paste body without H1, omit Labels, Preview, then link its actual URL after publication. |
| Existing post/Page update | Identify the exact entry/URL; back up and merge newer native edits; change the intended fields/body; retain permalink, original publication date, comments and identity; Preview → Update. |
| Source/template/config change | Build the selected Blogger output and run relevant tests. Restore the generated XML; separately update any affected saved bodies/editor fields. XML restore does not replace content. |

Never reimport `feed.atom` to update an existing publication. Never overwrite a native editor revision simply to make it match an old export. Do not change original publication dates to simulate freshness. Keyword arrays and editorial intent are not Search description values. A normal new post need not be added to the React application or static source registry.

From the repository root, for source/theme changes only:

```powershell
npm run build:blogger
npm run test:blogger
```

Respect a user-selected config/output. An unchanged CSV can remain open during a build; if its actual fields must change and Windows locks it, explain the error and use an alternate output or have the owner close the file. Do not close applications or discard spreadsheet edits. Generated output files are authoritative after a build; a previously downloaded ZIP is not automatically refreshed by that command.

Local preparation and read-only checks can proceed under the task's scope. Publish, upload, push or change account settings only when the request authorizes those actions, continuing without redundant approval when authorization is already present. Do not infer account authorization from permission to write an article. Follow explicit tool preferences; these skills do not require MCP.

After authorized deployment, run the read-only exported-route check when applicable:

```powershell
npm run verify:blogger:live
```

That command compares the selected build's inventory with its configured public site. It does not discover every new native post/Page; inspect new URLs separately in raw source and the browser. Verify HTTP status, intended canonical/robots policy, unique head/social descriptions, native title/dates/author, useful image/FAQ semantics, code text, live image delivery and actual links. Include mobile URLs/layout and editor round-trips when relevant. Use Playwright only when a real browser check adds value.

Record exact URLs/build IDs, checks, failures and report paths. Separate local validation, native Blogger compilation/editor saves, public deployment and owner-only indexing/analytics reports. A PASS does not establish search indexing, AI citations, field performance or legal/editorial accuracy. If the owner asks only for instructions, provide the concrete steps and files without making external changes.

Use [SEO review](../blogger-seo-review/SKILL.md) for content/discovery findings and [images](../blogger-images/SKILL.md) for asset activation. Keep the final handoff short: what is prepared/published, verification outcome and remaining owner actions.
