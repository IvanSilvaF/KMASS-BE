import logging
from datetime import datetime
from urllib.parse import urlparse

import sqlalchemy as sa
from sqlalchemy.ext.hybrid import hybrid_property

from h.db import Base
from h.util import uri
from h.util.uri import normalize as uri_normalize

log = logging.getLogger(__name__)


class Test(Base):
    __tablename__ = "test"

    #columns
    id = sa.Column(sa.Integer, autoincrement=True, primary_key=True)
    name = sa.Column("name_test", sa.UnicodeText())