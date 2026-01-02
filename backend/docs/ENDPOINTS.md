# Legacy Endpoint Inventory
# =========================

Authoritative inventory derived from Django `server/config/urls.py`, `server/music/urls.py`, and view classes in `server/music/views.py`.

## Static & Documentation
- **GET** `/music` → TemplateView (`index.html`)
- **ANY** `/music/admin` → Django AdminSite
- **GET** `/music/schema` → SpectacularAPIView
- **GET** `/music/docs` → SpectacularSwaggerView
- **GET** `/music/redoc` → SpectacularRedocView
- **GET** `/media/<path:resource>` → Django static serve

## Sidebar
- **GET** `/api/v1/sidebar` → SidebarView

## Plugin Lifecycle
- **GET** `/music/api/v1/info` → PluginInfoView
- **GET** `/music/api/v1/ping` → PluginPingView
- **POST** `/music/api/v1/install` → InstallView
- **DELETE** `/music/api/v1/uninstall` → UninstallView

## Songs
- **GET, POST** `/music/api/v1/org/<org_id>/room/<_id>/songs/current` → change_room_image
- **GET, POST** `/music/api/v1/org/<org_id>/room/<_id>/songs` → SongView
- **POST** `/music/api/v1/org/<org_id>/room/<_id>/songs/delete` → DeleteSongView
- **POST** `/music/api/v1/org/<org_id>/room/<_id>/songs/like` → LikeSongView
- **POST** `/music/api/v1/org/<org_id>/room/<_id>/songs/likecount` → songLikeCountView

## Search
- **GET** `/music/api/v1/search/<org_id>/<member_id>` → SongSearchView
- **GET** `/music/api/v1/search-suggestions/<org_id>/<member_id>` → SongSearchSuggestions

## Comments
- **GET, POST** `/music/api/v1/org/<org_id>/room/<_id>/comments` → CommentView
- **POST** `/music/api/v1/org/<org_id>/room/<_id>/comments/delete` → DeleteCommentView
- **PUT** `/music/api/v1/org/<org_id>/room/<_id>/comments/update` → UpdateCommentView

## Rooms
- **GET** `/music/api/v1/org/<org_id>/room` → RoomView
- **GET** `/music/api/v1/org/<org_id>/room/<_id>` → RoomDetailView
- **DELETE** `/music/api/v1/org/<org_id>/room/<_id>/delete` → DeleteRoomView
- **GET, POST** `/music/api/v1/org/<org_id>/members/<member_id>/create` → CreateRoom

## Members
- **GET** `/music/api/v1/org/<org_id>/room/<_id>/members/count` → UserCountView
- **PUT** `/music/api/v1/org/<org_id>/room/<_id>/members/remove` → DeleteRoomUserView
- **GET** `/music/api/v1/org/<org_id>/room/<_id>/members` → RoomUserList
- **POST** `/music/api/v1/org/<org_id>/room/<room_id>/members/add` → AddUserToRoomView
