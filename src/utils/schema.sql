/*TODO: put this in script
https://stackoverflow.com/questions/15981197/postgresql-error-type-citext-does-not-exist
*/

CREATE EXTENSION IF NOT EXISTS citext;

-- drop all
DROP TABLE IF EXISTS user_posts;
DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS posts;
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

CREATE UNIQUE INDEX index_on_users_email
  ON "users" (email);

CREATE UNIQUE INDEX index_on_users_nickname
  ON "users" (nickname);


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
  slug       citext                 DEFAULT NULL,
  created  timestamptz  NOT NULL    DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX index_on_threads_slug
  ON threads (slug);

CREATE UNIQUE INDEX index_on_threads_id
  ON threads (id);


-- posts
CREATE TABLE posts (
  id         serial     NOT NULL    PRIMARY KEY,
  parent     integer    DEFAULT 0   REFERENCES posts (id),
  author     citext     NOT NULL    REFERENCES "users" (nickname),
  message    text       NOT NULL,
  path       integer[]  NOT NULL,
  isEdited   boolean    NOT NULL    DEFAULT false,
  forum      citext     NOT NULL    REFERENCES forums (slug),
  thread     integer    NOT NULL    REFERENCES threads (id),
  created  timestamptz  NOT NULL    DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX index_on_posts_path
  ON posts (path);

CREATE UNIQUE INDEX index_on_posts_id
  ON posts (id);


-- votes
CREATE TABLE votes (
  "user"     citext     NOT NULL    REFERENCES "users" (nickname),
  forum      citext     NOT NULL    REFERENCES threads (slug),
  vote       integer    NOT NULL    DEFAULT 0,
  PRIMARY KEY ("user", forum)
);


-- user_posts
CREATE TABLE user_posts (
  "user"     citext     NOT NULL    REFERENCES "users" (nickname),
  forum      citext     NOT NULL    REFERENCES forums (slug),
  PRIMARY KEY ("user", forum)
);

CREATE INDEX index_on_user_posts_user
  ON user_posts ("user");

CREATE INDEX index_on_user_posts_forum
  ON user_posts (forum);


-- default rows
INSERT INTO "users"
VALUES (0, 0, 0, 0);

INSERT INTO forums
VALUES (0, 0, 0, 0, 0);

INSERT INTO threads (id, title, author, forum, message)
VALUES (0, 0, 0, 0, 0);

INSERT INTO posts (id, parent, path, author, message, forum, thread)
VALUES (0, 0, '{}', 0, 0, 0, 0);


-- new post trigger
DROP FUNCTION IF EXISTS new_post;

CREATE FUNCTION new_post() RETURNS trigger AS $new_post$
    BEGIN
        UPDATE forums
           SET posts = posts + 1
         WHERE slug = NEW.forum;

        INSERT INTO user_posts ("user", forum)
        VALUES (NEW.author, NEW.forum)
            ON CONFLICT DO NOTHING;


        RETURN NEW;
    END;
$new_post$ LANGUAGE plpgsql;

CREATE TRIGGER new_post AFTER INSERT ON posts
    FOR EACH ROW EXECUTE PROCEDURE new_post();


-- new thread trigger
DROP FUNCTION IF EXISTS new_thread;

CREATE FUNCTION new_thread() RETURNS trigger AS $new_thread$
    BEGIN
        UPDATE forums
           SET threads = threads + 1
         WHERE slug = NEW.forum;

        INSERT INTO user_posts ("user", forum)
        VALUES (NEW.author, NEW.forum)
            ON CONFLICT DO NOTHING;

        RETURN NEW;
    END;
$new_thread$ LANGUAGE plpgsql;

CREATE TRIGGER new_thread AFTER INSERT ON threads
    FOR EACH ROW EXECUTE PROCEDURE new_thread();
