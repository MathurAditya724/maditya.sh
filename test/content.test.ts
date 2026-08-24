import assert from "node:assert/strict";
import test from "node:test";
import { PROFILE, TALKS } from "../src/content";

test("public content includes the profile and talk metadata", () => {
  assert.equal(
    PROFILE,
    "I build, break, and fix stuff. Interested in LLMs, MCPs, and Hono 🔥",
  );
  assert.ok(TALKS.length > 0);
  assert.equal(TALKS[0]?.title, "Cloudflare BLR Meetup");
});
