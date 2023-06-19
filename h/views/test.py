from h.i18n import TranslationString as _
from pyramid.view import view_config, view_defaults
from h import util, models, storage
import os
#import speech_recognition as sr


@view_defaults(route_name="test.test", renderer="h:templates/test/test.html.jinja2")
class TestController:
    def __init__(self, request):
        self.request = request

    @view_config(request_method="GET")
    def printTEST(self):

        test = self.request.db.query(models.Test).all()
        print(test[0].name)

        return {
            "results": test,
            "zero_message": _("No annotations matched your search."),
        }
