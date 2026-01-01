# Target NestJS Architecture (Draft)

This document captures the planned NestJS architecture inferred from the existing Django implementation and the HTTP contracts documented in `ENDPOINTS.md`. Unless explicitly marked as **Implemented**, all modules and components remain **not yet implemented**.

## High-Level Application Structure
- NestJS application root (`AppModule`) aggregates the feature modules listed below.
- Controllers map legacy endpoints one-for-one; no route redesign is proposed.
- Services orchestrate outbound dependencies (Zuri Core APIs, data endpoints, Centrifugo, YouTube metadata). Apart from the implemented Plugin Info slice, these services are placeholders.

## Module Breakdown

### PluginModule
- **Controllers:** `PluginInfoController` (Implemented), `PluginSidebarController` (Not yet implemented), `PluginDocsController` (Not yet implemented).
- **Services:** `PluginInfoService` (Implemented), `PluginSidebarService` (Not yet implemented), `PluginDocsService` (Not yet implemented).
- **Endpoints:**
  - `GET /music/api/v1/info` — **Implemented**.
  - `GET /api/v1/sidebar` — **Not yet implemented**.
  - Static/docs routes (`/music`, `/music/schema`, `/music/docs`, `/music/redoc`, `/media/*`) — **Not yet implemented**.

### InstallationModule
- **Controllers:** `PluginPingController` (Not yet implemented), `PluginInstallController` (Not yet implemented), `PluginUninstallController` (Not yet implemented).
- **Services:** `PluginPingService` (Not yet implemented), `PluginInstallService` (Not yet implemented), `PluginUninstallService` (Not yet implemented).
- **Endpoints:**
  - `GET /music/api/v1/ping` — **Not yet implemented**.
  - `POST /music/api/v1/install` — **Not yet implemented**.
  - `DELETE /music/api/v1/uninstall` — **Not yet implemented**.

### SongsModule
- **Controllers:** `SongController` (Not yet implemented), `CurrentSongController` (Not yet implemented), `SongLikeController` (Not yet implemented).
- **Services:** `SongService` (Not yet implemented), `CurrentSongService` (Not yet implemented), `SongLikeService` (Not yet implemented).
- **Endpoints:**
  - `GET /music/api/v1/org/<org_id>/room/<_id>/songs` — **Not yet implemented**.
  - `POST /music/api/v1/org/<org_id>/room/<_id>/songs` — **Not yet implemented**.
  - `POST /music/api/v1/org/<org_id>/room/<_id>/songs/delete` — **Not yet implemented**.
  - `POST /music/api/v1/org/<org_id>/room/<_id>/songs/like` — **Not yet implemented**.
  - `POST /music/api/v1/org/<org_id>/room/<_id>/songs/likecount` — **Not yet implemented**.
  - `GET,POST /music/api/v1/org/<org_id>/room/<_id>/songs/current` — **Not yet implemented**.

### CommentsModule
- **Controllers:** `CommentController` (Not yet implemented).
- **Services:** `CommentService` (Not yet implemented).
- **Endpoints:**
  - `GET,POST /music/api/v1/org/<org_id>/room/<_id>/comments` — **Not yet implemented**.
  - `POST /music/api/v1/org/<org_id>/room/<_id>/comments/delete` — **Not yet implemented**.
  - `PUT /music/api/v1/org/<org_id>/room/<_id>/comments/update` — **Not yet implemented**.

### RoomsModule
- **Controllers:** `RoomController` (Not yet implemented), `RoomDetailController` (Not yet implemented), `RoomDeletionController` (Not yet implemented).
- **Services:** `RoomService` (Not yet implemented), `RoomDetailService` (Not yet implemented), `RoomDeletionService` (Not yet implemented).
- **Endpoints:**
  - `GET /music/api/v1/org/<org_id>/room` — **Not yet implemented**.
  - `GET /music/api/v1/org/<org_id>/room/<_id>` — **Not yet implemented**.
  - `DELETE /music/api/v1/org/<org_id>/room/<_id>/delete` — **Not yet implemented**.

### MembersModule
- **Controllers:** `RoomCreationController` (Not yet implemented), `MemberCountController` (Not yet implemented), `MemberManagementController` (Not yet implemented).
- **Services:** `RoomCreationService` (Not yet implemented), `MemberCountService` (Not yet implemented), `MemberManagementService` (Not yet implemented).
- **Endpoints:**
  - `GET,POST /music/api/v1/org/<org_id>/members/<member_id>/create` — **Not yet implemented**.
  - `GET /music/api/v1/org/<org_id>/room/<_id>/members/count` — **Not yet implemented**.
  - `PUT /music/api/v1/org/<org_id>/room/<_id>/members/remove` — **Not yet implemented**.
  - `GET /music/api/v1/org/<org_id>/room/<_id>/members` — **Not yet implemented**.
  - `POST /music/api/v1/org/<org_id>/room/<room_id>/members/add` — **Not yet implemented**.

### SearchModule
- **Controllers:** `SearchController` (Not yet implemented), `SearchSuggestionController` (Not yet implemented).
- **Services:** `SearchService` (Not yet implemented), `SearchSuggestionService` (Not yet implemented).
- **Endpoints:**
  - `GET /music/api/v1/search/<org_id>/<member_id>` — **Not yet implemented**.
  - `GET /music/api/v1/search-suggestions/<org_id>/<member_id>` — **Not yet implemented**.

## Controller–Service Data Flow
- Controllers remain thin: they validate inputs and forward to their corresponding services.
- Services contain all orchestration logic, including interactions with outbound dependencies.
- Shared providers used by services (where applicable) include:
  - `RequestClient` (HTTP interactions with Zuri services) — **Not yet implemented**.
  - `DataStorage` (Zuri data read/write abstraction) — **Not yet implemented**.
  - `MediaMetadataProvider` / YouTube lookup helper — **Not yet implemented**.
  - `CentrifugoPublisher` abstraction — **Not yet implemented**.
- Controllers translate service responses into HTTP responses without altering business rules.

## Shared Infrastructure
- **HttpExceptionFilter:** global filter providing consistent error envelopes. **Implemented** as scaffolding.
- **Validation Pipeline:** global `ValidationPipe` enforcing DTO schemas. **Implemented** at the framework level.
- **Configuration Provider:** environment-driven values for plugin IDs, tokens, URLs. **Not yet implemented**.

## Cross-Cutting Concerns
- **Validation:** DTO-based validation mirrors legacy field requirements. Additional slices remain **not yet implemented**.
- **Error Mapping:** Service-level translation of dependency failures into HTTP status codes (e.g., 424) remains **not yet implemented**.
- **Logging & Monitoring:** Not defined in legacy scope; **not yet implemented**.
- **Configuration:** Loading of environment values is **not yet implemented**.

## Implementation Status Summary
- `GET /music/api/v1/info` handled by `PluginInfoController`/`PluginInfoService` — **Implemented** and aligned with the documented contract.
- All other modules, controllers, services, and shared providers are **not yet implemented** pending future migration work.
