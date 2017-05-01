--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.2
-- Dumped by pg_dump version 9.6.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: restaurant; Type: TABLE; Schema: public; Owner: todd
--

CREATE TABLE restaurant (
    id integer NOT NULL,
    name character varying,
    address character varying,
    category character varying
);


ALTER TABLE restaurant OWNER TO todd;

--
-- Name: restaurant_id_seq; Type: SEQUENCE; Schema: public; Owner: todd
--

CREATE SEQUENCE restaurant_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE restaurant_id_seq OWNER TO todd;

--
-- Name: restaurant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: todd
--

ALTER SEQUENCE restaurant_id_seq OWNED BY restaurant.id;


--
-- Name: review; Type: TABLE; Schema: public; Owner: todd
--

CREATE TABLE review (
    id integer NOT NULL,
    reviewer_id integer,
    stars integer,
    review text,
    restaurant_id integer,
    title character varying,
    CONSTRAINT review_stars_check CHECK (((stars > '-1'::integer) AND (stars < 6)))
);


ALTER TABLE review OWNER TO todd;

--
-- Name: review_id_seq; Type: SEQUENCE; Schema: public; Owner: todd
--

CREATE SEQUENCE review_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE review_id_seq OWNER TO todd;

--
-- Name: review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: todd
--

ALTER SEQUENCE review_id_seq OWNED BY review.id;


--
-- Name: reviewer; Type: TABLE; Schema: public; Owner: todd
--

CREATE TABLE reviewer (
    id integer NOT NULL,
    reviewer_name character varying,
    reviewer_email character varying,
    karma integer,
    password text,
    first_name text,
    last_name text,
    CONSTRAINT reviewer_karma_check CHECK (((karma > '-1'::integer) AND (karma < 8)))
);


ALTER TABLE reviewer OWNER TO todd;

--
-- Name: reviewer_id_seq; Type: SEQUENCE; Schema: public; Owner: todd
--

CREATE SEQUENCE reviewer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE reviewer_id_seq OWNER TO todd;

--
-- Name: reviewer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: todd
--

ALTER SEQUENCE reviewer_id_seq OWNED BY reviewer.id;


--
-- Name: restaurant id; Type: DEFAULT; Schema: public; Owner: todd
--

ALTER TABLE ONLY restaurant ALTER COLUMN id SET DEFAULT nextval('restaurant_id_seq'::regclass);


--
-- Name: review id; Type: DEFAULT; Schema: public; Owner: todd
--

ALTER TABLE ONLY review ALTER COLUMN id SET DEFAULT nextval('review_id_seq'::regclass);


--
-- Name: reviewer id; Type: DEFAULT; Schema: public; Owner: todd
--

ALTER TABLE ONLY reviewer ALTER COLUMN id SET DEFAULT nextval('reviewer_id_seq'::regclass);


--
-- Data for Name: restaurant; Type: TABLE DATA; Schema: public; Owner: todd
--

COPY restaurant (id, name, address, category) FROM stdin;
6	chick-fil-a	1900 roswell road	fast food
7	subway	2100 roswell road	sandwiches
8	No Review Restaurant	1122 anywhere ave	seafood
9	Lovies	3424 Piedmont Road, Atlanta, GA 30303	bbq
12	Subway	3410 Piedmont Road, Atlanta, GA 30303	sandwiches
14	Le madeline	5000 roswell road, marietta	french
15	dfdfd	fddfdfdfd	ffdfd
11	NaanStop	3420 Piedmont Road, Atlanta, GA 30305	Indian
2	los bravos	2125 Roswell Road, Marietta, GA 30062	mexican
16	Raja Indian Restaurant	2955 Peachtree Rd NE, Atlanta, GA 30305	indian
4	great wall	1275 Powers Ferry Road SE, Marietta, GA 30067	chinese
5	frankie's	3100 Roswell Rd, Marietta, Ga 30062	italian
3	lemon grass	2145 Roswell Road, Marietta, GA 30062	thai
1	Chipotle	3424 Piedmont Rd NE, Atlanta, GA 30305	mexican
17	Johnny's pizza	4880 lower roswell Road, Marietta, GA 30068	Pizza
18	Transmetropolitan	145 E Clayton St, Athens, GA 30601	pizza
\.


--
-- Name: restaurant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: todd
--

SELECT pg_catalog.setval('restaurant_id_seq', 18, true);


--
-- Data for Name: review; Type: TABLE DATA; Schema: public; Owner: todd
--

COPY review (id, reviewer_id, stars, review, restaurant_id, title) FROM stdin;
2	5	3	good place but needs better salsa	2	viva los bravos
5	6	2	always good	6	eat more chicken
7	6	4	great food	5	go frankie's
6	5	5	love their salad and garlic rolls	5	great mom and pop place
8	2	2	too spicy	4	not so great wall
9	7	3	I wish they had free chips like willys	1	Good Burrittos
15	7	2	just average indian food. trying to be to indian food what chipotle is to burritos	11	Indian fast food
16	7	2	It may not be the best sandwich in the world but at least you know if you find something you like there you will get it at any subway	12	Subway is consistent
17	7	2	lkjljklkllkj	12	udnlkjljk
18	7	2	tres bien	14	oh la la
23	\N	2	super great	5	great
24	6	2	good stuff man	1	one of my favorite places
25	6	2	i really like this place	3	wonderful
26	6	2	Great, fresh pizza and usually no wait	18	Love the Met
1	9	1	slow and too much mayonaise	7	subway should go underground
3	9	4	consistently good	4	love the wall
4	9	4	my favorite thai place	3	great thai
27	9	2	l7777d7d7ddd . d7d7 7 d d	15	lkjlkjljljlkjlkj
\.


--
-- Name: review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: todd
--

SELECT pg_catalog.setval('review_id_seq', 27, true);


--
-- Data for Name: reviewer; Type: TABLE DATA; Schema: public; Owner: todd
--

COPY reviewer (id, reviewer_name, reviewer_email, karma, password, first_name, last_name) FROM stdin;
2	amos	amos@dc.com	3	amos	amos	gichero
6	emma	emma@briley.org	4	emma	emma	briley
7	anonymous	\N	1	\N	john	smith
5	cindie	cindie@briley.org	5	cindie	cindie	briley
8	rruffin	randy@ruffin.com	0	$2a$10$CK.pv.iUWgC2vdBvCj7ZN.3I0AuVitx0YyEaOH9Jpx63hc1i6BN4K	Randy	Ruffin
9	tbriley	todd.briley@outlook.com	0	$2a$10$YfOQZJC0doU8.lawMD654eH6zauuxtdqUhQUXDnlTVHv8zK0oIShC	Todd	Briley
\.


--
-- Name: reviewer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: todd
--

SELECT pg_catalog.setval('reviewer_id_seq', 18, true);


--
-- Name: restaurant restaurant_pkey; Type: CONSTRAINT; Schema: public; Owner: todd
--

ALTER TABLE ONLY restaurant
    ADD CONSTRAINT restaurant_pkey PRIMARY KEY (id);


--
-- Name: review review_pkey; Type: CONSTRAINT; Schema: public; Owner: todd
--

ALTER TABLE ONLY review
    ADD CONSTRAINT review_pkey PRIMARY KEY (id);


--
-- Name: reviewer reviewer_pkey; Type: CONSTRAINT; Schema: public; Owner: todd
--

ALTER TABLE ONLY reviewer
    ADD CONSTRAINT reviewer_pkey PRIMARY KEY (id);


--
-- Name: review review_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: todd
--

ALTER TABLE ONLY review
    ADD CONSTRAINT review_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES restaurant(id);


--
-- Name: review review_reviewer_fkey; Type: FK CONSTRAINT; Schema: public; Owner: todd
--

ALTER TABLE ONLY review
    ADD CONSTRAINT review_reviewer_fkey FOREIGN KEY (reviewer_id) REFERENCES reviewer(id);


--
-- PostgreSQL database dump complete
--

