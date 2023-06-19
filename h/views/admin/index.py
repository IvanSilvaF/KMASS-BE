import platform
import os
import shutil
import uuid
import hashlib
import json
from zipfile import ZipFile

from pyramid import httpexceptions
from pyramid.view import view_config

from h import __version__
from h import models
from h.models import user_doc
from h.security import Permission
from h.views.api.config import api_config


@view_config(
    route_name="admin.index",
    request_method="GET",
    renderer="h:templates/admin/index.html.jinja2",
    permission=Permission.AdminPage.LOW_RISK,
)
def index(_request):
    res = _request.db.query(models.UserDoc).all()
    res_dict = []
    for item in res:
        res_dict.append({'filename':item.title + "."+ item.type, 'target_uri':item.target_uri})
    titles = [item.title + "."+ item.type for item in res]

    return {
        "files": res_dict,
        "release_info": {
            "hostname": platform.node(),
            "python_version": platform.python_version(),
            "version": __version__,
        }
    }


@api_config(
    versions=["v1", "v2"],
    route_name="admin.upload",
    request_method="POST",
    # renderer="h:templates/admin/index.html.jinja2",
    link_name="upload",
    permission=Permission.AdminPage.LOW_RISK,
)
def upload(request):

    base_dir = "/home/hypothesis/kmass/dev-server/documents/"
    temp_dir = os.path.join(base_dir, 'temp')
    if not os.path.exists(temp_dir):
        os.mkdir(temp_dir)

    pdf_dir = os.path.join(base_dir, 'pdf')
    html_dir = os.path.join(base_dir, 'html')

    if request.POST['file_uploads'] is None:
        return httpexceptions.HTTPFound(request.route_path("activity.file_manager", username=username))

    try:
        fullname = request.POST['file_uploads'].filename
        input_file = request.POST['file_uploads'].file
    except:
        return httpexceptions.HTTPFound(request.route_path("activity.file_manager", username=username))

    split_tup = os.path.splitext(fullname)
    filename = split_tup[0]
    extension = split_tup[1]

    if extension == '.rar':
        print("you have upload rar")
    elif extension == '.zip':

        generate_filename = str(uuid.uuid4()) + '.zip'
        file_path = os.path.join(base_dir, generate_filename)
        with open(file_path, 'wb') as output_file:
            shutil.copyfileobj(input_file, output_file)


        with ZipFile(file_path, 'r') as zipObj:
            listOfFileNames = zipObj.namelist()
            # print("list of file", listOfFileNames, type(listOfFileNames))
            for fileName in listOfFileNames:
                if fileName.endswith('.pdf') or fileName.endswith('.html'):
                    # print("filename", fileName)
                    zipObj.extract(fileName, temp_dir)

    else:
        print("illegal extension")


    # get all schema
    res = request.db.query(models.UserDoc).all()
    titles = [item.title for item in res]
    md5sums = [item.md5sum for item in res]

    for file in os.listdir(temp_dir):
        filename = os.fsdecode(file)
        fullname = os.path.join(temp_dir, filename)
        md5sum = ''
        if filename.endswith(".pdf"):
            with open(fullname, 'rb') as f:
                data = f.read(1024)
                md5sum = hashlib.md5(data).hexdigest()

            # if md5sum not in md5sums:
            if os.path.splitext(filename)[0] not in titles:
                title = os.path.splitext(filename)[0]
                host = request.host.split(':')[0]
                record = {
                    'title' : title,
                    'userid' : "public",
                    'target_uri' : "http://" + host +":3000" + '/pdf/'+ title,
                    'type' : 'pdf',
                    'md5sum' : '',
                }
                res = user_doc.create_use_doc(request, record)

                md5sums.append(md5sum)
                des_file = os.path.join(pdf_dir, filename)
                shutil.copyfile(fullname, des_file)

        elif filename.endswith(".html"):
            with open(fullname, 'r') as rf:
                data = rf.read()
                host = request.host.split(':')[0]
                replacement = '\n\n<script src="http://' + host + ':3001/hypothesis"></script>\n</body>'
                data = data.replace('</body>', replacement)

                split_tup = os.path.splitext(filename)
                new_filename = os.path.join(temp_dir, split_tup[0] + '.html')
                with open(new_filename, 'w') as wf:
                    wf.write(data)

                fullname = new_filename

            if split_tup[0] not in titles:
                title = split_tup[0]
                host = request.host.split(':')[0]
                record = {
                    'title' : title,
                    'userid' : "public",
                    'target_uri' : "http://" + host +":3000" + '/document/'+ title,
                    'type' : 'html',
                    'md5sum' : title,
                }
                res = user_doc.create_use_doc(request, record)

                titles.append(title)
                des_file = os.path.join(html_dir, title+'.html')
                shutil.copyfile(fullname, des_file)

    shutil.rmtree(temp_dir)

    return httpexceptions.HTTPFound(request.route_path("admin.index"))