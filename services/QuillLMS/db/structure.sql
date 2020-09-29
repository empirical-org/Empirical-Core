--
-- PostgreSQL database dump
--

-- Dumped from database version 10.13
-- Dumped by pg_dump version 10.13

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

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: hstore; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS hstore WITH SCHEMA public;


--
-- Name: EXTENSION hstore; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION hstore IS 'data type for storing sets of (key, value) pairs';


--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: blog_posts_search_trigger(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.blog_posts_search_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
      begin
        new.tsv :=
          setweight(to_tsvector(COALESCE(new.title, '')), 'A') ||
          setweight(to_tsvector(COALESCE(new.body, '')), 'B') ||
          setweight(to_tsvector(COALESCE(new.subtitle, '')), 'B') ||
          setweight(to_tsvector(COALESCE(new.topic, '')), 'C');
        return new;
      end
      $$;


--
-- Name: old_timespent_teacher(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.old_timespent_teacher(teacher integer) RETURNS bigint
    LANGUAGE sql
    AS $$
        SELECT COALESCE(MAX(time_spent)::BIGINT, 0) FROM
        (SELECT MAX(time_spent_query.time_spent) AS time_spent
          FROM users
          LEFT OUTER JOIN (SELECT acss_ids.teacher_id, SUM (
              CASE
              WHEN (activity_sessions.started_at IS NULL)
                OR (activity_sessions.completed_at IS NULL)
                OR (activity_sessions.completed_at - activity_sessions.started_at < interval '1 minute')
                OR (activity_sessions.completed_at - activity_sessions.started_at > interval '30 minutes')
              THEN 441
              ELSE
                EXTRACT (
                  'epoch' FROM (activity_sessions.completed_at - activity_sessions.started_at)
                )
              END) AS time_spent FROM activity_sessions
            INNER JOIN (SELECT users.id AS teacher_id, activity_sessions.id AS activity_session_id FROM users
            INNER JOIN units ON users.id = units.user_id
            INNER JOIN classroom_units ON units.id = classroom_units.unit_id
            INNER JOIN activity_sessions ON classroom_units.id = activity_sessions.classroom_unit_id
            INNER JOIN concept_results ON activity_sessions.id = concept_results.activity_session_id
            WHERE users.id = teacher
            AND activity_sessions.completed_at < timestamp '2018-08-21 00:00:00.000000'
            AND activity_sessions.state = 'finished'
            GROUP BY users.id, activity_sessions.id) AS acss_ids ON activity_sessions.id = acss_ids.activity_session_id
            GROUP BY acss_ids.teacher_id
          ) AS time_spent_query ON users.id = time_spent_query.teacher_id
          WHERE users.id = teacher
          GROUP BY users.id) as times_spent;
      $$;


--
-- Name: timespent_question(integer, character varying); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.timespent_question(act_sess integer, question character varying) RETURNS integer
    LANGUAGE plpgsql
    AS $$
        DECLARE
            first_item timestamp;
          last_item timestamp;
          max_item timestamp;
          as_created_at timestamp;
          arow record;
          time_spent float;
          item timestamp;
        BEGIN
          SELECT created_at INTO as_created_at FROM activity_sessions WHERE id = act_sess;
          
          -- backward compatibility block
          IF as_created_at IS NULL OR as_created_at < timestamp '2013-08-25 00:00:00.000000' THEN
            SELECT SUM(
                  CASE
                  WHEN (activity_sessions.started_at IS NULL)
                    OR (activity_sessions.completed_at IS NULL)
                    OR (activity_sessions.completed_at - activity_sessions.started_at < interval '1 minute')
                    OR (activity_sessions.completed_at - activity_sessions.started_at > interval '30 minutes')
                  THEN 441
                  ELSE
                    EXTRACT (
                      'epoch' FROM (activity_sessions.completed_at - activity_sessions.started_at)
                    )
                END) INTO time_spent FROM activity_sessions WHERE id = act_sess AND state='finished';
                
                RETURN COALESCE(time_spent,0);
          END IF;
          
          
          first_item := NULL;
          last_item := NULL;
          max_item := NULL;
          time_spent := 0.0;
          FOR arow IN (SELECT date FROM activity_session_interaction_logs WHERE activity_session_id = act_sess AND meta ->> 'current_question' = question order by date) LOOP
            item := arow;
            IF last_item IS NULL THEN
              first_item := item;
              max_item := item;
              last_item := item;

            ELSIF item - last_item <= '2 minute'::interval THEN
              max_item := item;
              last_item := item;

            ELSE
              time_spent := time_spent + EXTRACT( EPOCH FROM max_item - first_item );
              first_item := item;
              last_item := item;
              max_item := item;

            END IF;
          END LOOP;
          
          IF max_item IS NOT NULL AND first_item IS NOT NULL THEN
            time_spent := time_spent + EXTRACT( EPOCH FROM max_item - first_item );
          END IF;
          
          RETURN time_spent;
        END;
      $$;


--
-- Name: timespent_student(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.timespent_student(student integer) RETURNS bigint
    LANGUAGE sql
    AS $$
        SELECT COALESCE(SUM(time_spent),0) FROM (
          SELECT id,timespent_activity_session(id) AS time_spent FROM activity_sessions
          WHERE activity_sessions.user_id = student 
          GROUP BY id) as as_ids;

      $$;


--
-- Name: timespent_student_for_teacher(integer, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.timespent_student_for_teacher(student integer, teacher integer) RETURNS bigint
    LANGUAGE sql
    AS $$
        SELECT COALESCE(SUM(time_spent),0) FROM (SELECT activity_sessions.id AS activity_session_id, timespent_activity_session(activity_sessions.id) as time_spent FROM users
          INNER JOIN classrooms_teachers ON users.id = classrooms_teachers.user_id
          INNER JOIN classroom_units ON classrooms_teachers.classroom_id = classroom_units.classroom_id
          INNER JOIN activity_sessions ON classroom_units.id = activity_sessions.classroom_unit_id
          WHERE users.id = teacher
          AND activity_sessions.user_id = student
          GROUP BY users.id, activity_sessions.id) as times_spent;
      $$;


--
-- Name: timespent_teacher(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.timespent_teacher(teacher integer) RETURNS bigint
    LANGUAGE sql
    AS $$
        SELECT COALESCE(SUM(time_spent),0) FROM (SELECT activity_sessions.id AS activity_session_id, timespent_activity_session(activity_sessions.id) as time_spent FROM users
          INNER JOIN classrooms_teachers ON users.id = classrooms_teachers.user_id
          INNER JOIN classroom_units ON classrooms_teachers.classroom_id = classroom_units.classroom_id
          INNER JOIN activity_sessions ON classroom_units.id = activity_sessions.classroom_unit_id
          WHERE users.id = teacher
          GROUP BY users.id, activity_sessions.id) as times_spent;
      $$;


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: active_activity_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.active_activity_sessions (
    id integer NOT NULL,
    uid character varying,
    data jsonb,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: active_activity_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.active_activity_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: active_activity_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.active_activity_sessions_id_seq OWNED BY public.active_activity_sessions.id;


--
-- Name: activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activities (
    id integer NOT NULL,
    name character varying,
    description text,
    uid character varying NOT NULL,
    data jsonb,
    activity_classification_id integer,
    topic_id integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    flags character varying[] DEFAULT '{}'::character varying[] NOT NULL,
    repeatable boolean DEFAULT true,
    follow_up_activity_id integer,
    supporting_info character varying,
    standard_id integer
);


--
-- Name: activities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.activities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.activities_id_seq OWNED BY public.activities.id;


--
-- Name: activities_unit_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activities_unit_templates (
    unit_template_id integer NOT NULL,
    activity_id integer NOT NULL,
    id integer NOT NULL,
    order_number integer
);


--
-- Name: activities_unit_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.activities_unit_templates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: activities_unit_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.activities_unit_templates_id_seq OWNED BY public.activities_unit_templates.id;


--
-- Name: activity_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activity_categories (
    id integer NOT NULL,
    name character varying,
    order_number integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: activity_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.activity_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: activity_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.activity_categories_id_seq OWNED BY public.activity_categories.id;


--
-- Name: activity_category_activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activity_category_activities (
    id integer NOT NULL,
    activity_category_id integer,
    activity_id integer,
    order_number integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: activity_category_activities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.activity_category_activities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: activity_category_activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.activity_category_activities_id_seq OWNED BY public.activity_category_activities.id;


--
-- Name: activity_classifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activity_classifications (
    id integer NOT NULL,
    name character varying,
    key character varying NOT NULL,
    form_url character varying,
    uid character varying NOT NULL,
    module_url character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    app_name character varying,
    order_number integer DEFAULT 999999999,
    instructor_mode boolean DEFAULT false,
    locked_by_default boolean DEFAULT false,
    scored boolean DEFAULT true
);


--
-- Name: activity_classifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.activity_classifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: activity_classifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.activity_classifications_id_seq OWNED BY public.activity_classifications.id;


--
-- Name: activity_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activity_sessions (
    id integer NOT NULL,
    classroom_activity_id integer,
    activity_id integer,
    user_id integer,
    pairing_id character varying,
    percentage double precision,
    state character varying DEFAULT 'unstarted'::character varying NOT NULL,
    completed_at timestamp without time zone,
    uid character varying,
    temporary boolean DEFAULT false,
    data public.hstore,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    started_at timestamp without time zone,
    is_retry boolean DEFAULT false,
    is_final_score boolean DEFAULT false,
    visible boolean DEFAULT true NOT NULL,
    classroom_unit_id integer,
    timespent integer
);


--
-- Name: activity_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.activity_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: activity_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.activity_sessions_id_seq OWNED BY public.activity_sessions.id;


--
-- Name: admin_accounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_accounts (
    id integer NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    name character varying
);


--
-- Name: admin_accounts_admins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_accounts_admins (
    id integer NOT NULL,
    admin_account_id integer,
    admin_id integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: admin_accounts_admins_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.admin_accounts_admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: admin_accounts_admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.admin_accounts_admins_id_seq OWNED BY public.admin_accounts_admins.id;


--
-- Name: admin_accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.admin_accounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: admin_accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.admin_accounts_id_seq OWNED BY public.admin_accounts.id;


--
-- Name: admin_accounts_teachers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_accounts_teachers (
    id integer NOT NULL,
    admin_account_id integer,
    teacher_id integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: admin_accounts_teachers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.admin_accounts_teachers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: admin_accounts_teachers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.admin_accounts_teachers_id_seq OWNED BY public.admin_accounts_teachers.id;


--
-- Name: announcements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.announcements (
    id integer NOT NULL,
    announcement_type character varying,
    start timestamp without time zone,
    "end" timestamp without time zone,
    link text,
    text text
);


--
-- Name: announcements_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.announcements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: announcements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.announcements_id_seq OWNED BY public.announcements.id;


--
-- Name: auth_credentials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_credentials (
    id integer NOT NULL,
    user_id integer NOT NULL,
    refresh_token character varying,
    expires_at timestamp without time zone,
    "timestamp" timestamp without time zone,
    access_token character varying NOT NULL,
    provider character varying NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: auth_credentials_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.auth_credentials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: auth_credentials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.auth_credentials_id_seq OWNED BY public.auth_credentials.id;


--
-- Name: authors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.authors (
    id integer NOT NULL,
    name character varying,
    avatar text
);


--
-- Name: authors_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.authors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: authors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.authors_id_seq OWNED BY public.authors.id;


--
-- Name: blog_post_user_ratings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_post_user_ratings (
    id integer NOT NULL,
    blog_post_id integer,
    user_id integer,
    rating integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: blog_post_user_ratings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.blog_post_user_ratings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: blog_post_user_ratings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.blog_post_user_ratings_id_seq OWNED BY public.blog_post_user_ratings.id;


--
-- Name: blog_posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_posts (
    id integer NOT NULL,
    title character varying NOT NULL,
    body text NOT NULL,
    subtitle text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    read_count integer DEFAULT 0 NOT NULL,
    topic character varying,
    draft boolean DEFAULT true,
    author_id integer,
    preview_card_content text NOT NULL,
    slug character varying,
    premium boolean DEFAULT false,
    tsv tsvector,
    published_at timestamp without time zone,
    external_link character varying,
    center_images boolean,
    order_number integer,
    image_link character varying,
    press_name character varying,
    featured_order_number integer
);


--
-- Name: blog_posts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.blog_posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: blog_posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.blog_posts_id_seq OWNED BY public.blog_posts.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    title text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: change_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.change_logs (
    id integer NOT NULL,
    explanation text,
    action character varying NOT NULL,
    changed_record_id integer,
    changed_record_type character varying NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    changed_attribute character varying,
    previous_value text,
    new_value text
);


--
-- Name: change_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.change_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: change_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.change_logs_id_seq OWNED BY public.change_logs.id;


--
-- Name: checkboxes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.checkboxes (
    id integer NOT NULL,
    user_id integer,
    objective_id integer,
    metadata character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: checkboxes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.checkboxes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: checkboxes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.checkboxes_id_seq OWNED BY public.checkboxes.id;


--
-- Name: classroom_activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.classroom_activities (
    id integer NOT NULL,
    classroom_id integer,
    activity_id integer,
    unit_id integer,
    due_date timestamp without time zone,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    assigned_student_ids integer[],
    visible boolean DEFAULT true NOT NULL,
    locked boolean DEFAULT false,
    pinned boolean DEFAULT false,
    assign_on_join boolean,
    completed boolean DEFAULT false
);


--
-- Name: classroom_activities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.classroom_activities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: classroom_activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.classroom_activities_id_seq OWNED BY public.classroom_activities.id;


--
-- Name: classroom_unit_activity_states; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.classroom_unit_activity_states (
    id integer NOT NULL,
    classroom_unit_id integer NOT NULL,
    unit_activity_id integer NOT NULL,
    completed boolean DEFAULT false,
    pinned boolean DEFAULT false,
    locked boolean DEFAULT false,
    data json DEFAULT '{}'::json,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: classroom_unit_activity_states_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.classroom_unit_activity_states_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: classroom_unit_activity_states_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.classroom_unit_activity_states_id_seq OWNED BY public.classroom_unit_activity_states.id;


--
-- Name: classroom_units; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.classroom_units (
    id integer NOT NULL,
    classroom_id integer NOT NULL,
    unit_id integer NOT NULL,
    visible boolean DEFAULT true,
    assigned_student_ids integer[] DEFAULT '{}'::integer[],
    assign_on_join boolean DEFAULT false,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: classroom_units_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.classroom_units_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: classroom_units_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.classroom_units_id_seq OWNED BY public.classroom_units.id;


--
-- Name: classrooms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.classrooms (
    id integer NOT NULL,
    name character varying,
    code character varying,
    teacher_id integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    clever_id character varying,
    grade character varying,
    visible boolean DEFAULT true NOT NULL,
    google_classroom_id bigint,
    grade_level integer
);


--
-- Name: classrooms_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.classrooms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: classrooms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.classrooms_id_seq OWNED BY public.classrooms.id;


--
-- Name: classrooms_teachers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.classrooms_teachers (
    id integer NOT NULL,
    user_id integer NOT NULL,
    classroom_id integer NOT NULL,
    role character varying NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    CONSTRAINT check_role_is_valid CHECK ((((role)::text = ANY ((ARRAY['owner'::character varying, 'coteacher'::character varying])::text[])) AND (role IS NOT NULL)))
);


--
-- Name: classrooms_teachers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.classrooms_teachers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: classrooms_teachers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.classrooms_teachers_id_seq OWNED BY public.classrooms_teachers.id;


--
-- Name: comprehension_activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comprehension_activities (
    id integer NOT NULL,
    title character varying(100),
    parent_activity_id integer,
    target_level smallint,
    scored_level character varying(100),
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: comprehension_activities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comprehension_activities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comprehension_activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comprehension_activities_id_seq OWNED BY public.comprehension_activities.id;


--
-- Name: comprehension_passages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comprehension_passages (
    id integer NOT NULL,
    activity_id integer,
    text text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: comprehension_passages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comprehension_passages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comprehension_passages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comprehension_passages_id_seq OWNED BY public.comprehension_passages.id;


--
-- Name: comprehension_prompts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comprehension_prompts (
    id integer NOT NULL,
    activity_id integer,
    max_attempts smallint,
    conjunction character varying(20),
    text character varying,
    max_attempts_feedback text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: comprehension_prompts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comprehension_prompts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comprehension_prompts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comprehension_prompts_id_seq OWNED BY public.comprehension_prompts.id;


--
-- Name: comprehension_prompts_rule_sets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comprehension_prompts_rule_sets (
    id integer NOT NULL,
    prompt_id integer,
    rule_set_id integer
);


--
-- Name: comprehension_prompts_rule_sets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comprehension_prompts_rule_sets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comprehension_prompts_rule_sets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comprehension_prompts_rule_sets_id_seq OWNED BY public.comprehension_prompts_rule_sets.id;


--
-- Name: comprehension_rule_sets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comprehension_rule_sets (
    id integer NOT NULL,
    activity_id integer,
    prompt_id integer,
    name character varying,
    feedback character varying,
    priority integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: comprehension_rule_sets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comprehension_rule_sets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comprehension_rule_sets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comprehension_rule_sets_id_seq OWNED BY public.comprehension_rule_sets.id;


--
-- Name: comprehension_rules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comprehension_rules (
    id integer NOT NULL,
    rule_set_id integer,
    regex_text character varying,
    case_sensitive boolean,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: comprehension_rules_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comprehension_rules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comprehension_rules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comprehension_rules_id_seq OWNED BY public.comprehension_rules.id;


--
-- Name: comprehension_turking_rounds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comprehension_turking_rounds (
    id integer NOT NULL,
    activity_id integer,
    uuid uuid,
    expires_at timestamp without time zone,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: comprehension_turking_rounds_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comprehension_turking_rounds_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comprehension_turking_rounds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comprehension_turking_rounds_id_seq OWNED BY public.comprehension_turking_rounds.id;


--
-- Name: concept_feedbacks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.concept_feedbacks (
    id integer NOT NULL,
    uid character varying,
    data jsonb,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    activity_type character varying NOT NULL
);


--
-- Name: concept_feedbacks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.concept_feedbacks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: concept_feedbacks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.concept_feedbacks_id_seq OWNED BY public.concept_feedbacks.id;


--
-- Name: concept_results; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.concept_results (
    id integer NOT NULL,
    activity_session_id integer,
    concept_id integer NOT NULL,
    metadata json,
    activity_classification_id integer,
    question_type character varying
);


--
-- Name: concept_results_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.concept_results_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: concept_results_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.concept_results_id_seq OWNED BY public.concept_results.id;


--
-- Name: concepts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.concepts (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    parent_id integer,
    uid character varying NOT NULL,
    replacement_id integer,
    visible boolean DEFAULT true,
    description text,
    explanation text
);


--
-- Name: concepts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.concepts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: concepts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.concepts_id_seq OWNED BY public.concepts.id;


--
-- Name: coteacher_classroom_invitations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coteacher_classroom_invitations (
    id integer NOT NULL,
    invitation_id integer NOT NULL,
    classroom_id integer NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: coteacher_classroom_invitations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.coteacher_classroom_invitations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: coteacher_classroom_invitations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.coteacher_classroom_invitations_id_seq OWNED BY public.coteacher_classroom_invitations.id;


--
-- Name: credit_transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.credit_transactions (
    id integer NOT NULL,
    amount integer NOT NULL,
    user_id integer NOT NULL,
    source_id integer,
    source_type character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: credit_transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.credit_transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: credit_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.credit_transactions_id_seq OWNED BY public.credit_transactions.id;


--
-- Name: criteria; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.criteria (
    id integer NOT NULL,
    concept_id integer NOT NULL,
    count integer DEFAULT 0 NOT NULL,
    recommendation_id integer NOT NULL,
    no_incorrect boolean DEFAULT false NOT NULL
);


--
-- Name: criteria_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.criteria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: criteria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.criteria_id_seq OWNED BY public.criteria.id;


--
-- Name: csv_exports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.csv_exports (
    id integer NOT NULL,
    export_type character varying,
    emailed_at timestamp without time zone,
    filters json,
    teacher_id integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    csv_file character varying
);


--
-- Name: csv_exports_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.csv_exports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: csv_exports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.csv_exports_id_seq OWNED BY public.csv_exports.id;


--
-- Name: districts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.districts (
    id integer NOT NULL,
    clever_id character varying,
    name character varying,
    token character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: districts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.districts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: districts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.districts_id_seq OWNED BY public.districts.id;


--
-- Name: districts_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.districts_users (
    district_id integer,
    user_id integer
);


--
-- Name: file_uploads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.file_uploads (
    id integer NOT NULL,
    name character varying,
    file character varying,
    description text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: file_uploads_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.file_uploads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: file_uploads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.file_uploads_id_seq OWNED BY public.file_uploads.id;


--
-- Name: firebase_apps; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.firebase_apps (
    id integer NOT NULL,
    name character varying,
    secret character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    pkey text
);


--
-- Name: firebase_apps_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.firebase_apps_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: firebase_apps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.firebase_apps_id_seq OWNED BY public.firebase_apps.id;


--
-- Name: images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.images (
    id integer NOT NULL,
    file character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: images_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.images_id_seq OWNED BY public.images.id;


--
-- Name: invitations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invitations (
    id integer NOT NULL,
    invitee_email character varying NOT NULL,
    inviter_id integer NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    invitation_type character varying,
    archived boolean DEFAULT false
);


--
-- Name: invitations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.invitations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: invitations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.invitations_id_seq OWNED BY public.invitations.id;


--
-- Name: ip_locations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ip_locations (
    id integer NOT NULL,
    country character varying,
    city character varying,
    state character varying,
    zip integer,
    user_id integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: ip_locations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ip_locations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ip_locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ip_locations_id_seq OWNED BY public.ip_locations.id;


--
-- Name: milestones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.milestones (
    id integer NOT NULL,
    name character varying NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: milestones_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.milestones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: milestones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.milestones_id_seq OWNED BY public.milestones.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    text text NOT NULL,
    user_id integer NOT NULL,
    meta jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: oauth_access_grants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.oauth_access_grants (
    id integer NOT NULL,
    resource_owner_id integer NOT NULL,
    application_id integer NOT NULL,
    token character varying NOT NULL,
    expires_in integer NOT NULL,
    redirect_uri text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    revoked_at timestamp without time zone,
    scopes character varying
);


--
-- Name: oauth_access_grants_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.oauth_access_grants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: oauth_access_grants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.oauth_access_grants_id_seq OWNED BY public.oauth_access_grants.id;


--
-- Name: oauth_access_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.oauth_access_tokens (
    id integer NOT NULL,
    resource_owner_id integer,
    application_id integer,
    token character varying NOT NULL,
    refresh_token character varying,
    expires_in integer,
    revoked_at timestamp without time zone,
    created_at timestamp without time zone NOT NULL,
    scopes character varying
);


--
-- Name: oauth_access_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.oauth_access_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: oauth_access_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.oauth_access_tokens_id_seq OWNED BY public.oauth_access_tokens.id;


--
-- Name: oauth_applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.oauth_applications (
    id integer NOT NULL,
    name character varying NOT NULL,
    uid character varying NOT NULL,
    secret character varying NOT NULL,
    redirect_uri text NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: oauth_applications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.oauth_applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: oauth_applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.oauth_applications_id_seq OWNED BY public.oauth_applications.id;


--
-- Name: objectives; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.objectives (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    help_info character varying,
    section character varying,
    action_url character varying,
    section_placement integer,
    archived boolean DEFAULT false
);


--
-- Name: objectives_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.objectives_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: objectives_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.objectives_id_seq OWNED BY public.objectives.id;


--
-- Name: page_areas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.page_areas (
    id integer NOT NULL,
    name character varying,
    description character varying,
    content text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: page_areas_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.page_areas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: page_areas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.page_areas_id_seq OWNED BY public.page_areas.id;


--
-- Name: partner_contents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partner_contents (
    id integer NOT NULL,
    partner character varying(50),
    content_type character varying(50),
    content_id integer,
    "order" integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: partner_contents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.partner_contents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: partner_contents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.partner_contents_id_seq OWNED BY public.partner_contents.id;


--
-- Name: questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.questions (
    id integer NOT NULL,
    uid character varying NOT NULL,
    data jsonb NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    question_type character varying NOT NULL
);


--
-- Name: questions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.questions_id_seq OWNED BY public.questions.id;


--
-- Name: recommendations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recommendations (
    id integer NOT NULL,
    name character varying NOT NULL,
    activity_id integer NOT NULL,
    unit_template_id integer NOT NULL,
    category integer NOT NULL,
    "order" integer DEFAULT 0 NOT NULL
);


--
-- Name: recommendations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.recommendations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: recommendations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.recommendations_id_seq OWNED BY public.recommendations.id;


--
-- Name: referrals_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.referrals_users (
    id integer NOT NULL,
    user_id integer NOT NULL,
    referred_user_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    activated boolean DEFAULT false
);


--
-- Name: referrals_users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.referrals_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: referrals_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.referrals_users_id_seq OWNED BY public.referrals_users.id;


--
-- Name: referrer_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.referrer_users (
    id integer NOT NULL,
    user_id integer NOT NULL,
    referral_code character varying NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: referrer_users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.referrer_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: referrer_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.referrer_users_id_seq OWNED BY public.referrer_users.id;


--
-- Name: sales_contacts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sales_contacts (
    id integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: sales_contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sales_contacts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sales_contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sales_contacts_id_seq OWNED BY public.sales_contacts.id;


--
-- Name: sales_stage_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sales_stage_types (
    id integer NOT NULL,
    description text,
    name text NOT NULL,
    "order" character varying NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    trigger integer
);


--
-- Name: sales_stage_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sales_stage_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sales_stage_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sales_stage_types_id_seq OWNED BY public.sales_stage_types.id;


--
-- Name: sales_stages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sales_stages (
    id integer NOT NULL,
    user_id integer,
    sales_stage_type_id integer NOT NULL,
    sales_contact_id integer NOT NULL,
    completed_at timestamp without time zone,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: sales_stages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sales_stages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sales_stages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sales_stages_id_seq OWNED BY public.sales_stages.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying NOT NULL
);


--
-- Name: school_subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.school_subscriptions (
    id integer NOT NULL,
    school_id integer,
    subscription_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: school_subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.school_subscriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: school_subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.school_subscriptions_id_seq OWNED BY public.school_subscriptions.id;


--
-- Name: schools; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schools (
    id integer NOT NULL,
    nces_id character varying,
    lea_id character varying,
    leanm character varying,
    name character varying,
    phone character varying,
    mail_street character varying,
    mail_city character varying,
    mail_state character varying,
    mail_zipcode character varying,
    street character varying,
    city character varying,
    state character varying,
    zipcode character varying,
    nces_type_code character varying,
    nces_status_code character varying,
    magnet character varying,
    charter character varying,
    ethnic_group character varying,
    longitude numeric(9,6),
    latitude numeric(9,6),
    ulocal integer,
    fte_classroom_teacher integer,
    lower_grade integer,
    upper_grade integer,
    school_level integer,
    free_lunches integer,
    total_students integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    clever_id character varying,
    ppin character varying,
    authorizer_id integer,
    coordinator_id integer
);


--
-- Name: schools_admins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schools_admins (
    id integer NOT NULL,
    user_id integer,
    school_id integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: schools_admins_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.schools_admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: schools_admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.schools_admins_id_seq OWNED BY public.schools_admins.id;


--
-- Name: schools_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.schools_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: schools_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.schools_id_seq OWNED BY public.schools.id;


--
-- Name: schools_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schools_users (
    school_id integer,
    user_id integer,
    id integer NOT NULL
);


--
-- Name: schools_users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.schools_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: schools_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.schools_users_id_seq OWNED BY public.schools_users.id;


--
-- Name: sections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sections (
    id integer NOT NULL,
    name character varying,
    "position" integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    uid character varying
);


--
-- Name: sections_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sections_id_seq OWNED BY public.sections.id;


--
-- Name: standard_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.standard_categories (
    id integer NOT NULL,
    name character varying,
    uid character varying,
    visible boolean DEFAULT true,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: standard_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.standard_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: standard_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.standard_categories_id_seq OWNED BY public.standard_categories.id;


--
-- Name: standard_levels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.standard_levels (
    id integer NOT NULL,
    name character varying,
    uid character varying,
    "position" integer,
    visible boolean DEFAULT true,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: standard_levels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.standard_levels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: standard_levels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.standard_levels_id_seq OWNED BY public.standard_levels.id;


--
-- Name: standards; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.standards (
    id integer NOT NULL,
    name character varying,
    uid character varying,
    standard_level_id integer,
    standard_category_id integer,
    visible boolean DEFAULT true,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: standards_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.standards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: standards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.standards_id_seq OWNED BY public.standards.id;


--
-- Name: students_classrooms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.students_classrooms (
    id integer NOT NULL,
    student_id integer,
    classroom_id integer,
    visible boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: students_classrooms_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.students_classrooms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: students_classrooms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.students_classrooms_id_seq OWNED BY public.students_classrooms.id;


--
-- Name: subscription_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subscription_types (
    id integer NOT NULL,
    name character varying NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    price integer,
    teacher_alias character varying
);


--
-- Name: subscription_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.subscription_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: subscription_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.subscription_types_id_seq OWNED BY public.subscription_types.id;


--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subscriptions (
    id integer NOT NULL,
    expiration date,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    account_type character varying,
    purchaser_email character varying,
    start_date date,
    subscription_type_id integer,
    purchaser_id integer,
    recurring boolean DEFAULT false,
    de_activated_date date,
    payment_method character varying,
    payment_amount integer
);


--
-- Name: subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.subscriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.subscriptions_id_seq OWNED BY public.subscriptions.id;


--
-- Name: third_party_user_ids; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.third_party_user_ids (
    id integer NOT NULL,
    user_id integer,
    source character varying,
    third_party_id character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: third_party_user_ids_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.third_party_user_ids_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: third_party_user_ids_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.third_party_user_ids_id_seq OWNED BY public.third_party_user_ids.id;


--
-- Name: title_cards; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.title_cards (
    id integer NOT NULL,
    uid character varying NOT NULL,
    content character varying,
    title character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    title_card_type character varying NOT NULL
);


--
-- Name: title_cards_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.title_cards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: title_cards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.title_cards_id_seq OWNED BY public.title_cards.id;


--
-- Name: topic_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.topic_categories (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    uid character varying
);


--
-- Name: topic_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.topic_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: topic_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.topic_categories_id_seq OWNED BY public.topic_categories.id;


--
-- Name: topics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.topics (
    id integer NOT NULL,
    name character varying,
    section_id integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    topic_category_id integer,
    uid character varying
);


--
-- Name: topics_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.topics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: topics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.topics_id_seq OWNED BY public.topics.id;


--
-- Name: unit_activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.unit_activities (
    id integer NOT NULL,
    unit_id integer NOT NULL,
    activity_id integer NOT NULL,
    visible boolean DEFAULT true,
    due_date timestamp without time zone,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    order_number smallint
);


--
-- Name: unit_activities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.unit_activities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: unit_activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.unit_activities_id_seq OWNED BY public.unit_activities.id;


--
-- Name: unit_template_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.unit_template_categories (
    id integer NOT NULL,
    name character varying,
    primary_color character varying,
    secondary_color character varying
);


--
-- Name: unit_template_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.unit_template_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: unit_template_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.unit_template_categories_id_seq OWNED BY public.unit_template_categories.id;


--
-- Name: unit_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.unit_templates (
    id integer NOT NULL,
    name character varying,
    unit_template_category_id integer,
    "time" integer,
    grades text,
    author_id integer,
    flag character varying,
    order_number integer DEFAULT 999999999,
    activity_info text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    image_link character varying
);


--
-- Name: unit_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.unit_templates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: unit_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.unit_templates_id_seq OWNED BY public.unit_templates.id;


--
-- Name: units; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.units (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    visible boolean DEFAULT true NOT NULL,
    user_id integer,
    unit_template_id integer
);


--
-- Name: units_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.units_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: units_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.units_id_seq OWNED BY public.units.id;


--
-- Name: user_milestones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_milestones (
    id integer NOT NULL,
    user_id integer NOT NULL,
    milestone_id integer NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: user_milestones_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_milestones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_milestones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_milestones_id_seq OWNED BY public.user_milestones.id;


--
-- Name: user_subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_subscriptions (
    id integer NOT NULL,
    user_id integer,
    subscription_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: user_subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_subscriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_subscriptions_id_seq OWNED BY public.user_subscriptions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying,
    email character varying,
    password_digest character varying,
    role character varying DEFAULT 'user'::character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    classcode character varying,
    active boolean DEFAULT false,
    username character varying,
    token character varying,
    ip_address inet,
    clever_id character varying,
    signed_up_with_google boolean DEFAULT false,
    send_newsletter boolean DEFAULT false,
    google_id character varying,
    last_sign_in timestamp without time zone,
    last_active timestamp without time zone,
    stripe_customer_id character varying,
    flags character varying[] DEFAULT '{}'::character varying[] NOT NULL,
    time_zone character varying,
    title character varying,
    account_type character varying DEFAULT 'unknown'::character varying,
    post_google_classroom_assignments boolean
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: zipcode_infos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.zipcode_infos (
    id integer NOT NULL,
    zipcode text,
    zipcode_type text,
    city text,
    state text,
    timezone text,
    lat double precision,
    lng double precision,
    _secondary_cities text,
    county text,
    decommissioned boolean,
    estimated_population integer,
    _area_codes text
);


--
-- Name: zipcode_infos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.zipcode_infos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: zipcode_infos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.zipcode_infos_id_seq OWNED BY public.zipcode_infos.id;


--
-- Name: active_activity_sessions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.active_activity_sessions ALTER COLUMN id SET DEFAULT nextval('public.active_activity_sessions_id_seq'::regclass);


--
-- Name: activities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activities ALTER COLUMN id SET DEFAULT nextval('public.activities_id_seq'::regclass);


--
-- Name: activities_unit_templates id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activities_unit_templates ALTER COLUMN id SET DEFAULT nextval('public.activities_unit_templates_id_seq'::regclass);


--
-- Name: activity_categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_categories ALTER COLUMN id SET DEFAULT nextval('public.activity_categories_id_seq'::regclass);


--
-- Name: activity_category_activities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_category_activities ALTER COLUMN id SET DEFAULT nextval('public.activity_category_activities_id_seq'::regclass);


--
-- Name: activity_classifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_classifications ALTER COLUMN id SET DEFAULT nextval('public.activity_classifications_id_seq'::regclass);


--
-- Name: activity_sessions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_sessions ALTER COLUMN id SET DEFAULT nextval('public.activity_sessions_id_seq'::regclass);


--
-- Name: admin_accounts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_accounts ALTER COLUMN id SET DEFAULT nextval('public.admin_accounts_id_seq'::regclass);


--
-- Name: admin_accounts_admins id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_accounts_admins ALTER COLUMN id SET DEFAULT nextval('public.admin_accounts_admins_id_seq'::regclass);


--
-- Name: admin_accounts_teachers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_accounts_teachers ALTER COLUMN id SET DEFAULT nextval('public.admin_accounts_teachers_id_seq'::regclass);


--
-- Name: announcements id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcements ALTER COLUMN id SET DEFAULT nextval('public.announcements_id_seq'::regclass);


--
-- Name: auth_credentials id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_credentials ALTER COLUMN id SET DEFAULT nextval('public.auth_credentials_id_seq'::regclass);


--
-- Name: authors id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors ALTER COLUMN id SET DEFAULT nextval('public.authors_id_seq'::regclass);


--
-- Name: blog_post_user_ratings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_post_user_ratings ALTER COLUMN id SET DEFAULT nextval('public.blog_post_user_ratings_id_seq'::regclass);


--
-- Name: blog_posts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts ALTER COLUMN id SET DEFAULT nextval('public.blog_posts_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: change_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.change_logs ALTER COLUMN id SET DEFAULT nextval('public.change_logs_id_seq'::regclass);


--
-- Name: checkboxes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.checkboxes ALTER COLUMN id SET DEFAULT nextval('public.checkboxes_id_seq'::regclass);


--
-- Name: classroom_activities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classroom_activities ALTER COLUMN id SET DEFAULT nextval('public.classroom_activities_id_seq'::regclass);


--
-- Name: classroom_unit_activity_states id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classroom_unit_activity_states ALTER COLUMN id SET DEFAULT nextval('public.classroom_unit_activity_states_id_seq'::regclass);


--
-- Name: classroom_units id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classroom_units ALTER COLUMN id SET DEFAULT nextval('public.classroom_units_id_seq'::regclass);


--
-- Name: classrooms id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classrooms ALTER COLUMN id SET DEFAULT nextval('public.classrooms_id_seq'::regclass);


--
-- Name: classrooms_teachers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classrooms_teachers ALTER COLUMN id SET DEFAULT nextval('public.classrooms_teachers_id_seq'::regclass);


--
-- Name: comprehension_activities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_activities ALTER COLUMN id SET DEFAULT nextval('public.comprehension_activities_id_seq'::regclass);


--
-- Name: comprehension_passages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_passages ALTER COLUMN id SET DEFAULT nextval('public.comprehension_passages_id_seq'::regclass);


--
-- Name: comprehension_prompts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_prompts ALTER COLUMN id SET DEFAULT nextval('public.comprehension_prompts_id_seq'::regclass);


--
-- Name: comprehension_prompts_rule_sets id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_prompts_rule_sets ALTER COLUMN id SET DEFAULT nextval('public.comprehension_prompts_rule_sets_id_seq'::regclass);


--
-- Name: comprehension_rule_sets id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_rule_sets ALTER COLUMN id SET DEFAULT nextval('public.comprehension_rule_sets_id_seq'::regclass);


--
-- Name: comprehension_rules id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_rules ALTER COLUMN id SET DEFAULT nextval('public.comprehension_rules_id_seq'::regclass);


--
-- Name: comprehension_turking_rounds id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_turking_rounds ALTER COLUMN id SET DEFAULT nextval('public.comprehension_turking_rounds_id_seq'::regclass);


--
-- Name: concept_feedbacks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.concept_feedbacks ALTER COLUMN id SET DEFAULT nextval('public.concept_feedbacks_id_seq'::regclass);


--
-- Name: concept_results id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.concept_results ALTER COLUMN id SET DEFAULT nextval('public.concept_results_id_seq'::regclass);


--
-- Name: concepts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.concepts ALTER COLUMN id SET DEFAULT nextval('public.concepts_id_seq'::regclass);


--
-- Name: coteacher_classroom_invitations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coteacher_classroom_invitations ALTER COLUMN id SET DEFAULT nextval('public.coteacher_classroom_invitations_id_seq'::regclass);


--
-- Name: credit_transactions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credit_transactions ALTER COLUMN id SET DEFAULT nextval('public.credit_transactions_id_seq'::regclass);


--
-- Name: criteria id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.criteria ALTER COLUMN id SET DEFAULT nextval('public.criteria_id_seq'::regclass);


--
-- Name: csv_exports id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.csv_exports ALTER COLUMN id SET DEFAULT nextval('public.csv_exports_id_seq'::regclass);


--
-- Name: districts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts ALTER COLUMN id SET DEFAULT nextval('public.districts_id_seq'::regclass);


--
-- Name: file_uploads id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.file_uploads ALTER COLUMN id SET DEFAULT nextval('public.file_uploads_id_seq'::regclass);


--
-- Name: firebase_apps id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.firebase_apps ALTER COLUMN id SET DEFAULT nextval('public.firebase_apps_id_seq'::regclass);


--
-- Name: images id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images ALTER COLUMN id SET DEFAULT nextval('public.images_id_seq'::regclass);


--
-- Name: invitations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invitations ALTER COLUMN id SET DEFAULT nextval('public.invitations_id_seq'::regclass);


--
-- Name: ip_locations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ip_locations ALTER COLUMN id SET DEFAULT nextval('public.ip_locations_id_seq'::regclass);


--
-- Name: milestones id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.milestones ALTER COLUMN id SET DEFAULT nextval('public.milestones_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: oauth_access_grants id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oauth_access_grants ALTER COLUMN id SET DEFAULT nextval('public.oauth_access_grants_id_seq'::regclass);


--
-- Name: oauth_access_tokens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oauth_access_tokens ALTER COLUMN id SET DEFAULT nextval('public.oauth_access_tokens_id_seq'::regclass);


--
-- Name: oauth_applications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oauth_applications ALTER COLUMN id SET DEFAULT nextval('public.oauth_applications_id_seq'::regclass);


--
-- Name: objectives id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.objectives ALTER COLUMN id SET DEFAULT nextval('public.objectives_id_seq'::regclass);


--
-- Name: page_areas id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_areas ALTER COLUMN id SET DEFAULT nextval('public.page_areas_id_seq'::regclass);


--
-- Name: partner_contents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.partner_contents ALTER COLUMN id SET DEFAULT nextval('public.partner_contents_id_seq'::regclass);


--
-- Name: questions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questions ALTER COLUMN id SET DEFAULT nextval('public.questions_id_seq'::regclass);


--
-- Name: recommendations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recommendations ALTER COLUMN id SET DEFAULT nextval('public.recommendations_id_seq'::regclass);


--
-- Name: referrals_users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referrals_users ALTER COLUMN id SET DEFAULT nextval('public.referrals_users_id_seq'::regclass);


--
-- Name: referrer_users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referrer_users ALTER COLUMN id SET DEFAULT nextval('public.referrer_users_id_seq'::regclass);


--
-- Name: sales_contacts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_contacts ALTER COLUMN id SET DEFAULT nextval('public.sales_contacts_id_seq'::regclass);


--
-- Name: sales_stage_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_stage_types ALTER COLUMN id SET DEFAULT nextval('public.sales_stage_types_id_seq'::regclass);


--
-- Name: sales_stages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_stages ALTER COLUMN id SET DEFAULT nextval('public.sales_stages_id_seq'::regclass);


--
-- Name: school_subscriptions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.school_subscriptions ALTER COLUMN id SET DEFAULT nextval('public.school_subscriptions_id_seq'::regclass);


--
-- Name: schools id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schools ALTER COLUMN id SET DEFAULT nextval('public.schools_id_seq'::regclass);


--
-- Name: schools_admins id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schools_admins ALTER COLUMN id SET DEFAULT nextval('public.schools_admins_id_seq'::regclass);


--
-- Name: schools_users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schools_users ALTER COLUMN id SET DEFAULT nextval('public.schools_users_id_seq'::regclass);


--
-- Name: sections id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sections ALTER COLUMN id SET DEFAULT nextval('public.sections_id_seq'::regclass);


--
-- Name: standard_categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.standard_categories ALTER COLUMN id SET DEFAULT nextval('public.standard_categories_id_seq'::regclass);


--
-- Name: standard_levels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.standard_levels ALTER COLUMN id SET DEFAULT nextval('public.standard_levels_id_seq'::regclass);


--
-- Name: standards id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.standards ALTER COLUMN id SET DEFAULT nextval('public.standards_id_seq'::regclass);


--
-- Name: students_classrooms id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students_classrooms ALTER COLUMN id SET DEFAULT nextval('public.students_classrooms_id_seq'::regclass);


--
-- Name: subscription_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscription_types ALTER COLUMN id SET DEFAULT nextval('public.subscription_types_id_seq'::regclass);


--
-- Name: subscriptions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions ALTER COLUMN id SET DEFAULT nextval('public.subscriptions_id_seq'::regclass);


--
-- Name: third_party_user_ids id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.third_party_user_ids ALTER COLUMN id SET DEFAULT nextval('public.third_party_user_ids_id_seq'::regclass);


--
-- Name: title_cards id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.title_cards ALTER COLUMN id SET DEFAULT nextval('public.title_cards_id_seq'::regclass);


--
-- Name: topic_categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topic_categories ALTER COLUMN id SET DEFAULT nextval('public.topic_categories_id_seq'::regclass);


--
-- Name: topics id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topics ALTER COLUMN id SET DEFAULT nextval('public.topics_id_seq'::regclass);


--
-- Name: unit_activities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unit_activities ALTER COLUMN id SET DEFAULT nextval('public.unit_activities_id_seq'::regclass);


--
-- Name: unit_template_categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unit_template_categories ALTER COLUMN id SET DEFAULT nextval('public.unit_template_categories_id_seq'::regclass);


--
-- Name: unit_templates id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unit_templates ALTER COLUMN id SET DEFAULT nextval('public.unit_templates_id_seq'::regclass);


--
-- Name: units id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.units ALTER COLUMN id SET DEFAULT nextval('public.units_id_seq'::regclass);


--
-- Name: user_milestones id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_milestones ALTER COLUMN id SET DEFAULT nextval('public.user_milestones_id_seq'::regclass);


--
-- Name: user_subscriptions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_subscriptions ALTER COLUMN id SET DEFAULT nextval('public.user_subscriptions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: zipcode_infos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.zipcode_infos ALTER COLUMN id SET DEFAULT nextval('public.zipcode_infos_id_seq'::regclass);


--
-- Name: active_activity_sessions active_activity_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.active_activity_sessions
    ADD CONSTRAINT active_activity_sessions_pkey PRIMARY KEY (id);


--
-- Name: activities activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_pkey PRIMARY KEY (id);


--
-- Name: activities_unit_templates activities_unit_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activities_unit_templates
    ADD CONSTRAINT activities_unit_templates_pkey PRIMARY KEY (id);


--
-- Name: activity_categories activity_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_categories
    ADD CONSTRAINT activity_categories_pkey PRIMARY KEY (id);


--
-- Name: activity_category_activities activity_category_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_category_activities
    ADD CONSTRAINT activity_category_activities_pkey PRIMARY KEY (id);


--
-- Name: activity_classifications activity_classifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_classifications
    ADD CONSTRAINT activity_classifications_pkey PRIMARY KEY (id);


--
-- Name: activity_sessions activity_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_sessions
    ADD CONSTRAINT activity_sessions_pkey PRIMARY KEY (id);


--
-- Name: admin_accounts_admins admin_accounts_admins_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_accounts_admins
    ADD CONSTRAINT admin_accounts_admins_pkey PRIMARY KEY (id);


--
-- Name: admin_accounts admin_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_accounts
    ADD CONSTRAINT admin_accounts_pkey PRIMARY KEY (id);


--
-- Name: admin_accounts_teachers admin_accounts_teachers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_accounts_teachers
    ADD CONSTRAINT admin_accounts_teachers_pkey PRIMARY KEY (id);


--
-- Name: announcements announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_pkey PRIMARY KEY (id);


--
-- Name: auth_credentials auth_credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_credentials
    ADD CONSTRAINT auth_credentials_pkey PRIMARY KEY (id);


--
-- Name: authors authors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT authors_pkey PRIMARY KEY (id);


--
-- Name: blog_post_user_ratings blog_post_user_ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_post_user_ratings
    ADD CONSTRAINT blog_post_user_ratings_pkey PRIMARY KEY (id);


--
-- Name: blog_posts blog_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: change_logs change_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.change_logs
    ADD CONSTRAINT change_logs_pkey PRIMARY KEY (id);


--
-- Name: checkboxes checkboxes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.checkboxes
    ADD CONSTRAINT checkboxes_pkey PRIMARY KEY (id);


--
-- Name: classroom_activities classroom_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classroom_activities
    ADD CONSTRAINT classroom_activities_pkey PRIMARY KEY (id);


--
-- Name: classroom_unit_activity_states classroom_unit_activity_states_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classroom_unit_activity_states
    ADD CONSTRAINT classroom_unit_activity_states_pkey PRIMARY KEY (id);


--
-- Name: classroom_units classroom_units_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classroom_units
    ADD CONSTRAINT classroom_units_pkey PRIMARY KEY (id);


--
-- Name: classrooms classrooms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classrooms
    ADD CONSTRAINT classrooms_pkey PRIMARY KEY (id);


--
-- Name: classrooms_teachers classrooms_teachers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classrooms_teachers
    ADD CONSTRAINT classrooms_teachers_pkey PRIMARY KEY (id);


--
-- Name: comprehension_activities comprehension_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_activities
    ADD CONSTRAINT comprehension_activities_pkey PRIMARY KEY (id);


--
-- Name: comprehension_passages comprehension_passages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_passages
    ADD CONSTRAINT comprehension_passages_pkey PRIMARY KEY (id);


--
-- Name: comprehension_prompts comprehension_prompts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_prompts
    ADD CONSTRAINT comprehension_prompts_pkey PRIMARY KEY (id);


--
-- Name: comprehension_prompts_rule_sets comprehension_prompts_rule_sets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_prompts_rule_sets
    ADD CONSTRAINT comprehension_prompts_rule_sets_pkey PRIMARY KEY (id);


--
-- Name: comprehension_rule_sets comprehension_rule_sets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_rule_sets
    ADD CONSTRAINT comprehension_rule_sets_pkey PRIMARY KEY (id);


--
-- Name: comprehension_rules comprehension_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_rules
    ADD CONSTRAINT comprehension_rules_pkey PRIMARY KEY (id);


--
-- Name: comprehension_turking_rounds comprehension_turking_rounds_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_turking_rounds
    ADD CONSTRAINT comprehension_turking_rounds_pkey PRIMARY KEY (id);


--
-- Name: concept_feedbacks concept_feedbacks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.concept_feedbacks
    ADD CONSTRAINT concept_feedbacks_pkey PRIMARY KEY (id);


--
-- Name: concept_results concept_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.concept_results
    ADD CONSTRAINT concept_results_pkey PRIMARY KEY (id);


--
-- Name: concepts concepts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.concepts
    ADD CONSTRAINT concepts_pkey PRIMARY KEY (id);


--
-- Name: coteacher_classroom_invitations coteacher_classroom_invitations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coteacher_classroom_invitations
    ADD CONSTRAINT coteacher_classroom_invitations_pkey PRIMARY KEY (id);


--
-- Name: credit_transactions credit_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credit_transactions
    ADD CONSTRAINT credit_transactions_pkey PRIMARY KEY (id);


--
-- Name: criteria criteria_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.criteria
    ADD CONSTRAINT criteria_pkey PRIMARY KEY (id);


--
-- Name: csv_exports csv_exports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.csv_exports
    ADD CONSTRAINT csv_exports_pkey PRIMARY KEY (id);


--
-- Name: districts districts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts
    ADD CONSTRAINT districts_pkey PRIMARY KEY (id);


--
-- Name: file_uploads file_uploads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.file_uploads
    ADD CONSTRAINT file_uploads_pkey PRIMARY KEY (id);


--
-- Name: firebase_apps firebase_apps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.firebase_apps
    ADD CONSTRAINT firebase_apps_pkey PRIMARY KEY (id);


--
-- Name: images images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);


--
-- Name: invitations invitations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invitations
    ADD CONSTRAINT invitations_pkey PRIMARY KEY (id);


--
-- Name: ip_locations ip_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ip_locations
    ADD CONSTRAINT ip_locations_pkey PRIMARY KEY (id);


--
-- Name: milestones milestones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.milestones
    ADD CONSTRAINT milestones_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: oauth_access_grants oauth_access_grants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oauth_access_grants
    ADD CONSTRAINT oauth_access_grants_pkey PRIMARY KEY (id);


--
-- Name: oauth_access_tokens oauth_access_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oauth_access_tokens
    ADD CONSTRAINT oauth_access_tokens_pkey PRIMARY KEY (id);


--
-- Name: oauth_applications oauth_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oauth_applications
    ADD CONSTRAINT oauth_applications_pkey PRIMARY KEY (id);


--
-- Name: objectives objectives_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.objectives
    ADD CONSTRAINT objectives_pkey PRIMARY KEY (id);


--
-- Name: page_areas page_areas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_areas
    ADD CONSTRAINT page_areas_pkey PRIMARY KEY (id);


--
-- Name: partner_contents partner_contents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.partner_contents
    ADD CONSTRAINT partner_contents_pkey PRIMARY KEY (id);


--
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
-- Name: recommendations recommendations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recommendations
    ADD CONSTRAINT recommendations_pkey PRIMARY KEY (id);


--
-- Name: referrals_users referrals_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referrals_users
    ADD CONSTRAINT referrals_users_pkey PRIMARY KEY (id);


--
-- Name: referrer_users referrer_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referrer_users
    ADD CONSTRAINT referrer_users_pkey PRIMARY KEY (id);


--
-- Name: sales_contacts sales_contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_contacts
    ADD CONSTRAINT sales_contacts_pkey PRIMARY KEY (id);


--
-- Name: sales_stage_types sales_stage_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_stage_types
    ADD CONSTRAINT sales_stage_types_pkey PRIMARY KEY (id);


--
-- Name: sales_stages sales_stages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_stages
    ADD CONSTRAINT sales_stages_pkey PRIMARY KEY (id);


--
-- Name: school_subscriptions school_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.school_subscriptions
    ADD CONSTRAINT school_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: schools_admins schools_admins_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schools_admins
    ADD CONSTRAINT schools_admins_pkey PRIMARY KEY (id);


--
-- Name: schools schools_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_pkey PRIMARY KEY (id);


--
-- Name: schools_users schools_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schools_users
    ADD CONSTRAINT schools_users_pkey PRIMARY KEY (id);


--
-- Name: sections sections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_pkey PRIMARY KEY (id);


--
-- Name: standard_categories standard_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.standard_categories
    ADD CONSTRAINT standard_categories_pkey PRIMARY KEY (id);


--
-- Name: standard_levels standard_levels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.standard_levels
    ADD CONSTRAINT standard_levels_pkey PRIMARY KEY (id);


--
-- Name: standards standards_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.standards
    ADD CONSTRAINT standards_pkey PRIMARY KEY (id);


--
-- Name: students_classrooms students_classrooms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students_classrooms
    ADD CONSTRAINT students_classrooms_pkey PRIMARY KEY (id);


--
-- Name: subscription_types subscription_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscription_types
    ADD CONSTRAINT subscription_types_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: third_party_user_ids third_party_user_ids_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.third_party_user_ids
    ADD CONSTRAINT third_party_user_ids_pkey PRIMARY KEY (id);


--
-- Name: title_cards title_cards_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.title_cards
    ADD CONSTRAINT title_cards_pkey PRIMARY KEY (id);


--
-- Name: topic_categories topic_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topic_categories
    ADD CONSTRAINT topic_categories_pkey PRIMARY KEY (id);


--
-- Name: topics topics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topics
    ADD CONSTRAINT topics_pkey PRIMARY KEY (id);


--
-- Name: unit_activities unit_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unit_activities
    ADD CONSTRAINT unit_activities_pkey PRIMARY KEY (id);


--
-- Name: unit_template_categories unit_template_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unit_template_categories
    ADD CONSTRAINT unit_template_categories_pkey PRIMARY KEY (id);


--
-- Name: unit_templates unit_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unit_templates
    ADD CONSTRAINT unit_templates_pkey PRIMARY KEY (id);


--
-- Name: units units_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_pkey PRIMARY KEY (id);


--
-- Name: user_milestones user_milestones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_milestones
    ADD CONSTRAINT user_milestones_pkey PRIMARY KEY (id);


--
-- Name: user_subscriptions user_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_subscriptions
    ADD CONSTRAINT user_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: zipcode_infos zipcode_infos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.zipcode_infos
    ADD CONSTRAINT zipcode_infos_pkey PRIMARY KEY (id);


--
-- Name: aut; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX aut ON public.activities_unit_templates USING btree (activity_id, unit_template_id);


--
-- Name: classroom_invitee_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX classroom_invitee_index ON public.coteacher_classroom_invitations USING btree (invitation_id, classroom_id);


--
-- Name: email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX email_idx ON public.users USING gin (email public.gin_trgm_ops);


--
-- Name: index_act_category_acts_on_act_id_and_act_cat_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_act_category_acts_on_act_id_and_act_cat_id ON public.activity_category_activities USING btree (activity_id, activity_category_id);


--
-- Name: index_active_activity_sessions_on_uid; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_active_activity_sessions_on_uid ON public.active_activity_sessions USING btree (uid);


--
-- Name: index_activities_on_activity_classification_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_activities_on_activity_classification_id ON public.activities USING btree (activity_classification_id);


--
-- Name: index_activities_on_topic_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_activities_on_topic_id ON public.activities USING btree (topic_id);


--
-- Name: index_activities_on_uid; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_activities_on_uid ON public.activities USING btree (uid);


--
-- Name: index_activity_classifications_on_uid; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_activity_classifications_on_uid ON public.activity_classifications USING btree (uid);


--
-- Name: index_activity_sessions_on_activity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_activity_sessions_on_activity_id ON public.activity_sessions USING btree (activity_id);


--
-- Name: index_activity_sessions_on_classroom_activity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_activity_sessions_on_classroom_activity_id ON public.activity_sessions USING btree (classroom_activity_id);


--
-- Name: index_activity_sessions_on_classroom_unit_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_activity_sessions_on_classroom_unit_id ON public.activity_sessions USING btree (classroom_unit_id);


--
-- Name: index_activity_sessions_on_completed_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_activity_sessions_on_completed_at ON public.activity_sessions USING btree (completed_at);


--
-- Name: index_activity_sessions_on_pairing_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_activity_sessions_on_pairing_id ON public.activity_sessions USING btree (pairing_id);


--
-- Name: index_activity_sessions_on_started_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_activity_sessions_on_started_at ON public.activity_sessions USING btree (started_at);


--
-- Name: index_activity_sessions_on_state; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_activity_sessions_on_state ON public.activity_sessions USING btree (state);


--
-- Name: index_activity_sessions_on_uid; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_activity_sessions_on_uid ON public.activity_sessions USING btree (uid);


--
-- Name: index_activity_sessions_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_activity_sessions_on_user_id ON public.activity_sessions USING btree (user_id);


--
-- Name: index_admin_accounts_admins_on_admin_account_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_admin_accounts_admins_on_admin_account_id ON public.admin_accounts_admins USING btree (admin_account_id);


--
-- Name: index_admin_accounts_admins_on_admin_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_admin_accounts_admins_on_admin_id ON public.admin_accounts_admins USING btree (admin_id);


--
-- Name: index_admin_accounts_teachers_on_admin_account_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_admin_accounts_teachers_on_admin_account_id ON public.admin_accounts_teachers USING btree (admin_account_id);


--
-- Name: index_admin_accounts_teachers_on_teacher_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_admin_accounts_teachers_on_teacher_id ON public.admin_accounts_teachers USING btree (teacher_id);


--
-- Name: index_announcements_on_start_and_end; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_announcements_on_start_and_end ON public.announcements USING btree (start, "end" DESC);


--
-- Name: index_auth_credentials_on_access_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_auth_credentials_on_access_token ON public.auth_credentials USING btree (access_token);


--
-- Name: index_auth_credentials_on_provider; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_auth_credentials_on_provider ON public.auth_credentials USING btree (provider);


--
-- Name: index_auth_credentials_on_refresh_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_auth_credentials_on_refresh_token ON public.auth_credentials USING btree (refresh_token);


--
-- Name: index_auth_credentials_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_auth_credentials_on_user_id ON public.auth_credentials USING btree (user_id);


--
-- Name: index_blog_posts_on_author_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_blog_posts_on_author_id ON public.blog_posts USING btree (author_id);


--
-- Name: index_blog_posts_on_read_count; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_blog_posts_on_read_count ON public.blog_posts USING btree (read_count);


--
-- Name: index_blog_posts_on_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_blog_posts_on_slug ON public.blog_posts USING btree (slug);


--
-- Name: index_blog_posts_on_title; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_blog_posts_on_title ON public.blog_posts USING btree (title);


--
-- Name: index_blog_posts_on_topic; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_blog_posts_on_topic ON public.blog_posts USING btree (topic);


--
-- Name: index_change_logs_on_changed_record_type_and_changed_record_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_change_logs_on_changed_record_type_and_changed_record_id ON public.change_logs USING btree (changed_record_type, changed_record_id);


--
-- Name: index_change_logs_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_change_logs_on_user_id ON public.change_logs USING btree (user_id);


--
-- Name: index_checkboxes_on_user_id_and_objective_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_checkboxes_on_user_id_and_objective_id ON public.checkboxes USING btree (user_id, objective_id);


--
-- Name: index_classroom_activities_on_activity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_classroom_activities_on_activity_id ON public.classroom_activities USING btree (activity_id);


--
-- Name: index_classroom_activities_on_classroom_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_classroom_activities_on_classroom_id ON public.classroom_activities USING btree (classroom_id);


--
-- Name: index_classroom_activities_on_classroom_id_and_pinned; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_classroom_activities_on_classroom_id_and_pinned ON public.classroom_activities USING btree (classroom_id, pinned) WHERE (pinned = true);


--
-- Name: index_classroom_activities_on_unit_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_classroom_activities_on_unit_id ON public.classroom_activities USING btree (unit_id);


--
-- Name: index_classroom_activities_on_updated_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_classroom_activities_on_updated_at ON public.classroom_activities USING btree (updated_at);


--
-- Name: index_classroom_unit_activity_states_on_classroom_unit_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_classroom_unit_activity_states_on_classroom_unit_id ON public.classroom_unit_activity_states USING btree (classroom_unit_id);


--
-- Name: index_classroom_unit_activity_states_on_unit_activity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_classroom_unit_activity_states_on_unit_activity_id ON public.classroom_unit_activity_states USING btree (unit_activity_id);


--
-- Name: index_classroom_units_on_classroom_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_classroom_units_on_classroom_id ON public.classroom_units USING btree (classroom_id);


--
-- Name: index_classroom_units_on_unit_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_classroom_units_on_unit_id ON public.classroom_units USING btree (unit_id);


--
-- Name: index_classroom_units_on_unit_id_and_classroom_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_classroom_units_on_unit_id_and_classroom_id ON public.classroom_units USING btree (unit_id, classroom_id);


--
-- Name: index_classrooms_on_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_classrooms_on_code ON public.classrooms USING btree (code);


--
-- Name: index_classrooms_on_grade; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_classrooms_on_grade ON public.classrooms USING btree (grade);


--
-- Name: index_classrooms_on_grade_level; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_classrooms_on_grade_level ON public.classrooms USING btree (grade_level);


--
-- Name: index_classrooms_on_teacher_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_classrooms_on_teacher_id ON public.classrooms USING btree (teacher_id);


--
-- Name: index_classrooms_teachers_on_classroom_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_classrooms_teachers_on_classroom_id ON public.classrooms_teachers USING btree (classroom_id);


--
-- Name: index_classrooms_teachers_on_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_classrooms_teachers_on_role ON public.classrooms_teachers USING btree (role);


--
-- Name: index_classrooms_teachers_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_classrooms_teachers_on_user_id ON public.classrooms_teachers USING btree (user_id);


--
-- Name: index_comprehension_activities_on_parent_activity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_comprehension_activities_on_parent_activity_id ON public.comprehension_activities USING btree (parent_activity_id);


--
-- Name: index_comprehension_passages_on_activity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_comprehension_passages_on_activity_id ON public.comprehension_passages USING btree (activity_id);


--
-- Name: index_comprehension_prompts_on_activity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_comprehension_prompts_on_activity_id ON public.comprehension_prompts USING btree (activity_id);


--
-- Name: index_comprehension_prompts_rule_sets_on_prompt_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_comprehension_prompts_rule_sets_on_prompt_id ON public.comprehension_prompts_rule_sets USING btree (prompt_id);


--
-- Name: index_comprehension_prompts_rule_sets_on_rule_set_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_comprehension_prompts_rule_sets_on_rule_set_id ON public.comprehension_prompts_rule_sets USING btree (rule_set_id);


--
-- Name: index_comprehension_rule_sets_on_activity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_comprehension_rule_sets_on_activity_id ON public.comprehension_rule_sets USING btree (activity_id);


--
-- Name: index_comprehension_rule_sets_on_prompt_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_comprehension_rule_sets_on_prompt_id ON public.comprehension_rule_sets USING btree (prompt_id);


--
-- Name: index_comprehension_rules_on_rule_set_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_comprehension_rules_on_rule_set_id ON public.comprehension_rules USING btree (rule_set_id);


--
-- Name: index_comprehension_turking_rounds_on_activity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_comprehension_turking_rounds_on_activity_id ON public.comprehension_turking_rounds USING btree (activity_id);


--
-- Name: index_comprehension_turking_rounds_on_uuid; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_comprehension_turking_rounds_on_uuid ON public.comprehension_turking_rounds USING btree (uuid);


--
-- Name: index_concept_feedbacks_on_activity_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_concept_feedbacks_on_activity_type ON public.concept_feedbacks USING btree (activity_type);


--
-- Name: index_concept_feedbacks_on_uid_and_activity_type; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_concept_feedbacks_on_uid_and_activity_type ON public.concept_feedbacks USING btree (uid, activity_type);


--
-- Name: index_concept_results_on_activity_classification_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_concept_results_on_activity_classification_id ON public.concept_results USING btree (activity_classification_id);


--
-- Name: index_concept_results_on_activity_session_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_concept_results_on_activity_session_id ON public.concept_results USING btree (activity_session_id);


--
-- Name: index_concept_results_on_concept_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_concept_results_on_concept_id ON public.concept_results USING btree (concept_id);


--
-- Name: index_concept_results_on_question_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_concept_results_on_question_type ON public.concept_results USING btree (question_type);


--
-- Name: index_coteacher_classroom_invitations_on_classroom_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_coteacher_classroom_invitations_on_classroom_id ON public.coteacher_classroom_invitations USING btree (classroom_id);


--
-- Name: index_coteacher_classroom_invitations_on_invitation_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_coteacher_classroom_invitations_on_invitation_id ON public.coteacher_classroom_invitations USING btree (invitation_id);


--
-- Name: index_credit_transactions_on_source_type_and_source_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_credit_transactions_on_source_type_and_source_id ON public.credit_transactions USING btree (source_type, source_id);


--
-- Name: index_credit_transactions_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_credit_transactions_on_user_id ON public.credit_transactions USING btree (user_id);


--
-- Name: index_criteria_on_concept_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_criteria_on_concept_id ON public.criteria USING btree (concept_id);


--
-- Name: index_criteria_on_recommendation_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_criteria_on_recommendation_id ON public.criteria USING btree (recommendation_id);


--
-- Name: index_districts_users_on_district_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_districts_users_on_district_id ON public.districts_users USING btree (district_id);


--
-- Name: index_districts_users_on_district_id_and_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_districts_users_on_district_id_and_user_id ON public.districts_users USING btree (district_id, user_id);


--
-- Name: index_districts_users_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_districts_users_on_user_id ON public.districts_users USING btree (user_id);


--
-- Name: index_invitations_on_invitee_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_invitations_on_invitee_email ON public.invitations USING btree (invitee_email);


--
-- Name: index_invitations_on_inviter_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_invitations_on_inviter_id ON public.invitations USING btree (inviter_id);


--
-- Name: index_ip_locations_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ip_locations_on_user_id ON public.ip_locations USING btree (user_id);


--
-- Name: index_ip_locations_on_zip; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ip_locations_on_zip ON public.ip_locations USING btree (zip);


--
-- Name: index_milestones_on_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_milestones_on_name ON public.milestones USING btree (name);


--
-- Name: index_notifications_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_notifications_on_user_id ON public.notifications USING btree (user_id);


--
-- Name: index_oauth_access_grants_on_token; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_oauth_access_grants_on_token ON public.oauth_access_grants USING btree (token);


--
-- Name: index_oauth_access_tokens_on_refresh_token; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_oauth_access_tokens_on_refresh_token ON public.oauth_access_tokens USING btree (refresh_token);


--
-- Name: index_oauth_access_tokens_on_resource_owner_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_oauth_access_tokens_on_resource_owner_id ON public.oauth_access_tokens USING btree (resource_owner_id);


--
-- Name: index_oauth_access_tokens_on_token; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_oauth_access_tokens_on_token ON public.oauth_access_tokens USING btree (token);


--
-- Name: index_oauth_applications_on_uid; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_oauth_applications_on_uid ON public.oauth_applications USING btree (uid);


--
-- Name: index_partner_contents_on_content_type_and_content_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_partner_contents_on_content_type_and_content_id ON public.partner_contents USING btree (content_type, content_id);


--
-- Name: index_partner_contents_on_partner; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_partner_contents_on_partner ON public.partner_contents USING btree (partner);


--
-- Name: index_questions_on_question_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_questions_on_question_type ON public.questions USING btree (question_type);


--
-- Name: index_questions_on_uid; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_questions_on_uid ON public.questions USING btree (uid);


--
-- Name: index_recommendations_on_activity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_recommendations_on_activity_id ON public.recommendations USING btree (activity_id);


--
-- Name: index_recommendations_on_unit_template_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_recommendations_on_unit_template_id ON public.recommendations USING btree (unit_template_id);


--
-- Name: index_referrals_users_on_activated; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_referrals_users_on_activated ON public.referrals_users USING btree (activated);


--
-- Name: index_referrals_users_on_referred_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_referrals_users_on_referred_user_id ON public.referrals_users USING btree (referred_user_id);


--
-- Name: index_referrals_users_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_referrals_users_on_user_id ON public.referrals_users USING btree (user_id);


--
-- Name: index_referrer_users_on_referral_code; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_referrer_users_on_referral_code ON public.referrer_users USING btree (referral_code);


--
-- Name: index_referrer_users_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_referrer_users_on_user_id ON public.referrer_users USING btree (user_id);


--
-- Name: index_sales_contacts_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_sales_contacts_on_user_id ON public.sales_contacts USING btree (user_id);


--
-- Name: index_sales_stage_types_on_name_and_order; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_sales_stage_types_on_name_and_order ON public.sales_stage_types USING btree (name, "order");


--
-- Name: index_sales_stages_on_sales_contact_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_sales_stages_on_sales_contact_id ON public.sales_stages USING btree (sales_contact_id);


--
-- Name: index_sales_stages_on_sales_stage_type_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_sales_stages_on_sales_stage_type_id ON public.sales_stages USING btree (sales_stage_type_id);


--
-- Name: index_sales_stages_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_sales_stages_on_user_id ON public.sales_stages USING btree (user_id);


--
-- Name: index_school_subscriptions_on_school_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_school_subscriptions_on_school_id ON public.school_subscriptions USING btree (school_id);


--
-- Name: index_school_subscriptions_on_subscription_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_school_subscriptions_on_subscription_id ON public.school_subscriptions USING btree (subscription_id);


--
-- Name: index_schools_admins_on_school_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_schools_admins_on_school_id ON public.schools_admins USING btree (school_id);


--
-- Name: index_schools_admins_on_school_id_and_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_schools_admins_on_school_id_and_user_id ON public.schools_admins USING btree (school_id, user_id);


--
-- Name: index_schools_admins_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_schools_admins_on_user_id ON public.schools_admins USING btree (user_id);


--
-- Name: index_schools_on_mail_zipcode; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_schools_on_mail_zipcode ON public.schools USING btree (mail_zipcode);


--
-- Name: index_schools_on_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_schools_on_name ON public.schools USING btree (name);


--
-- Name: index_schools_on_nces_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_schools_on_nces_id ON public.schools USING btree (nces_id);


--
-- Name: index_schools_on_state; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_schools_on_state ON public.schools USING btree (state);


--
-- Name: index_schools_on_zipcode; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_schools_on_zipcode ON public.schools USING btree (zipcode);


--
-- Name: index_schools_users_on_school_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_schools_users_on_school_id ON public.schools_users USING btree (school_id);


--
-- Name: index_schools_users_on_school_id_and_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_schools_users_on_school_id_and_user_id ON public.schools_users USING btree (school_id, user_id);


--
-- Name: index_schools_users_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_schools_users_on_user_id ON public.schools_users USING btree (user_id);


--
-- Name: index_students_classrooms_on_classroom_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_students_classrooms_on_classroom_id ON public.students_classrooms USING btree (classroom_id);


--
-- Name: index_students_classrooms_on_student_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_students_classrooms_on_student_id ON public.students_classrooms USING btree (student_id);


--
-- Name: index_students_classrooms_on_student_id_and_classroom_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_students_classrooms_on_student_id_and_classroom_id ON public.students_classrooms USING btree (student_id, classroom_id);


--
-- Name: index_subscription_types_on_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_subscription_types_on_name ON public.subscription_types USING btree (name);


--
-- Name: index_subscriptions_on_de_activated_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_subscriptions_on_de_activated_date ON public.subscriptions USING btree (de_activated_date);


--
-- Name: index_subscriptions_on_purchaser_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_subscriptions_on_purchaser_email ON public.subscriptions USING btree (purchaser_email);


--
-- Name: index_subscriptions_on_purchaser_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_subscriptions_on_purchaser_id ON public.subscriptions USING btree (purchaser_id);


--
-- Name: index_subscriptions_on_recurring; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_subscriptions_on_recurring ON public.subscriptions USING btree (recurring);


--
-- Name: index_subscriptions_on_start_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_subscriptions_on_start_date ON public.subscriptions USING btree (start_date);


--
-- Name: index_third_party_user_ids_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_third_party_user_ids_on_user_id ON public.third_party_user_ids USING btree (user_id);


--
-- Name: index_title_cards_on_title_card_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_title_cards_on_title_card_type ON public.title_cards USING btree (title_card_type);


--
-- Name: index_title_cards_on_uid; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_title_cards_on_uid ON public.title_cards USING btree (uid);


--
-- Name: index_topic_categories_on_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_topic_categories_on_name ON public.topic_categories USING btree (name);


--
-- Name: index_topics_on_topic_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_topics_on_topic_category_id ON public.topics USING btree (topic_category_id);


--
-- Name: index_unit_activities_on_activity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_unit_activities_on_activity_id ON public.unit_activities USING btree (activity_id);


--
-- Name: index_unit_activities_on_unit_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_unit_activities_on_unit_id ON public.unit_activities USING btree (unit_id);


--
-- Name: index_unit_activities_on_unit_id_and_activity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_unit_activities_on_unit_id_and_activity_id ON public.unit_activities USING btree (unit_id, activity_id);


--
-- Name: index_unit_templates_on_activity_info; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_unit_templates_on_activity_info ON public.unit_templates USING btree (activity_info);


--
-- Name: index_unit_templates_on_author_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_unit_templates_on_author_id ON public.unit_templates USING btree (author_id);


--
-- Name: index_unit_templates_on_unit_template_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_unit_templates_on_unit_template_category_id ON public.unit_templates USING btree (unit_template_category_id);


--
-- Name: index_units_on_unit_template_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_units_on_unit_template_id ON public.units USING btree (unit_template_id);


--
-- Name: index_units_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_units_on_user_id ON public.units USING btree (user_id);


--
-- Name: index_user_milestones_on_milestone_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_user_milestones_on_milestone_id ON public.user_milestones USING btree (milestone_id);


--
-- Name: index_user_milestones_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_user_milestones_on_user_id ON public.user_milestones USING btree (user_id);


--
-- Name: index_user_milestones_on_user_id_and_milestone_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_user_milestones_on_user_id_and_milestone_id ON public.user_milestones USING btree (user_id, milestone_id);


--
-- Name: index_user_subscriptions_on_subscription_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_user_subscriptions_on_subscription_id ON public.user_subscriptions USING btree (subscription_id);


--
-- Name: index_user_subscriptions_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_user_subscriptions_on_user_id ON public.user_subscriptions USING btree (user_id);


--
-- Name: index_users_on_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_active ON public.users USING btree (active);


--
-- Name: index_users_on_classcode; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_classcode ON public.users USING btree (classcode);


--
-- Name: index_users_on_clever_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_clever_id ON public.users USING btree (clever_id);


--
-- Name: index_users_on_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_email ON public.users USING btree (email);


--
-- Name: index_users_on_flags; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_flags ON public.users USING btree (flags);


--
-- Name: index_users_on_google_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_google_id ON public.users USING btree (google_id);


--
-- Name: index_users_on_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_role ON public.users USING btree (role);


--
-- Name: index_users_on_stripe_customer_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_stripe_customer_id ON public.users USING btree (stripe_customer_id);


--
-- Name: index_users_on_time_zone; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_time_zone ON public.users USING btree (time_zone);


--
-- Name: index_users_on_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_token ON public.users USING btree (token);


--
-- Name: index_users_on_username; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_username ON public.users USING btree (username);


--
-- Name: index_zipcode_infos_on_zipcode; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_zipcode_infos_on_zipcode ON public.zipcode_infos USING btree (zipcode);


--
-- Name: name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX name_idx ON public.users USING gin (name public.gin_trgm_ops);


--
-- Name: tsv_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tsv_idx ON public.blog_posts USING gin (tsv);


--
-- Name: unique_classroom_and_activity_for_cua_state; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_classroom_and_activity_for_cua_state ON public.classroom_unit_activity_states USING btree (classroom_unit_id, unit_activity_id);


--
-- Name: unique_classroom_and_user_ids_on_classrooms_teachers; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_classroom_and_user_ids_on_classrooms_teachers ON public.classrooms_teachers USING btree (user_id, classroom_id);


--
-- Name: unique_index_schools_on_nces_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_index_schools_on_nces_id ON public.schools USING btree (nces_id) WHERE ((nces_id)::text <> ''::text);


--
-- Name: unique_index_schools_on_ppin; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_index_schools_on_ppin ON public.schools USING btree (ppin) WHERE ((ppin)::text <> ''::text);


--
-- Name: unique_index_users_on_clever_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_index_users_on_clever_id ON public.users USING btree (clever_id) WHERE ((clever_id IS NOT NULL) AND ((clever_id)::text <> ''::text) AND ((id > 5593155) OR ((role)::text = 'student'::text)));


--
-- Name: unique_index_users_on_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_index_users_on_email ON public.users USING btree (email) WHERE ((id > 1641954) AND (email IS NOT NULL) AND ((email)::text <> ''::text));


--
-- Name: unique_index_users_on_google_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_index_users_on_google_id ON public.users USING btree (google_id) WHERE ((id > 1641954) AND (google_id IS NOT NULL) AND ((google_id)::text <> ''::text));


--
-- Name: unique_index_users_on_username; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_index_users_on_username ON public.users USING btree (username) WHERE ((id > 1641954) AND (username IS NOT NULL) AND ((username)::text <> ''::text));


--
-- Name: unique_schema_migrations; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_schema_migrations ON public.schema_migrations USING btree (version);


--
-- Name: username_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX username_idx ON public.users USING gin (username public.gin_trgm_ops);


--
-- Name: users_to_tsvector_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_to_tsvector_idx ON public.users USING gin (to_tsvector('english'::regconfig, (name)::text));


--
-- Name: users_to_tsvector_idx1; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_to_tsvector_idx1 ON public.users USING gin (to_tsvector('english'::regconfig, (email)::text));


--
-- Name: users_to_tsvector_idx2; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_to_tsvector_idx2 ON public.users USING gin (to_tsvector('english'::regconfig, (role)::text));


--
-- Name: users_to_tsvector_idx3; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_to_tsvector_idx3 ON public.users USING gin (to_tsvector('english'::regconfig, (classcode)::text));


--
-- Name: users_to_tsvector_idx4; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_to_tsvector_idx4 ON public.users USING gin (to_tsvector('english'::regconfig, (username)::text));


--
-- Name: users_to_tsvector_idx5; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_to_tsvector_idx5 ON public.users USING gin (to_tsvector('english'::regconfig, split_part((ip_address)::text, '/'::text, 1)));


--
-- Name: uta; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX uta ON public.activities_unit_templates USING btree (unit_template_id, activity_id);


--
-- Name: blog_posts tsvectorupdate; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE ON public.blog_posts FOR EACH ROW EXECUTE PROCEDURE public.blog_posts_search_trigger();


--
-- Name: units fk_rails_0b3b28b65f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT fk_rails_0b3b28b65f FOREIGN KEY (unit_template_id) REFERENCES public.unit_templates(id);


--
-- Name: change_logs fk_rails_1a847a1740; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.change_logs
    ADD CONSTRAINT fk_rails_1a847a1740 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: classroom_units fk_rails_3e1ff09783; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classroom_units
    ADD CONSTRAINT fk_rails_3e1ff09783 FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- Name: sales_stages fk_rails_41082adef9; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_stages
    ADD CONSTRAINT fk_rails_41082adef9 FOREIGN KEY (sales_contact_id) REFERENCES public.sales_contacts(id);


--
-- Name: classroom_unit_activity_states fk_rails_457a11a3eb; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classroom_unit_activity_states
    ADD CONSTRAINT fk_rails_457a11a3eb FOREIGN KEY (classroom_unit_id) REFERENCES public.classroom_units(id);


--
-- Name: unit_activities fk_rails_48bcb0b8a0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unit_activities
    ADD CONSTRAINT fk_rails_48bcb0b8a0 FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- Name: criteria fk_rails_63b994bcda; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.criteria
    ADD CONSTRAINT fk_rails_63b994bcda FOREIGN KEY (recommendation_id) REFERENCES public.recommendations(id);


--
-- Name: recommendations fk_rails_6745e4bc86; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recommendations
    ADD CONSTRAINT fk_rails_6745e4bc86 FOREIGN KEY (unit_template_id) REFERENCES public.unit_templates(id);


--
-- Name: standards fk_rails_7c2e427970; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.standards
    ADD CONSTRAINT fk_rails_7c2e427970 FOREIGN KEY (standard_level_id) REFERENCES public.standard_levels(id);


--
-- Name: activities fk_rails_8b159cf902; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT fk_rails_8b159cf902 FOREIGN KEY (standard_id) REFERENCES public.standards(id);


--
-- Name: classroom_units fk_rails_a3c514fc6d; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classroom_units
    ADD CONSTRAINT fk_rails_a3c514fc6d FOREIGN KEY (classroom_id) REFERENCES public.classrooms(id);


--
-- Name: sales_stages fk_rails_a8025d2621; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_stages
    ADD CONSTRAINT fk_rails_a8025d2621 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: third_party_user_ids fk_rails_aca4adc66a; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.third_party_user_ids
    ADD CONSTRAINT fk_rails_aca4adc66a FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: criteria fk_rails_ada79930c6; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.criteria
    ADD CONSTRAINT fk_rails_ada79930c6 FOREIGN KEY (concept_id) REFERENCES public.concepts(id);


--
-- Name: notifications fk_rails_b080fb4855; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_rails_b080fb4855 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: unit_activities fk_rails_b921d87b04; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unit_activities
    ADD CONSTRAINT fk_rails_b921d87b04 FOREIGN KEY (activity_id) REFERENCES public.activities(id);


--
-- Name: classroom_unit_activity_states fk_rails_bab346c597; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classroom_unit_activity_states
    ADD CONSTRAINT fk_rails_bab346c597 FOREIGN KEY (unit_activity_id) REFERENCES public.unit_activities(id);


--
-- Name: standards fk_rails_c84477fd6e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.standards
    ADD CONSTRAINT fk_rails_c84477fd6e FOREIGN KEY (standard_category_id) REFERENCES public.standard_categories(id);


--
-- Name: concept_results fk_rails_cebe4a6023; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.concept_results
    ADD CONSTRAINT fk_rails_cebe4a6023 FOREIGN KEY (activity_classification_id) REFERENCES public.activity_classifications(id);


--
-- Name: sales_contacts fk_rails_d6738e130a; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_contacts
    ADD CONSTRAINT fk_rails_d6738e130a FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: recommendations fk_rails_dc326309ed; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recommendations
    ADD CONSTRAINT fk_rails_dc326309ed FOREIGN KEY (activity_id) REFERENCES public.activities(id);


--
-- Name: sales_stages fk_rails_e5da9d6c2d; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_stages
    ADD CONSTRAINT fk_rails_e5da9d6c2d FOREIGN KEY (sales_stage_type_id) REFERENCES public.sales_stage_types(id);


--
-- Name: auth_credentials fk_rails_f92a275310; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_credentials
    ADD CONSTRAINT fk_rails_f92a275310 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

SET search_path TO "$user", public;

INSERT INTO schema_migrations (version) VALUES ('20121024193845');

INSERT INTO schema_migrations (version) VALUES ('20130309011601');

INSERT INTO schema_migrations (version) VALUES ('20130319203258');

INSERT INTO schema_migrations (version) VALUES ('20130319203518');

INSERT INTO schema_migrations (version) VALUES ('20130423074028');

INSERT INTO schema_migrations (version) VALUES ('20130423090252');

INSERT INTO schema_migrations (version) VALUES ('20130423090823');

INSERT INTO schema_migrations (version) VALUES ('20130423095121');

INSERT INTO schema_migrations (version) VALUES ('20130423095359');

INSERT INTO schema_migrations (version) VALUES ('20130423100133');

INSERT INTO schema_migrations (version) VALUES ('20130423110858');

INSERT INTO schema_migrations (version) VALUES ('20130423110945');

INSERT INTO schema_migrations (version) VALUES ('20130426032817');

INSERT INTO schema_migrations (version) VALUES ('20130426032952');

INSERT INTO schema_migrations (version) VALUES ('20130429171512');

INSERT INTO schema_migrations (version) VALUES ('20130517024024');

INSERT INTO schema_migrations (version) VALUES ('20130517024604');

INSERT INTO schema_migrations (version) VALUES ('20130517024731');

INSERT INTO schema_migrations (version) VALUES ('20130517024855');

INSERT INTO schema_migrations (version) VALUES ('20130517025139');

INSERT INTO schema_migrations (version) VALUES ('20130522193452');

INSERT INTO schema_migrations (version) VALUES ('20130522193814');

INSERT INTO schema_migrations (version) VALUES ('20130609214734');

INSERT INTO schema_migrations (version) VALUES ('20130716160138');

INSERT INTO schema_migrations (version) VALUES ('20130727182529');

INSERT INTO schema_migrations (version) VALUES ('20130728210228');

INSERT INTO schema_migrations (version) VALUES ('20130729011951');

INSERT INTO schema_migrations (version) VALUES ('20130729023130');

INSERT INTO schema_migrations (version) VALUES ('20130801130431');

INSERT INTO schema_migrations (version) VALUES ('20130809042058');

INSERT INTO schema_migrations (version) VALUES ('20130826165736');

INSERT INTO schema_migrations (version) VALUES ('20130826165806');

INSERT INTO schema_migrations (version) VALUES ('20130826180321');

INSERT INTO schema_migrations (version) VALUES ('20130827053114');

INSERT INTO schema_migrations (version) VALUES ('20130827054952');

INSERT INTO schema_migrations (version) VALUES ('20130827071255');

INSERT INTO schema_migrations (version) VALUES ('20130913182245');

INSERT INTO schema_migrations (version) VALUES ('20130915033138');

INSERT INTO schema_migrations (version) VALUES ('20130921210529');

INSERT INTO schema_migrations (version) VALUES ('20130921211036');

INSERT INTO schema_migrations (version) VALUES ('20130922005149');

INSERT INTO schema_migrations (version) VALUES ('20130923025722');

INSERT INTO schema_migrations (version) VALUES ('20130926203005');

INSERT INTO schema_migrations (version) VALUES ('20131103061012');

INSERT INTO schema_migrations (version) VALUES ('20131103061122');

INSERT INTO schema_migrations (version) VALUES ('20131110002323');

INSERT INTO schema_migrations (version) VALUES ('20131110025356');

INSERT INTO schema_migrations (version) VALUES ('20131110031852');

INSERT INTO schema_migrations (version) VALUES ('20140114233646');

INSERT INTO schema_migrations (version) VALUES ('20140114233647');

INSERT INTO schema_migrations (version) VALUES ('20140119010550');

INSERT INTO schema_migrations (version) VALUES ('20140202153308');

INSERT INTO schema_migrations (version) VALUES ('20140203013343');

INSERT INTO schema_migrations (version) VALUES ('20140204201027');

INSERT INTO schema_migrations (version) VALUES ('20140224024344');

INSERT INTO schema_migrations (version) VALUES ('20140403152608');

INSERT INTO schema_migrations (version) VALUES ('20140403194136');

INSERT INTO schema_migrations (version) VALUES ('20140404165107');

INSERT INTO schema_migrations (version) VALUES ('20140422211405');

INSERT INTO schema_migrations (version) VALUES ('20140423225449');

INSERT INTO schema_migrations (version) VALUES ('20140811132110');

INSERT INTO schema_migrations (version) VALUES ('20140812222418');

INSERT INTO schema_migrations (version) VALUES ('20140816031410');

INSERT INTO schema_migrations (version) VALUES ('20140903200511');

INSERT INTO schema_migrations (version) VALUES ('20140903225323');

INSERT INTO schema_migrations (version) VALUES ('20140909163246');

INSERT INTO schema_migrations (version) VALUES ('20140916143956');

INSERT INTO schema_migrations (version) VALUES ('20140916183213');

INSERT INTO schema_migrations (version) VALUES ('20141007210647');

INSERT INTO schema_migrations (version) VALUES ('20141008152913');

INSERT INTO schema_migrations (version) VALUES ('20141014162137');

INSERT INTO schema_migrations (version) VALUES ('20150105170428');

INSERT INTO schema_migrations (version) VALUES ('20150105170550');

INSERT INTO schema_migrations (version) VALUES ('20150113144201');

INSERT INTO schema_migrations (version) VALUES ('20150113154458');

INSERT INTO schema_migrations (version) VALUES ('20150113170755');

INSERT INTO schema_migrations (version) VALUES ('20150120173017');

INSERT INTO schema_migrations (version) VALUES ('20150204201702');

INSERT INTO schema_migrations (version) VALUES ('20150204201738');

INSERT INTO schema_migrations (version) VALUES ('20150206184619');

INSERT INTO schema_migrations (version) VALUES ('20150224180253');

INSERT INTO schema_migrations (version) VALUES ('20150302183545');

INSERT INTO schema_migrations (version) VALUES ('20150302190844');

INSERT INTO schema_migrations (version) VALUES ('20150303220841');

INSERT INTO schema_migrations (version) VALUES ('20150316231711');

INSERT INTO schema_migrations (version) VALUES ('20150317200555');

INSERT INTO schema_migrations (version) VALUES ('20150317215753');

INSERT INTO schema_migrations (version) VALUES ('20150318220008');

INSERT INTO schema_migrations (version) VALUES ('20150605213737');

INSERT INTO schema_migrations (version) VALUES ('20150605220554');

INSERT INTO schema_migrations (version) VALUES ('20150605220923');

INSERT INTO schema_migrations (version) VALUES ('20150605221918');

INSERT INTO schema_migrations (version) VALUES ('20150616191252');

INSERT INTO schema_migrations (version) VALUES ('20150622172421');

INSERT INTO schema_migrations (version) VALUES ('20150622181401');

INSERT INTO schema_migrations (version) VALUES ('20150622182815');

INSERT INTO schema_migrations (version) VALUES ('20150625224316');

INSERT INTO schema_migrations (version) VALUES ('20150805212906');

INSERT INTO schema_migrations (version) VALUES ('20150805224448');

INSERT INTO schema_migrations (version) VALUES ('20150817164457');

INSERT INTO schema_migrations (version) VALUES ('20150817164501');

INSERT INTO schema_migrations (version) VALUES ('20150817164507');

INSERT INTO schema_migrations (version) VALUES ('20150826175849');

INSERT INTO schema_migrations (version) VALUES ('20150908190948');

INSERT INTO schema_migrations (version) VALUES ('20150922164057');

INSERT INTO schema_migrations (version) VALUES ('20150922180615');

INSERT INTO schema_migrations (version) VALUES ('20151001184736');

INSERT INTO schema_migrations (version) VALUES ('20151001185332');

INSERT INTO schema_migrations (version) VALUES ('20151001212257');

INSERT INTO schema_migrations (version) VALUES ('20151001221349');

INSERT INTO schema_migrations (version) VALUES ('20151006193029');

INSERT INTO schema_migrations (version) VALUES ('20151006193157');

INSERT INTO schema_migrations (version) VALUES ('20151006193526');

INSERT INTO schema_migrations (version) VALUES ('20151013204326');

INSERT INTO schema_migrations (version) VALUES ('20151014171836');

INSERT INTO schema_migrations (version) VALUES ('20151014171914');

INSERT INTO schema_migrations (version) VALUES ('20151014172251');

INSERT INTO schema_migrations (version) VALUES ('20151027174224');

INSERT INTO schema_migrations (version) VALUES ('20151102200755');

INSERT INTO schema_migrations (version) VALUES ('20151102201346');

INSERT INTO schema_migrations (version) VALUES ('20151102202446');

INSERT INTO schema_migrations (version) VALUES ('20151103143507');

INSERT INTO schema_migrations (version) VALUES ('20151109222903');

INSERT INTO schema_migrations (version) VALUES ('20151109223356');

INSERT INTO schema_migrations (version) VALUES ('20151109231711');

INSERT INTO schema_migrations (version) VALUES ('20151109231813');

INSERT INTO schema_migrations (version) VALUES ('20151123192127');

INSERT INTO schema_migrations (version) VALUES ('20151123211533');

INSERT INTO schema_migrations (version) VALUES ('20151214185801');

INSERT INTO schema_migrations (version) VALUES ('20151214204602');

INSERT INTO schema_migrations (version) VALUES ('20151221190346');

INSERT INTO schema_migrations (version) VALUES ('20151221194609');

INSERT INTO schema_migrations (version) VALUES ('20151221195034');

INSERT INTO schema_migrations (version) VALUES ('20151221195138');

INSERT INTO schema_migrations (version) VALUES ('20151221195203');

INSERT INTO schema_migrations (version) VALUES ('20151221195736');

INSERT INTO schema_migrations (version) VALUES ('20151222172610');

INSERT INTO schema_migrations (version) VALUES ('20160107221454');

INSERT INTO schema_migrations (version) VALUES ('20160111193235');

INSERT INTO schema_migrations (version) VALUES ('20160126222414');

INSERT INTO schema_migrations (version) VALUES ('20160127210202');

INSERT INTO schema_migrations (version) VALUES ('20160128163047');

INSERT INTO schema_migrations (version) VALUES ('20160201185836');

INSERT INTO schema_migrations (version) VALUES ('20160208185912');

INSERT INTO schema_migrations (version) VALUES ('20160208191348');

INSERT INTO schema_migrations (version) VALUES ('20160208230538');

INSERT INTO schema_migrations (version) VALUES ('20160229220357');

INSERT INTO schema_migrations (version) VALUES ('20160308005554');

INSERT INTO schema_migrations (version) VALUES ('20160516211635');

INSERT INTO schema_migrations (version) VALUES ('20160516214056');

INSERT INTO schema_migrations (version) VALUES ('20160520200929');

INSERT INTO schema_migrations (version) VALUES ('20160624180702');

INSERT INTO schema_migrations (version) VALUES ('20160722174111');

INSERT INTO schema_migrations (version) VALUES ('20160822145724');

INSERT INTO schema_migrations (version) VALUES ('20160908153832');

INSERT INTO schema_migrations (version) VALUES ('20160913173130');

INSERT INTO schema_migrations (version) VALUES ('20160919150448');

INSERT INTO schema_migrations (version) VALUES ('20161019184132');

INSERT INTO schema_migrations (version) VALUES ('20170103191349');

INSERT INTO schema_migrations (version) VALUES ('20170105213544');

INSERT INTO schema_migrations (version) VALUES ('20170126211938');

INSERT INTO schema_migrations (version) VALUES ('20170127014847');

INSERT INTO schema_migrations (version) VALUES ('20170127020417');

INSERT INTO schema_migrations (version) VALUES ('20170217201048');

INSERT INTO schema_migrations (version) VALUES ('20170222165119');

INSERT INTO schema_migrations (version) VALUES ('20170313154512');

INSERT INTO schema_migrations (version) VALUES ('20170314181527');

INSERT INTO schema_migrations (version) VALUES ('20170315183853');

INSERT INTO schema_migrations (version) VALUES ('20170412154159');

INSERT INTO schema_migrations (version) VALUES ('20170502185232');

INSERT INTO schema_migrations (version) VALUES ('20170505182334');

INSERT INTO schema_migrations (version) VALUES ('20170505195744');

INSERT INTO schema_migrations (version) VALUES ('20170517152031');

INSERT INTO schema_migrations (version) VALUES ('20170526220204');

INSERT INTO schema_migrations (version) VALUES ('20170718160133');

INSERT INTO schema_migrations (version) VALUES ('20170719192243');

INSERT INTO schema_migrations (version) VALUES ('20170720140557');

INSERT INTO schema_migrations (version) VALUES ('20170720195450');

INSERT INTO schema_migrations (version) VALUES ('20170804154221');

INSERT INTO schema_migrations (version) VALUES ('20170804154740');

INSERT INTO schema_migrations (version) VALUES ('20170809151404');

INSERT INTO schema_migrations (version) VALUES ('20170809202510');

INSERT INTO schema_migrations (version) VALUES ('20170811192029');

INSERT INTO schema_migrations (version) VALUES ('20170817144049');

INSERT INTO schema_migrations (version) VALUES ('20170824150025');

INSERT INTO schema_migrations (version) VALUES ('20170824171451');

INSERT INTO schema_migrations (version) VALUES ('20170911140007');

INSERT INTO schema_migrations (version) VALUES ('20170911191447');

INSERT INTO schema_migrations (version) VALUES ('20170914145423');

INSERT INTO schema_migrations (version) VALUES ('20170920133317');

INSERT INTO schema_migrations (version) VALUES ('20170920211610');

INSERT INTO schema_migrations (version) VALUES ('20170927213514');

INSERT INTO schema_migrations (version) VALUES ('20170928203242');

INSERT INTO schema_migrations (version) VALUES ('20171005210006');

INSERT INTO schema_migrations (version) VALUES ('20171006150857');

INSERT INTO schema_migrations (version) VALUES ('20171006151454');

INSERT INTO schema_migrations (version) VALUES ('20171006194812');

INSERT INTO schema_migrations (version) VALUES ('20171009155139');

INSERT INTO schema_migrations (version) VALUES ('20171009160011');

INSERT INTO schema_migrations (version) VALUES ('20171009162550');

INSERT INTO schema_migrations (version) VALUES ('20171011202936');

INSERT INTO schema_migrations (version) VALUES ('20171019150737');

INSERT INTO schema_migrations (version) VALUES ('20171106201721');

INSERT INTO schema_migrations (version) VALUES ('20171106203046');

INSERT INTO schema_migrations (version) VALUES ('20171128154249');

INSERT INTO schema_migrations (version) VALUES ('20171128192444');

INSERT INTO schema_migrations (version) VALUES ('20171128211301');

INSERT INTO schema_migrations (version) VALUES ('20171204202718');

INSERT INTO schema_migrations (version) VALUES ('20171204203843');

INSERT INTO schema_migrations (version) VALUES ('20171204205938');

INSERT INTO schema_migrations (version) VALUES ('20171204220339');

INSERT INTO schema_migrations (version) VALUES ('20171205181155');

INSERT INTO schema_migrations (version) VALUES ('20171214152937');

INSERT INTO schema_migrations (version) VALUES ('20171218222306');

INSERT INTO schema_migrations (version) VALUES ('20180102151559');

INSERT INTO schema_migrations (version) VALUES ('20180110221301');

INSERT INTO schema_migrations (version) VALUES ('20180119152409');

INSERT INTO schema_migrations (version) VALUES ('20180119162847');

INSERT INTO schema_migrations (version) VALUES ('20180122184126');

INSERT INTO schema_migrations (version) VALUES ('20180126191518');

INSERT INTO schema_migrations (version) VALUES ('20180126203911');

INSERT INTO schema_migrations (version) VALUES ('20180129225903');

INSERT INTO schema_migrations (version) VALUES ('20180129231657');

INSERT INTO schema_migrations (version) VALUES ('20180129233216');

INSERT INTO schema_migrations (version) VALUES ('20180130164532');

INSERT INTO schema_migrations (version) VALUES ('20180130165729');

INSERT INTO schema_migrations (version) VALUES ('20180131153416');

INSERT INTO schema_migrations (version) VALUES ('20180131165556');

INSERT INTO schema_migrations (version) VALUES ('20180131212358');

INSERT INTO schema_migrations (version) VALUES ('20180201191052');

INSERT INTO schema_migrations (version) VALUES ('20180201221940');

INSERT INTO schema_migrations (version) VALUES ('20180205170220');

INSERT INTO schema_migrations (version) VALUES ('20180206154253');

INSERT INTO schema_migrations (version) VALUES ('20180206171118');

INSERT INTO schema_migrations (version) VALUES ('20180206210355');

INSERT INTO schema_migrations (version) VALUES ('20180206215115');

INSERT INTO schema_migrations (version) VALUES ('20180206232452');

INSERT INTO schema_migrations (version) VALUES ('20180206235328');

INSERT INTO schema_migrations (version) VALUES ('20180207154242');

INSERT INTO schema_migrations (version) VALUES ('20180207165525');

INSERT INTO schema_migrations (version) VALUES ('20180209153502');

INSERT INTO schema_migrations (version) VALUES ('20180220204422');

INSERT INTO schema_migrations (version) VALUES ('20180221162940');

INSERT INTO schema_migrations (version) VALUES ('20180221163408');

INSERT INTO schema_migrations (version) VALUES ('20180221170200');

INSERT INTO schema_migrations (version) VALUES ('20180222160256');

INSERT INTO schema_migrations (version) VALUES ('20180222160302');

INSERT INTO schema_migrations (version) VALUES ('20180222190628');

INSERT INTO schema_migrations (version) VALUES ('20180227193833');

INSERT INTO schema_migrations (version) VALUES ('20180227215931');

INSERT INTO schema_migrations (version) VALUES ('20180228171538');

INSERT INTO schema_migrations (version) VALUES ('20180301064334');

INSERT INTO schema_migrations (version) VALUES ('20180301211956');

INSERT INTO schema_migrations (version) VALUES ('20180307212219');

INSERT INTO schema_migrations (version) VALUES ('20180308203054');

INSERT INTO schema_migrations (version) VALUES ('20180312180605');

INSERT INTO schema_migrations (version) VALUES ('20180312204645');

INSERT INTO schema_migrations (version) VALUES ('20180319133511');

INSERT INTO schema_migrations (version) VALUES ('20180319145514');

INSERT INTO schema_migrations (version) VALUES ('20180319145837');

INSERT INTO schema_migrations (version) VALUES ('20180319145946');

INSERT INTO schema_migrations (version) VALUES ('20180319165718');

INSERT INTO schema_migrations (version) VALUES ('20180319192659');

INSERT INTO schema_migrations (version) VALUES ('20180319195339');

INSERT INTO schema_migrations (version) VALUES ('20180319200940');

INSERT INTO schema_migrations (version) VALUES ('20180319201128');

INSERT INTO schema_migrations (version) VALUES ('20180319201311');

INSERT INTO schema_migrations (version) VALUES ('20180417202537');

INSERT INTO schema_migrations (version) VALUES ('20180418185045');

INSERT INTO schema_migrations (version) VALUES ('20180502152419');

INSERT INTO schema_migrations (version) VALUES ('20180517045137');

INSERT INTO schema_migrations (version) VALUES ('20180530145153');

INSERT INTO schema_migrations (version) VALUES ('20180625211305');

INSERT INTO schema_migrations (version) VALUES ('20180627183421');

INSERT INTO schema_migrations (version) VALUES ('20180627184008');

INSERT INTO schema_migrations (version) VALUES ('20180627200532');

INSERT INTO schema_migrations (version) VALUES ('20180628161337');

INSERT INTO schema_migrations (version) VALUES ('20180628182314');

INSERT INTO schema_migrations (version) VALUES ('20180628191240');

INSERT INTO schema_migrations (version) VALUES ('20180629151757');

INSERT INTO schema_migrations (version) VALUES ('20180702201017');

INSERT INTO schema_migrations (version) VALUES ('20180703154253');

INSERT INTO schema_migrations (version) VALUES ('20180703154718');

INSERT INTO schema_migrations (version) VALUES ('20180709190219');

INSERT INTO schema_migrations (version) VALUES ('20180709190257');

INSERT INTO schema_migrations (version) VALUES ('20180709190427');

INSERT INTO schema_migrations (version) VALUES ('20180709192646');

INSERT INTO schema_migrations (version) VALUES ('20180718195853');

INSERT INTO schema_migrations (version) VALUES ('20180810181001');

INSERT INTO schema_migrations (version) VALUES ('20180815174156');

INSERT INTO schema_migrations (version) VALUES ('20180815180204');

INSERT INTO schema_migrations (version) VALUES ('20180816210411');

INSERT INTO schema_migrations (version) VALUES ('20180817171936');

INSERT INTO schema_migrations (version) VALUES ('20180820154444');

INSERT INTO schema_migrations (version) VALUES ('20180821200652');

INSERT INTO schema_migrations (version) VALUES ('20180821201236');

INSERT INTO schema_migrations (version) VALUES ('20180821201559');

INSERT INTO schema_migrations (version) VALUES ('20180821202836');

INSERT INTO schema_migrations (version) VALUES ('20180821213520');

INSERT INTO schema_migrations (version) VALUES ('20180822144355');

INSERT INTO schema_migrations (version) VALUES ('20180822155024');

INSERT INTO schema_migrations (version) VALUES ('20180822155243');

INSERT INTO schema_migrations (version) VALUES ('20180824185130');

INSERT INTO schema_migrations (version) VALUES ('20180824185824');

INSERT INTO schema_migrations (version) VALUES ('20180824195642');

INSERT INTO schema_migrations (version) VALUES ('20180827212450');

INSERT INTO schema_migrations (version) VALUES ('20180831194810');

INSERT INTO schema_migrations (version) VALUES ('20180910152342');

INSERT INTO schema_migrations (version) VALUES ('20180911171536');

INSERT INTO schema_migrations (version) VALUES ('20181012155250');

INSERT INTO schema_migrations (version) VALUES ('20181018195753');

INSERT INTO schema_migrations (version) VALUES ('20181026201202');

INSERT INTO schema_migrations (version) VALUES ('20181030155356');

INSERT INTO schema_migrations (version) VALUES ('20181105212102');

INSERT INTO schema_migrations (version) VALUES ('20181203161708');

INSERT INTO schema_migrations (version) VALUES ('20181214192858');

INSERT INTO schema_migrations (version) VALUES ('20190128203336');

INSERT INTO schema_migrations (version) VALUES ('20190214172006');

INSERT INTO schema_migrations (version) VALUES ('20190312193928');

INSERT INTO schema_migrations (version) VALUES ('20190412152236');

INSERT INTO schema_migrations (version) VALUES ('20190604133438');

INSERT INTO schema_migrations (version) VALUES ('20190611155916');

INSERT INTO schema_migrations (version) VALUES ('20191001184042');

INSERT INTO schema_migrations (version) VALUES ('20191001190234');

INSERT INTO schema_migrations (version) VALUES ('20191003192319');

INSERT INTO schema_migrations (version) VALUES ('20191008191026');

INSERT INTO schema_migrations (version) VALUES ('20191016155645');

INSERT INTO schema_migrations (version) VALUES ('20191016202708');

INSERT INTO schema_migrations (version) VALUES ('20191022142949');

INSERT INTO schema_migrations (version) VALUES ('20191024150907');

INSERT INTO schema_migrations (version) VALUES ('20191030183959');

INSERT INTO schema_migrations (version) VALUES ('20191122181105');

INSERT INTO schema_migrations (version) VALUES ('20191218174724');

INSERT INTO schema_migrations (version) VALUES ('20200123170454');

INSERT INTO schema_migrations (version) VALUES ('20200324192053');

INSERT INTO schema_migrations (version) VALUES ('20200326152208');

INSERT INTO schema_migrations (version) VALUES ('20200326220320');

INSERT INTO schema_migrations (version) VALUES ('20200409151835');

INSERT INTO schema_migrations (version) VALUES ('20200415170227');

INSERT INTO schema_migrations (version) VALUES ('20200505171239');

INSERT INTO schema_migrations (version) VALUES ('20200511203004');

INSERT INTO schema_migrations (version) VALUES ('20200601153535');

INSERT INTO schema_migrations (version) VALUES ('20200603171807');

INSERT INTO schema_migrations (version) VALUES ('20200604165331');

INSERT INTO schema_migrations (version) VALUES ('20200610144620');

INSERT INTO schema_migrations (version) VALUES ('20200612165828');

INSERT INTO schema_migrations (version) VALUES ('20200612165829');

INSERT INTO schema_migrations (version) VALUES ('20200612165830');

INSERT INTO schema_migrations (version) VALUES ('20200629191908');

INSERT INTO schema_migrations (version) VALUES ('20200629191909');

INSERT INTO schema_migrations (version) VALUES ('20200702140252');

INSERT INTO schema_migrations (version) VALUES ('20200706135059');

INSERT INTO schema_migrations (version) VALUES ('20200707144528');

INSERT INTO schema_migrations (version) VALUES ('20200928193105');

INSERT INTO schema_migrations (version) VALUES ('20200928193310');

INSERT INTO schema_migrations (version) VALUES ('20200928193551');

INSERT INTO schema_migrations (version) VALUES ('20200928193744');

