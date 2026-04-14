.PHONY: dev build start lint typecheck install clean

# ── Config ─────────────────────────────────────────────────────────────────────
NPM := npm

# ── Help ───────────────────────────────────────────────────────────────────────
help:
	@echo ""
	@echo "  GymAI Web (Next.js)"
	@echo "  ─────────────────────────────────────────"
	@echo "  install     Install node dependencies"
	@echo "  dev         Start Next.js dev server (port 3000)"
	@echo "  build       Production build"
	@echo "  start       Start production server (requires build first)"
	@echo "  lint        ESLint check"
	@echo "  typecheck   TypeScript type check (tsc --noEmit)"
	@echo "  clean       Remove .next build cache"
	@echo ""

# ── Install ────────────────────────────────────────────────────────────────────
install:
	$(NPM) install

# ── Dev ────────────────────────────────────────────────────────────────────────
dev:
	$(NPM) run dev

# ── Build & start ──────────────────────────────────────────────────────────────
build:
	$(NPM) run build

start:
	$(NPM) run start

# ── Lint & typecheck ───────────────────────────────────────────────────────────
lint:
	$(NPM) run lint

typecheck:
	node_modules/.bin/tsc --noEmit

# ── Clean ──────────────────────────────────────────────────────────────────────
clean:
	rm -rf .next
