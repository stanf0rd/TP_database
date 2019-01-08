FROM ubuntu:18.04
MAINTAINER Dmitry Paliy aka stanford

RUN apt-get update
ENV PGVER 10
RUN apt-get install -y postgresql-10
RUN apt-get install -y curl gnupg2
RUN curl -sL https://deb.nodesource.com/setup_11.x | bash
RUN apt-get install -y nodejs

RUN echo "host all  all    0.0.0.0/0  md5" >> /etc/postgresql/$PGVER/main/pg_hba.conf
RUN echo "listen_addresses='*'" >> /etc/postgresql/$PGVER/main/postgresql.conf

COPY ./ /opt/stanford-db/

USER postgres
RUN /etc/init.d/postgresql start &&\
  psql --command "CREATE USER forum_app WITH PASSWORD 'password';" &&\
  createdb -O forum_app forum_db &&\
  psql forum_db -f /opt/stanford-db/src/utils/schema.sql &&\
  /etc/init.d/postgresql stop


USER root
WORKDIR /opt/stanford-db

RUN npm install
EXPOSE 5000


CMD service postgresql start && node src/server.js
