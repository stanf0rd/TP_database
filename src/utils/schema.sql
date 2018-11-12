/*TODO: put this in script
https://stackoverflow.com/questions/15981197/postgresql-error-type-citext-does-not-exist
*/

-- drop all
DROP TABLE IF EXISTS threads;
DROP TABLE IF EXISTS forums;
DROP TABLE IF EXISTS "users";


-- users
CREATE TABLE "users" (
  nickname   citext     NOT NULL    PRIMARY KEY,
  email      citext     NOT NULL,
  fullname   text       NOT NULL,
  about      text       NOT NULL
);

DROP INDEX IF EXISTS index_on_users_email;

CREATE UNIQUE INDEX index_on_users_email
  ON "users" (email);


-- forums
CREATE TABLE forums (
  title      citext     NOT NULL,
  slug       citext     NOT NULL    PRIMARY KEY,
  "user"     citext     NOT NULL    REFERENCES "users" (nickname),
  posts      integer    NOT NULL    DEFAULT 0,
  threads    integer    NOT NULL    DEFAULT 0
);


-- threads
CREATE TABLE threads (
  id         serial     NOT NULL    PRIMARY KEY,
  title      text       NOT NULL,
  author     citext     NOT NULL    REFERENCES "users" (nickname),
  forum      citext     NOT NULL    REFERENCES forums (slug),
  message    text       NOT NULL,
  votes      integer                DEFAULT 0,
  slug       text                   DEFAULT NULL,
  created  timestamptz  NOT NULL    DEFAULT CURRENT_TIMESTAMP
);
