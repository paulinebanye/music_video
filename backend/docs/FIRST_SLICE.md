# First NestJS Migration Slice

- **Slice Name:** Plugin Info API
- **Endpoints Included:**
  - `GET /music/api/v1/info`
- **Why This Is the Lowest-Risk Entry Point:**
  - Single read-only endpoint → smallest HTTP surface area.
  - No external dependencies; response is static and deterministic.
  - Easy to validate end-to-end by comparing exact JSON payloads between Django and NestJS.
- **Explicitly Out of Scope:**
  - All other Plugin/Marketplace routes (`/ping`, `/install`, `/uninstall`).
  - Any Songs, Comments, Rooms, Members, Search, or realtime functionality.
  - Template/static asset delivery and Django admin resources.
