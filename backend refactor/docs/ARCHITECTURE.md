# Target NestJS Architecture (Draft)

This document captures the planned NestJS architecture inferred from the existing Django implementation and the HTTP contracts documented in `ENDPOINTS.md`. All modules and components described here are **not yet implemented** unless otherwise noted.

## High-Level Application Structure
- NestJS application root (`AppModule`) aggregates feature modules representing legacy slices: Plugin/Marketplace, Songs / Playback, Search, Comments, Rooms & Membership, and auxiliary cross-cutting infrastructure.
- Each feature module exposes controllers that mirror legacy endpoints one-for-one. No route redesign is proposed.
- Services encapsulate orchestration of outbound dependencies (Zuri Core APIs, data read/write endpoints, Centrifugo, YouTube scraping). At this stage these services are placeholders and **not yet implemented**.

## Module Boundaries (all not yet implemented)

### Plugin/Marketplace Module
- **Endpoints covered:** static docs, schema pages, `/music/api/v1/info`, `/music/api/v1/ping`, `/music/api/v1/install`, `/music/api/v1/uninstall`, `/api/v1/sidebar`, static assets.
- **Responsibilities (conceptual):**
  - Serve static plugin metadata and documentation proxies.
  - Handle plugin lifecycle operations (install/uninstall) against Zuri Core APIs.
  - Proxy sidebar information leveraging organisation membership lookups.
  - Surface static assets when running in legacy-compatible mode.
- **Dependencies:** RequestClient (for outbound HTTP to Zuri services), DataStorage (for room info), potential configuration providers for static content.

### Songs / Playback Module
- **Endpoints covered:** `/music/api/v1/org/<org_id>/room/<_id>/songs*` and `/music/api/v1/org/<org_id>/room/<_id>/songs/current`.
- **Responsibilities:**
  - Manage playlist CRUD against Zuri data services.
  - Coordinate real-time notifications via Centrifugo when songs change.
  - Perform YouTube metadata scraping to enrich song payloads.
- **Dependencies:** RequestClient (Zuri endpoints, YouTube fetch), DataStorage (legacy helper compatibility), Centrifugo publisher abstraction, HTML parsing utility (not yet implemented in Nest).

### Search Module
- **Endpoints covered:** `/music/api/v1/search/<org_id>/<member_id>` and `/music/api/v1/search-suggestions/<org_id>/<member_id>`.
- **Responsibilities:**
  - Execute collection reads and transform results into search responses according to existing pagination structure.
- **Dependencies:** RequestClient or DataStorage for fetches; pagination helpers mirroring legacy behavior (not yet implemented).

### Comments Module
- **Endpoints covered:** `/music/api/v1/org/<org_id>/room/<_id>/comments*`.
- **Responsibilities:**
  - CRUD operations on comment documents via Zuri data service endpoints.
  - Broadcast comment updates to Centrifugo channels following current payload structure.
- **Dependencies:** DataStorage, RequestClient, Centrifugo publisher abstraction, serializer-style DTO validation.

### Rooms & Membership Module
- **Endpoints covered:** `/music/api/v1/org/<org_id>/room*`, `/music/api/v1/org/<org_id>/members*`.
- **Responsibilities:**
  - Expose room listings, details, creation, and deletion.
  - Manage membership counts, additions, and removals with matching Centrifugo side effects.
- **Dependencies:** DataStorage, RequestClient, Centrifugo publisher abstraction.

### Centrifugo / Realtime Support (not yet implemented)
- Shared support components to encapsulate publish semantics. Controllers/services above would delegate to this abstraction rather than using HTTP clients directly.

### YouTube Scraping / Parsing Support (not yet implemented)
- Utility providers to mirror the existing BeautifulSoup-based extraction of metadata. Should remain isolated so it can be swapped when Nest adoption introduces a more robust client.

## Shared Infrastructure (not yet implemented)
- **RequestClient Abstraction:** central outbound HTTP client with configurable base URLs, headers, and timeout behavior. Services across modules rely on this for Zuri Core and external calls.
- **DataStorage Abstraction:** mirrors legacy `DataStorage` helper to maintain compatibility with Zuri data read/write APIs while allowing the implementation to evolve later.
- **HttpExceptionFilter:** normalizes uncaught exceptions into JSON error responses consistent with Nest conventions while preserving compatibility with legacy error expectations.
- **Validation Pipeline:** global `ValidationPipe` enforcing DTO schemas derived from documented contracts (whitelisting fields, transforming primitives, disabling detailed target/value echoing).
- **Configuration Provider:** central mechanism for environment-driven values (plugin IDs, tokens, URLs). Details pending; marked as **not yet implemented**.

## Cross-Cutting Concerns
- **Validation:** DTO-based validation for requests will match existing field names and optionality. No additional business rules introduced.
- **Error Mapping:** Services should translate upstream errors (Zuri APIs, Centrifugo) into HTTP status codes currently observed (e.g., 424 for dependency failures). Full mapping strategy is **not yet implemented**.
- **Logging & Monitoring:** Not described in legacy code; remains out of scope in this draft.
- **Configuration:** Environment variable management is required for IDs/tokens currently hard-coded in Django settings. The Nest setup must read these values without altering semantics. Implementation is **not yet implemented**.

## Implementation Status
Every module, controller, service, DTO, and infrastructure element listed here is a placeholder concept pending implementation. No business logic, external integrations, or tests exist at this stage. Future commits should reference this architecture to ensure feature parity with the legacy system without altering HTTP contracts.
