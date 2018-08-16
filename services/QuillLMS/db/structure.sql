--
-- PostgreSQL database dump
--

-- Dumped from database version 10.1
-- Dumped by pg_dump version 10.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
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
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA public;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_stat_statements IS 'track execution statistics of all SQL statements executed';


--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


SET search_path = public, pg_catalog;

--
-- Name: blog_posts_search_trigger(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION blog_posts_search_trigger() RETURNS trigger
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


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE activities (
    id integer NOT NULL,
    name character varying(255),
    description text,
    uid character varying(255) NOT NULL,
    data hstore,
    activity_classification_id integer,
    topic_id integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    flags character varying(255)[] DEFAULT '{}'::character varying[] NOT NULL,
    repeatable boolean DEFAULT true,
    follow_up_activity_id integer,
    supporting_info character varying
);


--
-- Name: activities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE activities_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE activities_id_seq OWNED BY activities.id;


--
-- Name: activities_unit_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE activities_unit_templates (
    unit_template_id integer NOT NULL,
    activity_id integer NOT NULL
);


--
-- Name: activity_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE activity_categories (
    id integer NOT NULL,
    name character varying,
    order_number integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: activity_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE activity_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: activity_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE activity_categories_id_seq OWNED BY activity_categories.id;


--
-- Name: activity_category_activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE activity_category_activities (
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

CREATE SEQUENCE activity_category_activities_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: activity_category_activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE activity_category_activities_id_seq OWNED BY activity_category_activities.id;


--
-- Name: activity_classifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE activity_classifications (
    id integer NOT NULL,
    name character varying(255),
    key character varying(255) NOT NULL,
    form_url character varying(255),
    uid character varying(255) NOT NULL,
    module_url character varying(255),
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    app_name character varying(255),
    order_number integer DEFAULT 999999999,
    instructor_mode boolean DEFAULT false,
    locked_by_default boolean DEFAULT false,
    scored boolean DEFAULT true
);


--
-- Name: activity_classifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE activity_classifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: activity_classifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE activity_classifications_id_seq OWNED BY activity_classifications.id;


--
-- Name: activity_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE activity_sessions (
    id integer NOT NULL,
    classroom_activity_id integer,
    activity_id integer,
    user_id integer,
    pairing_id character varying(255),
    percentage double precision,
    state character varying(255) DEFAULT 'unstarted'::character varying NOT NULL,
    completed_at timestamp without time zone,
    uid character varying(255),
    temporary boolean DEFAULT false,
    data hstore,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    started_at timestamp without time zone,
    is_retry boolean DEFAULT false,
    is_final_score boolean DEFAULT false,
    visible boolean DEFAULT true NOT NULL,
    classroom_unit_id integer
);


--
-- Name: activity_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE activity_sessions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: activity_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE activity_sessions_id_seq OWNED BY activity_sessions.id;


--
-- Name: admin_accounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE admin_accounts (
    id integer NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    name character varying(255)
);


--
-- Name: admin_accounts_admins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE admin_accounts_admins (
    id integer NOT NULL,
    admin_account_id integer,
    admin_id integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: admin_accounts_admins_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE admin_accounts_admins_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: admin_accounts_admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE admin_accounts_admins_id_seq OWNED BY admin_accounts_admins.id;


--
-- Name: admin_accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE admin_accounts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: admin_accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE admin_accounts_id_seq OWNED BY admin_accounts.id;


--
-- Name: admin_accounts_teachers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE admin_accounts_teachers (
    id integer NOT NULL,
    admin_account_id integer,
    teacher_id integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: admin_accounts_teachers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE admin_accounts_teachers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: admin_accounts_teachers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE admin_accounts_teachers_id_seq OWNED BY admin_accounts_teachers.id;


--
-- Name: announcements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE announcements (
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

CREATE SEQUENCE announcements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: announcements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE announcements_id_seq OWNED BY announcements.id;


--
-- Name: auth_credentials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE auth_credentials (
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

CREATE SEQUENCE auth_credentials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: auth_credentials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE auth_credentials_id_seq OWNED BY auth_credentials.id;


--
-- Name: authors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE authors (
    id integer NOT NULL,
    name character varying(255),
    avatar text
);


--
-- Name: authors_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE authors_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: authors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE authors_id_seq OWNED BY authors.id;


--
-- Name: blog_post_user_ratings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE blog_post_user_ratings (
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

CREATE SEQUENCE blog_post_user_ratings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: blog_post_user_ratings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE blog_post_user_ratings_id_seq OWNED BY blog_post_user_ratings.id;


--
-- Name: blog_posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE blog_posts (
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
    order_number integer
);


--
-- Name: blog_posts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE blog_posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: blog_posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE blog_posts_id_seq OWNED BY blog_posts.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE categories (
    id integer NOT NULL,
    title text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE categories_id_seq OWNED BY categories.id;


--
-- Name: checkboxes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE checkboxes (
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

CREATE SEQUENCE checkboxes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: checkboxes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE checkboxes_id_seq OWNED BY checkboxes.id;


--
-- Name: classroom_activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE classroom_activities (
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

CREATE SEQUENCE classroom_activities_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: classroom_activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE classroom_activities_id_seq OWNED BY classroom_activities.id;


--
-- Name: classroom_unit_activity_states; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE classroom_unit_activity_states (
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

CREATE SEQUENCE classroom_unit_activity_states_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: classroom_unit_activity_states_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE classroom_unit_activity_states_id_seq OWNED BY classroom_unit_activity_states.id;


--
-- Name: classroom_units; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE classroom_units (
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

CREATE SEQUENCE classroom_units_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: classroom_units_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE classroom_units_id_seq OWNED BY classroom_units.id;


--
-- Name: classrooms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE classrooms (
    id integer NOT NULL,
    name character varying(255),
    code character varying(255),
    teacher_id integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    clever_id character varying(255),
    grade character varying(255),
    visible boolean DEFAULT true NOT NULL,
    google_classroom_id bigint,
    grade_level integer
);


--
-- Name: classrooms_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE classrooms_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: classrooms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE classrooms_id_seq OWNED BY classrooms.id;


--
-- Name: classrooms_teachers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE classrooms_teachers (
    id integer NOT NULL,
    user_id integer NOT NULL,
    classroom_id integer NOT NULL,
    role character varying NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    CONSTRAINT check_role_is_valid CHECK ((((role)::text = ANY (ARRAY[('owner'::character varying)::text, ('coteacher'::character varying)::text])) AND (role IS NOT NULL)))
);


--
-- Name: classrooms_teachers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE classrooms_teachers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: classrooms_teachers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE classrooms_teachers_id_seq OWNED BY classrooms_teachers.id;


--
-- Name: comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE comments (
    id integer NOT NULL,
    title character varying(255),
    body text,
    user_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    ancestry character varying(255),
    reply_type character varying(255),
    lecture_chapter_id integer
);


--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE comments_id_seq OWNED BY comments.id;


--
-- Name: concept_results; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE concept_results (
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

CREATE SEQUENCE concept_results_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: concept_results_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE concept_results_id_seq OWNED BY concept_results.id;


--
-- Name: concepts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE concepts (
    id integer NOT NULL,
    name character varying(255),
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    parent_id integer,
    uid character varying(255) NOT NULL
);


--
-- Name: concepts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE concepts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: concepts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE concepts_id_seq OWNED BY concepts.id;


--
-- Name: coteacher_classroom_invitations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE coteacher_classroom_invitations (
    id integer NOT NULL,
    invitation_id integer NOT NULL,
    classroom_id integer NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: coteacher_classroom_invitations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE coteacher_classroom_invitations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: coteacher_classroom_invitations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE coteacher_classroom_invitations_id_seq OWNED BY coteacher_classroom_invitations.id;


--
-- Name: credit_transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE credit_transactions (
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

CREATE SEQUENCE credit_transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: credit_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE credit_transactions_id_seq OWNED BY credit_transactions.id;


--
-- Name: criteria; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE criteria (
    id integer NOT NULL,
    concept_id integer NOT NULL,
    count integer DEFAULT 0 NOT NULL,
    recommendation_id integer NOT NULL,
    no_incorrect boolean DEFAULT false NOT NULL
);


--
-- Name: criteria_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE criteria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: criteria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE criteria_id_seq OWNED BY criteria.id;


--
-- Name: csv_exports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE csv_exports (
    id integer NOT NULL,
    export_type character varying(255),
    emailed_at timestamp without time zone,
    filters json,
    teacher_id integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    csv_file character varying(255)
);


--
-- Name: csv_exports_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE csv_exports_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: csv_exports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE csv_exports_id_seq OWNED BY csv_exports.id;


--
-- Name: districts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE districts (
    id integer NOT NULL,
    clever_id character varying(255),
    name character varying(255),
    token character varying(255),
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: districts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE districts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: districts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE districts_id_seq OWNED BY districts.id;


--
-- Name: districts_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE districts_users (
    district_id integer,
    user_id integer
);


--
-- Name: file_uploads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE file_uploads (
    id integer NOT NULL,
    name character varying(255),
    file character varying(255),
    description text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: file_uploads_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE file_uploads_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: file_uploads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE file_uploads_id_seq OWNED BY file_uploads.id;


--
-- Name: firebase_apps; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE firebase_apps (
    id integer NOT NULL,
    name character varying(255),
    secret character varying(255),
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    pkey text
);


--
-- Name: firebase_apps_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE firebase_apps_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: firebase_apps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE firebase_apps_id_seq OWNED BY firebase_apps.id;


--
-- Name: images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE images (
    id integer NOT NULL,
    file character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: images_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE images_id_seq OWNED BY images.id;


--
-- Name: invitations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE invitations (
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

CREATE SEQUENCE invitations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: invitations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE invitations_id_seq OWNED BY invitations.id;


--
-- Name: ip_locations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE ip_locations (
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

CREATE SEQUENCE ip_locations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ip_locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE ip_locations_id_seq OWNED BY ip_locations.id;


--
-- Name: milestones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE milestones (
    id integer NOT NULL,
    name character varying NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: milestones_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE milestones_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: milestones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE milestones_id_seq OWNED BY milestones.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE notifications (
    id integer NOT NULL,
    text text NOT NULL,
    user_id integer NOT NULL
);


--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE notifications_id_seq OWNED BY notifications.id;


--
-- Name: oauth_access_grants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE oauth_access_grants (
    id integer NOT NULL,
    resource_owner_id integer NOT NULL,
    application_id integer NOT NULL,
    token character varying(255) NOT NULL,
    expires_in integer NOT NULL,
    redirect_uri text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    revoked_at timestamp without time zone,
    scopes character varying(255)
);


--
-- Name: oauth_access_grants_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE oauth_access_grants_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: oauth_access_grants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE oauth_access_grants_id_seq OWNED BY oauth_access_grants.id;


--
-- Name: oauth_access_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE oauth_access_tokens (
    id integer NOT NULL,
    resource_owner_id integer,
    application_id integer,
    token character varying(255) NOT NULL,
    refresh_token character varying(255),
    expires_in integer,
    revoked_at timestamp without time zone,
    created_at timestamp without time zone NOT NULL,
    scopes character varying(255)
);


--
-- Name: oauth_access_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE oauth_access_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: oauth_access_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE oauth_access_tokens_id_seq OWNED BY oauth_access_tokens.id;


--
-- Name: oauth_applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE oauth_applications (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    uid character varying(255) NOT NULL,
    secret character varying(255) NOT NULL,
    redirect_uri text NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: oauth_applications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE oauth_applications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: oauth_applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE oauth_applications_id_seq OWNED BY oauth_applications.id;


--
-- Name: objectives; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE objectives (
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

CREATE SEQUENCE objectives_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: objectives_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE objectives_id_seq OWNED BY objectives.id;


--
-- Name: page_areas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE page_areas (
    id integer NOT NULL,
    name character varying(255),
    description character varying(255),
    content text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: page_areas_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE page_areas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: page_areas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE page_areas_id_seq OWNED BY page_areas.id;


--
-- Name: recommendations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE recommendations (
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

CREATE SEQUENCE recommendations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: recommendations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE recommendations_id_seq OWNED BY recommendations.id;


--
-- Name: referrals_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE referrals_users (
    id integer NOT NULL,
    user_id integer NOT NULL,
    referred_user_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: referrals_users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE referrals_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: referrals_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE referrals_users_id_seq OWNED BY referrals_users.id;


--
-- Name: referrer_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE referrer_users (
    id integer NOT NULL,
    user_id integer NOT NULL,
    referral_code character varying NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: referrer_users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE referrer_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: referrer_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE referrer_users_id_seq OWNED BY referrer_users.id;


--
-- Name: rules_misseds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE rules_misseds (
    id integer NOT NULL,
    rule_id integer,
    user_id integer,
    assessment_id integer,
    time_take timestamp without time zone,
    missed boolean,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: rules_misseds_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE rules_misseds_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rules_misseds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE rules_misseds_id_seq OWNED BY rules_misseds.id;


--
-- Name: sales_contacts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE sales_contacts (
    id integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: sales_contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE sales_contacts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sales_contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE sales_contacts_id_seq OWNED BY sales_contacts.id;


--
-- Name: sales_stage_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE sales_stage_types (
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

CREATE SEQUENCE sales_stage_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sales_stage_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE sales_stage_types_id_seq OWNED BY sales_stage_types.id;


--
-- Name: sales_stages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE sales_stages (
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

CREATE SEQUENCE sales_stages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sales_stages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE sales_stages_id_seq OWNED BY sales_stages.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE schema_migrations (
    version character varying(255) NOT NULL
);


--
-- Name: school_subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE school_subscriptions (
    id integer NOT NULL,
    school_id integer,
    subscription_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: school_subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE school_subscriptions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: school_subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE school_subscriptions_id_seq OWNED BY school_subscriptions.id;


--
-- Name: schools; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE schools (
    id integer NOT NULL,
    nces_id character varying(255),
    lea_id character varying(255),
    leanm character varying(255),
    name character varying(255),
    phone character varying(255),
    mail_street character varying(255),
    mail_city character varying(255),
    mail_state character varying(255),
    mail_zipcode character varying(255),
    street character varying(255),
    city character varying(255),
    state character varying(255),
    zipcode character varying(255),
    nces_type_code character varying(255),
    nces_status_code character varying(255),
    magnet character varying(255),
    charter character varying(255),
    ethnic_group character varying(255),
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
    clever_id character varying(255),
    ppin character varying,
    authorizer_id integer,
    coordinator_id integer
);


--
-- Name: schools_admins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE schools_admins (
    id integer NOT NULL,
    user_id integer,
    school_id integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: schools_admins_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE schools_admins_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: schools_admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE schools_admins_id_seq OWNED BY schools_admins.id;


--
-- Name: schools_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE schools_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: schools_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE schools_id_seq OWNED BY schools.id;


--
-- Name: schools_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE schools_users (
    school_id integer,
    user_id integer,
    id integer NOT NULL
);


--
-- Name: schools_users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE schools_users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: schools_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE schools_users_id_seq OWNED BY schools_users.id;


--
-- Name: sections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE sections (
    id integer NOT NULL,
    name character varying(255),
    "position" integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    uid character varying(255)
);


--
-- Name: sections_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE sections_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE sections_id_seq OWNED BY sections.id;


--
-- Name: students_classrooms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE students_classrooms (
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

CREATE SEQUENCE students_classrooms_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: students_classrooms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE students_classrooms_id_seq OWNED BY students_classrooms.id;


--
-- Name: subscription_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE subscription_types (
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

CREATE SEQUENCE subscription_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: subscription_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE subscription_types_id_seq OWNED BY subscription_types.id;


--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE subscriptions (
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

CREATE SEQUENCE subscriptions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE subscriptions_id_seq OWNED BY subscriptions.id;


--
-- Name: topic_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE topic_categories (
    id integer NOT NULL,
    name character varying(255),
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    uid character varying(255)
);


--
-- Name: topic_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE topic_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: topic_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE topic_categories_id_seq OWNED BY topic_categories.id;


--
-- Name: topics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE topics (
    id integer NOT NULL,
    name character varying(255),
    section_id integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    topic_category_id integer,
    uid character varying(255)
);


--
-- Name: topics_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE topics_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: topics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE topics_id_seq OWNED BY topics.id;


--
-- Name: unit_activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE unit_activities (
    id integer NOT NULL,
    unit_id integer NOT NULL,
    activity_id integer NOT NULL,
    visible boolean DEFAULT true,
    due_date timestamp without time zone,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: unit_activities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE unit_activities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: unit_activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE unit_activities_id_seq OWNED BY unit_activities.id;


--
-- Name: unit_template_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE unit_template_categories (
    id integer NOT NULL,
    name character varying(255),
    primary_color character varying(255),
    secondary_color character varying(255)
);


--
-- Name: unit_template_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE unit_template_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: unit_template_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE unit_template_categories_id_seq OWNED BY unit_template_categories.id;


--
-- Name: unit_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE unit_templates (
    id integer NOT NULL,
    name character varying(255),
    unit_template_category_id integer,
    "time" integer,
    grades text,
    author_id integer,
    flag character varying,
    order_number integer DEFAULT 999999999,
    activity_info text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: unit_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE unit_templates_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: unit_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE unit_templates_id_seq OWNED BY unit_templates.id;


--
-- Name: units; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE units (
    id integer NOT NULL,
    name character varying(255),
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    visible boolean DEFAULT true NOT NULL,
    user_id integer,
    unit_template_id integer
);


--
-- Name: units_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE units_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: units_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE units_id_seq OWNED BY units.id;


--
-- Name: user_milestones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE user_milestones (
    id integer NOT NULL,
    user_id integer NOT NULL,
    milestone_id integer NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: user_milestones_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE user_milestones_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_milestones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE user_milestones_id_seq OWNED BY user_milestones.id;


--
-- Name: user_subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE user_subscriptions (
    id integer NOT NULL,
    user_id integer,
    subscription_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: user_subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE user_subscriptions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE user_subscriptions_id_seq OWNED BY user_subscriptions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE users (
    id integer NOT NULL,
    name character varying(255),
    email character varying(255),
    password_digest character varying(255),
    role character varying(255) DEFAULT 'user'::character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    classcode character varying(255),
    active boolean DEFAULT false,
    username character varying(255),
    token character varying(255),
    ip_address inet,
    clever_id character varying(255),
    signed_up_with_google boolean DEFAULT false,
    send_newsletter boolean DEFAULT false,
    google_id character varying,
    last_sign_in timestamp without time zone,
    last_active timestamp without time zone,
    stripe_customer_id character varying,
    flags character varying[] DEFAULT '{}'::character varying[] NOT NULL,
    title character varying,
    time_zone character varying
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: activities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY activities ALTER COLUMN id SET DEFAULT nextval('activities_id_seq'::regclass);


--
-- Name: activity_categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY activity_categories ALTER COLUMN id SET DEFAULT nextval('activity_categories_id_seq'::regclass);


--
-- Name: activity_category_activities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY activity_category_activities ALTER COLUMN id SET DEFAULT nextval('activity_category_activities_id_seq'::regclass);


--
-- Name: activity_classifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY activity_classifications ALTER COLUMN id SET DEFAULT nextval('activity_classifications_id_seq'::regclass);


--
-- Name: activity_sessions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY activity_sessions ALTER COLUMN id SET DEFAULT nextval('activity_sessions_id_seq'::regclass);


--
-- Name: admin_accounts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY admin_accounts ALTER COLUMN id SET DEFAULT nextval('admin_accounts_id_seq'::regclass);


--
-- Name: admin_accounts_admins id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY admin_accounts_admins ALTER COLUMN id SET DEFAULT nextval('admin_accounts_admins_id_seq'::regclass);


--
-- Name: admin_accounts_teachers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY admin_accounts_teachers ALTER COLUMN id SET DEFAULT nextval('admin_accounts_teachers_id_seq'::regclass);


--
-- Name: announcements id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY announcements ALTER COLUMN id SET DEFAULT nextval('announcements_id_seq'::regclass);


--
-- Name: auth_credentials id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY auth_credentials ALTER COLUMN id SET DEFAULT nextval('auth_credentials_id_seq'::regclass);


--
-- Name: authors id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY authors ALTER COLUMN id SET DEFAULT nextval('authors_id_seq'::regclass);


--
-- Name: blog_post_user_ratings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY blog_post_user_ratings ALTER COLUMN id SET DEFAULT nextval('blog_post_user_ratings_id_seq'::regclass);


--
-- Name: blog_posts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY blog_posts ALTER COLUMN id SET DEFAULT nextval('blog_posts_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY categories ALTER COLUMN id SET DEFAULT nextval('categories_id_seq'::regclass);


--
-- Name: checkboxes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY checkboxes ALTER COLUMN id SET DEFAULT nextval('checkboxes_id_seq'::regclass);


--
-- Name: classroom_activities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY classroom_activities ALTER COLUMN id SET DEFAULT nextval('classroom_activities_id_seq'::regclass);


--
-- Name: classroom_unit_activity_states id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY classroom_unit_activity_states ALTER COLUMN id SET DEFAULT nextval('classroom_unit_activity_states_id_seq'::regclass);


--
-- Name: classroom_units id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY classroom_units ALTER COLUMN id SET DEFAULT nextval('classroom_units_id_seq'::regclass);


--
-- Name: classrooms id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY classrooms ALTER COLUMN id SET DEFAULT nextval('classrooms_id_seq'::regclass);


--
-- Name: classrooms_teachers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY classrooms_teachers ALTER COLUMN id SET DEFAULT nextval('classrooms_teachers_id_seq'::regclass);


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY comments ALTER COLUMN id SET DEFAULT nextval('comments_id_seq'::regclass);


--
-- Name: concept_results id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY concept_results ALTER COLUMN id SET DEFAULT nextval('concept_results_id_seq'::regclass);


--
-- Name: concepts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY concepts ALTER COLUMN id SET DEFAULT nextval('concepts_id_seq'::regclass);


--
-- Name: coteacher_classroom_invitations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY coteacher_classroom_invitations ALTER COLUMN id SET DEFAULT nextval('coteacher_classroom_invitations_id_seq'::regclass);


--
-- Name: credit_transactions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY credit_transactions ALTER COLUMN id SET DEFAULT nextval('credit_transactions_id_seq'::regclass);


--
-- Name: criteria id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY criteria ALTER COLUMN id SET DEFAULT nextval('criteria_id_seq'::regclass);


--
-- Name: csv_exports id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY csv_exports ALTER COLUMN id SET DEFAULT nextval('csv_exports_id_seq'::regclass);


--
-- Name: districts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY districts ALTER COLUMN id SET DEFAULT nextval('districts_id_seq'::regclass);


--
-- Name: file_uploads id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY file_uploads ALTER COLUMN id SET DEFAULT nextval('file_uploads_id_seq'::regclass);


--
-- Name: firebase_apps id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY firebase_apps ALTER COLUMN id SET DEFAULT nextval('firebase_apps_id_seq'::regclass);


--
-- Name: images id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY images ALTER COLUMN id SET DEFAULT nextval('images_id_seq'::regclass);


--
-- Name: invitations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY invitations ALTER COLUMN id SET DEFAULT nextval('invitations_id_seq'::regclass);


--
-- Name: ip_locations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY ip_locations ALTER COLUMN id SET DEFAULT nextval('ip_locations_id_seq'::regclass);


--
-- Name: milestones id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY milestones ALTER COLUMN id SET DEFAULT nextval('milestones_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY notifications ALTER COLUMN id SET DEFAULT nextval('notifications_id_seq'::regclass);


--
-- Name: oauth_access_grants id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY oauth_access_grants ALTER COLUMN id SET DEFAULT nextval('oauth_access_grants_id_seq'::regclass);


--
-- Name: oauth_access_tokens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY oauth_access_tokens ALTER COLUMN id SET DEFAULT nextval('oauth_access_tokens_id_seq'::regclass);


--
-- Name: oauth_applications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY oauth_applications ALTER COLUMN id SET DEFAULT nextval('oauth_applications_id_seq'::regclass);


--
-- Name: objectives id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY objectives ALTER COLUMN id SET DEFAULT nextval('objectives_id_seq'::regclass);


--
-- Name: page_areas id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY page_areas ALTER COLUMN id SET DEFAULT nextval('page_areas_id_seq'::regclass);


--
-- Name: recommendations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY recommendations ALTER COLUMN id SET DEFAULT nextval('recommendations_id_seq'::regclass);


--
-- Name: referrals_users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY referrals_users ALTER COLUMN id SET DEFAULT nextval('referrals_users_id_seq'::regclass);


--
-- Name: referrer_users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY referrer_users ALTER COLUMN id SET DEFAULT nextval('referrer_users_id_seq'::regclass);


--
-- Name: rules_misseds id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY rules_misseds ALTER COLUMN id SET DEFAULT nextval('rules_misseds_id_seq'::regclass);


--
-- Name: sales_contacts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY sales_contacts ALTER COLUMN id SET DEFAULT nextval('sales_contacts_id_seq'::regclass);


--
-- Name: sales_stage_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY sales_stage_types ALTER COLUMN id SET DEFAULT nextval('sales_stage_types_id_seq'::regclass);


--
-- Name: sales_stages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY sales_stages ALTER COLUMN id SET DEFAULT nextval('sales_stages_id_seq'::regclass);


--
-- Name: school_subscriptions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY school_subscriptions ALTER COLUMN id SET DEFAULT nextval('school_subscriptions_id_seq'::regclass);


--
-- Name: schools id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY schools ALTER COLUMN id SET DEFAULT nextval('schools_id_seq'::regclass);


--
-- Name: schools_admins id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY schools_admins ALTER COLUMN id SET DEFAULT nextval('schools_admins_id_seq'::regclass);


--
-- Name: schools_users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY schools_users ALTER COLUMN id SET DEFAULT nextval('schools_users_id_seq'::regclass);


--
-- Name: sections id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY sections ALTER COLUMN id SET DEFAULT nextval('sections_id_seq'::regclass);


--
-- Name: students_classrooms id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY students_classrooms ALTER COLUMN id SET DEFAULT nextval('students_classrooms_id_seq'::regclass);


--
-- Name: subscription_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY subscription_types ALTER COLUMN id SET DEFAULT nextval('subscription_types_id_seq'::regclass);


--
-- Name: subscriptions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY subscriptions ALTER COLUMN id SET DEFAULT nextval('subscriptions_id_seq'::regclass);


--
-- Name: topic_categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY topic_categories ALTER COLUMN id SET DEFAULT nextval('topic_categories_id_seq'::regclass);


--
-- Name: topics id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY topics ALTER COLUMN id SET DEFAULT nextval('topics_id_seq'::regclass);


--
-- Name: unit_activities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY unit_activities ALTER COLUMN id SET DEFAULT nextval('unit_activities_id_seq'::regclass);


--
-- Name: unit_template_categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY unit_template_categories ALTER COLUMN id SET DEFAULT nextval('unit_template_categories_id_seq'::regclass);


--
-- Name: unit_templates id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY unit_templates ALTER COLUMN id SET DEFAULT nextval('unit_templates_id_seq'::regclass);


--
-- Name: units id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY units ALTER COLUMN id SET DEFAULT nextval('units_id_seq'::regclass);


--
-- Name: user_milestones id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY user_milestones ALTER COLUMN id SET DEFAULT nextval('user_milestones_id_seq'::regclass);


--
-- Name: user_subscriptions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY user_subscriptions ALTER COLUMN id SET DEFAULT nextval('user_subscriptions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Name: activities activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY activities
    ADD CONSTRAINT activities_pkey PRIMARY KEY (id);


--
-- Name: activity_categories activity_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY activity_categories
    ADD CONSTRAINT activity_categories_pkey PRIMARY KEY (id);


--
-- Name: activity_category_activities activity_category_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY activity_category_activities
    ADD CONSTRAINT activity_category_activities_pkey PRIMARY KEY (id);


--
-- Name: activity_classifications activity_classifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY activity_classifications
    ADD CONSTRAINT activity_classifications_pkey PRIMARY KEY (id);


--
-- Name: activity_sessions activity_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY activity_sessions
    ADD CONSTRAINT activity_sessions_pkey PRIMARY KEY (id);


--
-- Name: admin_accounts_admins admin_accounts_admins_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY admin_accounts_admins
    ADD CONSTRAINT admin_accounts_admins_pkey PRIMARY KEY (id);


--
-- Name: admin_accounts admin_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY admin_accounts
    ADD CONSTRAINT admin_accounts_pkey PRIMARY KEY (id);


--
-- Name: admin_accounts_teachers admin_accounts_teachers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY admin_accounts_teachers
    ADD CONSTRAINT admin_accounts_teachers_pkey PRIMARY KEY (id);


--
-- Name: announcements announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY announcements
    ADD CONSTRAINT announcements_pkey PRIMARY KEY (id);


--
-- Name: auth_credentials auth_credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY auth_credentials
    ADD CONSTRAINT auth_credentials_pkey PRIMARY KEY (id);


--
-- Name: authors authors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY authors
    ADD CONSTRAINT authors_pkey PRIMARY KEY (id);


--
-- Name: blog_post_user_ratings blog_post_user_ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY blog_post_user_ratings
    ADD CONSTRAINT blog_post_user_ratings_pkey PRIMARY KEY (id);


--
-- Name: blog_posts blog_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY blog_posts
    ADD CONSTRAINT blog_posts_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: checkboxes checkboxes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY checkboxes
    ADD CONSTRAINT checkboxes_pkey PRIMARY KEY (id);


--
-- Name: classroom_activities classroom_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY classroom_activities
    ADD CONSTRAINT classroom_activities_pkey PRIMARY KEY (id);


--
-- Name: classroom_unit_activity_states classroom_unit_activity_states_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY classroom_unit_activity_states
    ADD CONSTRAINT classroom_unit_activity_states_pkey PRIMARY KEY (id);


--
-- Name: classroom_units classroom_units_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY classroom_units
    ADD CONSTRAINT classroom_units_pkey PRIMARY KEY (id);


--
-- Name: classrooms classrooms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY classrooms
    ADD CONSTRAINT classrooms_pkey PRIMARY KEY (id);


--
-- Name: classrooms_teachers classrooms_teachers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY classrooms_teachers
    ADD CONSTRAINT classrooms_teachers_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: concept_results concept_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY concept_results
    ADD CONSTRAINT concept_results_pkey PRIMARY KEY (id);


--
-- Name: concepts concepts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY concepts
    ADD CONSTRAINT concepts_pkey PRIMARY KEY (id);


--
-- Name: coteacher_classroom_invitations coteacher_classroom_invitations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY coteacher_classroom_invitations
    ADD CONSTRAINT coteacher_classroom_invitations_pkey PRIMARY KEY (id);


--
-- Name: credit_transactions credit_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY credit_transactions
    ADD CONSTRAINT credit_transactions_pkey PRIMARY KEY (id);


--
-- Name: criteria criteria_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY criteria
    ADD CONSTRAINT criteria_pkey PRIMARY KEY (id);


--
-- Name: csv_exports csv_exports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY csv_exports
    ADD CONSTRAINT csv_exports_pkey PRIMARY KEY (id);


--
-- Name: districts districts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY districts
    ADD CONSTRAINT districts_pkey PRIMARY KEY (id);


--
-- Name: file_uploads file_uploads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY file_uploads
    ADD CONSTRAINT file_uploads_pkey PRIMARY KEY (id);


--
-- Name: firebase_apps firebase_apps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY firebase_apps
    ADD CONSTRAINT firebase_apps_pkey PRIMARY KEY (id);


--
-- Name: images images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);


--
-- Name: invitations invitations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY invitations
    ADD CONSTRAINT invitations_pkey PRIMARY KEY (id);


--
-- Name: ip_locations ip_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY ip_locations
    ADD CONSTRAINT ip_locations_pkey PRIMARY KEY (id);


--
-- Name: milestones milestones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY milestones
    ADD CONSTRAINT milestones_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: oauth_access_grants oauth_access_grants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY oauth_access_grants
    ADD CONSTRAINT oauth_access_grants_pkey PRIMARY KEY (id);


--
-- Name: oauth_access_tokens oauth_access_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY oauth_access_tokens
    ADD CONSTRAINT oauth_access_tokens_pkey PRIMARY KEY (id);


--
-- Name: oauth_applications oauth_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY oauth_applications
    ADD CONSTRAINT oauth_applications_pkey PRIMARY KEY (id);


--
-- Name: objectives objectives_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY objectives
    ADD CONSTRAINT objectives_pkey PRIMARY KEY (id);


--
-- Name: page_areas page_areas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY page_areas
    ADD CONSTRAINT page_areas_pkey PRIMARY KEY (id);


--
-- Name: recommendations recommendations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY recommendations
    ADD CONSTRAINT recommendations_pkey PRIMARY KEY (id);


--
-- Name: referrals_users referrals_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY referrals_users
    ADD CONSTRAINT referrals_users_pkey PRIMARY KEY (id);


--
-- Name: referrer_users referrer_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY referrer_users
    ADD CONSTRAINT referrer_users_pkey PRIMARY KEY (id);


--
-- Name: rules_misseds rules_misseds_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY rules_misseds
    ADD CONSTRAINT rules_misseds_pkey PRIMARY KEY (id);


--
-- Name: sales_contacts sales_contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY sales_contacts
    ADD CONSTRAINT sales_contacts_pkey PRIMARY KEY (id);


--
-- Name: sales_stage_types sales_stage_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY sales_stage_types
    ADD CONSTRAINT sales_stage_types_pkey PRIMARY KEY (id);


--
-- Name: sales_stages sales_stages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY sales_stages
    ADD CONSTRAINT sales_stages_pkey PRIMARY KEY (id);


--
-- Name: school_subscriptions school_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY school_subscriptions
    ADD CONSTRAINT school_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: schools_admins schools_admins_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY schools_admins
    ADD CONSTRAINT schools_admins_pkey PRIMARY KEY (id);


--
-- Name: schools schools_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY schools
    ADD CONSTRAINT schools_pkey PRIMARY KEY (id);


--
-- Name: schools_users schools_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY schools_users
    ADD CONSTRAINT schools_users_pkey PRIMARY KEY (id);


--
-- Name: sections sections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY sections
    ADD CONSTRAINT sections_pkey PRIMARY KEY (id);


--
-- Name: students_classrooms students_classrooms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY students_classrooms
    ADD CONSTRAINT students_classrooms_pkey PRIMARY KEY (id);


--
-- Name: subscription_types subscription_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY subscription_types
    ADD CONSTRAINT subscription_types_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: topic_categories topic_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY topic_categories
    ADD CONSTRAINT topic_categories_pkey PRIMARY KEY (id);


--
-- Name: topics topics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY topics
    ADD CONSTRAINT topics_pkey PRIMARY KEY (id);


--
-- Name: unit_activities unit_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY unit_activities
    ADD CONSTRAINT unit_activities_pkey PRIMARY KEY (id);


--
-- Name: unit_template_categories unit_template_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY unit_template_categories
    ADD CONSTRAINT unit_template_categories_pkey PRIMARY KEY (id);


--
-- Name: unit_templates unit_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY unit_templates
    ADD CONSTRAINT unit_templates_pkey PRIMARY KEY (id);


--
-- Name: units units_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY units
    ADD CONSTRAINT units_pkey PRIMARY KEY (id);


--
-- Name: user_milestones user_milestones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY user_milestones
    ADD CONSTRAINT user_milestones_pkey PRIMARY KEY (id);


--
-- Name: user_subscriptions user_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY user_subscriptions
    ADD CONSTRAINT user_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: aut; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX aut ON activities_unit_templates USING btree (activity_id, unit_template_id);


--
-- Name: classroom_invitee_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX classroom_invitee_index ON coteacher_classroom_invitations USING btree (invitation_id, classroom_id);


--
-- Name: email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX email_idx ON users USING gin (email gin_trgm_ops);


--
-- Name: index_act_category_acts_on_act_id_and_act_cat_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_act_category_acts_on_act_id_and_act_cat_id ON activity_category_activities USING btree (activity_id, activity_category_id);


--
-- Name: index_activities_on_activity_classification_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_activities_on_activity_classification_id ON activities USING btree (activity_classification_id);


--
-- Name: index_activities_on_topic_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_activities_on_topic_id ON activities USING btree (topic_id);


--
-- Name: index_activities_on_uid; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_activities_on_uid ON activities USING btree (uid);


--
-- Name: index_activity_classifications_on_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_activity_classifications_on_key ON activity_classifications USING btree (key);


--
-- Name: index_activity_classifications_on_uid; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_activity_classifications_on_uid ON activity_classifications USING btree (uid);


--
-- Name: index_activity_sessions_on_activity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_activity_sessions_on_activity_id ON activity_sessions USING btree (activity_id);


--
-- Name: index_activity_sessions_on_classroom_activity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_activity_sessions_on_classroom_activity_id ON activity_sessions USING btree (classroom_activity_id);


--
-- Name: index_activity_sessions_on_completed_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_activity_sessions_on_completed_at ON activity_sessions USING btree (completed_at);


--
-- Name: index_activity_sessions_on_pairing_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_activity_sessions_on_pairing_id ON activity_sessions USING btree (pairing_id);


--
-- Name: index_activity_sessions_on_started_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_activity_sessions_on_started_at ON activity_sessions USING btree (started_at);


--
-- Name: index_activity_sessions_on_state; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_activity_sessions_on_state ON activity_sessions USING btree (state);


--
-- Name: index_activity_sessions_on_uid; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_activity_sessions_on_uid ON activity_sessions USING btree (uid);


--
-- Name: index_activity_sessions_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_activity_sessions_on_user_id ON activity_sessions USING btree (user_id);


--
-- Name: index_admin_accounts_admins_on_admin_account_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_admin_accounts_admins_on_admin_account_id ON admin_accounts_admins USING btree (admin_account_id);


--
-- Name: index_admin_accounts_admins_on_admin_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_admin_accounts_admins_on_admin_id ON admin_accounts_admins USING btree (admin_id);


--
-- Name: index_admin_accounts_teachers_on_admin_account_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_admin_accounts_teachers_on_admin_account_id ON admin_accounts_teachers USING btree (admin_account_id);


--
-- Name: index_admin_accounts_teachers_on_teacher_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_admin_accounts_teachers_on_teacher_id ON admin_accounts_teachers USING btree (teacher_id);


--
-- Name: index_announcements_on_start_and_end; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_announcements_on_start_and_end ON announcements USING btree (start, "end" DESC);


--
-- Name: index_auth_credentials_on_access_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_auth_credentials_on_access_token ON auth_credentials USING btree (access_token);


--
-- Name: index_auth_credentials_on_provider; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_auth_credentials_on_provider ON auth_credentials USING btree (provider);


--
-- Name: index_auth_credentials_on_refresh_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_auth_credentials_on_refresh_token ON auth_credentials USING btree (refresh_token);


--
-- Name: index_auth_credentials_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_auth_credentials_on_user_id ON auth_credentials USING btree (user_id);


--
-- Name: index_blog_posts_on_author_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_blog_posts_on_author_id ON blog_posts USING btree (author_id);


--
-- Name: index_blog_posts_on_read_count; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_blog_posts_on_read_count ON blog_posts USING btree (read_count);


--
-- Name: index_blog_posts_on_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_blog_posts_on_slug ON blog_posts USING btree (slug);


--
-- Name: index_blog_posts_on_title; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_blog_posts_on_title ON blog_posts USING btree (title);


--
-- Name: index_blog_posts_on_topic; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_blog_posts_on_topic ON blog_posts USING btree (topic);


--
-- Name: index_checkboxes_on_user_id_and_objective_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_checkboxes_on_user_id_and_objective_id ON checkboxes USING btree (user_id, objective_id);


--
-- Name: index_classroom_activities_on_activity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_classroom_activities_on_activity_id ON classroom_activities USING btree (activity_id);


--
-- Name: index_classroom_activities_on_classroom_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_classroom_activities_on_classroom_id ON classroom_activities USING btree (classroom_id);


--
-- Name: index_classroom_activities_on_classroom_id_and_pinned; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_classroom_activities_on_classroom_id_and_pinned ON classroom_activities USING btree (classroom_id, pinned) WHERE (pinned = true);


--
-- Name: index_classroom_activities_on_unit_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_classroom_activities_on_unit_id ON classroom_activities USING btree (unit_id);


--
-- Name: index_classroom_activities_on_updated_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_classroom_activities_on_updated_at ON classroom_activities USING btree (updated_at);


--
-- Name: index_classroom_unit_activity_states_on_classroom_unit_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_classroom_unit_activity_states_on_classroom_unit_id ON classroom_unit_activity_states USING btree (classroom_unit_id);


--
-- Name: index_classroom_unit_activity_states_on_unit_activity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_classroom_unit_activity_states_on_unit_activity_id ON classroom_unit_activity_states USING btree (unit_activity_id);


--
-- Name: index_classroom_units_on_classroom_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_classroom_units_on_classroom_id ON classroom_units USING btree (classroom_id);


--
-- Name: index_classroom_units_on_unit_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_classroom_units_on_unit_id ON classroom_units USING btree (unit_id);


--
-- Name: index_classroom_units_on_unit_id_and_classroom_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_classroom_units_on_unit_id_and_classroom_id ON classroom_units USING btree (unit_id, classroom_id);


--
-- Name: index_classrooms_on_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_classrooms_on_code ON classrooms USING btree (code);


--
-- Name: index_classrooms_on_grade; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_classrooms_on_grade ON classrooms USING btree (grade);


--
-- Name: index_classrooms_on_grade_level; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_classrooms_on_grade_level ON classrooms USING btree (grade_level);


--
-- Name: index_classrooms_on_teacher_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_classrooms_on_teacher_id ON classrooms USING btree (teacher_id);


--
-- Name: index_classrooms_teachers_on_classroom_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_classrooms_teachers_on_classroom_id ON classrooms_teachers USING btree (classroom_id);


--
-- Name: index_classrooms_teachers_on_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_classrooms_teachers_on_role ON classrooms_teachers USING btree (role);


--
-- Name: index_classrooms_teachers_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_classrooms_teachers_on_user_id ON classrooms_teachers USING btree (user_id);


--
-- Name: index_comments_on_ancestry; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_comments_on_ancestry ON comments USING btree (ancestry);


--
-- Name: index_concept_results_on_activity_classification_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_concept_results_on_activity_classification_id ON concept_results USING btree (activity_classification_id);


--
-- Name: index_concept_results_on_activity_session_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_concept_results_on_activity_session_id ON concept_results USING btree (activity_session_id);


--
-- Name: index_concept_results_on_question_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_concept_results_on_question_type ON concept_results USING btree (question_type);


--
-- Name: index_coteacher_classroom_invitations_on_classroom_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_coteacher_classroom_invitations_on_classroom_id ON coteacher_classroom_invitations USING btree (classroom_id);


--
-- Name: index_coteacher_classroom_invitations_on_invitation_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_coteacher_classroom_invitations_on_invitation_id ON coteacher_classroom_invitations USING btree (invitation_id);


--
-- Name: index_credit_transactions_on_source_type_and_source_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_credit_transactions_on_source_type_and_source_id ON credit_transactions USING btree (source_type, source_id);


--
-- Name: index_credit_transactions_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_credit_transactions_on_user_id ON credit_transactions USING btree (user_id);


--
-- Name: index_criteria_on_concept_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_criteria_on_concept_id ON criteria USING btree (concept_id);


--
-- Name: index_criteria_on_recommendation_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_criteria_on_recommendation_id ON criteria USING btree (recommendation_id);


--
-- Name: index_districts_users_on_district_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_districts_users_on_district_id ON districts_users USING btree (district_id);


--
-- Name: index_districts_users_on_district_id_and_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_districts_users_on_district_id_and_user_id ON districts_users USING btree (district_id, user_id);


--
-- Name: index_districts_users_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_districts_users_on_user_id ON districts_users USING btree (user_id);


--
-- Name: index_invitations_on_invitee_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_invitations_on_invitee_email ON invitations USING btree (invitee_email);


--
-- Name: index_invitations_on_inviter_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_invitations_on_inviter_id ON invitations USING btree (inviter_id);


--
-- Name: index_ip_locations_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ip_locations_on_user_id ON ip_locations USING btree (user_id);


--
-- Name: index_ip_locations_on_zip; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ip_locations_on_zip ON ip_locations USING btree (zip);


--
-- Name: index_milestones_on_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_milestones_on_name ON milestones USING btree (name);


--
-- Name: index_notifications_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_notifications_on_user_id ON notifications USING btree (user_id);


--
-- Name: index_oauth_access_grants_on_token; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_oauth_access_grants_on_token ON oauth_access_grants USING btree (token);


--
-- Name: index_oauth_access_tokens_on_refresh_token; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_oauth_access_tokens_on_refresh_token ON oauth_access_tokens USING btree (refresh_token);


--
-- Name: index_oauth_access_tokens_on_resource_owner_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_oauth_access_tokens_on_resource_owner_id ON oauth_access_tokens USING btree (resource_owner_id);


--
-- Name: index_oauth_access_tokens_on_token; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_oauth_access_tokens_on_token ON oauth_access_tokens USING btree (token);


--
-- Name: index_oauth_applications_on_uid; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_oauth_applications_on_uid ON oauth_applications USING btree (uid);


--
-- Name: index_recommendations_on_activity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_recommendations_on_activity_id ON recommendations USING btree (activity_id);


--
-- Name: index_recommendations_on_unit_template_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_recommendations_on_unit_template_id ON recommendations USING btree (unit_template_id);


--
-- Name: index_referrals_users_on_referred_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_referrals_users_on_referred_user_id ON referrals_users USING btree (referred_user_id);


--
-- Name: index_referrals_users_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_referrals_users_on_user_id ON referrals_users USING btree (user_id);


--
-- Name: index_referrer_users_on_referral_code; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_referrer_users_on_referral_code ON referrer_users USING btree (referral_code);


--
-- Name: index_referrer_users_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_referrer_users_on_user_id ON referrer_users USING btree (user_id);


--
-- Name: index_sales_contacts_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_sales_contacts_on_user_id ON sales_contacts USING btree (user_id);


--
-- Name: index_sales_stage_types_on_name_and_order; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_sales_stage_types_on_name_and_order ON sales_stage_types USING btree (name, "order");


--
-- Name: index_sales_stages_on_sales_contact_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_sales_stages_on_sales_contact_id ON sales_stages USING btree (sales_contact_id);


--
-- Name: index_sales_stages_on_sales_stage_type_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_sales_stages_on_sales_stage_type_id ON sales_stages USING btree (sales_stage_type_id);


--
-- Name: index_sales_stages_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_sales_stages_on_user_id ON sales_stages USING btree (user_id);


--
-- Name: index_school_subscriptions_on_school_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_school_subscriptions_on_school_id ON school_subscriptions USING btree (school_id);


--
-- Name: index_school_subscriptions_on_subscription_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_school_subscriptions_on_subscription_id ON school_subscriptions USING btree (subscription_id);


--
-- Name: index_schools_admins_on_school_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_schools_admins_on_school_id ON schools_admins USING btree (school_id);


--
-- Name: index_schools_admins_on_school_id_and_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_schools_admins_on_school_id_and_user_id ON schools_admins USING btree (school_id, user_id);


--
-- Name: index_schools_admins_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_schools_admins_on_user_id ON schools_admins USING btree (user_id);


--
-- Name: index_schools_on_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_schools_on_name ON schools USING btree (name);


--
-- Name: index_schools_on_nces_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_schools_on_nces_id ON schools USING btree (nces_id);


--
-- Name: index_schools_on_state; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_schools_on_state ON schools USING btree (state);


--
-- Name: index_schools_on_zipcode; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_schools_on_zipcode ON schools USING btree (zipcode);


--
-- Name: index_schools_users_on_school_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_schools_users_on_school_id ON schools_users USING btree (school_id);


--
-- Name: index_schools_users_on_school_id_and_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_schools_users_on_school_id_and_user_id ON schools_users USING btree (school_id, user_id);


--
-- Name: index_schools_users_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_schools_users_on_user_id ON schools_users USING btree (user_id);


--
-- Name: index_students_classrooms_on_classroom_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_students_classrooms_on_classroom_id ON students_classrooms USING btree (classroom_id);


--
-- Name: index_students_classrooms_on_student_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_students_classrooms_on_student_id ON students_classrooms USING btree (student_id);


--
-- Name: index_students_classrooms_on_student_id_and_classroom_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_students_classrooms_on_student_id_and_classroom_id ON students_classrooms USING btree (student_id, classroom_id);


--
-- Name: index_subscription_types_on_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_subscription_types_on_name ON subscription_types USING btree (name);


--
-- Name: index_subscriptions_on_de_activated_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_subscriptions_on_de_activated_date ON subscriptions USING btree (de_activated_date);


--
-- Name: index_subscriptions_on_purchaser_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_subscriptions_on_purchaser_email ON subscriptions USING btree (purchaser_email);


--
-- Name: index_subscriptions_on_purchaser_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_subscriptions_on_purchaser_id ON subscriptions USING btree (purchaser_id);


--
-- Name: index_subscriptions_on_recurring; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_subscriptions_on_recurring ON subscriptions USING btree (recurring);


--
-- Name: index_subscriptions_on_start_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_subscriptions_on_start_date ON subscriptions USING btree (start_date);


--
-- Name: index_topic_categories_on_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_topic_categories_on_name ON topic_categories USING btree (name);


--
-- Name: index_topics_on_topic_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_topics_on_topic_category_id ON topics USING btree (topic_category_id);


--
-- Name: index_unit_activities_on_activity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_unit_activities_on_activity_id ON unit_activities USING btree (activity_id);


--
-- Name: index_unit_activities_on_unit_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_unit_activities_on_unit_id ON unit_activities USING btree (unit_id);


--
-- Name: index_unit_activities_on_unit_id_and_activity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_unit_activities_on_unit_id_and_activity_id ON unit_activities USING btree (unit_id, activity_id);


--
-- Name: index_unit_templates_on_activity_info; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_unit_templates_on_activity_info ON unit_templates USING btree (activity_info);


--
-- Name: index_unit_templates_on_author_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_unit_templates_on_author_id ON unit_templates USING btree (author_id);


--
-- Name: index_unit_templates_on_unit_template_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_unit_templates_on_unit_template_category_id ON unit_templates USING btree (unit_template_category_id);


--
-- Name: index_units_on_unit_template_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_units_on_unit_template_id ON units USING btree (unit_template_id);


--
-- Name: index_units_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_units_on_user_id ON units USING btree (user_id);


--
-- Name: index_user_milestones_on_milestone_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_user_milestones_on_milestone_id ON user_milestones USING btree (milestone_id);


--
-- Name: index_user_milestones_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_user_milestones_on_user_id ON user_milestones USING btree (user_id);


--
-- Name: index_user_milestones_on_user_id_and_milestone_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_user_milestones_on_user_id_and_milestone_id ON user_milestones USING btree (user_id, milestone_id);


--
-- Name: index_user_subscriptions_on_subscription_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_user_subscriptions_on_subscription_id ON user_subscriptions USING btree (subscription_id);


--
-- Name: index_user_subscriptions_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_user_subscriptions_on_user_id ON user_subscriptions USING btree (user_id);


--
-- Name: index_users_on_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_active ON users USING btree (active);


--
-- Name: index_users_on_classcode; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_classcode ON users USING btree (classcode);


--
-- Name: index_users_on_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_email ON users USING btree (email);


--
-- Name: index_users_on_flags; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_flags ON users USING btree (flags);


--
-- Name: index_users_on_google_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_google_id ON users USING btree (google_id);


--
-- Name: index_users_on_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_role ON users USING btree (role);


--
-- Name: index_users_on_stripe_customer_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_stripe_customer_id ON users USING btree (stripe_customer_id);


--
-- Name: index_users_on_time_zone; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_time_zone ON users USING btree (time_zone);


--
-- Name: index_users_on_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_token ON users USING btree (token);


--
-- Name: index_users_on_username; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_username ON users USING btree (username);


--
-- Name: name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX name_idx ON users USING gin (name gin_trgm_ops);


--
-- Name: tsv_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tsv_idx ON blog_posts USING gin (tsv);


--
-- Name: unique_classroom_and_activity_for_cua_state; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_classroom_and_activity_for_cua_state ON classroom_unit_activity_states USING btree (classroom_unit_id, unit_activity_id);


--
-- Name: unique_classroom_and_user_ids_on_classrooms_teachers; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_classroom_and_user_ids_on_classrooms_teachers ON classrooms_teachers USING btree (user_id, classroom_id);


--
-- Name: unique_index_schools_on_nces_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_index_schools_on_nces_id ON schools USING btree (nces_id) WHERE ((nces_id)::text <> ''::text);


--
-- Name: unique_index_schools_on_ppin; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_index_schools_on_ppin ON schools USING btree (ppin) WHERE ((ppin)::text <> ''::text);


--
-- Name: unique_index_users_on_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_index_users_on_email ON users USING btree (email) WHERE ((id > 1641954) AND (email IS NOT NULL) AND ((email)::text <> ''::text));


--
-- Name: unique_index_users_on_google_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_index_users_on_google_id ON users USING btree (google_id) WHERE ((id > 1641954) AND (google_id IS NOT NULL) AND ((google_id)::text <> ''::text));


--
-- Name: unique_index_users_on_username; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_index_users_on_username ON users USING btree (username) WHERE ((id > 1641954) AND (username IS NOT NULL) AND ((username)::text <> ''::text));


--
-- Name: unique_schema_migrations; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_schema_migrations ON schema_migrations USING btree (version);


--
-- Name: username_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX username_idx ON users USING gin (username gin_trgm_ops);


--
-- Name: users_to_tsvector_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_to_tsvector_idx ON users USING gin (to_tsvector('english'::regconfig, (name)::text));


--
-- Name: users_to_tsvector_idx1; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_to_tsvector_idx1 ON users USING gin (to_tsvector('english'::regconfig, (email)::text));


--
-- Name: users_to_tsvector_idx10; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_to_tsvector_idx10 ON users USING gin (to_tsvector('english'::regconfig, (username)::text));


--
-- Name: users_to_tsvector_idx11; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_to_tsvector_idx11 ON users USING gin (to_tsvector('english'::regconfig, split_part((ip_address)::text, '/'::text, 1)));


--
-- Name: users_to_tsvector_idx2; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_to_tsvector_idx2 ON users USING gin (to_tsvector('english'::regconfig, (role)::text));


--
-- Name: users_to_tsvector_idx3; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_to_tsvector_idx3 ON users USING gin (to_tsvector('english'::regconfig, (classcode)::text));


--
-- Name: users_to_tsvector_idx4; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_to_tsvector_idx4 ON users USING gin (to_tsvector('english'::regconfig, (username)::text));


--
-- Name: users_to_tsvector_idx5; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_to_tsvector_idx5 ON users USING gin (to_tsvector('english'::regconfig, split_part((ip_address)::text, '/'::text, 1)));


--
-- Name: users_to_tsvector_idx6; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_to_tsvector_idx6 ON users USING gin (to_tsvector('english'::regconfig, (name)::text));


--
-- Name: users_to_tsvector_idx7; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_to_tsvector_idx7 ON users USING gin (to_tsvector('english'::regconfig, (email)::text));


--
-- Name: users_to_tsvector_idx8; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_to_tsvector_idx8 ON users USING gin (to_tsvector('english'::regconfig, (role)::text));


--
-- Name: users_to_tsvector_idx9; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_to_tsvector_idx9 ON users USING gin (to_tsvector('english'::regconfig, (classcode)::text));


--
-- Name: uta; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX uta ON activities_unit_templates USING btree (unit_template_id, activity_id);


--
-- Name: blog_posts tsvectorupdate; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE ON blog_posts FOR EACH ROW EXECUTE PROCEDURE blog_posts_search_trigger();


--
-- Name: units fk_rails_0b3b28b65f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY units
    ADD CONSTRAINT fk_rails_0b3b28b65f FOREIGN KEY (unit_template_id) REFERENCES unit_templates(id);


--
-- Name: classroom_units fk_rails_3e1ff09783; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY classroom_units
    ADD CONSTRAINT fk_rails_3e1ff09783 FOREIGN KEY (unit_id) REFERENCES units(id);


--
-- Name: sales_stages fk_rails_41082adef9; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY sales_stages
    ADD CONSTRAINT fk_rails_41082adef9 FOREIGN KEY (sales_contact_id) REFERENCES sales_contacts(id);


--
-- Name: classroom_unit_activity_states fk_rails_457a11a3eb; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY classroom_unit_activity_states
    ADD CONSTRAINT fk_rails_457a11a3eb FOREIGN KEY (classroom_unit_id) REFERENCES classroom_units(id);


--
-- Name: unit_activities fk_rails_48bcb0b8a0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY unit_activities
    ADD CONSTRAINT fk_rails_48bcb0b8a0 FOREIGN KEY (unit_id) REFERENCES units(id);


--
-- Name: criteria fk_rails_63b994bcda; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY criteria
    ADD CONSTRAINT fk_rails_63b994bcda FOREIGN KEY (recommendation_id) REFERENCES recommendations(id);


--
-- Name: recommendations fk_rails_6745e4bc86; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY recommendations
    ADD CONSTRAINT fk_rails_6745e4bc86 FOREIGN KEY (unit_template_id) REFERENCES unit_templates(id);


--
-- Name: classroom_units fk_rails_a3c514fc6d; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY classroom_units
    ADD CONSTRAINT fk_rails_a3c514fc6d FOREIGN KEY (classroom_id) REFERENCES classrooms(id);


--
-- Name: sales_stages fk_rails_a8025d2621; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY sales_stages
    ADD CONSTRAINT fk_rails_a8025d2621 FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: criteria fk_rails_ada79930c6; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY criteria
    ADD CONSTRAINT fk_rails_ada79930c6 FOREIGN KEY (concept_id) REFERENCES concepts(id);


--
-- Name: notifications fk_rails_b080fb4855; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY notifications
    ADD CONSTRAINT fk_rails_b080fb4855 FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: unit_activities fk_rails_b921d87b04; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY unit_activities
    ADD CONSTRAINT fk_rails_b921d87b04 FOREIGN KEY (activity_id) REFERENCES activities(id);


--
-- Name: classroom_unit_activity_states fk_rails_bab346c597; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY classroom_unit_activity_states
    ADD CONSTRAINT fk_rails_bab346c597 FOREIGN KEY (unit_activity_id) REFERENCES unit_activities(id);


--
-- Name: concept_results fk_rails_cebe4a6023; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY concept_results
    ADD CONSTRAINT fk_rails_cebe4a6023 FOREIGN KEY (activity_classification_id) REFERENCES activity_classifications(id);


--
-- Name: sales_contacts fk_rails_d6738e130a; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY sales_contacts
    ADD CONSTRAINT fk_rails_d6738e130a FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: recommendations fk_rails_dc326309ed; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY recommendations
    ADD CONSTRAINT fk_rails_dc326309ed FOREIGN KEY (activity_id) REFERENCES activities(id);


--
-- Name: sales_stages fk_rails_e5da9d6c2d; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY sales_stages
    ADD CONSTRAINT fk_rails_e5da9d6c2d FOREIGN KEY (sales_stage_type_id) REFERENCES sales_stage_types(id);


--
-- Name: auth_credentials fk_rails_f92a275310; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY auth_credentials
    ADD CONSTRAINT fk_rails_f92a275310 FOREIGN KEY (user_id) REFERENCES users(id);


--
-- PostgreSQL database dump complete
--

SET search_path TO "$user", public;

INSERT INTO schema_migrations (version) VALUES ('20121024193845');

INSERT INTO schema_migrations (version) VALUES ('20121211230953');

INSERT INTO schema_migrations (version) VALUES ('20121211231231');

INSERT INTO schema_migrations (version) VALUES ('20121214024613');

INSERT INTO schema_migrations (version) VALUES ('20121218155200');

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

INSERT INTO schema_migrations (version) VALUES ('20130510221334');

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

INSERT INTO schema_migrations (version) VALUES ('20180815174156');

INSERT INTO schema_migrations (version) VALUES ('20180815180204');

INSERT INTO schema_migrations (version) VALUES ('20180816210411');

