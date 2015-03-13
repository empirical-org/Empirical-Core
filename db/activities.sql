--
-- Data for Name: sections; Type: TABLE DATA; Schema: public; Owner: -
--

DELETE FROM sections;
INSERT INTO sections VALUES (7, 'CCSS Skill Set #1', 1, '2013-11-12 18:03:10.973539', '2013-11-12 18:03:10.973539', 1);
INSERT INTO sections VALUES (8, 'CCSS Skill Set #2', 2, '2013-11-12 18:03:21.827914', '2013-11-12 18:03:21.827914', 1);
INSERT INTO sections VALUES (9, 'CCSS Skill Set #3', 3, '2013-11-12 18:03:56.264738', '2013-11-12 18:03:56.264738', 1);
INSERT INTO sections VALUES (10, 'CCSS Skill Set #4', 4, '2013-11-12 18:04:06.474803', '2013-11-12 18:04:06.474803', 1);
INSERT INTO sections VALUES (11, 'CCSS Skill Set #5', 5, '2013-11-12 18:04:17.172862', '2013-11-12 18:04:17.172862', 1);
INSERT INTO sections VALUES (12, 'CCSS Skill Set #6', 6, '2013-11-12 18:26:44.966796', '2013-11-12 18:26:44.966796', 1);
INSERT INTO sections VALUES (13, 'CCSS Skill Set #7', 7, '2013-11-12 18:26:54.831619', '2013-11-12 18:26:54.831619', 1);
INSERT INTO sections VALUES (14, 'CCSS Skill Set #8', 8, '2013-11-12 18:27:14.338376', '2013-11-12 18:27:14.338376', 1);
INSERT INTO sections VALUES (18, 'CCSS Skill Set #9', 9, '2013-11-21 18:42:21.981079', '2013-11-21 18:42:21.981079', 1);
INSERT INTO sections VALUES (21, 'Quill Tutorial Lesson', 10, '2014-04-21 04:35:33.197955', '2014-04-21 04:35:33.197955', NULL);
INSERT INTO sections VALUES (16, 'Custom Middle School Lessons', 11, '2013-11-12 18:40:02.327463', '2013-11-12 18:40:02.327463', 1);
INSERT INTO sections VALUES (17, 'University Lessons', 12, '2013-11-12 18:40:29.613715', '2013-11-12 18:40:29.613715', 1);


--
-- Name: sections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('sections_id_seq', 21, true);


--
-- Data for Name: topic_categories; Type: TABLE DATA; Schema: public; Owner: -
--

DELETE FROM topic_categories;
INSERT INTO topic_categories VALUES (1, 'Adjectives & Adverbs', '2015-03-06 22:50:24.837599', '2015-03-06 22:50:24.837599');
INSERT INTO topic_categories VALUES (2, 'Capitalization', '2015-03-06 22:50:25.837599', '2015-03-06 22:50:25.837599');
INSERT INTO topic_categories VALUES (3, 'Comma Usage', '2015-03-06 22:50:26.837599', '2015-03-06 22:50:26.837599');
INSERT INTO topic_categories VALUES (4, 'Commonly Confused Words', '2015-03-06 22:50:27.837599', '2015-03-06 22:50:27.837599');
INSERT INTO topic_categories VALUES (5, 'Conjunctions', '2015-03-06 22:50:28.837599', '2015-03-06 22:50:28.837599');
INSERT INTO topic_categories VALUES (6, 'Determiners', '2015-03-06 22:50:29.837599', '2015-03-06 22:50:29.837599');
INSERT INTO topic_categories VALUES (7, 'Nouns & Pronouns', '2015-03-06 22:50:30.837599', '2015-03-06 22:50:30.837599');
INSERT INTO topic_categories VALUES (8, 'Prepositions', '2015-03-06 22:50:31.837599', '2015-03-06 22:50:31.837599');
INSERT INTO topic_categories VALUES (9, 'Punctuation', '2015-03-06 22:50:32.837599', '2015-03-06 22:50:32.837599');
INSERT INTO topic_categories VALUES (10, 'Structure', '2015-03-06 22:50:33.837599', '2015-03-06 22:50:33.837599');
INSERT INTO topic_categories VALUES (11, 'Summative Assessments', '2015-03-06 22:50:34.837599', '2015-03-06 22:50:34.837599');
INSERT INTO topic_categories VALUES (12, 'Verbs', '2015-03-06 22:50:35.837599', '2015-03-06 22:50:35.837599');


--
-- Name: topic_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('topic_categories_id_seq', 1, true);



--
-- Data for Name: activities; Type: TABLE DATA; Schema: public; Owner: -
--

DELETE FROM activities;
INSERT INTO activities VALUES (1, 'Shackleton Returns from the Antarctic', 'Shackleton Returns from the Antarctic.', 'BaJi4-PhNRz9um-o0u-w6Q', '"body"=>"In 1914, Ernest Shackleton set {+off-of|1} on an exploration across the Antarctic. In 1915 his ship, Endurance, became trapped in the ice, and {+its-it''s|2} crew was stuck. Ten months later {+their-there|3} ship sank, and {+Shackleton''s-Shackletons|4} crew was forced to live on {+an-a|5} iceberg. They reached Elephant Island in {+April-april|6} of 1916 using three lifeboats. 

Shackleton promised to {+find-found|7} help. In a small boat with five crew members, he spent 16 days crossing 800 miles of ocean. The remaining men were then rescued {+in-on|8} August of 1916. Amazingly, Shackleton did not {+lose-loose|9} anyone on the trip. ", "instructions"=>"There are **nine errors** in this passage. *To edit a word, click on it and re-type it.*"', 1, 1, '2013-09-14 00:01:09.788782', '2014-04-18 22:58:11.400208', '{production}');
INSERT INTO activities VALUES (2, 'Lose vs. loose, it''s vs. its, they''re vs. their vs. there etc...', 'Shackleton Returns from the Antarctic.', '1tHuCGX7hWjNx6e8HADAFA', '"rule_position"=>"---
- ''1''
- ''2''
- ''3''
- ''4''
- ''5''
- ''6''
- ''7''
- ''8''
- ''9''
"', 2, 1, '2013-09-14 00:01:09.788782', '2014-04-18 22:58:11.400208', '{production}');
INSERT INTO activities VALUES (184, 'Test Activity', 'Description', 'FtBjOj0nhBW63TYd3IwFwA', '"body"=>"--- Test edit body.
...
", "instructions"=>"--- 
...
"', 1, 1, '2014-05-22 16:18:28.42208', '2014-05-22 16:21:12.586615', '{alpha}');
INSERT INTO activities VALUES (185, 'Test', 'Test', 'y61hGStcKg4sJuML0gsZaQ', NULL, 2, 1, '2014-05-22 16:59:19.813595', '2014-05-22 16:59:19.813595', '{alpha}');
INSERT INTO activities VALUES (186, 'Test', 'Test', 'OMFHX46vFqd9jRGMxq9anw', '"rule_position"=>"---
- - '' 2''
  - ''''
"', 2, 1, '2014-05-22 17:00:14.571331', '2014-05-22 17:00:41.166479', '{alpha}');


SELECT pg_catalog.setval('activities_id_seq', 187, true);


--
-- Data for Name: topics; Type: TABLE DATA; Schema: public; Owner: -
--

DELETE FROM topics;
INSERT INTO topics VALUES (1, '111. Shackleton Returns from the Antarctic.', 16, '2013-09-14 00:01:09.788782', '2014-04-18 22:58:11.400208', 4);
INSERT INTO topics VALUES (7, '1.1b. Use Common, Proper, and Possessive Nouns', 7, '2013-09-16 02:15:51.34529', '2014-04-18 22:30:01.450188', 7);
INSERT INTO topics VALUES (10, '1.1c. Use Singular and Plural Nouns with Matching Verbs in Basic Sentences', 7, '2013-09-16 17:15:32.176173', '2014-04-18 22:38:09.257842', 12);
INSERT INTO topics VALUES (12, '1.1e. Use Verbs to Convey a Sense of Past, Present, and Future', 7, '2013-09-16 17:35:19.88059', '2014-04-18 22:52:19.373984', 12);
INSERT INTO topics VALUES (14, '1.1g. Conjunctions: And, But, Or, So', 7, '2013-09-16 19:38:22.867581', '2014-04-18 23:21:51.045773', 5);
INSERT INTO topics VALUES (15, '2.1b. Use Irregular Plural Nouns', 8, '2013-09-16 19:44:16.857823', '2014-04-18 22:24:43.263988', 7);
INSERT INTO topics VALUES (17, '1.1h. Use Determiners: Articles, Demonstratives', 7, '2013-09-16 20:13:44.623135', '2014-04-18 21:24:28.266849', 6);
INSERT INTO topics VALUES (18, '1.2a. Capitalize Dates and Names of People', 7, '2013-09-16 21:26:14.765994', '2014-04-18 20:38:14.165294', 2);
INSERT INTO topics VALUES (19, '1.2c. Use Commas for Dates and Lists.', 7, '2013-09-16 22:57:25.589845', '2014-04-18 20:46:27.789184', 9);
INSERT INTO topics VALUES (20, '2.2c. Use an Apostrophe to Form Contractions', 8, '2013-09-16 23:22:07.322974', '2014-04-18 22:30:44.1037', 9);
INSERT INTO topics VALUES (21, '2.1e. Use Adjectives and Adverbs', 8, '2013-09-17 00:36:37.250186', '2014-04-18 16:34:10.768263', 1);
INSERT INTO topics VALUES (22, '2.1d. Form and Use the Past Tense of Frequently Occurring Irregular Verbs.', 8, '2013-09-17 00:51:14.844977', '2014-04-18 20:26:44.464465', 12);
INSERT INTO topics VALUES (23, '2.2a. Capitalize Holidays, Product Names, and Geographic Names', 8, '2013-09-17 01:04:33.233233', '2014-04-18 22:33:26.111283', 2);
INSERT INTO topics VALUES (24, '2.1c. Use Reflexive Pronouns', 8, '2013-09-17 01:22:23.681351', '2014-04-18 21:59:25.17154', 7);
INSERT INTO topics VALUES (25, '2.1a. Use Collective Nouns', 8, '2013-09-17 01:27:18.228369', '2014-04-18 21:58:25.696812', 7);
INSERT INTO topics VALUES (27, '4.1a. Use Relative Pronouns', 10, '2013-09-23 22:09:40.586163', '2014-04-18 22:27:01.39072', 7);
INSERT INTO topics VALUES (29, '4.1c. Can/May vs. Should/Must', 10, '2013-09-24 00:17:11.579076', '2014-04-17 17:04:38.824094', 4);
INSERT INTO topics VALUES (30, '4.1e. Prepositional Phrases', 10, '2013-09-24 00:48:43.771996', '2014-04-18 02:30:57.443636', 8);
INSERT INTO topics VALUES (31, '4.2a. Use Correct Capitalization', 10, '2013-09-24 01:34:01.858966', '2014-04-17 18:56:54.185618', 2);
INSERT INTO topics VALUES (32, '6.1a. Subjective, Objective, and Possessive Pronouns', 12, '2013-09-24 02:02:28.091318', '2014-04-18 17:11:44.635185', 7);
INSERT INTO topics VALUES (33, '6.1b. Intensive Pronouns', 12, '2013-09-24 02:23:18.299603', '2014-04-18 01:45:01.030993', 7);
INSERT INTO topics VALUES (34, '6.1c. Recognizing Inappropriate Shifts in Pronoun Number or Gender', 12, '2013-09-24 02:30:41.36037', '2014-04-18 15:55:37.715141', 7);
INSERT INTO topics VALUES (38, '3.1g. Form and Use Comparative and Superlative Adjectives', 9, '2013-10-14 18:43:47.566805', '2014-04-18 19:41:39.222061', 1);
INSERT INTO topics VALUES (39, '3.2b. Use Commas in Addresses', 9, '2013-10-14 18:57:04.554473', '2014-04-18 18:18:49.087687', 9);
INSERT INTO topics VALUES (40, '3.2c. Use Commas and Quotation Marks in Dialogue', 9, '2013-10-14 19:11:24.963517', '2014-04-15 17:10:54.218742', 9);
INSERT INTO topics VALUES (41, '3.2a. Capitalize Words in Titles', 9, '2013-10-14 19:11:49.52138', '2014-04-18 19:36:06.854108', 2);
INSERT INTO topics VALUES (42, '3.2d. Form and use Possessives', 9, '2013-10-14 19:19:29.212539', '2014-04-18 19:41:21.028127', 7);
INSERT INTO topics VALUES (43, '5.1e. Correlative Conjunctions', 11, '2013-10-14 19:22:42.267036', '2014-04-17 14:29:44.627603', 5);
INSERT INTO topics VALUES (44, '5.2a. Use Colons and Commas in a List', 11, '2013-10-14 19:55:06.99711', '2014-04-17 18:40:16.248576', 9);
INSERT INTO topics VALUES (46, '4.1g. Commonly Confused Words', 10, '2013-10-21 03:28:37.357468', '2014-04-17 18:03:19.367424', 4);
INSERT INTO topics VALUES (47, '5.2b. Use Commas after Introductory Words', 11, '2013-10-21 20:10:21.380138', '2014-04-18 18:17:10.956399', 9);
INSERT INTO topics VALUES (49, '7.1c. Misplaced Modifiers', 13, '2013-10-23 21:01:31.179576', '2014-04-15 12:20:30.994112', 10);
INSERT INTO topics VALUES (51, '7.2a. Use a Comma to Separate Coordinate Adjectives', 13, '2013-10-27 22:17:52.194134', '2014-04-15 12:26:07.903703', 9);
INSERT INTO topics VALUES (52, '8.1b. Form and Use Verbs in the Active and Passive Voice', 14, '2013-11-01 18:46:51.419592', '2014-04-18 15:44:33.268954', 12);
INSERT INTO topics VALUES (59, '9.1a. Use Parallel Structure', 18, '2013-11-13 05:09:44.735591', '2014-04-18 16:40:36.611754', 10);
INSERT INTO topics VALUES (62, 'University Grammar Test: A Man and His Mouse', 17, '2013-11-14 21:08:47.126042', '2014-03-27 19:04:34.905549', 11);
INSERT INTO topics VALUES (63, '2.1d. Irregular Past Tense Verbs with Images.', 16, '2013-12-10 23:13:15.492041', '2014-04-17 18:55:22.29122', 12);
INSERT INTO topics VALUES (64, 'University Grammar Test: The First Spacewalk', 17, '2014-01-08 21:07:48.41956', '2014-04-16 11:18:22.643134', 11);
INSERT INTO topics VALUES (48, '5.1b. Use Past Participles', 11, '2013-10-23 03:26:08.723149', '2014-04-19 20:46:05.16873', 12);
INSERT INTO topics VALUES (6, '1.1i. Frequently Occurring Prepositions', 7, '2014-04-19 15:42:40.907022', '2014-04-19 20:47:48.787216', 8);
INSERT INTO topics VALUES (4, '4.1b. The Progressive Tense', 10, '2014-04-19 15:42:31.262329', '2014-04-19 20:48:04.203959', 12);
INSERT INTO topics VALUES (16, '8.1d. Recognize and Correct Innapropriate Shifts in Verb Voice and Mood', 14, '2014-04-19 15:43:09.964846', '2014-04-19 20:49:07.438917', 12);
INSERT INTO topics VALUES (55, '5.2c. Use a Comma to Set off the Words "Yes" and "No"', 11, '2014-04-19 15:43:20.06305', '2014-04-19 20:47:05.606249', 9);
INSERT INTO topics VALUES (54, 'M3. Correcting Messy Sentences', 16, '2013-11-09 22:05:49.7566', '2014-04-21 00:34:06.29443', 10);
INSERT INTO topics VALUES (37, 'M2. Using Spaces with Punctuation', 16, '2013-10-04 04:35:05.503399', '2014-04-21 00:34:17.25728', 9);
INSERT INTO topics VALUES (50, 'M1. Using Spaces With Quotation Marks', 16, '2013-10-27 21:25:23.867592', '2014-04-21 00:34:25.965074', 9);
INSERT INTO topics VALUES (53, 'Quill Tutorial Lessons', 21, '2013-11-04 01:50:41.524531', '2014-04-21 04:38:13.726648', 4);
INSERT INTO topics VALUES (56, 'University: Commonly Confused Words', 17, '2013-11-11 20:19:00.092152', '2014-04-21 04:39:49.049206', 4);


--
-- Name: topics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('topics_id_seq', 55, true);


--
-- PostgreSQL database dump complete
--

