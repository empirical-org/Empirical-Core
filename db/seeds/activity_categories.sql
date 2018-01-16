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
-- Data for Name: activity_categories; Type: TABLE DATA; Schema: public; Owner: jaredsilver
--

INSERT INTO activity_categories VALUES (11, 'Adverbs', 9, '2017-09-18 16:32:11.821279', '2017-09-18 16:32:11.821279');
INSERT INTO activity_categories VALUES (24, 'History: Causes of the American Revolution', 22, '2017-09-19 13:38:43.357343', '2017-09-19 13:38:43.357343');
INSERT INTO activity_categories VALUES (30, 'Diagnostics', 0, '2017-09-19 16:04:45.342977', '2017-09-19 16:07:53.793128');
INSERT INTO activity_categories VALUES (1, 'Determiners', 1, '2017-09-18 15:53:05.59247', '2017-09-19 16:07:53.804935');
INSERT INTO activity_categories VALUES (2, 'Nouns', 2, '2017-09-18 15:57:36.129318', '2017-09-19 16:07:53.812168');
INSERT INTO activity_categories VALUES (4, 'Verbs', 3, '2017-09-18 16:01:50.087726', '2017-09-19 16:07:53.820792');
INSERT INTO activity_categories VALUES (5, 'Contractions', 4, '2017-09-18 16:12:26.663604', '2017-09-19 16:07:53.833615');
INSERT INTO activity_categories VALUES (6, 'Capitalization', 5, '2017-09-18 16:13:41.721709', '2017-09-19 16:07:53.850747');
INSERT INTO activity_categories VALUES (7, 'Comma Usage', 6, '2017-09-18 16:16:24.837318', '2017-09-19 16:07:53.868473');
INSERT INTO activity_categories VALUES (8, 'Commonly Confused Words', 7, '2017-09-18 16:19:44.275751', '2017-09-19 16:07:53.875085');
INSERT INTO activity_categories VALUES (9, 'Prepositions', 8, '2017-09-18 16:24:38.442489', '2017-09-19 16:07:53.884012');
INSERT INTO activity_categories VALUES (10, 'Adjectives', 10, '2017-09-18 16:27:46.227117', '2017-09-19 16:07:53.90133');
INSERT INTO activity_categories VALUES (12, 'Pronouns', 11, '2017-09-18 17:28:54.886737', '2017-09-19 16:07:53.912116');
INSERT INTO activity_categories VALUES (13, 'Subjects, Objects, Predicates', 12, '2017-09-18 22:02:31.953101', '2017-09-19 16:07:53.921355');
INSERT INTO activity_categories VALUES (14, 'Compound Sentences', 13, '2017-09-18 22:04:19.015284', '2017-09-19 16:07:53.929817');
INSERT INTO activity_categories VALUES (15, 'Complex Sentences', 14, '2017-09-18 22:08:36.597774', '2017-09-19 16:07:53.93771');
INSERT INTO activity_categories VALUES (20, 'History: Maya, Aztec, Inca', 19, '2017-09-19 13:28:56.648248', '2017-09-19 16:07:53.972403');
INSERT INTO activity_categories VALUES (21, 'History: Native Americans', 20, '2017-09-19 13:33:02.215748', '2017-09-19 16:07:53.980025');
INSERT INTO activity_categories VALUES (22, 'History: The Renaissance', 21, '2017-09-19 13:35:07.523033', '2017-09-19 16:07:54.020568');
INSERT INTO activity_categories VALUES (23, 'History: Age of Exploration', 23, '2017-09-19 13:37:03.094554', '2017-09-19 16:07:54.031488');
INSERT INTO activity_categories VALUES (19, 'History: Chinese Dynasties', 24, '2017-09-19 13:24:30.818911', '2017-09-19 16:07:54.038992');
INSERT INTO activity_categories VALUES (25, 'History: American Revolution', 25, '2017-09-19 13:39:41.408364', '2017-09-19 16:07:54.050081');
INSERT INTO activity_categories VALUES (26, 'Science: What''s in Our Universe?', 26, '2017-09-19 13:41:19.062099', '2017-09-19 16:07:54.05901');
INSERT INTO activity_categories VALUES (27, 'Science: Geology', 27, '2017-09-19 13:42:09.74581', '2017-09-19 16:07:54.065858');
INSERT INTO activity_categories VALUES (28, 'Science: Plants', 28, '2017-09-19 13:43:17.902697', '2017-09-19 16:07:54.072502');
INSERT INTO activity_categories VALUES (16, 'Parallel Structure', 15, '2017-09-18 22:11:15.392179', '2017-09-21 18:52:05.492543');
INSERT INTO activity_categories VALUES (17, 'Modifying Phrases & Clauses', 16, '2017-09-18 22:12:14.223549', '2017-09-21 18:52:05.545063');
INSERT INTO activity_categories VALUES (31, 'Fragments', 17, '2017-09-19 16:06:55.707462', '2017-09-21 18:52:05.582643');
INSERT INTO activity_categories VALUES (18, 'Summative Assessments', 18, '2017-09-18 22:13:40.727546', '2017-09-21 18:52:05.619532');


--
-- Name: activity_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jaredsilver
--

SELECT pg_catalog.setval('activity_categories_id_seq', 31, true);


--
-- PostgreSQL database dump complete
--

