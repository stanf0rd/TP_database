/*TODO: put this in script
https://stackoverflow.com/questions/15981197/postgresql-error-type-citext-does-not-exist
*/

DROP TABLE IF EXISTS forum_users;

CREATE TABLE forum_users (
  nickname  citext   NOT NULL PRIMARY KEY,
  email     citext   NOT NULL,
  fullname  varchar  NOT NULL,
  about     varchar  NOT NULL
);

DROP INDEX IF EXISTS index_on_users_email;

CREATE UNIQUE INDEX index_on_users_email
  ON forum_users (email);
