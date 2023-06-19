**1.** use the following commands
```shell

git clone https://gitlab.com/jim.wen/hypothesis_backend.git
git clone https://gitlab.com/jim.wen/kmass.git

# activate virtual environment
python3 -m venv venv

source venv/bin/activate
```

```shell
# install requirements
python3 -m pip install -r requirements/requirements.txt

# dont forget, otherwise ModuleNotFoundError: No module named 'h'
echo $PYTHONPATH
/home/hypothesis/hypothesis_backend:

export PYTHONPATH="/home/hypothesis/hypothesis_backend:$PYTHONPATH"

# disable apache2 service
systemctl stop apache2
systemctl status apache2

systemctl stop postgresql@15-main.service
systemctl disable postgresql@15-main.service

systemctl stop postgresql
systemctl disable postgresql

# check the port
lsof -i -P -n

# docker services
docker network create dbs
docker-compose -f docker-compose.yml up -d
docker ps



python -m h --dev init

deactivate

# build client js
yarn build

make dev


pserve --reload conf/development-app.ini
pserve conf/development-app.ini
```

### Reset database
```shell
python -m h --dev resetdb

# add user for client_url
python -m h --dev user add
python -m h --dev user admin admin

pserve conf/development-app.ini
```

### add OAuth access
http://localhost:5000/users/admin

```shell
python -m h --dev init

deactivate

# build necessary resource
make dev

```

```shell
source venv/bin/activate
# add user
python -m h --dev user add
python -m h --dev user admin admin

make dev
```

**2.** add oauth client
### create oauth client
```
localhost:5000/login
localhost:5000/admin/oauthclients
```

### add `h.client_oauth_id` value to conf/development-app.ini
```ini
# sample
h.client_oauth_id:c704deea-5760-11ed-ab32-0baca72a1be6

Client
{current_scheme}://{current_host}:5000
```

### Setting for PgAdmin
```shell
# user@domain.com
# SuperSecret

docker network ls

docker run -p 80:80 --network dbs -e 'PGADMIN_DEFAULT_EMAIL=user@domain.com' -e 'PGADMIN_DEFAULT_PASSWORD=SuperSecret' -d dpage/pgadmin4

docker ps

docker inspect {progresssql id}

psql -h 0.0.0.0 -p 5432 --username=postgres postgres
```

### Migrate database
```shell
# go the relevant table
# Tools -> import/export Data...
# Storage Manager -> download the file
# go to another pgadmin, select relevant table
# Tools -> import/export Data...
```
