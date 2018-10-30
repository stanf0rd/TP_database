/* TODO: put this in script
https://stackoverflow.com/questions/15981197/postgresql-error-type-citext-does-not-exist
*/
/* TODO: UTF-8 */


DROP TABLE IF EXISTS forums;

CREATE TABLE forums (
  title        citext    NOT NULL,
  slug         varchar   NOT NULL   PRIMARY KEY,
  creator      citext    NOT NULL   REFERENCES forum_users (nickname),
  posts        integer   NOT NULL   DEFAULT 0,
  threads      integer   NOT NULL   DEFAULT 0
);
