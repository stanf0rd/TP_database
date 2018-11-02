/*TODO: put this in script
https://stackoverflow.com/questions/15981197/postgresql-error-type-citext-does-not-exist
*/

-- drop all
DROP TABLE IF EXISTS forums;
DROP TABLE IF EXISTS forum_users;


-- users
CREATE TABLE forum_users (
  nickname  citext   NOT NULL PRIMARY KEY,
  email     citext   NOT NULL,
  fullname  varchar  NOT NULL,
  about     varchar  NOT NULL
);

-- DROP INDEX IF EXISTS index_on_users_nickname;
DROP INDEX IF EXISTS index_on_users_email;

-- CREATE UNIQUE INDEX index_on_users_nickname
  -- ON forum_users (lower(nickname));

CREATE UNIQUE INDEX index_on_users_email
  ON forum_users (email);


-- forums
CREATE TABLE forums (
  title        citext    NOT NULL,
  slug         citext    NOT NULL   PRIMARY KEY,
  "user"       citext    NOT NULL   REFERENCES forum_users (nickname),
  posts        integer   NOT NULL   DEFAULT 0,
  threads      integer   NOT NULL   DEFAULT 0
);
