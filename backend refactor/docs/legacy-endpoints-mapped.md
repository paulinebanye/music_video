# Legacy Endpoints → View Mapping

- Route: `GET /music`
  - Handler: `django.views.generic.base.TemplateView`
  - Location: framework (not defined in `music/views.py`)
  - External Calls: —
  - Serializers / DTOs: —

- Route: `ANY /music/admin/*`
  - Handler: `django.contrib.admin.sites.AdminSite`
  - Location: framework (not defined in `music/views.py`)
  - External Calls: —
  - Serializers / DTOs: —

- Route: `GET /api/v1/sidebar`
  - Handler: `music.views.SidebarView`
  - Location: `music/views.py:57-125`
  - External Calls: `get_room_info`, `get_org_members`
  - Serializers / DTOs: —

- Route: `GET /music/schema`
  - Handler: `drf_spectacular.views.SpectacularAPIView`
  - Location: external package (not defined in `music/views.py`)
  - External Calls: —
  - Serializers / DTOs: —

- Route: `GET /music/docs`
  - Handler: `drf_spectacular.views.SpectacularSwaggerView`
  - Location: external package (not defined in `music/views.py`)
  - External Calls: —
  - Serializers / DTOs: —

- Route: `GET /music/redoc`
  - Handler: `drf_spectacular.views.SpectacularRedocView`
  - Location: external package (not defined in `music/views.py`)
  - External Calls: —
  - Serializers / DTOs: —

- Route: `GET /media/<path:resource>`
  - Handler: `django.views.static.serve`
  - Location: framework (not defined in `music/views.py`)
  - External Calls: —
  - Serializers / DTOs: —

- Route: `GET /music/api/v1/info`
  - Handler: `music.views.PluginInfoView`
  - Location: `music/views.py:126-164`
  - External Calls: —
  - Serializers / DTOs: —

- Route: `GET /music/api/v1/ping`
  - Handler: `music.views.PluginPingView`
  - Location: `music/views.py:165-197`
  - External Calls: `requests.get`
  - Serializers / DTOs: —

- Route: `POST /music/api/v1/install`
  - Handler: `music.views.InstallView`
  - Location: `music/views.py:1018-1070`
  - External Calls: `RequestClient.request`
  - Serializers / DTOs: —

- Route: `DELETE /music/api/v1/uninstall`
  - Handler: `music.views.UninstallView`
  - Location: `music/views.py:1071-1122`
  - External Calls: `RequestClient.request`
  - Serializers / DTOs: —

- Route: `GET,POST /music/api/v1/org/<org_id>/room/<_id>/songs/current`
  - Handler: `music.views.change_room_image`
  - Location: `music/views.py:25-56`
  - External Calls: —
  - Serializers / DTOs: —

- Route: `GET,POST /music/api/v1/org/<org_id>/room/<_id>/songs`
  - Handler: `music.views.SongView`
  - Location: `music/views.py:198-262`
  - External Calls: `get_video`, `read_data`, `write_data`, `centrifugo_publish`
  - Serializers / DTOs: `SongSerializer`

- Route: `POST /music/api/v1/org/<org_id>/room/<_id>/songs/delete`
  - Handler: `music.views.DeleteSongView`
  - Location: `music/views.py:316-349`
  - External Calls: `delete_data`, `read_data`, `centrifugo_publish`
  - Serializers / DTOs: `DeleteSongSerializer`, `SongSerializer`

- Route: `POST /music/api/v1/org/<org_id>/room/<_id>/songs/like`
  - Handler: `music.views.LikeSongView`
  - Location: `music/views.py:350-405`
  - External Calls: `DataStorage.read`, `DataStorage.update`, `centrifugo_publish`
  - Serializers / DTOs: `LikeSongSerializer`

- Route: `POST /music/api/v1/org/<org_id>/room/<_id>/songs/likecount`
  - Handler: `music.views.songLikeCountView`
  - Location: `music/views.py:263-315`
  - External Calls: `read_data`, `DataStorage.update`
  - Serializers / DTOs: `SongLikeCountSerializer`

- Route: `GET /music/api/v1/search/<org_id>/<member_id>`
  - Handler: `music.views.SongSearchView`
  - Location: `music/views.py:406-470`
  - External Calls: `read_data`
  - Serializers / DTOs: `SongSerializer`

- Route: `GET /music/api/v1/search-suggestions/<org_id>/<member_id>`
  - Handler: `music.views.SongSearchSuggestions`
  - Location: `music/views.py:471-510`
  - External Calls: `read_data`
  - Serializers / DTOs: `SongSerializer`

- Route: `GET,POST /music/api/v1/org/<org_id>/room/<_id>/comments`
  - Handler: `music.views.CommentView`
  - Location: `music/views.py:511-560`
  - External Calls: `read_data`, `write_data`, `centrifugo_publish`
  - Serializers / DTOs: `CommentSerializer`

- Route: `POST /music/api/v1/org/<org_id>/room/<_id>/comments/delete`
  - Handler: `music.views.DeleteCommentView`
  - Location: `music/views.py:561-597`
  - External Calls: `delete_data`, `read_data`, `centrifugo_publish`
  - Serializers / DTOs: `CommentSerializer`, `DeleteChatSerializer`

- Route: `PUT /music/api/v1/org/<org_id>/room/<_id>/comments/update`
  - Handler: `music.views.UpdateCommentView`
  - Location: `music/views.py:598-637`
  - External Calls: `write_data`, `read_data`, `centrifugo_publish`
  - Serializers / DTOs: `CommentSerializer`

- Route: `GET /music/api/v1/org/<org_id>/room`
  - Handler: `music.views.RoomView`
  - Location: `music/views.py:638-658`
  - External Calls: `read_data`
  - Serializers / DTOs: `RoomSerializer`

- Route: `GET /music/api/v1/org/<org_id>/room/<_id>`
  - Handler: `music.views.RoomDetailView`
  - Location: `music/views.py:659-681`
  - External Calls: `read_data`
  - Serializers / DTOs: `RoomSerializer`

- Route: `DELETE /music/api/v1/org/<org_id>/room/<_id>/delete`
  - Handler: `music.views.DeleteRoomView`
  - Location: `music/views.py:682-718`
  - External Calls: `read_data`, `delete_data`
  - Serializers / DTOs: `RoomSerializer`

- Route: `GET,POST /music/api/v1/org/<org_id>/members/<member_id>/create`
  - Handler: `music.views.CreateRoom`
  - Location: `music/views.py:719-795`
  - External Calls: `read_data`, `write_data`, `requests.request`
  - Serializers / DTOs: `RoomSerializer`

- Route: `GET /music/api/v1/org/<org_id>/room/<_id>/members/count`
  - Handler: `music.views.UserCountView`
  - Location: `music/views.py:796-830`
  - External Calls: `read_data`, `centrifugo_post`
  - Serializers / DTOs: `RoomSerializer`

- Route: `PUT /music/api/v1/org/<org_id>/room/<_id>/members/remove`
  - Handler: `music.views.DeleteRoomUserView`
  - Location: `music/views.py:831-897`
  - External Calls: `read_data`, `write_data`, `centrifugo_publish`
  - Serializers / DTOs: `RoomSerializer`

- Route: `GET /music/api/v1/org/<org_id>/room/<_id>/members`
  - Handler: `music.views.RoomUserList`
  - Location: `music/views.py:898-927`
  - External Calls: `read_data`
  - Serializers / DTOs: `RoomSerializer`

- Route: `POST /music/api/v1/org/<org_id>/room/<room_id>/members/add`
  - Handler: `music.views.AddUserToRoomView`
  - Location: `music/views.py:928-1017`
  - External Calls: `DataStorage.read`, `DataStorage.update`, `centrifugo_publish`
  - Serializers / DTOs: `AddToRoomSerializer`
