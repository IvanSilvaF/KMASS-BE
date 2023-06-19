"""
HTTP/REST API for storage and retrieval of annotation data.

This module contains the views which implement our REST API, mounted by default
at ``/api``. Currently, the endpoints are limited to:

- basic CRUD (create, read, update, delete) operations on annotations
- annotation search
- a handful of authentication related endpoints

It is worth noting up front that in general, authorization for requests made to
each endpoint is handled outside of the body of the view functions. In
particular, requests to the CRUD API endpoints are protected by the Pyramid
authorization system. You can find the mapping between annotation "permissions"
objects and Pyramid ACLs in :mod:`h.traversal`.
"""
from pyramid import i18n
from pyramid import httpexceptions
from pyramid.response import Response

import os
import shutil
import hashlib

from h import storage, models
from h.models import user_doc
from h.events import AnnotationEvent
from h.presenters import AnnotationJSONLDPresenter

from h.schemas.util import validate_query_params
from h.security import Permission
from h.views.api.config import api_config
from h.views.api.exceptions import PayloadError

_ = i18n.TranslationStringFactory(__package__)



@api_config(
    versions=["v1", "v2"],
    route_name="api.upload",
    # request_method="POST",
    link_name="upload",
    description="Upload an file",
)
def upload(context, request):
    """Create an annotation from the POST payload."""
    user = context.user
    username = user.username
    host = request.host.split(':')[0]

    # get all schema
    res = request.db.query(models.UserDoc).all()
    titles = [item.title for item in res]
    md5sums = [item.md5sum for item in res]
    
    # context from h.traversal.UserByNameRoot
    # print("request.POST['file_uploads']", request.POST['file_uploads'], type(request.POST['file_uploads']))
    if request.POST['file_uploads'] is None:
        return httpexceptions.HTTPFound(request.route_path("activity.file_manager", username=username))

    try:
        fullname = request.POST['file_uploads'].filename
        input_file = request.POST['file_uploads'].file
    except:
        return httpexceptions.HTTPFound(request.route_path("activity.file_manager", username=username))

    # print("filename", fullname)
    split_tup = os.path.splitext(fullname)
    filename = split_tup[0]
    extension = split_tup[1]
    md5sum = ''

    if extension == '.pdf':
        dir = os.path.join('/home/hypothesis/kmass/dev-server/documents/pdf', username)
        if not os.path.exists(dir):
            os.mkdir(dir)

        file_path = os.path.join(dir, fullname)
        temp_file_path = file_path + '.bk'

        if os.path.exists(file_path):
            return httpexceptions.HTTPFound(request.route_path("activity.file_manager", username=username))

        with open(temp_file_path, 'wb') as output_file:
            shutil.copyfileobj(input_file, output_file)

        with open(temp_file_path, 'rb') as f:
            data = f.read(1024)
            md5sum = hashlib.md5(data).hexdigest()
            # print("md5sum=>", filename, md5sum)

            if md5sum in md5sums:
                return httpexceptions.HTTPFound(request.route_path("activity.file_manager", username=username))

        os.rename(temp_file_path, file_path)

        host = request.host.split(':')[0]
        record = {
            'title' : filename,
            'userid' : username,
            'target_uri' : "http://" + host +":3000/" + username + '/pdf/'+ filename,
            'type' : 'pdf',
            'md5sum' : '',
        }
        res = user_doc.create_use_doc(request, record)

        record2 = {
            'userid': user.userid,
            'cookie_session': request.cookies.get('session'),
            'cookie_auth': request.cookies.get('auth'),
            'action_type': 4,
            'action_name': 'upload submit response',
            'event_type': 3,
            'text': fullname,
        }
        storage.create_interaction(request, record2, 1)

    elif extension == '.html':
        dir = os.path.join('/home/hypothesis/kmass/dev-server/documents/html', username)
        if not os.path.exists(dir):
            os.mkdir(dir)

        file_path = os.path.join(dir, fullname)
        if os.path.exists(file_path):
            return httpexceptions.HTTPFound(request.route_path("activity.file_manager", username=username))

        with open(file_path, 'wb') as output_file:
            shutil.copyfileobj(input_file, output_file)

        data = ''
        with open(file_path, 'r') as rf:
            data = rf.read()
            # replacement = '\n\n<script src="http://' + host + ':3001/hypothesis"></script>\n</body>'
            replacement_1 = '\n\n<script src="http://' + host + ':3001/hypothesis"></script>'
            replacement_2 = r"""
<script>
function code_loaded() {
  var host = window.location.hostname;
  console.log("code loaded")
  console.log(host)
  var request = window.location.protocol + "//" + host + ':5000/api/test';

  const formData = new FormData();
  formData.append('title', window.location.pathname);
  formData.append('action', 'open');
  formData.append('type', 'html');

  fetch(request, {
      method : 'post',
      body: formData,
    })
    .then((response) => response.json())
    .then((data) =>
    {
      console.log(data)
    });
}
window.onload = code_loaded;

function code_unloaded() {
  var host = window.location.hostname;
  console.log("code loaded")
  console.log(host)
  var request = window.location.protocol + "//" + host + ':5000/api/test';

  const formData = new FormData();
  formData.append('title', window.location.pathname);
  formData.append('action', 'close');
  formData.append('type', 'html');

  fetch(request, {
      method : 'post',
      body: formData,
    })
    .then((response) => response.json())
    .then((data) =>
    {
      console.log(data)
    });
}
window.onunload = code_unloaded;
</script>
</body>
            """
            replacement = replacement_1 + replacement_2
            data = data.replace('</body>', replacement)

        with open(file_path, 'w') as wf:
            wf.write(data)

        host = request.host.split(':')[0]
        record = {
            'title' : filename,
            'userid' : username,
            'target_uri' : "http://" + host +":3000/" + username + '/document/'+ filename,
            'type' : 'html',
            'md5sum' : filename,
        }
        res = user_doc.create_use_doc(request, record)

        record2 = {
            'userid': user.userid,
            'cookie_session': request.cookies.get('session'),
            'cookie_auth': request.cookies.get('auth'),
            'action_type': 4,
            'action_name': 'upload submit responsed',
            'event_type': 3,
            'text': fullname,
        }
        storage.create_interaction(request, record2, 1)
    else:
        print("illegal extension")


    return httpexceptions.HTTPFound(request.route_path("activity.file_manager", username=username))


@api_config(
    versions=["v1", "v2"],
    route_name="api.delete",
    request_method="POST",
    link_name="delete",
    description="Delete an file",
)
def delete(context, request):
    user = context.user
    username = user.username

    title = request.POST.get('title')
    pk_id = request.POST.get('id')
    file_type = request.POST.get('type')

    # delete database
    request.db.query(models.UserDoc) \
        .filter(models.UserDoc.title == title, models.UserDoc.userid == user.username) \
        .delete(synchronize_session="fetch")

    ret = request.db.query(models.UserDoc) \
        .filter(models.UserDoc.title == title, models.UserDoc.userid == user.username).all()

    # delete file
    if file_type == 'html':
        parent_dir = '/home/hypothesis/kmass/dev-server/documents/html/' + username
        title += '.html'
        file_path = os.path.join(parent_dir, title)
        if os.path.exists(file_path):
            os.remove(file_path)
            return {
                "search_results": "delete html success",
            }
        elif file_type == 'pdf':
            parent_dir = '/home/hypothesis/kmass/dev-server/documents/pdf/' + username
            title += '.pdf'
            file_path = os.path.join(parent_dir, title)
            if os.path.exists(file_path):
                os.remove(file_path)
                return {
                    "search_results": "delete pdf success",
                }


    return {
        "search_results": "failed",
    }
