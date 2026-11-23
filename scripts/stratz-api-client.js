"use strict";
const ENDPOINT = "https://api.stratz.com/graphql";

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createClient(options = {}) {
  const token = String(options.token || process.env.STRATZ_API_TOKEN || "").trim();
  if (!token) {
    throw new Error("Falta STRATZ_API_TOKEN. Generá tu token en https://stratz.com/api y guardalo como secreto de Actions; nunca lo escribas en el código.");
  }

  const fetchImpl = options.fetch || global.fetch;
  if (typeof fetchImpl !== "function") {
    throw new Error("Este entorno no dispone de fetch.");
  }

  const minIntervalMs = Math.max(1000, Number(options.minIntervalMs) || 2500);
  let lastRequest = 0;

  async function graphql(query, variables = {}) {
    const delay = Math.max(0, minIntervalMs - (Date.now() - lastRequest));
    if (delay) await wait(delay);
    lastRequest = Date.now();

    let attempt = 0;
    while (true) {
      const response = await fetchImpl(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Bearer " + token,
          "User-Agent": "STRATZ_API",
          "GraphQL-Require-Preflight": "true"
        },
        body: JSON.stringify({ query, variables })
      });

      if (response.status === 429 || response.status === 503) {
        if (attempt >= 3) {
          throw new Error("STRATZ limitó la consulta tras 4 intentos; sincronización detenida.");
        }
        const retry = Number(response.headers?.get?.("retry-after")) || Math.min(120, 15 * Math.pow(2, attempt));
        await wait(retry * 1000);
        attempt++;
        continue;
      }

      if (!response.ok) {
        let detail = "";
        try {
          detail = (await response.text()).slice(0, 600).replace(/Bearer\\s+[^\\s"']+/gi, "Bearer [REDACTED]");
        } catch (_) {
          detail = "";
        }
        const requestId = response.headers?.get?.("cf-ray") || response.headers?.get?.("x-request-id");
        throw new Error(
          "STRATZ HTTP " + response.status +
          (requestId ? " (request " + requestId + ")" : "") +
          (detail ? ": " + detail : "")
        );
      }

      const payload = await response.json();
      if (payload.errors?.length) {
        throw new Error("STRATZ GraphQL: " + payload.errors.map(x => x.message).join("; "));
      }
      if (!payload.data) {
        throw new Error("STRATZ devolvió una respuesta GraphQL sin data.");
      }
      return payload.data;
    }
  }

  return { graphql, endpoint: ENDPOINT };
}

module.exports = { createClient, ENDPOINT };
