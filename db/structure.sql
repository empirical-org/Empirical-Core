--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.3
-- Dumped by pg_dump version 9.5.3

SET statement_timeout = 0;
SET lock_timeout = 0;
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
    follow_up_activity_id integer
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
    locked_by_default boolean DEFAULT false
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
    visible boolean DEFAULT true NOT NULL
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
-- Name: authors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE authors (
    id integer NOT NULL,
    name character varying(255),
    avatar_file_name character varying(255),
    avatar_content_type character varying(255),
    avatar_file_size integer,
    avatar_updated_at timestamp without time zone,
    description text
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
    pinned boolean DEFAULT false
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
    updated_at timestamp without time zone
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
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE schema_migrations (
    version character varying(255) NOT NULL
);


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
    clever_id character varying(255)
);


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
    user_id integer
);


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
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE subscriptions (
    id integer NOT NULL,
    user_id integer,
    expiration date,
    account_limit integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    account_type character varying
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
-- Name: unit_template_units; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE unit_template_units (
    id integer NOT NULL,
    unit_id integer,
    unit_template_id integer
);


--
-- Name: unit_template_units_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE unit_template_units_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: unit_template_units_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE unit_template_units_id_seq OWNED BY unit_template_units.id;


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
    problem text,
    summary text,
    teacher_review text,
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
    user_id integer
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
    flag character varying,
    google_id character varying,
    last_sign_in timestamp without time zone
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
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY activities ALTER COLUMN id SET DEFAULT nextval('activities_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY activity_classifications ALTER COLUMN id SET DEFAULT nextval('activity_classifications_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY activity_sessions ALTER COLUMN id SET DEFAULT nextval('activity_sessions_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY admin_accounts ALTER COLUMN id SET DEFAULT nextval('admin_accounts_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY admin_accounts_admins ALTER COLUMN id SET DEFAULT nextval('admin_accounts_admins_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY admin_accounts_teachers ALTER COLUMN id SET DEFAULT nextval('admin_accounts_teachers_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY authors ALTER COLUMN id SET DEFAULT nextval('authors_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY categories ALTER COLUMN id SET DEFAULT nextval('categories_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY checkboxes ALTER COLUMN id SET DEFAULT nextval('checkboxes_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY classroom_activities ALTER COLUMN id SET DEFAULT nextval('classroom_activities_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY classrooms ALTER COLUMN id SET DEFAULT nextval('classrooms_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY comments ALTER COLUMN id SET DEFAULT nextval('comments_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY concept_results ALTER COLUMN id SET DEFAULT nextval('concept_results_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY concepts ALTER COLUMN id SET DEFAULT nextval('concepts_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY csv_exports ALTER COLUMN id SET DEFAULT nextval('csv_exports_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY districts ALTER COLUMN id SET DEFAULT nextval('districts_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY file_uploads ALTER COLUMN id SET DEFAULT nextval('file_uploads_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY firebase_apps ALTER COLUMN id SET DEFAULT nextval('firebase_apps_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY ip_locations ALTER COLUMN id SET DEFAULT nextval('ip_locations_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY milestones ALTER COLUMN id SET DEFAULT nextval('milestones_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY oauth_access_grants ALTER COLUMN id SET DEFAULT nextval('oauth_access_grants_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY oauth_access_tokens ALTER COLUMN id SET DEFAULT nextval('oauth_access_tokens_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY oauth_applications ALTER COLUMN id SET DEFAULT nextval('oauth_applications_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY objectives ALTER COLUMN id SET DEFAULT nextval('objectives_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY page_areas ALTER COLUMN id SET DEFAULT nextval('page_areas_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY rules_misseds ALTER COLUMN id SET DEFAULT nextval('rules_misseds_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY schools ALTER COLUMN id SET DEFAULT nextval('schools_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY sections ALTER COLUMN id SET DEFAULT nextval('sections_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY students_classrooms ALTER COLUMN id SET DEFAULT nextval('students_classrooms_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY subscriptions ALTER COLUMN id SET DEFAULT nextval('subscriptions_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY topic_categories ALTER COLUMN id SET DEFAULT nextval('topic_categories_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY topics ALTER COLUMN id SET DEFAULT nextval('topics_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY unit_template_categories ALTER COLUMN id SET DEFAULT nextval('unit_template_categories_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY unit_template_units ALTER COLUMN id SET DEFAULT nextval('unit_template_units_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY unit_templates ALTER COLUMN id SET DEFAULT nextval('unit_templates_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY units ALTER COLUMN id SET DEFAULT nextval('units_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY user_milestones ALTER COLUMN id SET DEFAULT nextval('user_milestones_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Name: activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY activities
    ADD CONSTRAINT activities_pkey PRIMARY KEY (id);


--
-- Name: activity_classifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY activity_classifications
    ADD CONSTRAINT activity_classifications_pkey PRIMARY KEY (id);


--
-- Name: activity_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY activity_sessions
    ADD CONSTRAINT activity_sessions_pkey PRIMARY KEY (id);


--
-- Name: admin_accounts_admins_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY admin_accounts_admins
    ADD CONSTRAINT admin_accounts_admins_pkey PRIMARY KEY (id);


--
-- Name: admin_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY admin_accounts
    ADD CONSTRAINT admin_accounts_pkey PRIMARY KEY (id);


--
-- Name: admin_accounts_teachers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY admin_accounts_teachers
    ADD CONSTRAINT admin_accounts_teachers_pkey PRIMARY KEY (id);


--
-- Name: authors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY authors
    ADD CONSTRAINT authors_pkey PRIMARY KEY (id);


--
-- Name: categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: checkboxes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY checkboxes
    ADD CONSTRAINT checkboxes_pkey PRIMARY KEY (id);


--
-- Name: classroom_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY classroom_activities
    ADD CONSTRAINT classroom_activities_pkey PRIMARY KEY (id);


--
-- Name: classrooms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY classrooms
    ADD CONSTRAINT classrooms_pkey PRIMARY KEY (id);


--
-- Name: comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: concept_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY concept_results
    ADD CONSTRAINT concept_results_pkey PRIMARY KEY (id);


--
-- Name: concepts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY concepts
    ADD CONSTRAINT concepts_pkey PRIMARY KEY (id);


--
-- Name: csv_exports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY csv_exports
    ADD CONSTRAINT csv_exports_pkey PRIMARY KEY (id);


--
-- Name: districts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY districts
    ADD CONSTRAINT districts_pkey PRIMARY KEY (id);


--
-- Name: file_uploads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY file_uploads
    ADD CONSTRAINT file_uploads_pkey PRIMARY KEY (id);


--
-- Name: firebase_apps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY firebase_apps
    ADD CONSTRAINT firebase_apps_pkey PRIMARY KEY (id);


--
-- Name: ip_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY ip_locations
    ADD CONSTRAINT ip_locations_pkey PRIMARY KEY (id);


--
-- Name: milestones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY milestones
    ADD CONSTRAINT milestones_pkey PRIMARY KEY (id);


--
-- Name: oauth_access_grants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY oauth_access_grants
    ADD CONSTRAINT oauth_access_grants_pkey PRIMARY KEY (id);


--
-- Name: oauth_access_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY oauth_access_tokens
    ADD CONSTRAINT oauth_access_tokens_pkey PRIMARY KEY (id);


--
-- Name: oauth_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY oauth_applications
    ADD CONSTRAINT oauth_applications_pkey PRIMARY KEY (id);


--
-- Name: objectives_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY objectives
    ADD CONSTRAINT objectives_pkey PRIMARY KEY (id);


--
-- Name: page_areas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY page_areas
    ADD CONSTRAINT page_areas_pkey PRIMARY KEY (id);


--
-- Name: rules_misseds_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY rules_misseds
    ADD CONSTRAINT rules_misseds_pkey PRIMARY KEY (id);


--
-- Name: schools_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY schools
    ADD CONSTRAINT schools_pkey PRIMARY KEY (id);


--
-- Name: sections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY sections
    ADD CONSTRAINT sections_pkey PRIMARY KEY (id);


--
-- Name: students_classrooms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY students_classrooms
    ADD CONSTRAINT students_classrooms_pkey PRIMARY KEY (id);


--
-- Name: subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: topic_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY topic_categories
    ADD CONSTRAINT topic_categories_pkey PRIMARY KEY (id);


--
-- Name: topics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY topics
    ADD CONSTRAINT topics_pkey PRIMARY KEY (id);


--
-- Name: unit_template_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY unit_template_categories
    ADD CONSTRAINT unit_template_categories_pkey PRIMARY KEY (id);


--
-- Name: unit_template_units_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY unit_template_units
    ADD CONSTRAINT unit_template_units_pkey PRIMARY KEY (id);


--
-- Name: unit_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY unit_templates
    ADD CONSTRAINT unit_templates_pkey PRIMARY KEY (id);


--
-- Name: units_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY units
    ADD CONSTRAINT units_pkey PRIMARY KEY (id);


--
-- Name: user_milestones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY user_milestones
    ADD CONSTRAINT user_milestones_pkey PRIMARY KEY (id);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: aut; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX aut ON activities_unit_templates USING btree (activity_id, unit_template_id);


--
-- Name: email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX email_idx ON users USING gin (email gin_trgm_ops);


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

CREATE INDEX index_schools_users_on_user_id ON schools_users USING btree (user_id);


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
-- Name: index_topic_categories_on_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_topic_categories_on_name ON topic_categories USING btree (name);


--
-- Name: index_topics_on_topic_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_topics_on_topic_category_id ON topics USING btree (topic_category_id);


--
-- Name: index_unit_template_units_on_unit_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_unit_template_units_on_unit_id ON unit_template_units USING btree (unit_id);


--
-- Name: index_unit_template_units_on_unit_template_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_unit_template_units_on_unit_template_id ON unit_template_units USING btree (unit_template_id);


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
-- Name: index_users_on_flag; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_flag ON users USING btree (flag);


--
-- Name: index_users_on_google_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_google_id ON users USING btree (google_id);


--
-- Name: index_users_on_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_role ON users USING btree (role);


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
-- Name: fk_rails_cebe4a6023; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY concept_results
    ADD CONSTRAINT fk_rails_cebe4a6023 FOREIGN KEY (activity_classification_id) REFERENCES activity_classifications(id);


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

INSERT INTO schema_migrations (version) VALUES ('20170526220204');

INSERT INTO schema_migrations (version) VALUES ('20170718160133');

INSERT INTO schema_migrations (version) VALUES ('20170719192243');

INSERT INTO schema_migrations (version) VALUES ('20170720140557');

INSERT INTO schema_migrations (version) VALUES ('20170720195450');

INSERT INTO schema_migrations (version) VALUES ('20170804154221');

INSERT INTO schema_migrations (version) VALUES ('20170804154740');

