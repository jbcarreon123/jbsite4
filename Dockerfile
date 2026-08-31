# runtime image only. the astro build runs on the host / ci, this just
# packages dist/ + prod node_modules. redeploy: pnpm build && docker compose up -d --build
FROM node:26 AS deps
WORKDIR /app
RUN npm install -g pnpm@11.24.0
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --prod --frozen-lockfile

# --- runtime ---
FROM node:26
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
# chromium's apt libs. the browsers themselves come from the host-mounted
# ~/.cache/ms-playwright, they are NOT downloaded in the image
RUN npx playwright install-deps chromium
COPY dist/ ./dist/
ENV NODE_ENV=production
EXPOSE 4321
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:4321/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "dist/server/entry.mjs"]
