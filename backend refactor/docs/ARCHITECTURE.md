# Target NestJS Architecture (Draft)

This document captures the planned NestJS architecture inferred from the existing Django implementation and the HTTP contracts documented in `ENDPOINTS.md`. Unless explicitly marked as **Implemented**, all modules and components remain **not yet implemented**.

## High-Level Application Structure
- NestJS application root (`AppModule`) aggregates feature modules representing legacy slices: Plugin/Marketplace, Songs / Playback, Search, Comments, Rooms & Membership, and auxiliary cross-cutting infrastructure.
- Each feature module exposes controllers that mirror legacy endpoints one-for-one. No route redesign is proposed.
- Services encapsulate orchestration of outbound dependencies (Zuri Core APIs, data read/write endpoints, Centrifugo, YouTube scraping). Apart from the implemented Plugin Info slice, these services are placeholders.

## Module Boundaries

### Plugin/Marketplace Module
- **Endpoints covered:**
  - `GET /music/api/v1/info` — **Implemented** (matches legacy static payload).
  - `GET /music/api/v1/ping` — **Not yet implemented**.
  - `POST /music/api/v1/install` — **Not yet implemented**.
  - `DELETE /music/api/v1/uninstall` — **Not yet implemented**.
  - `GET /api/v1/sidebar` — **Not yet implemented**.
  - Static/docs routes (`/music`, `/music/schema`, `/music/docs`, `/music/redoc`, `/media/*`) — **Not yet implemented**.
- **Responsibilities (conceptual):**
  - Serve static plugin metadata and documentation proxies.
  - Handle plugin lifecycle operations (install/uninstall) against Zuri Core APIs.
  - Proxy sidebar information leveraging organisation membership lookups.
  - Surface static assets when running in legacy-compatible mode.
- **Dependencies:** RequestClient (for outbound HTTP to Zuri services), DataStorage (for room info), potential configuration providers for static content.

### Songs / Playback Module
- **Status:** **Not yet implemented**.
- **Endpoints covered:** `/music/api/v1/org/<org_id>/room/<_id>/songs*` and `/music/api/v1/org/<org_id>/room/<_id>/songs/current`.
- **Responsibilities:**
  - Manage playlist CRUD against Zuri data services.
  - Coordinate real-time notifications via Centrifugo when songs change.
  - Perform YouTube metadata scraping to enrich song payloads.
- **Dependencies:** RequestClient (Zuri endpoints, YouTube fetch), DataStorage (legacy helper compatibility), Centrifugo publisher abstraction, HTML parsing utility.

### Search Module
- **Status:** **Not yet implemented**.
- **Endpoints covered:** `/music/api/v1/search/<org_id>/<member_id>` and `/music/api/v1/search-suggestions/<org_id>/<member_id>`.
- **Responsibilities:**
  - Execute collection reads and transform results into search responses according to existing pagination structure.
- **Dependencies:** RequestClient or DataStorage for fetches; pagination helpers mirroring legacy behavior.

### Comments Module
- **Status:** **Not yet implemented**.
- **Endpoints covered:** `/music/api/v1/org/<org_id>/room/<_id>/comments*`.
- **Responsibilities:**
  - CRUD operations on comment documents via Zuri data service endpoints.
  - Broadcast comment updates to Centrifugo channels following current payload structure.
- **Dependencies:** DataStorage, RequestClient, Centrifugo publisher abstraction, serializer-style DTO validation.

### Rooms & Membership Module
- **Status:** **Not yet implemented**.
- **Endpoints covered:** `/music/api/v1/org/<org_id>/room*`, `/music/api/v1/org/<org_id>/members*`.
- **Responsibilities:**
  - Expose room listings, details, creation, and deletion.
  - Manage membership counts, additions, and removals with matching Centrifugo side effects.
- **Dependencies:** DataStorage, RequestClient, Centrifugo publisher abstraction.

### Centrifugo / Realtime Support
- **Status:** **Not yet implemented**.
- Shared support components to encapsulate publish semantics. Controllers/services above would delegate to this abstraction rather than using HTTP clients directly.

### YouTube Scraping / Parsing Support
- **Status:** **Not yet implemented**.
- Utility providers to mirror the existing BeautifulSoup-based extraction of metadata. Should remain isolated so it can be swapped when Nest adoption introduces a more robust client.

## Shared Infrastructure
- **RequestClient Abstraction:** central outbound HTTP client with configurable base URLs, headers, and timeout behavior. **Not yet implemented**.
- **DataStorage Abstraction:** mirrors legacy `DataStorage` helper to maintain compatibility with Zuri data read/write APIs while allowing the implementation to evolve later. **Not yet implemented**.
- **HttpExceptionFilter:** normalizes uncaught exceptions into JSON error responses consistent with Nest conventions while preserving compatibility with legacy error expectations. **Implemented** as scaffolding; behaviour remains minimal.
- **Validation Pipeline:** global `ValidationPipe` enforcing DTO schemas derived from documented contracts (whitelisting fields, transforming primitives, disabling detailed target/value echoing). **Implemented** at the framework level.
- **Configuration Provider:** central mechanism for environment-driven values (plugin IDs, tokens, URLs). **Not yet implemented**.

## Cross-Cutting Concerns
- **Validation:** DTO-based validation for requests will match existing field names and optionality. Beyond the implemented Plugin Info response, additional validation rules remain **not yet implemented**.
- **Error Mapping:** Services should translate upstream errors (Zuri APIs, Centrifugo) into HTTP status codes currently observed (e.g., 424 for dependency failures). Strategy remains **not yet implemented**.
- **Logging & Monitoring:** Not described in legacy code; remains out of scope in this draft.
- **Configuration:** Environment variable management is required for IDs/tokens currently hard-coded in Django settings. Implementation is **not yet implemented**.

## Implementation Status
- Plugin/Marketplace module has its `GET /music/api/v1/info` slice implemented and aligned with the documented contract.
- All other modules and endpoints remain **not yet implemented** pending future migration work. Future commits should reference this architecture to ensure feature parity with the legacy system without altering HTTP contracts.
