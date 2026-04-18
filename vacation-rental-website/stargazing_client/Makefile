.PHONY: help install dev build start lint clean

help: ## Show this help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_\.-]+:.*?## / {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install npm dependencies (npm install)
	npm install

dev: ## Run the development server (npm run dev)
	npm run dev

build: ## Build the Next.js application for production (npm run build)
	npm run build

start: ## Start the Next.js production server (npm run start)
	npm run start

lint: ## Run ESLint to catch syntax and style issues (npm run lint)
	npm run lint

clean: ## Remove node_modules, .next build folder, and package-lock.json
	rm -rf node_modules
	rm -rf .next
	rm -f package-lock.json
