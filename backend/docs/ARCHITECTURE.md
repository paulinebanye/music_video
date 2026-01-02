# Legacy Architecture Overview

This document captures the current Django implementation that powers the music plugin. It is derived directly from `server/` (Django project) and the auxiliary FastAPI helper located in `zc_music/`. Nothing in this document describes new NestJS behaviour; it is a factual map of the legacy system that we will migrate.

## High-Level Composition
- **Django project (`server/`)**
  - `config/`: global settings and URL registration.
  - `music/`: single Django app containing all views, serializers, pagination helpers, authentication hooks, and data-access utilities.
- **FastAPI helper (`zc_music/backend`)**
  - Provides the `/api/v1/org/{org_id}/rooms/{room_id}` endpoint for adding members to a room using the shared `DataStorage` abstraction.
- **Shared utilities**
  - `music/utils/dataStorage.py` (under `server/music/utils/` in the original repository) and `zc_music/backend/dataStorage.py` both expose a `DataStorage` class plus `centrifugo_publish` helper.
  - `music/utils/data_access.py` (imported throughout `views.py`) wraps calls to Zuri Core APIs and in-memory caches.

The Django app behaves as a monolith: all HTTP routes are registered under `music/api/v1` and are served by class-based views in `server/music/views.py`.

## URL Entrypoints
- `server/config/urls.py` mounts:
  - `/music` SPA shell (`TemplateView`)
  - `/music/admin` Django admin
  - `/music/api/v1/` → `music.urls` (domain endpoints)
  - `/api/v1/sidebar` → `SidebarView`
  - `/music/schema|docs|redoc` → drf-spectacular documentation
  - `/media/*` static asset serving
- `server/music/urls.py` defines all domain routes and maps them to view classes inside `server/music/views.py` (see `ENDPOINTS.md` for the exhaustive list).

## Domain Modules & Responsibilities

### Static & Docs
- Serves the SPA shell, API schema, Swagger, and ReDoc UIs.
- No business logic beyond template rendering.

### Sidebar
- `SidebarView` reads organisation and user IDs from query parameters.
- Fetches sidebar metadata using `get_room_info` and `get_org_members` (wrappers around Zuri Core APIs).
- Builds payloads that mirror the sidebar structure expected by Zuri Chat clients.

### Plugin Lifecycle
- `PluginInfoView` returns static metadata about the plugin (name, description, version, URLs).
- `PluginPingView` performs an HTTP check against `music.zuri.chat`.
- `InstallView` and `UninstallView` forward authenticated requests to Zuri Core API endpoints (`/organizations/{org_id}/plugins`), passing through plugin, user, and organisation IDs.
- Relies on a `RequestClient` helper to perform HTTP operations and bubble up status codes (200, 400, 424, etc.).

### Songs & Playback
- `SongView`, `change_room_image`, `DeleteSongView`, `LikeSongView`, and `songLikeCountView` manage playlist data within the `musicroom` collection via `DataStorage`.
- Uses `search_youtube` utilities to scrape YouTube results and `centrifugo_publish` to broadcast updates.
- Serializers enforce payload structure (`SongSerializer`, `LikeSongSerializer`, etc.).

### Search
- `SongSearchView` and `SongSearchSuggestions` run filtered reads against the `musicroom` collection using `DataStorage.read` and custom pagination (`SearchPagination`).

### Comments
- `CommentView`, `DeleteCommentView`, and `UpdateCommentView` manage comment threads stored under the `comments` collection.
- Uses `CommentSerializer` for validation and Centrifugo for realtime fan-out of create/update/delete events.

### Rooms & Membership
- `RoomView`, `RoomDetailView`, `DeleteRoomView`, and `CreateRoom` manage music rooms stored in the `musicroom` collection and proxy writes to Zuri Core APIs (`/data/write`).
- `zc_music/backend/music_room.py` exposes an additional FastAPI endpoint for bulk member additions, reusing `DataStorage` and `centrifugo_publish` to keep sidebar state in sync.

### Members
- `UserCountView`, `DeleteRoomUserView`, `RoomUserList`, and `AddUserToRoomView` orchestrate membership lists per room. They:
  - Read/write membership arrays via `DataStorage`.
  - Notify Centrifugo (`centrifugo_publish`) to update connected clients.
  - Rely on helper serializers (`AddToRoomSerializer`, `RemoveUserSerializer`).

## Shared Infrastructure & External Dependencies
- **DataStorage**: wraps REST calls to `https://api.zuri.chat/data/*` for read/write/delete operations.
- **RequestClient**: generic HTTP client used for plugin install/uninstall flows.
- **Centrifugo integration**: `centrifugo_publish` posts to `https://realtime.zuri.chat/api` using API keys stored in settings.
- **YouTube/Metadata utilities**: functions such as `get_video` (not shown here) scrape YouTube to enrich songs.
- **Settings**: `settings.PLUGIN_ID`, `settings.ROOM_ID`, and secrets supply plugin identifiers and default room values.
- **Serializers**: `serializers.py` defines DTO-like schemas consumed by the views to validate inbound data.
- **Pagination**: `SearchPagination` customises pagination responses for search endpoints.

## Behavioural Characteristics
- Most views are `APIView` subclasses combining validation, business logic, and persistence in a single class.
- Responses preserve legacy status codes, including `424 Failed Dependency` when upstream Zuri services fail and `302 Found` for duplicate member additions.
- Realtime events are emitted manually via Centrifugo rather than Django signals.
- Authentication is largely pass-through: views expect `Authorization` headers (for install/uninstall) or rely on org/user identifiers provided in the request body/query.

This architecture summary should be treated as the authoritative reference for the ongoing NestJS migration. Any new documentation MUST stay aligned with the concrete behaviours described above until the new implementation replaces them.
