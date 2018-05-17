--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.5
-- Dumped by pg_dump version 9.6.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET search_path = public, pg_catalog;

--
-- Data for Name: unit_template_categories; Type: TABLE DATA; Schema: public; Owner: jaredsilver
--

INSERT INTO unit_template_categories VALUES (3, 'ELL', '#348fdf', '#014f92');
INSERT INTO unit_template_categories VALUES (4, 'Elementary', '#9c2bde', '#560684');
INSERT INTO unit_template_categories VALUES (5, 'Middle', '#ea9a1a', '#875a12');
INSERT INTO unit_template_categories VALUES (6, 'High', '#ff4542', '#c51916');
INSERT INTO unit_template_categories VALUES (7, 'University', '#82bf3c', '#457818');
INSERT INTO unit_template_categories VALUES (8, 'Themed', '#00c2a2', '#027360');
INSERT INTO unit_template_categories VALUES (9, 'Diagnostic', '#00c2a2', '#027360');


--
-- Name: unit_template_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jaredsilver
--

SELECT pg_catalog.setval('unit_template_categories_id_seq', 9, true);


--
-- PostgreSQL database dump complete
--

