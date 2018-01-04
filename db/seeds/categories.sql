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
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: jaredsilver
--

INSERT INTO categories VALUES (1, '1.1b. Use Common, Proper, and Possessive Nouns.', '2013-09-15 21:11:10.960388', '2013-09-15 22:26:00.504397');
INSERT INTO categories VALUES (3, '1.1e. Use Verbs to Convey a Sense of Past, Present, and Future.', '2013-09-15 21:50:16.318644', '2013-09-15 22:26:31.945979');
INSERT INTO categories VALUES (2, '1.1c. Use Singular and Plural Nouns with Matching Verbs in Basic Sentences.', '2013-09-15 21:39:49.383412', '2013-09-15 22:26:56.642188');
INSERT INTO categories VALUES (4, '1.1g. Conjunctions (And, But, Or, So, Because).', '2013-09-15 21:59:58.310121', '2013-09-15 22:27:06.419666');
INSERT INTO categories VALUES (5, '1.1h. Use Determiners.', '2013-09-15 22:14:37.999201', '2013-09-15 22:27:14.219791');
INSERT INTO categories VALUES (6, '1.1i. Use Frequently Occurring Prepositions.', '2013-09-15 22:25:33.640106', '2013-09-15 22:27:32.57217');
INSERT INTO categories VALUES (7, '1.2a. Capitalize Dates and Names of People.', '2013-09-15 22:37:07.720719', '2013-09-15 22:37:07.720719');
INSERT INTO categories VALUES (9, '2.1a. Use Collective Nouns.', '2013-09-15 22:45:37.554857', '2013-09-15 22:45:37.554857');
INSERT INTO categories VALUES (10, '2.1b. Use Irregular Plural Nouns.', '2013-09-15 22:48:43.968368', '2013-09-15 22:48:43.968368');
INSERT INTO categories VALUES (11, '2.1c. Use Reflexive Pronouns.', '2013-09-15 23:03:15.969809', '2013-09-15 23:03:15.969809');
INSERT INTO categories VALUES (12, '2.1d. Form and Use the Past Tense of Frequently Occurring Irregular Verbs.', '2013-09-15 23:17:32.262569', '2013-09-15 23:17:32.262569');
INSERT INTO categories VALUES (13, '2.1e. Use Adjectives and Adverbs.', '2013-09-15 23:33:07.72872', '2013-09-15 23:33:07.72872');
INSERT INTO categories VALUES (15, '2.2c. Use an Apostrophe to Form Contractions.', '2013-09-15 23:58:51.328903', '2013-09-15 23:58:51.328903');
INSERT INTO categories VALUES (16, '4.1a. Use relative pronouns and relative adverbs.', '2013-09-19 01:52:16.959644', '2013-09-19 01:52:16.959644');
INSERT INTO categories VALUES (17, '4.1b. Form and use the progressive verb tenses.', '2013-09-19 02:28:32.240405', '2013-09-19 02:28:32.240405');
INSERT INTO categories VALUES (18, '4.1c. Use modal auxiliaries to convey various conditions.', '2013-09-19 02:39:51.054456', '2013-09-19 02:39:51.054456');
INSERT INTO categories VALUES (19, '4.1e. Form and use prepositional phrases.', '2013-09-19 02:48:04.333913', '2013-09-19 02:48:04.333913');
INSERT INTO categories VALUES (20, '4.1g. Correctly use frequently confused words.', '2013-09-19 02:54:14.665722', '2013-09-19 02:54:14.665722');
INSERT INTO categories VALUES (21, '4.2a. Use correct capitalization.', '2013-09-19 03:29:07.890227', '2013-09-19 03:29:07.890227');
INSERT INTO categories VALUES (23, '6.1a. Ensure that pronouns are in the proper case.', '2013-09-19 19:19:34.910727', '2013-09-19 19:19:34.910727');
INSERT INTO categories VALUES (24, '6.1b Use intensive pronouns.', '2013-09-19 19:58:15.230469', '2013-09-19 19:58:15.230469');
INSERT INTO categories VALUES (25, '6.1c Recognize and correct inappropriate shifts in pronoun number and person.', '2013-09-19 19:58:30.45527', '2013-09-19 19:58:30.45527');
INSERT INTO categories VALUES (26, '6.1d Recognize and correct vague pronouns.', '2013-09-19 19:58:50.976296', '2013-09-19 19:58:50.976296');
INSERT INTO categories VALUES (27, '6.2a Use punctuation (commas, parentheses, dashes) to set off nonrestrictive/parenthetical elements.', '2013-09-19 19:59:07.857651', '2013-09-19 19:59:07.857651');
INSERT INTO categories VALUES (28, '111. Shackleton Rules', '2013-09-21 20:57:31.568963', '2013-09-21 20:57:31.568963');
INSERT INTO categories VALUES (14, '2.2a. Capitalize Holidays, Product Names, and Geographic Names.', '2013-09-15 23:54:16.409463', '2013-09-23 23:42:39.097253');
INSERT INTO categories VALUES (29, 'M1. Using Spacing with Punctuation.', '2013-10-04 03:55:56.104187', '2013-10-04 03:55:56.104187');
INSERT INTO categories VALUES (30, '3.1g. Form and use comparative and superlative adjectives and adverbs.', '2013-10-13 19:42:16.438409', '2013-10-13 19:42:16.438409');
INSERT INTO categories VALUES (31, '3.2a. Capitalize appropriate words in titles.', '2013-10-13 19:58:35.027531', '2013-10-13 19:58:35.027531');
INSERT INTO categories VALUES (32, '3.2b. Use commas in addresses.', '2013-10-13 20:01:22.392888', '2013-10-13 20:01:22.392888');
INSERT INTO categories VALUES (33, '3.2c. Use commas and quotation marks in dialogue.', '2013-10-13 20:04:21.047812', '2013-10-13 20:04:21.047812');
INSERT INTO categories VALUES (35, '5.1e. Use correlative conjunctions.', '2013-10-13 20:29:20.362127', '2013-10-13 20:29:20.362127');
INSERT INTO categories VALUES (36, '5.2a. Use punctuation to separate items in a series.', '2013-10-13 20:58:40.94588', '2013-10-13 20:58:40.94588');
INSERT INTO categories VALUES (37, '5.2c. Use a comma for yes and no, tag questions, and addressing people.', '2013-10-13 21:03:47.003968', '2013-10-13 21:03:47.003968');
INSERT INTO categories VALUES (38, '5.2b. Use a comma to separate an introductory element from the rest of the sentence.', '2013-10-13 21:04:38.605619', '2013-10-13 21:04:38.605619');
INSERT INTO categories VALUES (39, '5.1b2. Past Participles.', '2013-10-23 02:23:33.690774', '2013-10-23 02:23:33.690774');
INSERT INTO categories VALUES (40, '7.1c. Place Phrases and Clauses Within a Sentence, Recognizing and Correcting Misplaced and Dangling Modifiers. ', '2013-10-23 20:36:12.509178', '2013-10-23 20:36:58.332048');
INSERT INTO categories VALUES (41, '7.2a. Use a Comma to Separate Coordinate Adjectives.', '2013-10-23 23:57:17.169742', '2013-10-23 23:57:51.040278');
INSERT INTO categories VALUES (42, '8.1b. Form and use verbs in the active and passive voice.', '2013-10-29 02:25:16.722396', '2013-10-29 02:25:38.149612');
INSERT INTO categories VALUES (43, '8.1d. Recognize and correct inappropriate shifts in verb voice and mood.', '2013-10-30 22:00:59.578059', '2013-10-30 22:00:59.578059');
INSERT INTO categories VALUES (44, '8.2b. Use an ellipsis to indicate an omission.', '2013-10-31 00:23:48.942872', '2013-10-31 00:23:48.942872');
INSERT INTO categories VALUES (45, 'M0. Welcome to Quill.', '2013-11-04 01:35:12.18438', '2013-11-04 01:35:12.18438');
INSERT INTO categories VALUES (47, '9-10.1a. Use parallel structure.', '2013-11-10 00:51:30.409163', '2013-11-10 00:51:30.409163');
INSERT INTO categories VALUES (48, 'University: Commonly Confused Words 1', '2013-11-11 00:22:43.776109', '2013-11-11 00:22:43.776109');
INSERT INTO categories VALUES (49, 'University: Commonly Confused Words 2', '2013-11-11 00:23:25.992955', '2013-11-11 00:23:25.992955');
INSERT INTO categories VALUES (50, 'University: Commonly Confused Words 3', '2013-11-11 00:23:33.789227', '2013-11-11 00:23:33.789227');
INSERT INTO categories VALUES (51, 'University: Commonly Confused Words 4', '2013-11-11 00:23:44.711354', '2013-11-11 00:23:44.711354');
INSERT INTO categories VALUES (52, 'University: Commonly Confused Words 5', '2013-11-11 00:23:54.408269', '2013-11-11 00:23:54.408269');
INSERT INTO categories VALUES (53, 'Vocabulary ', '2013-11-14 04:28:07.720411', '2013-11-14 04:28:07.720411');
INSERT INTO categories VALUES (54, 'University: Quoting Direct Speech', '2013-11-17 20:37:29.94314', '2013-11-17 20:37:29.94314');
INSERT INTO categories VALUES (55, 'Images', '2013-12-10 21:51:03.510054', '2013-12-10 21:51:03.510054');
INSERT INTO categories VALUES (56, '2.1d Irregular Past Tense Verbs with Images', '2013-12-10 21:51:51.684049', '2013-12-10 21:53:11.555722');
INSERT INTO categories VALUES (46, 'Messy Sentences', '2013-11-09 21:46:09.355595', '2013-12-13 18:38:01.222164');
INSERT INTO categories VALUES (8, '1.2c. Use Commas in Dates and to Separate Single Words in a Series', '2013-09-15 22:42:39.198044', '2014-03-07 18:56:25.47851');
INSERT INTO categories VALUES (57, 'M2', '2014-04-22 15:37:11.841774', '2014-04-22 15:37:11.841774');
INSERT INTO categories VALUES (34, '3.2d. Form and Use Possessives.', '2013-10-13 20:11:53.466083', '2014-08-11 18:45:29.339289');


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jaredsilver
--

SELECT pg_catalog.setval('categories_id_seq', 58, false);


--
-- PostgreSQL database dump complete
--

