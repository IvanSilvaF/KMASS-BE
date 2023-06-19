import logging
import os

import alembic.command
import alembic.config
import click
import sqlalchemy

from h import db

log = logging.getLogger(__name__)


@click.command()
@click.pass_context
def resetdb(ctx):
    # In production environments a short ES request timeout is typically set.
    # Commands to initialize the index may take longer than this, so override
    # any custom timeout with a high value.

    request = ctx.obj["bootstrap"]()

    _reset_db(request.registry.settings)


def _reset_db(settings):
    engine = db.make_engine(settings)

    # If the alembic_version table is present, then the database is managed by
    # alembic, and we shouldn't call `db.init`.

    log.info("resetting database")
    db.init(engine, should_create=True, should_drop=True, authority=settings["h.authority"])

    # Stamp the database with the current schema version so that future
    # migrations start from the correct point.
    alembic_cfg = alembic.config.Config("conf/alembic.ini")
    alembic.command.stamp(alembic_cfg, "head")

