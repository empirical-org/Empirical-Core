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
-- Data for Name: standard_categories; Type: TABLE DATA; Schema: public; Owner: jaredsilver
--

INSERT INTO standard_categories VALUES (2, 'Verbs', '2015-02-07 21:55:22.21102', '2015-02-07 21:55:22.21102', 'De6U3Pdc1BPH--saQRD4Gg');
INSERT INTO standard_categories VALUES (3, 'Conjunctions', '2015-02-07 21:55:22.249368', '2015-02-07 21:55:22.249368', 'fGn2blTaRcoblk8bIeScWQ');
INSERT INTO standard_categories VALUES (4, 'Determiners', '2015-02-07 21:55:22.272006', '2015-02-07 21:55:22.272006', '4Rc3UBDm6VYB8j3JperIXQ');
INSERT INTO standard_categories VALUES (5, 'Prepositions', '2015-02-07 21:55:22.293825', '2015-02-07 21:55:22.293825', 'y6Xpj97lXmHvL1pzkGo2eA');
INSERT INTO standard_categories VALUES (6, 'Capitalization', '2015-02-07 21:55:22.316687', '2015-02-07 21:55:22.316687', 'cs5kDcqpfSbJgoVaGaLmWA');
INSERT INTO standard_categories VALUES (7, 'Comma Usage', '2015-02-07 21:55:22.338552', '2015-02-07 21:55:22.338552', 'TLW1IJn16_q8wV1_gPhc3g');
INSERT INTO standard_categories VALUES (8, 'Adjectives & Adverbs', '2015-02-07 21:55:22.408937', '2015-02-07 21:55:22.408937', 'QmK_wU5xbweiZLhmiFtbag');
INSERT INTO standard_categories VALUES (9, 'Nouns & Pronouns', '2015-02-07 21:55:22.507801', '2015-02-07 21:55:22.507801', 'vYPW93xXfCXI2mhazkYapw');
INSERT INTO standard_categories VALUES (10, 'Commonly Confused Words', '2015-02-07 21:55:22.588793', '2015-02-07 21:55:22.588793', '76ineK7GVTK1MmTvIhB4aA');
INSERT INTO standard_categories VALUES (12, 'Punctuation', '2015-02-07 21:55:22.833862', '2015-02-07 21:55:22.833862', 'B-wseAnqbJzzw2-ixtWMcA');
INSERT INTO standard_categories VALUES (11, 'Sentence Structure', '2015-02-07 21:55:22.750074', '2016-08-17 16:32:45.885758', 'hfTdMh4VsLg6hlSoXWVmTg');
INSERT INTO standard_categories VALUES (17, 'Diagnostics', '2016-09-21 15:54:00.644151', '2016-09-21 15:56:02.889802', '2VUn0bFN5xkjBaYzquDsAQ');
INSERT INTO standard_categories VALUES (18, 'Complex Sentences', '2016-10-11 03:26:34.092194', '2016-10-11 03:26:34.092194', 'WbvHnyE1nIIv8CqzW5m2XQ');
INSERT INTO standard_categories VALUES (19, 'Compound Sentences', '2017-03-02 16:04:02.452009', '2017-03-02 16:04:02.452009', '8ypaPUKQBhriZphT5Ag5NA');
INSERT INTO standard_categories VALUES (13, 'Formative Assessments', '2015-02-07 21:55:22.856465', '2017-08-15 18:09:58.682767', 'XSx6hcLxlSf1WKaJFWgsNA');
INSERT INTO standard_categories VALUES (20, 'Fragments & Run-ons', '2017-08-31 18:51:22.235915', '2017-08-31 18:51:22.235915', 'Y85XqsicNrSAHsG9YDADMw');


--
-- Name: standard_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jaredsilver
--

SELECT pg_catalog.setval('standard_categories_id_seq', 20, true);


--
-- PostgreSQL database dump complete
--
