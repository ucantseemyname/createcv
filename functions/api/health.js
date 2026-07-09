import { MODEL, json } from "./_shared.js";

export const onRequestGet = ({ env }) =>
  json({ ok: true, model: MODEL, hasKey: Boolean(env.ANTHROPIC_API_KEY) });
