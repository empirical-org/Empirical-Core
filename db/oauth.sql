--
-- Data for Name: activity_classifications; Type: TABLE DATA; Schema: public; Owner: -
--
DELETE FROM activity_classifications;
INSERT INTO activity_classifications VALUES (1, 'passage', 'passage', 'http://localhost:3002/play/pf', 'IACa8Egt7CvVYgtHPtEn2w', 'http://localhost:3002/play/pf', '2014-04-19 00:05:03.052133', '2014-04-19 00:05:03.052133', 'grammar');
INSERT INTO activity_classifications VALUES (2, 'sentence', 'sentence', 'http://localhost:3002/play/sw', 's2u3tVuguhfUjOQxDP-7RA', 'http://localhost:3002/play/sw', '2014-04-19 00:05:03.11343', '2014-04-19 00:05:03.11343', 'grammar');


--
-- Name: activity_classifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('activity_classifications_id_seq', 2, true);


--
-- Data for Name: oauth_applications; Type: TABLE DATA; Schema: public; Owner: -
--
DELETE FROM oauth_applications;
INSERT INTO oauth_applications VALUES (1, 'Quill Lessons Module', 'quill-lessons', 'not-a-secret', 'http://localhost:3002/oauth/callback', '2014-04-19 00:05:03.202133', '2014-04-22 22:19:33.876482');


--
-- Name: oauth_applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('oauth_applications_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--

