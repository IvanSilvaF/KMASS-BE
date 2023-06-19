from h import accounts, form, i18n, models, session, storage

from h.views.api.config import api_config
from h.views.api.helpers.angular import AngularRouteTemplater

import json
from urllib.parse import unquote


@api_config(
    versions=["v1", "v2"],
    route_name="api.links",
    link_name="links",
    renderer="json_sorted",
    description="URL templates for generating URLs for HTML pages",
    # nb. We assume that the returned URLs and URL templates are the same for all users,
    # regardless of authorization.
    http_cache=(60 * 5, {"public": True}),
)
def links(_context, request):
    templater = AngularRouteTemplater(request.route_url, params=["user"])

    tag_search_url = request.route_url("activity.search", _query={"q": 'tag:"__tag__"'})
    tag_search_url = tag_search_url.replace("__tag__", ":tag")

    oauth_authorize_url = request.route_url("oauth_authorize")
    oauth_revoke_url = request.route_url("oauth_revoke")

    websocket_url = request.registry.settings.get("h.websocket_url")

    return {
        "account.settings": request.route_url("account"),
        "forgot-password": request.route_url("forgot_password"),
        "groups.new": request.route_url("group_create"),
        "help": request.route_url("help"),
        "oauth.authorize": oauth_authorize_url,
        "oauth.revoke": oauth_revoke_url,
        "search.tag": tag_search_url,
        "signup": request.route_url("signup"),
        "user": templater.route_template("stream.user_query"),
        "websocket": websocket_url,
    }


@api_config(
    versions=["v1", "v2"],
    route_name="api.test",
    link_name="test",
    request_method="POST",
    renderer="json_sorted",
    description="URL templates for generating URLs for HTML pages",
    # nb. We assume that the returned URLs and URL templates are the same for all users,
    # regardless of authorization.
    http_cache=(60 * 5, {"public": True}),
)
def test(_context, request):
    cookie_auth = request.cookies.get('auth')
    cookie_session = request.cookies.get('session')

    title = request.POST.get('title')
    action = request.POST.get('action')
    file_type = request.POST.get('type')
    text = unquote(title).split('/')[-1]

    record = {
        'userid': "undefined",
        'cookie_session': "undefined",
        'cookie_auth': "undefined",
        'action_type': 11,
        'action_name': action + ' file',
        'event_type': 1,
        'text': text + '.' + file_type
    }

    if action == 'close':
        record['action_type'] = 12

    storage.create_interaction(request, record, 1)

    return {
        "test": "request.response",
    }


@api_config(
    versions=["v1", "v2"],
    route_name="api.event",
    link_name="event",
    renderer="json_sorted",
    description="Record event",
    # nb. We assume that the returned URLs and URL templates are the same for all users,
    # regardless of authorization.
    http_cache=(60 * 5, {"public": True}),
)
def event(context, request):
    user = context.user
    event = json.loads(request.body)

    record = {
        'userid': user.userid,
        'cookie_session': request.cookies.get('session'),
        'cookie_auth': request.cookies.get('auth'),
        'action_type': 0,
        'action_name': 'default',
        'event_type': 0,
    }

    if event['event'] == "upload_select":
        record['action_type'] = 5
        record['action_name'] = 'upload select'
        record['event_type'] = 1

    elif event['event'] == "upload_submit":
        record['action_type'] = 3
        record['action_name'] = 'upload submit request'
        record['event_type'] = 3
        record['text'] = event['filename']

    elif event['event'] == 'query_submit':
        record['action_type'] = 6
        record['action_name'] = 'query submit request'
        record['event_type'] = 3
        record['text'] = event['filename']

    elif event['event'] == 'link_submit':
        record['action_type'] = 10
        record['action_name'] = 'link submit request'
        record['event_type'] = 3
        record['text'] = event['filename']


    storage.create_interaction(request, record, 1)


    return {
        "test": "request.response",
    }