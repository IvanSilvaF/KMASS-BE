import logging
from datetime import datetime
from urllib.parse import urlparse

import sqlalchemy as sa
from sqlalchemy.ext.hybrid import hybrid_property

from h.db import Base
from h.util import uri
from h.util.uri import normalize as uri_normalize

log = logging.getLogger(__name__)


class UserDoc(Base):
    __tablename__ = "user_doc"

    id = sa.Column(sa.Integer, autoincrement=True, primary_key=True)

    #: The denormalized value of the first DocumentMeta record with type title.
    title = sa.Column("title", sa.UnicodeText())

    userid = sa.Column(sa.UnicodeText, nullable=False, index=True)

    type = sa.Column(sa.UnicodeText())

    #: The URI of the annotated page, as provided by the client.
    _target_uri = sa.Column("target_uri", sa.UnicodeText)
    #: The URI of the annotated page in normalized form.
    _target_uri_normalized = sa.Column("target_uri_normalized", sa.UnicodeText)

    md5sum = sa.Column(sa.UnicodeText)

    @hybrid_property
    def target_uri(self):
        return self._target_uri

    @target_uri.setter
    def target_uri(self, value):
        self._target_uri = value
        self._target_uri_normalized = uri.normalize(value)

    @hybrid_property
    def target_uri_normalized(self):
        return self._target_uri_normalized


def create_use_doc(request, data):
    user_doc = UserDoc(**data)
    request.db.add(user_doc)
    request.db.flush()

    return user_doc