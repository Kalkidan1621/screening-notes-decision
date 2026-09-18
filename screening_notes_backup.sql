--
-- PostgreSQL database dump
--

\restrict hoS5anhIU0KbfMidIdLGktFpAhreY9XO7uFgqBzWPsr7FchV6whicz9B3973151

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA drizzle;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: -
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: -
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: -
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- Name: applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.applications (
    id integer NOT NULL,
    job_id integer NOT NULL,
    full_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(50) NOT NULL,
    resume_name character varying(255) NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    resume_path character varying(500),
    resume_url text,
    candidate_id integer
);


--
-- Name: applications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.applications_id_seq OWNED BY public.applications.id;


--
-- Name: employers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.employers (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(50),
    address character varying(255),
    description text,
    logo_url text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: employers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.employers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: employers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.employers_id_seq OWNED BY public.employers.id;


--
-- Name: hiring_decisions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hiring_decisions (
    id integer NOT NULL,
    application_id integer NOT NULL,
    decision character varying(20) NOT NULL,
    note text,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: hiring_decisions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hiring_decisions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hiring_decisions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hiring_decisions_id_seq OWNED BY public.hiring_decisions.id;


--
-- Name: interviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.interviews (
    id integer NOT NULL,
    application_id integer NOT NULL,
    interviewer_id integer,
    interview_type character varying(50) NOT NULL,
    scheduled_at timestamp without time zone NOT NULL,
    location character varying(255),
    notes text,
    status character varying(30) DEFAULT 'scheduled'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: interviews_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.interviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: interviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.interviews_id_seq OWNED BY public.interviews.id;


--
-- Name: jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.jobs (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    department character varying(100) NOT NULL,
    location character varying(100) NOT NULL,
    employment_type character varying(50) NOT NULL,
    priority character varying(20) NOT NULL,
    description text NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    employer character varying(255) NOT NULL,
    working_time character varying(100) NOT NULL,
    experience character varying(100) NOT NULL,
    educational_qualification character varying(255) NOT NULL,
    opening_date character varying(50) NOT NULL,
    closing_date character varying(50) NOT NULL,
    salary character varying(100) NOT NULL
);


--
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permissions (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description character varying(255),
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.permissions_id_seq OWNED BY public.permissions.id;


--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role_permissions (
    id integer NOT NULL,
    role_id integer NOT NULL,
    permission_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: role_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.role_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: role_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.role_permissions_id_seq OWNED BY public.role_permissions.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description character varying(255),
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: screening_decisions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.screening_decisions (
    id integer NOT NULL,
    decision character varying(20) NOT NULL,
    note text,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    application_id integer NOT NULL
);


--
-- Name: screening_decisions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.screening_decisions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: screening_decisions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.screening_decisions_id_seq OWNED BY public.screening_decisions.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    token text NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sessions_id_seq OWNED BY public.sessions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    role_id integer NOT NULL,
    profile_image_url text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
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
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: -
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- Name: applications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applications ALTER COLUMN id SET DEFAULT nextval('public.applications_id_seq'::regclass);


--
-- Name: employers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employers ALTER COLUMN id SET DEFAULT nextval('public.employers_id_seq'::regclass);


--
-- Name: hiring_decisions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hiring_decisions ALTER COLUMN id SET DEFAULT nextval('public.hiring_decisions_id_seq'::regclass);


--
-- Name: interviews id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interviews ALTER COLUMN id SET DEFAULT nextval('public.interviews_id_seq'::regclass);


--
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- Name: permissions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions ALTER COLUMN id SET DEFAULT nextval('public.permissions_id_seq'::regclass);


--
-- Name: role_permissions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions ALTER COLUMN id SET DEFAULT nextval('public.role_permissions_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: screening_decisions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.screening_decisions ALTER COLUMN id SET DEFAULT nextval('public.screening_decisions_id_seq'::regclass);


--
-- Name: sessions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions ALTER COLUMN id SET DEFAULT nextval('public.sessions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: -
--

COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
1	5b320b74c6c7dbfd4ad4055ac08e2c3d19e702d7c7e72947800cae68fec061d2	1783925469528
2	2f311d0ef9c46ac1ed595dedfebd9ce8b2dff530d9ab7c85016a2fcbc909cee3	1785595902706
3	4619ecd203faa4dada6c7821b6a79f5214c4dfbb7cef707966ecd9cbef32625b	1785702467944
4	b61f446ab70b52d6bcf8da3675354d789863d4307a1fe239b2c8a72e2b03cffe	1785855706842
5	2af242f4f9e803f26a4a721a859e12b4bfd42978edf54a596fb342538bbbf308	1786525298617
\.


--
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.applications (id, job_id, full_name, email, phone, resume_name, status, created_at, updated_at, resume_path, resume_url, candidate_id) FROM stdin;
14	4	Abebe Kebede	abebe@gmail.com	0912223344	Bezawit Berhan (2).pdf	interview	2026-08-24 16:42:26.386554	2026-09-03 13:29:08.415	application/cv/1787578939521-Bezawit Berhan (2)	https://res.cloudinary.com/qfmocagu/image/upload/v1787578944/application/cv/1787578939521-Bezawit%20Berhan%20%282%29.pdf	4
13	4	kalkidan ewunetu	kal@gmail.com	0911212345	Kalkidan Ewunetu.pdf	rejected	2026-08-21 12:35:10.550626	2026-09-05 13:40:51.473	application/cv/1787304899890-Kalkidan Ewunetu	https://res.cloudinary.com/qfmocagu/image/upload/v1787304912/application/cv/1787304899890-Kalkidan%20Ewunetu.pdf	\N
3	1	beza birhan	beza@gmail.com	0912345678	Bezawit Berhan (2).pdf	rejected	2026-08-03 16:06:52.766742	2026-08-14 20:10:58.495	\N	\N	\N
9	4	Iman Abirham	iman123@gmail.com	0976543456	Bezawit Berhan.pdf	hiring_decision	2026-08-17 10:52:34.063959	2026-09-11 15:26:48.133	application/cv/1786953143697-Bezawit Berhan	https://res.cloudinary.com/qfmocagu/raw/upload/v1786953150/application/cv/1786953143697-Bezawit%20Berhan	\N
2	1	kalkidan hailu	kalhailu944@gmail.com	0987654321	kalkidan hailu (5).pdf	approved	2026-08-03 10:25:52.025886	2026-08-16 20:36:57.098	\N	\N	\N
4	3	kalkidan ewunetu	kal@gmail.com	0900119988	Kalkidan Ewunetu.pdf	approved	2026-08-08 13:56:13.022786	2026-09-02 22:47:55.358	\N	\N	\N
6	2	kebede sisay	kebe@gmail.com	0912223344	Bezawit Berhan (2).pdf	hiring_decision	2026-08-14 15:50:58.563209	2026-09-15 09:18:30.978	\N	\N	\N
18	4	asdfgh qwert	as@gmail.com	0988554422	Kalkidan.pdf	ready_for_hire	2026-09-13 08:16:16.988789	2026-09-15 14:06:58.041	application/cv/1789276549748-Kalkidan	https://res.cloudinary.com/qfmocagu/raw/upload/v1789276577/application/cv/1789276549748-Kalkidan	45
16	3	nuhamin asdfgh	nunu@gmail.com	0912345674	kalkidan hailu (5).pdf	shortlisted	2026-08-27 00:42:09.987594	2026-09-07 21:14:10.337	application/cv/1787780503345-kalkidan hailu (5)	https://res.cloudinary.com/qfmocagu/raw/upload/v1787780530/application/cv/1787780503345-kalkidan%20hailu%20%285%29	41
1	1	Abebe Kebede	abebe@gmail.com	0911000000	abebe-cv.pdf	approved	2026-08-02 23:48:03.763795	2026-08-12 10:53:50.517	\N	\N	4
7	3	kebede sisay	kebe@gmail.com	0912223344	4.pdf	approved	2026-08-15 17:21:28.250771	2026-09-07 22:56:00.176	https://res.cloudinary.com/qfmocagu/raw/upload/v1786803688/applications/cv/1786803682084-4	\N	\N
11	4	Promi Hailu	kal944@gmail.com	0911228876	Kalkidan.pdf	hiring_decision	2026-08-17 14:30:44.536379	2026-09-15 12:48:19.041	application/cv/1786966236801-Kalkidan	https://res.cloudinary.com/qfmocagu/raw/upload/v1786966243/application/cv/1786966236801-Kalkidan	\N
8	3	hiwot	kk@gmail.com	0911556677	Bezawit Berhan.pdf	shortlisted	2026-08-15 18:15:52.641619	2026-09-07 22:56:48.577	https://res.cloudinary.com/qfmocagu/image/upload/v1786806952/application/cv/ivtgud7kixsdsirqczv4.pdf	\N	\N
12	4	Promise Hailu	kal@gmail.com	0911212345	Kalkidan Ewunetu.pdf	hired	2026-08-17 15:01:47.302818	2026-09-12 21:15:39.533	application/cv/1786968095055-Kalkidan Ewunetu	https://res.cloudinary.com/qfmocagu/image/upload/v1786968105/application/cv/1786968095055-Kalkidan%20Ewunetu.pdf	\N
10	4	Hana Haile	hana12@gmail.com	0900998833	4.pdf	hired	2026-08-17 13:24:00.227148	2026-09-08 08:36:57.564	application/cv/1786962234889-4	https://res.cloudinary.com/qfmocagu/image/upload/v1786962239/application/cv/1786962234889-4.pdf	\N
15	4	abirham sisay	ab@gmail.com	0987654326	Bezawit Berhan.pdf	hired	2026-08-26 17:32:00.068032	2026-09-12 21:20:14.366	application/cv/1787754715855-Bezawit Berhan	https://res.cloudinary.com/qfmocagu/raw/upload/v1787754719/application/cv/1787754715855-Bezawit%20Berhan	40
17	1	eden Hailu	edu@gmail.com	0965374677	Kalkidan Ewunetu.pdf	hired	2026-08-27 12:00:00.97857	2026-09-15 13:20:03.49	application/cv/1787821194675-Kalkidan Ewunetu	https://res.cloudinary.com/qfmocagu/raw/upload/v1787821202/application/cv/1787821194675-Kalkidan%20Ewunetu	42
5	3	azmera abebe	azmera@gmail.com	0999887766	4.pdf	pending	2026-08-12 12:59:46.34918	2026-08-12 12:59:46.34918	\N	\N	\N
\.


--
-- Data for Name: employers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.employers (id, name, email, phone, address, description, logo_url, is_active, created_at, updated_at) FROM stdin;
1	Ethio Telecom	info@ethiotelecom.et	+251 115 505 050	Addis Ababa, Ethiopia	Telecommunication service provider.	\N	t	2026-09-07 15:24:37.825753	2026-09-07 12:51:10.599
2	muyalogy	muyalogy@gmail.com	+251923456785	Addis Abeba	this company is digital service and real company in ethiopia and i need accountant	\N	t	2026-09-08 11:46:12.244203	2026-09-08 11:46:12.244203
\.


--
-- Data for Name: hiring_decisions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.hiring_decisions (id, application_id, decision, note, updated_at) FROM stdin;
1	10	approve	ready to hire this candidate	2026-09-08 08:36:32.898
3	12	approve	good	2026-09-12 21:15:32.286
2	15	approve	good performance	2026-09-12 21:20:08.893
4	17	approve	pass	2026-09-15 13:19:55.655
5	18	approve	\N	2026-09-15 14:06:58.041
\.


--
-- Data for Name: interviews; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.interviews (id, application_id, interviewer_id, interview_type, scheduled_at, location, notes, status, created_at, updated_at) FROM stdin;
4	8	1	onsite	2026-09-13 00:08:00	wollo	good performance	completed	2026-09-08 00:08:56.435	2026-09-08 00:09:28.702
5	10	2	onsite	2026-09-17 08:35:00	abado	not late	completed	2026-09-08 08:35:32.035	2026-09-08 08:35:42.688
6	9	6	online	2026-09-27 15:26:00	www.muyalogy.com	\N	completed	2026-09-11 15:26:39.528	2026-09-11 15:26:48.133
7	12	1	onsite	2026-09-16 21:14:00	goro	not late exist on time	completed	2026-09-12 21:15:13.168	2026-09-12 21:15:20.183
1	16	1	on-site	2026-09-02 10:00:00	Addis Ababa Office	Technical assessment and system design discussion.	scheduled	2026-09-01 16:38:24.813443	2026-09-01 13:38:24.813
2	15	1	on-site	2026-09-14 23:00:00	meskel flower	\N	completed	2026-09-03 02:01:03.309707	2026-09-08 08:38:59.62
3	14	2	on-site	2026-09-06 15:28:00	denbel	\N	cancelled	2026-09-03 16:29:08.218209	2026-09-08 08:40:50.658
8	18	6	online	2026-09-17 05:20:00	www.muyalogy.com	not late	completed	2026-09-13 05:21:22.693	2026-09-13 05:23:34.296
9	6	3	onsite	2026-09-15 09:18:00	meskelegna	not late	completed	2026-09-15 09:18:23.556	2026-09-15 09:18:30.978
10	11	3	onsite	2026-09-15 12:48:00	mexico	not late	completed	2026-09-15 12:48:13.974	2026-09-15 12:48:19.041
11	17	6	onsite	2026-09-23 13:00:00	denbel	not late	completed	2026-09-15 13:00:43.567	2026-09-15 13:05:07.803
\.


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.jobs (id, title, department, location, employment_type, priority, description, status, created_at, updated_at, employer, working_time, experience, educational_qualification, opening_date, closing_date, salary) FROM stdin;
4	Senior Backend Developer	Software Engineering	Addis Ababa	part-time	high	The Senior Backend Developer will design, develop, and maintain scalable and reliable backend services and APIs. The role involves working closely with frontend developers, database engineers, and other team members to build secure and high-performance applications. The candidate will also review code, troubleshoot technical issues, optimize system performance, and contribute to architectural decisions.	active	2026-08-10 13:05:50.035542	2026-08-10 13:05:50.035542	Moyalogy Company	Monday to Friday, 5:00 PM - 7:00 PM	2+ years	Bachelor's Degree in Computer Science and Software Engineering	2026-08-16	2026-08-21	45,000 – 65,000 ETB
1	Senior Frontend Developer	Engineering	Addis Ababa	full-time	high	We are looking for an experienced frontend developer to build modern and responsive web applications.	active	2026-08-01 23:54:03.292574	2026-08-01 23:54:03.292574	Unknown	Monday to Friday 8:00 AM - 5:00 AM 	3+ years	BSc Degree in ComputerScience,Software Engineering or related field	1990	1987	35000
3	Receptionist	Accounting	wollo	full-time	low	We are looking for  Accounting and need good communication skill	active	2026-08-05 10:26:16.166392	2026-08-05 10:26:16.166392	Unknown	Monday to Friday 8:00 AM - 5:00 AM 	Fresh Graduate	BSc Degree in Accounting,Management,Marketing or related field	18	1987	25000
2	Senior Accountant	Bachelor’s degree in Accounting, Finance, or a related field.	DireDawa	full-time	high	We are seeking a detail-oriented and experienced Senior Accountant to manage financial records, prepare financial reports, support budgeting and forecasting, and ensure compliance with accounting standards and company policies. The Senior Accountant will oversee day-to-day accounting activities, review financial transactions, and provide accurate financial information to support management decision-making.\nRequirements\nProfessional accounting certification such as ACCA, CPA, CMA, or an equivalent qualification is preferred.\nMinimum of 3–5 years of relevant accounting experience.\nStrong knowledge of accounting principles, financial reporting, and tax regulations.\nProficiency in accounting software and Microsoft Excel.\nExperience with financial analysis, budgeting, and forecasting.\nStrong analytical, organizational, and problem-solving skills.\nExcellent attention to detail and accuracy.\nStrong written and verbal communication skills.\nAbility to manage multiple tasks and meet deadlines.\nAbility to work independently and collaboratively as part of a team.	active	2026-08-04 15:39:47.281054	2026-08-04 15:39:47.281054	COCA COLA COMPANY	Monday to Friday 8:00 AM - 5:00 AM 	3+ years	BSc Degree in Accounting,Management,Marketing or related field	1990	1987	25000
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.permissions (id, name, description, created_at) FROM stdin;
1	jobs:view	View jobs	2026-08-20 16:40:30.419082
2	jobs:create	Create jobs	2026-08-20 16:40:30.424512
3	jobs:update	Update jobs	2026-08-20 16:40:30.426707
4	jobs:delete	Delete jobs	2026-08-20 16:40:30.429314
5	applications:view	View applications	2026-08-20 16:40:30.431659
6	applications:update	Update application status	2026-08-20 16:40:30.434527
7	screening:view	View screening information	2026-08-20 16:40:30.436632
8	screening:create	Create screening decisions	2026-08-20 16:40:30.438502
9	screening:update	Update screening decisions	2026-08-20 16:40:30.440823
10	users:view	View users	2026-08-20 16:40:30.442517
11	users:create	Create users	2026-08-20 16:40:30.444175
12	users:update	Update users	2026-08-20 16:40:30.448128
13	users:delete	Delete users	2026-08-20 16:40:30.449745
14	roles:view	View roles	2026-08-20 16:40:30.451313
15	roles:manage	Manage roles and permissions	2026-08-20 16:40:30.452904
16	jobs.read	View job positions	2026-08-21 06:01:43.697151
17	jobs.create	Create job positions	2026-08-21 06:01:44.049794
18	jobs.update	Update job positions	2026-08-21 06:01:44.052561
19	jobs.delete	Delete job positions	2026-08-21 06:01:44.055464
20	applications.read	View applications	2026-08-21 06:01:44.059522
21	applications.update	Update applications	2026-08-21 06:01:44.062843
22	applications.delete	Delete applications	2026-08-21 06:01:44.138599
23	applications.stats.read	View application statistics	2026-08-21 06:01:44.14099
24	applications.status.update	Approve or reject applications	2026-08-21 06:01:44.143272
25	screening.read	View screening information	2026-08-21 06:01:44.145662
26	screening.decision.write	Create or update screening decisions	2026-08-21 06:01:44.148094
27	screening.delete	Delete screening information	2026-08-21 06:01:44.150429
28	hiring_decisions.read	View hiring decisions	2026-08-21 06:01:44.152829
29	hiring_decisions.create	Create hiring decisions	2026-08-21 06:01:44.155229
30	hiring_decisions.update	Update hiring decisions	2026-08-21 06:01:44.182309
31	users.read	View users	2026-08-21 06:01:44.184024
32	users.create	Create users	2026-08-21 06:01:44.18582
33	users.update	Update users	2026-08-21 06:01:44.187565
34	users.delete	Delete users	2026-08-21 06:01:44.189234
35	roles.read	View roles	2026-08-21 06:01:44.190971
36	roles.create	Create roles	2026-08-21 06:01:44.193282
37	roles.update	Update roles	2026-08-21 06:01:44.194865
38	permissions.read	View permissions	2026-08-21 06:01:44.196496
39	permissions.manage	Manage permissions	2026-08-21 06:01:44.19795
40	applications.create	Candidate can submit job applications	2026-08-26 11:01:59.52
41	applications.own.read	Candidate can view their own applications	2026-08-26 11:01:59.52
42	applications.own.update	Candidate can update their own applications	2026-08-26 11:01:59.52
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.role_permissions (id, role_id, permission_id, created_at) FROM stdin;
1	1	1	2026-08-20 16:40:30.747075
2	1	2	2026-08-20 16:40:30.838535
3	1	3	2026-08-20 16:40:30.840436
4	1	4	2026-08-20 16:40:30.842259
5	1	5	2026-08-20 16:40:30.843938
6	1	6	2026-08-20 16:40:30.845582
7	1	7	2026-08-20 16:40:30.847507
8	1	8	2026-08-20 16:40:30.849212
9	1	9	2026-08-20 16:40:30.850704
10	1	10	2026-08-20 16:40:30.852133
11	1	11	2026-08-20 16:40:30.853524
12	1	12	2026-08-20 16:40:30.854866
13	1	13	2026-08-20 16:40:30.856238
14	1	14	2026-08-20 16:40:30.85777
15	1	15	2026-08-20 16:40:30.859234
16	2	1	2026-08-20 16:40:30.860888
17	2	2	2026-08-20 16:40:30.86246
18	2	3	2026-08-20 16:40:30.864044
19	2	4	2026-08-20 16:40:30.865527
20	2	5	2026-08-20 16:40:30.866908
21	2	6	2026-08-20 16:40:30.86823
22	2	7	2026-08-20 16:40:30.869554
23	2	8	2026-08-20 16:40:30.870862
24	2	9	2026-08-20 16:40:30.872395
25	2	10	2026-08-20 16:40:30.873987
26	2	11	2026-08-20 16:40:30.875624
27	2	12	2026-08-20 16:40:30.87731
28	2	13	2026-08-20 16:40:30.87893
29	2	14	2026-08-20 16:40:30.880475
30	2	15	2026-08-20 16:40:30.882032
31	3	1	2026-08-20 16:40:30.883611
32	3	2	2026-08-20 16:40:30.885317
33	3	3	2026-08-20 16:40:30.887005
34	3	5	2026-08-20 16:40:30.888646
35	3	6	2026-08-20 16:40:30.890348
36	3	7	2026-08-20 16:40:30.891972
37	3	8	2026-08-20 16:40:30.893702
38	3	9	2026-08-20 16:40:30.895274
39	4	1	2026-08-20 16:40:30.896803
40	4	5	2026-08-20 16:40:30.898442
41	4	7	2026-08-20 16:40:30.900072
42	1	16	2026-08-21 06:01:44.355406
43	1	17	2026-08-21 06:01:44.600888
44	1	18	2026-08-21 06:01:44.638875
45	1	19	2026-08-21 06:01:44.641629
46	1	20	2026-08-21 06:01:44.709365
47	1	21	2026-08-21 06:01:44.712084
48	1	22	2026-08-21 06:01:44.714753
49	1	23	2026-08-21 06:01:44.717354
50	1	24	2026-08-21 06:01:44.719769
51	1	25	2026-08-21 06:01:44.722108
52	1	26	2026-08-21 06:01:44.724298
53	1	27	2026-08-21 06:01:44.726524
54	1	28	2026-08-21 06:01:44.728695
55	1	29	2026-08-21 06:01:44.730901
56	1	30	2026-08-21 06:01:44.733012
57	1	31	2026-08-21 06:01:44.734752
58	1	32	2026-08-21 06:01:44.736425
59	1	33	2026-08-21 06:01:44.738153
60	1	34	2026-08-21 06:01:44.739778
61	1	35	2026-08-21 06:01:44.741427
62	1	36	2026-08-21 06:01:44.743097
63	1	37	2026-08-21 06:01:44.744962
64	1	38	2026-08-21 06:01:44.746892
65	1	39	2026-08-21 06:01:44.748606
66	2	16	2026-08-21 06:01:44.75056
67	2	17	2026-08-21 06:01:44.752346
68	2	18	2026-08-21 06:01:44.754128
69	2	19	2026-08-21 06:01:44.755762
70	2	20	2026-08-21 06:01:44.757359
71	2	21	2026-08-21 06:01:44.758769
72	2	22	2026-08-21 06:01:44.7603
73	2	23	2026-08-21 06:01:44.761842
74	2	24	2026-08-21 06:01:44.763586
75	2	25	2026-08-21 06:01:44.765353
76	2	26	2026-08-21 06:01:44.766921
77	2	27	2026-08-21 06:01:44.768354
78	2	28	2026-08-21 06:01:44.769813
79	2	29	2026-08-21 06:01:44.771508
80	2	30	2026-08-21 06:01:44.77293
81	2	31	2026-08-21 06:01:44.774357
82	2	32	2026-08-21 06:01:44.775799
83	2	33	2026-08-21 06:01:44.777158
84	2	34	2026-08-21 06:01:44.779473
85	2	35	2026-08-21 06:01:44.781042
86	2	36	2026-08-21 06:01:44.782904
87	2	37	2026-08-21 06:01:44.784672
88	2	38	2026-08-21 06:01:44.786076
89	2	39	2026-08-21 06:01:44.787399
90	3	16	2026-08-21 06:01:44.788692
91	3	17	2026-08-21 06:01:44.789992
92	3	18	2026-08-21 06:01:44.791408
93	3	20	2026-08-21 06:01:44.792984
94	3	21	2026-08-21 06:01:44.794572
95	3	23	2026-08-21 06:01:44.795995
96	3	24	2026-08-21 06:01:44.797321
97	3	25	2026-08-21 06:01:44.798731
98	3	26	2026-08-21 06:01:44.800241
99	4	16	2026-08-21 06:01:44.801755
100	4	20	2026-08-21 06:01:44.803165
101	4	23	2026-08-21 06:01:44.812966
102	4	25	2026-08-21 06:01:44.814407
103	4	26	2026-08-21 06:01:44.815732
104	4	28	2026-08-21 06:01:44.817292
105	4	29	2026-08-21 06:01:44.818752
106	4	30	2026-08-21 06:01:44.82044
107	9	16	2026-08-26 11:04:19.415196
108	9	40	2026-08-26 11:04:19.415196
109	9	41	2026-08-26 11:04:19.415196
110	9	42	2026-08-26 11:04:19.415196
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.roles (id, name, description, created_at) FROM stdin;
1	SUPER_ADMIN	Full access to the entire recruitment system	2026-08-20 16:40:29.449298
2	ADMIN	Manages users, jobs and recruitment operations	2026-08-20 16:40:30.368574
3	RECRUITER	Manages jobs, applications and candidate screening	2026-08-20 16:40:30.392584
4	HIRING_MANAGER	Reviews candidates and participates in hiring decisions	2026-08-20 16:40:30.395093
9	CANDIDATE	Applies for jobs and manages candidate applications	2026-08-22 16:09:42.641828
\.


--
-- Data for Name: screening_decisions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.screening_decisions (id, decision, note, updated_at, application_id) FROM stdin;
5	pass	good communication and performance	2026-09-03 13:24:24.163	14
7	reject	not hired because not good performance	2026-09-05 13:40:51.473	13
9	pass	good candidate and enough skills for this position	2026-09-06 19:45:05.653	12
1	pass	Candidate has relevant experience and demonstrates strong communication skills.	2026-09-07 21:14:10.337	16
11	pass	good performance	2026-09-07 22:56:48.577	8
12	pass	good performance	2026-09-08 08:34:00.258	10
4	pass	good performance and skill in this position	2026-09-08 08:38:48.128	15
15	pass	good candidate and good performance	2026-09-11 15:25:39.204	9
16	pass	for test	2026-09-13 05:19:04.489	18
17	pass	good performance	2026-09-15 09:17:19.372	6
18	pass	good performance	2026-09-15 12:47:29.804	11
19	pass	good performance	2026-09-15 12:59:06.921	17
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sessions (id, user_id, token, expires_at, created_at) FROM stdin;
1	1	285324485b4f0a860725dbed05591758a13c8a923c75d290315d744d1dacc9be	2026-08-27 20:46:55.675	2026-08-20 23:46:55.76578
3	2	b7be9f769da24cd317a0ac4869f125331d63cf84de803f05f820acc6af23861f	2026-08-28 09:32:12.955	2026-08-21 12:32:12.957163
4	2	1993e9d0d9b07ab846dc16d83b84141fdaccf5f049908b757934dbca8be432d2	2026-08-28 09:59:57.047	2026-08-21 12:59:57.07709
5	2	f6153c9f066fbee83b7484651838a7fb175ba72f9281433570ea745c5720e717	2026-08-28 10:31:12.929	2026-08-21 13:31:13.317107
6	3	d1928a59fa7c8db6159e997ff5717de3c16f5f42f4cab4d9003e628223ae2b92	2026-08-28 10:37:31.245	2026-08-21 13:37:31.250722
7	3	25c0b41d5c9e351e49a3f7fd1295b5f756cd8188803405d6eb89bc6d67b9b7ae	2026-08-28 10:44:07.05	2026-08-21 13:44:07.052431
8	2	d540d60ac474d74534f483b12977ecec2d58b91f284edc63575853c61a8d9632	2026-08-28 10:55:58.3	2026-08-21 13:55:58.3028
9	4	151541ba800f9bd25b8d30166f52de5776fbf3fff46685ad3ff7fdc40e687834	2026-08-29 19:50:30.002	2026-08-22 22:50:30.035667
10	2	4a8f9ccf5f34ee76322f1d4eb06cc69ca53520b14d071343dac68b21c0c9ecd2	2026-08-31 13:57:30.55	2026-08-24 16:57:30.583354
11	4	f4d97103e5d73bd86e415cf9880e9150297e14814b6ba38e57e38845ac388f5e	2026-08-31 13:59:00.908	2026-08-24 16:59:00.909343
12	4	8c3ec1eee86e89026ae6da9463cd288639e74d7031b907d7b2186d03d9492621	2026-08-31 13:59:53.572	2026-08-24 16:59:53.573886
13	4	dbf4d6b2ace328497fef64b4fcc0d5da06142791130b523605b48ca1f08e65b5	2026-08-31 14:00:45.764	2026-08-24 17:00:45.765135
14	4	2b8760717fe632f87204a860deeb5a5a7e526ccb05ff23499910370e0e516bf3	2026-08-31 14:53:48.272	2026-08-24 17:53:48.282291
16	5	b395c1672ab63c454cf26d81a5552a24837e4255a8b7851b7b0f5038e547ccbb	2026-08-31 18:38:34.138	2026-08-24 21:38:34.149131
17	5	45e2e20970c227485c2243df41b9ab3e60435bc5ab941c1afe46cab408d17b40	2026-08-31 19:28:33.063	2026-08-24 22:28:33.105367
18	2	4248d0ed73884aeb3ea239046925ff334f03ef90debbefb692c9c8b4e6be9942	2026-08-31 19:50:34.781	2026-08-24 22:50:34.784173
19	5	3e0f3605f376cd57d99e128fc0d9642ee482a493457bc61a8501d0b1925e48f1	2026-08-31 19:52:09.803	2026-08-24 22:52:09.80398
20	5	279ed38faac7f7be419780bacb2fd02062591835a276467a3d26a096a08c3ded	2026-09-01 11:19:33.073	2026-08-25 14:19:33.077096
21	5	9e428ea2c22d3b9b7d2d2fef747d34b11479f1ca50b57b865eb4b8af443b029c	2026-09-01 12:05:37.603	2026-08-25 15:05:37.607042
22	5	3ee45e594494e208872df698060105a9a54c1724f12e6a93e0a7a90b4672e7f6	2026-09-01 12:32:53.033	2026-08-25 15:32:53.059286
55	5	e0a3f7490d280eb47381e9949e555c5f1de245c73a1f97e8c5016969fa6b27d5	2026-09-02 08:18:01.987	2026-08-26 11:18:01.99067
58	39	eb53b67d320c0ac698d7e374d6b5bfcfa531d8177ade8047c488b4e1a0a2ea88	2026-09-02 11:55:50.301	2026-08-26 14:55:50.312134
59	39	24fa0056b3981a73aa95dbe7f496271b4aae976e3346d05dfb48bba35b83b65a	2026-09-02 11:57:36.03	2026-08-26 14:57:36.035182
60	40	0eb77f7875da2c8ebe76186a2cbb0c2ba27aceebeeb52fd628a6c52426fa9884	2026-09-02 12:00:17.756	2026-08-26 15:00:17.757448
61	40	79a122e6ab208c6f5e425b62c309483d2889ca1f465f8e9e038a5d149eaa3919	2026-09-02 14:30:18.878	2026-08-26 17:30:18.881455
62	41	31ac64341f6d286828743497958a2e7593e5a0977335962e3a0c089424f4122f	2026-09-02 21:39:48.149	2026-08-27 00:39:48.160168
63	2	5b5dd292756c431c0d9c6aa0942faa2b83abb21bdf22574d9d207f3d5b8ae14f	2026-09-02 22:35:52.305	2026-08-27 01:35:52.391722
64	2	f25ea5e5451abe13ec3fdb923b582e52c6f205d82a39507b33d3651ae33c8e3d	2026-09-02 23:07:50.069	2026-08-27 02:07:50.099652
67	39	30aa79a3137abd1159a249211c9c46e6bb52cd5f093358909c67ac4c7c96827a	2026-09-03 08:56:53.132	2026-08-27 11:56:53.145902
69	42	be88b97e7ba9df0c543add30ea5cae10cd4923dec78b626812e45f657d67e31b	2026-09-03 08:59:20.381	2026-08-27 11:59:20.383107
71	42	9a73bde25a8e5251fca026711ba93b8f74a9ec0225346ae67174f389518ee2e5	2026-09-03 09:04:06.309	2026-08-27 12:04:06.314361
72	42	b7fd00faabf00f1b7dda50ce8e5dd5bd07339e44fd23fc8d32ac37f83d3b1469	2026-09-03 09:05:43.007	2026-08-27 12:05:43.008217
74	41	462b16146808a8e6d9de5fbd662573c561f07b193bf0161acd4390d1b0805b9e	2026-09-04 15:03:01.773	2026-08-28 18:03:01.776982
77	2	a41564a0159c894c41c32190c0d81829005dcd52f417c212f32d6c71fc02d30c	2026-09-07 21:11:39.126	2026-09-01 00:11:39.340426
78	43	0326c651f4d4ee1065e7cf3be16365b9b97866ef7b85b85ddb0a3e288f088284	2026-09-07 22:52:57.218	2026-09-01 01:52:57.235798
81	43	37c10ffc2724b179ce48a2050897f41496d72066a061b5fa556884570aa653bd	2026-09-08 09:28:46.092	2026-09-01 12:28:46.292562
82	44	a9daa3339f56bdb81f44490952d446b0844b3efe9c8dc9fefad96d6fabbcef29	2026-09-08 09:51:42.041	2026-09-01 12:51:42.243394
83	40	4ef92a8a1b5317dfc924f3fb7ca8cb0644b7fc54a389891b585ba3ca6ba11342	2026-09-10 09:03:51.385	2026-09-03 12:03:51.424457
86	2	ed3c5d8337de29fb8e7d991d70a4ae370d5d24068e4ffe0354c7f22a658434cb	2026-09-12 07:55:19.018	2026-09-05 10:55:19.070977
87	2	ea18a351b88523b0961701523a050c34fb7bbd3312bd9838ae9992866c9b953a	2026-09-13 18:57:57.541	2026-09-06 21:57:57.590966
91	43	18af94014260e0cd7a8d6cf3d5853edb838e844b680f3f07de68d07e80ff0c46	2026-09-14 22:54:43.551	2026-09-08 01:54:43.605612
93	41	2b033f1b9878f1365b27bb1d44aaded1090bf8a5e61b1a2ff7a103b63fa9489b	2026-09-19 21:11:44.482	2026-09-13 00:11:44.494741
94	43	7c90d0898bb68ccaef75929a0858522f403be40397c6115bbb9792a97e8e1234	2026-09-19 21:13:12.141	2026-09-13 00:13:12.143175
95	40	097b0c31aa9992e6424f810a65ef40aa38f3dd7213ecfaacdb65dbe7c2cc26d3	2026-09-19 21:20:40	2026-09-13 00:20:40.001782
96	43	59d533fc0c685490935cc5b475ed1d3427428c541783412ad604c6f845648894	2026-09-19 21:40:07.643	2026-09-13 00:40:07.644254
97	40	5ad3a2343f3d44ffbed91eb7fe3519068548da213a1a142110fe1b5b7efc39ed	2026-09-19 21:49:20.536	2026-09-13 00:49:20.537684
98	40	15001fcfba041404b9eca81a749f8a292a8edadc2ac718e2060abc201ecae6a8	2026-09-20 04:55:34.645	2026-09-13 07:55:34.715018
101	43	5c92f4956f45521dc7c2d7cc38fc1d8fa422b90f565ca22d25b349054e73f695	2026-09-20 05:17:21.367	2026-09-13 08:17:21.369687
103	43	bd0681ba0dbfec3b98c06f94238fba63aff9ce80ba906c1f1237a591e74e748c	2026-09-20 05:20:14.929	2026-09-13 08:20:14.931777
104	43	2277e471615ac7c3a42327321ab67e64f80193d44babee18747461b499070041	2026-09-20 05:21:44.833	2026-09-13 08:21:44.833771
106	43	0f83137a98286d3ae5366fd39a2534d8d55e73dac291c27fd896c74020c76c98	2026-09-20 05:23:12.047	2026-09-13 08:23:12.058136
108	43	f9cfa729e999d0bb494717367fbb720580bbc073681b6e06bb13bde6aba26cad	2026-09-20 05:30:22.121	2026-09-13 08:30:22.130012
109	45	6bd30ea115dd8d6c4c781e9f73fd10a3eac9543a706a634a340894e7083c09d6	2026-09-20 08:56:17.81	2026-09-13 11:56:17.842142
110	43	2a5d0142a28300241a5692aceee39a49362931d06001f96652b0691d61dd7e81	2026-09-20 09:18:38.767	2026-09-13 12:18:39.168839
111	45	e844e72359bc5089131c10206b989f80824edf00beae27eb8bb5d3ad91253006	2026-09-20 18:01:12.805	2026-09-13 21:01:13.120009
113	43	5bfc0d6006cdae6005de96d3b89d4801b07362b87a58bef918ba8b6cb025d535	2026-09-22 09:12:36.744	2026-09-15 12:12:36.746171
115	43	703868bba93e6fec3cb82b8610026088d4c1589f1706c7ac323a66b176c6c151	2026-09-22 12:54:41.934	2026-09-15 15:54:41.945007
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, first_name, last_name, email, password_hash, role_id, profile_image_url, is_active, created_at, updated_at) FROM stdin;
1	Kalkidan	Hailu	kalkidan@gmail.com	$2b$12$tvaM67P.j4u18G2uHCSMqu91qGkvsxnP8rFRpe7WI64HDQ/WLWKyG	3	\N	t	2026-08-20 23:28:24.652371	2026-08-20 23:28:24.652371
2	Kalkidan	Hailu	kalkidan@test.com	$2b$12$0LrcXrw2eDMS4w2BJTNr.eAYx0m5xaRaN.qcWGqFTjKBaoAqgoDA2	3	\N	t	2026-08-21 12:30:43.56872	2026-08-21 12:30:43.56872
3	Kalkiden	Hailu	kalkiden@gmail.com	$2b$12$yUTIwZbJJawi5D/c7k13Julsij.V1MCP3geBxXdZ9TVX9DrTLht5m	3	\N	t	2026-08-21 13:36:50.872103	2026-08-21 13:36:50.872103
4	Abebe	Kebede	abebe@gmail.com	$2b$12$QDoXhoTvIvtWWT.chSBEpOADh.4XzlvUsHC2Qou80OXHyfdbLpXsG	9	\N	t	2026-08-22 16:46:45.261621	2026-08-22 16:46:45.261621
5	Abeba	Hailu	abeba@gmail.com	$2b$12$fvVsBIRtKGvJZSrGqLINaOlmUJ83xgobl/tOAqdlmA8JAvAswDVIa	9	\N	t	2026-08-24 21:35:50.359481	2026-08-24 21:35:50.359481
39	abush	minilik	abu@gmail.com	$2b$12$INOQvDtpl6eUan2nDE88Wueafh7Dpnw3xYcubaW2NJmv3oQw5ZjeW	9	\N	t	2026-08-26 13:15:09.655094	2026-08-26 13:15:09.655094
40	abirham	sisay	ab@gmail.com	$2b$12$z9wFXVBmRQxWgAtuQzZgRuenxhm7luaa84THPZnkLUjTGTCM1ozG.	9	\N	t	2026-08-26 14:59:55.960074	2026-08-26 14:59:55.960074
41	nuhamin	asdfgh	nunu@gmail.com	$2b$12$l3xWcLm9mN5vmpR9GzO8Ge6.WS1fBiukpJzSTPFhgq4p7VDlXlHCi	9	\N	t	2026-08-27 00:39:40.261478	2026-08-27 00:39:40.261478
42	eden	Hailu	edu@gmail.com	$2b$12$/wiNUqjteei0bUC7FjLLUujkjEPhpxJxOX0sQ0C10ae3ImA.0OMvG	9	\N	t	2026-08-27 11:59:14.51659	2026-08-27 11:59:14.51659
43	Super	Admin	superadmin@example.com	$2b$12$wo6DxMUBbdgP5SFkFZmXu.PMmNDnNiN6912xv0N1EERXBg5cG6X/q	1	\N	t	2026-09-01 01:46:00.157613	2026-09-01 01:46:00.157613
44	nina	hailu	nina@gmail.com	$2b$12$w2PAnoLX6oJ9XJ6eyJEu8eY/1ZsiOtXpoJapBAMP59r4D00vNTC0C	2	\N	t	2026-09-01 12:30:47.347919	2026-09-01 12:30:47.347919
6	Mekdes	Hailu	mek@gmail.com	$2b$12$vZitaJRKNmqEa742ylpdqOu2CbEQFz6pu1v/Hn.Hed8B.G/Sw9BhG	4	\N	t	2026-08-25 15:34:01.064738	2026-09-08 08:39:53.587
45	asdfgh	qwert	as@gmail.com	$2b$12$SKqEovMb/S7wDxz0WmQW/OekpVb40mn2jzQ5AvSoamK.nD72XBXru	9	\N	t	2026-09-13 08:06:03.569042	2026-09-13 08:06:03.569042
\.


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: -
--

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 5, true);


--
-- Name: applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.applications_id_seq', 18, true);


--
-- Name: employers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.employers_id_seq', 2, true);


--
-- Name: hiring_decisions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.hiring_decisions_id_seq', 5, true);


--
-- Name: interviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.interviews_id_seq', 11, true);


--
-- Name: jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.jobs_id_seq', 4, true);


--
-- Name: permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.permissions_id_seq', 42, true);


--
-- Name: role_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.role_permissions_id_seq', 110, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.roles_id_seq', 9, true);


--
-- Name: screening_decisions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.screening_decisions_id_seq', 19, true);


--
-- Name: sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sessions_id_seq', 115, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 45, true);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: -
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);


--
-- Name: employers employers_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employers
    ADD CONSTRAINT employers_email_key UNIQUE (email);


--
-- Name: employers employers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employers
    ADD CONSTRAINT employers_pkey PRIMARY KEY (id);


--
-- Name: hiring_decisions hiring_decisions_application_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hiring_decisions
    ADD CONSTRAINT hiring_decisions_application_id_unique UNIQUE (application_id);


--
-- Name: hiring_decisions hiring_decisions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hiring_decisions
    ADD CONSTRAINT hiring_decisions_pkey PRIMARY KEY (id);


--
-- Name: interviews interviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interviews
    ADD CONSTRAINT interviews_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_unique UNIQUE (name);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (id);


--
-- Name: roles roles_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_unique UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: screening_decisions screening_decisions_application_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.screening_decisions
    ADD CONSTRAINT screening_decisions_application_id_unique UNIQUE (application_id);


--
-- Name: screening_decisions screening_decisions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.screening_decisions
    ADD CONSTRAINT screening_decisions_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_token_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_token_unique UNIQUE (token);


--
-- Name: role_permissions unique_role_permission; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT unique_role_permission UNIQUE (role_id, permission_id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: applications applications_candidate_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_candidate_id_users_id_fk FOREIGN KEY (candidate_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: hiring_decisions hiring_decisions_application_id_applications_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hiring_decisions
    ADD CONSTRAINT hiring_decisions_application_id_applications_id_fk FOREIGN KEY (application_id) REFERENCES public.applications(id) ON DELETE CASCADE;


--
-- Name: interviews interviews_application_id_applications_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interviews
    ADD CONSTRAINT interviews_application_id_applications_id_fk FOREIGN KEY (application_id) REFERENCES public.applications(id) ON DELETE CASCADE;


--
-- Name: interviews interviews_interviewer_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interviews
    ADD CONSTRAINT interviews_interviewer_id_users_id_fk FOREIGN KEY (interviewer_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: role_permissions role_permissions_permission_id_permissions_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_permissions_id_fk FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_role_id_roles_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_roles_id_fk FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: screening_decisions screening_decisions_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.screening_decisions
    ADD CONSTRAINT screening_decisions_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.applications(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users users_role_id_roles_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_roles_id_fk FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict hoS5anhIU0KbfMidIdLGktFpAhreY9XO7uFgqBzWPsr7FchV6whicz9B3973151

