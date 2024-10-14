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
-- Name: vector; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;


--
-- Name: EXTENSION vector; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION vector IS 'vector data type and ivfflat and hnsw access methods';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activities (
    id integer NOT NULL,
    name character varying,
    activity_classification_id integer,
    flags character varying[] DEFAULT '{}'::character varying[] NOT NULL
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
-- Name: activity_classifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activity_classifications (
    id integer NOT NULL,
    key character varying
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
-- Name: ar_internal_metadata; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ar_internal_metadata (
    key character varying NOT NULL,
    value character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: change_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.change_logs (
    id integer NOT NULL,
    explanation text,
    action character varying NOT NULL,
    changed_record_id integer NOT NULL,
    changed_record_type character varying NOT NULL,
    user_id integer,
    changed_attribute character varying,
    previous_value character varying,
    new_value character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
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
-- Name: comprehension_activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comprehension_activities (
    id integer NOT NULL,
    title character varying(100),
    parent_activity_id integer,
    target_level smallint,
    scored_level character varying(100),
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    notes character varying,
    version smallint DEFAULT 1 NOT NULL,
    ai_type character varying
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
-- Name: comprehension_automl_models; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comprehension_automl_models (
    id integer NOT NULL,
    automl_model_id character varying NOT NULL,
    name character varying NOT NULL,
    labels character varying[] DEFAULT '{}'::character varying[],
    prompt_id integer,
    state character varying NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    notes text DEFAULT ''::text
);


--
-- Name: comprehension_automl_models_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comprehension_automl_models_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comprehension_automl_models_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comprehension_automl_models_id_seq OWNED BY public.comprehension_automl_models.id;


--
-- Name: comprehension_feedbacks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comprehension_feedbacks (
    id integer NOT NULL,
    rule_id integer NOT NULL,
    text character varying NOT NULL,
    description character varying,
    "order" integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: comprehension_feedbacks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comprehension_feedbacks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comprehension_feedbacks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comprehension_feedbacks_id_seq OWNED BY public.comprehension_feedbacks.id;


--
-- Name: comprehension_highlights; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comprehension_highlights (
    id integer NOT NULL,
    feedback_id integer NOT NULL,
    text character varying NOT NULL,
    highlight_type character varying NOT NULL,
    starting_index integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: comprehension_highlights_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comprehension_highlights_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comprehension_highlights_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comprehension_highlights_id_seq OWNED BY public.comprehension_highlights.id;


--
-- Name: comprehension_labels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comprehension_labels (
    id integer NOT NULL,
    name character varying NOT NULL,
    rule_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: comprehension_labels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comprehension_labels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comprehension_labels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comprehension_labels_id_seq OWNED BY public.comprehension_labels.id;


--
-- Name: comprehension_passages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comprehension_passages (
    id integer NOT NULL,
    activity_id integer,
    text text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    image_link character varying,
    image_alt_text character varying DEFAULT ''::character varying,
    highlight_prompt character varying,
    image_caption text DEFAULT ''::text,
    image_attribution text DEFAULT ''::text,
    essential_knowledge_text character varying DEFAULT ''::character varying
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
-- Name: comprehension_plagiarism_texts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comprehension_plagiarism_texts (
    id integer NOT NULL,
    rule_id integer NOT NULL,
    text character varying NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: comprehension_plagiarism_texts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comprehension_plagiarism_texts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comprehension_plagiarism_texts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comprehension_plagiarism_texts_id_seq OWNED BY public.comprehension_plagiarism_texts.id;


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
    updated_at timestamp without time zone NOT NULL,
    first_strong_example character varying DEFAULT ''::character varying,
    second_strong_example character varying DEFAULT ''::character varying
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
-- Name: comprehension_prompts_rules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comprehension_prompts_rules (
    id integer NOT NULL,
    prompt_id integer NOT NULL,
    rule_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: comprehension_prompts_rules_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comprehension_prompts_rules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comprehension_prompts_rules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comprehension_prompts_rules_id_seq OWNED BY public.comprehension_prompts_rules.id;


--
-- Name: comprehension_regex_rules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comprehension_regex_rules (
    id integer NOT NULL,
    regex_text character varying(200) NOT NULL,
    case_sensitive boolean NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    rule_id integer,
    sequence_type text DEFAULT 'incorrect'::text NOT NULL,
    conditional boolean DEFAULT false
);


--
-- Name: comprehension_regex_rules_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comprehension_regex_rules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comprehension_regex_rules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comprehension_regex_rules_id_seq OWNED BY public.comprehension_regex_rules.id;


--
-- Name: comprehension_rules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comprehension_rules (
    id integer NOT NULL,
    uid character varying NOT NULL,
    name character varying NOT NULL,
    note character varying,
    universal boolean NOT NULL,
    rule_type character varying NOT NULL,
    optimal boolean NOT NULL,
    suborder integer,
    concept_uid character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    state character varying NOT NULL,
    hint_id bigint
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
-- Name: comprehension_turking_round_activity_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comprehension_turking_round_activity_sessions (
    id integer NOT NULL,
    turking_round_id integer,
    activity_session_uid character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: comprehension_turking_round_activity_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comprehension_turking_round_activity_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comprehension_turking_round_activity_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comprehension_turking_round_activity_sessions_id_seq OWNED BY public.comprehension_turking_round_activity_sessions.id;


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
-- Name: evidence_activity_healths; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evidence_activity_healths (
    id bigint NOT NULL,
    name character varying NOT NULL,
    flag character varying NOT NULL,
    activity_id integer NOT NULL,
    version integer NOT NULL,
    version_plays integer NOT NULL,
    total_plays integer NOT NULL,
    completion_rate integer,
    because_final_optimal integer,
    but_final_optimal integer,
    so_final_optimal integer,
    avg_completion_time integer,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: evidence_activity_healths_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.evidence_activity_healths_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: evidence_activity_healths_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.evidence_activity_healths_id_seq OWNED BY public.evidence_activity_healths.id;


--
-- Name: evidence_automl_models; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evidence_automl_models (
    id bigint NOT NULL,
    model_external_id character varying NOT NULL,
    endpoint_external_id character varying NOT NULL,
    name character varying NOT NULL,
    labels character varying[] DEFAULT '{}'::character varying[],
    prompt_id bigint,
    state character varying NOT NULL,
    notes text DEFAULT ''::text,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    project character varying NOT NULL
);


--
-- Name: evidence_automl_models_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.evidence_automl_models_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: evidence_automl_models_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.evidence_automl_models_id_seq OWNED BY public.evidence_automl_models.id;


--
-- Name: evidence_hints; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evidence_hints (
    id bigint NOT NULL,
    explanation character varying NOT NULL,
    image_link character varying NOT NULL,
    image_alt_text character varying NOT NULL,
    rule_id bigint,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    name text
);


--
-- Name: evidence_hints_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.evidence_hints_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: evidence_hints_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.evidence_hints_id_seq OWNED BY public.evidence_hints.id;


--
-- Name: evidence_labeled_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evidence_labeled_entries (
    id bigint NOT NULL,
    entry text NOT NULL,
    label text NOT NULL,
    label_transformed text NOT NULL,
    metadata jsonb,
    prompt_id integer NOT NULL,
    embedding public.vector(1536) NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: evidence_labeled_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.evidence_labeled_entries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: evidence_labeled_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.evidence_labeled_entries_id_seq OWNED BY public.evidence_labeled_entries.id;


--
-- Name: evidence_prompt_healths; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evidence_prompt_healths (
    id bigint NOT NULL,
    prompt_id integer NOT NULL,
    activity_short_name character varying NOT NULL,
    text character varying NOT NULL,
    current_version integer NOT NULL,
    version_responses integer NOT NULL,
    first_attempt_optimal integer,
    final_attempt_optimal integer,
    avg_attempts double precision,
    confidence double precision,
    percent_automl_consecutive_repeated integer,
    percent_automl integer,
    percent_plagiarism integer,
    percent_opinion integer,
    percent_grammar integer,
    percent_spelling integer,
    avg_time_spent_per_prompt integer,
    evidence_activity_health_id bigint,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: evidence_prompt_healths_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.evidence_prompt_healths_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: evidence_prompt_healths_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.evidence_prompt_healths_id_seq OWNED BY public.evidence_prompt_healths.id;


--
-- Name: evidence_prompt_response_feedbacks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evidence_prompt_response_feedbacks (
    id bigint NOT NULL,
    prompt_response_id integer NOT NULL,
    feedback text NOT NULL,
    metadata jsonb,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: evidence_prompt_response_feedbacks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.evidence_prompt_response_feedbacks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: evidence_prompt_response_feedbacks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.evidence_prompt_response_feedbacks_id_seq OWNED BY public.evidence_prompt_response_feedbacks.id;


--
-- Name: evidence_prompt_responses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evidence_prompt_responses (
    id bigint NOT NULL,
    prompt_id integer NOT NULL,
    response_text text NOT NULL,
    embedding public.vector NOT NULL
);


--
-- Name: evidence_prompt_responses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.evidence_prompt_responses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: evidence_prompt_responses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.evidence_prompt_responses_id_seq OWNED BY public.evidence_prompt_responses.id;


--
-- Name: evidence_prompt_text_batches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evidence_prompt_text_batches (
    id bigint NOT NULL,
    type character varying NOT NULL,
    prompt_id integer NOT NULL,
    config jsonb,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: evidence_prompt_text_batches_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.evidence_prompt_text_batches_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: evidence_prompt_text_batches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.evidence_prompt_text_batches_id_seq OWNED BY public.evidence_prompt_text_batches.id;


--
-- Name: evidence_prompt_texts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evidence_prompt_texts (
    id bigint NOT NULL,
    prompt_text_batch_id integer NOT NULL,
    text_generation_id integer NOT NULL,
    text character varying NOT NULL,
    label character varying,
    ml_type character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: evidence_prompt_texts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.evidence_prompt_texts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: evidence_prompt_texts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.evidence_prompt_texts_id_seq OWNED BY public.evidence_prompt_texts.id;


--
-- Name: evidence_research_gen_ai_activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evidence_research_gen_ai_activities (
    id bigint NOT NULL,
    text text NOT NULL,
    name character varying NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    because_text text DEFAULT ''::text NOT NULL,
    but_text text DEFAULT ''::text NOT NULL,
    so_text text DEFAULT ''::text NOT NULL
);


--
-- Name: evidence_research_gen_ai_activities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.evidence_research_gen_ai_activities_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: evidence_research_gen_ai_activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.evidence_research_gen_ai_activities_id_seq OWNED BY public.evidence_research_gen_ai_activities.id;


--
-- Name: evidence_research_gen_ai_comparisons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evidence_research_gen_ai_comparisons (
    id bigint NOT NULL,
    dataset_id integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: evidence_research_gen_ai_comparisons_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.evidence_research_gen_ai_comparisons_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: evidence_research_gen_ai_comparisons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.evidence_research_gen_ai_comparisons_id_seq OWNED BY public.evidence_research_gen_ai_comparisons.id;


--
-- Name: evidence_research_gen_ai_datasets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evidence_research_gen_ai_datasets (
    id bigint NOT NULL,
    stem_vault_id integer NOT NULL,
    optimal_count integer DEFAULT 0 NOT NULL,
    suboptimal_count integer DEFAULT 0 NOT NULL,
    locked boolean DEFAULT false NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    version integer NOT NULL,
    parent_id integer
);


--
-- Name: evidence_research_gen_ai_datasets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.evidence_research_gen_ai_datasets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: evidence_research_gen_ai_datasets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.evidence_research_gen_ai_datasets_id_seq OWNED BY public.evidence_research_gen_ai_datasets.id;


--
-- Name: evidence_research_gen_ai_g_eval_scores; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evidence_research_gen_ai_g_eval_scores (
    id bigint NOT NULL,
    trial_id integer NOT NULL,
    g_eval_id integer NOT NULL,
    llm_example_id integer NOT NULL,
    score integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: evidence_research_gen_ai_g_eval_scores_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.evidence_research_gen_ai_g_eval_scores_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: evidence_research_gen_ai_g_eval_scores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.evidence_research_gen_ai_g_eval_scores_id_seq OWNED BY public.evidence_research_gen_ai_g_eval_scores.id;


--
-- Name: evidence_research_gen_ai_g_evals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evidence_research_gen_ai_g_evals (
    id bigint NOT NULL,
    task_introduction text NOT NULL,
    evaluation_criteria text NOT NULL,
    evaluation_steps text NOT NULL,
    metric character varying NOT NULL,
    max_score integer NOT NULL,
    selectable boolean DEFAULT true,
    misc jsonb DEFAULT '{}'::jsonb,
    version integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: evidence_research_gen_ai_g_evals_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.evidence_research_gen_ai_g_evals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: evidence_research_gen_ai_g_evals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.evidence_research_gen_ai_g_evals_id_seq OWNED BY public.evidence_research_gen_ai_g_evals.id;


--
-- Name: evidence_research_gen_ai_guidelines; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evidence_research_gen_ai_guidelines (
    id bigint NOT NULL,
    curriculum_assigned_status character varying NOT NULL,
    text text NOT NULL,
    stem_vault_id integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    visible boolean DEFAULT true NOT NULL
);


--
-- Name: evidence_research_gen_ai_guidelines_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.evidence_research_gen_ai_guidelines_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: evidence_research_gen_ai_guidelines_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.evidence_research_gen_ai_guidelines_id_seq OWNED BY public.evidence_research_gen_ai_guidelines.id;


--
-- Name: evidence_research_gen_ai_llm_examples; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evidence_research_gen_ai_llm_examples (
    id bigint NOT NULL,
    test_example_id integer NOT NULL,
    llm_feedback text NOT NULL,
    label character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    trial_id integer NOT NULL,
    raw_text text NOT NULL,
    llm_assigned_status character varying NOT NULL
);


--
-- Name: evidence_research_gen_ai_llm_examples_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.evidence_research_gen_ai_llm_examples_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: evidence_research_gen_ai_llm_examples_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.evidence_research_gen_ai_llm_examples_id_seq OWNED BY public.evidence_research_gen_ai_llm_examples.id;


--
-- Name: evidence_research_gen_ai_llm_prompt_guidelines; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evidence_research_gen_ai_llm_prompt_guidelines (
    id bigint NOT NULL,
    llm_prompt_id integer NOT NULL,
    guideline_id integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: evidence_research_gen_ai_llm_prompt_guidelines_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.evidence_research_gen_ai_llm_prompt_guidelines_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: evidence_research_gen_ai_llm_prompt_guidelines_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.evidence_research_gen_ai_llm_prompt_guidelines_id_seq OWNED BY public.evidence_research_gen_ai_llm_prompt_guidelines.id;


--
-- Name: evidence_research_gen_ai_llm_prompt_prompt_examples; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evidence_research_gen_ai_llm_prompt_prompt_examples (
    id bigint NOT NULL,
    llm_prompt_id integer NOT NULL,
    prompt_example_id integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: evidence_research_gen_ai_llm_prompt_prompt_examples_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.evidence_research_gen_ai_llm_prompt_prompt_examples_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: evidence_research_gen_ai_llm_prompt_prompt_examples_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.evidence_research_gen_ai_llm_prompt_prompt_examples_id_seq OWNED BY public.evidence_research_gen_ai_llm_prompt_prompt_examples.id;


--
-- Name: evidence_research_gen_ai_llm_prompt_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evidence_research_gen_ai_llm_prompt_templates (
    id bigint NOT NULL,
    name text NOT NULL,
    contents text NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    notes text,
    "order" integer NOT NULL
);


--
-- Name: evidence_research_gen_ai_llm_prompt_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.evidence_research_gen_ai_llm_prompt_templates_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: evidence_research_gen_ai_llm_prompt_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.evidence_research_gen_ai_llm_prompt_templates_id_seq OWNED BY public.evidence_research_gen_ai_llm_prompt_templates.id;


--
-- Name: evidence_research_gen_ai_llm_prompts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evidence_research_gen_ai_llm_prompts (
    id bigint NOT NULL,
    prompt text NOT NULL,
    llm_prompt_template_id integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    optimal_guidelines_count integer NOT NULL,
    suboptimal_guidelines_count integer NOT NULL,
    optimal_examples_count integer NOT NULL,
    suboptimal_examples_count integer NOT NULL,
    locked boolean NOT NULL
);


--
-- Name: evidence_research_gen_ai_llm_prompts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.evidence_research_gen_ai_llm_prompts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: evidence_research_gen_ai_llm_prompts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.evidence_research_gen_ai_llm_prompts_id_seq OWNED BY public.evidence_research_gen_ai_llm_prompts.id;


--
-- Name: evidence_research_gen_ai_llms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evidence_research_gen_ai_llms (
    id bigint NOT NULL,
    vendor character varying NOT NULL,
    version character varying NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    "order" integer NOT NULL
);


--
-- Name: evidence_research_gen_ai_llms_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.evidence_research_gen_ai_llms_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: evidence_research_gen_ai_llms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.evidence_research_gen_ai_llms_id_seq OWNED BY public.evidence_research_gen_ai_llms.id;


--
-- Name: evidence_research_gen_ai_prompt_examples; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evidence_research_gen_ai_prompt_examples (
    id bigint NOT NULL,
    dataset_id integer NOT NULL,
    student_response text NOT NULL,
    curriculum_assigned_status character varying NOT NULL,
    curriculum_proposed_feedback text,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    curriculum_label character varying,
    highlight text,
    automl_label text,
    automl_primary_feedback text,
    automl_secondary_feedback text
);


--
-- Name: evidence_research_gen_ai_prompt_examples_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.evidence_research_gen_ai_prompt_examples_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: evidence_research_gen_ai_prompt_examples_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.evidence_research_gen_ai_prompt_examples_id_seq OWNED BY public.evidence_research_gen_ai_prompt_examples.id;


--
-- Name: evidence_research_gen_ai_prompt_template_variables; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evidence_research_gen_ai_prompt_template_variables (
    id bigint NOT NULL,
    name character varying NOT NULL,
    value text NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: evidence_research_gen_ai_prompt_template_variables_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.evidence_research_gen_ai_prompt_template_variables_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: evidence_research_gen_ai_prompt_template_variables_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.evidence_research_gen_ai_prompt_template_variables_id_seq OWNED BY public.evidence_research_gen_ai_prompt_template_variables.id;


--
-- Name: evidence_research_gen_ai_stem_vaults; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evidence_research_gen_ai_stem_vaults (
    id bigint NOT NULL,
    activity_id integer NOT NULL,
    stem text NOT NULL,
    conjunction character varying NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: evidence_research_gen_ai_stem_vaults_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.evidence_research_gen_ai_stem_vaults_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: evidence_research_gen_ai_stem_vaults_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.evidence_research_gen_ai_stem_vaults_id_seq OWNED BY public.evidence_research_gen_ai_stem_vaults.id;


--
-- Name: evidence_research_gen_ai_student_responses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evidence_research_gen_ai_student_responses (
    id bigint NOT NULL,
    stem_vault_id integer NOT NULL,
    text text NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: evidence_research_gen_ai_student_responses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.evidence_research_gen_ai_student_responses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: evidence_research_gen_ai_student_responses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.evidence_research_gen_ai_student_responses_id_seq OWNED BY public.evidence_research_gen_ai_student_responses.id;


--
-- Name: evidence_research_gen_ai_test_examples; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evidence_research_gen_ai_test_examples (
    id bigint NOT NULL,
    dataset_id integer NOT NULL,
    student_response text NOT NULL,
    curriculum_assigned_status character varying NOT NULL,
    curriculum_proposed_feedback text,
    highlight text,
    automl_primary_feedback text,
    automl_label character varying,
    curriculum_label character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    automl_secondary_feedback text
);


--
-- Name: evidence_research_gen_ai_test_examples_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.evidence_research_gen_ai_test_examples_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: evidence_research_gen_ai_test_examples_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.evidence_research_gen_ai_test_examples_id_seq OWNED BY public.evidence_research_gen_ai_test_examples.id;


--
-- Name: evidence_research_gen_ai_trial_comparisons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evidence_research_gen_ai_trial_comparisons (
    id bigint NOT NULL,
    comparison_id integer NOT NULL,
    trial_id integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: evidence_research_gen_ai_trial_comparisons_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.evidence_research_gen_ai_trial_comparisons_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: evidence_research_gen_ai_trial_comparisons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.evidence_research_gen_ai_trial_comparisons_id_seq OWNED BY public.evidence_research_gen_ai_trial_comparisons.id;


--
-- Name: evidence_research_gen_ai_trials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evidence_research_gen_ai_trials (
    id bigint NOT NULL,
    dataset_id integer NOT NULL,
    llm_id integer NOT NULL,
    llm_prompt_id integer NOT NULL,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    trial_errors text[] DEFAULT '{}'::text[] NOT NULL,
    results jsonb,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    trial_duration double precision,
    evaluation_duration double precision,
    number integer NOT NULL,
    temperature double precision NOT NULL
);


--
-- Name: evidence_research_gen_ai_trials_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.evidence_research_gen_ai_trials_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: evidence_research_gen_ai_trials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.evidence_research_gen_ai_trials_id_seq OWNED BY public.evidence_research_gen_ai_trials.id;


--
-- Name: evidence_text_generations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evidence_text_generations (
    id bigint NOT NULL,
    type character varying NOT NULL,
    config jsonb,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: evidence_text_generations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.evidence_text_generations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: evidence_text_generations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.evidence_text_generations_id_seq OWNED BY public.evidence_text_generations.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying
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
-- Name: activities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activities ALTER COLUMN id SET DEFAULT nextval('public.activities_id_seq'::regclass);


--
-- Name: activity_classifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_classifications ALTER COLUMN id SET DEFAULT nextval('public.activity_classifications_id_seq'::regclass);


--
-- Name: change_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.change_logs ALTER COLUMN id SET DEFAULT nextval('public.change_logs_id_seq'::regclass);


--
-- Name: comprehension_activities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_activities ALTER COLUMN id SET DEFAULT nextval('public.comprehension_activities_id_seq'::regclass);


--
-- Name: comprehension_automl_models id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_automl_models ALTER COLUMN id SET DEFAULT nextval('public.comprehension_automl_models_id_seq'::regclass);


--
-- Name: comprehension_feedbacks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_feedbacks ALTER COLUMN id SET DEFAULT nextval('public.comprehension_feedbacks_id_seq'::regclass);


--
-- Name: comprehension_highlights id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_highlights ALTER COLUMN id SET DEFAULT nextval('public.comprehension_highlights_id_seq'::regclass);


--
-- Name: comprehension_labels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_labels ALTER COLUMN id SET DEFAULT nextval('public.comprehension_labels_id_seq'::regclass);


--
-- Name: comprehension_passages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_passages ALTER COLUMN id SET DEFAULT nextval('public.comprehension_passages_id_seq'::regclass);


--
-- Name: comprehension_plagiarism_texts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_plagiarism_texts ALTER COLUMN id SET DEFAULT nextval('public.comprehension_plagiarism_texts_id_seq'::regclass);


--
-- Name: comprehension_prompts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_prompts ALTER COLUMN id SET DEFAULT nextval('public.comprehension_prompts_id_seq'::regclass);


--
-- Name: comprehension_prompts_rules id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_prompts_rules ALTER COLUMN id SET DEFAULT nextval('public.comprehension_prompts_rules_id_seq'::regclass);


--
-- Name: comprehension_regex_rules id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_regex_rules ALTER COLUMN id SET DEFAULT nextval('public.comprehension_regex_rules_id_seq'::regclass);


--
-- Name: comprehension_rules id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_rules ALTER COLUMN id SET DEFAULT nextval('public.comprehension_rules_id_seq'::regclass);


--
-- Name: comprehension_turking_round_activity_sessions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_turking_round_activity_sessions ALTER COLUMN id SET DEFAULT nextval('public.comprehension_turking_round_activity_sessions_id_seq'::regclass);


--
-- Name: comprehension_turking_rounds id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_turking_rounds ALTER COLUMN id SET DEFAULT nextval('public.comprehension_turking_rounds_id_seq'::regclass);


--
-- Name: evidence_activity_healths id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_activity_healths ALTER COLUMN id SET DEFAULT nextval('public.evidence_activity_healths_id_seq'::regclass);


--
-- Name: evidence_automl_models id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_automl_models ALTER COLUMN id SET DEFAULT nextval('public.evidence_automl_models_id_seq'::regclass);


--
-- Name: evidence_hints id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_hints ALTER COLUMN id SET DEFAULT nextval('public.evidence_hints_id_seq'::regclass);


--
-- Name: evidence_labeled_entries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_labeled_entries ALTER COLUMN id SET DEFAULT nextval('public.evidence_labeled_entries_id_seq'::regclass);


--
-- Name: evidence_prompt_healths id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_prompt_healths ALTER COLUMN id SET DEFAULT nextval('public.evidence_prompt_healths_id_seq'::regclass);


--
-- Name: evidence_prompt_response_feedbacks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_prompt_response_feedbacks ALTER COLUMN id SET DEFAULT nextval('public.evidence_prompt_response_feedbacks_id_seq'::regclass);


--
-- Name: evidence_prompt_responses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_prompt_responses ALTER COLUMN id SET DEFAULT nextval('public.evidence_prompt_responses_id_seq'::regclass);


--
-- Name: evidence_prompt_text_batches id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_prompt_text_batches ALTER COLUMN id SET DEFAULT nextval('public.evidence_prompt_text_batches_id_seq'::regclass);


--
-- Name: evidence_prompt_texts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_prompt_texts ALTER COLUMN id SET DEFAULT nextval('public.evidence_prompt_texts_id_seq'::regclass);


--
-- Name: evidence_research_gen_ai_activities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_activities ALTER COLUMN id SET DEFAULT nextval('public.evidence_research_gen_ai_activities_id_seq'::regclass);


--
-- Name: evidence_research_gen_ai_comparisons id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_comparisons ALTER COLUMN id SET DEFAULT nextval('public.evidence_research_gen_ai_comparisons_id_seq'::regclass);


--
-- Name: evidence_research_gen_ai_datasets id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_datasets ALTER COLUMN id SET DEFAULT nextval('public.evidence_research_gen_ai_datasets_id_seq'::regclass);


--
-- Name: evidence_research_gen_ai_g_eval_scores id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_g_eval_scores ALTER COLUMN id SET DEFAULT nextval('public.evidence_research_gen_ai_g_eval_scores_id_seq'::regclass);


--
-- Name: evidence_research_gen_ai_g_evals id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_g_evals ALTER COLUMN id SET DEFAULT nextval('public.evidence_research_gen_ai_g_evals_id_seq'::regclass);


--
-- Name: evidence_research_gen_ai_guidelines id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_guidelines ALTER COLUMN id SET DEFAULT nextval('public.evidence_research_gen_ai_guidelines_id_seq'::regclass);


--
-- Name: evidence_research_gen_ai_llm_examples id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_llm_examples ALTER COLUMN id SET DEFAULT nextval('public.evidence_research_gen_ai_llm_examples_id_seq'::regclass);


--
-- Name: evidence_research_gen_ai_llm_prompt_guidelines id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_llm_prompt_guidelines ALTER COLUMN id SET DEFAULT nextval('public.evidence_research_gen_ai_llm_prompt_guidelines_id_seq'::regclass);


--
-- Name: evidence_research_gen_ai_llm_prompt_prompt_examples id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_llm_prompt_prompt_examples ALTER COLUMN id SET DEFAULT nextval('public.evidence_research_gen_ai_llm_prompt_prompt_examples_id_seq'::regclass);


--
-- Name: evidence_research_gen_ai_llm_prompt_templates id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_llm_prompt_templates ALTER COLUMN id SET DEFAULT nextval('public.evidence_research_gen_ai_llm_prompt_templates_id_seq'::regclass);


--
-- Name: evidence_research_gen_ai_llm_prompts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_llm_prompts ALTER COLUMN id SET DEFAULT nextval('public.evidence_research_gen_ai_llm_prompts_id_seq'::regclass);


--
-- Name: evidence_research_gen_ai_llms id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_llms ALTER COLUMN id SET DEFAULT nextval('public.evidence_research_gen_ai_llms_id_seq'::regclass);


--
-- Name: evidence_research_gen_ai_prompt_examples id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_prompt_examples ALTER COLUMN id SET DEFAULT nextval('public.evidence_research_gen_ai_prompt_examples_id_seq'::regclass);


--
-- Name: evidence_research_gen_ai_prompt_template_variables id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_prompt_template_variables ALTER COLUMN id SET DEFAULT nextval('public.evidence_research_gen_ai_prompt_template_variables_id_seq'::regclass);


--
-- Name: evidence_research_gen_ai_stem_vaults id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_stem_vaults ALTER COLUMN id SET DEFAULT nextval('public.evidence_research_gen_ai_stem_vaults_id_seq'::regclass);


--
-- Name: evidence_research_gen_ai_student_responses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_student_responses ALTER COLUMN id SET DEFAULT nextval('public.evidence_research_gen_ai_student_responses_id_seq'::regclass);


--
-- Name: evidence_research_gen_ai_test_examples id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_test_examples ALTER COLUMN id SET DEFAULT nextval('public.evidence_research_gen_ai_test_examples_id_seq'::regclass);


--
-- Name: evidence_research_gen_ai_trial_comparisons id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_trial_comparisons ALTER COLUMN id SET DEFAULT nextval('public.evidence_research_gen_ai_trial_comparisons_id_seq'::regclass);


--
-- Name: evidence_research_gen_ai_trials id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_trials ALTER COLUMN id SET DEFAULT nextval('public.evidence_research_gen_ai_trials_id_seq'::regclass);


--
-- Name: evidence_text_generations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_text_generations ALTER COLUMN id SET DEFAULT nextval('public.evidence_text_generations_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: activities activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_pkey PRIMARY KEY (id);


--
-- Name: activity_classifications activity_classifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_classifications
    ADD CONSTRAINT activity_classifications_pkey PRIMARY KEY (id);


--
-- Name: ar_internal_metadata ar_internal_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ar_internal_metadata
    ADD CONSTRAINT ar_internal_metadata_pkey PRIMARY KEY (key);


--
-- Name: change_logs change_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.change_logs
    ADD CONSTRAINT change_logs_pkey PRIMARY KEY (id);


--
-- Name: comprehension_activities comprehension_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_activities
    ADD CONSTRAINT comprehension_activities_pkey PRIMARY KEY (id);


--
-- Name: comprehension_automl_models comprehension_automl_models_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_automl_models
    ADD CONSTRAINT comprehension_automl_models_pkey PRIMARY KEY (id);


--
-- Name: comprehension_feedbacks comprehension_feedbacks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_feedbacks
    ADD CONSTRAINT comprehension_feedbacks_pkey PRIMARY KEY (id);


--
-- Name: comprehension_highlights comprehension_highlights_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_highlights
    ADD CONSTRAINT comprehension_highlights_pkey PRIMARY KEY (id);


--
-- Name: comprehension_labels comprehension_labels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_labels
    ADD CONSTRAINT comprehension_labels_pkey PRIMARY KEY (id);


--
-- Name: comprehension_passages comprehension_passages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_passages
    ADD CONSTRAINT comprehension_passages_pkey PRIMARY KEY (id);


--
-- Name: comprehension_plagiarism_texts comprehension_plagiarism_texts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_plagiarism_texts
    ADD CONSTRAINT comprehension_plagiarism_texts_pkey PRIMARY KEY (id);


--
-- Name: comprehension_prompts comprehension_prompts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_prompts
    ADD CONSTRAINT comprehension_prompts_pkey PRIMARY KEY (id);


--
-- Name: comprehension_prompts_rules comprehension_prompts_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_prompts_rules
    ADD CONSTRAINT comprehension_prompts_rules_pkey PRIMARY KEY (id);


--
-- Name: comprehension_regex_rules comprehension_regex_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_regex_rules
    ADD CONSTRAINT comprehension_regex_rules_pkey PRIMARY KEY (id);


--
-- Name: comprehension_rules comprehension_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_rules
    ADD CONSTRAINT comprehension_rules_pkey PRIMARY KEY (id);


--
-- Name: comprehension_turking_round_activity_sessions comprehension_turking_round_activity_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_turking_round_activity_sessions
    ADD CONSTRAINT comprehension_turking_round_activity_sessions_pkey PRIMARY KEY (id);


--
-- Name: comprehension_turking_rounds comprehension_turking_rounds_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_turking_rounds
    ADD CONSTRAINT comprehension_turking_rounds_pkey PRIMARY KEY (id);


--
-- Name: evidence_activity_healths evidence_activity_healths_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_activity_healths
    ADD CONSTRAINT evidence_activity_healths_pkey PRIMARY KEY (id);


--
-- Name: evidence_automl_models evidence_automl_models_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_automl_models
    ADD CONSTRAINT evidence_automl_models_pkey PRIMARY KEY (id);


--
-- Name: evidence_hints evidence_hints_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_hints
    ADD CONSTRAINT evidence_hints_pkey PRIMARY KEY (id);


--
-- Name: evidence_labeled_entries evidence_labeled_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_labeled_entries
    ADD CONSTRAINT evidence_labeled_entries_pkey PRIMARY KEY (id);


--
-- Name: evidence_prompt_healths evidence_prompt_healths_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_prompt_healths
    ADD CONSTRAINT evidence_prompt_healths_pkey PRIMARY KEY (id);


--
-- Name: evidence_prompt_response_feedbacks evidence_prompt_response_feedbacks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_prompt_response_feedbacks
    ADD CONSTRAINT evidence_prompt_response_feedbacks_pkey PRIMARY KEY (id);


--
-- Name: evidence_prompt_responses evidence_prompt_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_prompt_responses
    ADD CONSTRAINT evidence_prompt_responses_pkey PRIMARY KEY (id);


--
-- Name: evidence_prompt_text_batches evidence_prompt_text_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_prompt_text_batches
    ADD CONSTRAINT evidence_prompt_text_batches_pkey PRIMARY KEY (id);


--
-- Name: evidence_prompt_texts evidence_prompt_texts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_prompt_texts
    ADD CONSTRAINT evidence_prompt_texts_pkey PRIMARY KEY (id);


--
-- Name: evidence_research_gen_ai_activities evidence_research_gen_ai_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_activities
    ADD CONSTRAINT evidence_research_gen_ai_activities_pkey PRIMARY KEY (id);


--
-- Name: evidence_research_gen_ai_comparisons evidence_research_gen_ai_comparisons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_comparisons
    ADD CONSTRAINT evidence_research_gen_ai_comparisons_pkey PRIMARY KEY (id);


--
-- Name: evidence_research_gen_ai_datasets evidence_research_gen_ai_datasets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_datasets
    ADD CONSTRAINT evidence_research_gen_ai_datasets_pkey PRIMARY KEY (id);


--
-- Name: evidence_research_gen_ai_g_eval_scores evidence_research_gen_ai_g_eval_scores_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_g_eval_scores
    ADD CONSTRAINT evidence_research_gen_ai_g_eval_scores_pkey PRIMARY KEY (id);


--
-- Name: evidence_research_gen_ai_g_evals evidence_research_gen_ai_g_evals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_g_evals
    ADD CONSTRAINT evidence_research_gen_ai_g_evals_pkey PRIMARY KEY (id);


--
-- Name: evidence_research_gen_ai_guidelines evidence_research_gen_ai_guidelines_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_guidelines
    ADD CONSTRAINT evidence_research_gen_ai_guidelines_pkey PRIMARY KEY (id);


--
-- Name: evidence_research_gen_ai_llm_examples evidence_research_gen_ai_llm_examples_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_llm_examples
    ADD CONSTRAINT evidence_research_gen_ai_llm_examples_pkey PRIMARY KEY (id);


--
-- Name: evidence_research_gen_ai_llm_prompt_guidelines evidence_research_gen_ai_llm_prompt_guidelines_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_llm_prompt_guidelines
    ADD CONSTRAINT evidence_research_gen_ai_llm_prompt_guidelines_pkey PRIMARY KEY (id);


--
-- Name: evidence_research_gen_ai_llm_prompt_prompt_examples evidence_research_gen_ai_llm_prompt_prompt_examples_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_llm_prompt_prompt_examples
    ADD CONSTRAINT evidence_research_gen_ai_llm_prompt_prompt_examples_pkey PRIMARY KEY (id);


--
-- Name: evidence_research_gen_ai_llm_prompt_templates evidence_research_gen_ai_llm_prompt_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_llm_prompt_templates
    ADD CONSTRAINT evidence_research_gen_ai_llm_prompt_templates_pkey PRIMARY KEY (id);


--
-- Name: evidence_research_gen_ai_llm_prompts evidence_research_gen_ai_llm_prompts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_llm_prompts
    ADD CONSTRAINT evidence_research_gen_ai_llm_prompts_pkey PRIMARY KEY (id);


--
-- Name: evidence_research_gen_ai_llms evidence_research_gen_ai_llms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_llms
    ADD CONSTRAINT evidence_research_gen_ai_llms_pkey PRIMARY KEY (id);


--
-- Name: evidence_research_gen_ai_prompt_examples evidence_research_gen_ai_prompt_examples_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_prompt_examples
    ADD CONSTRAINT evidence_research_gen_ai_prompt_examples_pkey PRIMARY KEY (id);


--
-- Name: evidence_research_gen_ai_prompt_template_variables evidence_research_gen_ai_prompt_template_variables_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_prompt_template_variables
    ADD CONSTRAINT evidence_research_gen_ai_prompt_template_variables_pkey PRIMARY KEY (id);


--
-- Name: evidence_research_gen_ai_stem_vaults evidence_research_gen_ai_stem_vaults_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_stem_vaults
    ADD CONSTRAINT evidence_research_gen_ai_stem_vaults_pkey PRIMARY KEY (id);


--
-- Name: evidence_research_gen_ai_student_responses evidence_research_gen_ai_student_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_student_responses
    ADD CONSTRAINT evidence_research_gen_ai_student_responses_pkey PRIMARY KEY (id);


--
-- Name: evidence_research_gen_ai_test_examples evidence_research_gen_ai_test_examples_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_test_examples
    ADD CONSTRAINT evidence_research_gen_ai_test_examples_pkey PRIMARY KEY (id);


--
-- Name: evidence_research_gen_ai_trial_comparisons evidence_research_gen_ai_trial_comparisons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_trial_comparisons
    ADD CONSTRAINT evidence_research_gen_ai_trial_comparisons_pkey PRIMARY KEY (id);


--
-- Name: evidence_research_gen_ai_trials evidence_research_gen_ai_trials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_research_gen_ai_trials
    ADD CONSTRAINT evidence_research_gen_ai_trials_pkey PRIMARY KEY (id);


--
-- Name: evidence_text_generations evidence_text_generations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_text_generations
    ADD CONSTRAINT evidence_text_generations_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: comprehension_turking_sessions_activity_uid; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX comprehension_turking_sessions_activity_uid ON public.comprehension_turking_round_activity_sessions USING btree (activity_session_uid);


--
-- Name: comprehension_turking_sessions_turking_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX comprehension_turking_sessions_turking_id ON public.comprehension_turking_round_activity_sessions USING btree (turking_round_id);


--
-- Name: index_change_logs_on_changed_record_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_change_logs_on_changed_record_id ON public.change_logs USING btree (changed_record_id);


--
-- Name: index_change_logs_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_change_logs_on_user_id ON public.change_logs USING btree (user_id);


--
-- Name: index_comprehension_activities_on_parent_activity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_comprehension_activities_on_parent_activity_id ON public.comprehension_activities USING btree (parent_activity_id);


--
-- Name: index_comprehension_feedbacks_on_rule_id_and_order; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_comprehension_feedbacks_on_rule_id_and_order ON public.comprehension_feedbacks USING btree (rule_id, "order");


--
-- Name: index_comprehension_passages_on_activity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_comprehension_passages_on_activity_id ON public.comprehension_passages USING btree (activity_id);


--
-- Name: index_comprehension_plagiarism_texts_on_rule_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_comprehension_plagiarism_texts_on_rule_id ON public.comprehension_plagiarism_texts USING btree (rule_id);


--
-- Name: index_comprehension_prompts_on_activity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_comprehension_prompts_on_activity_id ON public.comprehension_prompts USING btree (activity_id);


--
-- Name: index_comprehension_prompts_rules_on_prompt_id_and_rule_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_comprehension_prompts_rules_on_prompt_id_and_rule_id ON public.comprehension_prompts_rules USING btree (prompt_id, rule_id);


--
-- Name: index_comprehension_prompts_rules_on_rule_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_comprehension_prompts_rules_on_rule_id ON public.comprehension_prompts_rules USING btree (rule_id);


--
-- Name: index_comprehension_regex_rules_on_rule_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_comprehension_regex_rules_on_rule_id ON public.comprehension_regex_rules USING btree (rule_id);


--
-- Name: index_comprehension_rules_on_hint_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_comprehension_rules_on_hint_id ON public.comprehension_rules USING btree (hint_id);


--
-- Name: index_comprehension_rules_on_uid; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_comprehension_rules_on_uid ON public.comprehension_rules USING btree (uid);


--
-- Name: index_comprehension_turking_rounds_on_activity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_comprehension_turking_rounds_on_activity_id ON public.comprehension_turking_rounds USING btree (activity_id);


--
-- Name: index_comprehension_turking_rounds_on_uuid; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_comprehension_turking_rounds_on_uuid ON public.comprehension_turking_rounds USING btree (uuid);


--
-- Name: index_evidence_automl_models_on_prompt_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_evidence_automl_models_on_prompt_id ON public.evidence_automl_models USING btree (prompt_id);


--
-- Name: index_evidence_hints_on_rule_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_evidence_hints_on_rule_id ON public.evidence_hints USING btree (rule_id);


--
-- Name: index_evidence_labeled_entries_on_prompt_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_evidence_labeled_entries_on_prompt_id ON public.evidence_labeled_entries USING btree (prompt_id);


--
-- Name: index_evidence_prompt_healths_on_evidence_activity_health_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_evidence_prompt_healths_on_evidence_activity_health_id ON public.evidence_prompt_healths USING btree (evidence_activity_health_id);


--
-- Name: evidence_prompt_healths fk_rails_2126b1922f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_prompt_healths
    ADD CONSTRAINT fk_rails_2126b1922f FOREIGN KEY (evidence_activity_health_id) REFERENCES public.evidence_activity_healths(id) ON DELETE CASCADE;


--
-- Name: comprehension_automl_models fk_rails_35c32f80fc; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_automl_models
    ADD CONSTRAINT fk_rails_35c32f80fc FOREIGN KEY (prompt_id) REFERENCES public.comprehension_prompts(id);


--
-- Name: evidence_automl_models fk_rails_3c28762764; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evidence_automl_models
    ADD CONSTRAINT fk_rails_3c28762764 FOREIGN KEY (prompt_id) REFERENCES public.comprehension_prompts(id);


--
-- Name: comprehension_labels fk_rails_6112e49a74; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_labels
    ADD CONSTRAINT fk_rails_6112e49a74 FOREIGN KEY (rule_id) REFERENCES public.comprehension_rules(id) ON DELETE CASCADE;


--
-- Name: comprehension_highlights fk_rails_9d58aa0a3c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_highlights
    ADD CONSTRAINT fk_rails_9d58aa0a3c FOREIGN KEY (feedback_id) REFERENCES public.comprehension_feedbacks(id) ON DELETE CASCADE;


--
-- Name: comprehension_plagiarism_texts fk_rails_bcd03e8630; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_plagiarism_texts
    ADD CONSTRAINT fk_rails_bcd03e8630 FOREIGN KEY (rule_id) REFERENCES public.comprehension_rules(id) ON DELETE CASCADE;


--
-- Name: comprehension_regex_rules fk_rails_dd1bb7c35b; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprehension_regex_rules
    ADD CONSTRAINT fk_rails_dd1bb7c35b FOREIGN KEY (rule_id) REFERENCES public.comprehension_rules(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

SET search_path TO "$user", public;

INSERT INTO "schema_migrations" (version) VALUES
('20241002153807'),
('20240925184213'),
('20240918144745'),
('20240828221309'),
('20240823204315'),
('20240822145206'),
('20240821205700'),
('20240808123536'),
('20240805185650'),
('20240801134328'),
('20240714214900'),
('20240713141016'),
('20240701180438'),
('20240627002301'),
('20240627001402'),
('20240626142847'),
('20240625204226'),
('20240625135430'),
('20240625122344'),
('20240620115506'),
('20240620113244'),
('20240619224707'),
('20240619215433'),
('20240619184956'),
('20240619171521'),
('20240619161005'),
('20240605185440'),
('20240605170721'),
('20240605132531'),
('20240605004535'),
('20240604230733'),
('20240603162245'),
('20240531183845'),
('20240528185315'),
('20240521200827'),
('20240513162557'),
('20240425125151'),
('20240411135531'),
('20240407172612'),
('20240401223116'),
('20240318144447'),
('20240318143146'),
('20240318141942'),
('20240318140506'),
('20240315191401'),
('20240315184312'),
('20240315180944'),
('20240315141841'),
('20240315140702'),
('20240307165408'),
('20240307142932'),
('20240305224710'),
('20240221192859'),
('20230911142601'),
('20230306215624'),
('20230306215326'),
('20230306215123'),
('20221110063922'),
('20221110063831'),
('20221019185954'),
('20221003205702'),
('20220623205532'),
('20220201161535'),
('20220201131639'),
('20220128175908'),
('20220105145314'),
('20211022145011'),
('20210816195955'),
('20210811130211'),
('20210722143752'),
('20210713204109'),
('20210614190110'),
('20210603191300'),
('20210525194626'),
('20210511160025'),
('20210429144611'),
('20210317200006'),
('20210317200005'),
('20210317200004'),
('20210316160648'),
('20210219163806'),
('20210218213618'),
('20210218195536'),
('20210212194127'),
('20210209200555'),
('20210129184505'),
('20210128155938'),
('20210128152309'),
('20210122165328'),
('20210122165204'),
('20210122144228'),
('20210121200031'),
('20210114182832'),
('20210114164149'),
('20210114154926'),
('20201202224853'),
('20201125161727'),
('20200630161345'),
('20200626181312'),
('20200626160522'),
('20200625222938'),
('20200609005839'),
('20200608233222'),
('20200605133641');

