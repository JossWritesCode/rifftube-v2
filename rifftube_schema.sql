--
-- PostgreSQL database dump
--

-- Dumped from database version 12.1
-- Dumped by pg_dump version 12.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: knex_migrations; Type: TABLE; Schema: public; Owner: davidnewberry
--

CREATE TABLE public.knex_migrations (
    id integer NOT NULL,
    name character varying(255),
    batch integer,
    migration_time timestamp with time zone
);


ALTER TABLE public.knex_migrations OWNER TO davidnewberry;

--
-- Name: knex_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: davidnewberry
--

CREATE SEQUENCE public.knex_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.knex_migrations_id_seq OWNER TO davidnewberry;

--
-- Name: knex_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: davidnewberry
--

ALTER SEQUENCE public.knex_migrations_id_seq OWNED BY public.knex_migrations.id;


--
-- Name: knex_migrations_lock; Type: TABLE; Schema: public; Owner: davidnewberry
--

CREATE TABLE public.knex_migrations_lock (
    index integer NOT NULL,
    is_locked integer
);


ALTER TABLE public.knex_migrations_lock OWNER TO davidnewberry;

--
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE; Schema: public; Owner: davidnewberry
--

CREATE SEQUENCE public.knex_migrations_lock_index_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.knex_migrations_lock_index_seq OWNER TO davidnewberry;

--
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: davidnewberry
--

ALTER SEQUENCE public.knex_migrations_lock_index_seq OWNED BY public.knex_migrations_lock.index;


--
-- Name: riffs; Type: TABLE; Schema: public; Owner: davidnewberry
--

CREATE TABLE public.riffs (
    id integer NOT NULL,
    audio_datum bytea,
    duration real,
    start_time real,
    text text,
    rating integer,
    "isText" boolean DEFAULT false NOT NULL,
    user_id integer NOT NULL,
    video_id integer NOT NULL
);


ALTER TABLE public.riffs OWNER TO davidnewberry;

--
-- Name: riffs_id_seq; Type: SEQUENCE; Schema: public; Owner: davidnewberry
--

CREATE SEQUENCE public.riffs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.riffs_id_seq OWNER TO davidnewberry;

--
-- Name: riffs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: davidnewberry
--

ALTER SEQUENCE public.riffs_id_seq OWNED BY public.riffs.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: davidnewberry
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255),
    email character varying(255),
    riff_pic bytea
);


ALTER TABLE public.users OWNER TO davidnewberry;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: davidnewberry
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO davidnewberry;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: davidnewberry
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: videos; Type: TABLE; Schema: public; Owner: davidnewberry
--

CREATE TABLE public.videos (
    id integer NOT NULL,
    url character varying(255) NOT NULL,
    title character varying(255),
    duration real,
    host character varying(255) DEFAULT 'youtube.com'::character varying
);


ALTER TABLE public.videos OWNER TO davidnewberry;

--
-- Name: videos_id_seq; Type: SEQUENCE; Schema: public; Owner: davidnewberry
--

CREATE SEQUENCE public.videos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.videos_id_seq OWNER TO davidnewberry;

--
-- Name: videos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: davidnewberry
--

ALTER SEQUENCE public.videos_id_seq OWNED BY public.videos.id;


--
-- Name: videos_users; Type: TABLE; Schema: public; Owner: davidnewberry
--

CREATE TABLE public.videos_users (
    id integer NOT NULL,
    user_id integer NOT NULL,
    video_id integer
);


ALTER TABLE public.videos_users OWNER TO davidnewberry;

--
-- Name: videos_users_id_seq; Type: SEQUENCE; Schema: public; Owner: davidnewberry
--

CREATE SEQUENCE public.videos_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.videos_users_id_seq OWNER TO davidnewberry;

--
-- Name: videos_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: davidnewberry
--

ALTER SEQUENCE public.videos_users_id_seq OWNED BY public.videos_users.id;


--
-- Name: knex_migrations id; Type: DEFAULT; Schema: public; Owner: davidnewberry
--

ALTER TABLE ONLY public.knex_migrations ALTER COLUMN id SET DEFAULT nextval('public.knex_migrations_id_seq'::regclass);


--
-- Name: knex_migrations_lock index; Type: DEFAULT; Schema: public; Owner: davidnewberry
--

ALTER TABLE ONLY public.knex_migrations_lock ALTER COLUMN index SET DEFAULT nextval('public.knex_migrations_lock_index_seq'::regclass);


--
-- Name: riffs id; Type: DEFAULT; Schema: public; Owner: davidnewberry
--

ALTER TABLE ONLY public.riffs ALTER COLUMN id SET DEFAULT nextval('public.riffs_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: davidnewberry
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: videos id; Type: DEFAULT; Schema: public; Owner: davidnewberry
--

ALTER TABLE ONLY public.videos ALTER COLUMN id SET DEFAULT nextval('public.videos_id_seq'::regclass);


--
-- Name: videos_users id; Type: DEFAULT; Schema: public; Owner: davidnewberry
--

ALTER TABLE ONLY public.videos_users ALTER COLUMN id SET DEFAULT nextval('public.videos_users_id_seq'::regclass);


--
-- Name: knex_migrations_lock knex_migrations_lock_pkey; Type: CONSTRAINT; Schema: public; Owner: davidnewberry
--

ALTER TABLE ONLY public.knex_migrations_lock
    ADD CONSTRAINT knex_migrations_lock_pkey PRIMARY KEY (index);


--
-- Name: knex_migrations knex_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: davidnewberry
--

ALTER TABLE ONLY public.knex_migrations
    ADD CONSTRAINT knex_migrations_pkey PRIMARY KEY (id);


--
-- Name: riffs riffs_pkey; Type: CONSTRAINT; Schema: public; Owner: davidnewberry
--

ALTER TABLE ONLY public.riffs
    ADD CONSTRAINT riffs_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: davidnewberry
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: davidnewberry
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: videos videos_pkey; Type: CONSTRAINT; Schema: public; Owner: davidnewberry
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT videos_pkey PRIMARY KEY (id);


--
-- Name: videos videos_url_unique; Type: CONSTRAINT; Schema: public; Owner: davidnewberry
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT videos_url_unique UNIQUE (url);


--
-- Name: videos_users videos_users_pkey; Type: CONSTRAINT; Schema: public; Owner: davidnewberry
--

ALTER TABLE ONLY public.videos_users
    ADD CONSTRAINT videos_users_pkey PRIMARY KEY (id);


--
-- Name: riffs riffs_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: davidnewberry
--

ALTER TABLE ONLY public.riffs
    ADD CONSTRAINT riffs_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: riffs riffs_video_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: davidnewberry
--

ALTER TABLE ONLY public.riffs
    ADD CONSTRAINT riffs_video_id_foreign FOREIGN KEY (video_id) REFERENCES public.videos(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: videos_users videos_users_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: davidnewberry
--

ALTER TABLE ONLY public.videos_users
    ADD CONSTRAINT videos_users_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: videos_users videos_users_video_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: davidnewberry
--

ALTER TABLE ONLY public.videos_users
    ADD CONSTRAINT videos_users_video_id_foreign FOREIGN KEY (video_id) REFERENCES public.videos(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

