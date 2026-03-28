--
-- PostgreSQL database dump
--

\restrict WBZye12cuzJzWU1bs1sUPskqS9tohVrWf24CdpxtyDwS70xqxPQpWVMCIk3SSxl

-- Dumped from database version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: contactpreference; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.contactpreference AS ENUM (
    'EMAIL',
    'PHONE',
    'NONE',
    'status'
);


ALTER TYPE public.contactpreference OWNER TO postgres;

--
-- Name: employmenttypeenum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.employmenttypeenum AS ENUM (
    'permanent',
    'contract',
    'visiting',
    'Internal',
    'External'
);


ALTER TYPE public.employmenttypeenum OWNER TO postgres;

--
-- Name: facultystatusenum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.facultystatusenum AS ENUM (
    'active',
    'inactive',
    'retired'
);


ALTER TYPE public.facultystatusenum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: academic_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.academic_details (
    id integer NOT NULL,
    student_id integer NOT NULL,
    ssc_board_id integer,
    ssc_school character varying(100) NOT NULL,
    ssc_scheme character varying(30) NOT NULL,
    ssc_score character varying(10) NOT NULL,
    ssc_year date NOT NULL,
    after_ssc character varying(20) NOT NULL,
    hsc_board_id integer,
    hsc_school character varying(100),
    hsc_result character varying(20),
    hsc_scheme character varying(30),
    hsc_score character varying(10),
    hsc_year date,
    diploma_institute character varying(100) NOT NULL,
    diploma_board character varying(100) NOT NULL,
    diploma_result character varying(20) NOT NULL,
    diploma_scheme character varying(30) NOT NULL,
    diploma_score character varying(10) NOT NULL,
    diploma_year date
);


ALTER TABLE public.academic_details OWNER TO postgres;

--
-- Name: academic_details_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.academic_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.academic_details_id_seq OWNER TO postgres;

--
-- Name: academic_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.academic_details_id_seq OWNED BY public.academic_details.id;


--
-- Name: academic_years; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.academic_years (
    id integer NOT NULL,
    year_code character varying(20) NOT NULL,
    start_year integer NOT NULL,
    end_year integer NOT NULL,
    start_month integer NOT NULL,
    end_month integer NOT NULL,
    is_active boolean NOT NULL,
    description character varying(255),
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.academic_years OWNER TO postgres;

--
-- Name: academic_years_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.academic_years_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.academic_years_id_seq OWNER TO postgres;

--
-- Name: academic_years_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.academic_years_id_seq OWNED BY public.academic_years.id;


--
-- Name: account_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_groups (
    id integer NOT NULL,
    grpcode integer NOT NULL,
    grpname character varying(150) NOT NULL
);


ALTER TABLE public.account_groups OWNER TO postgres;

--
-- Name: account_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.account_groups_id_seq OWNER TO postgres;

--
-- Name: account_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_groups_id_seq OWNED BY public.account_groups.id;


--
-- Name: account_heads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_heads (
    id integer NOT NULL,
    ano integer NOT NULL,
    anodes character varying(255) NOT NULL,
    grpcode integer NOT NULL,
    maincode integer NOT NULL,
    sub_group_id integer NOT NULL
);


ALTER TABLE public.account_heads OWNER TO postgres;

--
-- Name: account_heads_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_heads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.account_heads_id_seq OWNER TO postgres;

--
-- Name: account_heads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_heads_id_seq OWNED BY public.account_heads.id;


--
-- Name: account_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_master (
    id integer NOT NULL,
    damt double precision,
    camt double precision,
    fyr character varying(20),
    dsid character varying(10),
    rpcode character varying(50),
    rpname character varying(150),
    account_head_id integer NOT NULL
);


ALTER TABLE public.account_master OWNER TO postgres;

--
-- Name: account_master_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_master_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.account_master_id_seq OWNER TO postgres;

--
-- Name: account_master_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_master_id_seq OWNED BY public.account_master.id;


--
-- Name: address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.address (
    id integer NOT NULL,
    address_line1 character varying(100) NOT NULL,
    address_line2 character varying(100),
    country_id integer NOT NULL,
    state_id integer NOT NULL,
    district_id integer NOT NULL,
    city_id integer NOT NULL,
    postal_code character varying(20) NOT NULL,
    is_verified boolean,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.address OWNER TO postgres;

--
-- Name: address_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.address_details (
    id integer NOT NULL,
    student_id integer NOT NULL,
    corr_addr1 character varying(100) NOT NULL,
    corr_addr2 character varying(100),
    corr_city character varying(30),
    corr_state character varying(30),
    corr_district character varying(30),
    corr_country character varying(30) NOT NULL,
    corr_pin character varying(10) NOT NULL,
    corr_addr_same boolean,
    perm_addr1 character varying(100),
    perm_addr2 character varying(100),
    perm_city character varying(30),
    perm_state character varying(30),
    perm_district character varying(30),
    perm_country character varying(30) NOT NULL,
    perm_pin character varying(10)
);


ALTER TABLE public.address_details OWNER TO postgres;

--
-- Name: address_details_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.address_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.address_details_id_seq OWNER TO postgres;

--
-- Name: address_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.address_details_id_seq OWNED BY public.address_details.id;


--
-- Name: address_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.address_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.address_id_seq OWNER TO postgres;

--
-- Name: address_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.address_id_seq OWNED BY public.address.id;


--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO postgres;

--
-- Name: api_keys; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_keys (
    id integer NOT NULL,
    client_name character varying(100) NOT NULL,
    api_key character varying(255) NOT NULL,
    status character varying(20),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone,
    expires_at timestamp with time zone
);


ALTER TABLE public.api_keys OWNER TO postgres;

--
-- Name: api_keys_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_keys_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.api_keys_id_seq OWNER TO postgres;

--
-- Name: api_keys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_keys_id_seq OWNED BY public.api_keys.id;


--
-- Name: application_fees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.application_fees (
    id integer NOT NULL,
    payment_id integer NOT NULL
);


ALTER TABLE public.application_fees OWNER TO postgres;

--
-- Name: application_fees_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.application_fees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.application_fees_id_seq OWNER TO postgres;

--
-- Name: application_fees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.application_fees_id_seq OWNED BY public.application_fees.id;


--
-- Name: batches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.batches (
    id integer NOT NULL,
    academic_year_id integer NOT NULL,
    batch_number integer NOT NULL,
    batch_name character varying(100) NOT NULL,
    start_month integer NOT NULL,
    end_month integer NOT NULL,
    is_active boolean NOT NULL,
    description character varying(255),
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.batches OWNER TO postgres;

--
-- Name: batches_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.batches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.batches_id_seq OWNER TO postgres;

--
-- Name: batches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.batches_id_seq OWNED BY public.batches.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: city; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.city (
    id integer NOT NULL,
    city_name character varying(100) NOT NULL,
    state_id integer NOT NULL
);


ALTER TABLE public.city OWNER TO postgres;

--
-- Name: city_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.city_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.city_id_seq OWNER TO postgres;

--
-- Name: city_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.city_id_seq OWNED BY public.city.id;


--
-- Name: countries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.countries (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    country_code character varying(5) NOT NULL,
    phone_code character varying(5) NOT NULL
);


ALTER TABLE public.countries OWNER TO postgres;

--
-- Name: countries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.countries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.countries_id_seq OWNER TO postgres;

--
-- Name: countries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.countries_id_seq OWNED BY public.countries.id;


--
-- Name: course_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course_category (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.course_category OWNER TO postgres;

--
-- Name: course_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.course_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.course_category_id_seq OWNER TO postgres;

--
-- Name: course_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.course_category_id_seq OWNED BY public.course_category.id;


--
-- Name: course_code; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course_code (
    id integer NOT NULL,
    code character varying(50) NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.course_code OWNER TO postgres;

--
-- Name: course_code_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.course_code_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.course_code_id_seq OWNER TO postgres;

--
-- Name: course_code_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.course_code_id_seq OWNED BY public.course_code.id;


--
-- Name: course_components; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course_components (
    id integer NOT NULL,
    course_id integer,
    component_no integer NOT NULL,
    component_type character varying(50) NOT NULL,
    component_code character varying(50) NOT NULL,
    component_description character varying(100) NOT NULL,
    max_marks integer NOT NULL,
    min_marks integer NOT NULL,
    min_percentage integer NOT NULL,
    exam_mark integer,
    is_theory boolean,
    is_practical boolean,
    is_ia boolean,
    is_computed boolean,
    computed_components integer[],
    is_others boolean,
    specify_others character varying(100),
    core_or_elective character varying(30) NOT NULL,
    is_programme_elective boolean,
    elective_type character varying(50),
    elective_programe_type character varying(50),
    attendence_percentage integer,
    book_type character varying(50),
    mcq_time character varying(50),
    is_tpi character varying(30),
    incl_credit boolean,
    techorder integer,
    approved boolean,
    is_maincode boolean,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.course_components OWNER TO postgres;

--
-- Name: course_components_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.course_components_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.course_components_id_seq OWNER TO postgres;

--
-- Name: course_components_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.course_components_id_seq OWNED BY public.course_components.id;


--
-- Name: course_results; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course_results (
    id integer NOT NULL,
    student_id integer NOT NULL,
    exam_id integer NOT NULL,
    course_id integer NOT NULL,
    total_marks integer NOT NULL,
    result_status character varying(20) NOT NULL,
    percentage integer,
    grade character varying(5),
    grade_point integer,
    result_version integer,
    computed_at timestamp without time zone,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    component_id integer NOT NULL
);


ALTER TABLE public.course_results OWNER TO postgres;

--
-- Name: course_results_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.course_results_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.course_results_id_seq OWNER TO postgres;

--
-- Name: course_results_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.course_results_id_seq OWNED BY public.course_results.id;


--
-- Name: course_title; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course_title (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.course_title OWNER TO postgres;

--
-- Name: course_title_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.course_title_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.course_title_id_seq OWNER TO postgres;

--
-- Name: course_title_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.course_title_id_seq OWNED BY public.course_title.id;


--
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courses (
    id integer NOT NULL,
    semester_id integer,
    dept_code character varying(30) NOT NULL,
    main_code character varying(30) NOT NULL,
    main_course character varying(100) NOT NULL,
    course_order integer NOT NULL,
    course_type character varying(50) NOT NULL,
    course_code character varying(50) NOT NULL,
    course_title character varying(200) NOT NULL,
    credits integer NOT NULL,
    regulation_pattern character varying(50) NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.courses OWNER TO postgres;

--
-- Name: courses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.courses_id_seq OWNER TO postgres;

--
-- Name: courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.courses_id_seq OWNED BY public.courses.id;


--
-- Name: deb_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.deb_details (
    id integer NOT NULL,
    student_id integer NOT NULL,
    deb_id character varying(80) NOT NULL,
    deb_name character varying,
    deb_gender character varying,
    deb_date_of_birth character varying,
    deb_university character varying,
    deb_program character varying,
    deb_abcid character varying,
    deb_details_1 character varying,
    deb_details_2 character varying,
    deb_details_3 character varying,
    deb_details_4 character varying,
    deb_details_5 character varying,
    deb_details_6 character varying,
    deb_details_7 character varying,
    deb_details_8 character varying,
    deb_details_9 character varying,
    deb_details_10 character varying,
    deb_details_11 character varying,
    deb_details_12 character varying,
    deb_details_13 character varying,
    deb_details_14 character varying,
    deb_details_15 character varying,
    deb_status character varying
);


ALTER TABLE public.deb_details OWNER TO postgres;

--
-- Name: deb_details_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.deb_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.deb_details_id_seq OWNER TO postgres;

--
-- Name: deb_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.deb_details_id_seq OWNED BY public.deb_details.id;


--
-- Name: declaration_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.declaration_details (
    id integer NOT NULL,
    student_id integer NOT NULL,
    declaration_agreed boolean NOT NULL,
    applicant_name character varying(100) NOT NULL,
    parent_name character varying(100),
    declaration_date date NOT NULL,
    place character varying(100) NOT NULL
);


ALTER TABLE public.declaration_details OWNER TO postgres;

--
-- Name: declaration_details_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.declaration_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.declaration_details_id_seq OWNER TO postgres;

--
-- Name: declaration_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.declaration_details_id_seq OWNED BY public.declaration_details.id;


--
-- Name: departments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departments (
    id integer NOT NULL,
    name character varying
);


ALTER TABLE public.departments OWNER TO postgres;

--
-- Name: departments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.departments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.departments_id_seq OWNER TO postgres;

--
-- Name: departments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.departments_id_seq OWNED BY public.departments.id;


--
-- Name: district; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.district (
    id integer NOT NULL,
    district_name character varying(100) NOT NULL,
    state_id integer NOT NULL
);


ALTER TABLE public.district OWNER TO postgres;

--
-- Name: district_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.district_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.district_id_seq OWNER TO postgres;

--
-- Name: district_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.district_id_seq OWNED BY public.district.id;


--
-- Name: document_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.document_details (
    id integer NOT NULL,
    student_id integer NOT NULL,
    class_10th_marksheet text,
    class_12th_marksheet text,
    graduation_marksheet text,
    diploma_marksheet text,
    work_experience_certificates text,
    passport text,
    aadhar text,
    signature text,
    profile_image text
);


ALTER TABLE public.document_details OWNER TO postgres;

--
-- Name: document_details_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.document_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.document_details_id_seq OWNER TO postgres;

--
-- Name: document_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.document_details_id_seq OWNED BY public.document_details.id;


--
-- Name: exam_timetables; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exam_timetables (
    id integer NOT NULL,
    exam_id integer NOT NULL,
    course_id integer NOT NULL,
    component_id integer NOT NULL,
    exam_date date NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.exam_timetables OWNER TO postgres;

--
-- Name: exam_timetables_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.exam_timetables_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.exam_timetables_id_seq OWNER TO postgres;

--
-- Name: exam_timetables_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.exam_timetables_id_seq OWNED BY public.exam_timetables.id;


--
-- Name: exams; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exams (
    id integer NOT NULL,
    scheme_id integer NOT NULL,
    exam_name character varying(100) NOT NULL,
    exam_type character varying(50) NOT NULL,
    month_year character varying(20) NOT NULL,
    is_published boolean,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    semester_id integer NOT NULL
);


ALTER TABLE public.exams OWNER TO postgres;

--
-- Name: exams_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.exams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.exams_id_seq OWNER TO postgres;

--
-- Name: exams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.exams_id_seq OWNED BY public.exams.id;


--
-- Name: fee_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fee_details (
    id integer NOT NULL,
    programe_id integer,
    semester character varying,
    application_fee character varying,
    admission_fee character varying,
    tuition_fee character varying,
    exam_fee character varying,
    lms_fee character varying,
    lab_fee character varying,
    total_fee character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.fee_details OWNER TO postgres;

--
-- Name: fee_details_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.fee_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fee_details_id_seq OWNER TO postgres;

--
-- Name: fee_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.fee_details_id_seq OWNED BY public.fee_details.id;


--
-- Name: group_permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.group_permission (
    group_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.group_permission OWNER TO postgres;

--
-- Name: groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.groups (
    id integer NOT NULL,
    name character varying
);


ALTER TABLE public.groups OWNER TO postgres;

--
-- Name: groups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.groups_id_seq OWNER TO postgres;

--
-- Name: groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.groups_id_seq OWNED BY public.groups.id;


--
-- Name: hsc_board; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hsc_board (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.hsc_board OWNER TO postgres;

--
-- Name: hsc_board_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hsc_board_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hsc_board_id_seq OWNER TO postgres;

--
-- Name: hsc_board_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hsc_board_id_seq OWNED BY public.hsc_board.id;


--
-- Name: lookup_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lookup_master (
    id integer NOT NULL,
    key character varying(10) NOT NULL,
    "values" character varying(255) NOT NULL,
    category_id integer NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.lookup_master OWNER TO postgres;

--
-- Name: lookup_master_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lookup_master_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lookup_master_id_seq OWNER TO postgres;

--
-- Name: lookup_master_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lookup_master_id_seq OWNED BY public.lookup_master.id;


--
-- Name: main_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.main_groups (
    id integer NOT NULL,
    maincode integer NOT NULL,
    mainname character varying(150) NOT NULL,
    account_group_id integer NOT NULL
);


ALTER TABLE public.main_groups OWNER TO postgres;

--
-- Name: main_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.main_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.main_groups_id_seq OWNER TO postgres;

--
-- Name: main_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.main_groups_id_seq OWNED BY public.main_groups.id;


--
-- Name: marks_entries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.marks_entries (
    id integer NOT NULL,
    student_id integer NOT NULL,
    exam_id integer NOT NULL,
    course_id integer NOT NULL,
    component_id integer NOT NULL,
    marks_obtained double precision NOT NULL,
    entered_by integer NOT NULL,
    is_locked boolean,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.marks_entries OWNER TO postgres;

--
-- Name: marks_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.marks_entries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.marks_entries_id_seq OWNER TO postgres;

--
-- Name: marks_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.marks_entries_id_seq OWNED BY public.marks_entries.id;


--
-- Name: menus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.menus (
    id integer NOT NULL,
    name character varying NOT NULL,
    icon character varying,
    "to" character varying
);


ALTER TABLE public.menus OWNER TO postgres;

--
-- Name: menus_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.menus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.menus_id_seq OWNER TO postgres;

--
-- Name: menus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.menus_id_seq OWNED BY public.menus.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    student_id integer NOT NULL,
    payment_type character varying(50),
    order_id character varying(50),
    transaction_id character varying(50),
    payment_date timestamp without time zone,
    payment_amount double precision,
    is_offline boolean,
    offline_transaction_id character varying(50),
    offline_payment_method character varying(50),
    offline_receipt_enabled boolean,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_id_seq OWNER TO postgres;

--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    id integer NOT NULL,
    codename character varying
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- Name: permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.permissions_id_seq OWNER TO postgres;

--
-- Name: permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.permissions_id_seq OWNED BY public.permissions.id;


--
-- Name: program_payment_workflow_scopes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.program_payment_workflow_scopes (
    program_id integer NOT NULL,
    batch character varying(20) NOT NULL,
    admission_year character varying(20) NOT NULL,
    semester character varying(20) NOT NULL,
    enabled boolean NOT NULL,
    id integer NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.program_payment_workflow_scopes OWNER TO postgres;

--
-- Name: program_payment_workflow_scopes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.program_payment_workflow_scopes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.program_payment_workflow_scopes_id_seq OWNER TO postgres;

--
-- Name: program_payment_workflow_scopes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.program_payment_workflow_scopes_id_seq OWNED BY public.program_payment_workflow_scopes.id;


--
-- Name: programs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.programs (
    id integer NOT NULL,
    programe character varying(100) NOT NULL,
    programe_code character varying(50) NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    duration character varying(20),
    category character varying(50),
    faculty character varying(100),
    short_name character varying(20),
    application_code character varying(30),
    batch character varying(10),
    admission_year character varying(10),
    pending_payment_workflow_enabled boolean DEFAULT false NOT NULL
);


ALTER TABLE public.programs OWNER TO postgres;

--
-- Name: programs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.programs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.programs_id_seq OWNER TO postgres;

--
-- Name: programs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.programs_id_seq OWNED BY public.programs.id;


--
-- Name: schemes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schemes (
    id integer NOT NULL,
    programe_id integer,
    regulation_year character varying(10) NOT NULL,
    program_pattern character varying(50) NOT NULL,
    program_pattern_no integer NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.schemes OWNER TO postgres;

--
-- Name: schemes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.schemes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.schemes_id_seq OWNER TO postgres;

--
-- Name: schemes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.schemes_id_seq OWNED BY public.schemes.id;


--
-- Name: semester_fees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.semester_fees (
    id integer NOT NULL,
    payment_id integer,
    semester character varying(20),
    lab_fee double precision,
    lms_fee double precision,
    exam_fee double precision,
    tuition_fee double precision,
    total_fee double precision,
    admission_fee double precision
);


ALTER TABLE public.semester_fees OWNER TO postgres;

--
-- Name: semester_fees_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.semester_fees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.semester_fees_id_seq OWNER TO postgres;

--
-- Name: semester_fees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.semester_fees_id_seq OWNED BY public.semester_fees.id;


--
-- Name: semester_masters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.semester_masters (
    id integer NOT NULL,
    program_type character varying(50) NOT NULL,
    semester_number integer NOT NULL,
    semester_name character varying(100) NOT NULL,
    is_active boolean NOT NULL,
    description character varying(255),
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.semester_masters OWNER TO postgres;

--
-- Name: semester_masters_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.semester_masters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.semester_masters_id_seq OWNER TO postgres;

--
-- Name: semester_masters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.semester_masters_id_seq OWNED BY public.semester_masters.id;


--
-- Name: semester_results; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.semester_results (
    id integer NOT NULL,
    student_id integer NOT NULL,
    exam_id integer NOT NULL,
    semester_id integer NOT NULL,
    total_credits integer NOT NULL,
    earned_credits integer NOT NULL,
    sgpa double precision NOT NULL,
    result_status character varying(20) NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.semester_results OWNER TO postgres;

--
-- Name: semester_results_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.semester_results_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.semester_results_id_seq OWNER TO postgres;

--
-- Name: semester_results_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.semester_results_id_seq OWNED BY public.semester_results.id;


--
-- Name: semesters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.semesters (
    id integer NOT NULL,
    scheme_id integer,
    semester_no integer NOT NULL,
    semester_name character varying(50) NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.semesters OWNER TO postgres;

--
-- Name: semesters_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.semesters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.semesters_id_seq OWNER TO postgres;

--
-- Name: semesters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.semesters_id_seq OWNED BY public.semesters.id;


--
-- Name: ssc_board; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ssc_board (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.ssc_board OWNER TO postgres;

--
-- Name: ssc_board_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ssc_board_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ssc_board_id_seq OWNER TO postgres;

--
-- Name: ssc_board_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ssc_board_id_seq OWNED BY public.ssc_board.id;


--
-- Name: staff; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.staff (
    id integer NOT NULL,
    user_id integer NOT NULL,
    employee_id character varying(50) NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    phone character varying(15) NOT NULL,
    dob date,
    gender character varying(10),
    designation character varying(100),
    qualification character varying(150),
    specialization character varying(150),
    joining_date date,
    experience_years double precision,
    employment_type character varying(20) NOT NULL,
    status public.facultystatusenum NOT NULL,
    department_id integer,
    faculty character varying(30),
    role integer
);


ALTER TABLE public.staff OWNER TO postgres;

--
-- Name: staff_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.staff_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.staff_id_seq OWNER TO postgres;

--
-- Name: staff_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.staff_id_seq OWNED BY public.staff.id;


--
-- Name: states; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.states (
    id integer NOT NULL,
    country_id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.states OWNER TO postgres;

--
-- Name: states_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.states_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.states_id_seq OWNER TO postgres;

--
-- Name: states_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.states_id_seq OWNED BY public.states.id;


--
-- Name: student_course_registrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_course_registrations (
    id integer NOT NULL,
    course_id integer NOT NULL,
    is_arrear boolean,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    student_exam_registration_id integer NOT NULL,
    component_id integer NOT NULL,
    permitted boolean
);


ALTER TABLE public.student_course_registrations OWNER TO postgres;

--
-- Name: student_course_registrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.student_course_registrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.student_course_registrations_id_seq OWNER TO postgres;

--
-- Name: student_course_registrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.student_course_registrations_id_seq OWNED BY public.student_course_registrations.id;


--
-- Name: student_exam_registrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_exam_registrations (
    id integer NOT NULL,
    student_id integer NOT NULL,
    exam_id integer NOT NULL,
    semester_id integer NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    scheme_id integer NOT NULL,
    is_eligible boolean,
    registered_on timestamp without time zone
);


ALTER TABLE public.student_exam_registrations OWNER TO postgres;

--
-- Name: student_exam_registrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.student_exam_registrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.student_exam_registrations_id_seq OWNER TO postgres;

--
-- Name: student_exam_registrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.student_exam_registrations_id_seq OWNED BY public.student_exam_registrations.id;


--
-- Name: student_mark_temp; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_mark_temp (
    id integer NOT NULL,
    course_name character varying NOT NULL,
    final_marks integer NOT NULL,
    student_id integer NOT NULL
);


ALTER TABLE public.student_mark_temp OWNER TO postgres;

--
-- Name: student_mark_temp_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.student_mark_temp_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.student_mark_temp_id_seq OWNER TO postgres;

--
-- Name: student_mark_temp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.student_mark_temp_id_seq OWNED BY public.student_mark_temp.id;


--
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
    id integer NOT NULL,
    program_id integer NOT NULL,
    application_no character varying(20),
    registration_no character varying,
    title character varying(10) NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    gender character varying(10) NOT NULL,
    date_of_birth date NOT NULL,
    blood_group character varying(10),
    email character varying(100) NOT NULL,
    mobile_number character varying(15) NOT NULL,
    alternative_phone character varying(15),
    whatsapp_number character varying(15) NOT NULL,
    marital_status character varying(10) NOT NULL,
    religion character varying(20) NOT NULL,
    nationality character varying(30) NOT NULL,
    category character varying(10) NOT NULL,
    caste character varying(50),
    aadhaar_number character varying(12),
    pan_number character varying(10),
    parent_guardian_name character varying(100) NOT NULL,
    relationship_with_student character varying(50) NOT NULL,
    current_employment character varying(100),
    annual_income character varying(20),
    locality character varying(10),
    passport_issued_country character varying(30),
    passport_number character varying(20),
    passport_expiry_date date,
    is_deleted boolean,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    is_pushed boolean,
    is_pushed_digi boolean,
    is_synced boolean,
    last_updated timestamp without time zone,
    batch character varying(10),
    admission_year character varying(10),
    semester_id integer,
    pending_payment_due boolean DEFAULT false NOT NULL,
    pending_payment_amount double precision DEFAULT 0 NOT NULL,
    pending_payment_link text,
    CONSTRAINT age_check CHECK ((date_of_birth <= (CURRENT_DATE - '18 years'::interval))),
    CONSTRAINT check_aadhaar_format CHECK (((aadhaar_number)::text ~ '^[0-9]{12}$'::text)),
    CONSTRAINT check_pan_format CHECK (((pan_number)::text ~ '^[A-Z]{5}[0-9]{4}[A-Z]$'::text))
);


ALTER TABLE public.students OWNER TO postgres;

--
-- Name: students_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.students_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.students_id_seq OWNER TO postgres;

--
-- Name: students_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.students_id_seq OWNED BY public.students.id;


--
-- Name: sub_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sub_groups (
    id integer NOT NULL,
    subcode integer NOT NULL,
    subname character varying(150) NOT NULL,
    schedule character varying(100),
    main_group_id integer NOT NULL
);


ALTER TABLE public.sub_groups OWNER TO postgres;

--
-- Name: sub_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sub_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sub_groups_id_seq OWNER TO postgres;

--
-- Name: sub_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sub_groups_id_seq OWNED BY public.sub_groups.id;


--
-- Name: subjects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subjects (
    id integer NOT NULL,
    programe_id integer,
    course_code_id integer NOT NULL,
    course_category_id integer NOT NULL,
    course_title_id integer NOT NULL,
    semester character varying(50) NOT NULL,
    credits integer NOT NULL,
    tutorial_hours integer,
    lecture_hours integer,
    practical_hours integer,
    total_hours integer,
    cia integer,
    esa integer,
    total_marks integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.subjects OWNER TO postgres;

--
-- Name: subjects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subjects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subjects_id_seq OWNER TO postgres;

--
-- Name: subjects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subjects_id_seq OWNED BY public.subjects.id;


--
-- Name: submenus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.submenus (
    id integer NOT NULL,
    menu_id integer,
    name character varying NOT NULL,
    "to" character varying
);


ALTER TABLE public.submenus OWNER TO postgres;

--
-- Name: submenus_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.submenus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.submenus_id_seq OWNER TO postgres;

--
-- Name: submenus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.submenus_id_seq OWNED BY public.submenus.id;


--
-- Name: user_group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_group (
    user_id integer NOT NULL,
    group_id integer NOT NULL
);


ALTER TABLE public.user_group OWNER TO postgres;

--
-- Name: user_permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_permission (
    user_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.user_permission OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying,
    first_name character varying,
    last_name character varying,
    email character varying,
    phone character varying(15),
    hashed_password character varying,
    is_active boolean,
    is_superuser boolean,
    student_id integer,
    reset_token character varying(255),
    reset_token_expiry timestamp without time zone,
    reset_token_used boolean DEFAULT false NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: academic_details id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.academic_details ALTER COLUMN id SET DEFAULT nextval('public.academic_details_id_seq'::regclass);


--
-- Name: academic_years id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.academic_years ALTER COLUMN id SET DEFAULT nextval('public.academic_years_id_seq'::regclass);


--
-- Name: account_groups id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_groups ALTER COLUMN id SET DEFAULT nextval('public.account_groups_id_seq'::regclass);


--
-- Name: account_heads id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_heads ALTER COLUMN id SET DEFAULT nextval('public.account_heads_id_seq'::regclass);


--
-- Name: account_master id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_master ALTER COLUMN id SET DEFAULT nextval('public.account_master_id_seq'::regclass);


--
-- Name: address id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.address ALTER COLUMN id SET DEFAULT nextval('public.address_id_seq'::regclass);


--
-- Name: address_details id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.address_details ALTER COLUMN id SET DEFAULT nextval('public.address_details_id_seq'::regclass);


--
-- Name: api_keys id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_keys ALTER COLUMN id SET DEFAULT nextval('public.api_keys_id_seq'::regclass);


--
-- Name: application_fees id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_fees ALTER COLUMN id SET DEFAULT nextval('public.application_fees_id_seq'::regclass);


--
-- Name: batches id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.batches ALTER COLUMN id SET DEFAULT nextval('public.batches_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: city id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.city ALTER COLUMN id SET DEFAULT nextval('public.city_id_seq'::regclass);


--
-- Name: countries id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.countries ALTER COLUMN id SET DEFAULT nextval('public.countries_id_seq'::regclass);


--
-- Name: course_category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_category ALTER COLUMN id SET DEFAULT nextval('public.course_category_id_seq'::regclass);


--
-- Name: course_code id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_code ALTER COLUMN id SET DEFAULT nextval('public.course_code_id_seq'::regclass);


--
-- Name: course_components id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_components ALTER COLUMN id SET DEFAULT nextval('public.course_components_id_seq'::regclass);


--
-- Name: course_results id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_results ALTER COLUMN id SET DEFAULT nextval('public.course_results_id_seq'::regclass);


--
-- Name: course_title id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_title ALTER COLUMN id SET DEFAULT nextval('public.course_title_id_seq'::regclass);


--
-- Name: courses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses ALTER COLUMN id SET DEFAULT nextval('public.courses_id_seq'::regclass);


--
-- Name: deb_details id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.deb_details ALTER COLUMN id SET DEFAULT nextval('public.deb_details_id_seq'::regclass);


--
-- Name: declaration_details id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.declaration_details ALTER COLUMN id SET DEFAULT nextval('public.declaration_details_id_seq'::regclass);


--
-- Name: departments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments ALTER COLUMN id SET DEFAULT nextval('public.departments_id_seq'::regclass);


--
-- Name: district id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.district ALTER COLUMN id SET DEFAULT nextval('public.district_id_seq'::regclass);


--
-- Name: document_details id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_details ALTER COLUMN id SET DEFAULT nextval('public.document_details_id_seq'::regclass);


--
-- Name: exam_timetables id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_timetables ALTER COLUMN id SET DEFAULT nextval('public.exam_timetables_id_seq'::regclass);


--
-- Name: exams id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exams ALTER COLUMN id SET DEFAULT nextval('public.exams_id_seq'::regclass);


--
-- Name: fee_details id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fee_details ALTER COLUMN id SET DEFAULT nextval('public.fee_details_id_seq'::regclass);


--
-- Name: groups id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups ALTER COLUMN id SET DEFAULT nextval('public.groups_id_seq'::regclass);


--
-- Name: hsc_board id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hsc_board ALTER COLUMN id SET DEFAULT nextval('public.hsc_board_id_seq'::regclass);


--
-- Name: lookup_master id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lookup_master ALTER COLUMN id SET DEFAULT nextval('public.lookup_master_id_seq'::regclass);


--
-- Name: main_groups id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.main_groups ALTER COLUMN id SET DEFAULT nextval('public.main_groups_id_seq'::regclass);


--
-- Name: marks_entries id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marks_entries ALTER COLUMN id SET DEFAULT nextval('public.marks_entries_id_seq'::regclass);


--
-- Name: menus id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menus ALTER COLUMN id SET DEFAULT nextval('public.menus_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Name: permissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions ALTER COLUMN id SET DEFAULT nextval('public.permissions_id_seq'::regclass);


--
-- Name: program_payment_workflow_scopes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.program_payment_workflow_scopes ALTER COLUMN id SET DEFAULT nextval('public.program_payment_workflow_scopes_id_seq'::regclass);


--
-- Name: programs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.programs ALTER COLUMN id SET DEFAULT nextval('public.programs_id_seq'::regclass);


--
-- Name: schemes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schemes ALTER COLUMN id SET DEFAULT nextval('public.schemes_id_seq'::regclass);


--
-- Name: semester_fees id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.semester_fees ALTER COLUMN id SET DEFAULT nextval('public.semester_fees_id_seq'::regclass);


--
-- Name: semester_masters id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.semester_masters ALTER COLUMN id SET DEFAULT nextval('public.semester_masters_id_seq'::regclass);


--
-- Name: semester_results id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.semester_results ALTER COLUMN id SET DEFAULT nextval('public.semester_results_id_seq'::regclass);


--
-- Name: semesters id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.semesters ALTER COLUMN id SET DEFAULT nextval('public.semesters_id_seq'::regclass);


--
-- Name: ssc_board id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ssc_board ALTER COLUMN id SET DEFAULT nextval('public.ssc_board_id_seq'::regclass);


--
-- Name: staff id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff ALTER COLUMN id SET DEFAULT nextval('public.staff_id_seq'::regclass);


--
-- Name: states id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.states ALTER COLUMN id SET DEFAULT nextval('public.states_id_seq'::regclass);


--
-- Name: student_course_registrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_course_registrations ALTER COLUMN id SET DEFAULT nextval('public.student_course_registrations_id_seq'::regclass);


--
-- Name: student_exam_registrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_exam_registrations ALTER COLUMN id SET DEFAULT nextval('public.student_exam_registrations_id_seq'::regclass);


--
-- Name: student_mark_temp id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_mark_temp ALTER COLUMN id SET DEFAULT nextval('public.student_mark_temp_id_seq'::regclass);


--
-- Name: students id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students ALTER COLUMN id SET DEFAULT nextval('public.students_id_seq'::regclass);


--
-- Name: sub_groups id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sub_groups ALTER COLUMN id SET DEFAULT nextval('public.sub_groups_id_seq'::regclass);


--
-- Name: subjects id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subjects ALTER COLUMN id SET DEFAULT nextval('public.subjects_id_seq'::regclass);


--
-- Name: submenus id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submenus ALTER COLUMN id SET DEFAULT nextval('public.submenus_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: academic_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.academic_details (id, student_id, ssc_board_id, ssc_school, ssc_scheme, ssc_score, ssc_year, after_ssc, hsc_board_id, hsc_school, hsc_result, hsc_scheme, hsc_score, hsc_year, diploma_institute, diploma_board, diploma_result, diploma_scheme, diploma_score, diploma_year) FROM stdin;
28	29	12929	shri ramana vikass hr sec	Percentage	50	2020-12-31	Class XII/HSC	12964	shri ramana vikass hr sec	Declared	Percentage	73	2022-12-31						\N
29	30	12929	St Michael academy	Percentage	72	2007-12-31	Class XII/HSC	12964	St Michael academy	Declared	Percentage	67	2009-12-31						\N
30	31	12901	SBOA	Percentage	80	2018-12-31	Class XII/HSC	12937	Saraswathi vidyalaya	Declared	CGPA out of 10	7.3	2020-12-31						\N
31	32	12901	dav boys sr sec school	Percentage	55	2022-12-31	Class XII/HSC	12964	sree venkateshwa matric hr sec school	Declared	Percentage	71	2024-12-31						\N
32	33	12901	DEVI ACADEMY SENIOR SECONDARY SCHOOL	Percentage	94.4	2021-12-31	Class XII/HSC	12937	THE VELAMMAL INTERNATIONAL SCHOOL	Declared	Percentage	91.2	2023-12-31						\N
33	34	12901	PON VIDYASHRAM	Percentage	72	2019-12-31	Class XII/HSC	12937	PON VIDYASHRAM	Declared	Percentage	75.2	2021-12-31						\N
34	35	12929	Sekkizhar Governmen Girls High school	Percentage	61	1999-12-31	Class XII/HSC	12964	Sekkizhar Government High School	Declared	Percentage	61	2001-12-31						\N
35	36	12929	MCNUP DA HSS	Percentage	71	1998-12-31	Diploma	\N					\N	JACSI Polytechnic	State board of Technical Education	Declared	Percentage	58	2001-12-31
36	37	12901	PM SHRI KENDRIYA VIDYALAYA NO.1, TRICHY-16	Percentage	78.8	2021-12-31	Class XII/HSC	12937	PM SHRI KENDRIYA VIDYALAYA NO.1, TRICHY-16	Declared	Percentage	63.40	2023-12-31						\N
38	39	12929	Devangar Higher secondary school	Percentage	81.6	2014-12-31	Class XII/HSC	12964	Devangar Higher Secondary Schoo	Declared	Percentage	59.58	2016-12-31						\N
39	42	196506	G.G.V.H.S	Percentage	35	1996-12-31	Class XII/HSC	12954	KSOS KERALA	Declared	Percentage	42	2022-12-31						\N
40	43	12901	Muthamil Public School	Percentage	74.6	2021-12-31	Class XII/HSC	12937	Muthamil Public School	Declared	Percentage	79.4	2023-12-31						\N
41	45	12901	CHETTINAD VIDYASHRAM	Percentage	74	2020-12-31	Class XII/HSC	12937	KARUNYA CHRISTIAN SCHOOL	Declared	Percentage	62	2022-12-31						\N
42	46	12929	MKM. Matriculation.Higher.secondary school	Percentage	54	2021-12-31	Class XII/HSC	12964	MKM. MATRICULATION.HIGHER.SECONDARY	Declared	Percentage	74	2023-12-31						\N
43	47	12901	Bharath Senior Secondary School	CGPA out of 10	9.2	2021-12-31	Class XII/HSC	12937	Bharath Senior Secondary School	Declared	CGPA out of 10	9.2	2023-12-31						\N
44	48	12920	St Mary's High School	Percentage	70.40	2018-12-31	Both	12956	Thakur College of Science and Commerce	Declared	Percentage	70.67	2020-12-31	Krupaniddhi College of Pharmacy	Karnataka	Declared	Percentage	60.54	2023-12-31
87	91	196506	Holy Family CGHS , Chembukkavu, Thrissur	Percentage	94	2005-12-31	Class XII/HSC	12954	Govt.Model Girls HSS,Thrissur	Declared	Percentage	82	2007-12-31						\N
88	92	12905	ZPH SCHOOL	Percentage	71	2004-12-31	Class XII/HSC	12940	St Joseph Junior College, Kadapa	Declared	Percentage	79.2	2006-12-31						\N
89	93	12929	Muslim pulavar HS	Percentage	82.6	2001-12-31	Class XII/HSC	12964	NM GOVT(G)HSS	Declared	Percentage	66.2	2003-12-31						\N
90	94	12905	SBSS High School	CGPA out of 10	6.1	1979-12-31	Class XII/HSC	12940	Government Junior College	Declared	CGPA out of 10	6.72	1981-12-31						\N
91	95	12929	christ king convent	Percentage	70	1980-12-31	Class XII/HSC	12964	christ king convent	Declared	Percentage	74	1982-12-31						\N
92	96	12929	Vidhya Vikas Matriculation Hr.Sec School	Percentage	66	2000-12-31	Class XII/HSC	12964	St Josephs Matriculation HR.Sec School	Declared	Percentage	88	2002-12-31						\N
93	97	12929	Government Higher secondary school Muthuramalingapuram	Percentage	67	1996-12-31	Class XII/HSC	12964	Government Higher secondary school Muthuramalingapuram	Declared	Percentage	69	1998-12-31						\N
94	98	20292	SHHS THEVARA	Percentage	55	1976-12-31	Class XII/HSC	12954	university of kerala	Declared	Percentage	45	1978-12-31						\N
95	99	12901	Sri Sankara Senior Secondary School	Percentage	76.6	1984-12-31	Class XII/HSC	12937	Kendriya Vidyalaya Pattom Trivandrum	Declared	Percentage	74.6	1986-12-31						\N
96	100	12929	Private	Percentage	66	2013-12-31	Class XII/HSC	12964	St Mark	Declared	Percentage	56	2015-12-31						\N
97	101	12920	Rajguru H.M.pandit Saphale	Percentage	66	1998-12-31	Class XII/HSC	12956	Vartak College Vasai Road	Declared	Percentage	53	2000-12-31						\N
98	102	12929	St Dominics Anglo Indian Higher Secondary School	Percentage	84	2014-12-31	Class XII/HSC	12964	St Dominics Anglo Indian Higher Secondary School	Declared	Percentage	58	2016-12-31						\N
99	103	12929	Muruga dhanushkodi girls higher secondary school	Percentage	78.8	2001-12-31	Class XII/HSC	12964	Muruga  dhanushkodi girls higher secondary school	Declared	Percentage	68.17	2003-12-31						\N
100	104	12929	V V BOYS HIGHER SECONDARY SCHOOL	Percentage	49	2006-12-31	Diploma	\N					\N	NANDHA POLYTECHNIC COLLEGE	STATE BOARD OF TECHNICAL EDUCTION AND TRAINING	Declared	Percentage	52	2010-12-31
102	106	12929	RKSree Rangammal Kalvi Nilayam	Percentage	64	1996-12-31	Diploma	\N					\N	Sree Narayana Guru Institute of Technology	DOTE	Declared	Percentage	65	1999-12-31
103	107	12929	Hussain Memorial Matric Hr Sec School	Percentage	88.88	2000-12-31	Class XII/HSC	12964	Hussain Memorial Matric Hr Sec School	Declared	Percentage	93	2002-12-31						\N
104	108	12912	higher secondary school,zanda chowk,silvassa	Percentage	61.57	2003-12-31	Class XII/HSC	12947	Higher secondary school,Tokarkhada,silvassa	Declared	Percentage	63.20	2005-12-31						\N
105	109	12929	SIR MCTM HSS	Percentage	75	2009-12-31	Class XII/HSC	12964	GOVT HSS MMDA COLONY ARUMBAKKAM	Declared	Percentage	48	2011-12-31						\N
106	110	12905	Ravindra VidyaNiketan	Percentage	85	2004-12-31	Class XII/HSC	12940	Holy cross Junior College	Declared	Percentage	89	2006-12-31						\N
107	111	\N	ST JOSEPH  A. I  GHSS TRICHY	CGPA out of 10	9	1996-12-31	Class XII/HSC	20127	ST JOSEPH  A. I GHSS TRICHY	Declared	CGPA out of 10	9	1998-12-31						\N
108	112	12929	Government Girls High school	Percentage	75	2003-12-31	Class XII/HSC	12964	PKGG higher Secondary School	Declared	Percentage	81	2005-12-31						\N
109	113	12929	St.Josephs Matriculation school	Percentage	86.5	1997-12-31	Class XII/HSC	12964	GD.Naidu higher secondary schoolk	Declared	Percentage	95	1999-12-31						\N
110	114	12901	SMT NDJ AGARWAL VIDYALAYA	Percentage	74	2001-12-31	Class XII/HSC	12964	MANILALM MEHTA G HSS	Declared	Percentage	65	2003-12-31						\N
111	115	\N	SVVM High School, Tenali	Percentage	75	1993-12-31	Class XII/HSC	12961	National Open School, New Delhi	Declared	Percentage	66	1995-12-31						\N
112	116	12901	SRI AKILANDESWARI VIDYALAYA	Percentage	75.8	1997-12-31	Class XII/HSC	12964	SAVITRI VIDYASALA HINDU GIRLS HIGHER SECONDARY SCHOOL	Declared	Percentage	77.5	1999-12-31						\N
45	49	12929	NIRMALA MATHA CONVENT MATRIC HIGHER SECONDARY SCHOOL	Percentage	80.8	2021-12-31	Class XII/HSC	12964	NIRMALA MATHA CONVENT HIGHER SECONDARY SCHOOL	Declared	Percentage	85	2023-12-31						\N
46	50	\N	Government higher secondary school	Percentage	75	2020-12-31	Class XII/HSC	12964	Government higher secondary school	Declared	Percentage	75	2022-12-31						\N
47	51	12920	ST SEBASTIAN HIGH SCHOOL	Percentage	83.46	2002-12-31	Class XII/HSC	12956	SETH JYOTIPRASAD VIDYALAY	Declared	Percentage	72.5	2004-12-31						\N
48	52	12929	Mariammal Girls Higher Secondary School	Percentage	86.2	2018-12-31	Class XII/HSC	12964	Mariammal Girls Higher Secondary School	Declared	Percentage	91.7	2020-12-31						\N
49	53	12929	Mariammal school	Percentage	73.2	2018-12-31	Class XII/HSC	12964	Mariammal school	Declared	Percentage	83.3	2020-12-31						\N
50	54	12905	Ravindra bharathi school	Percentage	99.9	2019-12-31	Class XII/HSC	12940	Narayana junior college	Declared	Percentage	88.8	2021-12-31						\N
51	55	12926	Prem Dham Sarvhitkari Vidya Mandir	Percentage	92	2015-12-31	Both	20772	Victoria School	Declared	Percentage	70	2017-12-31	Niagara College Of Applied Arts And Technology	Niagara College	Declared	CGPA out of 10	7.3	2022-12-31
52	56	12920	Courage english High school	Percentage	35	2020-12-31	Class XII/HSC	12956	Shree gpm degree college	Declared	Percentage	51.83	2022-12-31						\N
54	58	12929	A.R.L.M hr.sec.school	Percentage	72	2018-12-31	Class XII/HSC	12964	St Anne's hr.sec.school	Declared	Percentage	81.89	2020-12-31						\N
55	59	196506	Rahmath English Higher Secondary School	Percentage	75.23	2005-12-31	Class XII/HSC	12954	ICA Higher Secondary School	Declared	Percentage	58.50	2007-12-31						\N
56	60	12929	Ramakrishna Mission Residential High School	Percentage	86	1998-12-31	Diploma	\N					\N	Ramakrishna Mission Polytechnic	State Board of Technical Education	Declared	Percentage	86	2001-12-31
57	61	12929	Vkp	Percentage	52	2001-12-31	Class XII/HSC	12964	Vkp	Declared	Percentage	62	2003-12-31						\N
58	62	12929	KLK Government Higher secondary school	Percentage	71	1991-12-31	Class XII/HSC	12964	KLK Government Higher secondary school	Declared	Percentage	56	1993-12-31						\N
59	63	12929	ST.MARY'S HR.SEC.SCHOOL	Percentage	50	2008-12-31	Class XII/HSC	12937	ST.ANSELEM CBSE HR.SEC.SCHOOL	Declared	Percentage	68	2011-12-31						\N
60	64	12918	MSV High School	Percentage	42	1993-12-31	Class XII/HSC	12953	Vivekananda PU college	Declared	Percentage	41	1995-12-31						\N
61	65	12901	JSS Public School	Percentage	76.4	2004-12-31	Class XII/HSC	12953	SBMJ INDP PU College	Declared	Percentage	81.33	2006-12-31						\N
62	66	12929	CSI EWART MAT SCHOOL	Percentage	75	2007-12-31	Class XII/HSC	12964	CSI EWART MAT SCHOOL	Declared	Percentage	71	2009-12-31						\N
63	67	12901	Kendriya Vidyalaya Picket	Percentage	62.4	1988-12-31	Class XII/HSC	12937	Kendriya Vidyalaya	Declared	Percentage	55.2	1990-12-31						\N
64	68	12905	SIDDHARTHA ENGLISH MEDIUM HIGH SCHOOL	Percentage	70	2003-12-31	Class XII/HSC	12940	Kakatiya Co Op Junior College	Declared	Percentage	70	2005-12-31						\N
65	69	12930	Siddhartha english medium school	Percentage	77	2007-12-31	Class XII/HSC	35214	Sri Chaitanya junior college	Declared	Percentage	60.4	2009-12-31						\N
66	70	12920	Vidyadham Prashala	Percentage	87.07	2007-12-31	Class XII/HSC	12956	Vidyadham Junior college	Declared	Percentage	71.83	2009-12-31						\N
67	71	12929	St Gabriels HSS	Percentage	57	1984-12-31	Class XII/HSC	12964	Pachyappas HSS	Declared	Percentage	87	1986-12-31						\N
68	72	12901	Jawahar Navoday Vidyalaya, Valpoi, Goa	Percentage	84.6	2002-12-31	Class XII/HSC	12937	Jawahar Navodaya Vidyalaya, Canacona , Goa	Declared	Percentage	85.2	2004-12-31						\N
69	73	12901	Vidya Mandir Senior Secondary school	Percentage	73.6	2019-12-31	Class XII/HSC	12937	Vidya Mandir Senior Secondary school	Declared	Percentage	64	2022-12-31						\N
70	74	12901	VIVEKANANDA VIDYALAYA	Percentage	72	2009-12-31	Class XII/HSC	12964	MAHARISHI VIDYA MANDIR	Declared	Percentage	80	2011-12-31						\N
71	75	12929	ZMMCH&RI	Percentage	95	2011-12-31	Class XII/HSC	12964	Zion matriculation higher secondary school	Declared	Percentage	80	2013-12-31						\N
72	76	12929	Vidyodaya girls higher seconda School	Percentage	89	2013-12-31	Class XII/HSC	12964	Vidyodaya girls higher Secondary School	Declared	Percentage	74	2015-12-31						\N
73	77	12929	KURINIJI MATRICULATION HIGHER SECONDARY SCHOOL NAMAKKAL	Percentage	83.6	2007-12-31	Class XII/HSC	12964	GOVT GIRLS HIGHER SECONDARY SCHOOL CHEYYAR	Declared	Percentage	75	2009-12-31						\N
74	78	12929	csi bain matriculation HSS	Percentage	91	2014-12-31	Class XII/HSC	12964	csi bain matriculation HSS	Declared	Percentage	70	2016-12-31						\N
75	79	12929	Hindhu higher secondary school	Percentage	87.6	2010-12-31	Class XII/HSC	12964	Vanni matric higher secondary school	Declared	Percentage	70	2012-12-31						\N
76	80	12929	St.John's Higher secondary school, Palayamkottai	Percentage	77.6	1983-12-31	Class XII/HSC	12964	MDT HINDU COLLEGE HSS	Declared	Percentage	70.33	1985-12-31						\N
77	81	12929	St.Joseph's matriculation higher secondary school	Percentage	91.2	2011-12-31	Class XII/HSC	12964	St.Joseph's matriculation higher secondary school	Declared	Percentage	87.1	2013-12-31						\N
78	82	12929	Government High school	Percentage	52.4	2006-12-31	Class XII/HSC	12964	Arignar anna government higher secondary school, poonamallee	Declared	Percentage	55.75	2008-12-31						\N
79	83	12929	SAROJINI VARADAPPAN GIRLS HIGHER SECONDARY SCHOOL Poonamalle	Percentage	66	1997-12-31	Class XII/HSC	12964	SAROJINI VARADAPPAN GIRLS HIGHER SECONDARY SCHOOL Poonamalle	Declared	Percentage	69.7	1999-12-31						\N
80	84	12929	AVICHI HSS VIRUGAMBAKKAM	Percentage	84.2	2012-12-31	Class XII/HSC	12964	AVICHI HSS VIRUGAMBAKKAM	Declared	Percentage	59.9	2014-12-31						\N
81	85	12929	Anna arivagam	Percentage	98.4	2013-12-31	Class XII/HSC	12964	Sri Vijay vidyalaya matriculation school	Declared	Percentage	97	2015-12-31						\N
82	86	12929	P A K Palanisamy HSS, Chennai	Percentage	86.2	2001-12-31	Class XII/HSC	12964	K C S N HSS Washermenpet CH-21	Declared	Percentage	71.67	2003-12-31						\N
83	87	12901	NAZARETH	Percentage	88	2007-12-31	Class XII/HSC	12954	NSS	Declared	Percentage	92	2009-12-31						\N
84	88	12929	St Theresa girls higher secondary school	Percentage	88	2011-12-31	Class XII/HSC	12964	St Theresa girls higher secondary school	Declared	Percentage	74	2013-12-31						\N
85	89	12929	Goodlet Hr. Sec. School	Percentage	59	2014-12-31	Class XII/HSC	12964	Goodlet Hr. Sec. School	Declared	Percentage	47	2016-12-31						\N
86	90	12929	GRT Mahalakshmi Vidyalaya Matriculation Higher Secondary School	Percentage	86	2005-12-31	Class XII/HSC	12964	GRT Mahalakshmi Vidyalaya Matriculation Higher Secondary School	Declared	Percentage	84.5	2007-12-31						\N
113	117	12929	Ramakrishna Mission Matriculation higher secondary school	Percentage	91	2016-12-31	Class XII/HSC	12964	Ramakrishna Mission Matriculation Higher Secondary School	Declared	Percentage	75	2018-12-31						\N
114	118	12929	Shikshaa Matric Higher secondary school	Percentage	93	2016-12-31	Class XII/HSC	12964	Shikshaa Matric Higher secondary school	Declared	Percentage	70.5	2018-12-31						\N
115	119	12929	Little flower matriculation higher secondary school	Percentage	71	2016-12-31	Class XII/HSC	12964	Chennai girls higher secondary school	Declared	Percentage	49	2018-12-31						\N
116	120	12901	DAV , Girls Higher Secondary School, Gopalapuram.	CGPA out of 10	9	2015-12-31	Class XII/HSC	12964	Sacred Heart , Church Park.	Declared	Percentage	77	2017-12-31						\N
117	121	12925	Town high school	Percentage	58	1984-12-31	Class XII/HSC	12962	DK Colleges	Declared	Percentage	45	1987-12-31						\N
118	122	20292	St. Thomas C. E. M.G .H . S., Olavakkod, Palakkad	Percentage	88	1989-12-31	Class XII/HSC	12954	Mercy college, Palakkad	Declared	Percentage	78	1991-12-31						\N
119	123	12925	Bentalar High school	Percentage	88	2006-12-31	Class XII/HSC	12962	JKBK Government College	Declared	Percentage	66	2008-12-31						\N
120	124	\N	C.S.I. EWART MATRICULATION HIGER SECONDARY SCHOOL	Percentage	83	1994-12-31	Class XII/HSC	\N	C.S.I.EWART MATRICULATION HIGER SECONDARY SCHOOL	Declared	Percentage	87.9	1996-12-31						\N
121	125	12929	Hindu higher secondary school	Percentage	87.6	2002-12-31	Class XII/HSC	12964	Hindu higher secondary school	Declared	Percentage	71.16	2004-12-31						\N
122	126	12901	S.B.O.A School & Junior College	Percentage	85	2007-12-31	Class XII/HSC	12937	S.B.O.A School & Junior College	Declared	Percentage	81	2009-12-31						\N
123	127	12901	Ashram public school	Percentage	86.2	1998-12-31	Class XII/HSC	12940	VENUS JUNIOR COLLEGE	Declared	Percentage	89.5	2000-12-31						\N
124	128	12929	Velammal M HSS Mogappair	Percentage	88	2001-12-31	Class XII/HSC	12964	ST Joseph Cluny M HSS Neyveli	Declared	Percentage	76	2003-12-31						\N
125	129	12901	KLE International School, Belgaum	CGPA out of 10	7.8	2013-12-31	Class XII/HSC	12953	KLE Independent PU College	Declared	Percentage	64.6	2015-12-31						\N
126	130	12901	Asan memorial senior secondary school	CGPA out of 10	6.2	2012-12-31	Class XII/HSC	12964	kumaran asan memorial higher secondary school	Declared	Percentage	69.25	2014-12-31						\N
127	131	12929	Government higher secondary school	Percentage	90	2014-12-31	Class XII/HSC	12964	Government higher secondary school	Declared	Percentage	68.5	2016-12-31						\N
128	132	12901	Velammal Bodhi Campus	Percentage	90	2022-12-31	Class XII/HSC	12937	Velammal Bodhi Campus	Declared	Percentage	82	2024-12-31						\N
129	133	12905	Montessori EM High School	Percentage	82	2004-12-31	Class XII/HSC	12940	Sri Chaitanya	Declared	Percentage	88	2006-12-31						\N
130	134	12901	St. Peter's central public school	Percentage	73.4	2004-12-31	Class XII/HSC	12940	Sri Chaitanya	Declared	Percentage	93.8	2006-12-31						\N
131	135	12929	Govt.hr.s.school , KK Nagar -600078	Percentage	67.8	1993-12-31	Class XII/HSC	12964	Govt.hr.s.school	Declared	Percentage	51.5	1995-12-31						\N
132	136	12929	SRI ANNAI VIDHYASHARAM MATRIC HIGHER SECONDARY SCHOOL	Percentage	89.6	2012-12-31	Class XII/HSC	12964	BHARATHI MATRIC HR SEC SCHOOL	Declared	Percentage	68.7	2014-12-31						\N
133	137	12929	Sundar matriculation higher secondary school	Percentage	78	2015-12-31	Class XII/HSC	12964	Sundar matriculation higher secondary school	Declared	Percentage	74	2017-12-31						\N
134	138	12929	Dr Salai Govindharajan Matriculation school for girls	Percentage	84	2011-12-31	Class XII/HSC	12964	Tarapur Loganadhan girls higher secondary school	Declared	Percentage	70	2013-12-31						\N
135	139	12918	ST.Peters English School	Percentage	69.92	1995-12-31	Class XII/HSC	12969	Shree Jain Vidyalaya	Declared	Percentage	63	1997-12-31						\N
136	140	12919	Burgess English Hr Sec School	Percentage	70	1997-12-31	Class XII/HSC	12955	Salem English School	Declared	Percentage	77	1999-12-31						\N
137	141	12929	KRISHNASAMY MEM MHSS CUDDALORE	Percentage	67	2003-12-31	Class XII/HSC	12964	KRISHNASAMY MEM MHSS CUDDALORE	Declared	Percentage	66	2005-12-31						\N
138	142	12929	Shri amirta higher secondary school	Percentage	80	2008-12-31	Class XII/HSC	12964	Shri amirta higher secondary school	Declared	Percentage	75	2010-12-31						\N
139	143	12905	Vedavyaasa Vidya Niketan	CGPA out of 10	9.2	2014-12-31	Class XII/HSC	12940	NRI JUNIOR COLLEGE	Declared	Percentage	91.6	2016-12-31						\N
140	144	12929	P.C.K.G Govt.Hr.Sec.School	Percentage	91.6	2003-12-31	Class XII/HSC	12964	P.C.K.G Govt.Hr.Sec.School	Declared	Percentage	72	2005-12-31						\N
144	148	12929	Guntur Subbiah Pillai T.Nagar Girls Hr Sec School	Percentage	70	2005-01-01	Class XII/HSC	12964	Guntur Subbiah Pillai T.Nagar Girls Hr Sec School	Declared	Percentage	73	2007-01-01						\N
145	149	12905	Little Citizens	Percentage	72	1991-01-01	Class XII/HSC	12940	St. PETERS COOPERATIVE JUNIOR COLLEGE	Declared	Percentage	74	1993-01-01						\N
147	151	12929	CLUNY MATRICULATION HIGHER SECONDARY SCHOOL	Percentage	68	2008-01-01	Class XII/HSC	12964	VIDHYA VIKAS	Declared	Percentage	63	2010-01-01						\N
152	156	12929	Chinnasamyammal school	Percentage	87.2	2007-01-01	Diploma	\N					\N	Government polytechnic college - Coimbatore	DOTE	Declared	Percentage	91.5	2010-01-01
154	158	12901	Space central school SHAR sriharikota	Percentage	66.8	2018-01-01	Class XII/HSC	12940	Narayana Junior College Brahmadevam	Declared	CGPA out of 10	9.79	2020-01-01						\N
155	159	12929	10	Percentage	75	1994-01-01	Class XII/HSC	12964	Sengunthat Hr.Sec .School	Declared	Percentage	68	1996-01-01						\N
157	161	12929	Goverment hr secondary school anumandai	Percentage	60	2014-01-01	Class XII/HSC	12964	Govt hr secondary school	Declared	Percentage	54	2017-01-01						\N
165	171	12929	GK Shetty Hindu Vidyalaya	Percentage	74	2019-01-01	Class XII/HSC	12964	GK Shetty Hindu Vidyalaya	Declared	Percentage	86	2021-01-01						\N
166	172	12929	St.Mary's Girls Higher Secondary school	Percentage	90	2008-01-01	Class XII/HSC	12964	St.Mary's Girls Higher Secondary school	Declared	Percentage	91.9	2010-01-01						\N
167	173	12929	KEERTHANA R	Percentage	70	2015-01-01	Class XII/HSC	12964	KEERTHANA R	Declared	Percentage	75	2017-01-01						\N
168	174	196506	Koodali high school	Percentage	82	1990-01-01	Class XII/HSC	\N	Nirmalagiri college	Declared	Percentage	72	1992-01-01						\N
169	175	12901	Adarsh Senior Secondary school	Percentage	45	2006-01-01	Class XII/HSC	12964	Gill Adarsh	Declared	Percentage	68	2008-01-01						\N
170	176	12929	ST JOSEPH GIRLS HIGHER SECONDARY SCHOOL	Percentage	86	2004-01-01	Class XII/HSC	12964	ST JOSEPH GIRLS HIGHER SECONDARY SCHOOL	Declared	Percentage	76	2006-01-01						\N
173	179	\N	Bharatha vidyalaya school	Percentage	79	2011-01-01	Class XII/HSC	\N	Bharatha Vid MHSS Ayanavaram	Declared	Percentage	75	2013-01-01						\N
174	180	12901	Jawahar higher secondary school , cbse	Percentage	74.4	2022-01-01	Class XII/HSC	12937	Akt memorial Vidya saaket school	Declared	Percentage	71.2	2024-01-01						\N
\.


--
-- Data for Name: academic_years; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.academic_years (id, year_code, start_year, end_year, start_month, end_month, is_active, description, created_at, updated_at) FROM stdin;
1	2025-26	2025	2026	7	6	t	Academic Year 2025-26 (July 2025 - June 2026)	2026-03-27 06:13:51.114967	2026-03-27 06:13:51.114974
2	2024-25	2024	2025	7	6	f	Academic Year 2024-25 (July 2024 - June 2025)	2026-03-27 06:13:51.120632	2026-03-27 06:13:51.120642
\.


--
-- Data for Name: account_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account_groups (id, grpcode, grpname) FROM stdin;
1	1	ASSETS
2	2	LIABILITIES
3	3	INCOME
4	4	EXPENDITURE
\.


--
-- Data for Name: account_heads; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account_heads (id, ano, anodes, grpcode, maincode, sub_group_id) FROM stdin;
3	30101	Application fees	3	26	161
4	30102	Admission fees	3	26	161
5	30100	Tuition fees	3	26	161
6	30103	LMS fees	3	26	161
7	30104	Exam fees	3	26	161
8	30105	Lab fees	3	26	161
\.


--
-- Data for Name: account_master; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account_master (id, damt, camt, fyr, dsid, rpcode, rpname, account_head_id) FROM stdin;
\.


--
-- Data for Name: address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.address (id, address_line1, address_line2, country_id, state_id, district_id, city_id, postal_code, is_verified, created_at) FROM stdin;
\.


--
-- Data for Name: address_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.address_details (id, student_id, corr_addr1, corr_addr2, corr_city, corr_state, corr_district, corr_country, corr_pin, corr_addr_same, perm_addr1, perm_addr2, perm_city, perm_state, perm_district, perm_country, perm_pin) FROM stdin;
27	29	1446/C-1 Aro illam	Annanagar	Sivaganga	Tamil Nadu	Sivaganga	101	630561	t	1446/C-1 Aro illam	Annanagar	Sivaganga	Tamil Nadu	Sivaganga	101	630561
28	30	No 77 Subham apartments Gandhi nagar Adyar	\N	Chennai	Tamil Nadu	Chennai	101	600020	t	No 77 Subham apartments Gandhi nagar Adyar	\N	Chennai	Tamil Nadu	Chennai	101	600020
29	31	Chendur house ,F-114,5th stree	Annanagar east , chennai	Chennai	Tamil Nadu	Chennai	101	600102	t	Chendur house ,F-114,5th stree	Annanagar east , chennai	Chennai	Tamil Nadu	Chennai	101	600102
30	32	18/3,39/4 subedar hussain street royapettah	\N	Chennai	Tamil Nadu	Chennai	101	600014	t	18/3,39/4 subedar hussain street royapettah	\N	Chennai	Tamil Nadu	Chennai	101	600014
31	33	9-119, 4th Street, Sai Nagar	Virugambakkam	Chennai	Tamil Nadu	Chennai	101	600092	t	9-119, 4th Street, Sai Nagar	Virugambakkam	Chennai	Tamil Nadu	Chennai	101	600092
32	34	33and34 Radha nagar main road	Valasaravakkam chennai	Chennai	Tamil Nadu	Chennai	101	600087	t	33and34 Radha nagar main road	Valasaravakkam chennai	Chennai	Tamil Nadu	Chennai	101	600087
33	35	Balakrishna Nagar, Sundharasozhavaram	Thiruverkadu	Chennai	Tamil Nadu	Chennai	101	600077	t	Balakrishna Nagar, Sundharasozhavaram	Thiruverkadu	Chennai	Tamil Nadu	Chennai	101	600077
34	36	526 Sree Sai Kuteera Appts  , 3rd Floor ,	Lakke gowda nagar , BHCS Layout	Bengaluru	Karnataka	Bengaluru Urban	101	560061	t	526 Sree Sai Kuteera Appts  , 3rd Floor ,	Lakke gowda nagar , BHCS Layout	Bengaluru	Karnataka	Bengaluru Urban	101	560061
35	37	1/258, shanmuga nagar, bharat nagar, road, poolangudi colony, happ post, trichy-25	1/258, shanmuga nagar, bharat nagar road, poolangudi colony, HAPP post, trichy-25	Tiruchirappalli	Tamil Nadu	Tiruchirappalli	101	620025	t	1/258, shanmuga nagar, bharat nagar, road, poolangudi colony, happ post, trichy-25	1/258, shanmuga nagar, bharat nagar road, poolangudi colony, HAPP post, trichy-25	Tiruchirappalli	Tamil Nadu	Tiruchirappalli	101	620025
37	39	247	Thriumal Nagar NGO A colony	Tirunelveli	Tamil Nadu	Tirunelveli	101	627001	t	247	Thriumal Nagar NGO A colony	Tirunelveli	Tamil Nadu	Tirunelveli	101	627001
38	42	PUTHAN VEETIL	PERUMUGHAM POST,FEROKE	Kozhikode	Kerala	Kozhikode	101	673631	t	PUTHAN VEETIL	PERUMUGHAM POST,FEROKE	Kozhikode	Kerala	Kozhikode	101	673631
39	43	Sri Ramachandra Gents Hostel	Sri Ramachandra University,Porur	Chennai	Tamil Nadu	Chennai	101	600116	f	7/14,ANNA NAGAR,NGO B COLONY	Palayamkottai,Tirunelveli	Palayamkottai	Tamil Nadu	Tirunelveli	101	627007
40	45	NEW NO 220/OLD NO 211, LINGHI CHETTY STREET, GEORGE TOWN, CHENNAI	NEW NO 220/OLD NO 211, LINGHI CHETTY STREET, GEORGE TOWN, CHENNAI	Chennai	Tamil Nadu	Chennai	101	600001	t	NEW NO 220/OLD NO 211, LINGHI CHETTY STREET, GEORGE TOWN, CHENNAI	NEW NO 220/OLD NO 211, LINGHI CHETTY STREET, GEORGE TOWN, CHENNAI	Chennai	Tamil Nadu	Chennai	101	600001
41	46	Kochar Arjun Garden c block 101, Gerugambakkam, Tharapakkam Road, Chennai 600122	\N	Chennai	Tamil Nadu	Chennai	101	600122	t	Kochar Arjun Garden c block 101, Gerugambakkam, Tharapakkam Road, Chennai 600122	\N	Chennai	Tamil Nadu	Chennai	101	600122
42	47	Flat 90610, 5th Floor, Tower 9C, Prestige Bella Vista Apts.	1/8, Mount Poonamalle Main Road, Iyyappanthangal, Chennai	Chennai	Tamil Nadu	Chennai	101	600056	t	Flat 90610, 5th Floor, Tower 9C, Prestige Bella Vista Apts.	1/8, Mount Poonamalle Main Road, Iyyappanthangal, Chennai	Chennai	Tamil Nadu	Chennai	101	600056
43	48	Room no 1, Swami Swaroopanand Chawl	Vartak Galli, Penkar Pada, Mira Road East	Mira Bhayandar	Maharashtra	Thane	101	401107	t	Room no 1, Swami Swaroopanand Chawl	Vartak Galli, Penkar Pada, Mira Road East	Mira Bhayandar	Maharashtra	Thane	101	401107
44	49	Kambar Street	\N	Coimbatore	Tamil Nadu	Coimbatore	101	641111	t	Kambar Street	\N	Coimbatore	Tamil Nadu	Coimbatore	101	641111
45	50	4/88 gate street	Mudaliyarpatti	Tenkasi	Tamil Nadu	Tirunelveli	101	627423	t	4/88 gate street	Mudaliyarpatti	Tenkasi	Tamil Nadu	Tirunelveli	101	627423
46	51	B604, SAI ABHIMAN CHS	TUSHAR PARK, DHANORI	Pune	Maharashtra	Pune	101	411015	t	B604, SAI ABHIMAN CHS	TUSHAR PARK, DHANORI	Pune	Maharashtra	Pune	101	411015
47	52	23,Kattabomman street ,Suleeswaran Patti ,Coimbatore	\N	Pollachi	Tamil Nadu	Coimbatore	101	642006	t	23,Kattabomman street ,Suleeswaran Patti ,Coimbatore	\N	Pollachi	Tamil Nadu	Coimbatore	101	642006
48	53	50, Imam khan street, pollachi -642001	\N	Pollachi	Tamil Nadu	Coimbatore	101	642001	t	50, Imam khan street, pollachi -642001	\N	Pollachi	Tamil Nadu	Coimbatore	101	642001
49	54	Lemalle Amaravati	8-16/2	Guntur	Andhra Pradesh	Guntur	101	522016	t	Lemalle Amaravati	8-16/2	Guntur	Andhra Pradesh	Guntur	101	522016
50	55	2637/2 Bakshi Ganda Singh Street	\N	Patiala	Punjab	Patiala	101	147001	t	2637/2 Bakshi Ganda Singh Street	\N	Patiala	Punjab	Patiala	101	147001
51	56	Prem Nagar jhula maidan road near alfalah school jogeshwari east Mumbai Maharashtra 400060	\N	Mumbai City	Maharashtra	Mumbai City	101	400060	f	\N	\N	Mumbai	Maharashtra	Mumbai	101	\N
53	58	81 thangaraj nagar	thirupapuliyur	Cuddalore	Tamil Nadu	Cuddalore	India	607002	t	81 thangaraj nagar	thirupapuliyur	Cuddalore	Tamil Nadu	Cuddalore	India	607002
54	59	Kaniyamparambil (H), Aviyoor, Edakkara (PO), Punnayoor Panchavadi, Chavakkad, Thrissur	\N	Chavakkad	Kerala	Thrissur	India	680518	t	Kaniyamparambil (H), Aviyoor, Edakkara (PO), Punnayoor Panchavadi, Chavakkad, Thrissur	\N	Chavakkad	Kerala	Thrissur	India	680518
55	60	115, Plot 21, Appavu Nagar, 1st Cross, Hosur	Hosur	Hosur	Tamil Nadu	Krishnagiri	India	635109	f	S1, Sikara Orchid Apartment, Plot 40	Krishna nagar, Karanaipuducheri, Guduvancheri	Chengalpattu	Tamil Nadu	Kanchipuram	India	603202
56	61	2/110,newstreet, colachel kanniyakumari	\N	Nagercoil	\N	\N	Qatar	629251	t	2/110,newstreet, colachel kanniyakumari	\N	Nagercoil	\N	\N	Qatar	629251
57	62	No. 19-5th Periyar Street, Dr. Kaanu Nagar	Nessapakkam, Chennai.	Chennai	Tamil Nadu	Chennai	India	600078	f	26/9 Vasantha Bazaar	Gummdipoondi	\N	Tamil Nadu	\N	India	601201
58	63	6/14, SIMON COLONY	KODIMUNAI POST	Nagercoil	Tamil Nadu	Kanyakumari	India	629251	t	6/14, SIMON COLONY	KODIMUNAI POST	Nagercoil	Tamil Nadu	Kanyakumari	India	629251
59	64	B204, Landmark Residency, LG Enclave	nanjappa circle, Vidyaranyapura, Bangalore	Bengaluru	Karnataka	Bengaluru Urban	India	560097	t	B204, Landmark Residency, LG Enclave	nanjappa circle, Vidyaranyapura, Bangalore	Bengaluru	Karnataka	Bengaluru Urban	India	560097
60	65	Sri vari nilaya, CP Layout, Malur, Kolar, Karnataka	\N	Malur	Karnataka	Kolar	India	563130	t	Sri vari nilaya, CP Layout, Malur, Kolar, Karnataka	\N	Malur	Karnataka	Kolar	India	563130
61	66	4/31 tank bund road 2nd street, near upscale clothing,nungumbakkam	\N	Chennai	Tamil Nadu	Chennai	India	600034	t	4/31 tank bund road 2nd street, near upscale clothing,nungumbakkam	\N	Chennai	Tamil Nadu	Chennai	India	600034
62	67	Plot No 5, Venture-3, H. No 3-54-49, Saraswati Nagar Colony	Trimulgherry post, Lothkunta	Hyderabad	Telangana	Hyderabad	India	500015	t	Plot No 5, Venture-3, H. No 3-54-49, Saraswati Nagar Colony	Trimulgherry post, Lothkunta	Hyderabad	Telangana	Hyderabad	India	500015
63	68	Flat no.114,Tower 9,Provident Kenworth,Premavathipet	pillar no.293, PVNR Express Way,Shivrampally,Rajendranagar,Hyderabad.	Hyderabad	Telangana	Hyderabad	India	500030	t	Flat no.114,Tower 9,Provident Kenworth,Premavathipet	pillar no.293, PVNR Express Way,Shivrampally,Rajendranagar,Hyderabad.	Hyderabad	Telangana	Hyderabad	India	500030
64	69	Flat 114 , tower 9 , 1 St floor provident kenworth , Bhavani colony , premavathipet	Pillar no. 293 pvnr express way , shivrampally x road , rajendranagar , hyderabad, telanagana	Hyderabad	Telangana	Hyderabad	India	500030	t	Flat 114 , tower 9 , 1 St floor provident kenworth , Bhavani colony , premavathipet	Pillar no. 293 pvnr express way , shivrampally x road , rajendranagar , hyderabad, telanagana	Hyderabad	Telangana	Hyderabad	India	500030
65	70	Near Shree Dental Care, behind Ghadge LIC office Prabhat Nagar, Tal Poladpur, Dist Raigad.	\N	Pune	Maharashtra	Pune	India	402303	f	Shridatta Niwas Maharshtra colony Pipme Gurav	\N	\N	Maharashtra	Pune	India	411061
66	71	57,Pachayappas college Hostel Road	Chetpet	Chennai	Tamil Nadu	Chennai	India	600031	t	57,Pachayappas college Hostel Road	Chetpet	Chennai	Tamil Nadu	Chennai	India	600031
67	72	House No 1030/1,	Newwada Madapai, Marcel	Ponda	Goa	South Goa	India	403107	t	House No 1030/1,	Newwada Madapai, Marcel	Ponda	Goa	South Goa	India	403107
68	73	Sri Bhavanam Kambar Street, Guduvancheri	\N	Chengalpattu	Tamil Nadu	Kanchipuram	India	603202	t	Sri Bhavanam Kambar Street, Guduvancheri	\N	Chengalpattu	Tamil Nadu	Kanchipuram	India	603202
69	74	FLAT NO F7 SAI ENCLAVE	DIWANCHERUVU	Rajahmundry	Andhra Pradesh	East Godavari	India	533102	t	FLAT NO F7 SAI ENCLAVE	DIWANCHERUVU	Rajahmundry	Andhra Pradesh	East Godavari	India	533102
70	75	No 6 1st Main Road TTK Nagar West Tambaram	\N	Chennai	Tamil Nadu	Chennai	India	600045	t	No 6 1st Main Road TTK Nagar West Tambaram	\N	Chennai	Tamil Nadu	Chennai	India	600045
71	76	No 67, vaikundapuram 2nd street, kamdar nagar 1st street	Nungambakkam, Chennai	Chennai	Tamil Nadu	Chennai	India	600034	t	No 67, vaikundapuram 2nd street, kamdar nagar 1st street	Nungambakkam, Chennai	Chennai	Tamil Nadu	Chennai	India	600034
72	77	NO.7A SAI ENCLAVE, VIP CITY	ORIKKAI	Kanchipuram	Tamil Nadu	Kanchipuram	India	631502	t	NO.7A SAI ENCLAVE, VIP CITY	ORIKKAI	Kanchipuram	Tamil Nadu	Kanchipuram	India	631502
73	78	101/8 OM apartments	meedavakkam tak road , kilpauk	Chennai	Tamil Nadu	Chennai	India	600010	t	101/8 OM apartments	meedavakkam tak road , kilpauk	Chennai	Tamil Nadu	Chennai	India	600010
74	79	386/1 Sivan street, Amburpet	Vaniyambadi	Vaniyambadi	Tamil Nadu	Vellore	India	635751	t	386/1 Sivan street, Amburpet	Vaniyambadi	Vaniyambadi	Tamil Nadu	Vellore	India	635751
75	80	F203, Isha Yara Apartments, Vadakkupattu main road, Medavakkam, Chennai	\N	Chennai	Tamil Nadu	Chennai	India	600100	t	F203, Isha Yara Apartments, Vadakkupattu main road, Medavakkam, Chennai	\N	Chennai	Tamil Nadu	Chennai	India	600100
76	81	3/176, Sathya nagar,tajpura	Arcot	Arcot	Tamil Nadu	Vellore	India	632521	t	3/176, Sathya nagar,tajpura	Arcot	Arcot	Tamil Nadu	Vellore	India	632521
77	82	No.648 Palla Street Pattarai Village	Melnellathr Post	Tiruvallur	Tamil Nadu	Tiruvallur	India	602002	t	No.648 Palla Street Pattarai Village	Melnellathr Post	Tiruvallur	Tamil Nadu	Tiruvallur	India	602002
78	83	45/46,3RD CROSS STREET,SAKTHI NAGAR,	MANGADU, KANCHEEPURAM, TAMIL NADU	Kanchipuram	Tamil Nadu	Kanchipuram	India	600122	t	45/46,3RD CROSS STREET,SAKTHI NAGAR,	MANGADU, KANCHEEPURAM, TAMIL NADU	Kanchipuram	Tamil Nadu	Kanchipuram	India	600122
79	84	1/141 GEJALAKSHMI NAGAR, 1ST STREET SEENIVASAPURAM,KANCHEEPURAM  TAMIL NADU - 600122	\N	Kanchipuram	Tamil Nadu	Kanchipuram	India	600122	t	1/141 GEJALAKSHMI NAGAR, 1ST STREET SEENIVASAPURAM,KANCHEEPURAM  TAMIL NADU - 600122	\N	Kanchipuram	Tamil Nadu	Kanchipuram	India	600122
80	85	No 636 Sivan koil Street	Barur post and village	Krishnagiri	Tamil Nadu	Krishnagiri	India	635201	t	No 636 Sivan koil Street	Barur post and village	Krishnagiri	Tamil Nadu	Krishnagiri	India	635201
81	86	Abuhalifa Block 1	Al-Ahmadi	\N	\N	\N	Kuwait	54601	f	KLJ Greens	Sector 77	\N	Haryana	Faridabad	India	121004
82	87	Flat 1, Building 92, Street 820, Zone 25, Al Mansoura , Doha	\N	\N	\N	\N	Qatar	0000	f	Thadathil House	NARIYANANI P.O., PONKUNNAM	\N	\N	\N	India	686562
83	88	18/8, Ramanathan nagar , pozhichalur	\N	Chennai	Tamil Nadu	Chennai	India	600074	t	18/8, Ramanathan nagar , pozhichalur	\N	Chennai	Tamil Nadu	Chennai	India	600074
84	89	16, valmiki street, Kambar nagar	\N	Chennai	Tamil Nadu	Chennai	India	600082	f	205, main road , Marikkuppam, V.P.R puram,Veeramangalam P.O	\N	Pallipattu	Tamil Nadu	Tiruvallur	India	631302
85	90	S1, Anusha Garden, Building No. 18	2nd Street, Annai Velankanni Nagar, Madanandapuram, Chennai	Chennai	Tamil Nadu	Chennai	India	600125	t	S1, Anusha Garden, Building No. 18	2nd Street, Annai Velankanni Nagar, Madanandapuram, Chennai	Chennai	Tamil Nadu	Chennai	India	600125
86	91	Koorcham veettil house	Chembuthra	Thrissur	Kerala	Thrissur	India	680652	t	Koorcham veettil house	Chembuthra	Thrissur	Kerala	Thrissur	India	680652
87	92	Opposite Saifullah Makkah Masjid	6-3-302, Ramnagar	Anantapur	Andhra Pradesh	Anantapur	India	515001	t	Opposite Saifullah Makkah Masjid	6-3-302, Ramnagar	Anantapur	Andhra Pradesh	Anantapur	India	515001
88	93	No.63,Rahamathnagar,malayambakkam	Poonamallee	Chennai	Tamil Nadu	Chennai	India	600122	t	No.63,Rahamathnagar,malayambakkam	Poonamallee	Chennai	Tamil Nadu	Chennai	India	600122
89	94	Plot Number  B.100	Amaravathi Scheme, Chenchu Peta	Tenali	Andhra Pradesh	Guntur	India	522202	t	Plot Number  B.100	Amaravathi Scheme, Chenchu Peta	Tenali	Andhra Pradesh	Guntur	India	522202
90	95	no 3 new colony 16 cross street	chrompet chennai	Chennai	Tamil Nadu	Chennai	India	600044	t	no 3 new colony 16 cross street	chrompet chennai	Chennai	Tamil Nadu	Chennai	India	600044
91	96	130/61, Thulasinga Perumal Koil Street	Triplicane	Chennai	Tamil Nadu	Chennai	India	600005	f	1/113A, Atheos Garden, R R Nagar, 3rd Street	Iyyappanthangal, Chennai	Chennai	Tamil Nadu	Chennai	India	600056
92	97	S/O Alakesan,2/8 East Street,Muthuramalingapuram,Virudhunagar, Tamil Nadu,India	S/O Alakesan 2/8 East Street,Muthuramalingapuram, Virudhunagar, Tamil Nadu.	Aruppukkottai	Tamil Nadu	Virudhunagar	India	626105	t	S/O Alakesan,2/8 East Street,Muthuramalingapuram,Virudhunagar, Tamil Nadu,India	S/O Alakesan 2/8 East Street,Muthuramalingapuram, Virudhunagar, Tamil Nadu.	Aruppukkottai	Tamil Nadu	Virudhunagar	India	626105
93	98	Mazhuvancherry house, 43,priyadarsini nagar	Konthuruthy, Thevara p.o kochi13	Ernakulam	Kerala	Ernakulam	India	682013	t	Mazhuvancherry house, 43,priyadarsini nagar	Konthuruthy, Thevara p.o kochi13	Ernakulam	Kerala	Ernakulam	India	682013
94	99	3/5 KASTURI ESTATE 3RD ST, opposite Manjal restaurant	Gopalapuram post, Chennai	Chennai	Tamil Nadu	Chennai	India	600086	t	3/5 KASTURI ESTATE 3RD ST, opposite Manjal restaurant	Gopalapuram post, Chennai	Chennai	Tamil Nadu	Chennai	India	600086
95	100	flat no. 20, balaji nagar, Nadu mottor, pallikuppam, katpadi,l	flat no. 20, balaji nagar, Nadumottor, pallikuppam, katpadi	Vellore	Tamil Nadu	Vellore	India	632007	t	flat no. 20, balaji nagar, Nadu mottor, pallikuppam, katpadi,l	flat no. 20, balaji nagar, Nadumottor, pallikuppam, katpadi	Vellore	Tamil Nadu	Vellore	India	632007
96	101	C202,Royal Corner,Mira Nagar , Post - Umberpada	Tal .and Dist. Palghar	Palghar	Maharashtra	Palghar	India	401102	f	B 506, La -Riveria Housing Co-operative Society, Plot No.491, Market Yard, Old Panvel	\N	Panvel	Maharashtra	Raigad	India	410206
97	102	6/18A, Fishermen street,	St. Thomas Mount, Buttroad	Chennai	Tamil Nadu	Chennai	India	600016	t	6/18A, Fishermen street,	St. Thomas Mount, Buttroad	Chennai	Tamil Nadu	Chennai	India	600016
98	103	707,Neo apartment,surveyor colony, Alagar kovil road,	Opp to s.p.office, Madurai	Madurai	Tamil Nadu	Madurai	India	625007	t	707,Neo apartment,surveyor colony, Alagar kovil road,	Opp to s.p.office, Madurai	Madurai	Tamil Nadu	Madurai	India	625007
99	104	NO.5, ADHITHYA ILLAM, SRI SAKTHI NAGAR EXTENSION, KRISHNA NAGAR,	MUDICHUR ROAD, TAMBARAM WEST	Chennai	Tamil Nadu	Chennai	India	600045	t	NO.5, ADHITHYA ILLAM, SRI SAKTHI NAGAR EXTENSION, KRISHNA NAGAR,	MUDICHUR ROAD, TAMBARAM WEST	Chennai	Tamil Nadu	Chennai	India	600045
102	107	No 5, 26th street,	5th Avenue, Ashok Nagar, Chennai	Chennai	Tamil Nadu	Chennai	India	600083	t	No 5, 26th street,	5th Avenue, Ashok Nagar, Chennai	Chennai	Tamil Nadu	Chennai	India	600083
103	108	Bunglow no 59 ,lake city	kotharwadi,nani masani road	Pardi	Gujarat	Valsad	India	396125	t	Bunglow no 59 ,lake city	kotharwadi,nani masani road	Pardi	Gujarat	Valsad	India	396125
104	109	J.38/10, Nalvaravu st, M.M.D.A colony, Arumbakkam	\N	Chennai	Tamil Nadu	Chennai	India	600106	t	J.38/10, Nalvaravu st, M.M.D.A colony, Arumbakkam	\N	Chennai	Tamil Nadu	Chennai	India	600106
105	110	80/11-71 A1	Krishna Nagar,Kurnool	Kurnool	Andhra Pradesh	Kurnool	India	518002	t	80/11-71 A1	Krishna Nagar,Kurnool	Kurnool	Andhra Pradesh	Kurnool	India	518002
106	111	ASRIFNA  MANZIL	23,Muthukumaran Nagar poonamallee chennai	Chennai	Tamil Nadu	Chennai	India	600056	t	ASRIFNA  MANZIL	23,Muthukumaran Nagar poonamallee chennai	Chennai	Tamil Nadu	Chennai	India	600056
107	112	No  6/923, Moogambikai Nagar extn	Kovur Chennai	Chennai	Tamil Nadu	Chennai	India	600128	t	No  6/923, Moogambikai Nagar extn	Kovur Chennai	Chennai	Tamil Nadu	Chennai	India	600128
108	113	Emerald 11H, Olympia sequel,navalur	Chengalpattu 600130	Chengalpattu	Tamil Nadu	Kanchipuram	India	600130	t	Emerald 11H, Olympia sequel,navalur	Chengalpattu 600130	Chengalpattu	Tamil Nadu	Kanchipuram	India	600130
109	114	no-4, E-Block Lakeview Apartment Kamarajar Salai Mathur MMDA	\N	Chennai	Tamil Nadu	Chennai	India	600068	t	no-4, E-Block Lakeview Apartment Kamarajar Salai Mathur MMDA	\N	Chennai	Tamil Nadu	Chennai	India	600068
110	115	Flat 3, First floor, Somavarapu Heights	Hilltop Colony, Erramanzil, Khairatabad, Hyderabad	Hyderabad	Telangana	Hyderabad	India	500082	t	Flat 3, First floor, Somavarapu Heights	Hilltop Colony, Erramanzil, Khairatabad, Hyderabad	Hyderabad	Telangana	Hyderabad	India	500082
111	116	Flat No.123, 12th floor, Tower-36, DLF Garden City, Cluster-1,	Semmenchery	Chengalpattu	Tamil Nadu	Kanchipuram	India	600130	t	Flat No.123, 12th floor, Tower-36, DLF Garden City, Cluster-1,	Semmenchery	Chengalpattu	Tamil Nadu	Kanchipuram	India	600130
112	117	No.58/79 , sasthri nagar, chengalpattu	\N	Chengalpattu	Tamil Nadu	Kanchipuram	India	603001	t	No.58/79 , sasthri nagar, chengalpattu	\N	Chengalpattu	Tamil Nadu	Kanchipuram	India	603001
113	118	No.7, Homes India Flats, N.S.R road, Nehru Nagar, Chromepet, Chennai	\N	Chennai	Tamil Nadu	Chennai	India	600044	t	No.7, Homes India Flats, N.S.R road, Nehru Nagar, Chromepet, Chennai	\N	Chennai	Tamil Nadu	Chennai	India	600044
114	119	No2/12 ramasamy street Subiramaniya salai	West saidapet	Chennai	Tamil Nadu	Chennai	India	600015	t	No2/12 ramasamy street Subiramaniya salai	West saidapet	Chennai	Tamil Nadu	Chennai	India	600015
115	120	9, Pantheon road, 2nd Lane, Egmore	\N	Chennai	Tamil Nadu	Chennai	India	600008	t	9, Pantheon road, 2nd Lane, Egmore	\N	Chennai	Tamil Nadu	Chennai	India	600008
116	121	A201,Saanvi Heights , Ram Mandir Road	Goregaon West Mumbai	Mumbai	Maharashtra	Mumbai	India	400104	f	Bhaliadang, Sahadevkhunta	\N	Balasore	Odisha	Balasore	India	756001
117	122	Revathi, F-3, Venkatesapuram colony	100ft road, Palakkad	Palakkad	Kerala	Palakkad	India	678001	t	Revathi, F-3, Venkatesapuram colony	100ft road, Palakkad	Palakkad	Kerala	Palakkad	India	678001
118	123	MAITRI Nagar	Nayabazar	Cuttack	Odisha	Cuttack	India	753004	t	MAITRI Nagar	Nayabazar	Cuttack	Odisha	Cuttack	India	753004
119	124	PLOT NO 13 ,SRINAGAR COLONY ,MIDDLE STREET	KOLATHUR	Chennai	Tamil Nadu	Chennai	India	600099	t	PLOT NO 13 ,SRINAGAR COLONY ,MIDDLE STREET	KOLATHUR	Chennai	Tamil Nadu	Chennai	India	600099
120	125	Mangaf	\N	\N	\N	\N	Kuwait	93500	f	1/127 devalapuram ambur	\N	\N	Tamil Nadu	\N	India	635802
121	126	No.009, Opal block, Alliance Orchid Springs	Water Canal road, Korattur, Chennai	Chennai	Tamil Nadu	Chennai	India	600076	f	88/66, Kammavar street, Melakaramanur	Pennalurpettai P.O, Uthukottai	\N	Tamil Nadu	\N	India	602022
122	127	Plot no 151 Paras building Flat F2	Panchayat main road Thirumalai nagar Perungudi Chennai	Chennai	Tamil Nadu	Chennai	India	600096	t	Plot no 151 Paras building Flat F2	Panchayat main road Thirumalai nagar Perungudi Chennai	Chennai	Tamil Nadu	Chennai	India	600096
123	128	no 11A, asokan street, G1 kalai flats	palavanthangal, chennai	Chennai	Tamil Nadu	Chennai	India	600114	t	no 11A, asokan street, G1 kalai flats	palavanthangal, chennai	Chennai	Tamil Nadu	Chennai	India	600114
124	129	401, Shri Hari Heights, near Chintamani Gardens	Tanaji Nagar, Pune, Maharastra	Pune	Maharashtra	Pune	India	411046	f	830, CA Apartments, Police Colony	Paschim Vihar, New Delhi	West Delhi	Delhi	West Delhi	India	110063
125	130	No F1 block A3 Asvini avantika apartment nandambakkam	\N	Chennai	Tamil Nadu	Chennai	India	600089	f	No 52 part 2 srivari nagar singaperumal koil	\N	Chengalpattu	Tamil Nadu	Kanchipuram	India	603204
126	131	7/1184, South Sallikkulam, Vettaikkaraniruppu	\N	Nagapattinam	Tamil Nadu	Nagapattinam	India	611112	t	7/1184, South Sallikkulam, Vettaikkaraniruppu	\N	Nagapattinam	Tamil Nadu	Nagapattinam	India	611112
127	132	Mariyamman Kovil Street	4/5,chidambaram Nagar, Ramapuram	Chennai	Tamil Nadu	Chennai	India	600089	t	Mariyamman Kovil Street	4/5,chidambaram Nagar, Ramapuram	Chennai	Tamil Nadu	Chennai	India	600089
101	106	F1 Plot No 3 Flat No 3  Valmeiki Street	New Perungalathur	Chennai	Tamil Nadu	Chennai	India	600063	f	\N	\N	\N	\N	\N	Unknown	\N
128	133	22-432/ep, Road No. 7, Phase 1, Vinayaka Hills	Almasguda	Rangareddy	Telangana	Rangareddy	India	500058	t	22-432/ep, Road No. 7, Phase 1, Vinayaka Hills	Almasguda	Rangareddy	Telangana	Rangareddy	India	500058
129	134	22-432/EP, Road No 7, Phase1, Vinayaka Hills,	Almasguda	Rangareddy	Telangana	Rangareddy	India	500058	t	22-432/EP, Road No 7, Phase1, Vinayaka Hills,	Almasguda	Rangareddy	Telangana	Rangareddy	India	500058
130	135	16 Bala Ambookan Nagar, Pallikaranai	Near saibaba temple	Chennai	Tamil Nadu	Chennai	India	600100	t	16 Bala Ambookan Nagar, Pallikaranai	Near saibaba temple	Chennai	Tamil Nadu	Chennai	India	600100
131	136	no.9/10 , 5th cross street, murugan nagar,thiruverkadu-77	\N	Tiruvallur	Tamil Nadu	Tiruvallur	India	600077	t	no.9/10 , 5th cross street, murugan nagar,thiruverkadu-77	\N	Tiruvallur	Tamil Nadu	Tiruvallur	India	600077
132	137	No.9/10, 5th cross street, murugan nagar ,Thiruverkadu-77	\N	Chennai	Tamil Nadu	Chennai	India	600077	f	\N	\N	\N	Tamil Nadu	\N	India	\N
133	138	No.6,S1,Ak Platinum,1st Cross Anadan street,	Thiruvalluvar Nagar, Pammal, Chennai	Chennai	Tamil Nadu	Chennai	India	600075	t	No.6,S1,Ak Platinum,1st Cross Anadan street,	Thiruvalluvar Nagar, Pammal, Chennai	Chennai	Tamil Nadu	Chennai	India	600075
134	139	42/57,Vepery High Road  Block-1, 2nd Floor	2F, Shatrunjay Apartment Vepery	Chennai	Tamil Nadu	Chennai	India	600007	t	42/57,Vepery High Road  Block-1, 2nd Floor	2F, Shatrunjay Apartment Vepery	Chennai	Tamil Nadu	Chennai	India	600007
135	140	102 PEARL BLOCK, ALLIANCE ORCHID SPRINGSS,	\N	Chennai	Tamil Nadu	Chennai	India	600076	f	54/965 SUMIT VIHAR COLONY,	DANGANIYA	Raipur	Chhattisgarh	Raipur	India	492013
136	141	3/141,24B, TREND CITY, PHASE-1, CHINTHANAPALLI VILLAGE, HOSUR	\N	Hosur	Tamil Nadu	Krishnagiri	India	635109	t	3/141,24B, TREND CITY, PHASE-1, CHINTHANAPALLI VILLAGE, HOSUR	\N	Hosur	Tamil Nadu	Krishnagiri	India	635109
137	142	6-21/2 MBN Gardens, H.P Road kuppam	Opp. to Old sub-regiater office	Kuppam	Andhra Pradesh	Chittoor	India	517425	t	6-21/2 MBN Gardens, H.P Road kuppam	Opp. to Old sub-regiater office	Kuppam	Andhra Pradesh	Chittoor	India	517425
138	143	3-164, Mutharasipalem street, SBR Puram, Vadamalpet Mandal, Tirupati District 517571	\N	Tirupati	Andhra Pradesh	Chittoor	India	517571	t	3-164, Mutharasipalem street, SBR Puram, Vadamalpet Mandal, Tirupati District 517571	\N	Tirupati	Andhra Pradesh	Chittoor	India	517571
139	144	116, 3rd block, Alliance Orchid Springss,	Water Canal Road, Korattur, Chennai	Chennai	Tamil Nadu	Chennai	India	600080	t	116, 3rd block, Alliance Orchid Springss,	Water Canal Road, Korattur, Chennai	Chennai	Tamil Nadu	Chennai	India	600080
143	148	60A Arokiya madha nagar 2nd Street Littlemount	\N	Chennai	Tamil Nadu	Chennai	India	600015	t	60A Arokiya madha nagar 2nd Street Littlemount	\N	Chennai	Tamil Nadu	Chennai	India	600015
144	149	8-344	Srinagar Colony, Angalakuduru	Guntur	Andhra Pradesh	Guntur	India	522211	t	8-344	Srinagar Colony, Angalakuduru	Guntur	Andhra Pradesh	Guntur	India	522211
146	151	No 3E Malaipettai, Karunkuzi, Chengalpattu	\N	Chengalpattu	Tamil Nadu	Kanchipuram	India	603303	t	No 3E Malaipettai, Karunkuzi, Chengalpattu	\N	Chengalpattu	Tamil Nadu	Kanchipuram	India	603303
151	156	99, Thendral nagar,	4th Street, Sulur	Coimbatore	Tamil Nadu	Coimbatore	India	641402	t	99, Thendral nagar,	4th Street, Sulur	Coimbatore	Tamil Nadu	Coimbatore	India	641402
153	158	08/01,Type-2 , OCF Quarters, Giri nagar	\N	Avadi	Tamil Nadu	Tiruvallur	India	600054	t	08/01,Type-2 , OCF Quarters, Giri nagar	\N	Avadi	Tamil Nadu	Tiruvallur	India	600054
154	159	Vishnu nivas	no,1 Tollgate	Tiruchirappalli	Tamil Nadu	Tiruchirappalli	India	621216	t	Vishnu nivas	no,1 Tollgate	Tiruchirappalli	Tamil Nadu	Tiruchirappalli	India	621216
156	161	No 140 tsunami street	Panichamedu	Villupuram	Tamil Nadu	Viluppuram	India	604303	t	No 140 tsunami street	Panichamedu	Villupuram	Tamil Nadu	Viluppuram	India	604303
164	171	Plot 3 and 4 5C 5th Floor Thai Partha Parthasaradhi Nagar Adambakkam	\N	Chennai	Tamil Nadu	Chennai	India	600088	t	Plot 3 and 4 5C 5th Floor Thai Partha Parthasaradhi Nagar Adambakkam	\N	Chennai	Tamil Nadu	Chennai	India	600088
165	172	#4A, Iyra Aadya, Devaraj Nagar	Arihant Road, Thoraipakkam	Chennai	Tamil Nadu	Chennai	India	600097	t	#4A, Iyra Aadya, Devaraj Nagar	Arihant Road, Thoraipakkam	Chennai	Tamil Nadu	Chennai	India	600097
166	173	No, 56, Hari Shiva flats	TNEB Colony	Chennai	Tamil Nadu	Chennai	India	600053	t	No, 56, Hari Shiva flats	TNEB Colony	Chennai	Tamil Nadu	Chennai	India	600053
167	174	403, Donata bliss, Owners court west, Kasavanahalli,	Bangalore	Bengaluru	Karnataka	Bengaluru Urban	India	560035	t	403, Donata bliss, Owners court west, Kasavanahalli,	Bangalore	Bengaluru	Karnataka	Bengaluru Urban	India	560035
168	175	Prince Highlands 5B 704	1/350 Mount Poonamallee Road Iyyappanthangal	Chennai	Tamil Nadu	Chennai	India	600056	t	Prince Highlands 5B 704	1/350 Mount Poonamallee Road Iyyappanthangal	Chennai	Tamil Nadu	Chennai	India	600056
169	176	46,kalpaga nagar, 4th street, padiyanallur, redhills,Chennai, Tamil Nadu, India	\N	Chennai	Tamil Nadu	Chennai	India	600052	t	46,kalpaga nagar, 4th street, padiyanallur, redhills,Chennai, Tamil Nadu, India	\N	Chennai	Tamil Nadu	Chennai	India	600052
172	179	No. 58/106, Vellala street	Ayanavaram, Chennai	Chennai	Tamil Nadu	Chennai	India	600023	t	No. 58/106, Vellala street	Ayanavaram, Chennai	Chennai	Tamil Nadu	Chennai	India	600023
173	180	C-21 , Welder street	Block -18 , Neyveli	Virudhachalam	Tamil Nadu	Cuddalore	India	607803	t	C-21 , Welder street	Block -18 , Neyveli	Virudhachalam	Tamil Nadu	Cuddalore	India	607803
\.


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alembic_version (version_num) FROM stdin;
d3a5c7e91f44
\.


--
-- Data for Name: api_keys; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.api_keys (id, client_name, api_key, status, created_at, updated_at, expires_at) FROM stdin;
\.


--
-- Data for Name: application_fees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.application_fees (id, payment_id) FROM stdin;
10	35
11	37
12	39
13	41
14	43
15	45
16	47
17	49
19	53
20	55
21	57
22	59
23	60
24	62
25	64
26	66
27	68
28	70
29	72
30	74
31	76
32	78
33	80
35	84
36	86
37	88
38	90
39	92
40	94
41	96
42	98
43	100
44	102
45	104
46	106
47	108
48	110
49	112
50	114
51	116
52	118
53	120
54	122
55	124
56	126
57	128
58	130
59	132
60	134
61	136
62	138
63	140
64	142
65	144
66	146
67	148
68	150
69	152
70	154
71	156
72	158
73	160
74	162
75	164
76	166
77	168
78	170
79	172
80	174
81	176
82	179
83	181
84	183
85	185
86	187
87	189
88	191
89	193
90	195
91	197
92	199
93	201
94	203
95	205
96	207
97	209
98	211
99	213
100	215
101	217
102	219
103	221
104	223
105	225
106	227
107	229
108	231
109	233
110	235
111	237
112	239
113	241
114	243
115	245
116	247
117	249
118	251
119	253
120	255
124	263
125	265
127	269
132	279
134	283
135	285
137	289
145	305
146	307
147	309
148	311
149	313
150	315
153	321
154	323
\.


--
-- Data for Name: batches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.batches (id, academic_year_id, batch_number, batch_name, start_month, end_month, is_active, description, created_at, updated_at) FROM stdin;
1	1	1	Batch 1 (July-Dec)	7	12	t	First batch: July to December 2025	2026-03-27 06:13:51.124462	2026-03-27 06:13:51.124469
2	1	2	Batch 2 (Jan-Jun)	1	6	t	Second batch: January to June 2026	2026-03-27 06:13:51.124473	2026-03-27 06:13:51.124475
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: city; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.city (id, city_name, state_id) FROM stdin;
\.


--
-- Data for Name: countries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.countries (id, name, country_code, phone_code) FROM stdin;
101	India	356	91
\.


--
-- Data for Name: course_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.course_category (id, name, created_at, updated_at) FROM stdin;
1	CT9	2026-01-05 08:44:01.58	2026-01-05 08:44:01.58
\.


--
-- Data for Name: course_code; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.course_code (id, code, created_at, updated_at) FROM stdin;
1	MTH24OCT03	2026-01-05 08:44:01.58	2026-01-05 08:44:01.58
\.


--
-- Data for Name: course_components; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.course_components (id, course_id, component_no, component_type, component_code, component_description, max_marks, min_marks, min_percentage, exam_mark, is_theory, is_practical, is_ia, is_computed, computed_components, is_others, specify_others, core_or_elective, is_programme_elective, elective_type, elective_programe_type, attendence_percentage, book_type, mcq_time, is_tpi, incl_credit, techorder, approved, is_maincode, created_at, updated_at) FROM stdin;
1	1	1	CIA	MTH24OCT01	MATHEMATICS	30	0	0	0	f	f	t	f	{0}	f	string	Core	f	string	string	0	string	string	string	t	0	f	t	2026-02-07 10:20:28.257033	2026-02-07 10:20:28.257045
2	1	1	ESE	MTH24OCT01	MATHEMATICS	70	35	50	100	t	f	f	f	{0}	f	string	string	f	string	string	75	string	string	string	t	0	f	t	2026-02-13 10:00:13.836224	2026-02-13 10:00:13.836228
\.


--
-- Data for Name: course_results; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.course_results (id, student_id, exam_id, course_id, total_marks, result_status, percentage, grade, grade_point, result_version, computed_at, created_at, updated_at, component_id) FROM stdin;
1	29	1	1	75	PASS	75	A	8	1	2026-02-13 10:14:35.795177	2026-02-13 10:14:35.799893	2026-02-13 10:14:35.799909	1
\.


--
-- Data for Name: course_title; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.course_title (id, title, created_at, updated_at) FROM stdin;
1	Discreate Mathematics	2026-01-05 08:44:01.58	2026-01-05 08:44:01.58
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courses (id, semester_id, dept_code, main_code, main_course, course_order, course_type, course_code, course_title, credits, regulation_pattern, created_at, updated_at) FROM stdin;
1	1	mth	mth01	mth01	1	ct	mth01	maths	3	2025	2026-02-07 10:19:48.93409	2026-02-07 10:19:48.934097
\.


--
-- Data for Name: deb_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.deb_details (id, student_id, deb_id, deb_name, deb_gender, deb_date_of_birth, deb_university, deb_program, deb_abcid, deb_details_1, deb_details_2, deb_details_3, deb_details_4, deb_details_5, deb_details_6, deb_details_7, deb_details_8, deb_details_9, deb_details_10, deb_details_11, deb_details_12, deb_details_13, deb_details_14, deb_details_15, deb_status) FROM stdin;
28	30	082502990589	Leena Pavitha P	F	28/08/1993	\N	\N	601599845755	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Success
29	31	082503014252	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Failed
31	33	082503087698	ABISHEK KUMARAN BALAJI	Male	07/11/2005	\N	\N	618114525529	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Success
32	34	082503196013	Adhithya N S G	Male	01/12/2004	\N	\N	326462710092	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Success
33	35	092503389696	Manimekalai N	Female	01/06/1985	\N	\N	644827974230	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Success
35	37	092503408680	T ASWIN	Male	21/06/2006	\N	\N	149951282698	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Success
34	36	092503465391	Ramkumar	Male	25/12/1982	\N	\N	300148436977	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Success
30	32	082503016911	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Failed
37	39	092503466700	Praveen M	Male	15/04/2000	\N	\N	673575700383	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Success
38	42	082503263246	Ansar Ahammed P V	Male	28/05/1981	\N	\N	612886725287	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Success
39	43	092503776867	PRATHYUSH A	Male	01/09/2006	\N	\N	478987400527	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Success
40	45	092503742764	M. Janiksha	Female	23/06/2005	\N	\N	961407964972	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Success
41	46	092503839032	Akshaya N	Female	17/05/2007	\N	\N	827135120076	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Success
42	47	092503799414	Prayag S	Male	28/12/2006	\N	\N	460061332054	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Success
43	48	092503820803	Rhushikesh Omprakash Rai	Male	17/04/2003	\N	\N	880241609304	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Success
44	49	092503850821	Jayasriman M	Male	08/08/2006	\N	\N	352964869118	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Success
45	50	072502406210	Safrin A	Female	28/03/2006	\N	\N	193206112144	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Success
27	29	072502723572	Jeswin Luckas Antony Samy	Male	11/04/2006	\N	\N	998454417423	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Success
46	51	082502993437	PAWANKUMAR PURSHOTTAM MOTWANI	Male	07/06/1987	U-0104	\N	572151729479	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Success
47	52	092503615708	Aisha Siddika	Female	21/03/2003	\N	\N	810790305546	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Success
48	53	092503789065	Murshidha Sheerin Iqbal	Female	27/12/2002	\N	\N	854208954194	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Success
49	54	102503917294	Yeluri Hema Sindhu	Female	08/07/2005	\N	\N	212730794902	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Success
50	55	102504039731	Navneet Sharma	Female	10/03/2000	\N	\N	643362895541	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Success
51	56	092503705030	owaiz mohd shakeel Shaikh	Male	03/02/2004	\N	\N	838271040053	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Success
53	58		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
54	59		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Failed
55	60		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
56	61	797453073055	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
57	62		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
58	63		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
59	64		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Failed
60	65		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
61	66		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
62	67		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
63	68		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
64	69		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
65	70		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
66	71		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
67	72		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
68	73		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
69	74		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
70	75		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
71	76		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
72	77		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
73	78		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
74	79		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
75	80		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
76	81		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
77	82		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
78	83		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
79	84		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
80	85		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
81	86	112504055283	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Failed
82	87		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
83	88		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
84	89		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
85	90		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
86	91		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
87	92		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
88	93		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
89	94		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
90	95		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
91	96		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
92	97		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Failed
93	98		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
94	99		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
95	100		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
96	101		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
97	102		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Failed
98	103		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
99	104		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
100	106		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
101	107		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
102	108		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
103	109		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
104	110		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
105	111		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
106	112		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
107	113		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
108	114		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
109	115		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
110	116		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
111	117		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
112	118		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
113	119		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
114	120		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
115	121		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
116	122		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
117	123		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
118	124		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
119	125		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
120	126		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
121	127		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
122	128		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
123	129		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
124	130		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
125	131		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
126	132	112504045905	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Failed
127	133		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
128	134		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
129	135		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
130	136		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
131	137		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
132	138		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
133	139		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
134	140		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
135	141		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
136	142		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
137	143		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
138	144		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
142	148	022604228697	Jean Sophiya Shiny	Female	07/07/1990	\N	\N	796535150758	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Success
143	149	102400588409	Devineni Srinivasa Chowdary	Male	01/07/1975	\N	\N	117417917639	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Success
145	151		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
150	156	022604206562	Uthayakumar G	Male	09/10/1990	\N	\N	872830693433	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Success
152	158	012604183434	Prabaharan Dinesh Kumar	Male	31/03/2003	\N	\N	261910859109	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Success
153	159		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
155	161	012604192424	Chinnamani S	Male	02/05/1992	\N	\N	132778531852	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Success
163	171		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
164	172		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
165	173		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
166	174		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
167	175		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
168	176		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
171	179		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
172	180	112504049351	Archana E	Female	04/03/2007	\N	\N	407201257247	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Success
\.


--
-- Data for Name: declaration_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.declaration_details (id, student_id, declaration_agreed, applicant_name, parent_name, declaration_date, place) FROM stdin;
27	29	t	Jeswin L	Luckas Antony Samy	2025-07-23	Sivaganga
28	30	t	Dr Leena Pavitha	\N	2025-08-05	Chennai
29	31	t	Kaushal Shanker	DR.Hemalatha Shanker	2025-08-07	chennai
30	32	t	mohammed afrid azami	mohammed kaifi azami	2025-08-07	chennai
31	33	t	Abishek Kumaran Balaji	Balaji D	2025-08-12	Chennai
32	34	t	Adhithya N. S. G.	GANESHMOORTHY N S	2025-08-17	CHENNAI
33	35	t	Manimekalai Narayanan	NarayananV	2025-08-31	Chennai
34	36	t	Ramkumar Santhanakrishnan	Santhanakrishnan	2025-08-28	Bangalore
35	37	t	Aswin T	T VASANTHI	2025-08-31	TIRUCHIRAPALLI
37	39	t	PRAVEEN M	S.Murugan	2025-09-02	Tirunelveli
38	42	t	Ansar Ahammed P V	Saithu mohammed PV	2025-09-11	Feroke
39	43	t	Prathyush Ayyappan	Ayyappan J	2025-09-23	Chennai
40	45	t	JANIKSHA M	MANOHAR M	2025-09-19	CHENNAI
41	46	t	N. Akshaya	R. Nanda Kumar	2025-10-02	Chennai
42	47	t	S. Prayag	R. Sriram	2025-09-25	Chennai
43	48	t	Rhushikesh Omprakash Rai	Anita Rai	2025-09-27	Mumbai
44	49	t	Jayasriman M	MARIMUTHU K	2025-09-29	chennai
45	50	t	Safrin A	Nabisal begam	2025-10-02	Mudaliyarpatti tenkasi
46	51	t	PAWANKUMAR MOTWANI	\N	2025-10-07	PUNE
47	52	t	Aisha Siddika A	Akbar Ali	2025-09-22	Pollachi
48	53	t	Murshidha Sheerin	Iqbal	2025-09-17	Pollachi
49	54	t	Yeluri hema sindhu	Suresh Babu	2025-10-07	Guntur
50	55	t	Navneet Sharma	Rajesh Kumar	2025-10-12	Punjab
51	56	t	Shaikh owaiz	Zahida Shaikh	2025-09-15	Mumbai
53	58	t	Srinedhe Gopalakrishnan srinedhe	V Gopalakrishnan	2025-12-07	Cuddalore
54	59	t	Ismayil Kaniyam Parambil	Mohammedunni Haji	2025-09-21	Kerala
55	60	t	Anandababu Narayanan	Narayanan	2025-12-02	Hosur
56	61	t	Pradheep Duraimani	Duraimani	2025-10-09	Colachel
57	62	t	A.K. SAHABAR SATHIK	K.M.A KAMARUDEEN	2025-10-24	CHENNAI
58	63	t	SURESH AJISTON GEORGE	GEORGE	2025-10-28	QATAR
59	64	t	Pavan Kumar KL	Lakshminarayana K	2025-10-31	Bangalore
60	65	t	Bhavani L	Lakshmisha MS	2025-11-08	Malur
61	66	t	Rachel Deepthi	Gunasekhar	2025-12-21	Chennai
62	67	t	Dr Kiran .Adabala	Late Shri. Krishna Mohan. Adabala	2025-11-07	Secunderabad
63	68	t	Waseem Hussain Syed	Anwar Hussain Syed	2025-11-06	Hyderabad
64	69	t	Dr. Syed Asif Hussain	Syed Anwar hussain	2025-11-07	Hyderabad
65	70	t	Dr. Shubhangi Hanumant	Mr. Hanumant Gade	2025-11-08	Pune
66	71	t	O.V.Venkataragavan Venkatasubramaniam	Venkata Subramaniam	2025-12-15	Chennai
67	72	t	Naresh Suresh	Suresh Fadte	2025-11-10	Goa
68	73	t	P.R.Vetha Vikasini	Pattabiraman	2025-11-17	Chennai
69	74	t	Venkat shreyas	Sakthi	2025-11-14	Rajahmundry
70	75	t	Priya T	Thamilselvan. H	2025-11-25	Gummidipoondi
71	76	t	Shobana M	Bhavani mari	2025-11-19	Chennai
72	77	t	Sevvanthi S	Sundaram	2025-11-14	Kanchipuram
73	78	t	shiny achariya	G.ebinesar priyakumar	2025-11-14	chennai
74	79	t	Jayashree K	MOHANAMBAL .N	2025-11-17	VANIYAMBADI
75	80	t	J.Venkataramanan .	K.Jagannathan	2025-11-20	Chennai
76	81	t	Ajith kumar Logaiyan	Logaiyan V	2025-12-09	Chennai
77	82	t	Malathi R	K RAJENDRAN	2025-11-27	SENNEERKUPPAM, POONAMALLEE
78	83	t	S R ANANTHAVALLI	C RAVI	2025-11-27	MANGADU
79	84	t	HARISH KUMAR M	MEENAKSHI M	2025-11-17	CHENNAI
80	85	t	DHANUSH KUMAR	Muthukumar	2025-11-17	Hosur
81	86	t	Vikram Mohan	\N	2025-11-19	Kuwait
82	87	t	Geo Mathew Pius	\N	2025-11-27	Doha, Qatar
83	88	t	Shajitha Banu	Akbar H	2025-11-18	Chennai
84	89	t	Perumal .M	Manimegalai M	2025-11-24	Chennai
85	90	t	Shrikala A	\N	2025-11-24	Chennai
86	91	t	Ranjini Ashok	Ashok Kumar K	2025-11-21	Thrissur
87	92	t	Syed Afroz	S Shah Hussain	2025-11-22	Anantapur
88	93	t	Mythily T	Thandapani	2025-12-06	Poonamallee
89	94	t	Sreedhar Yadlapati	Y VIJAYA LAKSHMI	2025-12-08	TENALI
90	95	t	Shyamala KUMAR	shyamala	2025-12-14	chromepet
91	96	t	Karthiga M	\N	2025-11-24	Chennai
92	97	t	Karuppiah A	Alakesan	2025-11-25	Muthuramalingapuram
93	98	t	Joseph M A	M I Augustine	2025-12-10	Kochi
94	99	t	Varsha Sundararajan	\N	2025-12-21	CHENNAI
95	100	t	Divya Bala krishnan	Bala Krishnan	2025-11-27	Vellore
96	101	t	Dilip Kapse	\N	2025-11-27	Panvel
97	102	t	Varshini V	Vengatesan S	2025-11-27	Chennai, Tamil Nadu
98	103	t	GUNASUNDARI .s	Asaithambi	2025-11-30	Madurai
99	104	t	Deepak Prakash	THANGAMANI	2025-12-02	Tambaram
100	106	t	Arunkannan Sargunam	A. Sargunam	2025-12-05	Chennai
101	107	t	Anuja Rani Sasidharan	Sasidharan V	2025-12-16	Chennai
102	108	t	Patel Pritiben shaileshbhai	Shaileshbhai K Patel	2025-12-01	Killa-Pardi
103	109	t	KARTHIK.S .	\N	2025-12-01	Chennai
104	110	t	Rakup Suresh Kumar	R NagaRaju	2025-12-25	Naidupet
105	111	t	Amreen Fathima	Abdul Rasheed S	2025-12-03	Chennai
106	112	t	DeviPriya M	Murugasan P	2025-12-04	Chennai
107	113	t	praveena Selvaraj	Arun Prasand	2025-12-05	chengalpattu
108	114	t	P.R.Gethareswari .	Parimelazhakar raja D	2025-12-09	Chennai
109	115	t	Lakshmi Kiran	\N	2025-12-04	Hyderabad
110	116	t	SURIYA SRE VS	VijayaSuresh	2025-12-14	Chennai
111	117	t	Reshma.E .	Ellappan	2025-12-10	Chennai
112	118	t	Sruthi Babu	Babu N	2025-12-06	Chennai
113	119	t	Kumudavikasri Srinivasan	Srinivasan	2025-12-10	Chennai
114	120	t	Raghana Shridhar	P R Shridhar	2025-12-10	Chennai
115	121	t	Subhendu Mohanty	Subodh Kumar Mohanty	2025-12-14	Mumbai
116	122	t	Leena Nair	\N	2025-12-09	Palakkad, Kerala
117	123	t	SASANKA SEKHAR DASH	\N	2025-12-12	Cuttack
118	124	t	Kavitha Rajaram	V.RAJARAM	2025-12-13	CHENNAI
119	125	t	GANESH KUMAR Subramani	Subramani	2025-12-15	Kuwait
120	126	t	Vasanthi S	Srinivasan R	2025-12-15	Chennai
121	127	t	YEDIDI SAMYUKTA	YEDIDI VENKATESWARA RAO	2025-12-22	CHENNAI
122	128	t	Bhuvanesswari S	\N	2025-12-17	chennai
123	129	t	Dr. Mounika Buduru	Sreenivasa Prasad Buduru	2025-12-18	Delhi
124	130	t	Arun Joie SJ	V Suyanmbulingam	2025-12-19	Chennai
125	131	t	Balamurugan K	\N	2025-12-22	Nagapattinam
126	132	t	Kanimozhi Murugavel	Sathya Murugavel	2025-10-26	Chennai
127	133	t	Dr. K. Shashidhar	K. Kedari	2025-11-22	Hyderabad
128	134	t	BETHI NAVYA	Bethi Amaravathi	2025-11-24	Warangal
129	135	t	Padmavathy T	M. Thiruvendharan	2025-12-23	Chennai
130	136	t	VINITHKUMAR M	R .MANOKAR	2025-12-07	Chennai
131	137	t	KERAN PRISKILLA J	ROSEY J	2025-12-08	Chennai
132	138	t	Malasree N	\N	2025-12-23	Chennai
133	139	t	Monika Choraria	Ratan Kumar Shyamsukha	2025-12-30	Chennai
134	140	t	SADHNA VERMA	\N	2025-12-22	Chennai
135	141	t	Mohanraj Chandrababu	Chandrababu M	2026-01-01	Hosur
136	142	t	Gowthaman Kumar	\N	2025-12-26	Tirupattur
137	143	t	Mahesh Kurella	\N	2026-01-02	Puttur
138	144	t	Aarthi Sathyaraj	\N	2026-01-01	Chennai
142	148	t	Jean sophiya shiny	J DEVA SARGUNA DOSS	2026-02-11	CHENNAI
143	149	t	Srinivasa Chowdary D	\N	2026-02-12	Angalakuduru
145	151	t	MOHAMMED SARFUDDEEN N	NAZAR	2026-01-29	CHENGALPATTU
150	156	t	Uthayakumar G	\N	2026-02-01	Coimbatore
152	158	t	Prabaharan Dinesh Kumar	Prabaharan Gnana Sundari	2025-12-25	Avadi, Chennai -600054
153	159	t	Ravi Ravichandran Natesan	Natesan	2026-02-13	Trichy
155	161	t	CHINNAMANI SELVAM	SELVAM	2025-10-21	Villupuram
163	171	t	Mrudula V Raman	Venkatraman C	2026-02-19	Chennai, Tamil Nadu
164	172	t	Caroline Karunya M	\N	2026-02-03	Chennai
165	173	t	Keerthana Ramesh	Sri Vidhya Ramesh	2026-02-04	Chennai
166	174	t	Ranjith Thavarul puthiyedath	A K Balakrishnan	2026-01-31	Bangalore
167	175	t	Kaushik Venkateswar KV	K V VARADARAJAN	2026-02-06	CHENNAI
168	176	t	Shanmugapriya Rajaelangovan	T Prema	2026-01-19	Chennai
171	179	t	Kaaviya gadi	Rupa kumar gadi	2026-02-17	Chennai
172	180	t	Archana. E	Elangovan. S	2026-01-07	Neyveli
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departments (id, name) FROM stdin;
1	data sciiences
\.


--
-- Data for Name: district; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.district (id, district_name, state_id) FROM stdin;
\.


--
-- Data for Name: document_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.document_details (id, student_id, class_10th_marksheet, class_12th_marksheet, graduation_marksheet, diploma_marksheet, work_experience_certificates, passport, aadhar, signature, profile_image) FROM stdin;
136	142	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226034/class_10th_marksheet_7b3a571e-022b-479c-a66b-99e75314b354.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226034/class_12th_marksheet_d206e4eb-fd1f-471f-8c41-33c6d4cf0e21.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226034/graduation_marksheet_b4341155-c50a-411b-9b74-985a83adf277.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226034/work_experience_certificates_bffff01f-eccd-4ee9-b8bd-ee02bb4ae42f.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226034/aadhar_ac1f8532-e1f4-41ba-847e-c0685f170aa2.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226034/signature_c0bc9096-14aa-44aa-9786-68aacf4fda70.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226034/profile_image_9dd3d3ac-c664-44e5-81b2-e17e7d11253a.jpg}
153	159	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0225002/class_10th_marksheet_0cd20658-0f71-4547-b853-1d861ef33abf.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0225002/class_12th_marksheet_5e9e6413-bd5a-4868-8b99-b399de371ac8.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0225002/graduation_marksheet_256fbd09-4afa-4d44-bb40-b6eb63f5b827.pdf,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0225002/graduation_marksheet_f4361de7-2eb9-4540-b63e-91737f2e1dcb.PDF}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0225002/work_experience_certificates_a68eccdf-fa59-4ab7-9513-8dc321198d48.pdf,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0225002/work_experience_certificates_63744107-074d-498c-94bc-8d0c120d0f9a.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0225002/aadhar_195dcfcd-d2c2-46b0-b4df-527e0610aee6.JPG}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0225002/signature_6aec3399-33f3-4ba6-ae10-841966701c71.png}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0225002/profile_image_17326613-b1f1-4b19-9b52-54ff29df2133.PNG}
63	68	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226009/class_10th_marksheet_f122fbde-f80f-4689-8461-cd45fc64ce67.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226009/class_12th_marksheet_50ab465b-c31c-44e5-8b6d-01dc59994a9f.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226009/graduation_marksheet_4d39a4c0-0550-402d-a664-19880f474e48.jpeg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226009/graduation_marksheet_5f68d34b-bbdd-4e11-889a-5cd7c77f3024.jpeg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226009/graduation_marksheet_7cb08831-6ab5-48d7-908f-0a2fc57299ce.jpeg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226009/graduation_marksheet_12fef469-0675-43e3-aa44-d1ab06b97ed1.jpeg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226009/graduation_marksheet_0d4f1d7c-28d2-4397-b121-bb19ae30968b.jpeg}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226009/aadhar_a362a075-1291-46d5-a645-583e18033e34.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226009/signature_60bb4088-33e1-4eeb-b68c-5054a68d2127.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226009/profile_image_1dabc3ab-a586-4b65-87d5-3f976ccd54b2.jpeg}
27	29	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525001/class_10th_marksheet_80b03af1-948a-4633-be1c-96a31dca4e0c.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525001/class_12th_marksheet_165aea46-09d0-46fc-bc02-60e9939b757d.jpg}	\N	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525001/aadhar_25b39764-bf36-4205-b610-771f13a7da7f.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525001/signature_8b262887-b0c8-4a8a-8d93-76b2c1b934e3.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525001/profile_image_9366ba9c-b0d6-4f31-a08e-e02f12b8490b.jpg}
46	51	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525019/class_10th_marksheet_1ff8d5aa-a54d-4ef8-9414-f8fcac5abf96.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525019/class_12th_marksheet_e646f1d8-8858-411d-8354-71724acfbcaa.jpg}	\N	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525019/aadhar_b7b26f33-bd05-4ba7-a70c-5e5ceff67730.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525019/signature_631bb0ac-a92b-4b92-8c92-ec4cc25cf974.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525019/profile_image_96f44ab6-3926-47aa-9a8e-f1d511abc1e5.JPG}
138	144	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326051/class_10th_marksheet_b1d519c7-19d8-4cc1-8fdf-b19fc33b6197.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326051/class_12th_marksheet_56359e60-f3cf-4eea-9a9d-2ae28a0be207.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326051/graduation_marksheet_2bfee9d2-31c7-4936-9940-1ff452fa0961.pdf}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326051/aadhar_29b1ad34-3215-4d01-91f5-a090d2fe673d.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326051/signature_c7f898a9-011c-49a8-a1d7-38b9b1f59ba7.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326051/profile_image_a54bde69-f500-4d17-a9ac-aec050721711.jpg}
135	141	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326049/class_10th_marksheet_222886a1-0c3c-40e4-815d-74820592f1de.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326049/class_12th_marksheet_51f6af8b-6967-429c-814e-d7d5bf060314.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326049/graduation_marksheet_ebe28175-2fb7-4e8f-b4b4-e28f648c88fe.pdf,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326049/graduation_marksheet_4abbfe57-8c47-4bfb-a143-0ec0cefb1705.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326049/work_experience_certificates_6af6d31b-6ea7-423b-927c-dc499639fd3d.jpg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326049/aadhar_58cc2d71-e3cb-422f-8974-b706e1931b01.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326049/signature_833bdc05-9ee1-4b78-bc1d-9b762abbac73.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326049/profile_image_0033887f-5dae-4bb4-8706-06eb306c7fb6.png}
61	66	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326002/class_10th_marksheet_4cd42880-7258-4898-a5bf-43fb885a900e.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326002/class_12th_marksheet_dd461d71-3656-499d-95ad-608fc5abf83a.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326002/graduation_marksheet_d7c60809-0a24-49c8-ad75-ab6d26b7c03c.jpg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326002/work_experience_certificates_853a8a16-40ca-49c3-9a3a-2d2e2b4f98f2.pdf,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326002/work_experience_certificates_3cc0acae-4dae-4710-a74f-931f4300d50f.jpg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326002/aadhar_fc1e7963-d9f0-40e1-b0e1-cdbd542f80b3.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326002/signature_a8d37cfb-d102-4322-8986-e22d063f94be.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326002/profile_image_f58e9fe6-f7e0-4362-bd85-ef07f28e7fb8.jpg}
39	43	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525012/class_10th_marksheet_70523fe7-a501-47c2-b60a-a41e57f4781a.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525012/class_12th_marksheet_7a2fcacd-f0d2-4138-a1d9-41848ebb7801.pdf}	\N	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525012/aadhar_61397216-5801-4fad-9721-a39c63a0db90.png}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525012/signature_cc3921a8-c289-4814-af92-81d96dda9d41.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525012/profile_image_059fb584-cae6-40cd-af50-154101bdee93.jpg}
30	32	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525004/class_10th_marksheet_6d00fa46-976d-4bf8-8888-97d7e17588d9.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525004/class_12th_marksheet_7cc0cf76-326e-47a4-a29a-87d238c808f8.jpg}	\N	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525004/aadhar_0053a035-9840-424c-9fda-9f451bfa4238.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525004/signature_19e2898f-3711-4331-9c69-2b469f49453d.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525004/profile_image_4e12bd99-bc41-4f3a-af25-dd49b9bad408.jpg}
31	33	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525005/class_10th_marksheet_e51b90aa-594d-4f80-851a-66ba3e086ac2.png}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525005/class_12th_marksheet_1a7cd074-03f6-46f3-8cca-0d940f2f977a.png}	\N	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525005/aadhar_f63e16d8-a8fb-4972-a963-d0b3db7e3e2d.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525005/signature_803072d7-8c8d-4934-99a9-cf8a284ba014.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525005/profile_image_5e5173bb-ec3b-41ad-b1d6-e57d779798eb.jpg}
40	45	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525013/class_10th_marksheet_980cce29-78f5-4818-b99f-f5cb22710076.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525013/class_12th_marksheet_8080fced-c933-402d-b531-a6e4f7cdb800.pdf}	\N	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525013/aadhar_78089829-d0ac-483c-bb8f-b3f7175ce367.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525013/signature_a23fd4ab-d78d-48d2-98ca-4861604c0049.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525013/profile_image_ad254066-fa67-4c6c-a5a3-fd543008553b.jpg}
142	148	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525026/class_10th_marksheet_91825f73-e11f-47ff-a93e-0053e8143810.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525026/class_12th_marksheet_4a418370-eab9-40a4-8275-e71389aae699.jpg}	\N	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525026/aadhar_2433f903-4f88-4af1-8bc3-de2f98ae363b.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525026/signature_7ed00ef3-67b3-4e39-ba8d-2054c7d8f220.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525026/profile_image_93eb22e6-813d-4897-9e4f-d3a6a4dc1188.jpg}
132	138	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326047/class_10th_marksheet_4262bbe9-e1ad-427e-867e-cc2b70e12ae0.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326047/class_12th_marksheet_db5acd15-8cff-40e0-b71e-f46ee1371dc7.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326047/graduation_marksheet_ef6a7ffa-307e-474c-a49b-a8ab9b535c94.jpg}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326047/aadhar_4ff7edc0-4252-4936-bf46-4b8e28a1b104.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326047/signature_307c3a1c-0a25-480b-93be-75ffb9ef757e.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326047/profile_image_2d0e84b2-f408-43d3-bacc-496cc4afc8ee.jpg}
56	61	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226004/class_10th_marksheet_9dde5dd5-7ecd-4c8b-8161-25ae56c59612.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226004/class_12th_marksheet_7a31120b-18f8-4a35-abba-0a9ba55f7fab.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226004/graduation_marksheet_3bb71e89-48ec-4066-880c-484e53b0cfde.jpg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226004/graduation_marksheet_df9de40c-eada-44fa-ba4a-5c741c771e7e.jpg}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226004/aadhar_e0aa1e17-513a-4524-9570-5dd696d3aedf.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226004/signature_30f0bffd-2fb2-479f-8e2c-06bf6a3cc97f.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226004/profile_image_95f57ca4-aef9-46a0-9f45-81f5a42a57de.jpg}
42	47	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525015/class_10th_marksheet_94656d4f-a5c5-40a4-b8d9-ec1d2f0d7855.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525015/class_12th_marksheet_4527a07f-ac4e-42e5-9b4f-758e639d1860.pdf}	\N	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525015/aadhar_617735b6-019d-49e1-b138-5c266b8ee531.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525015/signature_57e677c8-da08-4ac6-8f37-9bd2b7df221c.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525015/profile_image_141f217c-dc37-47dc-a5d4-dc0f4e16e816.jpg}
143	149	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525027/class_10th_marksheet_ed7df860-0ded-40cd-b6e9-399f6798cf2b.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525027/class_12th_marksheet_2f5c71f4-c22e-43f4-9b7c-e1871c44c4a5.jpg}	\N	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525027/aadhar_d4f9be90-2fbe-447b-87e1-a1317b6c7d3c.png}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525027/signature_7a28fc48-7fb3-4535-89c9-05fd7d586a59.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525027/profile_image_03f81c58-99df-4611-839e-0d3da1dacebf.jpg}
72	77	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326006/class_10th_marksheet_f06090f5-68c7-407a-ac39-6e30e04331fc.PDF}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326006/class_12th_marksheet_dd703d89-d32e-49d7-aed6-d79efe8582c7.PDF}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326006/graduation_marksheet_8260f3b8-dc40-4774-a747-e505e2b80077.PDF}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326006/aadhar_7531167d-dff1-4255-9b10-1b4b985091b4.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326006/signature_cddc0a16-cc59-434f-b981-a8c470a0c856.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326006/profile_image_cd5fec19-dd7e-4893-8937-a05e1e3f5bb5.jpg}
55	60	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226003/class_10th_marksheet_38e870c9-8388-4f70-b622-4d401ae6957c.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226003/graduation_marksheet_d17f981d-1142-4aee-b829-01cfeebb71ca.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226003/diploma_marksheet_82ee8cb0-27c5-40af-82b9-7febeb152baa.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226003/work_experience_certificates_028ab66e-84a3-4692-959d-48686e493603.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226003/aadhar_6b29c202-c65b-4dc0-89d0-b2a6ac7ea870.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226003/signature_80664f84-a23d-4337-9c43-ba4cea54d576.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226003/profile_image_c8134c80-08a2-4591-a1e3-7500f18955a1.jpg}
57	62	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226005/class_10th_marksheet_4fc2fbb3-286d-4827-b120-bff9c6c9be23.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226005/class_12th_marksheet_70aa7b5e-a843-4d9d-aa2f-2a03b575db76.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226005/graduation_marksheet_1abc4612-e579-4b53-8377-f48add91f616.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226005/work_experience_certificates_cf015027-5b2a-4e58-bc3a-e2684bbc583d.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226005/aadhar_5649af2b-78c4-46e4-9033-f57d4ba9b526.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226005/signature_6d2650b6-18a2-48c2-8ef4-55ac0b9fd613.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226005/profile_image_1ae821a1-1a42-4a59-a7c1-aae1c908cb77.jpeg}
123	129	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326042/class_10th_marksheet_f61b9efe-aa87-4ffd-88e4-582c71f84270.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326042/class_12th_marksheet_dce0e709-5fb8-4f04-954f-7654bab0de27.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326042/graduation_marksheet_ce511567-3bea-4ae5-a0f6-6efc0f8556fb.pdf}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326042/aadhar_9d84f5d3-ffc0-4dc1-8439-988e51b0203d.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326042/signature_06b83940-f8d2-4221-98ba-713c65979526.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326042/profile_image_58538060-2709-4101-9c0e-de3068d10455.jpg}
97	102	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326021/class_10th_marksheet_11c6ab4a-caf2-41b2-88e2-5e4292eb00f9.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326021/class_12th_marksheet_6fb35a46-02ce-4cd7-a127-e819f3bb52b5.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326021/graduation_marksheet_e5188c7e-42fc-4812-b4cd-ab683216a4b4.pdf,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326021/graduation_marksheet_096c1b5a-97dd-4dbb-b122-203a943d370c.pdf,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326021/graduation_marksheet_315f8675-ef65-4916-91b0-abe4dd249bed.pdf}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326021/aadhar_6b2630ad-33b6-457e-aca9-0ac34852f99f.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326021/signature_cba264fd-81a5-449f-acc1-c90e6060f9f1.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326021/profile_image_155cc025-efca-4303-8ecc-bc2f12583958.jpeg}
129	135	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326044/class_10th_marksheet_4efe04ef-175a-4a4d-a84e-51669e653396.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326044/class_12th_marksheet_d32f767c-42ee-421c-bcef-bd6bf72bc0e9.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326044/graduation_marksheet_b6924a27-32b7-4e4d-8452-be05e80361be.jpg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326044/work_experience_certificates_564e9414-55c6-4996-8e26-c04b35220d55.jpg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326044/aadhar_62142ce6-ebce-42da-883c-534d32f3e895.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326044/signature_2ae17141-e9ae-45c5-a626-d3c2bcdf7f12.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326044/profile_image_75da676c-40e3-42b3-a0dc-b3fb4fb5f508.jpg}
29	31	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525003/class_10th_marksheet_ba3dda8f-fc8d-4c6b-a587-7d7647293815.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525003/class_12th_marksheet_bee705b2-063f-4bff-b742-e63d0eebb356.pdf}	\N	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525003/aadhar_fcebc757-d25d-46be-b3cf-4a909c392b58.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525003/signature_06e50dcb-c30f-4a18-a5e9-0ac254205444.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525003/profile_image_1ffde26d-1b1a-4b27-9de9-0c419f937088.jpg}
115	121	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226029/class_10th_marksheet_79177c99-b240-47ae-adf5-310dcbf856fb.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226029/class_12th_marksheet_afcd91a5-dbcd-4a3d-b3a2-7450af66750e.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226029/graduation_marksheet_2e201672-3530-4c5f-b7a3-407732f0edc2.jpeg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226029/work_experience_certificates_286a1f84-fbfb-4ea8-9442-6382e533721f.jpeg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226029/aadhar_28560e33-4aa3-4b33-b3a0-738d1d3cb624.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226029/signature_1b448630-5087-479a-a468-6abfa59a4a66.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226029/profile_image_0c3ea842-144f-4f72-b256-a109fa508398.jpeg}
107	113	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326027/class_10th_marksheet_7f0d1bff-872f-43be-a02b-392303e7ff08.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326027/class_12th_marksheet_affc61fb-56d3-4817-92cc-8bc978e6135c.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326027/graduation_marksheet_8ba184a9-2a66-439f-923a-479252c1accd.jpeg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326027/graduation_marksheet_2075cc27-687b-4993-9293-341aa56ddbbe.jpg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326027/work_experience_certificates_53d9cb85-cb4a-4e37-abc0-8808b50a3707.jpeg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326027/aadhar_a1013ecf-539b-4aef-a44c-c8cdeaa3c53a.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326027/signature_29856eaa-be3b-4222-988b-cf5dfee81e21.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326027/profile_image_c63e92c9-f28f-44c3-bf04-5f06ca576cd6.jpeg}
124	130	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326043/class_10th_marksheet_4e063abb-ace1-47c5-88c3-7b4900c7e837.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326043/class_12th_marksheet_4c153316-f87d-4cbc-a901-1740c09d8d81.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326043/graduation_marksheet_e867894f-5290-4290-bc54-7c79f5c0ebdc.jpg}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326043/aadhar_3274affa-ed6f-4a32-927b-1650bc5b3e22.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326043/signature_fa268ea6-406b-43dc-984b-cb794fa91522.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326043/profile_image_947c1deb-8c42-4aef-9e03-b529c497e214.jpeg}
130	136	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326045/class_10th_marksheet_ca4f3f8e-9554-474e-bbeb-1163ae5ed502.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326045/class_12th_marksheet_4277ee40-7940-4552-80a7-159aa38c6ab6.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326045/graduation_marksheet_35168ff7-c62d-464e-9fbb-f8eb7e3f8a73.jpeg}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326045/aadhar_e7c43d83-2525-4433-8679-0540afe8ddd9.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326045/signature_4533dd57-da3a-4e01-a72a-8a95e35c0601.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326045/profile_image_c44d2e3c-1426-407a-ad01-e0d5775ffdeb.jpeg}
99	104	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226025/class_10th_marksheet_b3f92cb9-1ae0-4348-94bb-fcb3a0cfed10.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226025/graduation_marksheet_ec8b4f07-37d1-4237-bf57-9cba694850fc.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226025/diploma_marksheet_837eacaa-dcfd-4faa-8db7-01aca5b16d7b.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226025/work_experience_certificates_77ec027d-1206-4ad3-8a49-9dab1bc91f6d.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226025/aadhar_7dc5af08-d4cd-4521-b228-3f45d274da98.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226025/signature_9fd90dbd-42ee-45cc-b27a-dd5508808670.png}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226025/profile_image_ff2f10dd-d534-49f1-87e4-7850d1deb571.JPG}
150	156	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525028/class_10th_marksheet_c41e6c16-481d-433d-9d76-7b2749c14646.jpg}	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525028/diploma_marksheet_bd019dab-ddf4-441d-b16d-7ba7c2f558c8.pdf}	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525028/aadhar_9f57242e-1a1e-489c-9590-c64263668f00.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525028/signature_23b882d7-6ab2-455c-9526-200eb7f03005.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525028/profile_image_e3b7feec-bdde-4b45-80f2-7584c36af8f7.jpeg}
111	117	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326031/class_10th_marksheet_a8f6ad96-0260-42d5-8e96-fa3a4047f53e.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326031/class_12th_marksheet_7929b15d-c7fa-4904-8290-ea5cd6415803.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326031/graduation_marksheet_6c82dc01-ae42-43bf-85ba-4e2301c06a68.jpeg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326031/graduation_marksheet_35e8a614-0791-40e6-9ccd-c1d888476c68.pdf}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326031/aadhar_de1a18bc-26b7-4aac-ad66-8455854961fe.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326031/signature_80c807e4-2775-433f-9472-4d6ab5e570a9.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326031/profile_image_5811ac03-3526-46b9-ad9c-9815b432decb.jpeg}
95	100	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326020/class_10th_marksheet_ab6c6abf-c049-493b-b1e4-b4a44380cc90.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326020/class_12th_marksheet_323e34e8-2c1e-477a-a1cf-607363855a75.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326020/graduation_marksheet_8ffc15cf-7bf6-4e4c-b382-0984144fbf4e.jpg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326020/graduation_marksheet_7bbf5924-ee63-48b2-9242-96c98a416a50.jpeg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326020/work_experience_certificates_032436c3-2258-491e-b653-7033d8a8a6c0.jpg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326020/aadhar_300a319f-6a1d-42c2-af2c-164106857d6b.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326020/signature_c5a97eed-85bc-4325-98d5-1f63aa7cd189.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326020/profile_image_f0038cec-60ae-4cb0-ad5c-6d9e0b4bd283.jpg}
128	134	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226032/class_10th_marksheet_ef39a40a-bedf-4206-bd23-ad7e0b24adc9.png}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226032/class_12th_marksheet_ac4a7800-6b58-4f68-86e2-c27fba8f03fd.png}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226032/graduation_marksheet_aac437a3-f6ee-4dec-9344-5b514493fbd2.png}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226032/aadhar_87c7ead8-d4f0-4808-ac01-04b1b44623a4.png}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226032/signature_a628696c-bdc9-4917-aac8-dde5b229fd9e.png}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226032/profile_image_9953b2ea-df93-44d7-af00-f81b963940a3.png}
152	158	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525029/class_10th_marksheet_6bcc87ce-61a6-4447-8c3a-f024d1b015c4.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525029/class_12th_marksheet_c9f26181-f5ed-4e1c-b4cf-3a1253c919d0.pdf}	\N	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525029/aadhar_ea239f80-b0b0-4093-a34d-5c99225dc6ea.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525029/signature_000427cb-ba71-4a7f-a45e-9a8c6819f585.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525029/profile_image_2acdb15b-4919-45f5-a91a-d3223cab1868.jpg}
89	94	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226022/class_10th_marksheet_ff2966d7-7e7a-4401-96e5-2502d7e741c3.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226022/class_12th_marksheet_f3df94d9-886a-49ea-8fbb-cc19500a1bb3.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226022/graduation_marksheet_d0537f3d-032d-4987-8e9d-38c29289f88b.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226022/work_experience_certificates_930247ca-65bd-40a7-a0c2-33cc4181570e.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226022/aadhar_af2916f3-d3fc-45c4-b76e-ba084f3ba7f6.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226022/signature_16ac722c-1f0d-46af-bad8-f496ea253e27.png}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226022/profile_image_0cae77ab-ad35-490e-ab05-b4da55fde311.jpg}
85	90	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226019/class_10th_marksheet_6fd652b1-7734-486c-b046-baf0472659ac.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226019/class_12th_marksheet_457df7e1-ecfa-47ef-be2a-4aa4f45ed58b.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226019/graduation_marksheet_1f0515be-3025-4eda-ac6c-11cb735cb332.pdf}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226019/aadhar_94d4bca1-b7c7-4c7c-b60c-24e2b56e13b7.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226019/signature_ab0a54e8-de4f-45a0-a751-53d4b073f670.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226019/profile_image_2cbd15b8-c1c6-4260-861e-57c6bbbb7256.jpg}
113	119	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326033/class_10th_marksheet_2acfe985-6974-4d48-9088-2879f514be13.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326033/class_12th_marksheet_48aada3c-c67d-476e-bbb9-9ec1377bc9ea.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326033/graduation_marksheet_cf8b0d68-ccc7-4a60-b0ba-c2fd433eb224.jpg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326033/graduation_marksheet_9184d636-0e2e-4405-aa8f-bdefdaff95b5.jpg}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326033/aadhar_7c0ebe43-578a-4dd3-9909-584f7117f163.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326033/signature_c05a553c-f88f-476d-8b6a-c99662c6de17.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326033/profile_image_e8f92ee9-12a1-472a-aa83-f2dffe615303.jpg}
77	82	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326010/class_10th_marksheet_b055f6e8-13ba-4410-80e8-bbd4562028bb.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326010/class_12th_marksheet_2aced89c-8e0f-4c3f-bc43-1b7b476c1f37.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326010/graduation_marksheet_3f56abd6-9bef-422c-90fc-b537fe23c4e6.jpg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326010/graduation_marksheet_ccea1c5f-aefd-4651-a9aa-241d6860777b.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326010/work_experience_certificates_9cd03d18-18fd-4157-8672-dcb4a4977876.jpg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326010/work_experience_certificates_20c62a99-d2fa-4d08-bb81-d817cee6a1b5.jpg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326010/aadhar_3e16bc2d-a07a-46d8-a1a0-4cc8680b20aa.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326010/signature_22f80d60-fa87-4ed3-b639-8c04907f49f5.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326010/profile_image_ef42dcd8-fb98-454e-99f6-d48285a4faba.jpg}
76	81	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326009/class_10th_marksheet_a1bfdf01-14fc-452b-bf71-1e30367e2a5d.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326009/class_12th_marksheet_8262f60c-8980-4451-90cd-b2b50238100c.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326009/graduation_marksheet_52f332c7-cd1b-4429-9bd7-63ba86f2fcee.jpg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326009/work_experience_certificates_03cf29e1-72fc-4740-ab88-c482e25b6204.jpg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326009/aadhar_d60d6124-bea4-4675-b4db-f8d6bccac7e8.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326009/signature_165fb47f-e92c-493d-bae7-87e394138f2b.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326009/profile_image_3685521b-2dbe-4675-8db2-67b03b874eef.jpg}
73	78	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226015/class_10th_marksheet_98256a1b-bee6-4918-abf8-8e64f6d159fc.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226015/class_12th_marksheet_93abe833-1a6d-4796-ac75-4a8c06fc9392.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226015/graduation_marksheet_57c0da13-ed5b-439d-b801-a30085f90106.pdf}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226015/aadhar_c9345bed-dc78-4fe4-a296-e53bdb5d2e23.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226015/signature_ec8a200b-c858-4a09-8304-deffaf2775de.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226015/profile_image_4be766ca-1dc1-44d3-b55d-7836c8960111.jpg}
131	137	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326046/class_10th_marksheet_139a91c9-fb78-4fa2-b7ce-da130f16ad81.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326046/class_12th_marksheet_6c46ec5c-526f-48d3-8520-56e33342a1ba.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326046/graduation_marksheet_787344f5-cbda-4ae7-abfd-012bd41649b3.jpg}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326046/aadhar_40ad38cb-0c3e-4177-b7ae-8fa9a0e88617.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326046/signature_4ff91e37-a8e1-4268-8ff2-1019d1da8b1c.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326046/profile_image_2d16830d-b821-4584-a633-475ca77e651f.jpg}
155	161	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525030/class_10th_marksheet_ffeda8ca-03ab-482e-b87b-5aaadb4cc6bc.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525030/class_12th_marksheet_31e1cec9-aed4-4179-9555-ae4c98a9f2c4.jpg}	\N	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525030/aadhar_80d059bf-a690-466b-b82f-286b32863401.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525030/signature_ad5946ce-2009-40db-a21b-223329908d7c.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525030/profile_image_8353ca77-8572-4f50-a5fa-c313b113c3c4.jpg}
91	96	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326017/class_10th_marksheet_99f2f22d-9323-4036-8ec4-8482b5b89eca.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326017/class_12th_marksheet_05416295-c7e3-4a67-a0d6-ce19e7c22ead.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326017/graduation_marksheet_5a4a7f61-7e19-4d7e-ac24-55b232766821.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326017/work_experience_certificates_7471b8ad-441f-412c-85da-4df3a0615a3c.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326017/aadhar_fb3c6b13-4417-4dcf-af2c-f60e0c6f0009.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326017/signature_fdb4e3e3-c3b9-4561-a225-3b2aca81fa20.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326017/profile_image_fdc03ad7-e887-413c-8dbc-513161b20380.jpg}
65	70	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226011/class_10th_marksheet_fec87db2-2373-40df-8bb7-b8c45b3ba33a.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226011/class_12th_marksheet_eb14de52-c2d7-4252-8636-9df99aa5c93f.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226011/graduation_marksheet_64a714f9-523c-481f-9666-89a81d1ce08e.jpg}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226011/aadhar_d5f2ac24-1562-4668-8942-a0e04cecd0dc.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226011/signature_b2bc9c53-656d-4f9d-aa3d-756cceccb4bb.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226011/profile_image_8b6840c7-a75e-4c4f-8116-431233711cb8.jpg}
93	98	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326018/class_10th_marksheet_85511fd5-4877-4394-b969-ff079fe0f4ed.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326018/class_12th_marksheet_ea7be685-c754-4ede-b83f-d01ff8c026c5.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326018/graduation_marksheet_c19becf2-638c-4a5b-b90d-bf891dc495c2.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326018/diploma_marksheet_5f2904e4-80ad-4a58-86b9-e109bfa1739d.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326018/work_experience_certificates_d1085330-9eac-4d4a-bc7b-bbc2b9e5a198.jpg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326018/aadhar_146643f6-ccaa-42d5-9465-a8cb4849308c.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326018/signature_6b78f24a-78d3-4ec0-8615-c871ce2dbc9d.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326018/profile_image_7bf3f05e-838f-4d42-9c8b-ccba2704bb00.jpg}
83	88	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326013/class_10th_marksheet_8598c4d1-bb41-42c7-b3c7-2bc6941807a7.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326013/class_12th_marksheet_bdf5345f-d7a3-479a-89e3-5454d8131180.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326013/graduation_marksheet_dbd658d0-d921-41ca-aa8d-1b376d62d61c.jpg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326013/graduation_marksheet_c495b6b6-5a07-43ec-a6f8-3074e467ab73.jpg}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326013/aadhar_83ef7b4f-2d86-4a29-af3e-634e0b95a764.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326013/signature_a850d04f-7892-4f3a-8ddf-520fe93a55a2.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326013/profile_image_f4c68075-7fd6-4446-80c0-f0c760b2fdf8.jpg}
80	85	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226016/class_10th_marksheet_51310072-ff6a-4001-8f60-6911636fdb46.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226016/class_12th_marksheet_7a5c6761-389d-4802-bc73-781d9d47a304.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226016/graduation_marksheet_c53ef57b-b0d2-46ba-ac63-36c98fa4857f.jpg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226016/work_experience_certificates_b2d7f5fd-b512-4279-aaa4-3ee9eac1699f.jpg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226016/aadhar_58836a5c-9019-47e2-b986-7f91c092aba3.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226016/signature_031e1903-f542-447e-8e93-4ba55d6b61fb.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226016/profile_image_c36427f2-dae8-453d-999a-a484df85cd47.jpg}
79	84	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326012/class_10th_marksheet_94580a92-7849-478c-a001-137ba5025462.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326012/class_12th_marksheet_cf5b582e-2f77-4181-acdd-d273ef37fb16.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326012/graduation_marksheet_9da92ebb-162a-4a4e-9bf0-87d570cd04dc.pdf}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326012/aadhar_a21e923a-de00-45fe-a953-07215de43c83.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326012/signature_11cb95f0-d676-4e09-8837-f70696a02ec0.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326012/profile_image_77ed2361-3c3a-4ebb-9669-059b7edef497.JPG}
88	93	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326015/class_10th_marksheet_55357518-e418-45cd-b881-b4e9e1da023b.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326015/class_12th_marksheet_00ff4180-a224-4353-b9d4-ba2429b81740.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326015/graduation_marksheet_a246705e-b012-408e-b4b6-357cc70cba78.pdf}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326015/aadhar_c2ca2055-a0ad-41c4-ab72-06b1eb35a3ad.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326015/signature_b009c8d1-5012-4a13-8bc9-c60135e61119.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326015/profile_image_ce1add3c-922c-4ffa-a6d2-5d94ae0dbbb4.JPG}
86	91	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226020/class_10th_marksheet_08e8434c-95b4-4867-a5f5-dc0bb0407db8.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226020/class_12th_marksheet_4466d3b3-526b-4ec0-bc95-87d854251223.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226020/graduation_marksheet_32be608a-ce76-40b8-b6d3-47eb79182c75.jpg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226020/graduation_marksheet_8e50a3d7-4614-419a-8a45-0b78d5458af5.jpg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226020/graduation_marksheet_df727bbd-5a35-41e0-ad13-eaae9f5e1898.jpg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226020/graduation_marksheet_d5f4ad21-9191-4325-850f-382d8bc35388.jpg}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226020/aadhar_191d5714-fa64-4d10-95a8-e8095d08869c.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226020/signature_25e5d805-8ac9-4889-a326-cf352b27d001.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226020/profile_image_973b259b-b5bc-4aba-9c1d-faf275848c03.jpg}
84	89	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326014/class_10th_marksheet_9b34e94e-0f56-415f-84f0-cae97c7e32d2.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326014/class_12th_marksheet_bff2a69f-4ac5-4dd4-a3e3-8591ee11ab91.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326014/graduation_marksheet_9c3b52ef-b867-4496-83e1-2d4d8580f950.jpg}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326014/aadhar_4efea075-b7b3-486a-be03-4d56113048ad.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326014/signature_b28c3f28-4136-426d-8497-1bf43494bdb0.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326014/profile_image_f49459ff-cc6d-43fb-b246-5a384fcb10cb.jpg}
96	101	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226024/class_10th_marksheet_4d35ab0e-5326-4822-b97b-d655e40fd7f2.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226024/class_12th_marksheet_c4c343f3-5056-42e2-a7a5-5e756b990e7a.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226024/graduation_marksheet_90057728-59d0-49df-a4e7-46fbec3db8be.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226024/work_experience_certificates_736bbc26-1157-4681-8b5c-8d18b32c1b0f.jpg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226024/aadhar_45f5af11-2e42-426b-8630-6ff87fa9f13f.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226024/signature_86564480-108f-4ac1-b67b-02f8aebfb77b.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226024/profile_image_78493a71-82a3-4d55-982f-66f21a6b0ea0.jpg}
94	99	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326019/class_10th_marksheet_7dc76ea4-6ed7-482d-a1bd-647c46108cf2.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326019/class_12th_marksheet_292f8198-4f55-4f6e-b9fd-cb3468e041d7.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326019/graduation_marksheet_52cff48a-38f9-42d9-b427-73b424d351dd.jpeg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326019/graduation_marksheet_c16ef411-6915-4148-99ca-d80226384f7a.jpeg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326019/graduation_marksheet_72ef90d6-cfdf-4bc6-8723-01eadcd940fc.jpeg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326019/graduation_marksheet_297a26d4-d2c2-489b-a247-c8649be94ef8.jpeg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326019/work_experience_certificates_d62ec1a7-f0d0-4a9e-ba3b-e513d0ca472a.jpeg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326019/work_experience_certificates_fd56a768-1c7b-4d8d-b15e-42645489df02.jpeg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326019/aadhar_7faecee0-f214-4582-828f-8a0d75a4e151.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326019/signature_f8f4f087-d152-4540-a9b5-7d4b037e701a.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326019/profile_image_25713536-b504-4006-85c9-b859604584ed.jpg}
92	97	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226023/class_10th_marksheet_18b010d9-e19f-4553-8658-af856f95db66.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226023/class_12th_marksheet_20240b41-7b91-43d8-8085-e2f838e66c48.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226023/graduation_marksheet_50f11c62-b640-49bd-9ec9-41f1b588804f.jpg}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226023/aadhar_5053639c-db41-4896-aea7-3404fb67df25.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226023/signature_1fb4fae4-98e8-4515-9df4-daf4bb7e2ffe.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226023/profile_image_46ea0a3c-5506-4067-9978-4aeb50ce7c29.jpeg}
102	108	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226027/class_10th_marksheet_a740254b-dab5-4519-b6ca-84ec8e995acb.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226027/class_12th_marksheet_dbbcfa21-a6c0-4c43-80bc-e274ca64bc35.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226027/graduation_marksheet_d45d515a-8059-43e9-858a-7037e668734c.pdf}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226027/aadhar_9691ea0f-79ac-4c70-90da-b7e7b13f5b97.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226027/signature_dc6abb39-a48a-45cf-aa0b-7b47a5ea6439.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226027/profile_image_2218b5ca-614e-41af-9556-b7d5f0894a61.jpg}
164	172	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725002/class_10th_marksheet_f35f3530-df90-4af2-8959-599f7841d8bd.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725002/class_12th_marksheet_d74e8ce8-b284-46ff-a482-52f5fddb10bb.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725002/graduation_marksheet_a5b2b0f0-5722-4d76-afa5-31efc75d4970.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725002/work_experience_certificates_7252bf06-3a9f-47f4-a4b4-bb48e71eb867.pdf,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725002/work_experience_certificates_5c5ea1d2-9a2c-4cee-855f-d6bd1377fa7c.pdf,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725002/work_experience_certificates_dfac4d95-6a09-48e6-9811-6da518f770f0.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725002/aadhar_9eeac479-71b0-481b-af48-641716173118.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725002/signature_f7e50dd5-211b-4f09-ab00-c017ed265519.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725002/profile_image_dc9ba473-6477-41b2-b503-882b8115493b.jpg}
106	112	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326026/class_10th_marksheet_91951fab-9d7a-4225-ba10-2d32261e63aa.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326026/class_12th_marksheet_3420df64-dc9d-46e5-a68b-3b82cf04169c.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326026/graduation_marksheet_617ec818-66cf-41ed-baee-b97d2fa71e3c.pdf}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326026/aadhar_41f52bc2-b409-45bb-9334-2f828e44fcce.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326026/signature_80b226ab-6c00-4d0c-b980-6dd712ab045e.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326026/profile_image_08d7da33-85ac-4a54-8d2d-8811523d070f.jpg}
104	110	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226028/class_10th_marksheet_d08eda4c-2096-421c-a049-992161934d31.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226028/class_12th_marksheet_b7eb5b3e-f19a-4332-a111-eec33c23237f.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226028/graduation_marksheet_1b97a1b7-8d4c-4b22-a2f3-129d54432b75.jpg}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226028/aadhar_00c711b5-5646-410b-b0a5-d36dcd0e6585.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226028/signature_2368e3c1-05f6-4e67-a9ec-4f01ea504d5c.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226028/profile_image_06031250-897b-4575-afd7-a397f5488242.jpg}
166	174	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725004/class_10th_marksheet_ee3bce3f-d3f0-4738-82bb-a377f8a6536c.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725004/class_12th_marksheet_f4a1d069-6e9d-4c04-9dd9-78c34dcee1ae.JPG}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725004/graduation_marksheet_fab15841-3cdb-40b9-8b7f-8cbf32b1beba.JPG,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725004/graduation_marksheet_7f80fd1b-c4c6-4500-950c-44289d56ee44.pdf,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725004/graduation_marksheet_78177ef2-602e-4d9b-bd9f-712a6c78ff79.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725004/work_experience_certificates_f5a53145-48cd-454c-bf7c-293130adbd3d.jpeg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725004/aadhar_2e2aba24-3780-484e-8949-d3a5d081c0f1.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725004/signature_e8ab9f6a-f4f4-496f-a275-f5bdeee35ef0.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725004/profile_image_0059072f-2412-4625-9174-1076c494ee21.png}
112	118	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326032/class_10th_marksheet_ee507c79-4fd6-4a3a-8032-822d14b68166.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326032/class_12th_marksheet_e81c946c-8ec7-4c7a-b446-1059bbf19da6.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326032/graduation_marksheet_ee61a487-f1a9-4717-baba-a422a654f591.jpg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326032/graduation_marksheet_8d1260cf-79df-425a-91ee-cdd4ae8a058e.jpg}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326032/aadhar_34e8c78d-b844-4c52-975b-44d8bcf06c34.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326032/signature_b024d8c8-e938-48e4-ac80-ed7eb80459ed.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326032/profile_image_c3539f4d-37a1-4ff4-86fe-a48a425c84c5.jpg}
167	175	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725005/class_10th_marksheet_06552733-8e0a-469c-9a87-23279802e9d4.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725005/class_12th_marksheet_77542a74-7048-4907-8f1e-93643d966e17.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725005/graduation_marksheet_552bd33a-7a46-4161-b781-e5216bbfb9fe.pdf}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725005/aadhar_06527e84-868f-40ac-863c-88c3be28b54f.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725005/signature_dcdb54b2-fdb8-4008-a86a-b6390227ab0f.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725005/profile_image_82ff56d7-1162-4e7a-bf2c-d5d22d5ba1b5.jpeg}
168	176	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725006/class_10th_marksheet_6ff36dcb-88bc-4b8a-9393-e82c09894223.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725006/class_12th_marksheet_68514b87-746d-44b2-adb1-66e1c0bb82ad.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725006/graduation_marksheet_76365346-3202-4fd5-bf07-95fdd5a66bb8.pdf,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725006/graduation_marksheet_bb7e2a23-c226-48c3-beb1-b121e9def138.pdf,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725006/graduation_marksheet_e5693b6b-7450-434b-b3c9-3f9db02f0ba6.pdf,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725006/graduation_marksheet_de598b68-97d0-452a-abde-7c458920a363.pdf,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725006/graduation_marksheet_ee2d638b-38ef-4ed4-9eef-1603cda9df2e.pdf,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725006/graduation_marksheet_4a237395-84b9-4336-bffd-adbc690834c3.pdf,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725006/graduation_marksheet_428b5bff-9ece-4a14-8a5f-25926645b7e2.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725006/work_experience_certificates_fef47697-8653-42ec-affc-51a5fef3d058.pdf,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725006/work_experience_certificates_4c23845a-f5bd-4349-a922-53e06f2e6984.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725006/aadhar_6dbc4fc5-7a6c-4b12-9e1c-15ef1097fa84.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725006/signature_1f6c944f-ea8a-4ac9-8353-f098ff5adeb7.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725006/profile_image_a88adb2e-5938-439c-9894-953a048dd8f2.jpg}
114	120	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326034/class_10th_marksheet_cf684d55-f6f6-45ec-911e-e2760d4a659f.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326034/class_12th_marksheet_5baf2a06-9440-49d1-826c-164c34607a05.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326034/graduation_marksheet_4586211b-ad84-4da7-b279-95e0f53e3eae.jpg}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326034/aadhar_b7da1237-82f6-4a26-9c6e-e3112aaac610.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326034/signature_ef2ff67a-8b5c-45a3-88e8-e4d3ed26a9b6.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326034/profile_image_9026bde4-6343-41f3-a087-d650c29ac244.jpg}
122	128	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326041/class_10th_marksheet_1c9540f6-7b84-4c6c-82c1-ae604c614c41.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326041/class_12th_marksheet_f93f2dd1-2346-4a1f-bab1-c1fb4d9c688b.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326041/graduation_marksheet_5608ba69-94d2-42f2-b782-a5b7b903232f.pdf}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326041/aadhar_7cfe3cf0-5a6f-49cf-8dcd-bbe37ca1c25a.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326041/signature_47930534-42ac-40ea-ad9c-940b93aeedc3.JPG}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326041/profile_image_45155928-f696-4927-8a85-2bde54db32bc.JPG}
75	80	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326008/class_10th_marksheet_c79845f7-1eab-4378-9bc6-ed8681c11866.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326008/class_12th_marksheet_f41ad4a9-a551-4931-9a77-5498f92ed5c5.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326008/graduation_marksheet_f5fc44fc-00fe-40ce-a43e-bf167a8d6e5b.pdf,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326008/graduation_marksheet_161c0506-b4fb-46a3-bf85-c32b7f7f77ba.jpg}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326008/aadhar_79b376b5-107d-4289-b569-efb42be2dbb4.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326008/signature_f68f3af3-d708-4d06-9de6-0e104cefcb62.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326008/profile_image_d73333e2-ac00-4414-a6cc-169540ecc5e8.jpg}
28	30	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525002/class_10th_marksheet_44879738-70bf-4846-8d89-0a5663bf8591.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525002/class_12th_marksheet_e53fd970-d7d4-4314-9faa-7b8c8cc15b30.pdf}	\N	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525002/aadhar_d1d142b3-b9bd-4ec0-89d5-2e748966f117.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525002/signature_60bd10fd-182f-4d3d-b3f7-7bed6b567cdc.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525002/profile_image_7c8ccd6e-866c-41d8-b56b-9ee5c4f66299.JPG}
172	180	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525031/class_10th_marksheet_53fa7774-2bd9-4fc2-b467-e671a6b40ac2.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525031/class_12th_marksheet_dec20bac-fb8e-4db3-85b9-4b299f7e15e3.jpg}	\N	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525031/aadhar_825ec58d-0636-408b-a4de-1da4d29a42c2.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525031/signature_a4b5f9f9-1a24-47d5-9bc0-47238e6a6798.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525031/profile_image_4f9a51d3-92ef-4842-a887-034664e5ee9e.jpg}
163	171	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725001/class_10th_marksheet_10268bb9-2fc2-4f24-a978-0767bd7f869b.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725001/class_12th_marksheet_edce748c-6cb8-4b47-9a36-f95cfbd56508.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725001/graduation_marksheet_ea4a195d-4453-4f2d-98ad-e1e219cc17e9.pdf}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725001/aadhar_dc88c8c2-4967-47af-8c5d-32031e3d166e.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725001/signature_a4163df7-99f0-4158-9015-6942fc18d377.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725001/profile_image_9f4b3754-d715-400a-b1fe-cbc27150be59.jpeg}
125	131	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226030/class_10th_marksheet_39566255-fd7c-444f-8867-b785a558e691.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226030/class_12th_marksheet_a2b13809-2d62-4580-a675-53a6a726790c.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226030/graduation_marksheet_9712fe42-28d8-4057-9803-f808a14c76e2.jpg}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226030/aadhar_424c20ef-ac41-4347-8b39-ba33a447cc37.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226030/signature_c74b7543-70aa-4fac-be6c-5ddeabe0ba7d.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226030/profile_image_4be4c7dc-c10e-45dd-9aa1-f58590558b8e.jpg}
32	34	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525006/class_10th_marksheet_02836ff0-5df7-40af-adff-925acfeaaf02.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525006/class_12th_marksheet_18fe2b68-2c99-4b20-b405-b4a343305477.jpeg}	\N	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525006/aadhar_2e10bd30-f3b8-486f-a908-0c109b909bf6.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525006/signature_52d553c3-ae4b-49a8-a7ed-6e43728a2588.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525006/profile_image_3cd74311-4f82-494b-aa27-61dd12d70e76.JPG}
71	76	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326005/class_10th_marksheet_b0c01c86-6986-48ff-9d93-b795a078bb62.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326005/class_12th_marksheet_00eadd5e-86a1-44ea-9a14-08af75d1044f.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326005/graduation_marksheet_0212bc9e-beed-497c-888c-3392b4e4778e.jpeg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326005/work_experience_certificates_aa1bde79-25c2-404e-acb6-b9c5107d62d2.jpeg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326005/aadhar_b055db8d-5371-492e-a21a-bd87399fe479.png}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326005/signature_68b1a5bd-a269-40ca-be07-75fb305045c9.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326005/profile_image_8435c020-20c7-43de-a3ed-0ee500e3796a.jpeg}
127	133	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226031/class_10th_marksheet_c52e76ad-e938-4f51-a670-a15fc95dddbb.png}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226031/class_12th_marksheet_064650b7-3cc1-4997-9997-a141e93638d9.png}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226031/graduation_marksheet_bbb53307-9ffd-40e5-9adf-d80712b78c25.png}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226031/aadhar_2469dce3-a66a-4c13-84aa-47289070a31c.png}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226031/signature_8cf22732-dd7a-4eea-92d1-8daa9d8e96eb.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226031/profile_image_b9983b51-26e5-4539-9229-2c8b80bb7b74.jpg}
145	151	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0225001/class_10th_marksheet_e1d28824-7534-41c3-9035-05599f01faaf.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0225001/class_12th_marksheet_25c5c471-efb0-40f1-b2e2-2990c21d381b.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0225001/graduation_marksheet_38b4fe3e-1b6b-4a7d-8bd8-4490c4cfb78c.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0225001/work_experience_certificates_22a9010b-2a32-40bd-8607-3926ed82928b.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0225001/aadhar_363be8a8-546d-44a9-ae97-d02f7ca41938.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0225001/signature_1f98e6b7-df00-4138-bbbc-d685d4ba2ef2.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0225001/profile_image_c6c74630-c179-4a46-b934-164cedc1a65b.jpg}
68	73	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326004/class_10th_marksheet_8dc527f8-515a-4d89-8931-d113d0089ee2.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326004/class_12th_marksheet_eb9cf22e-e082-47ef-afa5-973661cb9bea.pdf}	\N	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326004/aadhar_260bc61a-28fe-43ae-bc9f-59d648898194.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326004/signature_485f1938-a96a-43cf-8af8-3cde3704a0b0.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326004/profile_image_709c6d04-5f78-4f17-94d3-8c38906ba9e0.JPG}
67	72	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226012/class_10th_marksheet_7d8b2a52-521e-4e61-996a-52dd9ad3d737.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226012/class_12th_marksheet_5a9e006c-9f86-4c90-a1c4-d305bdd95485.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226012/graduation_marksheet_34c500ef-c938-4987-91ff-7153552cfd3c.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226012/work_experience_certificates_233e4be9-46a1-4f7f-8e1d-818f2ff2a580.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226012/aadhar_5638ab59-086c-49af-94f0-79ab24841edd.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226012/signature_0ed87ea4-a965-4d28-b8ed-d99179d2d059.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226012/profile_image_cd337eff-a372-4a73-96b0-f4c3a91bc9a6.JPG}
165	173	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725003/class_10th_marksheet_9831404a-508d-4ede-b718-d1e4cc295dc7.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725003/class_12th_marksheet_6f5e1f98-ae4c-4f46-b0ec-9553f3094e51.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725003/graduation_marksheet_5bb059cb-1c5d-400e-87ca-53bad8edd053.jpeg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725003/work_experience_certificates_9357f81f-449d-4086-b83e-a47a5ce651bd.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725003/aadhar_96acaf14-ecf1-44dd-b0e5-625c3c166d7e.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725003/signature_31fffd31-a35b-47ef-8ffb-c1d17c706448.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725003/profile_image_9a911086-edda-4b0a-b2f1-b4a19741d114.jpeg}
62	67	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226008/class_10th_marksheet_eb85b7b0-bb85-4565-b105-3d81cea761d3.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226008/class_12th_marksheet_58682276-bd23-4d2e-86c9-8580d8cbc453.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226008/graduation_marksheet_bea8eba3-5cdf-4cc8-bd7d-cec0d91536a9.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226008/work_experience_certificates_929f205d-18a7-4425-8637-9a104195ad82.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226008/aadhar_eb82f755-aa85-4c51-bc2c-96976a82de8a.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226008/signature_640bae2b-d104-4b62-80e6-17f8eaec64b1.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226008/profile_image_c82daaa5-5113-4db4-9521-8c5ee2dd8ffd.jpg}
74	79	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326007/class_10th_marksheet_b4b69cd1-930f-4b72-8c17-f8ebc5b5b268.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326007/class_12th_marksheet_5dc28655-5245-43e1-8ee5-45d603d916d4.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326007/graduation_marksheet_9bbabfaf-8244-4c0d-9939-71123fe400d9.jpg}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326007/aadhar_8a176339-115a-4089-9bc2-61d0a741f207.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326007/signature_81c73d43-2767-419f-a8bb-7390e403f2a9.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326007/profile_image_a2a3c1d6-d08f-4340-9c42-d5a4b04f4019.jpg}
70	75	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226014/class_10th_marksheet_03e60caa-65ce-47a9-8113-26597dfc34c2.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226014/class_12th_marksheet_0a49d067-228d-46b0-8695-1320465fca8c.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226014/graduation_marksheet_c9c8c7ae-777e-4270-bddf-e56f333ebab4.pdf}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226014/aadhar_d6cc394e-7ab6-4371-958d-ca68200cee52.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226014/signature_7000363c-2508-415a-906e-4c81d2ec2002.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226014/profile_image_c0532bd1-3eb4-4b42-93e7-78099b4a2192.png}
66	71	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326003/class_10th_marksheet_72013db3-9c79-411c-8db9-b0fcdeb10dc1.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326003/class_12th_marksheet_5e9c3670-a695-4055-8933-d5ef16a06dca.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326003/graduation_marksheet_93b7ab60-869f-46f3-87ca-05351f033eaa.jpg}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326003/aadhar_9f7bfa68-0d89-4091-a501-61b049a86b15.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326003/signature_db960756-7d4a-4be2-a9d9-a7bbccdb687c.png}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326003/profile_image_1f69ec35-b7fd-4a52-9f4a-bff06b530e5e.jpg}
64	69	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226010/class_10th_marksheet_924d5bae-b595-48c2-96d7-dc03985d03c1.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226010/class_12th_marksheet_2eed4ae7-bfb5-4ad8-9d44-5044da1386c2.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226010/graduation_marksheet_c3cf0987-2660-4d34-bb85-e4205337f8b8.jpg}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226010/aadhar_f68038ce-4eaa-4db8-8635-ec0dd645d49d.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226010/signature_101e79f8-1ab2-415f-95f8-5909b0893db2.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226010/profile_image_a55b7ebc-dbcb-406e-858b-dd4f63f491c5.jpg}
171	179	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725007/class_10th_marksheet_fcf9a250-c2f6-45bb-a4cf-2c001d1518cd.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725007/class_12th_marksheet_b7e4e275-90da-4b05-9015-3dfe6a7028b0.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725007/graduation_marksheet_2e738081-2070-45ed-90f2-4e95800a2c8a.pdf,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725007/graduation_marksheet_a51b9ce3-1de2-4b45-b763-d444245b4952.pdf,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725007/graduation_marksheet_20f96bb4-3143-4465-b94c-9fb70d3362a6.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725007/work_experience_certificates_ddf52e52-48b7-4110-971c-e410e23733a4.jpeg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725007/work_experience_certificates_d2dd2c2e-c57f-4fa4-8d67-220bbd5b44de.jpeg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725007/work_experience_certificates_04655859-acc4-41d7-9712-b6d3d60d7c73.pdf,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725007/work_experience_certificates_316307fa-68b2-4bdb-90e5-b3042854c415.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725007/aadhar_f7dac10f-9c01-48de-b24b-bcccae81cb8c.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725007/signature_fa0e1a93-4d19-4f99-a262-4ec8b476ca9a.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500130/x0725007/profile_image_59c5d24b-75d6-4674-a1cf-c97fba8b51c5.jpg}
53	58	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226001/class_10th_marksheet_8a447d5e-e104-42ab-8726-f0f8391b8650.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226001/class_12th_marksheet_1a0c6a64-a6a3-402c-969b-53c3f5ace8f6.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226001/graduation_marksheet_5b579a0d-efe0-4b2f-a28f-afdfad9318e2.jpeg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226001/graduation_marksheet_455b76fc-ad37-48a0-922f-cdb2a1ab3646.jpg}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226001/aadhar_9b1db56a-4f7c-49b7-bb3b-2ab888fbe0dd.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226001/signature_b6834297-c7eb-4300-bdae-83e80f783d6c.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226001/profile_image_ae0f5468-e6f1-483c-8d53-b88ba5d8dfe1.jpg}
82	87	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226018/class_10th_marksheet_3a1314c1-bd5b-41e1-b2f6-074122a5fb87.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226018/class_12th_marksheet_31cb6090-9294-4384-9646-7cdd7bf48c1a.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226018/graduation_marksheet_28ed2b50-11f2-4301-8649-58ac67d59b8c.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226018/work_experience_certificates_da2467ec-bf88-455f-a742-522ef65bdb78.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226018/aadhar_233d6e9b-e76f-4ba6-aa0d-c86ac6e01454.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226018/signature_ad37b840-6283-4cd8-bc87-95a6bec8811c.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226018/profile_image_fda321d2-7e10-4155-9534-1b4eabfce7d7.JPG}
120	126	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326039/class_10th_marksheet_220b69ce-3c15-4704-a9c4-275b769ca4b5.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326039/class_12th_marksheet_64c1a8d5-6ea1-4d0b-9bca-300ce9054b8a.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326039/graduation_marksheet_8abd977b-d80b-493f-99f7-1bc51a85273c.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326039/work_experience_certificates_2f34451b-e0e0-40c0-a0f7-c8c84a625620.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326039/aadhar_a6bd6c88-4b59-43d9-9e9b-66bac36f4454.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326039/signature_8e8d2dfa-f196-4fd9-be25-9cd251c0e3d2.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326039/profile_image_b8d84070-fc38-41e3-bc71-16d0c277950a.jpg}
58	63	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226006/class_10th_marksheet_618ff8bc-828c-4aa5-b0b4-d24c28d339c7.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226006/class_12th_marksheet_a068c940-c71f-4974-8916-b05e47d64606.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226006/graduation_marksheet_3eb8d33a-d9b0-447d-9fe9-58ed46c252c4.pdf}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226006/aadhar_1d83ebb8-08af-4c39-98e6-8095201ac4c2.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226006/signature_a8526f78-b22d-4119-b60a-04c6c593c748.png}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226006/profile_image_393e8209-9b04-4d91-a17c-312e39d8dc66.jpeg}
118	124	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326037/class_10th_marksheet_10b00031-2af0-40af-adba-6a433b27a34b.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326037/class_12th_marksheet_5cfbfb54-98b2-4f8e-a68d-2f856b5528d2.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326037/graduation_marksheet_aa808edd-f76a-4cab-8f64-77c87b2282e2.jpg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326037/graduation_marksheet_cfbf7d25-e63f-4992-97b2-8811de2a7450.jpg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326037/graduation_marksheet_fc221be1-f10e-4065-a72c-09352e5d405d.jpg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326037/graduation_marksheet_beb7019a-0c4e-4261-94b4-ac7d08885741.jpg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326037/graduation_marksheet_a2d25a7c-1747-4f4a-8160-6f7cfef3988b.jpg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326037/work_experience_certificates_50a91bd0-c863-46b8-b13b-ab6b974b50dd.jpg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326037/aadhar_80c9503e-6b47-4918-9258-a02e147a15ab.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326037/signature_619802e0-4dfd-4177-9fe1-d5f4bd96a2cb.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326037/profile_image_e74f4a53-6016-44e1-844b-f8bf083369c1.jpg}
51	56	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525024/class_10th_marksheet_b62a69c6-daa4-4a00-9880-3f507841eb56.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525024/class_12th_marksheet_4fbc19af-ec98-48ed-ad45-045bde59b881.jpg}	\N	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525024/aadhar_d066d0db-c0c9-401d-a1f4-1fe03c93ee20.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525024/signature_6846278b-b417-483a-8e20-39b8eaef9aa5.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525024/profile_image_a0823cde-dc73-4313-b2dd-6b74299500cc.jpg}
54	59	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226002/class_10th_marksheet_57bd7b3b-5337-4e6a-9fcc-f983d2b0ed0d.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226002/class_12th_marksheet_77f93ecd-681c-4d43-9880-225e858a94c8.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226002/graduation_marksheet_a4b2d132-80cd-48ee-86ed-eeaaa58be07e.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226002/work_experience_certificates_0978c885-1afb-485a-b393-08a9ba790f69.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226002/aadhar_c114f758-674f-4ff7-98d5-95bda1b7c2d4.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226002/signature_12444882-3d5c-4084-8ab9-bd2787d79695.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226002/profile_image_51e78112-dadf-4cb5-ae6e-0d3b724a5001.jpeg}
117	123	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326036/class_10th_marksheet_1c6fa4e4-c082-47a0-bff9-70e8c2290885.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326036/class_12th_marksheet_b4fd852a-86dc-4406-b0b7-ab8def072b2b.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326036/graduation_marksheet_17be715c-5e06-47c8-85b8-954f0652a9e4.pdf,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326036/graduation_marksheet_20aeff41-ceda-42b4-a320-5143a9ed1e8d.pdf}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326036/aadhar_8518fdba-be73-4eb0-be71-195d2175a5ed.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326036/signature_a543e252-6f01-4093-999e-60aedf8d9a82.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326036/profile_image_08ada113-0843-4096-96e3-3cdb94f11610.jpg}
116	122	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326035/class_10th_marksheet_3d8eb379-ba53-4c1d-b919-4f3844475321.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326035/class_12th_marksheet_277a0f0d-e770-4114-a2dd-8aa751e1a4c8.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326035/graduation_marksheet_17f96ae4-96b9-49f1-aa21-ef99f708d6a1.pdf,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326035/graduation_marksheet_fc6f2a1b-e80c-440c-b603-74bc31e96830.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326035/work_experience_certificates_b1010853-fad4-4370-b7b8-73d4d68854bf.pdf,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326035/work_experience_certificates_26240cd2-dd93-44f1-87cf-028239d503d3.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326035/aadhar_bbc9c5ff-6758-4271-8bf0-4905cfd8a602.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326035/signature_e8e38e5b-eb72-428c-8ac1-b4a90095c8fa.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326035/profile_image_e1f1d9c9-97fe-4e74-9ed2-a3287fa108ed.jpeg}
50	55	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525023/class_10th_marksheet_b4933b3c-850e-4adb-887d-68c5c6be0383.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525023/class_12th_marksheet_ff4a64e1-3fac-40f0-8570-8472c2f9ea39.jpg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525023/diploma_marksheet_4cb93ff4-b0e9-4460-88cf-d686a57dde26.pdf}	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525023/aadhar_545806fe-bab0-4f62-8505-3a26646d17fd.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525023/signature_fcbfee5a-db5c-4ed9-abf1-61de3ffa97f4.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525023/profile_image_3fca92b9-fcb6-4ca0-9edd-a47703e299cc.jpeg}
34	36	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525008/class_10th_marksheet_3f9605e4-1520-47e3-873a-2d7a7d6c3a14.pdf}	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525008/diploma_marksheet_0896b06d-602c-4075-9c97-cb71a0616e18.pdf}	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525008/aadhar_4c85b690-e57b-48d6-9b36-6ce5700452a3.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525008/signature_e96027ad-c935-4d3e-a09f-732f7193e26c.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525008/profile_image_0e1adb3c-91c3-4a5f-8598-6ee41afa96d8.jpg}
59	64	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326001/class_10th_marksheet_8863c49c-c8a8-43f9-a6ef-5eb926e856fe.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326001/class_12th_marksheet_2a13028d-a79a-4957-947c-0a924285293e.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326001/graduation_marksheet_d154ffa0-b4a4-4297-aa51-e7a04af5af91.jpg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326001/work_experience_certificates_ae5f3c07-9eda-49d5-9536-7567d0887133.jpg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326001/aadhar_423f0d3c-1b5f-4608-a1c8-e501bc68d7a8.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326001/signature_29ff59b3-d9e5-4725-8bf9-0868dc4e66e7.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326001/profile_image_96b547e8-12eb-4bc6-bf3d-7ad7b8dde3fd.jpeg}
49	54	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525022/class_10th_marksheet_2ef3971a-c0b8-46fa-8164-76498f8acb34.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525022/class_12th_marksheet_324af299-1bd2-41c4-9e07-8ce325885cae.jpg}	\N	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525022/aadhar_7edb0e14-3808-4b06-80ce-b6c0fe6e16d1.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525022/signature_39c97d4b-56d4-453f-b810-79284c90b65a.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525022/profile_image_f44ea894-1dd3-49c0-a552-72c7f3174ba3.jpeg}
109	115	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326029/class_10th_marksheet_cf090324-2d3f-4f50-b151-31b5defce292.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326029/class_12th_marksheet_99e334b8-0812-4a5e-afe4-1e20619de91a.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326029/graduation_marksheet_fb20c830-34d3-4cd5-bed6-0efa5824b281.jpeg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326029/graduation_marksheet_0c36ba8f-10f7-4c5d-bc1f-1f872ce64a35.jpeg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326029/graduation_marksheet_461effe1-551b-476c-bccf-5592b6d8bc25.jpeg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326029/graduation_marksheet_644092ef-ae21-4953-be9b-b225f955b2cd.jpeg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326029/work_experience_certificates_ca0b1aa8-f8be-49ca-ac3a-17d3c2cf9b39.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326029/aadhar_59171cb7-05a4-44bc-b9be-eb83ec6725a7.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326029/signature_214b15b1-0a36-47cb-aa1c-5b5341fd85bc.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326029/profile_image_cdf14444-3fef-4227-a2bf-074293a1d7b8.jpeg}
33	35	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525007/class_10th_marksheet_fd2a1b19-c7ae-4099-8766-d1e528c43954.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525007/class_12th_marksheet_162f7676-d0ac-428f-99c5-7b43cb43f456.jpg}	\N	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525007/aadhar_6bf9669c-5c08-425e-8abc-4765211197dd.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525007/signature_3c28aed3-ddc9-4f11-84f0-520d1dda033f.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525007/profile_image_61f26a23-a7e0-43f5-b7b0-e06d0adbe69d.jpg}
48	53	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525021/class_10th_marksheet_51b0682b-275e-4213-b530-b1e83fab269a.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525021/class_12th_marksheet_1982e13c-d322-4d3e-bc7b-7db56554c8ab.pdf}	\N	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525021/aadhar_66d8e314-ca1e-49cb-b3a7-f53a5d2da7d2.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525021/signature_93c5bbf7-e7fa-4e53-8bcb-8316e225b7a3.png}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525021/profile_image_932314b9-35a7-4d13-bce7-dd5544b37f2b.jpg}
126	132	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525025/class_10th_marksheet_e2e659ca-8e1e-4b5b-beab-ee0fa8787dbf.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525025/class_12th_marksheet_77f6bd45-1128-42d8-b13b-ff06daa68783.pdf}	\N	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525025/aadhar_ef4e78c3-219d-41f9-b8a3-63854db2ce00.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525025/signature_56be6cb8-246e-4419-8666-79781b09a1ee.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525025/profile_image_ab820930-a210-4680-88c4-16ce207c25c8.JPG}
43	48	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525016/class_10th_marksheet_7306b4bf-51cd-44a8-8203-b47eab6794df.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525016/class_12th_marksheet_f075e755-b56d-4b88-b729-ec8a9c94ee2b.jpg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525016/diploma_marksheet_308ec985-97aa-4905-94df-d45625ef2910.jpg}	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525016/aadhar_3b64866a-7e85-4275-922f-770ea2078ccd.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525016/signature_d07848f6-360f-470c-ad2c-202e4191f54e.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525016/profile_image_980ba116-1285-449e-9f34-b2f79dd6034c.jpg}
105	111	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326025/class_10th_marksheet_09ed8b5d-bb6a-4ae0-81ce-12ca0636ade5.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326025/class_12th_marksheet_d2787ef6-f836-4615-9f53-d1cb3274a778.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326025/graduation_marksheet_77c98627-0224-473d-aa9b-e2da07905b38.jpg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326025/graduation_marksheet_f5acc9e3-4026-45e1-a7aa-19ef6a96e4d8.jpg}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326025/aadhar_b18b1ee4-2c5a-4867-985e-9280573d12a8.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326025/signature_a00521be-7013-479a-8efb-9a040e8c3172.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326025/profile_image_d145ab84-e00c-49e5-8f0f-14f86789d52b.jpg}
47	52	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525020/class_10th_marksheet_8b862d47-a337-4423-a97a-854cf3106f28.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525020/class_12th_marksheet_975730b8-dda6-4507-8af1-f498db9c1305.pdf}	\N	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525020/aadhar_7a887cea-732e-403d-b8d6-aae0add090bb.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525020/signature_03312138-4fd6-416a-aec6-c61ebfd9c30f.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525020/profile_image_3b81e7d5-d25f-41e5-aecd-e3e472cb5aa8.jpg}
103	109	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326024/class_10th_marksheet_c86cc21b-f40e-4bba-a8e6-3aa122645282.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326024/class_12th_marksheet_9ca0782b-7e81-4184-95ee-a32552c1606b.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326024/graduation_marksheet_57917bc1-c571-4474-8ae4-5875f34fe212.jpg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326024/graduation_marksheet_81cd5f58-7963-4a48-9d1b-9d0d7313f205.pdf}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326024/aadhar_6a6e4a96-1175-4abb-bd63-8748abac413e.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326024/signature_2a845d73-6a14-42c3-8cfa-10065b4976a5.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326024/profile_image_481e1e2a-f16b-418d-8ac4-f7468aeae3e4.jpg}
45	50	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525018/class_10th_marksheet_4ca18a5c-a1b0-4a50-924d-4ef557064f2f.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525018/class_12th_marksheet_f8bf395c-88d0-41eb-9bc2-303577276089.jpg}	\N	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525018/aadhar_a17250bc-99e9-4975-9c47-73f60189b305.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525018/signature_45038b14-fb7c-47e7-9244-4e5c3d3f25cc.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525018/profile_image_513d6468-5b88-491b-b31c-699ed93f8283.jpg}
37	39	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525010/class_10th_marksheet_7d02dc4f-fa22-4c2c-b4b8-36c368a4a0a2.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525010/class_12th_marksheet_4b35107d-a8d6-4ef9-90d7-f24cf1f7dda1.jpg}	\N	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525010/aadhar_e477bc07-c94e-424f-86af-14659b10d094.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525010/signature_27019f06-5f7b-4a4f-9e77-0d74ee20da89.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525010/profile_image_d8e74963-cfdb-4529-bc3a-a3c4b6b35c6a.jpg}
44	49	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525017/class_10th_marksheet_5f89255f-b273-450a-becf-0b40766a80a7.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525017/class_12th_marksheet_9f4361ec-11cf-42c8-ab5e-1a963d674312.pdf}	\N	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525017/aadhar_05d1777d-e9a5-4376-8244-68fbda2593ba.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525017/signature_972a43f3-bab6-450e-80df-dedd88f65ce8.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525017/profile_image_5f6aafea-7906-48f2-878d-05c5e6e1ae92.jpeg}
41	46	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525014/class_10th_marksheet_1f9508f6-35a0-4118-b89a-2f8695eaf4a2.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525014/class_12th_marksheet_e7da5a65-a86e-4208-82b4-3d6bf6999b3d.pdf}	\N	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525014/aadhar_31d8638f-dba3-423e-aeca-c57747ebffb8.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525014/signature_a73feef1-30ae-42b9-bad1-d659142c45d9.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525014/profile_image_237c87c2-d3f8-4ea6-9eda-b58d74f02a6b.jpg}
100	106	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226026/class_10th_marksheet_76f71345-5f53-4686-98c7-30aa0fd2f02b.png}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226026/graduation_marksheet_3278336a-b8a0-47b4-90df-a1c3689b0087.jpg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226026/graduation_marksheet_2266aea8-011e-429e-bcd2-a555e021224e.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226026/diploma_marksheet_477dac6a-3444-430f-b72a-eaa8234aaabe.png}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226026/work_experience_certificates_838ea9c2-4d1f-4bf8-aed0-1a2260908da2.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226026/aadhar_6a60b9c9-e78e-4c08-bec1-50ef8f2154e8.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226026/signature_c30f2092-9f84-45dc-9b5f-4dfdb29e2663.png}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226026/profile_image_61a9c47e-53bd-4378-8090-2b312d18591f.jpg}
38	42	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525011/class_10th_marksheet_139029cc-1bce-4b7c-911e-f4c2bc40bc91.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525011/class_12th_marksheet_2b44dcaa-9476-4ec1-8889-2492f9466aea.pdf}	\N	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525011/aadhar_c0d5999d-4d0c-4825-ba04-d7d48a9edab8.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525011/signature_afc46c67-f522-41cf-9b2e-3e6950866572.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525011/profile_image_6037414b-1ec9-4850-b74f-e6d93c8e8056.jpg}
60	65	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226007/class_10th_marksheet_7b48b336-8ce6-4ec6-a960-b5660519d17f.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226007/class_12th_marksheet_182cfa99-968e-42d5-8176-9a1ada9702ad.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226007/graduation_marksheet_bf619376-6f21-4583-8ee7-dd4c38a14af8.jpg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226007/graduation_marksheet_d1aff5de-5959-44f0-a96f-9045f1a2f5b0.jpg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226007/graduation_marksheet_f2e5cb3b-4af4-4300-abd5-fb6308540767.jpg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226007/graduation_marksheet_efeb5104-23b4-4e1d-bc00-acd1eebff06a.jpg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226007/work_experience_certificates_a5769ff5-248b-4631-bff3-f16332e9c6a0.jpg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226007/aadhar_7e689a6f-1db5-4c86-b0f3-628c0ae43a82.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226007/signature_c3aaf4fb-7558-4892-9b35-5ae2031a8a5c.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226007/profile_image_dd320f44-c61f-47f8-b9c8-fd34eb5b34ae.jpg}
35	37	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525009/class_10th_marksheet_2e4aee3a-4fec-452c-97d5-e5fad16b9f9c.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525009/class_12th_marksheet_fdd8ea09-27d0-436c-8803-25e37a7df09c.jpg}	\N	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525009/aadhar_bef0fcff-918d-44ae-8eb3-26c310a47d74.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525009/signature_fccddf85-b60d-491c-9369-147767529eac.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500038/O0525009/profile_image_b5d62cc8-a4dd-45cd-baae-cebbceba2775.jpg}
87	92	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226021/class_10th_marksheet_07fa2174-262c-4839-ab8d-822f0fa68bad.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226021/class_12th_marksheet_2d32e4f4-ef95-420d-b021-daf41b3e3c39.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226021/graduation_marksheet_e82ecc23-1f91-4a4b-bcde-fe000d9a4493.jpg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226021/work_experience_certificates_152b32d1-b83f-4bc2-ae65-dbd54f3ff26b.jpg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226021/aadhar_0264d734-1892-4c9a-a498-5bcb6210529e.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226021/signature_453e678c-62fd-4605-a41b-7b8c1c49f975.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226021/profile_image_862a983c-eb05-41d1-b14a-afc4caa70882.jpg}
78	83	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326011/class_10th_marksheet_b0a10b79-66af-4b2c-9e15-d5d97e2ca755.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326011/class_12th_marksheet_1d285b6c-2a90-4e61-bfbc-ba3e051fd0d1.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326011/graduation_marksheet_a90182cb-7d92-491e-857f-cf43a44ab67d.jpg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326011/graduation_marksheet_eaa2bab5-e24f-4161-be59-98ff9f4fbca2.jpg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326011/graduation_marksheet_47409152-65c4-4f6c-8444-8bf962a59428.jpg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326011/work_experience_certificates_b4b5d9fa-78e6-4280-a20b-5c93ef5eeda9.jpg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326011/work_experience_certificates_e02ec489-5ae4-4836-8f3e-789c573dde2a.jpg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326011/aadhar_1ba43a46-6a54-4fe4-b84e-b1cc00b5daf0.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326011/signature_b7959804-27d9-4e65-a06c-e776509d8442.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326011/profile_image_10c708da-e4c1-4d65-b1b4-3faae7b882f2.jpg}
134	140	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226033/class_10th_marksheet_2f8a6cd5-9e71-42e7-981a-82a33e6361f0.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226033/class_12th_marksheet_b9e7f581-c125-4203-8315-ef212ee745aa.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226033/graduation_marksheet_befb7109-5ffc-4bfe-90b1-0d089a130477.pdf}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226033/aadhar_05ef48e6-4d53-4537-ba48-fbe06ca260ae.JPG}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226033/signature_9894f2be-373f-45d3-bb97-5f48bc67d3e5.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226033/profile_image_ab6d99b6-77d8-49d4-b5d8-0272139f7e6d.jpg}
108	114	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326028/class_10th_marksheet_a4834c47-420c-4447-91bc-83844ae8290e.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326028/class_12th_marksheet_582fb3ec-6048-4abc-9d0f-ef210a0181d6.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326028/graduation_marksheet_f76cf8cd-bdfb-4a8c-bd06-b935663b1097.pdf,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326028/graduation_marksheet_6f93cbdb-d06c-4fcc-b679-961a7ddd653a.jpg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326028/work_experience_certificates_a8834333-1c7a-48c9-b288-e446422ea0dc.jpeg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326028/aadhar_829ab31f-e272-4e46-89f3-567db49346c5.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326028/signature_5c57e900-2291-4902-8ce9-1a583f60a92b.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326028/profile_image_53816d6b-da72-4318-8d05-0cde5db4c9ab.jpg}
101	107	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326023/class_10th_marksheet_cc94e87f-091a-43dd-9506-871a7d120e61.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326023/class_12th_marksheet_7aaf45c3-b004-4d33-a9dd-9a5ba002184d.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326023/graduation_marksheet_ed37abb0-7700-4ee3-878c-9dea7c3651df.jpg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326023/graduation_marksheet_e451f0f8-134c-41fa-a5a4-9fc4cc99d3a9.jpg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326023/work_experience_certificates_a35b6054-6352-4720-9add-a8ec0db0ff9a.jpg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326023/aadhar_ab380668-58e7-4c3a-b0ad-c189f276cce0.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326023/signature_b88456d0-3aaa-407e-9540-f40450267e75.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326023/profile_image_2b11092a-7dea-4e78-9c30-e44d35149d2c.jpg}
133	139	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326048/class_10th_marksheet_aa7ec0e3-db3b-4fea-a9ec-ff8e514a9531.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326048/class_12th_marksheet_f12dfee0-13ad-49f2-a905-2a773cfa4bf0.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326048/graduation_marksheet_131bda66-0b66-46af-acb7-ac5bc16b5ec7.jpg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326048/graduation_marksheet_0bff0eb0-401a-4305-b328-afed4edaec08.jpg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326048/graduation_marksheet_ece3c72f-54fc-4e1c-8298-10d590a2aef4.jpg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326048/work_experience_certificates_bed4cf8b-3c27-422d-87cb-86b378dc16fe.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326048/aadhar_2ebe0c76-8770-49e3-bccc-9b4c90774cfb.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326048/signature_a586bc8b-3d63-4729-a433-85e898eccffe.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326048/profile_image_b14a3508-0ca3-43cf-aef1-4f10aafc2840.jpg}
121	127	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326040/class_10th_marksheet_2cb9ea6e-fb45-4a9e-916c-bbbdcac0bbdf.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326040/class_12th_marksheet_a700ea9d-5719-4053-aa48-8f422aaedac7.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326040/graduation_marksheet_50a429f5-7ee5-4ac4-a4e2-ecdda506dd91.jpg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326040/work_experience_certificates_86e1f023-dfbe-4863-95f1-4e6ef4f62ff1.pdf,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326040/work_experience_certificates_6de49b7f-4ba8-477b-91b5-29fc79da7c54.JPG,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326040/work_experience_certificates_ce622ac4-2799-4e03-bb4f-e35ac3c12706.pdf,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326040/work_experience_certificates_2f174b7c-1421-4a7b-910e-57cff8f53ea9.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326040/aadhar_08831714-8bfa-4687-863f-64976581e1a2.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326040/signature_d631a50b-b5f8-4009-b2bc-0346e784b94a.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326040/profile_image_d7c87a38-d927-40d5-93f1-6289cc320a81.jpg}
119	125	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326038/class_10th_marksheet_7525efd0-8484-4fed-88cd-a3c32714059c.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326038/class_12th_marksheet_1cd52afc-567c-4ac4-a5c9-8f1736880064.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326038/graduation_marksheet_baaf52a1-237f-426f-90f4-6d9be20acb97.pdf,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326038/graduation_marksheet_9427e1f4-e1e3-46eb-932e-d90e24f67e3a.PDF}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326038/work_experience_certificates_c1c8404d-5eb8-4df3-9e60-0cf6feb4263b.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326038/aadhar_029c03e2-a98c-44ee-84a2-495a1659c23c.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326038/signature_cfee469c-60a8-48a6-80e4-4cad04ad8308.png}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326038/profile_image_045be99d-d8aa-4a80-b577-57ed7c112b57.png}
110	116	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326030/class_10th_marksheet_4fed5d3e-49d7-4274-bbaa-476f4fe5101e.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326030/class_12th_marksheet_dfa7e67d-a5c5-4294-81c7-e21576522c1c.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326030/graduation_marksheet_70251bff-7456-4ab6-9bfe-08daf74a3c63.jpg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326030/work_experience_certificates_c7673e17-d3ce-4ab3-a2f4-4bd4e38a0240.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326030/aadhar_88f77e24-03c4-4bae-911f-0f87cd177b3b.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326030/signature_7213542d-0785-4920-b57e-0bd49e5a8496.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326030/profile_image_44fa2bdb-38de-4cd9-b602-b6a3b245c7b2.jpg}
98	103	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326022/class_10th_marksheet_914efb4b-9a4c-4906-a667-11d011c60f2e.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326022/class_12th_marksheet_d3d87c39-0fc5-40d6-be3d-f8caed410e04.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326022/graduation_marksheet_155e021d-4aab-4c3a-bcd2-c4650289f36e.jpg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326022/graduation_marksheet_44d64d69-261a-4b04-8c91-7be5f34ba359.jpg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326022/graduation_marksheet_4b8aa355-41e5-499b-9dd0-5759a765a055.jpg}	\N	\N	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326022/aadhar_ea1a2027-9761-4724-8590-1f86ffe82a96.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326022/signature_9b907686-3f18-4cdd-aa54-ca9bc59400b5.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326022/profile_image_16f84778-56e9-46dc-9275-d8df6074a9b7.jpg}
90	95	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326016/class_10th_marksheet_5cf12aa6-6f3f-4a8b-9217-858331042205.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326016/class_12th_marksheet_40fc8ed1-23ce-406f-9bde-9a8d4f0ac3e8.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326016/graduation_marksheet_a51e1239-fcad-4693-b3f3-922ff13d7390.jpg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326016/graduation_marksheet_a617214f-1047-4956-a411-9aacb33b3906.jpg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326016/work_experience_certificates_44c9efb3-2fa6-4032-b710-a7b973681cf8.jpeg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326016/work_experience_certificates_4f9b0ace-3bfc-40ca-97ab-b7c4758769e4.jpeg,https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326016/work_experience_certificates_f86d6c3d-b509-47c1-ac62-b9d2a14859e7.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326016/aadhar_4bc69aa8-b938-4804-a699-9f4483dc6f88.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326016/signature_802db55d-7dd0-44ba-880d-fc91dedc08e8.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326016/profile_image_85fc3a6b-4dda-4bf0-af39-78c7c34c5e8b.jpg}
81	86	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226017/class_10th_marksheet_349480fb-096e-4af5-be96-5a618e2fac43.png}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226017/class_12th_marksheet_b48c21b8-6f09-4690-853f-1fa7d9449a94.png}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226017/graduation_marksheet_f65938c3-7b9f-4a95-a6bb-3e63db3f712f.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226017/work_experience_certificates_d6cf1e61-679d-49e3-ac5a-dc1c410de93e.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226017/aadhar_b32021e7-200d-4a6c-aaec-c8f2965a3ec6.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226017/signature_aef62a6d-ae0e-49e3-91f7-231ce0300a8c.png}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226017/profile_image_10c29e64-ede1-46a5-9663-2b8cc8723a54.jpg}
137	143	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326050/class_10th_marksheet_aaebef75-1cd8-4bcd-8ff1-78045cead37f.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326050/class_12th_marksheet_5fb59eac-7bdc-43e0-81e9-f63b2c1fda50.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326050/graduation_marksheet_d1989d69-89e5-4f1e-b4bf-3b89cc7777ab.pdf}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326050/work_experience_certificates_22b89256-d280-4519-bbb7-540ddfac5955.jpg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326050/aadhar_ba05ff46-5d27-4101-ab77-0b73721f31a1.pdf}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326050/signature_00db6399-38b0-40e3-b53e-96cc34294200.jpg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500136/X0326050/profile_image_3fe2f352-ef50-47a8-b399-f04ae6ace4a1.jpg}
69	74	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226013/class_10th_marksheet_6b7a5a4b-8834-4c70-9eaa-00d7f86ed485.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226013/class_12th_marksheet_3e16003a-7505-4955-a550-cb83afb58b26.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226013/graduation_marksheet_fff7b3a8-62e3-41c9-8b1c-8a0d74d0bca3.jpeg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226013/work_experience_certificates_02ade546-82a3-44ec-bbb0-d85650d32ad7.jpeg}	\N	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226013/aadhar_b70c3ae4-cf82-4f0c-8860-6cbe9c0b1e57.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226013/signature_2c18cb89-63ea-4e35-afda-02b11f6c6186.jpeg}	{https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/student-documents/1500132/X0226013/profile_image_184b2454-f1de-40b2-acfa-312282223158.jpeg}
\.


--
-- Data for Name: exam_timetables; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exam_timetables (id, exam_id, course_id, component_id, exam_date, start_time, end_time, created_at, updated_at) FROM stdin;
4	1	1	1	2026-02-10	11:00:00.514	01:00:00.514	2026-02-07 10:20:33.161016	2026-02-07 10:20:33.161026
5	3	1	1	2026-02-21	09:00:00.427	09:00:00.427	2026-02-11 05:38:16.363503	2026-02-11 05:38:16.363517
\.


--
-- Data for Name: exams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exams (id, scheme_id, exam_name, exam_type, month_year, is_published, created_at, updated_at, semester_id) FROM stdin;
1	1	Semesters	regular	JAN 2025	t	2026-02-07 09:22:22.093175	2026-02-07 09:23:05.473245	1
3	1	Maths	Semester	JAN-2025	t	2026-02-11 05:37:25.435421	2026-02-11 05:37:25.435438	1
\.


--
-- Data for Name: fee_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fee_details (id, programe_id, semester, application_fee, admission_fee, tuition_fee, exam_fee, lms_fee, lab_fee, total_fee, created_at, updated_at) FROM stdin;
115	1500038	Semester 1	500	1000	13750	500	500	2000	17750	2025-09-26 07:30:38.832647	2025-09-26 07:30:38.832651
116	1500038	Semester 2	0	0	13750	500	500	0	14750	2025-09-26 07:30:38.832653	2025-09-26 07:30:38.832654
117	1500038	Semester 3	0	0	13750	500	500	0	14750	2025-09-26 07:30:38.832655	2025-09-26 07:30:38.832656
118	1500038	Semester 4	0	0	13750	500	500	0	14750	2025-09-26 07:30:38.832657	2025-09-26 07:30:38.832658
119	1500038	Semester 5	0	0	13750	500	500	0	14750	2025-09-26 07:30:38.832659	2025-09-26 07:30:38.83266
120	1500038	Semester 6	0	0	13750	500	500	0	14750	2025-09-26 07:30:38.832661	2025-09-26 07:30:38.832662
121	1500132	Semester 1	500	0	20000	0	0	0	20500	\N	\N
122	1500136	Semester 1	500	0	20000	0	0	0	20500	\N	\N
123	1500130	Semester 1	500	0	20000	0	0	0	20500	\N	\N
124	1500033	semester 1	500	0	20000	0	0		20500	2026-03-13 07:52:59.407626	2026-03-13 07:52:59.407634
\.


--
-- Data for Name: group_permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.group_permission (group_id, permission_id) FROM stdin;
\.


--
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.groups (id, name) FROM stdin;
1	Admin
2	Student
3	Faculty
4	testdata
6	testdata2
5	test23
\.


--
-- Data for Name: hsc_board; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hsc_board (id, name, created_at, updated_at) FROM stdin;
12937	Central Board Of Secondary Education (CBSE)	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12938	Council Of Indian School Certificate Examination (CISCE/ISC)	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12939	Aligarh Muslim University	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12940	Andhra Pradesh Board Of Intermediate Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12941	Assam Higher Secondary Education Council	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12942	Bihar Intermediate Education Council	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12943	Bihar School Examination Board	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12944	Cambridge University	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12945	Chhatisgarh Board Of Secondary Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12946	Goa Board Of Secondary And Higher Secondary Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12947	Gujarat Secondary And Higher Secondary Education Board	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12948	Haryana Board Of Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12949	Himachal Pradesh Board Of School Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12950	International Baccalaureate	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12951	J And K State Board Of School Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12952	Jharkhand Academic Council	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12953	Karnataka Board Of The Pre-University Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12954	Kerala Board Of Higher Secondary Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12955	Madhya Pradesh Board Of Secondary Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12956	Maharastra State Board Of Secondary And Higher Secondary Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12957	Manipur Council Of Higher Secondary Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12958	Meghalaya Board Of School Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12959	Mizoram Board Of School Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12960	Nagaland Board Of School Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12961	National Institute Of Open Schooling	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12962	Orissa Council Of Higher Secondary Education Bhubaneswar	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12963	Rajasthan Board Of Secondary Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12964	Tamil Nadu Board Of Secondary Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12965	Tripura Board Of Secondary Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12966	U.P. Board Of High School and Intermediate Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12967	Uttaranchal Shiksha Evam Pariksha Parishad	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12968	West Bengal Board Of Madrasa Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12969	West Bengal Council Of Higher Secondary Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
20127	Not specified/Any Other	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
20772	Punjab School Education Board	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
35214	Telangana Board Of Intermediate Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
186139	Other	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
196782	Banasthali Vidyapith	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
196783	Kerala Board of Public Examination	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
202443	Board of Vocational Higher Secondary Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
204563	Dayalbagh Educational Institute	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
242695	Uttarakhand Board of School Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
474197	IGSE Board	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
489020	AKTU UP	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
489021	Board of Technical Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
519943	Delhi Board of Senior Secondary Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
\.


--
-- Data for Name: lookup_master; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lookup_master (id, key, "values", category_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: main_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.main_groups (id, maincode, mainname, account_group_id) FROM stdin;
7	1	FIXED ASSETS	1
8	3	CURRENT ASSETS	1
9	4	LOANS AND ADVANCES	1
10	5	DEPOSITS	1
11	6	ADVANCES TO SUPPLIERS	1
12	7	ENDOWMENT FUND-FIXED DEPOSITS	1
13	8	EXCESS OF EXPENDITURE OVER INCOME	1
14	2	CAPITAL WORK IN PROGRESS	1
15	9	HOSPITAL ACCOUNT	1
16	1	SRI RAMACHANDRA EDUCATIONAL TRUST	2
17	2	ENDOWMENT FUND	2
18	4	CAUTION DEPOSIT	2
19	5	SUNDRY CREDITOR FOR EXPENSES	2
20	6	SUNDRY CREDITOR FOR OTHERS	2
21	7	SUNDRY CREDITOR FOR MATERIALS	2
22	8	DEPRECIATION RESERVE	2
23	9	EXCESS OF INCOME OVER EXPENDITURE	2
24	10	PRIOR YEAR INCOME	2
25	3	SECURED LOANS	2
26	1	COLLEGE RECEIPTS	3
27	2	OTHER RECEIPTS	3
28	3	PRIOR YEAR INCOME	3
29	1	CONSUMABLES	4
30	2	ADMINISTRATIVE EXPENSES	4
31	3	ESTABLISHMENT EXPENSES	4
32	4	MAINTENANCE EXPENSES	4
33	5	ELECTRICITY CHARGES	4
34	6	OTHER EXPENSES	4
35	7	EDUCATIONAL PROMOTIONAL EXPENSES	4
36	8	DEPRECIATION	4
37	9	PRIOR YEAR EXPENSES	4
\.


--
-- Data for Name: marks_entries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.marks_entries (id, student_id, exam_id, course_id, component_id, marks_obtained, entered_by, is_locked, created_at, updated_at) FROM stdin;
2	29	1	1	1	25	3	f	2026-02-13 09:49:49.472471	2026-02-13 09:49:49.472478
3	29	1	1	2	50	3	f	2026-02-13 10:14:35.775332	2026-02-13 10:14:35.775338
\.


--
-- Data for Name: menus; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.menus (id, name, icon, "to") FROM stdin;
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, student_id, payment_type, order_id, transaction_id, payment_date, payment_amount, is_offline, offline_transaction_id, offline_payment_method, offline_receipt_enabled, created_at, updated_at) FROM stdin;
34	29	semester_fee	4517_912_7	1756104891	2025-08-25 00:00:00	17750	f	\N	\N	f	2025-09-26 07:32:00.73324	2025-09-26 07:32:00.733242
35	30	application_fee	2385_912_7	pay_R24ILMSvsHSujj	2025-08-06 00:00:00	500	f	\N	\N	f	2025-09-26 07:32:00.750648	2025-09-26 07:32:00.75065
36	30	semester_fee	4916_912_7	pay_RDKrvGqp9HwKcI	2025-09-04 00:00:00	17750	f	\N	\N	f	2025-09-26 07:32:00.75361	2025-09-26 07:32:00.753613
37	31	application_fee	2640_912_7	pay_R2kwk6KjoKuoex	2025-08-08 00:00:00	500	f	\N	\N	f	2025-09-26 07:32:00.76208	2025-09-26 07:32:00.762082
38	31	semester_fee	5140_912_7	1757582939	2025-09-11 00:00:00	17750	f	\N	\N	f	2025-09-26 07:32:00.764797	2025-09-26 07:32:00.764799
39	32	application_fee	2655_912_7	pay_R2mqwAxs4N6uD0	2025-08-08 00:00:00	500	f	\N	\N	f	2025-09-26 07:32:00.77193	2025-09-26 07:32:00.771933
40	32	semester_fee	5139_912_7	1757582723	2025-09-11 00:00:00	17750	f	\N	\N	f	2025-09-26 07:32:00.774632	2025-09-26 07:32:00.774635
41	33	application_fee	4032_912_7	pay_R79u9W4ZOfeUHQ	2025-08-19 00:00:00	500	f	\N	\N	f	2025-09-26 07:32:00.781869	2025-09-26 07:32:00.781871
42	33	semester_fee	4034_912_7	pay_R7ACWI4s7UGFd1	2025-08-19 00:00:00	17750	f	\N	\N	f	2025-09-26 07:32:00.784593	2025-09-26 07:32:00.784595
43	34	application_fee	4043_912_7	pay_R7Bqqmhykbmlzn	2025-08-19 00:00:00	500	f	\N	\N	f	2025-09-26 07:32:00.791849	2025-09-26 07:32:00.791852
44	34	semester_fee	4736_912_7	pay_RAMuDfJeLap1zI	2025-08-27 00:00:00	17750	f	\N	\N	f	2025-09-26 07:32:00.794613	2025-09-26 07:32:00.794615
45	35	application_fee	4846_912_7	pay_RCGtNzFdmgeorL	2025-09-01 00:00:00	500	f	\N	\N	f	2025-09-26 07:32:00.801738	2025-09-26 07:32:00.80174
46	35	semester_fee	4895_912_7	pay_RCya1ciFhSLlwQ	2025-09-03 00:00:00	17750	f	\N	\N	f	2025-09-26 07:32:00.804097	2025-09-26 07:32:00.8041
47	36	application_fee	4923_912_7	pay_RDP9A7gNoHG2f1	2025-09-04 00:00:00	500	f	\N	\N	f	2025-09-26 07:32:00.811201	2025-09-26 07:32:00.811204
48	36	semester_fee	4925_912_7	pay_RDPOpx7Bgv7bgw	2025-09-04 00:00:00	17750	f	\N	\N	f	2025-09-26 07:32:00.813631	2025-09-26 07:32:00.813634
49	37	application_fee	4865_912_7	pay_RCbxpzZJRLFFY6	2025-09-02 00:00:00	500	f	\N	\N	f	2025-09-26 07:32:00.820619	2025-09-26 07:32:00.820622
50	37	semester_fee	4866_912_7	pay_RCcCLKGpKDMtBu	2025-09-02 00:00:00	17750	f	\N	\N	f	2025-09-26 07:32:00.823111	2025-09-26 07:32:00.823113
53	39	application_fee	4933_912_7	pay_RDS4FNQFdmvMjE	2025-09-04 00:00:00	500	f	\N	\N	f	2025-09-29 09:51:31.684777	2025-09-29 09:51:31.68478
54	39	semester_fee	5400_912_7	pay_RMYMSASNdjG5Im	2025-09-27 00:00:00	17750	f	\N	\N	f	2025-09-29 09:51:31.691969	2025-09-29 09:51:31.691972
55	42	application_fee	5166_912_7	pay_RGeWL8pFaf0ik3	2025-09-12 00:00:00	500	f	\N	\N	f	2025-09-29 10:04:17.201454	2025-09-29 10:04:17.201457
56	42	semester_fee	5225_912_7	pay_RHlvPHQ40mbz51	2025-09-15 00:00:00	17750	f	\N	\N	f	2025-09-29 10:04:17.208753	2025-09-29 10:04:17.208756
57	43	application_fee	5371_912_7	pay_RLOrzOWjO2krlE	2025-09-24 00:00:00	500	f	\N	\N	f	2025-09-29 10:04:17.22088	2025-09-29 10:04:17.220883
58	43	semester_fee	5410_912_7	pay_RMe405MKde9wEr	2025-09-27 00:00:00	17750	f	\N	\N	f	2025-09-29 10:04:17.223511	2025-09-29 10:04:17.223513
59	45	application_fee	5313_912_7	pay_RJlnwfUfbUOc4x	2025-09-20 00:00:00	500	f	\N	\N	f	2025-10-07 07:24:30.406411	2025-10-07 07:24:30.406414
60	46	application_fee	5461_912_7	pay_RP4Z0c0GUYIZKi	2025-10-03 00:00:00	500	f	\N	\N	f	2025-10-07 07:24:30.442748	2025-10-07 07:24:30.442751
61	46	semester_fee	5462_912_7	pay_RP4oURZ3oZs2pU	2025-10-03 00:00:00	17750	f	\N	\N	f	2025-10-07 07:24:30.446368	2025-10-07 07:24:30.446371
62	47	application_fee	5397_912_7	pay_RMAEV1CWHBPG9E	2025-09-26 00:00:00	500	f	\N	\N	f	2025-10-07 07:24:30.459307	2025-10-07 07:24:30.459309
63	47	semester_fee	5398_912_7	pay_RMBLficLXULSe1	2025-09-26 00:00:00	17750	f	\N	\N	f	2025-10-07 07:24:30.462476	2025-10-07 07:24:30.462479
64	48	application_fee	5428_912_7	pay_RNqLBj9fz9qLM8	2025-09-30 00:00:00	500	f	\N	\N	f	2025-10-07 07:24:30.470154	2025-10-07 07:24:30.470157
65	48	semester_fee	5472_912_7	pay_RPiLfCmGTkg6n2	2025-10-05 00:00:00	17750	f	\N	\N	f	2025-10-07 07:24:30.474181	2025-10-07 07:24:30.474184
66	49	application_fee	5465_912_7	pay_RPGvgMFzuoamOT	2025-10-04 00:00:00	500	f	\N	\N	f	2025-10-07 07:24:30.481813	2025-10-07 07:24:30.481816
67	49	semester_fee	5467_912_7	pay_RPMEy0Gdo6WkpQ	2025-10-04 00:00:00	17750	f	\N	\N	f	2025-10-07 07:24:30.486013	2025-10-07 07:24:30.486015
68	50	application_fee	5449_912_7	pay_ROwww7g2eD0ZPo	2025-10-03 00:00:00	500	f	\N	\N	f	2025-10-07 07:24:30.493678	2025-10-07 07:24:30.49368
69	50	semester_fee	5481_912_7	pay_RQ9oUv4iUiaj4I	2025-10-06 00:00:00	17750	f	\N	\N	f	2025-10-07 07:24:30.496824	2025-10-07 07:24:30.496826
70	51	application_fee	5490_912_7	pay_RQgghgBo2HCb4B	2025-10-08 00:00:00	500	f	\N	\N	f	2025-10-14 04:14:12.946896	2025-10-14 04:14:12.946899
71	51	semester_fee	5556_912_7	pay_RSegHUmxbcH2rJ	2025-10-12 00:00:00	17750	f	\N	\N	f	2025-10-14 04:14:12.955313	2025-10-14 04:14:12.955315
72	52	application_fee	5354_912_7	pay_RL02ZZUzCbzUHj	2025-09-23 00:00:00	500	f	\N	\N	f	2025-10-14 10:21:34.938068	2025-10-14 10:21:34.938071
73	52	semester_fee	5580_912_7	pay_RTFRPxCj4M2Uuy	2025-10-14 00:00:00	17750	f	\N	\N	f	2025-10-14 10:21:34.948266	2025-10-14 10:21:34.948269
74	53	application_fee	5380_912_7	pay_RLnQkvrWB5WABN	2025-09-25 00:00:00	500	f	\N	\N	f	2025-10-14 10:21:34.960531	2025-10-14 10:21:34.960533
75	53	semester_fee	5579_912_7	pay_RTFVbX3X6DzN9N	2025-10-14 00:00:00	17750	f	\N	\N	f	2025-10-14 10:21:34.963391	2025-10-14 10:21:34.963393
76	54	application_fee	5523_912_7	pay_RRGfjmnOSxrC1p	2025-10-09 00:00:00	500	f	\N	\N	f	2025-10-14 10:21:34.982816	2025-10-14 10:21:34.982819
77	54	semester_fee	5581_912_7	pay_RTG1IVEHr96og7	2025-10-14 00:00:00	17750	f	\N	\N	f	2025-10-14 10:21:34.985473	2025-10-14 10:21:34.985476
78	55	application_fee	5611_912_7	pay_RTo5X4tc60hIqY	2025-10-15 00:00:00	500	f	\N	\N	f	2025-10-16 04:06:05.057124	2025-10-16 04:06:05.057126
79	55	semester_fee	5613_912_7	pay_RTzvcthMCo3x1P	2025-10-16 00:00:00	17750	f	\N	\N	f	2025-10-16 04:06:05.06723	2025-10-16 04:06:05.067233
80	56	application_fee	5606_912_7	pay_RTkOyqzuesKXPV	2025-10-15 00:00:00	500	f	\N	\N	f	2025-10-17 05:04:34.467143	2025-10-17 05:04:34.467146
81	56	semester_fee	5617_912_7	pay_RU3GhKenApNUtL	2025-10-16 00:00:00	17750	f	\N	\N	f	2025-10-17 05:04:34.477567	2025-10-17 05:04:34.47757
84	58	application_fee	6635_912_7	pay_Rp4FMAHYFhzPz0	2025-12-08 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.621603	2025-12-27 05:16:55.621606
85	58	semester_fee	6636_912_7	pay_Rp4kyCe5RHrrHz	2025-12-08 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.624655	2025-12-27 05:16:55.624658
86	59	application_fee	5339_912_7	pay_RKjNzPvFif3Ijz	2025-09-22 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.634822	2025-12-27 05:16:55.634826
87	59	semester_fee	5422_912_7	pay_RNUYatjKP6iSn4	2025-09-29 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.63746	2025-12-27 05:16:55.637463
88	60	application_fee	6469_912_7	pay_RnCODz7QrHXKe1	2025-12-03 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.644889	2025-12-27 05:16:55.644892
89	60	semester_fee	6723_912_7	pay_RpzgCr7zHHe5c6	2025-12-10 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.647445	2025-12-27 05:16:55.647448
90	61	application_fee	5544_912_7	pay_RRqi5IqitfP7fK	2025-10-10 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.654831	2025-12-27 05:16:55.654834
91	61	semester_fee	5633_912_7	pay_RUsZ7ZE3AdoadX	2025-10-18 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.657398	2025-12-27 05:16:55.657402
92	62	application_fee	5682_912_7	pay_RXWUKfVJyZK4F2	2025-10-25 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.66463	2025-12-27 05:16:55.664633
93	62	semester_fee	5874_912_7	pay_RcgxN8ljtvEcjc	2025-11-07 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.667229	2025-12-27 05:16:55.667232
94	63	application_fee	5781_912_7	pay_RaM6zXQOhACi1q	2025-11-01 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.674387	2025-12-27 05:16:55.674391
95	63	semester_fee	7220_912_7	pay_Rv2uyT1uyNyaeM	2025-12-23 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.676723	2025-12-27 05:16:55.676726
96	64	application_fee	5967_912_7	pay_RdzHp4KDwTSDeL	2025-11-10 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.683761	2025-12-27 05:16:55.683764
97	64	semester_fee	6248_912_7	pay_RkfLbJktzFXwJK	2025-11-27 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.686048	2025-12-27 05:16:55.686051
98	65	application_fee	5935_912_7	pay_Rdf2QdFdukp4y8	2025-11-09 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.69319	2025-12-27 05:16:55.693193
99	65	semester_fee	6265_912_7	pay_RknfHnZWyHpgrR	2025-11-27 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.695652	2025-12-27 05:16:55.695655
100	66	application_fee	7194_912_7	pay_Ruf3Vgh3N9ctO0	2025-12-22 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.702805	2025-12-27 05:16:55.702809
101	66	semester_fee	7251_912_7	pay_Rw4mBSPBMvLa6r	2025-12-26 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.705102	2025-12-27 05:16:55.705105
102	67	application_fee	5908_912_7	pay_RdHUDj9QQNxvT3	2025-11-08 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.712159	2025-12-27 05:16:55.712162
103	67	semester_fee	6264_912_7	pay_Rknfgc7MaZ14Df	2025-11-27 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.714612	2025-12-27 05:16:55.714616
104	68	application_fee	5876_912_7	pay_RcjPlr5HQJi9gT	2025-11-07 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.72176	2025-12-27 05:16:55.721764
105	68	semester_fee	6093_912_7	pay_RgmmFL7yUFYfWT	2025-11-17 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.724125	2025-12-27 05:16:55.724128
106	69	application_fee	5898_912_7	pay_Rd7fQyAMomyyu6	2025-11-08 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.73113	2025-12-27 05:16:55.731134
107	69	semester_fee	6096_912_7	pay_RgnQOD7XJLZ0Dd	2025-11-17 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.733466	2025-12-27 05:16:55.733469
108	70	application_fee	5941_912_7	pay_RdiIy88PZGkQeI	2025-11-09 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.740492	2025-12-27 05:16:55.740495
109	70	semester_fee	6095_912_7	pay_RgnIYsnxvYeJty	2025-11-17 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.742777	2025-12-27 05:16:55.74278
110	71	application_fee	7053_912_7	pay_RsD2PVaqwyv8bM	2025-12-16 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.749765	2025-12-27 05:16:55.749768
111	71	semester_fee	7185_912_7	pay_RubOg8UBoJukvX	2025-12-22 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.752092	2025-12-27 05:16:55.752095
112	72	application_fee	5996_912_7	pay_ReP3zIjhsmWmOB	2025-11-11 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.759171	2025-12-27 05:16:55.759174
113	72	semester_fee	6740_912_7	pay_RqFdwif9CDsunQ	2025-12-11 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.761498	2025-12-27 05:16:55.761501
114	73	application_fee	6109_912_7	pay_RhAhEpLiyAhgtw	2025-11-18 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.768517	2025-12-27 05:16:55.768543
115	73	semester_fee	6734_912_7	pay_RqDsvcYQPUovlt	2025-12-11 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.770861	2025-12-27 05:16:55.770864
116	74	application_fee	6060_912_7	pay_Rg1oKhBT2e5OEj	2025-11-15 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.777842	2025-12-27 05:16:55.777845
117	74	semester_fee	6120_912_7	pay_RhV1KWNnZIAFP8	2025-11-19 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.780163	2025-12-27 05:16:55.780166
118	75	application_fee	6233_912_7	pay_RkGuC7mraYUzrf	2025-11-26 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.787167	2025-12-27 05:16:55.78717
119	75	semester_fee	6312_912_7	pay_RlUpv8QBh46Z01	2025-11-29 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.789502	2025-12-27 05:16:55.789505
120	76	application_fee	6136_912_7	pay_Ri1v9X4bxK4MF7	2025-11-20 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.796602	2025-12-27 05:16:55.796605
121	76	semester_fee	6933_912_7	pay_RrkXGwqvfx1heu	2025-12-15 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.798944	2025-12-27 05:16:55.798947
122	77	application_fee	6055_912_7	pay_RfuidtUSnHzAwZ	2025-11-15 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.805928	2025-12-27 05:16:55.805931
123	77	semester_fee	6307_912_7	pay_RlRhcOOdigwqe6	2025-11-29 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.80822	2025-12-27 05:16:55.808223
124	78	application_fee	6059_912_7	pay_Rg0U9Gn2Qo9ZKR	2025-11-15 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.815229	2025-12-27 05:16:55.815232
125	78	semester_fee	6102_912_7	pay_Rh3WowsJSgLVJn	2025-11-18 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.817485	2025-12-27 05:16:55.817488
126	79	application_fee	6100_912_7	pay_RguYD3SSgTVirn	2025-11-18 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.824375	2025-12-27 05:16:55.824379
127	79	semester_fee	6116_912_7	pay_RhSniWmJxKXJNF	2025-11-19 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.826742	2025-12-27 05:16:55.826745
128	80	application_fee	6145_912_7	pay_RiJ3CtVq7rqs6o	2025-11-21 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.833668	2025-12-27 05:16:55.833672
129	80	semester_fee	6181_912_7	pay_RjCYd1fQMRKHF0	2025-11-23 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.83597	2025-12-27 05:16:55.835974
130	81	application_fee	6696_912_7	pay_RpkG7KxoRHNB5w	2025-12-10 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.842989	2025-12-27 05:16:55.842992
131	81	semester_fee	7085_912_7	pay_Rsk5fnY7cEhss2	2025-12-17 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.845301	2025-12-27 05:16:55.845303
132	82	application_fee	6283_912_7	pay_Rl3jnLfILobXMY	2025-11-28 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.852339	2025-12-27 05:16:55.852343
133	82	semester_fee	6285_912_7	pay_Rl4PzH4jVOXmwT	2025-11-28 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.854783	2025-12-27 05:16:55.854786
134	83	application_fee	6275_912_7	pay_Rl2kPZqpWiElMd	2025-11-28 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.861899	2025-12-27 05:16:55.861902
135	83	semester_fee	6281_912_7	pay_Rl3KQydoOLWzQN	2025-11-28 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.86427	2025-12-27 05:16:55.864273
136	84	application_fee	6104_912_7	pay_Rh5xegbdVcCeQN	2025-11-18 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.871435	2025-12-27 05:16:55.871438
137	84	semester_fee	6105_912_7	pay_Rh6KzhcIxe3wpo	2025-11-18 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.873753	2025-12-27 05:16:55.873756
138	85	application_fee	6108_912_7	pay_Rh8S3I9H0l6FAz	2025-11-18 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.880901	2025-12-27 05:16:55.880905
139	85	semester_fee	6219_912_7	pay_Rjvjfnj44GSyGK	2025-11-25 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.883272	2025-12-27 05:16:55.883276
140	86	application_fee	6128_912_7	pay_RhjCMdVW91xUAC	2025-11-20 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.890216	2025-12-27 05:16:55.890219
141	86	semester_fee	6130_912_7	pay_RhsQg2K3S7rhbs	2025-11-26 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.892508	2025-12-27 05:16:55.892511
142	87	application_fee	6288_912_7	pay_Rl7fYdtip5Wa2K	2025-11-28 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.899601	2025-12-27 05:16:55.899604
143	87	semester_fee	7209_912_7	pay_RuwwaK0Tt9QN8M	2025-12-23 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.901895	2025-12-27 05:16:55.901898
144	88	application_fee	6125_912_7	pay_RhdzaqDV17OhZr	2025-11-19 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.908957	2025-12-27 05:16:55.90896
145	88	semester_fee	6309_912_7	pay_RlT9k1IqeOXxfi	2025-11-29 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.911214	2025-12-27 05:16:55.911217
146	89	application_fee	6209_912_7	pay_RjrIGZ1BYnMFup	2025-11-25 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.91818	2025-12-27 05:16:55.918183
147	89	semester_fee	6211_912_7	pay_Rjrbj6ql17PgoJ	2025-11-25 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.920565	2025-12-27 05:16:55.920568
148	90	application_fee	6218_912_7	pay_Rjv0B9VKs6Fv8H	2025-11-25 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.927632	2025-12-27 05:16:55.927635
149	90	semester_fee	6736_912_7	pay_RqEmt7eFxGtAeQ	2025-12-11 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.929982	2025-12-27 05:16:55.929985
150	91	application_fee	6163_912_7	pay_RipEPV3XXE1AvS	2025-11-22 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.937014	2025-12-27 05:16:55.937017
151	91	semester_fee	6190_912_7	pay_RjRIHBcgVeAqh7	2025-11-24 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.939389	2025-12-27 05:16:55.939393
152	92	application_fee	6170_912_7	pay_Rj3RgPaJAUZ1Ud	2025-11-23 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.946787	2025-12-27 05:16:55.946791
153	92	semester_fee	7133_912_7	pay_RtRoSSmw5uBjBJ	2025-12-19 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.949158	2025-12-27 05:16:55.949161
154	93	application_fee	6613_912_7	pay_RohhkBt5RGvb74	2025-12-07 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.956374	2025-12-27 05:16:55.956377
155	93	semester_fee	6626_912_7	pay_RoypmCc6PKamUU	2025-12-08 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.958796	2025-12-27 05:16:55.958799
156	94	application_fee	6674_912_7	pay_RpUCYGvppg9OgE	2025-12-09 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.965913	2025-12-27 05:16:55.965916
157	94	semester_fee	6803_912_7	pay_RqyFcCsdxxwqTn	2025-12-13 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.968242	2025-12-27 05:16:55.968245
158	95	application_fee	6990_912_7	pay_Rru67pCYFSk1qA	2025-12-15 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.975476	2025-12-27 05:16:55.97548
159	95	semester_fee	7048_912_7	pay_RsBXSgNl3VOgzA	2025-12-16 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.97809	2025-12-27 05:16:55.978093
160	96	application_fee	6212_912_7	pay_Rjri15UKf5gsKD	2025-11-25 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.98523	2025-12-27 05:16:55.985233
161	96	semester_fee	6213_912_7	pay_Rjs7IFDSru64dM	2025-11-25 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.987558	2025-12-27 05:16:55.987561
162	97	application_fee	6308_912_7	pay_RlSqCybUqAEeXn	2025-11-29 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:55.994626	2025-12-27 05:16:55.994629
163	97	semester_fee	6374_912_7	pay_RmMmt9Lvu1Bxhq	2025-12-01 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:55.996975	2025-12-27 05:16:55.996978
164	98	application_fee	7046_912_7	pay_RsB8icHd67w1wS	2025-12-17 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:56.004075	2025-12-27 05:16:56.004078
165	98	semester_fee	7091_912_7	pay_Rsz1T1X3AkX8uc	2025-12-24 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:56.006396	2025-12-27 05:16:56.006399
166	99	application_fee	7184_912_7	pay_RuahFG7P9vChET	2025-12-22 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:56.01354	2025-12-27 05:16:56.013543
167	99	semester_fee	7186_912_7	pay_RubURa10U5Dlc8	2025-12-22 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:56.016033	2025-12-27 05:16:56.016036
168	100	application_fee	6286_912_7	pay_Rl5MXfq9VOQ0Sv	2025-11-28 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:56.024822	2025-12-27 05:16:56.024825
169	100	semester_fee	6869_912_7	pay_RrRYgfzeiibzGe	2025-12-14 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:56.027894	2025-12-27 05:16:56.027897
170	101	application_fee	6289_912_7	pay_Rl8XVw0YHR5Jqo	2025-11-28 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:56.036266	2025-12-27 05:16:56.036269
171	101	semester_fee	6625_912_7	pay_Roydp1Mxc63Cbb	2025-12-08 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:56.03942	2025-12-27 05:16:56.039424
172	102	application_fee	6301_912_7	pay_RlFASkPPXaUXW8	2025-11-28 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:56.048082	2025-12-27 05:16:56.048085
173	102	semester_fee	6357_912_7	pay_RmC9kDVLW33a9x	2025-12-01 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:56.051174	2025-12-27 05:16:56.051177
174	103	application_fee	6358_912_7	pay_RmDogCPku3n3PR	2025-12-01 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:56.059869	2025-12-27 05:16:56.059873
175	103	semester_fee	7216_912_7	pay_Rv0VEShBHhcpwu	2025-12-23 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:56.063214	2025-12-27 05:16:56.063219
176	104	application_fee	6461_912_7	pay_RnAgOr1HUq1KV3	2025-12-03 00:00:00	500	f	\N	\N	f	2025-12-27 05:16:56.072116	2025-12-27 05:16:56.072119
177	104	semester_fee	6711_912_7	pay_RpsTETf2tCLYuf	2025-12-10 00:00:00	20000	f	\N	\N	f	2025-12-27 05:16:56.075306	2025-12-27 05:16:56.075309
179	106	application_fee	6571_912_7	pay_RoI8nu6Juk0oFW	2025-12-06 00:00:00	500	f	\N	\N	f	2025-12-27 05:25:59.560411	2025-12-27 05:25:59.560415
180	106	semester_fee	6815_912_7	pay_Rr1PVwVNEZ0rPN	2025-12-13 00:00:00	20000	f	\N	\N	f	2025-12-27 05:25:59.568029	2025-12-27 05:25:59.568033
181	107	application_fee	7079_912_7	pay_RsbRsIBARI2cxM	2025-12-17 00:00:00	500	f	\N	\N	f	2025-12-27 05:25:59.579926	2025-12-27 05:25:59.57993
182	107	semester_fee	7120_912_7	pay_RtM9Ug7ilKLoWL	2025-12-19 00:00:00	20000	f	\N	\N	f	2025-12-27 05:25:59.582772	2025-12-27 05:25:59.582775
183	108	application_fee	6410_912_7	pay_Rmh2hNBR4fChRu	2025-12-02 00:00:00	500	f	\N	\N	f	2025-12-27 05:25:59.590383	2025-12-27 05:25:59.590386
184	108	semester_fee	6500_912_7	pay_RnZVTmI1KFhlaa	2025-12-04 00:00:00	20000	f	\N	\N	f	2025-12-27 05:25:59.593107	2025-12-27 05:25:59.59311
185	109	application_fee	6407_912_7	pay_RmeuGAcmCh7T31	2025-12-02 00:00:00	500	f	\N	\N	f	2025-12-27 05:25:59.600827	2025-12-27 05:25:59.60083
186	109	semester_fee	7228_912_7	pay_RvNC7Q59PhWZGX	2025-12-24 00:00:00	20000	f	\N	\N	f	2025-12-27 05:25:59.60342	2025-12-27 05:25:59.603423
187	110	application_fee	7256_912_7	pay_Rw8XEkEa5WUCh0	2025-12-26 00:00:00	500	f	\N	\N	f	2025-12-27 05:25:59.610827	2025-12-27 05:25:59.61083
188	110	semester_fee	7269_912_7	pay_RwU2IFr8vbtRWh	2025-12-27 00:00:00	20000	f	\N	\N	f	2025-12-27 05:25:59.613408	2025-12-27 05:25:59.613411
189	111	application_fee	6483_912_7	pay_RnUNnTdXyqkTTf	2025-12-04 00:00:00	500	f	\N	\N	f	2025-12-27 05:25:59.620983	2025-12-27 05:25:59.620986
190	111	semester_fee	7159_912_7	pay_RtqenHZpfSYQvr	2025-12-20 00:00:00	20000	f	\N	\N	f	2025-12-27 05:25:59.623542	2025-12-27 05:25:59.623545
191	112	application_fee	6518_912_7	pay_Rno4YR0Kifaqzw	2025-12-05 00:00:00	500	f	\N	\N	f	2025-12-27 05:25:59.630774	2025-12-27 05:25:59.630777
192	112	semester_fee	6519_912_7	pay_RnoRMxptEjzldk	2025-12-05 00:00:00	20000	f	\N	\N	f	2025-12-27 05:25:59.633182	2025-12-27 05:25:59.633185
193	113	application_fee	6563_912_7	pay_RoEOE3L5ksnBOX	2025-12-06 00:00:00	500	f	\N	\N	f	2025-12-27 05:25:59.640755	2025-12-27 05:25:59.640758
194	113	semester_fee	6627_912_7	pay_RozrWc6PcR4E2D	2025-12-08 00:00:00	20000	f	\N	\N	f	2025-12-27 05:25:59.64357	2025-12-27 05:25:59.643573
195	114	application_fee	6717_912_7	pay_RpxdXfmSAMN86D	2025-12-10 00:00:00	500	f	\N	\N	f	2025-12-27 05:25:59.651319	2025-12-27 05:25:59.651322
196	114	semester_fee	7070_912_7	pay_RsLz33fk0DKcuQ	2025-12-16 00:00:00	20000	f	\N	\N	f	2025-12-27 05:25:59.654212	2025-12-27 05:25:59.654215
197	115	application_fee	6550_912_7	pay_RnxNgZzPgOXp6N	2025-12-05 00:00:00	500	f	\N	\N	f	2025-12-27 05:25:59.662155	2025-12-27 05:25:59.662158
198	115	semester_fee	6751_912_7	pay_RqLHx3bMukPJzc	2025-12-11 00:00:00	20000	f	\N	\N	f	2025-12-27 05:25:59.665082	2025-12-27 05:25:59.665085
199	116	application_fee	7024_912_7	pay_RryOt4x1Xj6qzc	2025-12-15 00:00:00	500	f	\N	\N	f	2025-12-27 05:25:59.672873	2025-12-27 05:25:59.672876
200	116	semester_fee	7081_912_7	pay_Rsewnel3W2nGQJ	2025-12-17 00:00:00	20000	f	\N	\N	f	2025-12-27 05:25:59.675717	2025-12-27 05:25:59.675721
201	117	application_fee	6747_912_7	pay_RqJV1Xlt8E5Wft	2025-12-11 00:00:00	500	f	\N	\N	f	2025-12-27 05:25:59.68352	2025-12-27 05:25:59.683524
202	117	semester_fee	6965_912_7	pay_Rrq9ORJQKTENVT	2025-12-15 00:00:00	20000	f	\N	\N	f	2025-12-27 05:25:59.686412	2025-12-27 05:25:59.686415
203	118	application_fee	6608_912_7	pay_RoerbfBxUY4XRW	2025-12-07 00:00:00	500	f	\N	\N	f	2025-12-27 05:25:59.69423	2025-12-27 05:25:59.694233
204	118	semester_fee	6799_912_7	pay_RqvK46M8SbxLp1	2025-12-13 00:00:00	20000	f	\N	\N	f	2025-12-27 05:25:59.697128	2025-12-27 05:25:59.697131
205	119	application_fee	6745_912_7	pay_RqIjruKYB244hA	2025-12-11 00:00:00	500	f	\N	\N	f	2025-12-27 05:25:59.704912	2025-12-27 05:25:59.704915
206	119	semester_fee	7139_912_7	pay_RtU0c0kupi0Vd3	2025-12-19 00:00:00	20000	f	\N	\N	f	2025-12-27 05:25:59.707759	2025-12-27 05:25:59.707762
207	120	application_fee	6763_912_7	pay_RqZXRP93M6Rvk1	2025-12-12 00:00:00	500	f	\N	\N	f	2025-12-27 05:25:59.715544	2025-12-27 05:25:59.715547
208	120	semester_fee	7130_912_7	pay_RtPnZTi8ePBEKx	2025-12-19 00:00:00	20000	f	\N	\N	f	2025-12-27 05:25:59.718383	2025-12-27 05:25:59.718386
209	121	application_fee	6950_912_7	pay_RrnwtHL35dt4Tw	2025-12-15 00:00:00	500	f	\N	\N	f	2025-12-27 05:25:59.726304	2025-12-27 05:25:59.726307
210	121	semester_fee	7039_912_7	pay_Rs8pcggcm4Mcei	2025-12-16 00:00:00	20000	f	\N	\N	f	2025-12-27 05:25:59.72916	2025-12-27 05:25:59.729163
211	122	application_fee	6729_912_7	pay_RqBKdBoqWZfqLW	2025-12-11 00:00:00	500	f	\N	\N	f	2025-12-27 05:25:59.736955	2025-12-27 05:25:59.736958
212	122	semester_fee	6731_912_7	pay_RqCfbfn0oypT5Z	2025-12-11 00:00:00	20000	f	\N	\N	f	2025-12-27 05:25:59.739912	2025-12-27 05:25:59.739915
213	123	application_fee	6800_912_7	pay_Rqwowy4BA7ieyB	2025-12-13 00:00:00	500	f	\N	\N	f	2025-12-27 05:25:59.747748	2025-12-27 05:25:59.747751
214	123	semester_fee	6943_912_7	pay_RrmMAr5Pphs60D	2025-12-15 00:00:00	20000	f	\N	\N	f	2025-12-27 05:25:59.750571	2025-12-27 05:25:59.750574
215	124	application_fee	6855_912_7	pay_RrNaPiflXUfG2S	2025-12-14 00:00:00	500	f	\N	\N	f	2025-12-27 05:25:59.758447	2025-12-27 05:25:59.75845
216	124	semester_fee	6931_912_7	pay_Rrk2DVQKxLEwOf	2025-12-17 00:00:00	20000	f	\N	\N	f	2025-12-27 05:25:59.761346	2025-12-27 05:25:59.761349
217	125	application_fee	7047_912_7	pay_RsBeeKHu49DxBL	2025-12-19 00:00:00	500	f	\N	\N	f	2025-12-27 05:25:59.769235	2025-12-27 05:25:59.769238
218	125	semester_fee	7150_912_7	pay_RtmBqgOWKo27y7	2025-12-20 00:00:00	20000	f	\N	\N	f	2025-12-27 05:25:59.772116	2025-12-27 05:25:59.77212
219	126	application_fee	7066_912_7	pay_RsJNmEXDIPk6Ew	2025-12-16 00:00:00	500	f	\N	\N	f	2025-12-27 05:25:59.780016	2025-12-27 05:25:59.780019
220	126	semester_fee	7119_912_7	pay_RtLz7KqJTCFQrx	2025-12-19 00:00:00	20000	f	\N	\N	f	2025-12-27 05:25:59.783003	2025-12-27 05:25:59.783006
221	127	application_fee	7218_912_7	pay_Rv1YTWZYRZZdd7	2025-12-23 00:00:00	500	f	\N	\N	f	2025-12-27 05:25:59.790825	2025-12-27 05:25:59.790828
222	127	semester_fee	7253_912_7	pay_Rw5XF25YQjUyJ1	2025-12-26 00:00:00	20000	f	\N	\N	f	2025-12-27 05:25:59.79374	2025-12-27 05:25:59.793743
223	128	application_fee	7097_912_7	pay_Rt1dckNvaVqKGO	2025-12-18 00:00:00	500	f	\N	\N	f	2025-12-27 05:25:59.801594	2025-12-27 05:25:59.801597
224	128	semester_fee	7142_912_7	pay_RtZYfvd6vPzIjN	2025-12-20 00:00:00	20000	f	\N	\N	f	2025-12-27 05:25:59.804428	2025-12-27 05:25:59.804432
225	129	application_fee	7123_912_7	pay_RtNv93OtZcmYx7	2025-12-19 00:00:00	500	f	\N	\N	f	2025-12-27 05:25:59.812351	2025-12-27 05:25:59.812354
226	129	semester_fee	7140_912_7	pay_RtU3iiTGND7HHm	2025-12-19 00:00:00	20000	f	\N	\N	f	2025-12-27 05:25:59.815207	2025-12-27 05:25:59.81521
227	130	application_fee	7155_912_7	pay_RtpBNrk4ytHsT3	2025-12-20 00:00:00	500	f	\N	\N	f	2025-12-27 05:25:59.82314	2025-12-27 05:25:59.823143
228	130	semester_fee	7157_912_7	pay_RtpWVMr0SSNEWN	2025-12-20 00:00:00	20000	f	\N	\N	f	2025-12-27 05:25:59.826068	2025-12-27 05:25:59.826071
229	131	application_fee	7212_912_7	pay_RuxyoNpTHg0GyW	2025-12-23 00:00:00	500	f	\N	\N	f	2025-12-27 05:25:59.834446	2025-12-27 05:25:59.834449
230	131	semester_fee	7229_912_7	pay_RvO18lPnUI6X8M	2025-12-24 00:00:00	20000	f	\N	\N	f	2025-12-27 05:25:59.837414	2025-12-27 05:25:59.837417
231	132	application_fee	6859_912_7	pay_RrOb2P4ggVUr6t	2025-12-14 00:00:00	500	f	\N	\N	f	2025-12-30 05:14:43.654753	2025-12-30 05:14:43.654757
232	132	semester_fee	7300_912_7	pay_RxJzYEvsHAOR1Q	2025-12-29 00:00:00	10875	f	\N	\N	f	2025-12-30 05:14:43.658672	2025-12-30 05:14:43.658676
233	133	application_fee	6176_912_7	pay_Rj9NwDaaVFRayL	2025-11-23 00:00:00	500	f	\N	\N	f	2025-12-30 05:14:43.66738	2025-12-30 05:14:43.667383
234	133	semester_fee	7273_912_7	pay_RwY3HY810lFb7X	2025-12-27 00:00:00	20000	f	\N	\N	f	2025-12-30 05:14:43.670728	2025-12-30 05:14:43.670731
235	134	application_fee	6214_912_7	pay_RjsO7Qv1NtKNXR	2025-11-25 00:00:00	500	f	\N	\N	f	2025-12-30 05:14:43.678908	2025-12-30 05:14:43.678911
236	134	semester_fee	7274_912_7	pay_RwY8tMyDFinWWq	2025-12-27 00:00:00	20000	f	\N	\N	f	2025-12-30 05:14:43.682191	2025-12-30 05:14:43.682194
237	135	application_fee	7226_912_7	pay_RvJx60SVgYK8Tf	2025-12-24 00:00:00	500	f	\N	\N	f	2026-01-02 04:08:56.13457	2026-01-02 04:08:56.134573
238	135	semester_fee	7346_912_7	pay_Ry5l3cVfY1yqVt	2025-12-31 00:00:00	20000	f	\N	\N	f	2026-01-02 04:08:56.142256	2026-01-02 04:08:56.14226
239	136	application_fee	6652_912_7	pay_RpAeiU7P0kmhWV	2025-12-08 00:00:00	500	f	\N	\N	f	2026-01-02 04:31:03.505348	2026-01-02 04:31:03.505351
240	136	semester_fee	7394_912_7	pay_Rys2FXPlAEGZbw	2026-01-02 00:00:00	20000	f	\N	\N	f	2026-01-02 04:31:03.512498	2026-01-02 04:31:03.512501
241	137	application_fee	6679_912_7	pay_RpW5OQ3lBWMzhX	2025-12-09 00:00:00	500	f	\N	\N	f	2026-01-02 04:31:03.525741	2026-01-02 04:31:03.525745
242	137	semester_fee	7393_912_7	pay_Ryrwvj8OaGeK6m	2026-01-02 00:00:00	20000	f	\N	\N	f	2026-01-02 04:31:03.529832	2026-01-02 04:31:03.529835
243	138	application_fee	7230_912_7	pay_RvPnTkYOnmzCEE	2025-12-24 00:00:00	500	f	\N	\N	f	2026-01-02 06:02:40.338468	2026-01-02 06:02:40.338472
244	138	semester_fee	7347_912_7	pay_Ry70LRbS9pHOKi	2025-12-31 00:00:00	20000	f	\N	\N	f	2026-01-02 06:02:40.34627	2026-01-02 06:02:40.346274
245	139	application_fee	7354_912_7	pay_RyAWNEJ8orAGIl	2025-12-31 00:00:00	500	f	\N	\N	f	2026-01-02 07:36:12.606366	2026-01-02 07:36:12.606369
246	139	semester_fee	7401_912_7	pay_RyuIKRBBwFLgnN	2026-01-02 00:00:00	20000	f	\N	\N	f	2026-01-02 07:36:12.679399	2026-01-02 07:36:12.679404
247	140	application_fee	7219_912_7	pay_Rv1owqlSRnGVEZ	2025-12-23 00:00:00	500	f	\N	\N	f	2026-01-02 09:40:31.143637	2026-01-02 09:40:31.143641
248	140	semester_fee	7375_912_7	pay_RySgvbe2fFbYS2	2026-01-01 00:00:00	20000	f	\N	\N	f	2026-01-02 09:40:31.146727	2026-01-02 09:40:31.14673
249	141	application_fee	7404_912_7	pay_RyvHvNmyVwLvqE	2026-01-02 00:00:00	500	f	\N	\N	f	2026-01-03 06:43:47.878028	2026-01-03 06:43:47.878031
250	141	semester_fee	7431_912_7	pay_Rz4e3QAfU7hQK7	2026-01-02 00:00:00	20000	f	\N	\N	f	2026-01-03 06:43:47.885368	2026-01-03 06:43:47.885372
251	142	application_fee	7284_912_7	pay_RwjGBxQYOPDmUs	2025-12-27 00:00:00	500	f	\N	\N	f	2026-01-05 08:44:01.582513	2026-01-05 08:44:01.582517
252	142	semester_fee	7526_912_7	pay_S05GKEUky4Uxpg	2026-01-05 00:00:00	20000	f	\N	\N	f	2026-01-05 08:44:01.590363	2026-01-05 08:44:01.590366
253	143	application_fee	7446_912_7	pay_RzIPpRFZnqr9oQ	2026-01-03 00:00:00	500	f	\N	\N	f	2026-01-07 02:44:47.971132	2026-01-07 02:44:47.971135
254	143	semester_fee	7587_912_7	pay_S0Vnq2gZN5U3jZ	2026-01-06 00:00:00	20000	f	\N	\N	f	2026-01-07 02:44:47.978235	2026-01-07 02:44:47.978238
255	144	application_fee	7436_912_7	pay_RzGxQPqteZCQcc	2026-01-03 00:00:00	500	f	\N	\N	f	2026-01-12 04:46:33.10281	2026-01-12 04:46:33.102814
256	144	semester_fee	7754_912_7	pay_S1iCScvKHPgsAM	2026-01-09 00:00:00	20000	f	\N	\N	f	2026-01-12 04:46:33.177084	2026-01-12 04:46:33.177089
263	148	application_fee	8257_912_7	pay_SEhHnsn7LP5PIT	2026-02-11 00:00:00	500	f	\N	\N	f	2026-03-06 08:01:12.365086	2026-03-06 08:01:12.365091
264	148	semester_fee	8740_912_7	pay_SMeD6AktOW17Gr	2026-03-03 00:00:00	17750	f	\N	\N	f	2026-03-06 08:01:12.369429	2026-03-06 08:01:12.369435
265	149	application_fee	8286_912_7	pay_SFAF5JtK1iD06G	2026-02-12 00:00:00	500	f	\N	\N	f	2026-03-06 08:01:12.382966	2026-03-06 08:01:12.382972
266	149	semester_fee	8822_912_7	pay_SNrf0ZEN1XPWEY	2026-03-06 00:00:00	17750	f	\N	\N	f	2026-03-06 08:01:12.389225	2026-03-06 08:01:12.389238
269	151	application_fee	8048_912_7	pay_S9OyRuY9rJOk5U	2026-01-29 00:00:00	500	f	\N	\N	f	2026-03-06 08:01:12.417809	2026-03-06 08:01:12.417815
270	151	semester_fee	8051_912_7	pay_S9d2XGf5OhUI7x	2026-01-29 00:00:00	20000	f	\N	\N	f	2026-03-06 08:01:12.423812	2026-03-06 08:01:12.423821
279	156	application_fee	8102_912_7	pay_SArlmyrRuQn4Bv	2026-02-01 00:00:00	500	f	\N	\N	f	2026-03-06 08:01:12.51528	2026-03-06 08:01:12.515287
280	156	semester_fee	8104_912_7	pay_SAukMpvwTENjH8	2026-02-01 00:00:00	17750	f	\N	\N	f	2026-03-06 08:01:12.524164	2026-03-06 08:01:12.52417
283	158	application_fee	7240_912_7	pay_RvlJCTVdfaQnfl	2025-12-25 00:00:00	500	f	\N	\N	f	2026-03-06 08:01:12.579641	2026-03-06 08:01:12.579653
284	158	semester_fee	7945_912_7	pay_S60vjLXFqi4vnE	2026-01-20 00:00:00	17750	f	\N	\N	f	2026-03-06 08:01:12.585484	2026-03-06 08:01:12.585489
285	159	application_fee	8306_912_7	pay_SFYrp4lWbvS2ji	2026-02-13 00:00:00	500	f	\N	\N	f	2026-03-06 08:01:12.605847	2026-03-06 08:01:12.605858
286	159	semester_fee	8423_912_7	pay_SHsJ2a33DS2JKH	2026-02-19 00:00:00	20000	f	\N	\N	f	2026-03-06 08:01:12.614589	2026-03-06 08:01:12.614595
289	161	application_fee	8082_912_7	pay_SAPqcARspMpFY8	2026-01-31 00:00:00	500	f	\N	\N	f	2026-03-06 09:35:55.447577	2026-03-06 09:35:55.447587
290	161	semester_fee	8287_912_7	pay_SFCU5vNlc3X8kh	2026-02-12 00:00:00	17750	f	\N	\N	f	2026-03-06 09:35:55.465531	2026-03-06 09:35:55.465538
305	171	application_fee	8448_912_7	pay_SIGM38Locq52k2	2026-02-20 00:00:00	500	f	\N	\N	f	2026-03-11 14:24:01.92949	2026-03-11 14:24:01.9295
306	171	semester_fee	8525_912_7	pay_SJSSuktzNI3qhG	2026-02-23 00:00:00	20000	f	\N	\N	f	2026-03-11 14:24:01.93581	2026-03-11 14:24:01.935819
307	172	application_fee	8128_912_7	pay_SBgat4mItMCwH4	2026-02-03 00:00:00	500	f	\N	\N	f	2026-03-11 14:24:09.928103	2026-03-11 14:24:09.928115
308	172	semester_fee	8232_912_7	pay_SEHfOniJIw3uZz	2026-02-10 00:00:00	20000	f	\N	\N	f	2026-03-11 14:24:09.935722	2026-03-11 14:24:09.935729
309	173	application_fee	8142_912_7	pay_SC3unoTbf6SA8X	2026-02-04 00:00:00	500	f	\N	\N	f	2026-03-11 14:24:14.084117	2026-03-11 14:24:14.084129
310	173	semester_fee	8256_912_7	pay_SEh86tFs5EPMox	2026-02-11 00:00:00	20000	f	\N	\N	f	2026-03-11 14:24:14.092347	2026-03-11 14:24:14.092357
311	174	application_fee	8089_912_7	pay_SAUZHoZwbr5lFt	2026-01-31 00:00:00	500	f	\N	\N	f	2026-03-11 14:24:21.433816	2026-03-11 14:24:21.433849
312	174	semester_fee	8372_912_7	pay_SGnXUajUCvwsMh	2026-02-16 00:00:00	20000	f	\N	\N	f	2026-03-11 14:24:21.440802	2026-03-11 14:24:21.440812
313	175	application_fee	8176_912_7	pay_SCsHWpbmvDBKWs	2026-02-06 00:00:00	500	f	\N	\N	f	2026-03-11 14:24:27.983382	2026-03-11 14:24:27.983397
314	175	semester_fee	8537_912_7	pay_SJbZ7MbktWlxHB	2026-03-11 14:24:27.991888	20000	f	\N	\N	f	2026-03-11 14:24:27.991896	2026-03-11 14:24:27.991899
315	176	application_fee	7941_912_7	pay_S5lP9jP6ElSUNd	2026-01-19 00:00:00	500	f	\N	\N	f	2026-03-11 14:24:42.100757	2026-03-11 14:24:42.100775
316	176	semester_fee	8031_912_7	pay_S9B8eBjGwm8HFu	2026-01-28 00:00:00	20000	f	\N	\N	f	2026-03-11 14:24:42.107333	2026-03-11 14:24:42.107341
321	179	application_fee	8387_912_7	pay_SH3xg3AYXQPGln	2026-02-17 00:00:00	500	f	\N	\N	f	2026-03-11 17:22:00.026209	2026-03-11 17:22:00.026233
322	179	semester_fee	8501_912_7	pay_SJ9r02aEzGTSTo	2026-02-22 00:00:00	20000	f	\N	\N	f	2026-03-11 17:22:15.99668	2026-03-11 17:22:15.996703
323	180	application_fee	7661_912_7	pay_S0xAYs3bSAORSp	2026-01-07 00:00:00	500	f	\N	\N	f	2026-03-11 17:23:10.587459	2026-03-11 17:23:10.587476
324	180	semester_fee	8925_912_7	pay_SP956nUJBFXivj	2026-03-09 00:00:00	17750	f	\N	\N	f	2026-03-11 17:23:10.604657	2026-03-11 17:23:10.60467
325	29	semester_fee	4517_912_6	1756104892	2026-03-05 00:00:00	14750	f	\N	\N	f	2025-09-26 07:32:00.733	2025-09-26 07:32:00.733
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permissions (id, codename) FROM stdin;
\.


--
-- Data for Name: program_payment_workflow_scopes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.program_payment_workflow_scopes (program_id, batch, admission_year, semester, enabled, id, created_at, updated_at) FROM stdin;
1500038	2025	2025-2026	1	f	1	2026-03-26 10:04:38.324738	2026-03-26 10:04:49.695328
\.


--
-- Data for Name: programs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.programs (id, programe, programe_code, created_at, updated_at, duration, category, faculty, short_name, application_code, batch, admission_year, pending_payment_workflow_enabled) FROM stdin;
1500132	1-year online executive PG certificate in Industrial Hygiene	X02	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725	1	PG	CDOE	PGCIH	\N	\N	2025-2026	f
1500136	1-year online executive PG certificate in Wellness Coaching	X03	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725	1	PG	CDOE	PGCWC	\N	\N	2025-2026	f
1500130	1-year online executive PG certificate in Organisational Behaviour Analysis	x07	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725	1	PG	CDOE	PGCOB	\N	\N	2025-2026	f
1500033	MBA	X01	2026-03-13 07:52:59.406312	2026-03-13 07:52:59.40632	1	PG	cdoe	MBA	\N	January	2025-2026	f
1500038	BACHELOR OF SCIENCE (HONS) (DATA SCIENCE)	O05	2025-06-11 10:20:47.725	2026-03-26 10:01:52.01612	3	UG	CDOE	B.sc DataScience	\N	\N	2025-2026	t
\.


--
-- Data for Name: schemes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schemes (id, programe_id, regulation_year, program_pattern, program_pattern_no, created_at, updated_at) FROM stdin;
1	1500038	2025	SEMESTER	1	2026-02-05 06:00:48.409751	2026-02-11 05:26:59.108434
\.


--
-- Data for Name: semester_fees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.semester_fees (id, payment_id, semester, lab_fee, lms_fee, exam_fee, tuition_fee, total_fee, admission_fee) FROM stdin;
8	34	Semester 1	2000	500	500	13750	17750	1000
9	36	Semester 1	2000	500	500	13750	17750	1000
10	38	Semester 1	2000	500	500	13750	17750	1000
11	40	Semester 1	2000	500	500	13750	17750	1000
12	42	Semester 1	2000	500	500	13750	17750	1000
13	44	Semester 1	2000	500	500	13750	17750	1000
14	46	Semester 1	2000	500	500	13750	17750	1000
15	48	Semester 1	2000	500	500	13750	17750	1000
16	50	Semester 1	2000	500	500	13750	17750	1000
18	54	Semester 1	2000	500	500	13750	17750	1000
19	56	Semester 1	2000	500	500	13750	17750	1000
20	58	Semester 1	2000	500	500	13750	17750	1000
21	61	Semester 1	2000	500	500	13750	17750	1000
22	63	Semester 1	2000	500	500	13750	17750	1000
23	65	Semester 1	2000	500	500	13750	17750	1000
24	67	Semester 1	2000	500	500	13750	17750	1000
25	69	Semester 1	2000	500	500	13750	17750	1000
26	71	Semester 1	2000	500	500	13750	17750	1000
27	73	Semester 1	2000	500	500	13750	17750	1000
28	75	Semester 1	2000	500	500	13750	17750	1000
29	77	Semester 1	2000	500	500	13750	17750	1000
30	79	Semester 1	2000	500	500	13750	17750	1000
31	81	Semester 1	2000	500	500	13750	17750	1000
32	85	Semester 1	2000	2500	500	14000	20000	1000
33	87	Semester 1	2000	2500	500	14000	20000	1000
34	89	Semester 1	2000	2500	500	14000	20000	1000
35	91	Semester 1	2000	2500	500	14000	20000	1000
36	93	Semester 1	2000	2500	500	14000	20000	1000
37	95	Semester 1	2000	2500	500	14000	20000	1000
38	97	Semester 1	2000	2500	500	14000	20000	1000
39	99	Semester 1	2000	2500	500	14000	20000	1000
40	101	Semester 1	2000	2500	500	14000	20000	1000
41	103	Semester 1	2000	2500	500	14000	20000	1000
42	105	Semester 1	2000	2500	500	14000	20000	1000
43	107	Semester 1	2000	2500	500	14000	20000	1000
44	109	Semester 1	2000	2500	500	14000	20000	1000
45	111	Semester 1	2000	2500	500	14000	20000	1000
46	113	Semester 1	2000	2500	500	14000	20000	1000
47	115	Semester 1	2000	2500	500	14000	20000	1000
48	117	Semester 1	2000	2500	500	14000	20000	1000
49	119	Semester 1	2000	2500	500	14000	20000	1000
50	121	Semester 1	2000	2500	500	14000	20000	1000
51	123	Semester 1	2000	2500	500	14000	20000	1000
52	125	Semester 1	2000	2500	500	14000	20000	1000
53	127	Semester 1	2000	2500	500	14000	20000	1000
54	129	Semester 1	2000	2500	500	14000	20000	1000
55	131	Semester 1	2000	2500	500	14000	20000	1000
56	133	Semester 1	2000	2500	500	14000	20000	1000
57	135	Semester 1	2000	2500	500	14000	20000	1000
58	137	Semester 1	2000	2500	500	14000	20000	1000
59	139	Semester 1	2000	2500	500	14000	20000	1000
60	141	Semester 1	2000	2500	500	14000	20000	1000
61	143	Semester 1	2000	2500	500	14000	20000	1000
62	145	Semester 1	2000	2500	500	14000	20000	1000
63	147	Semester 1	2000	2500	500	14000	20000	1000
64	149	Semester 1	2000	2500	500	14000	20000	1000
65	151	Semester 1	2000	2500	500	14000	20000	1000
66	153	Semester 1	2000	2500	500	14000	20000	1000
67	155	Semester 1	2000	2500	500	14000	20000	1000
68	157	Semester 1	2000	2500	500	14000	20000	1000
69	159	Semester 1	2000	2500	500	14000	20000	1000
70	161	Semester 1	2000	2500	500	14000	20000	1000
71	163	Semester 1	2000	2500	500	14000	20000	1000
72	165	Semester 1	2000	2500	500	14000	20000	1000
73	167	Semester 1	2000	2500	500	14000	20000	1000
74	169	Semester 1	2000	2500	500	14000	20000	1000
75	171	Semester 1	2000	2500	500	14000	20000	1000
76	173	Semester 1	2000	2500	500	14000	20000	1000
77	175	Semester 1	2000	2500	500	14000	20000	1000
78	177	Semester 1	2000	2500	500	14000	20000	1000
79	180	Semester 1	2000	2500	500	14000	20000	1000
80	182	Semester 1	2000	2500	500	14000	20000	1000
81	184	Semester 1	2000	2500	500	14000	20000	1000
82	186	Semester 1	2000	2500	500	14000	20000	1000
83	188	Semester 1	2000	2500	500	14000	20000	1000
84	190	Semester 1	2000	2500	500	14000	20000	1000
85	192	Semester 1	2000	2500	500	14000	20000	1000
86	194	Semester 1	2000	2500	500	14000	20000	1000
87	196	Semester 1	2000	2500	500	14000	20000	1000
88	198	Semester 1	2000	2500	500	14000	20000	1000
89	200	Semester 1	2000	2500	500	14000	20000	1000
90	202	Semester 1	2000	2500	500	14000	20000	1000
91	204	Semester 1	2000	2500	500	14000	20000	1000
92	206	Semester 1	2000	2500	500	14000	20000	1000
93	208	Semester 1	2000	2500	500	14000	20000	1000
94	210	Semester 1	2000	2500	500	14000	20000	1000
95	212	Semester 1	2000	2500	500	14000	20000	1000
96	214	Semester 1	2000	2500	500	14000	20000	1000
97	216	Semester 1	2000	2500	500	14000	20000	1000
98	218	Semester 1	2000	2500	500	14000	20000	1000
99	220	Semester 1	2000	2500	500	14000	20000	1000
100	222	Semester 1	2000	2500	500	14000	20000	1000
101	224	Semester 1	2000	2500	500	14000	20000	1000
102	226	Semester 1	2000	2500	500	14000	20000	1000
103	228	Semester 1	2000	2500	500	14000	20000	1000
104	230	Semester 1	2000	2500	500	14000	20000	1000
105	232	Semester 1	2000	500	500	13750	17750	1000
106	234	Semester 1	2000	2500	500	14000	20000	1000
107	236	Semester 1	2000	2500	500	14000	20000	1000
108	238	Semester 1	2000	2500	500	14000	20000	1000
109	240	Semester 1	2000	2500	500	14000	20000	1000
110	242	Semester 1	2000	2500	500	14000	20000	1000
111	244	Semester 1	2000	2500	500	14000	20000	1000
112	246	Semester 1	2000	2500	500	14000	20000	1000
113	248	Semester 1	2000	2500	500	14000	20000	1000
114	250	Semester 1	2000	2500	500	14000	20000	1000
115	252	Semester 1	2000	2500	500	14000	20000	1000
116	254	Semester 1	2000	2500	500	14000	20000	1000
117	256	Semester 1	2000	2500	500	14000	20000	1000
119	264	Semester 1	2000	500	500	13750	17750	1000
120	266	Semester 1	2000	500	500	13750	17750	1000
122	270	Semester 1	2000	2500	500	14000	20000	1000
127	280	Semester 1	2000	500	500	13750	17750	1000
129	284	Semester 1	2000	500	500	13750	17750	1000
130	286	Semester 1	2000	2500	500	14000	20000	1000
132	290	Semester 1	2000	500	500	13750	17750	1000
133	306	Semester 1	0	0	0	20000	20000	0
134	308	Semester 1	0	0	0	20000	20000	0
135	310	Semester 1	0	0	0	20000	20000	0
136	312	Semester 1	0	0	0	20000	20000	0
137	314	Semester 1	0	0	0	20000	20000	0
138	316	Semester 1	0	0	0	20000	20000	0
141	322	Semester 1	0	0	0	20000	20000	0
142	324	Semester 1	2000	500	500	13750	17750	1000
143	325	Semester 2	0	500	500	13750	14750	0
\.


--
-- Data for Name: semester_masters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.semester_masters (id, program_type, semester_number, semester_name, is_active, description, created_at, updated_at) FROM stdin;
1	UG	1	Semester 1	t	Undergraduate Semester 1	2026-03-27 06:13:51.130957	2026-03-27 06:13:51.130966
2	UG	2	Semester 2	t	Undergraduate Semester 2	2026-03-27 06:13:51.13097	2026-03-27 06:13:51.130973
3	UG	3	Semester 3	t	Undergraduate Semester 3	2026-03-27 06:13:51.130977	2026-03-27 06:13:51.13098
4	UG	4	Semester 4	t	Undergraduate Semester 4	2026-03-27 06:13:51.130983	2026-03-27 06:13:51.130985
5	UG	5	Semester 5	t	Undergraduate Semester 5	2026-03-27 06:13:51.130988	2026-03-27 06:13:51.130991
6	UG	6	Semester 6	t	Undergraduate Semester 6	2026-03-27 06:13:51.130994	2026-03-27 06:13:51.130997
7	UG	7	Semester 7	t	Undergraduate Semester 7	2026-03-27 06:13:51.131	2026-03-27 06:13:51.131003
8	UG	8	Semester 8	t	Undergraduate Semester 8	2026-03-27 06:13:51.131006	2026-03-27 06:13:51.131009
9	PG	1	Semester 1	t	Postgraduate Semester 1	2026-03-27 06:13:51.131012	2026-03-27 06:13:51.131015
10	PG	2	Semester 2	t	Postgraduate Semester 2	2026-03-27 06:13:51.131018	2026-03-27 06:13:51.131021
11	PG	3	Semester 3	t	Postgraduate Semester 3	2026-03-27 06:13:51.131024	2026-03-27 06:13:51.131026
12	PG	4	Semester 4	t	Postgraduate Semester 4	2026-03-27 06:13:51.131029	2026-03-27 06:13:51.131032
\.


--
-- Data for Name: semester_results; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.semester_results (id, student_id, exam_id, semester_id, total_credits, earned_credits, sgpa, result_status, created_at, updated_at) FROM stdin;
1	29	1	1	3	3	8	PASS	2026-02-13 10:14:35.815917	2026-02-13 10:14:35.815926
\.


--
-- Data for Name: semesters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.semesters (id, scheme_id, semester_no, semester_name, created_at, updated_at) FROM stdin;
1	1	1	FIRST SEMESTER	2026-02-05 07:27:50.987129	2026-02-11 05:28:29.087786
\.


--
-- Data for Name: ssc_board; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ssc_board (id, name, created_at, updated_at) FROM stdin;
12901	Central Board Of Secondary Education (CBSE)	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12902	Council Of Indian School Certificate Examination (CISCE/ICSE)	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12903	National Institute Of Open Schooling	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12904	Aligarh Muslim University	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12905	Andhra Pradesh Board Of Secondary Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12906	Assam Board Of Secondary Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12907	Bihar School Examination Board	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12908	Cambridge University	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12909	Chhatisgarh Board Of Secondary Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12910	Directorate Of Army Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12911	Goa Board Of Secondary And Higher Secondary Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12912	Gujarat Secondary And Higher Secondary Education Board	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12913	Haryana Board Of Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12914	Himachal Pradesh Board Of School Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12915	International Baccalaureate	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12916	J And K State Board Of School Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12917	Jharkhand Academic Council	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12918	Karnataka Secondary Education Examination Board	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12919	Madhya Pradesh Board Of Secondary Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12920	Maharastra State Board Of Secondary And Higher Secondary Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12921	Manipur Board Of Secondary Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12922	Meghalaya Board Of School Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12923	Mizoram Board Of School Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12924	Nagaland Board Of School Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12925	Orissa Board Of Secondary Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12926	Punjab School Education Board	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12927	Rajasthan Board Of Secondary Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12928	Rashtriya Sanskrit Sansthan	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12929	Tamil Nadu Board Of Secondary Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12930	Telangana Board of Secondary Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12931	Tripura Board Of Secondary Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12932	U.P. Board Of High School And Intermediate Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12933	Uttaranchal Shiksha Evam Pariksha Parishad	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12934	West Bengal Board Of Madarsa Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
12935	West Bengal Board Of Secondary Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
20126	Not specified/Any Other	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
20292	Kerala Secondary Education Examination Board	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
177526	Other	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
196506	Kerala Board of Public Examinations	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
196507	Banasthali Vidyapith	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
202442	Board of Vocational Higher Secondary Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
204564	Dayalbagh Educational Institute	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
242694	Uttarakhand Board of School Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
474196	IGSE Board	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
489018	AKTU UP	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
489019	Board of Technical Education	2025-06-11 10:20:47.725	2025-06-11 10:20:47.725
\.


--
-- Data for Name: staff; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.staff (id, user_id, employee_id, first_name, last_name, email, phone, dob, gender, designation, qualification, specialization, joining_date, experience_years, employment_type, status, department_id, faculty, role) FROM stdin;
9	162	0272	M	Harikrishnan	harikrishnan@sriramachandra.edu.in	9600366651	2000-02-13	Male	test	test	test	2025-02-13	5	Internal	active	1	CDOE	3
3	156	0271	M	Harikrishna	mharikrishnan1105@gmail.com	9600366652	2000-02-13	Male	test	test	test	2025-02-13	6	Internal	active	1	test	3
\.


--
-- Data for Name: states; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.states (id, country_id, name) FROM stdin;
\.


--
-- Data for Name: student_course_registrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student_course_registrations (id, course_id, is_arrear, created_at, updated_at, student_exam_registration_id, component_id, permitted) FROM stdin;
1	1	f	2026-02-11 07:32:45.532903	2026-02-11 07:32:45.532909	9	1	t
2	1	f	2026-02-11 07:43:51.194426	2026-02-11 07:43:51.19443	10	1	t
3	1	f	2026-02-11 07:46:17.903031	2026-02-11 07:46:17.903034	11	1	t
4	1	f	2026-02-11 07:59:11.677833	2026-02-11 07:59:11.677838	12	1	t
5	1	f	2026-02-11 08:05:08.878155	2026-02-11 08:05:08.878159	13	1	t
6	1	f	2026-02-13 04:35:44.869843	2026-02-13 04:35:44.869857	16	1	t
7	1	f	2026-02-13 04:35:44.882701	2026-02-13 04:35:44.882712	17	1	t
8	1	f	2026-02-13 04:35:44.892216	2026-02-13 04:35:44.892226	18	1	t
9	1	f	2026-02-13 04:35:44.902786	2026-02-13 04:35:44.902798	19	1	t
10	1	f	2026-02-13 04:35:44.912869	2026-02-13 04:35:44.912883	20	1	t
11	1	f	2026-02-13 04:35:44.932443	2026-02-13 04:35:44.932458	21	1	t
12	1	f	2026-02-13 04:35:44.951501	2026-02-13 04:35:44.951515	22	1	t
13	1	f	2026-02-13 04:35:44.96829	2026-02-13 04:35:44.968303	23	1	t
14	1	f	2026-02-13 04:35:44.97998	2026-02-13 04:35:44.979993	24	1	t
15	1	f	2026-02-13 04:35:44.996304	2026-02-13 04:35:44.996317	25	1	t
16	1	f	2026-02-13 04:35:45.00714	2026-02-13 04:35:45.007145	26	1	t
17	1	f	2026-02-13 04:35:45.016699	2026-02-13 04:35:45.01671	27	1	t
18	1	f	2026-02-13 04:35:45.026888	2026-02-13 04:35:45.0269	28	1	t
19	1	f	2026-02-13 04:35:45.042146	2026-02-13 04:35:45.042163	29	1	t
20	1	f	2026-02-13 04:35:45.056195	2026-02-13 04:35:45.056207	30	1	t
21	1	f	2026-02-13 04:35:45.067758	2026-02-13 04:35:45.067764	31	1	t
22	1	f	2026-02-13 04:35:45.078007	2026-02-13 04:35:45.078019	32	1	t
23	1	f	2026-02-13 04:35:45.090157	2026-02-13 04:35:45.090172	33	1	t
24	1	f	2026-02-13 04:35:45.100012	2026-02-13 04:35:45.100025	34	1	t
25	1	f	2026-02-13 04:35:45.105638	2026-02-13 04:35:45.105652	35	1	t
\.


--
-- Data for Name: student_exam_registrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student_exam_registrations (id, student_id, exam_id, semester_id, created_at, updated_at, scheme_id, is_eligible, registered_on) FROM stdin;
9	29	1	1	2026-02-11 07:32:45.469135	2026-02-11 07:32:45.46914	1	t	2026-02-11 07:32:45.469121
10	30	1	1	2026-02-11 07:43:51.153409	2026-02-11 07:43:51.153412	1	t	2026-02-11 07:43:51.153401
11	31	1	1	2026-02-11 07:46:17.881386	2026-02-11 07:46:17.881389	1	t	2026-02-11 07:46:17.881377
12	32	1	1	2026-02-11 07:59:11.648961	2026-02-11 07:59:11.648963	1	t	2026-02-11 07:59:11.648954
13	33	1	1	2026-02-11 08:05:08.850842	2026-02-11 08:05:08.850846	1	t	2026-02-11 08:05:08.850834
16	34	1	1	2026-02-13 04:35:44.825466	2026-02-13 04:35:44.82547	1	t	2026-02-13 04:35:44.825457
17	37	1	1	2026-02-13 04:35:44.865721	2026-02-13 04:35:44.865728	1	t	2026-02-13 04:35:44.865705
18	42	1	1	2026-02-13 04:35:44.881177	2026-02-13 04:35:44.881184	1	t	2026-02-13 04:35:44.881165
19	43	1	1	2026-02-13 04:35:44.890793	2026-02-13 04:35:44.890799	1	t	2026-02-13 04:35:44.890781
20	46	1	1	2026-02-13 04:35:44.901032	2026-02-13 04:35:44.901038	1	t	2026-02-13 04:35:44.90102
21	53	1	1	2026-02-13 04:35:44.911062	2026-02-13 04:35:44.911069	1	t	2026-02-13 04:35:44.91105
22	55	1	1	2026-02-13 04:35:44.930348	2026-02-13 04:35:44.930356	1	t	2026-02-13 04:35:44.93033
23	35	1	1	2026-02-13 04:35:44.948183	2026-02-13 04:35:44.948192	1	t	2026-02-13 04:35:44.948166
24	36	1	1	2026-02-13 04:35:44.966399	2026-02-13 04:35:44.966407	1	t	2026-02-13 04:35:44.966356
25	132	1	1	2026-02-13 04:35:44.978286	2026-02-13 04:35:44.978293	1	t	2026-02-13 04:35:44.978273
26	39	1	1	2026-02-13 04:35:44.993838	2026-02-13 04:35:44.993845	1	t	2026-02-13 04:35:44.993822
27	45	1	1	2026-02-13 04:35:45.006198	2026-02-13 04:35:45.006201	1	t	2026-02-13 04:35:45.006191
28	47	1	1	2026-02-13 04:35:45.015239	2026-02-13 04:35:45.015247	1	t	2026-02-13 04:35:45.015225
29	48	1	1	2026-02-13 04:35:45.025421	2026-02-13 04:35:45.025429	1	t	2026-02-13 04:35:45.025406
30	49	1	1	2026-02-13 04:35:45.040121	2026-02-13 04:35:45.040129	1	t	2026-02-13 04:35:45.040104
31	50	1	1	2026-02-13 04:35:45.053682	2026-02-13 04:35:45.053689	1	t	2026-02-13 04:35:45.053668
32	51	1	1	2026-02-13 04:35:45.066602	2026-02-13 04:35:45.066609	1	t	2026-02-13 04:35:45.066591
33	52	1	1	2026-02-13 04:35:45.076625	2026-02-13 04:35:45.076629	1	t	2026-02-13 04:35:45.076616
34	54	1	1	2026-02-13 04:35:45.088787	2026-02-13 04:35:45.088794	1	t	2026-02-13 04:35:45.088775
35	56	1	1	2026-02-13 04:35:45.098717	2026-02-13 04:35:45.098719	1	t	2026-02-13 04:35:45.098711
\.


--
-- Data for Name: student_mark_temp; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student_mark_temp (id, course_name, final_marks, student_id) FROM stdin;
2	maths	75	29
3	physics	75	29
4	C Programming	30	31
5	Mathematics	10	31
6	Fundamentals of Computer Science	25	31
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (id, program_id, application_no, registration_no, title, first_name, last_name, gender, date_of_birth, blood_group, email, mobile_number, alternative_phone, whatsapp_number, marital_status, religion, nationality, category, caste, aadhaar_number, pan_number, parent_guardian_name, relationship_with_student, current_employment, annual_income, locality, passport_issued_country, passport_number, passport_expiry_date, is_deleted, created_at, updated_at, is_pushed, is_pushed_digi, is_synced, last_updated, batch, admission_year, semester_id, pending_payment_due, pending_payment_amount, pending_payment_link) FROM stdin;
135	1500136	OLPGCWC100649	X0326044	Mrs.	Padmavathy	T	Female	1979-04-17	A+	rpmdmyfamily1@gmail.com	919840350575	+91-9841617479	+91-9840350575	Married	HINDUISM	Indian	OBC	Mudaliyar	592710629595	\N	M Ramakrishnan	Husband	Employed	3 - 6 Lakhs	Urban	\N	\N	\N	f	2026-01-02 04:08:56.132012	2026-01-02 04:08:56.132014	f	f	f	2026-01-02 04:08:56.132008	\N	2025-2026	1	f	0	\N
64	1500136	OLPGCWC100532	X0326001	Mr.	Pavan Kumar	KL	Male	1979-02-24	O+	pavankl@hotmail.com	919845151194	\N	+91-9845151194	Married	HINDUISM	Indian	General	\N	287753261236	\N	Lakshminarayana K	Father	Employed	6 -10 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:16:55.682775	2025-12-27 05:16:55.682777	f	f	f	2025-12-27 05:16:55.682772	\N	2025-2026	1	f	0	\N
66	1500136	OLPGCWC100537	X0326002	Mrs.	Rachel	Deepthi	Female	1992-10-05	O+	racheldeepthi.rd@gmail.com	919361774528	\N	+91-9361774528	Married	CHRISTIANITY	Indian	OBC	NADAR	218716988119	\N	ANUP SAMSON NATHANIEL	Husband	Employed	3 - 6 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:16:55.701817	2025-12-27 05:16:55.701818	f	f	f	2025-12-27 05:16:55.701814	\N	2025-2026	1	f	0	\N
71	1500136	OLPGCWC100568	X0326003	Mr.	O.V.Venkataragavan	Venkatasubramaniam	Male	1970-07-26	A+	raaggs@gmail.com	919176662047	\N	+91-9176662047	Married	HINDUISM	Indian	General	\N	644501811224	\N	Saritha	Wife	Employed	6 -10 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:16:55.74878	2025-12-27 05:16:55.748781	f	f	f	2025-12-27 05:16:55.748776	\N	2025-2026	1	f	0	\N
73	1500136	OLPGCWC100577	X0326004	Ms.	P.R.Vetha	Vikasini	Female	2005-04-13	A+	b.nutri.vethavikasini@gmail.com	918939428360	\N	+91-8939428360	Single	HINDUISM	Indian	General	\N	338981155866	\N	Pattabiraman	Father	Student	0 - 3 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:16:55.767542	2025-12-27 05:16:55.767543	f	f	f	2025-12-27 05:16:55.767539	\N	2025-2026	1	f	0	\N
76	1500136	OLPGCWC100601	X0326005	Ms.	Shobana	M	Female	1998-07-13	AB+	shobanamari1398@gmail.com	916374906106	+91-9840222079	+91-6374906106	Single	HINDUISM	Indian	OBC	Vanniya kula shaktriyar	797447516368	\N	Bhavani Mari	Mother	Employed	0 - 3 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:16:55.795617	2025-12-27 05:16:55.795618	f	f	f	2025-12-27 05:16:55.795613	\N	2025-2026	1	f	0	\N
77	1500136	OLPGCWC100606	X0326006	Dr.	Sevvanthi	S	Female	1993-06-29	O+	sevvanthi2911@gmail.com	919384708480	+91-9994958058	+91-9384708480	Married	HINDUISM	Indian	OBC	yadhavar	275762494956	\N	Sundaram	Father	Unemployed	\N	Rural	\N	\N	\N	f	2025-12-27 05:16:55.804931	2025-12-27 05:16:55.804933	f	f	f	2025-12-27 05:16:55.804928	\N	2025-2026	1	f	0	\N
79	1500136	OLPGCWC100609	X0326007	Ms.	Jayashree	K	Female	1995-12-25	A+	jayashreemohanamal@gmail.com	918220696403	+91-6381624330	+91-8220696403	Single	HINDUISM	Indian	OBC	Boyar	604962003470	\N	Mohanambal	Mother	Employed	0 - 3 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:16:55.823381	2025-12-27 05:16:55.823383	f	f	f	2025-12-27 05:16:55.823378	\N	2025-2026	1	f	0	\N
80	1500136	OLPGCWC100616	X0326008	Mr.	J.Venkataramanan	.	Male	1969-05-02	O+	venkatjagan69@gmail.com	919445694291	\N	+91-9445694291	Divorced	HINDUISM	Indian	General	Vadugan	904783087479	\N	K.Jagannathan	Father	Employed	Above 15 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:16:55.832685	2025-12-27 05:16:55.832686	f	f	f	2025-12-27 05:16:55.832681	\N	2025-2026	1	f	0	\N
81	1500136	OLPGCWC100626	X0326009	Mr.	Ajith kumar	Logaiyan	Male	1996-12-13	A+	ajithlogaiyan3176@gmail.com	919597224897	\N	+91-9597224897	Married	HINDUISM	Indian	General	\N	304200010547	\N	Madhuram	Wife	Employed	0 - 3 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:16:55.842008	2025-12-27 05:16:55.84201	f	f	f	2025-12-27 05:16:55.842005	\N	2025-2026	1	f	0	\N
82	1500136	OLPGCWC100627	X0326010	Mrs.	Malathi	R	Female	1992-05-10	B+	malathi.rajendran10@gmail.com	919094846286	+91-9943267808	+91-9094846286	Married	HINDUISM	Indian	OBC	Hindu, vanniyakula kshathiriyar	942559293144	\N	Boobalan R	Husband	Unemployed	0 - 3 Lakhs	Rural	\N	\N	\N	f	2025-12-27 05:16:55.851362	2025-12-27 05:16:55.851364	f	f	f	2025-12-27 05:16:55.851359	\N	2025-2026	1	f	0	\N
83	1500136	OLPGCWC100628	X0326011	Mrs.	S R	ANANTHAVALLI	Female	1982-08-23	A+	ananthavalliselvam2382@gmail.com	919941287386	+91-9841161817	+91-9941287386	Married	HINDUISM	Indian	OBC	Hindu , Vanniya kula kshathriyar	493640961981	\N	B.SELVAM	Husband	Unemployed	0 - 3 Lakhs	Rural	\N	\N	\N	f	2025-12-27 05:16:55.860893	2025-12-27 05:16:55.860895	f	f	f	2025-12-27 05:16:55.86089	\N	2025-2026	1	f	0	\N
84	1500136	OLPGCWC100633	X0326012	Mr.	HARISH KUMAR	M	Male	1997-08-29	B+	tonykumar30897@gmail.com	919791179537	+91-7845783008	+91-9791179537	Married	HINDUISM	Indian	OBC	\N	269660986489	\N	Pretty Thomas	Wife	Employed	3 - 6 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:16:55.870458	2025-12-27 05:16:55.87046	f	f	f	2025-12-27 05:16:55.870455	\N	2025-2026	1	f	0	\N
137	1500136	OLPGCWC100737	X0326046	Mrs.	KERAN PRISKILLA	J	Female	2001-06-13	A+	keranpriskilla136@gmail.com	918056033511	+91-9952939053	+91-8056033511	Married	CHRISTIANITY	Indian	General	BC- christhuva aadhidravidar	777181825885	\N	M VINITHKUMAR	Husband	Employed	0 - 3 Lakhs	Rural	\N	\N	\N	f	2026-01-02 04:31:03.524201	2026-01-02 04:31:03.524203	f	f	f	2026-01-02 04:31:03.524198	\N	2025-2026	1	f	0	\N
143	1500136	OLPGCWC100621	X0326050	Dr.	Mahesh	Kurella	Male	2000-02-19	O+	getmahesh22@gmail.com	919573934557	\N	+91-9573934557	Single	HINDUISM	Indian	General	OC	374307278597	\N	Ramesh Babu	Father	Student	\N	Rural	\N	\N	\N	f	2026-01-07 02:44:47.968875	2026-02-14 12:16:16.414647	f	f	f	2026-02-14 12:16:16.414632	\N	2025-2026	1	f	0	\N
142	1500132	OLPGCIH100834	X0226034	Dr.	Gowthaman	Kumar	Male	1994-06-13	O+	gowthaman.gow7@gmail.com	917402072010	+91-9900045721	+91-7402072010	Married	HINDUISM	Indian	OBC	BC	582978379306	\N	Sangeetha MS	Wife	Employed	0 - 3 Lakhs	Urban	\N	\N	\N	f	2026-01-05 08:44:01.580082	2026-02-14 12:25:13.770497	f	f	f	2026-02-14 12:25:13.770493	\N	2025-2026	1	f	0	\N
144	1500136	OLPGCWC100839	X0326051	Mrs.	Aarthi	Sathyaraj	Female	1989-09-25	\N	manisathyaraj@gmail.com	917305981697	+91-9600073961	+91-7305981697	Married	HINDUISM	Indian	OBC	\N	559738273583	\N	Sathyaraj	Husband	Employed	3 - 6 Lakhs	Urban	\N	\N	\N	f	2026-01-12 04:46:33.100007	2026-02-14 12:24:51.85226	f	f	f	2026-02-14 12:24:51.852251	\N	2025-2026	1	f	0	\N
88	1500136	OLPGCWC100650	X0326013	Mrs.	Shajitha	Banu	Female	1996-06-07	O+	shajisa2976@gmail.com	917358429752	+91-7200389287	+91-7358429752	Married	ISLAM	Indian	OBC	\N	904759124125	\N	Akbar H	Father	Employed	0 - 3 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:16:55.90792	2025-12-27 05:16:55.907921	f	f	f	2025-12-27 05:16:55.907916	\N	2025-2026	1	f	0	\N
89	1500136	OLPGCWC100654	X0326014	Mr.	Perumal	.M	Male	1999-11-25	O+	perum422@gmail.com	917094895275	+91-9176995275	+91-7094895275	Single	HINDUISM	Indian	SC	Hindu adi dravidar	592061858182	\N	Manimegalai	Mother	Student	\N	Rural	\N	\N	\N	f	2025-12-27 05:16:55.917168	2025-12-27 05:16:55.91717	f	f	f	2025-12-27 05:16:55.917165	\N	2025-2026	1	f	0	\N
93	1500136	OLPGCWC100681	X0326015	Mrs.	Mythily	T	Female	1987-02-15	B+	tmythi@gmail.com	919578111490	+91-8072079275	+91-9578111490	Married	HINDUISM	Indian	OBC	Viswakarma	220492165875	\N	Thirumaran .E	Husband	Unemployed	0 - 3 Lakhs	Rural	\N	\N	\N	f	2025-12-27 05:16:55.955381	2025-12-27 05:16:55.955383	f	f	f	2025-12-27 05:16:55.955378	\N	2025-2026	1	f	0	\N
95	1500136	OLPGCWC100690	X0326016	Dr.	Shyamala	KUMAR	Female	1966-01-30	B-	kumarshyamala@yahoo.com	917823919197	\N	+91-7823919197	Married	HINDUISM	Indian	General	Brahmin	655261068228	\N	LAKSHMI KUMAR	Husband	Employed	0 - 3 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:16:55.974498	2025-12-27 05:16:55.9745	f	f	f	2025-12-27 05:16:55.974495	\N	2025-2026	1	f	0	\N
96	1500136	OLPGCWC100693	X0326017	Ms.	Karthiga	M	Female	1986-04-04	B+	karthiga.m.mca@gmail.com	919942743746	\N	+91-9942743746	Divorced	HINDUISM	Indian	General	\N	476639242665	\N	Pavithra Vittal	Other|Sister 	Employed	10 Lakhs - 15 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:16:55.98425	2025-12-27 05:16:55.984251	f	f	f	2025-12-27 05:16:55.984246	\N	2025-2026	1	f	0	\N
106	1500132	OLPGCIH100723	X0226026	Mr.	Arunkannan	Sargunam	Male	1981-09-19	\N	svakannan@gmail.com	918220752465	\N	+91-8220752465	Married	HINDUISM	Indian	OBC	\N	970659867403	\N	Anitha	Wife	Employed	6 -10 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:25:59.557898	2025-12-27 05:25:59.5579	f	f	f	2025-12-27 05:25:59.557893	\N	2025-2026	1	f	0	\N
98	1500136	OLPGCWC100704	X0326018	Mr.	Joseph M	A	Male	1962-08-01	O-	majoseph153@gmail.com	919846091844	\N	+91-9846091844	Married	CHRISTIANITY	Indian	General	\N	674911923455	\N	Mrs Animma joseph	Wife	Employed	3 - 6 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:16:56.003079	2025-12-27 05:16:56.003081	f	f	f	2025-12-27 05:16:56.003076	\N	2025-2026	1	f	0	\N
99	1500136	OLPGCWC100705	X0326019	Ms.	Varsha	Sundararajan	Female	1969-10-16	A+	varshaa.moahan@gmail.com	919551118323	\N	+91-9551118323	Married	HINDUISM	Indian	General	\N	539473886805	\N	Moahan Ananda Venkatesan	Husband	Unemployed	0 - 3 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:16:56.012555	2025-12-27 05:16:56.012557	f	f	f	2025-12-27 05:16:56.012552	\N	2025-2026	1	f	0	\N
100	1500136	OLPGCWC100712	X0326020	Mrs.	Divya Bala	krishnan	Female	1997-07-15	O+	divyabalakrishnan1577@gmail.com	917708831956	+91-9952146787	+91-7708831956	Married	HINDUISM	Indian	OBC	\N	683396781108	\N	Rama krishnnan	Husband	Unemployed	\N	Rural	\N	\N	\N	f	2025-12-27 05:16:56.023641	2025-12-27 05:16:56.023642	f	f	f	2025-12-27 05:16:56.023637	\N	2025-2026	1	f	0	\N
102	1500136	OLPGCWC100717	X0326021	Dr.	Varshini	V	Female	1999-12-21	O+	varshini.v2199@gmail.com	917598920692	\N	+91-7598920692	Single	HINDUISM	Indian	SC	Adi Dravida	245031143004	\N	Vengatesan S	Father	Retired	0 - 3 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:16:56.046927	2025-12-27 05:16:56.046929	f	f	f	2025-12-27 05:16:56.046924	\N	2025-2026	1	f	0	\N
103	1500136	OLPGCWC100719	X0326022	Mr.	GUNASUNDARI	.s	Female	1987-02-05	O+	sgs.harini@gmail.com	919578818777	\N	+91-9578818777	Married	HINDUISM	Indian	General	\N	648022415697	\N	Saravanan	Husband	Unemployed	0 - 3 Lakhs	Rural	\N	\N	\N	f	2025-12-27 05:16:56.058621	2025-12-27 05:16:56.058623	f	f	f	2025-12-27 05:16:56.058618	\N	2025-2026	1	f	0	\N
115	1500136	OLPGCWC100766	X0326029	Mrs.	Lakshmi	Kiran	Female	1979-08-26	O+	kirank02@gmail.com	919963687044	+91-9281144117	+91-9963687044	Married	HINDUISM	Indian	OBC	Padmashali	659243154409	\N	KVN Ravi Shankar	Husband	Employed	0 - 3 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:25:59.66105	2025-12-27 05:25:59.661052	f	f	f	2025-12-27 05:25:59.661047	\N	2025-2026	1	f	0	\N
116	1500136	OLPGCWC100768	X0326030	Mrs.	SURIYA SRE	VS	Female	1983-04-24	B+	vs.suriyasre@gmail.com	919940092538	+91-8778287568	+91-9940092538	Married	HINDUISM	Indian	General	HINDU-BRAHMIN	601950789653	\N	GM Sathya Prakkash	Husband	Employed	0 - 3 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:25:59.671824	2025-12-27 05:25:59.671826	f	f	f	2025-12-27 05:25:59.671821	\N	2025-2026	1	f	0	\N
117	1500136	OLPGCWC100771	X0326031	Ms.	Reshma.E	.	Female	2001-06-03	B+	reshmadevraju@gmail.com	918925292040	+91-9360300323	+91-8925292040	Single	HINDUISM	Indian	OBC	Boyar	768516171001	\N	Valli	Other|Grandmother	Employed	3 - 6 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:25:59.682457	2025-12-27 05:25:59.682459	f	f	f	2025-12-27 05:25:59.682454	\N	2025-2026	1	f	0	\N
118	1500136	OLPGCWC100772	X0326032	Ms.	Sruthi	Babu	Female	2001-12-12	A-	sruthishankar2001@gmail.com	918939126936	+91-9361641652	+91-8939126936	Single	HINDUISM	Indian	General	Brahmin	506018241012	\N	Babu.N	Father	Employed	3 - 6 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:25:59.693169	2025-12-27 05:25:59.693171	f	f	f	2025-12-27 05:25:59.693164	\N	2025-2026	1	f	0	\N
138	1500136	OLPGCWC100832	X0326047	Mrs.	Malasree	N	Female	1997-06-06	A+	suneesh1415@gmail.com	916383841675	+91-9790700251	+91-6383841675	Married	HINDUISM	Indian	OBC	\N	760071361955	\N	Suneesh	Husband	Employed	\N	Urban	\N	\N	\N	f	2026-01-02 06:02:40.335858	2026-01-02 06:02:40.33586	f	f	f	2026-01-02 06:02:40.335854	\N	2025-2026	1	f	0	\N
122	1500136	OLPGCWC100793	X0326035	Dr.	Leena	Nair	Female	1975-04-10	B+	drleena2005@rediffmail.com	919995734234	\N	+91-9995734234	Widowed	HINDUISM	Indian	General	Nair	883252625345	\N	Nisha Nair	Other|Sister	Employed	\N	Rural	\N	\N	\N	f	2025-12-27 05:25:59.735905	2025-12-27 05:25:59.735906	f	f	f	2025-12-27 05:25:59.735901	\N	2025-2026	1	f	0	\N
123	1500136	OLPGCWC100798	X0326036	Dr.	SASANKA SEKHAR	DASH	Male	1992-06-16	A+	drssdash1@gmail.com	918895538351	\N	+91-8895538351	Married	HINDUISM	Indian	OBC	\N	706564271868	\N	HADIBANDHU DASH	Father	Employed	6 -10 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:25:59.746677	2025-12-27 05:25:59.746679	f	f	f	2025-12-27 05:25:59.746674	\N	2025-2026	1	f	0	\N
124	1500136	OLPGCWC100811	X0326037	Dr.	Kavitha	Rajaram	Female	1980-06-08	B+	kavidr@hotmail.com	919884871807	+91-8248768828	+91-9884871807	Married	HINDUISM	Indian	OBC	MBC	600188497577	\N	C.R.K.BALAJI	Husband	Employed	6 -10 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:25:59.757376	2025-12-27 05:25:59.757377	f	f	f	2025-12-27 05:25:59.757372	\N	2025-2026	1	f	0	\N
125	1500136	OLPGCWC100816	X0326038	Mr.	GANESH KUMAR	Subramani	Male	1987-11-09	AB+	ganesh.psmani@gmail.com	919787366250	\N	+965-69991619	Married	HINDUISM	Indian	OBC	\N	408750005716	\N	Subramani	Father	Employed	3 - 6 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:25:59.768104	2025-12-27 05:25:59.768105	f	f	f	2025-12-27 05:25:59.7681	\N	2025-2026	1	f	0	\N
126	1500136	OLPGCWC100821	X0326039	Mrs.	Vasanthi	S	Female	1993-03-02	AB+	vasanthisrinivasan7@gmail.com	919840616133	+91-9094792921	+91-9840616133	Married	HINDUISM	Indian	General	Muthuraja Naidu	366152205562	\N	Vasu B	Husband	Unemployed	10 Lakhs - 15 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:25:59.778951	2025-12-27 05:25:59.778952	f	f	f	2025-12-27 05:25:59.778947	\N	2025-2026	1	f	0	\N
127	1500136	OLPGCWC100823	X0326040	Dr.	YEDIDI	SAMYUKTA	Female	1984-01-12	O+	ysamyukta@gmail.com	919952961822	+91-9790032292	+91-9952961822	Married	HINDUISM	Indian	General	\N	791578422426	\N	KVN SHAMEER	Husband	Employed	10 Lakhs - 15 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:25:59.789775	2025-12-27 05:25:59.789776	f	f	f	2025-12-27 05:25:59.789771	\N	2025-2026	1	f	0	\N
128	1500136	OLPGCWC100824	X0326041	Dr.	Bhuvanesswari	S	Female	1987-03-21	B+	dr.buva@gmail.com	919500884242	\N	+91-9500884242	Married	HINDUISM	Indian	OBC	valaiyar	423357362172	\N	Prabhakar.P	Husband	Employed	6 -10 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:25:59.800519	2025-12-27 05:25:59.800521	f	f	f	2025-12-27 05:25:59.800515	\N	2025-2026	1	f	0	\N
129	1500136	OLPGCWC100825	X0326042	Dr.	Dr. Mounika	Buduru	Female	1998-10-16	A+	mounika.buduru98@gmail.com	918310439361	\N	+91-8310439361	Single	HINDUISM	Indian	General	\N	634152802578	\N	Sreenivasa Prasad Buduru	Father	Student	\N	Urban	\N	\N	\N	f	2025-12-27 05:25:59.811298	2025-12-27 05:25:59.8113	f	f	f	2025-12-27 05:25:59.811295	\N	2025-2026	1	f	0	\N
130	1500136	OLPGCWC100827	X0326043	Mr.	Arun	Joie SJ	Male	1997-11-28	A+	arunjoie@gmail.com	919791037534	+91-9487603255	+91-9791037534	Married	CHRISTIANITY	Indian	OBC	Nadar	984684193617	\N	Femila rose	Wife	Employed	6 -10 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:25:59.822026	2025-12-27 05:25:59.822028	f	f	f	2025-12-27 05:25:59.822023	\N	2025-2026	1	f	0	\N
139	1500136	OLPGCWC100835	X0326048	Mrs.	Monika	Choraria	Female	1979-11-16	O+	monika.choraria1@gmail.com	919940319820	+91-9841294102	+91-9940319820	Married	JAINISM	Indian	General	\N	498091765709	\N	ASHISH CHORARIA	Husband	Employed	6 -10 Lakhs	Urban	\N	\N	\N	f	2026-01-02 07:36:12.603521	2026-01-02 07:36:12.603523	f	f	f	2026-01-02 07:36:12.603517	\N	2025-2026	1	f	0	\N
141	1500136	OLPGCWC100838	X0326049	Mr.	Mohanraj	Chandrababu	Male	1989-03-21	O-	c.s.mohancharan@gmail.com	919080853322	+91-9080384026	+91-9080384026	Married	HINDUISM	Indian	OBC	Sozhiya chetty	611178247145	\N	CHANDRABABU M	Father	Employed	Above 15 Lakhs	Rural	\N	\N	\N	f	2026-01-03 06:43:47.875554	2026-01-03 06:43:47.875556	f	f	f	2026-01-03 06:43:47.875549	\N	2025-2026	1	f	0	\N
58	1500132	OLPGCIH100215	X0226001	Ms.	Srinedhe	Gopalakrishnan srinedhe	Female	2003-08-25	B+	srinedheg@gmail.com	919363160646	+91-9443956355	+91-9443956355	Single	HINDUISM	Indian	General	Hindu	942836967901	\N	V.Gopalakrishnan	Father	Student	3 - 6 Lakhs	Rural	\N	\N	\N	f	2025-12-27 05:16:55.620276	2025-12-27 05:16:55.620278	f	f	f	2025-12-27 05:16:55.620273	\N	2025-2026	1	f	0	\N
59	1500132	OLPGCIH100475	X0226002	Mr.	Ismayil Kaniyam	Parambil	Male	1986-09-11	A+	ismayilkp66@gmail.com	919995555935	\N	+91-9995555935	Married	ISLAM	Indian	OBC	Muslim	803384334172	\N	Mohammedunni Haji	Father	Employed	0 - 3 Lakhs	Rural	\N	\N	\N	f	2025-12-27 05:16:55.633568	2025-12-27 05:16:55.633571	f	f	f	2025-12-27 05:16:55.633553	\N	2025-2026	1	f	0	\N
60	1500132	OLPGCIH100501	X0226003	Mr.	Anandababu	Narayanan	Male	1983-03-12	O+	a2raman@gmail.com	919004806233	\N	+91-9004806233	Married	HINDUISM	Indian	General	\N	253292551079	\N	Narayanan	Father	Employed	Above 15 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:16:55.643822	2025-12-27 05:16:55.643824	f	f	f	2025-12-27 05:16:55.643819	\N	2025-2026	1	f	0	\N
61	1500132	OLPGCIH100508	X0226004	Mr.	Pradheep	Duraimani	Male	1987-05-21	O+	pradheep0587@gmail.com	919500880330	+974-31084620	+91-9500880330	Married	HINDUISM	Indian	General	Nadar	881481876815	\N	Pradeepa	Wife	Employed	6 -10 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:16:55.653651	2025-12-27 05:16:55.653653	f	f	f	2025-12-27 05:16:55.653648	\N	2025-2026	1	f	0	\N
62	1500132	OLPGCIH100517	X0226005	Mr.	A.K. SAHABAR	SATHIK	Male	1976-03-06	A+	sathik.environment2020@gmail.com	919171985991	+91-8428985991	+91-9171985991	Married	ISLAM	Indian	OBC	BC (Muslim) -Labbai	370347052302	\N	Madinah Begam	Wife	Employed	0 - 3 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:16:55.663592	2025-12-27 05:16:55.663593	f	f	f	2025-12-27 05:16:55.663588	\N	2025-2026	1	f	0	\N
107	1500136	OLPGCWC100724	X0326023	Mrs.	Anuja Rani	Sasidharan	Female	1985-10-28	O+	anujavs@gmail.com	919884818144	+91-9600055243	+91-9884818144	Married	HINDUISM	Indian	General	\N	742014617920	\N	SASIDHARAN	Father	Unemployed	0 - 3 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:25:59.578806	2025-12-27 05:25:59.578808	f	f	f	2025-12-27 05:25:59.578803	\N	2025-2026	1	f	0	\N
109	1500136	OLPGCWC100739	X0326024	Dr.	KARTHIK.S	.	Male	1994-06-01	O+	karthikitsme6@gmail.com	919176541141	\N	+91-9176541141	Married	HINDUISM	Indian	General	Ambalakarar	795367444129	\N	Divyabharathi N	Wife	Unemployed	3 - 6 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:25:59.599755	2025-12-27 05:25:59.599757	f	f	f	2025-12-27 05:25:59.599752	\N	2025-2026	1	f	0	\N
111	1500136	OLPGCWC100756	X0326025	Mrs.	Amreen	Fathima	Female	1980-03-23	O+	amreenillyas763@gmail.com	919940250557	+91-9940222270	+91-9940250557	Married	ISLAM	Indian	General	Muslim	330137412997	\N	Illias ahmed. A	Husband	Employed	3 - 6 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:25:59.619941	2025-12-27 05:25:59.619942	f	f	f	2025-12-27 05:25:59.619938	\N	2025-2026	1	f	0	\N
112	1500136	OLPGCWC100757	X0326026	Mrs.	DeviPriya	M	Female	1988-11-08	A+	mdevi.priya88@gmail.com	918681947755	+91-9940539255	+91-8681947755	Married	HINDUISM	Indian	General	\N	389573970260	\N	Kannan S	Husband	Employed	6 -10 Lakhs	Rural	\N	\N	\N	f	2025-12-27 05:25:59.629773	2025-12-27 05:25:59.629774	f	f	f	2025-12-27 05:25:59.62977	\N	2025-2026	1	f	0	\N
113	1500136	OLPGCWC100760	X0326027	Mrs.	praveena	Selvaraj	Female	1982-06-08	A+	prave.arun@gmail.com	919052550134	\N	+91-9052550134	Married	HINDUISM	Indian	General	\N	780523390030	\N	Arun Prasand	Husband	Unemployed	\N	Urban	\N	\N	\N	f	2025-12-27 05:25:59.639681	2025-12-27 05:25:59.639682	f	f	f	2025-12-27 05:25:59.639677	\N	2025-2026	1	f	0	\N
114	1500136	OLPGCWC100762	X0326028	Mrs.	P.R.Gethareswari	.	Female	1986-12-19	B+	gethusri2009@gmail.com	919940346321	+91-9940358549	+91-9940346321	Married	HINDUISM	Indian	General	vanniyakula kshatriya	888252637529	\N	Ganesh raja	Husband	Employed	3 - 6 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:25:59.650272	2025-12-27 05:25:59.650274	f	f	f	2025-12-27 05:25:59.650269	\N	2025-2026	1	f	0	\N
119	1500136	OLPGCWC100773	X0326033	Ms.	Kumudavikasri	Srinivasan	Female	2002-10-15	AB+	kumudavikasrisrinivasan2002@gmail.com	919962715896	\N	+91-9962715896	Single	HINDUISM	Indian	SC	Adhidravidar	974374566939	\N	Srinivasan	Father	Employed	3 - 6 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:25:59.703857	2025-12-27 05:25:59.703859	f	f	f	2025-12-27 05:25:59.703854	\N	2025-2026	1	f	0	\N
120	1500136	OLPGCWC100774	X0326034	Ms.	Raghana	Shridhar	Female	2000-01-01	A+	raghana.shridhar@gmail.com	919962704778	+91-8939370107	+91-9962704778	Single	HINDUISM	Indian	General	Balija Naidu	219152909892	\N	P R Shridhar	Father	Employed	3 - 6 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:25:59.714492	2025-12-27 05:25:59.714493	f	f	f	2025-12-27 05:25:59.714488	\N	2025-2026	1	f	0	\N
63	1500132	OLPGCIH100521	X0226006	Mr.	SURESH AJISTON	GEORGE	Male	1993-05-10	O+	sureshajiston.wn@gmail.com	919042539826	\N	+974-70929662	Married	CHRISTIANITY	Indian	General	\N	673555678284	\N	MARY ANUSHA	Wife	Employed	3 - 6 Lakhs	Rural	\N	\N	\N	f	2025-12-27 05:16:55.673396	2025-12-27 05:16:55.673398	f	f	f	2025-12-27 05:16:55.673393	\N	2025-2026	1	f	0	\N
65	1500132	OLPGCIH100534	X0226007	Ms.	Bhavani	L	Female	1989-12-02	O+	bhavani.mlr2013@gmail.com	919632261154	+91-6360589672	+91-6360589672	Single	HINDUISM	Indian	OBC	Vannikula kshtriya	328553405128	\N	Lakshmisha MS	Father	Employed	10 Lakhs - 15 Lakhs	Rural	\N	\N	\N	f	2025-12-27 05:16:55.692207	2025-12-27 05:16:55.692208	f	f	f	2025-12-27 05:16:55.692203	\N	2025-2026	1	f	0	\N
67	1500132	OLPGCIH100538	X0226008	Dr.	Dr Kiran	.Adabala	Male	1974-05-19	A+	doctoradabala@gmail.com	918977941002	+91-9885044344	+91-8977941002	Married	HINDUISM	Indian	General	Kapu	371435980419	\N	Late Shri Krishna Mohan Adabala	Father	Employed	Above 15 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:16:55.711178	2025-12-27 05:16:55.71118	f	f	f	2025-12-27 05:16:55.711175	\N	2025-2026	1	f	0	\N
68	1500132	OLPGCIH100539	X0226009	Dr.	Waseem Hussain	Syed	Male	1989-05-09	O+	waseemrx1001@gmail.com	918019221114	\N	+91-8019221114	Married	ISLAM	Indian	General	\N	767069169214	\N	Anwar Hussain Syed	Father	\N	\N	Urban	\N	\N	\N	f	2025-12-27 05:16:55.720761	2025-12-27 05:16:55.720762	f	f	f	2025-12-27 05:16:55.720758	\N	2025-2026	1	f	0	\N
69	1500132	OLPGCIH100552	X0226010	Dr.	Dr. Syed	Asif Hussain	Male	1992-06-09	O+	syed35612@gmail.com	918341513539	+91-8019221114	+91-8341513539	Single	ISLAM	Indian	General	\N	534346989023	\N	Syed Anwar hussain	Father	\N	\N	Urban	\N	\N	\N	f	2025-12-27 05:16:55.73015	2025-12-27 05:16:55.730152	f	f	f	2025-12-27 05:16:55.730147	\N	2025-2026	1	f	0	\N
70	1500132	OLPGCIH100561	X0226011	Mrs.	Dr. Shubhangi	Hanumant	Female	1992-08-16	B+	shubhangigade07@gmail.com	918551951770	\N	+91-8551951770	Married	HINDUISM	Indian	OBC	\N	469383050001	\N	Hanumant Gade	Father	Employed	Above 15 Lakhs	Rural	\N	\N	\N	f	2025-12-27 05:16:55.739516	2025-12-27 05:16:55.739517	f	f	f	2025-12-27 05:16:55.739513	\N	2025-2026	1	f	0	\N
72	1500132	OLPGCIH100572	X0226012	Dr.	Naresh	Suresh	Male	1987-10-26	B+	nareshfadte@gmail.com	919823750679	\N	+91-9823750679	Married	HINDUISM	Indian	General	\N	342657245428	\N	Gautami Naik Ganjekar	Husband	Employed	Above 15 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:16:55.758167	2025-12-27 05:16:55.758168	f	f	f	2025-12-27 05:16:55.758163	\N	2025-2026	1	f	0	\N
74	1500132	OLPGCIH100588	X0226013	Mr.	Venkat	shreyas	Male	1995-02-24	O+	shreyasnaidu1995@gmail.com	917729959399	+91-7729959399	+91-7729959399	Single	HINDUISM	Indian	OBC	gavara	740281164190	\N	SAKTHI	Father	Retired	10 Lakhs - 15 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:16:55.776855	2025-12-27 05:16:55.776857	f	f	f	2025-12-27 05:16:55.776852	\N	2025-2026	1	f	0	\N
75	1500132	OLPGCIH100594	X0226014	Dr.	Priya	T	Female	1997-04-11	O+	drpriyathamilselvan.96@gmail.com	916385770610	\N	+91-6385770610	Single	HINDUISM	Indian	OBC	NADAR	517763614623	\N	Thamilselvan	Father	Employed	6 -10 Lakhs	Rural	\N	\N	\N	f	2025-12-27 05:16:55.786182	2025-12-27 05:16:55.786184	f	f	f	2025-12-27 05:16:55.786179	\N	2025-2026	1	f	0	\N
136	1500136	OLPGCWC100730	X0326045	Mr.	VINITHKUMAR	M	Male	1997-08-02	O+	getfitwithvini24@gmail.com	919952939053	+91-8056033511	+91-9952939053	Married	HINDUISM	Indian	General	Bc, vishwakarma	307148550279	\N	KERAN PRISKILLA	Wife	Employed	0 - 3 Lakhs	Urban	\N	\N	\N	f	2026-01-02 04:31:03.502893	2026-01-02 04:31:03.502895	f	f	f	2026-01-02 04:31:03.502889	\N	2025-2026	1	f	0	\N
78	1500132	OLPGCIH100607	X0226015	Dr.	shiny	achariya	Female	1999-07-22	B+	shinyachariyaofficial@gmail.com	919176329559	+91-9841779877	+91-9176329559	Married	CHRISTIANITY	Indian	General	\N	900050267908	\N	Abish titus	Husband	Employed	3 - 6 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:16:55.814255	2025-12-27 05:16:55.814257	f	f	f	2025-12-27 05:16:55.814252	\N	2025-2026	1	f	0	\N
85	1500132	OLPGCIH100636	X0226016	Dr.	DHANUSH	KUMAR	Male	1998-11-11	AB+	dhanushmdk6@gmail.com	919626279745	\N	+91-9626279745	Single	HINDUISM	Indian	General	Vaniyar chettiyar	341421026298	\N	Muthukumar	Father	Employed	3 - 6 Lakhs	Rural	\N	\N	\N	f	2025-12-27 05:16:55.879821	2025-12-27 05:16:55.879822	f	f	f	2025-12-27 05:16:55.879817	\N	2025-2026	1	f	0	\N
86	1500132	OLPGCIH100638	X0226017	Mr.	Vikram	Mohan	Male	1986-02-07	O+	vikramveda@outlook.com	919445304775	\N	+91-9445304775	Married	HINDUISM	Indian	OBC	Meenavar	693788457278	\N	Tinny Pushp	Wife	Employed	Above 15 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:16:55.889232	2025-12-27 05:16:55.889233	f	f	f	2025-12-27 05:16:55.889229	\N	2025-2026	1	f	0	\N
87	1500132	OLPGCIH100639	X0226018	Mr.	Geo Mathew	Pius	Male	1992-08-01	O+	geothadathil007@gmail.com	916238019460	+91-9497346508	+974-50207763	Married	CHRISTIANITY	Indian	General	\N	824705658033	\N	PIUS MATHEW	Father	Employed	0 - 3 Lakhs	Rural	\N	\N	\N	f	2025-12-27 05:16:55.898615	2025-12-27 05:16:55.898617	f	f	f	2025-12-27 05:16:55.898612	\N	2025-2026	1	f	0	\N
90	1500132	OLPGCIH100660	X0226019	Mrs.	Shrikala	A	Female	1990-07-14	O+	shrikala14@gmail.com	919489275307	+91-9042908541	+91-9042908541	Married	HINDUISM	Indian	OBC	\N	846706642896	\N	GOPINATH R V	Husband	Unemployed	\N	Urban	\N	\N	\N	f	2025-12-27 05:16:55.926652	2025-12-27 05:16:55.926654	f	f	f	2025-12-27 05:16:55.926649	\N	2025-2026	1	f	0	\N
91	1500132	OLPGCIH100673	X0226020	Mrs.	Ranjini	Ashok	Female	1991-11-23	B+	ranjinisk83@gmail.com	918129989773	+91-9633420985	+91-8129989773	Married	HINDUISM	Indian	General	Nair	338781481388	\N	Jithin Thelapurath	Husband	Unemployed	0 - 3 Lakhs	Rural	\N	\N	\N	f	2025-12-27 05:16:55.93603	2025-12-27 05:16:55.936031	f	f	f	2025-12-27 05:16:55.936026	\N	2025-2026	1	f	0	\N
92	1500132	OLPGCIH100677	X0226021	Dr.	Syed	Afroz	Male	1990-06-07	B+	afrozsyed51111@gmail.com	919553054794	+91-6300401614	+91-9553054794	Married	ISLAM	Indian	General	Muslim	359515524712	\N	Dr SMD SHAZIYA	Wife	Employed	10 Lakhs - 15 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:16:55.945777	2025-12-27 05:16:55.945778	f	f	f	2025-12-27 05:16:55.945773	\N	2025-2026	1	f	0	\N
94	1500132	OLPGCIH100682	X0226022	Mr.	Sreedhar	Yadlapati	Male	1966-07-13	A+	sreesun02@hotmail.com	97466333478	+91-9441053178	+974-66333478	Married	HINDUISM	Indian	General	Kamma	695620795057	\N	Yadlapati Sailaja	Wife	Retired	6 -10 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:16:55.964907	2025-12-27 05:16:55.964909	f	f	f	2025-12-27 05:16:55.964904	\N	2025-2026	1	f	0	\N
97	1500132	OLPGCIH100698	X0226023	Mr.	Karuppiah	A	Male	1980-06-11	O+	karuhse@gmail.com	917358887805	+965-65700560	+91-7358887805	Married	HINDUISM	Indian	General	MBC	813472346549	\N	Maharani	Wife	Employed	6 -10 Lakhs	Rural	\N	\N	\N	f	2025-12-27 05:16:55.993631	2025-12-27 05:16:55.993633	f	f	f	2025-12-27 05:16:55.993628	\N	2025-2026	1	f	0	\N
101	1500132	OLPGCIH100714	X0226024	Mr.	Dilip	Kapse	Male	1984-01-01	B+	kapsedilip@gmail.com	919930078379	+91-8454006133	+91-9930078379	Married	HINDUISM	Indian	SC	Chambhar	497671859527	\N	Dipti Kapse	Wife	Employed	3 - 6 Lakhs	Rural	\N	\N	\N	f	2025-12-27 05:16:56.035114	2025-12-27 05:16:56.035115	f	f	f	2025-12-27 05:16:56.03511	\N	2025-2026	1	f	0	\N
104	1500132	OLPGCIH100722	X0226025	Mr.	Deepak	Prakash	Male	1991-10-21	O+	deepakthangamani.kvlt@gmail.com	919629621383	+91-8939865990	+91-9629621383	Married	HINDUISM	Indian	SC	\N	445880509101	\N	DHANYA	Husband	Employed	0 - 3 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:16:56.07086	2025-12-27 05:16:56.070863	f	f	f	2025-12-27 05:16:56.070856	\N	2025-2026	1	f	0	\N
108	1500132	OLPGCIH100731	X0226027	Mrs.	Patel Pritiben	shaileshbhai	Female	1989-06-13	O+	1priti3@gmail.com	919978920176	+91-9998320176	+91-9978920176	Married	HINDUISM	Indian	ST	Dhodia	831694235320	\N	Dr Bhavin Patel	Husband	Unemployed	\N	Urban	\N	\N	\N	f	2025-12-27 05:25:59.589298	2025-12-27 05:25:59.5893	f	f	f	2025-12-27 05:25:59.589295	\N	2025-2026	1	f	0	\N
110	1500132	OLPGCIH100755	X0226028	Mr.	Rakup Suresh	Kumar	Male	1990-08-12	A+	sureshdr0946@gmail.com	918500021384	+91-9100503300	+91-8500021384	Married	HINDUISM	Indian	SC	MALA-HINDU	202103352825	\N	Tamadapu Chandrika	Wife	Employed	6 -10 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:25:59.609785	2025-12-27 05:25:59.609787	f	f	f	2025-12-27 05:25:59.609782	\N	2025-2026	1	f	0	\N
29	1500038	OLUGDS100019	O0525001	Mr.	Jeswin	L	Male	2006-04-11	B+	jeswinaro001@gmail.com	919626512494	\N	+91-9626512494	Single	CHRISTIANITY	Indian	OBC	Nathaman	452268769783	ATEPM2324D	Luckas Antony Samy	Father	\N	\N	Urban	\N	\N	\N	f	2025-09-26 07:32:00.730448	2025-10-15 03:41:48.974887	t	f	\N	\N	\N	2025-2026	1	f	0	\N
171	1500130	OLPGCOB100981	x0725001	Ms.	Mrudula V	Raman	Female	2004-04-01	\N	mrudulavenkat01@gmail.com	919342206744	\N	+91-9342206744	Single	HINDUISM	Indian	General	\N	926651561006	\N	Vasundara V	Mother	Student	0 - 3 Lakhs	Urban	\N	\N	\N	f	2026-03-11 14:23:55.339296	2026-03-11 14:23:55.339301	f	f	f	2026-03-11 14:23:55.339286	\N	2025-2026	1	f	0	\N
172	1500130	OLPGCOB100917	x0725002	Mrs.	Caroline Karunya	M	Female	1993-04-11	O-	caro.karun@gmail.com	919894670135	\N	+91-9894670135	Married	CHRISTIANITY	Indian	General	OC	814416433992	\N	Prasanth Y	Husband	Employed	10 Lakhs - 15 Lakhs	Urban	\N	\N	\N	f	2026-03-11 14:24:01.960267	2026-03-11 14:24:01.960269	f	f	f	2026-03-11 14:24:01.960262	\N	2025-2026	1	f	0	\N
173	1500130	OLPGCOB100912	x0725003	Ms.	Keerthana	Ramesh	Female	2000-07-17	O+	keerthanaramesh729@gmail.com	917397012155	+91-9600180313	+91-7397012155	Single	HINDUISM	Indian	General	BC	745062064310	\N	Vigneswaran	Other|well-wisher	Employed	0 - 3 Lakhs	Urban	\N	\N	\N	f	2026-03-11 14:24:09.950279	2026-03-11 14:24:09.950282	f	f	f	2026-03-11 14:24:09.950273	\N	2025-2026	1	f	0	\N
174	1500130	OLPGCOB100896	x0725004	Dr.	Ranjith Thavarul	puthiyedath	Male	1975-05-25	O+	ranjiphd@gmail.com	919845448406	\N	+91-9845448406	Married	HINDUISM	Indian	General	Nair	976843119756	\N	Balakrishnan AK	Father	Employed	Above 15 Lakhs	Urban	\N	\N	\N	f	2026-03-11 14:24:14.108635	2026-03-11 14:24:14.108638	f	f	f	2026-03-11 14:24:14.108628	\N	2025-2026	1	f	0	\N
175	1500130	OLPGCOB100891	x0725005	Mr.	Kaushik Venkateswar	KV	Male	1990-11-13	O+	kaushikvenkateswarkv@gmail.com	919500000982	\N	+91-9500000982	Married	HINDUISM	Indian	General	\N	905925331650	\N	Monica D	Wife	Employed	Above 15 Lakhs	Urban	\N	\N	\N	f	2026-03-11 14:24:21.460444	2026-03-11 14:24:21.46045	f	f	f	2026-03-11 14:24:21.460434	\N	2025-2026	1	f	0	\N
176	1500130	OLPGCOB100886	x0725006	Mrs.	Shanmugapriya	Rajaelangovan	Female	1989-09-14	B-	priya.rajaelangovan@gmail.com	919790970028	\N	+91-9790970028	Married	HINDUISM	Indian	OBC	\N	538840690153	\N	T PREMA	Mother	Employed	Above 15 Lakhs	Urban	\N	\N	\N	f	2026-03-11 14:24:28.006307	2026-03-11 14:24:28.006309	f	f	f	2026-03-11 14:24:28.0063	\N	2025-2026	1	f	0	\N
179	1500130	OLPGCOB100871	x0725007	Ms.	Kaaviya	gadi	Female	1996-05-20	O+	kaaviyagadi@gmail.com	917550024219	+91-9710849500	+91-7550024219	Married	HINDUISM	Indian	General	Agamudaiyar - Mudaliyar	908066511682	\N	Rupa kumar gadi	Father	Employed	0 - 3 Lakhs	Urban	\N	\N	\N	f	2026-03-11 17:21:28.895302	2026-03-11 17:21:28.895309	f	f	f	2026-03-11 17:21:28.895286	\N	2025-2026	1	f	0	\N
180	1500038	OLUGDS100590	O0525031	Ms.	Archana.	E	Female	2007-03-04	O+	archanaelangovan0437@gmail.com	919080562123	+91-9442215470	+91-9080562123	Single	HINDUISM	Indian	OBC	Mbc	688386063769	\N	Elangovan . S	Father	Student	6 -10 Lakhs	Urban	\N	\N	\N	f	2026-03-11 17:23:03.884406	2026-03-11 17:23:03.884412	f	f	f	2026-03-11 17:23:03.884389	\N	2025-2026	1	f	0	\N
121	1500132	OLPGCIH100788	X0226029	Mr.	Subhendu	Mohanty	Male	1970-05-14	B+	subhendu.mohanty70@gmail.com	919920788404	+91-9930988404	+91-9920788404	Married	HINDUISM	Indian	General	Karana	514255648626	\N	Pranati Mohanty	Wife	Employed	Above 15 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:25:59.725245	2025-12-27 05:25:59.725247	f	f	f	2025-12-27 05:25:59.725242	\N	2025-2026	1	f	0	\N
131	1500132	OLPGCIH100830	X0226030	Mr.	Balamurugan	K	Male	2000-07-21	O+	bala66935@gmail.com	918531969943	+91-9361234612	+91-8531969943	Single	HINDUISM	Indian	OBC	Hindu yadhavar	500468194375	\N	S. Kesevanarayanan	Father	Employed	0 - 3 Lakhs	Urban	\N	\N	\N	f	2025-12-27 05:25:59.833295	2025-12-27 05:25:59.833296	f	f	f	2025-12-27 05:25:59.833291	\N	2025-2026	1	f	0	\N
133	1500132	OLPGCIH100536	X0226031	Dr.	Dr. K.	Shashidhar	Male	1989-12-17	O+	shashi17dec@gmail.com	918686138181	\N	+91-8686138181	Married	HINDUISM	Indian	OBC	BC-B	596207124374	\N	Kedari	Father	Employed	10 Lakhs - 15 Lakhs	Rural	\N	\N	\N	f	2025-12-30 05:14:43.666241	2025-12-30 05:14:43.666243	f	f	f	2025-12-30 05:14:43.666238	\N	2025-2026	1	f	0	\N
31	1500038	OLUGDS100033	O0525003	Mr.	Kaushal	Shanker	Male	2003-11-01	O+	shankerkaushal03@gmail.com	919444506363	\N	+91-9444506363	Single	HINDUISM	Indian	OBC	\N	258299310199	LQZPK1778F	De.Hemalatha shanker	Mother	Student	0 - 3 Lakhs	Urban	\N	\N	\N	f	2025-09-26 07:32:00.761003	2025-10-15 03:45:31.09995	t	f	\N	\N	\N	2025-2026	1	f	0	\N
33	1500038	OLUGDS100071	O0525005	Mr.	Abishek Kumaran	Balaji	Male	2005-11-07	AB-	abishekkumaranbalaji@gmail.com	918825972045	+91-9445270270	+91-8825972045	Single	HINDUISM	Indian	OBC	Nadar	293026572067	HXUPB9889Q	Balaji D	Father	Student	0 - 3 Lakhs	Urban	\N	\N	\N	f	2025-09-26 07:32:00.780792	2025-10-15 03:45:20.805021	t	f	\N	\N	\N	2025-2026	1	f	0	\N
30	1500038	OLUGDS100028	O0525002	Dr.	Dr Leena	Pavitha	Female	1993-08-28	B+	leenapavitha28@gmail.com	919952385693	\N	+91-9952385693	Married	CHRISTIANITY	Indian	OBC	\N	927311520557	APDPL4470P	Devadoss Salem Dinakar	Husband	Employed	3 - 6 Lakhs	Urban	\N	\N	\N	f	2025-09-26 07:32:00.749213	2025-10-15 03:45:27.298748	t	f	\N	\N	\N	2025-2026	1	f	0	\N
34	1500038	OLUGDS100128	O0525006	Mr.	Adhithya	N. S. G.	Male	2004-12-01	B+	rudhras2008@gmail.com	919600077002	+91-7092295079	+91-9600077002	Single	HINDUISM	Indian	OBC	\N	251855013610	EQUPG1982F	Ganesh moorthy. N. S	Father	\N	\N	Urban	\N	\N	\N	f	2025-09-26 07:32:00.79075	2025-10-15 03:45:24.273513	t	f	\N	\N	\N	2025-2026	1	f	0	\N
37	1500038	OLUGDS100319	O0525009	Mr.	Aswin	T	Male	2006-06-21	B+	thangarajuaswin123@gmail.com	916374271166	+91-9524133915	+91-6374271166	Single	HINDUISM	Indian	SC	Devendra Kula velalar	840036295578	CUYPT6608R	T. Vasanthi	Mother	Unemployed	0 - 3 Lakhs	Rural	\N	\N	\N	f	2025-09-26 07:32:00.819601	2025-10-15 03:50:09.990012	t	f	\N	\N	\N	2025-2026	1	f	0	\N
42	1500038	OLUGDS100419	O0525011	Mr.	Ansar Ahammed	P V	Male	1981-05-28	\N	pvahammedpv@gmail.com	918891800574	\N	+91-8891800574	Married	ISLAM	Indian	OBC	MAPPILA	693104006742	AIUPA7695P	SITHU MOHAMMAED P V	Father	Unemployed	3 - 6 Lakhs	Rural	\N	\N	\N	f	2025-09-29 10:04:17.198727	2025-10-15 03:54:48.444513	t	f	\N	\N	\N	2025-2026	1	f	0	\N
43	1500038	OLUGDS100480	O0525012	Mr.	Prathyush	Ayyappan	Male	2006-09-01	B+	imprathyush6@gmail.com	919500562376	+91-7550070754	+91-9500562376	Single	HINDUISM	Indian	General	\N	399515606276	FUTPA0654Q	Ayyappan J	Father	Student	3 - 6 Lakhs	Urban	\N	\N	\N	f	2025-09-29 10:04:17.21952	2025-10-15 03:54:50.882258	t	f	\N	\N	\N	2025-2026	1	f	0	\N
46	1500038	OLUGDS100489	O0525014	Ms.	N.	Akshaya	Female	2007-05-17	O+	n.akshaya2007@gmail.com	919486291205	+91-9789902630	+91-9486291205	Single	HINDUISM	Indian	OBC	Satha tha sri vaishnava	255322055306	\N	Parents	Father	Student	\N	Urban	\N	\N	\N	f	2025-10-07 07:24:30.441495	2025-10-15 03:54:55.843974	t	f	\N	\N	\N	2025-2026	1	f	0	\N
53	1500038	OLUGDS100463	O0525021	Mrs.	Murshidha	Sheerin	Female	2002-12-27	A+	murshidhashif15@gmail.com	917403999966	+971-554660823	+91-7403999966	Married	ISLAM	Indian	OBC	Bc	354065858182	\N	Ashif	Husband	Unemployed	0 - 3 Lakhs	Urban	\N	\N	\N	f	2025-10-14 10:21:34.95939	2025-10-15 04:09:45.34602	t	f	\N	\N	\N	2025-2026	1	f	0	\N
55	1500038	OLUGDS100513	O0525023	Ms.	Navneet	Sharma	Female	2000-03-10	O+	navneet103sharma@gmail.com	918872307879	+1-6475723665	+91-8872307879	Single	HINDUISM	Indian	General	Brahmin	571460538388	\N	Rajesh Kumar	Father	Employed	3 - 6 Lakhs	Urban	\N	\N	\N	f	2025-10-16 04:06:05.054142	2025-10-16 04:07:25.586745	t	f	\N	\N	\N	2025-2026	1	f	0	\N
32	1500038	OLUGDS100034	O0525004	Mr.	mohammed afrid	azami	Male	2007-04-14	O+	afridazami14@gmail.com	919840956360	\N	+91-9840956360	Single	ISLAM	Indian	OBC	\N	285152408816	ATEPT8687D	mohammed kaifi azami	Father	Student	0 - 3 Lakhs	Urban	\N	\N	\N	f	2025-09-26 07:32:00.770858	2025-10-15 03:45:34.074016	t	f	\N	\N	\N	2025-2026	1	f	0	\N
35	1500038	OLUGDS100289	O0525007	Dr.	Manimekalai	Narayanan	Female	1985-06-01	O+	m.manimekalai@sriramachandra.edu.in	919841368740	+91-9094751818	+91-9841368740	Married	HINDUISM	Indian	OBC	Thuluva vellar	568762655262	AXZPM2307G	NARAYANAN V	Husband	Employed	6 -10 Lakhs	Urban	\N	\N	\N	f	2025-09-26 07:32:00.80068	2025-10-15 03:50:18.230072	t	f	\N	\N	\N	2025-2026	1	f	0	\N
148	1500038	OLUGDS100957	O0525026	Mrs.	Jean sophiya	shiny	Female	1990-07-07	B+	jean07sophiya@gmail.com	919840441171	\N	+91-9840441171	Divorced	CHRISTIANITY	Indian	General	\N	917698476918	\N	J DEVA SARGUNA DOSS	Father	Employed	3 - 6 Lakhs	Urban	\N	\N	\N	f	2026-03-06 08:01:12.363241	2026-03-06 08:01:12.363244	f	f	f	2026-03-06 08:01:12.363234	\N	2025-2026	1	f	0	\N
134	1500132	OLPGCIH100696	X0226032	Dr.	BETHI	NAVYA	Female	1990-08-12	\N	bethinavya@gmail.com	919032166566	\N	+91-9032166566	Married	HINDUISM	Indian	General	Padmashali	658785871148	\N	Bethi Amaravathi	Mother	Employed	Above 15 Lakhs	Urban	\N	\N	\N	f	2025-12-30 05:14:43.677798	2025-12-30 05:14:43.6778	f	f	f	2025-12-30 05:14:43.677795	\N	2025-2026	1	f	0	\N
140	1500132	OLPGCIH100764	X0226033	Mrs.	SADHNA	VERMA	Female	1984-02-23	B+	sadhnaverma84@gmail.com	919981502302	\N	+91-9981502302	Married	HINDUISM	Indian	General	\N	844651622482	\N	Jageshwar Prasad Verma	Husband	Employed	Above 15 Lakhs	Urban	\N	\N	\N	f	2026-01-02 09:40:31.142295	2026-01-02 09:40:31.142297	f	f	f	2026-01-02 09:40:31.142291	\N	2025-2026	1	f	0	\N
36	1500038	OLUGDS100290	O0525008	Mr.	Ramkumar	Santhanakrishnan	Male	1982-12-25	A+	ramsipl21@gmail.com	918610371396	\N	+91-8610371396	Married	HINDUISM	Indian	OBC	Kamma Naidu	826660590404	CJDPR7307F	Murugaveni	Wife	Employed	Above 15 Lakhs	Urban	\N	\N	\N	f	2025-09-26 07:32:00.810182	2025-10-15 03:50:19.741899	t	f	\N	\N	\N	2025-2026	1	f	0	\N
39	1500038	OLUGDS100352	O0525010	Mr.	PRAVEEN	M	Male	2000-04-15	AB+	praveenmurugan351@gmail.com	918270961511	+91-9080314020	+91-8270961511	Single	HINDUISM	Indian	General	Yadhava	438082818187	GMDPP5588K	S.Murugan	Father	Employed	0 - 3 Lakhs	Urban	\N	\N	\N	f	2025-09-29 09:51:31.68062	2025-10-15 03:50:12.162193	t	f	\N	\N	\N	2025-2026	1	f	0	\N
45	1500038	OLUGDS100453	O0525013	Ms.	JANIKSHA	M	Female	2005-06-23	B+	janiksha28486@gmail.com	919445535784	+91-9445535783	+91-9445535784	Single	HINDUISM	Indian	OBC	BERI CHETTIAR	430393371272	\N	MANOHAR M	Father	Employed	0 - 3 Lakhs	Urban	\N	\N	\N	f	2025-10-07 07:24:30.395024	2025-10-15 03:54:53.382269	t	f	\N	\N	\N	2025-2026	1	f	0	\N
47	1500038	OLUGDS100490	O0525015	Mr.	S.	Prayag	Male	2006-12-28	A+	prayagsriram@gmail.com	919840302862	+91-9840922862	+91-9840302862	Single	HINDUISM	Indian	General	Brahmin	804395435914	\N	R. Sriram	Father	Student	3 - 6 Lakhs	Urban	\N	\N	\N	f	2025-10-07 07:24:30.458151	2025-10-15 03:54:58.274229	t	f	\N	\N	\N	2025-2026	1	f	0	\N
48	1500038	OLUGDS100498	O0525016	Mr.	Rhushikesh Omprakash	Rai	Male	2003-04-17	O+	rairhushikesh0@gmail.com	919769358550	\N	+91-9769358550	Single	HINDUISM	Indian	General	\N	307623475823	\N	Anita Rai	Mother	Employed	0 - 3 Lakhs	Urban	\N	\N	\N	f	2025-10-07 07:24:30.469026	2025-10-15 04:04:26.611552	t	f	\N	\N	\N	2025-2026	1	f	0	\N
49	1500038	OLUGDS100500	O0525017	Mr.	Jayasriman	M	Male	2006-08-08	O+	srimanjayanth88@gmail.com	918667765848	+91-9865004177	+91-8667765848	Single	HINDUISM	Indian	General	yadhava	923371351486	\N	MARIMUTHU.K	Father	Student	0 - 3 Lakhs	Urban	\N	\N	\N	f	2025-10-07 07:24:30.480649	2025-10-15 04:05:32.471798	t	f	\N	\N	\N	2025-2026	1	f	0	\N
50	1500038	OLUGDS100504	O0525018	Mrs.	Safrin	A	Female	2006-03-28	B+	afrinbegam56@gmail.com	916383145126	+91-8610041897	+91-6383145126	Married	ISLAM	Indian	General	Lebbai rawthar	302268526058	\N	Esak mathina Ibrahim	Husband	Student	6 -10 Lakhs	Rural	\N	\N	\N	f	2025-10-07 07:24:30.492514	2025-10-15 04:05:35.639177	t	f	\N	\N	\N	2025-2026	1	f	0	\N
51	1500038	OLUGDS100509	O0525019	Mr.	PAWANKUMAR	MOTWANI	Male	1987-06-07	O+	pavanmotwani@gmail.com	919049277007	+91-7875712768	+91-9049277007	Married	HINDUISM	Indian	General	Sindhi	732849838635	\N	SANGEETHA JADHAV	Wife	Employed	0 - 3 Lakhs	Rural	\N	\N	\N	f	2025-10-14 04:14:12.943332	2025-10-15 04:05:39.515924	t	f	\N	\N	\N	2025-2026	1	f	0	\N
52	1500038	OLUGDS100462	O0525020	Ms.	Aisha Siddika	A	Female	2003-03-21	A+	aishasiddika21033@gmail.com	916379732216	\N	+91-6379732216	Single	ISLAM	Indian	OBC	OBC	252404988472	\N	Akbar Ali	Father	Student	0 - 3 Lakhs	Urban	\N	\N	\N	f	2025-10-14 10:21:34.93495	2025-10-15 04:09:38.695353	t	f	\N	\N	\N	2025-2026	1	f	0	\N
54	1500038	OLUGDS100507	O0525022	Ms.	Yeluri hema	sindhu	Female	2005-07-08	B+	sindhuyeluri08@gmail.com	918919806051	+91-9989172592	+91-8919806051	Single	HINDUISM	Indian	General	Vysya	224203374086	\N	Suresh Babu	Father	Student	10 Lakhs - 15 Lakhs	Urban	\N	\N	\N	f	2025-10-14 10:21:34.981657	2025-10-15 04:09:52.693541	t	f	\N	\N	\N	2025-2026	1	f	0	\N
56	1500038	OLUGDS100454	O0525024	Mr.	Shaikh	owaiz	Male	2004-02-03	O+	shaikhowaiz200400@gmail.com	917039462448	+91-9224309925	+91-7039462448	Single	ISLAM	Indian	General	\N	700139748380	\N	Zahida Shaikh	Mother	Student	0 - 3 Lakhs	Urban	\N	\N	\N	f	2025-10-17 05:04:34.463944	2025-10-29 05:02:19.406296	t	f	\N	\N	\N	2025-2026	1	f	0	\N
132	1500038	OLUGDS100523	O0525025	Ms.	Kanimozhi	Murugavel	Female	2007-07-31	O+	sathyamurugavel08@gmail.com	919894049356	+91-9840479495	+91-9894049356	Single	HINDUISM	Indian	General	Gavara Naidu	709205555667	\N	Murugavel	Father	Student	0 - 3 Lakhs	Urban	\N	\N	\N	f	2025-12-30 05:14:43.653254	2026-02-14 12:14:19.2832	f	f	f	2026-02-14 12:14:19.283191	\N	2025-2026	1	f	0	\N
149	1500038	OLUGDS100946	O0525027	Mr.	Srinivasa Chowdary	D	Male	1975-07-01	\N	surya.apt@gmail.com	919505569067	\N	+91-9505569067	Married	HINDUISM	Indian	General	\N	883106199289	\N	Chandra Kumari E	Mother	Employed	10 Lakhs - 15 Lakhs	Rural	\N	\N	\N	f	2026-03-06 08:01:12.381131	2026-03-06 08:01:12.381134	f	f	f	2026-03-06 08:01:12.381124	\N	2025-2026	1	f	0	\N
158	1500038	OLUGDS100833	O0525029	Mr.	Prabaharan Dinesh	Kumar	Male	2003-03-31	A+	dineshkumarofficial31@gmail.com	919381923723	+91-9490297164	+91-9381923723	Single	HINDUISM	Indian	OBC	Yadava	216870362433	\N	Prabaharan Gnana Sundari	Mother	Employed	0 - 3 Lakhs	Urban	\N	\N	\N	f	2026-03-06 08:01:12.576907	2026-03-06 08:01:12.576909	f	f	f	2026-03-06 08:01:12.5769	\N	2025-2026	1	f	0	\N
161	1500038	OLUGDS100515	O0525030	Mr.	CHINNAMANI	SELVAM	Male	1992-05-02	O+	johnearnest8@gmail.com	919894408756	+91-8754639381	+351-920486207	Single	HINDUISM	Indian	General	Mbc	728948732849	\N	SELVAM	Father	Employed	3 - 6 Lakhs	Urban	\N	\N	\N	f	2026-03-06 09:35:53.453919	2026-03-06 09:35:53.453922	f	f	f	2026-03-06 09:35:53.453912	\N	2025-2026	1	f	0	\N
151	1500132	OLPGCIH100914	X0225001	Dr.	MOHAMMED SARFUDDEEN	N	Male	1992-08-08	O+	msarfuddeen3@gmail.com	918015947472	+91-6385227472	+91-8015947472	Single	ISLAM	Indian	OBC	BC-MUSLIM	773973203901	\N	NAZAR	Father	Employed	3 - 6 Lakhs	Urban	\N	\N	\N	f	2026-03-06 08:01:12.416106	2026-03-06 08:01:12.41611	f	f	f	2026-03-06 08:01:12.416099	\N	2025-2026	1	f	0	\N
159	1500132	OLPGCIH100604	X0225002	Mr.	Ravi	Ravichandran Natesan	Male	1977-11-22	O+	ehs.ravi@gmail.com	918807756777	+91-8903221177	+91-8807756777	Married	HINDUISM	Indian	OBC	Kaikolar	319511773019	\N	Priyadarsini Ravichandran	Wife	Employed	Above 15 Lakhs	Urban	\N	\N	\N	f	2026-03-06 08:01:12.601403	2026-03-06 08:01:12.601408	f	f	f	2026-03-06 08:01:12.601394	\N	2025-2026	1	f	0	\N
156	1500038	OLUGDS100881	O0525028	Mr.	Uthayakumar	G	Male	1990-10-09	O+	uthaya.sin@gmail.com	919916789890	\N	+91-9916789890	Married	HINDUISM	Indian	General	\N	661787361879	\N	Selvarani	Wife	\N	\N	Urban	\N	\N	\N	f	2026-03-06 08:01:12.51305	2026-03-06 08:01:12.513053	f	f	f	2026-03-06 08:01:12.513044	\N	2025-2026	1	f	0	\N
\.


--
-- Data for Name: sub_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sub_groups (id, subcode, subname, schedule, main_group_id) FROM stdin;
141	1	FIXED ASSETS	\N	7
143	1	CURRENT ASSETS	\N	8
144	1	LOANS AND ADVANCES	\N	9
145	1	DEPOSITS	\N	10
146	1	ADVANCES TO SUPPLIERS	\N	11
147	1	ENDOWMENT FUND-FIXED DEPOSITS	\N	12
148	1	EXCESS OF EXPENDITURE OVER INCOME	\N	13
149	1	CAPITAL WORK IN PROGRESS	\N	14
150	1	HOSPITAL ACCOUNT	\N	15
151	1	SRI RAMACHANDRA EDUCATIONAL TRUST	\N	16
152	1	ENDOWMENT FUND	\N	17
153	1	CAUTION DEPOSIT	\N	18
154	1	SUNDRY CREDITOR FOR EXPENSES	\N	19
155	1	SUNDRY CREDITOR FOR OTHERS	\N	20
156	1	SUNDRY CREDITOR FOR MATERIALS	\N	21
157	1	DEPRECIATION RESERVE	\N	22
158	1	EXCESS OF INCOME OVER EXPENDITURE	\N	23
159	1	PRIOR YEAR INCOME	\N	24
160	10	SECURED LOANS	\N	25
161	1	COLLEGE RECEIPTS	\N	26
162	1	OTHER RECEIPTS	\N	27
163	1	PRIOR YEAR INCOME	\N	28
164	1	CONSUMABLES	\N	29
165	1	ADMINISTRATIVE EXPENSES	\N	30
166	1	ESTABLISHMENT EXPENSES	\N	31
167	1	MAINTENANCE EXPENSES	\N	32
168	1	ELECTRICITY CHARGES	\N	33
169	1	OTHER EXPENSES	\N	34
170	1	EDUCATIONAL PROMOTIONAL EXPENSES	\N	35
171	1	DEPRECIATION	\N	36
172	1	PRIOR YEAR EXPENSES	\N	37
\.


--
-- Data for Name: subjects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subjects (id, programe_id, course_code_id, course_category_id, course_title_id, semester, credits, tutorial_hours, lecture_hours, practical_hours, total_hours, cia, esa, total_marks, created_at, updated_at) FROM stdin;
2	1500038	1	1	1	Semester 1	3	0	90	0	90	30	70	100	2026-01-30 09:24:34.163065	2026-01-30 09:24:34.163074
\.


--
-- Data for Name: submenus; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.submenus (id, menu_id, name, "to") FROM stdin;
\.


--
-- Data for Name: user_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_group (user_id, group_id) FROM stdin;
1	1
35	2
36	2
37	2
38	2
39	2
40	2
41	2
42	2
43	2
44	2
45	2
46	2
47	2
48	2
49	2
50	2
51	2
52	2
53	2
54	2
56	2
57	2
58	2
63	2
64	2
65	2
66	2
67	2
68	2
69	2
70	2
71	2
72	2
73	2
74	2
75	2
76	2
77	2
78	2
79	2
80	2
81	2
82	2
83	2
84	2
85	2
86	2
87	2
88	2
89	2
90	2
91	2
92	2
93	2
94	2
95	2
96	2
97	2
98	2
99	2
100	2
101	2
102	2
103	2
104	2
105	2
106	2
107	2
108	2
109	2
110	2
111	2
112	2
113	2
114	2
115	2
116	2
117	2
118	2
119	2
120	2
121	2
122	2
123	2
124	2
125	2
126	2
127	2
128	2
129	2
130	2
131	2
132	2
133	2
134	2
135	2
136	2
137	2
138	2
139	2
140	2
141	2
142	2
143	2
144	2
156	3
162	3
\.


--
-- Data for Name: user_permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_permission (user_id, permission_id) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, first_name, last_name, email, phone, hashed_password, is_active, is_superuser, student_id, reset_token, reset_token_expiry, reset_token_used) FROM stdin;
64	X0326001	Pavan Kumar	KL	X0326001@sriramachandradigilearn.edu.in	919845151194	$2b$12$2E5ke/f0Q9aJhPsYzZwy1uSasPX/N1Y7o1PJlD0mITQc1wHdvuZK6	t	f	64	\N	\N	f
65	X0326002	Rachel	Deepthi	X0326002@sriramachandradigilearn.edu.in	919361774528	$2b$12$1dKP9GBtHi5WZnGRSgCak.5ai0jQBpsWDTUS8jzZlTApxGYOiNqzq	t	f	66	\N	\N	f
66	X0326003	O.V.Venkataragavan	Venkatasubramaniam	X0326003@sriramachandradigilearn.edu.in	919176662047	$2b$12$bsxr11YSNxTBxWe5LHar5uzamiTO5fzkpCH9z3EzeHxqQ5Y6WD7xi	t	f	71	\N	\N	f
68	X0326005	Shobana	M	X0326005@sriramachandradigilearn.edu.in	916374906106	$2b$12$16Y6Eh/ZQ8kfLCBabm3weOv3qZvbrsQISVxouzwI0cytD5vZD20wC	t	f	76	\N	\N	f
71	X0326008	J.Venkataramanan	.	X0326008@sriramachandradigilearn.edu.in	919445694291	$2b$12$lI8n3hIovM5E/reArwRGwOtNJa8lu/SD282kkpoiQQlpyjDIH1pnC	t	f	80	\N	\N	f
72	X0326009	Ajith kumar	Logaiyan	X0326009@sriramachandradigilearn.edu.in	919597224897	$2b$12$9NgUTQJ9otqxtKkfloUrkurJfmEPA1bdfBZlqWxzVhUpytdzSHrjO	t	f	81	\N	\N	f
73	X0326010	Malathi	R	X0326010@sriramachandradigilearn.edu.in	919094846286	$2b$12$NKolUx2YEJd84iSJ7SPnROovXPrcgy1pZz6//MkNHdKk8UQwIyE2m	t	f	82	\N	\N	f
74	X0326011	S R	ANANTHAVALLI	X0326011@sriramachandradigilearn.edu.in	919941287386	$2b$12$/QbOndGKyhKewOLBlT2z9O7ZRX.s2JS1XEi0rFfsxgul7V2.9HEJS	t	f	83	\N	\N	f
75	X0326012	HARISH KUMAR	M	X0326012@sriramachandradigilearn.edu.in	919791179537	$2b$12$ERYTGCE3Q3vN9s5bAaqjt.1Fj1GPtTXAvEZd0yOJ0kvqiiO0g2Z4W	t	f	84	\N	\N	f
76	X0326013	Shajitha	Banu	X0326013@sriramachandradigilearn.edu.in	917358429752	$2b$12$2RwPoHIf/L8hUlgPE19UK.TuyD.cU.ziM0JlcTUvo3p7Qkxx2TH7O	t	f	88	\N	\N	f
77	X0326014	Perumal	.M	X0326014@sriramachandradigilearn.edu.in	917094895275	$2b$12$qavSgdnyPoDSLVGkOp8l3.Nc6tKfKmjNgZon0P4OiR4WV2LpmlilK	t	f	89	\N	\N	f
79	X0326016	Shyamala	KUMAR	X0326016@sriramachandradigilearn.edu.in	917823919197	$2b$12$3K94oIOS7du3cNY99r5cpe7v9UqZzC7bYBzL9XaVbD.BLk15T1rQ6	t	f	95	\N	\N	f
81	X0326018	Joseph M	A	X0326018@sriramachandradigilearn.edu.in	919846091844	$2b$12$cRaW698XDvmfK2KTZy9fjeQPS3Zgq.6tDRB.0DDmMqyvwnDAZ0GWK	t	f	98	\N	\N	f
82	X0326019	Varsha	Sundararajan	X0326019@sriramachandradigilearn.edu.in	919551118323	$2b$12$Sf/3mk/cZlH/QRXVOMwywOcGcFLZ1wGH3Ssc2EbulmaY0Z0UYBoJi	t	f	99	\N	\N	f
83	X0326020	Divya Bala	krishnan	X0326020@sriramachandradigilearn.edu.in	917708831956	$2b$12$dju3f8N/GYmU478GZaRQXO0sVoEhDPaKgoLTzCQqYIXMghdfooFku	t	f	100	\N	\N	f
84	X0326021	Varshini	V	X0326021@sriramachandradigilearn.edu.in	917598920692	$2b$12$/vhXidsvx.R9gYLnskau7.Ifrw643GWqjJlqbXiIEn8x7smU3TUVe	t	f	102	\N	\N	f
85	X0326022	GUNASUNDARI	.s	X0326022@sriramachandradigilearn.edu.in	919578818777	$2b$12$yNrSqBvv06MMtuSd.KRdweitJV2znEwZdEk7/C0anRmVCI9roxlxm	t	f	103	\N	\N	f
86	X0326023	Anuja Rani	Sasidharan	X0326023@sriramachandradigilearn.edu.in	919884818144	$2b$12$LfuOpAWtpPwXXM0AfvD84eYQFyklV6LX4i4bwq1wsXWwV.fSPCeyy	t	f	107	\N	\N	f
87	X0326024	KARTHIK.S	.	X0326024@sriramachandradigilearn.edu.in	919176541141	$2b$12$.b4LF/PkJ4wXI32VBVyfVeG1KbL2RljMWslznNP7s2PtdCqIwUyeu	t	f	109	\N	\N	f
88	X0326025	Amreen	Fathima	X0326025@sriramachandradigilearn.edu.in	919940250557	$2b$12$NqYBmV8DZb9xkmyWjrYVmONs5rYR6suaVNtsvhXOwaICEmlFU1GkC	t	f	111	\N	\N	f
1	admin	\N	\N	cdoesupport@sriramachandra.edu.in	\N	$2b$12$xUACbGegvnmBZHTEgtWOQOMqpQneBi.U9H94Dq8bI9GwDbCq9oyN.	t	t	\N	\N	\N	f
90	X0326027	praveena	Selvaraj	X0326027@sriramachandradigilearn.edu.in	919052550134	$2b$12$2Hy1YbLHxAy84MiOkEWgOend0I4cm77hLw13y.Q6GjHMHgEiTpx3m	t	f	113	\N	\N	f
91	X0326028	P.R.Gethareswari	.	X0326028@sriramachandradigilearn.edu.in	919940346321	$2b$12$zRKwztITTBw.MeCNxy1uR.M6KhZcANsxOa/ErIB2XposSznm.MHxS	t	f	114	\N	\N	f
92	X0326029	Lakshmi	Kiran	X0326029@sriramachandradigilearn.edu.in	919963687044	$2b$12$3Xr6cQxyTK6/.mHLkA28WufRvPBoYUvYpcSNgyAc4gx4EDEUd4POS	t	f	115	\N	\N	f
94	X0326031	Reshma.E	.	X0326031@sriramachandradigilearn.edu.in	918925292040	$2b$12$/HnmBfFpd3L49nmdAErWYOZBwBIv7pT7KJl70KiuPfBAShoudLH.i	t	f	117	\N	\N	f
96	X0326033	Kumudavikasri	Srinivasan	X0326033@sriramachandradigilearn.edu.in	919962715896	$2b$12$JUwjtWK1El.SiYa1vmPYOe97ceeb0O9Y2PBj/Pm6tmSLp0sZQJv7e	t	f	119	\N	\N	f
95	X0326032	Sruthi	Babu	X0326032@sriramachandradigilearn.edu.in	918939126936	$2b$12$JJHXuqT0Z1/ZMHKma2TszO0INX6WCal9SWWJEnEdTXAHR8Jq8GUCW	t	f	118	\N	\N	f
69	X0326006	Sevvanthi	S	X0326006@sriramachandradigilearn.edu.in	919384708480	$2b$12$Ic3V5q.MssbckKwH5dSvSeXW.b8ln1bkr3WmeTOtXlYELpNLNpuVO	t	f	77	\N	\N	f
70	X0326007	Jayashree	K	X0326007@sriramachandradigilearn.edu.in	918220696403	$2b$12$ZGm2wrzEUkvyuQZUz.uZke/NMOdSbElUKmMryu3Lp2KG55VlIdQ1K	t	f	79	\N	\N	f
36	O0525002	Dr Leena	Pavitha	o0525002@sriramachandradigilearn.edu.in	919952385693	$2b$12$RRa1ueYAKaLpeuDYfyKS5.Qn3LOkc64Pq1r9OFbghLvglFI4gp.ky	t	f	30	\N	\N	f
37	O0525003	Kaushal	Shanker	o0525003@sriramachandradigilearn.edu.in	919444506363	$2b$12$CFxeOCSXpGP5kLpKALLYkOvE7mPDzY5JnF/ci..qbgN3snchV7y/i	t	f	31	\N	\N	f
38	O0525004	mohammed afrid	azami	o0525004@sriramachandradigilearn.edu.in	919840956360	$2b$12$NtJqfQvnbhQRc9uHUwRT5uLr1EpAs6zoRFghZe1aPjg3m7qBPFaD6	t	f	32	\N	\N	f
39	O0525005	Abishek Kumaran	Balaji	o0525005@sriramachandradigilearn.edu.in	918825972045	$2b$12$lIKyVdi7eqGwfalPZekj1.BeUrqLmTM6LEy9oP2.JA3dofh4icxAy	t	f	33	\N	\N	f
40	O0525006	Adhithya	N. S. G.	o0525006@sriramachandradigilearn.edu.in	919600077002	$2b$12$NcP6UvTVQ.UXbMRFHZK2Jus7YepuvZzbp440xhceJZ3f9JuBbs55W	t	f	34	\N	\N	f
41	O0525007	Manimekalai	Narayanan	o0525007@sriramachandradigilearn.edu.in	919841368740	$2b$12$5R6MZiACWHwcehWzUVFF4.tXIOm12hBsdmrwTNST5EQFuPi3/qDvS	t	f	35	\N	\N	f
42	O0525008	Ramkumar	Santhanakrishnan	o0525008@sriramachandradigilearn.edu.in	918610371396	$2b$12$PuV1.tDhJ7bsqJQLalGw5OaANTp.0DkS7ScAG0n7hAaQT7sLhQBCu	t	f	36	\N	\N	f
43	O0525009	Aswin	T	o0525009@sriramachandradigilearn.edu.in	916374271166	$2b$12$B19rajJZbcHYxvo/.m5B1e4E1YAynsthJp4DK2K1ejSTJPNpLdDKe	t	f	37	\N	\N	f
44	O0525010	PRAVEEN	M	o0525010@sriramachandradigilearn.edu.in	918270961511	$2b$12$F0wqJqtT40Ccd8GHXY5PfO.XBaaYHJg.RLYzVsuU8bf3MP5.rCQP.	t	f	39	\N	\N	f
45	O0525011	Ansar Ahammed	P V	o0525011@sriramachandradigilearn.edu.in	918891800574	$2b$12$reXOnzwEj01IeULlIpho7e9tBrBylGjFq5pXpFXRaOXRbB8U9AV7S	t	f	42	\N	\N	f
93	X0326030	SURIYA SRE	VS	X0326030@sriramachandradigilearn.edu.in	919940092538	$2b$12$OosLrLjOrxhYrVfdYJFJb.A6ayDKJXnHisemHBKGx143AkUFhrkDW	t	f	116	\N	\N	f
67	X0326004	P.R.Vetha	Vikasini	X0326004@sriramachandradigilearn.edu.in	918939428360	$2b$12$sqxgHGCcfWwU1XsjyJD/pudFwubGHy6y/EjHTIeEhIIrCifNHwahm	t	f	73	\N	\N	f
89	X0326026	DeviPriya	M	X0326026@sriramachandradigilearn.edu.in	918681947755	$2b$12$ajD8cnIOWLQONUo7YHOFduSTlIF6FxBed/TG5.9DPL/f2VImxZr8G	t	f	112	\N	\N	f
78	X0326015	Mythily	T	X0326015@sriramachandradigilearn.edu.in	919578111490	$2b$12$ZQsS6NiMuItrjRYSW9R7/OdtdgnpkdUtIl8gFZQQdvSt/PjPafKqK	t	f	93	\N	\N	f
35	O0525001	Jeswin	L	o0525001@sriramachandradigilearn.edu.in	919626512494	$2b$12$xUACbGegvnmBZHTEgtWOQOMqpQneBi.U9H94Dq8bI9GwDbCq9oyN.	t	f	29	\N	\N	f
46	O0525012	Prathyush	Ayyappan	o0525012@sriramachandradigilearn.edu.in	919500562376	$2b$12$PxNZjt2ZiQPAVEk4/wC4HOpZ149oopfrfjchqNsIuPwBqpJndzXD.	t	f	43	\N	\N	f
48	O0525014	N.	Akshaya	o0525014@sriramachandradigilearn.edu.in	919486291205	$2b$12$qpDeYtXlE1hGSMaFql7XceZAWUdiRLWzpfea4/8osZr5q.ZkIDLN.	t	f	46	\N	\N	f
49	O0525015	S.	Prayag	o0525015@sriramachandradigilearn.edu.in	919840302862	$2b$12$4RALzvKiTNGlT62P.ZGf9OpVoADjeJ6MP8g8CKsN7zVCmoWCfUGum	t	f	47	\N	\N	f
50	O0525016	Rhushikesh Omprakash	Rai	o0525016@sriramachandradigilearn.edu.in	919769358550	$2b$12$0GY2UrnfkoU1/6l.gLypi.EUXMLCVawS0W/Xj4hr3MLG1JB/6dBPu	t	f	48	\N	\N	f
51	O0525017	Jayasriman	M	o0525017@sriramachandradigilearn.edu.in	918667765848	$2b$12$PzOV1ezOenGWAZUN1F8bmut3Bb1NEgd9a6OpaGJU2xhHYbnKbepTS	t	f	49	\N	\N	f
52	O0525018	Safrin	A	o0525018@sriramachandradigilearn.edu.in	916383145126	$2b$12$Y9BMbb.DSylZSTbxKKK4pucCB3b/i1.gN7QjbMMFtOksbA20eQjZq	t	f	50	\N	\N	f
53	O0525019	PAWANKUMAR	MOTWANI	o0525019@sriramachandradigilearn.edu.in	919049277007	$2b$12$PjP0vfSWySi0T6T1DPeuAOqjgDojS.Z1ta/0yi0TMVy36vXvpozPK	t	f	51	\N	\N	f
54	O0525020	Aisha Siddika	A	o0525020@sriramachandradigilearn.edu.in	916379732216	$2b$12$cDAF.rYyP0wa/p/8IqfT1u5zeO8S/wmDMnALsGIP1KkIXNuJUPmUu	t	f	52	\N	\N	f
47	O0525013	JANIKSHA	M	o0525013@sriramachandradigilearn.edu.in	919445535784	$2b$12$PrLsq7O11NMHhsYoQoQ4HOWFOdk7S0Jx1GsbAaaIJ7JW0R8WJbuGO	t	f	45	\N	\N	f
57	O0525023	Navneet	Sharma	o0525023@sriramachandradigilearn.edu.in	918872307879	$2b$12$EJVePs6QLwFF2PlZKVGVoeqeMoxkiZFvtNC3k.tzHTNMHzjlmxqk6	t	f	55	\N	\N	f
97	X0326034	Raghana	Shridhar	X0326034@sriramachandradigilearn.edu.in	919962704778	$2b$12$.PM4RsOTzNveesr.zGxcU.2w5o8zC1iS1S4tMLRzRO2DykwLnM9vO	t	f	120	\N	\N	f
99	X0326036	SASANKA SEKHAR	DASH	X0326036@sriramachandradigilearn.edu.in	918895538351	$2b$12$H7/a0Voc7hd/kAqyDhsFpeJ0qsALTjlZ90qV9u6xzWkUaPYJMDWJe	t	f	123	\N	\N	f
100	X0326037	Kavitha	Rajaram	X0326037@sriramachandradigilearn.edu.in	919884871807	$2b$12$E5j50288WYa1ALAN9bhUNeq9KFC6QtwmMp0QOvb881SXo5Cqkc5ZC	t	f	124	\N	\N	f
102	X0326039	Vasanthi	S	X0326039@sriramachandradigilearn.edu.in	919840616133	$2b$12$71EFyUaylNw1FSs1C4Bc0OPHodwF9jFyk8uoYR1Y/DX9OLGzwgf0i	t	f	126	\N	\N	f
103	X0326040	YEDIDI	SAMYUKTA	X0326040@sriramachandradigilearn.edu.in	919952961822	$2b$12$Fsw2328axG2p5Hua2YycsO6IHhdmgl0yv2/stPK2r5sq7rU1SY7XC	t	f	127	\N	\N	f
58	O0525024	Shaikh	owaiz	o0525024@sriramachandradigilearn.edu.in	917039462448	$2b$12$e46r9aUYcE633gb3sAlfyuIVd2SXuIU1K/BC1g6Nm6/oOGqLz2ntq	t	f	56	\N	\N	f
104	X0326041	Bhuvanesswari	S	X0326041@sriramachandradigilearn.edu.in	919500884242	$2b$12$JnKBKxLXWL8i8TGnTZvFHuWIM51YgITkSvSjLDn6j1peJjtku3f/K	t	f	128	\N	\N	f
105	X0326042	Dr. Mounika	Buduru	X0326042@sriramachandradigilearn.edu.in	918310439361	$2b$12$cj/KGxALPbU4Fm0UehkifOuf6GJkNP/oHK9pqE0.YnKtqYx1D4RSC	t	f	129	\N	\N	f
63	O0525021	Murshidha	Sheerin	o0525021@sriramachandradigilearn.edu.in	917403999966	$2b$12$QXDOrYYywYl59GAbwdcS1utaj.jHyy1VKuHp3ekqJipVUMnwfujBS	t	f	53	\N	\N	f
107	X0326044	Padmavathy	T	X0326044@sriramachandradigilearn.edu.in	919840350575	$2b$12$4OsareaZChlE7DASmzNXaO7F9bWHqu.jwtk1BvyvqNdT7OGC2sY.C	t	f	135	\N	\N	f
56	O0525022	Yeluri hema	sindhu	o0525022@sriramachandradigilearn.edu.in	918919806051	$2b$12$2AOTzHK8v9k18U3iN2O6Fu6Ll9/Og7n6Dicp9ATfJ2JluqyV9bYQ.	t	f	54	\N	\N	f
108	X0326045	VINITHKUMAR	M	X0326045@sriramachandradigilearn.edu.in	919952939053	$2b$12$JiotK94UfSjkuk8zLmYa.u7xOuEsXa1K9JoFFcjKStwRfuCyPOTeC	t	f	136	\N	\N	f
109	X0326046	KERAN PRISKILLA	J	X0326046@sriramachandradigilearn.edu.in	918056033511	$2b$12$GG.o9FsRTwYd5WKl.atkM.zvkH/VzD.DxtI4BMeCeQMLw7TLGCKj6	t	f	137	\N	\N	f
80	X0326017	Karthiga	M	X0326017@sriramachandradigilearn.edu.in	919942743746	$2b$12$06xslDgMa6uN8lzPDL0OwuGIITsyqHL2/s7VSe.fDAw2Z5pArAZ9m	t	f	96	\N	\N	f
98	X0326035	Leena	Nair	X0326035@sriramachandradigilearn.edu.in	919995734234	$2b$12$YfUf4fn/cyYjfdV6A9gszOErEJ6eQzpklof8rYjj6ltAcVskyq726	t	f	122	\N	\N	f
101	X0326038	GANESH KUMAR	Subramani	X0326038@sriramachandradigilearn.edu.in	919787366250	$2b$12$jVlI1oaSDaZtYri59f0TTOAzaqiSfFR6L1kNnM7bgW2gG47nRy1h6	t	f	125	\N	\N	f
111	X0226001	Srinedhe	Gopalakrishnan srinedhe	X0226001@sriramachandradigilearn.edu.in	9363160646	$2b$12$OYMWgTcVbyiT8oBIfXFULusq9hpit6fr6is6lJxiW4YwfJhOj8662	t	f	58	\N	\N	f
112	X0226002	Ismayil Kaniyam	Parambil	X0226002@sriramachandradigilearn.edu.in	919995555935	$2b$12$sOudGlwgDA98hCgQpzSXKuo6sE37fzA9nAZcBlr.RxXwOBKclf1g2	t	f	59	\N	\N	f
114	X0226004	Pradheep	Duraimani	X0226004@sriramachandradigilearn.edu.in	919500880330	$2b$12$sFGi6xGeiqDxbh7iJESLT.ibzMKA.iPeGZWtti08p5YMjwtyaPt.C	t	f	61	\N	\N	f
115	X0226005	A.K. SAHABAR	SATHIK	X0226005@sriramachandradigilearn.edu.in	919171985991	$2b$12$eyf7ybIOBvCZivV7OWIn8uC7d/7EriOP9Bgbx.NfARSwpyfHRzYgm	t	f	62	\N	\N	f
117	X0226007	Bhavani	L	X0226007@sriramachandradigilearn.edu.in	919632261154	$2b$12$tE9JS7AeB7dd6MhhjP9jMe47jE2UHclY2DYgep6ZS3ZpsVk5aaQQa	t	f	65	\N	\N	f
119	X0226009	Waseem Hussain	Syed	X0226009@sriramachandradigilearn.edu.in	918019221114	$2b$12$dEICd17cTKUhgJRZWZG8Du489F2giiIekwJr.yVK5ycUvwSdQeUB6	t	f	68	\N	\N	f
121	X0226011	Dr. Shubhangi	Hanumant	X0226011@sriramachandradigilearn.edu.in	918551951770	$2b$12$9K2tHX0kQnxtDy6XiifoM.Wl6eMk1sRqpEIMgu4ZF98M8SHfScRZC	t	f	70	\N	\N	f
122	X0226012	Naresh	Suresh	X0226012@sriramachandradigilearn.edu.in	919823750679	$2b$12$oLGTO0nhbs30LvxJqIRQm.T3E/zBfq9pxaAvLGsw0Do836smpBnzC	t	f	72	\N	\N	f
123	X0226013	Venkat	shreyas	X0226013@sriramachandradigilearn.edu.in	917729959399	$2b$12$.uRODDiy3rVNfXvJOgcPL./pAONcz8Dh/0bQ0XWc./2yMe2U3n06m	t	f	74	\N	\N	f
124	X0226014	Priya	T	X0226014@sriramachandradigilearn.edu.in	916385770610	$2b$12$i8vbKqf4douDW5of9J6uCe5CEEJYLpRe0ei94tSlNa/GYVUIDHhW.	t	f	75	\N	\N	f
125	X0226015	shiny	achariya	X0226015@sriramachandradigilearn.edu.in	919176329559	$2b$12$KTra6/YY6VfoWH8Egx7yuu3JozoC4frceq4WkQpkhtz0z9olr9eCq	t	f	78	\N	\N	f
113	X0226003	Anandababu	Narayanan	X0226003@sriramachandradigilearn.edu.in	919004806233	$2b$12$Men5bxz6uYDUFogwKb5Ne.Um0y..yDggPaICVTYnAekzJMUrYyjbK	t	f	60	\N	\N	f
106	X0326043	Arun	Joie SJ	X0326043@sriramachandradigilearn.edu.in	919791037534	$2b$12$/JTOBhN9Q/vM6Hwr4DLuRejnYnJPmUctvgYKO3Hd31bpm8J.eNmfW	t	f	130	\N	\N	f
127	X0226017	Vikram	Mohan	X0226017@sriramachandradigilearn.edu.in	919445304775	$2b$12$1/9XJiRxGpgWeuWa5pmIYuDK4FDluashEN35DWIOuq.YNFi4midZC	t	f	86	\N	\N	f
116	X0226006	SURESH AJISTON	GEORGE	X0226006@sriramachandradigilearn.edu.in	919042539826	$2b$12$phznO7zwoRo9vjpFJwQxi.Di/DIbnd3vaVyaTy1zFBlUfrXBwTaLy	t	f	63	\N	\N	f
126	X0226016	DHANUSH	KUMAR	X0226016@sriramachandradigilearn.edu.in	919626279745	$2b$12$kJm8YO2Awl6uFuSCYFUCo.99ykLUl5yMiSzA0hMJf/EPqurVRITSK	t	f	85	\N	\N	f
110	X0326047	Malasree	N	X0326047@sriramachandradigilearn.edu.in	916383841675	$2b$12$FsOjIJ06ROhhyvBZZAReFe5tVT3SNJFU4VyImFO0thMtRf.Jpnno.	t	f	138	\N	\N	f
128	X0226018	Geo Mathew	Pius	X0226018@sriramachandradigilearn.edu.in	916238019460	$2b$12$ioKeG9sRRkUTgX6pn5S3uOvXTAHHUsAuEgejd3/IfzmbA2lNXM/5u	t	f	87	\N	\N	f
129	X0226019	Shrikala	A	X0226019@sriramachandradigilearn.edu.in	919489275307	$2b$12$.KsqzlFDxenF7dqubkE1LuD3MTHFTl9TMZd8SMBHMwu5YPhr1FG/W	t	f	90	\N	\N	f
130	X0226020	Ranjini	Ashok	X0226020@sriramachandradigilearn.edu.in	918129989773	$2b$12$ZvT7qsvEE/tWjDRjij0TnuYPNejx005C38gtHOzWWYbXV8iADFt7a	t	f	91	\N	\N	f
131	X0226021	Syed	Afroz	X0226021@sriramachandradigilearn.edu.in	919553054794	$2b$12$F//NUoc1TeRhASq7bg3wHenOmjZ2FSQ4lGXOgRhnlfOkq.Kogkk8C	t	f	92	\N	\N	f
132	X0226022	Sreedhar	Yadlapati	X0226022@sriramachandradigilearn.edu.in	97466333478	$2b$12$REnp/XTvLtMErV/xuot6MeP1JUZfDQ39xcXhda72S9lh2BywYXhky	t	f	94	\N	\N	f
133	X0226023	Karuppiah	A	X0226023@sriramachandradigilearn.edu.in	917358887805	$2b$12$PJ3gi6bsVi0ogJGDyZgYBeZK7i54yCmzgjgycXDQrWw6/TRLceiEy	t	f	97	\N	\N	f
135	X0226025	Deepak	Prakash	X0226025@sriramachandradigilearn.edu.in	919629621383	$2b$12$6eiDOYdsxpbvITybrlom3e5oKCKp1NN2zojKBmMcX6KaRce5PuqD.	t	f	104	\N	\N	f
136	X0226026	Arunkannan	Sargunam	X0226026@sriramachandradigilearn.edu.in	918220752465	$2b$12$41hLs5JJrdg3uCmXwzhnZ.nST.fHvCrzYHCDkN/DJDkW.SOXxJiFm	t	f	106	\N	\N	f
137	X0226027	Patel Pritiben	shaileshbhai	X0226027@sriramachandradigilearn.edu.in	919978920176	$2b$12$nA9NQhWLhKW4.k1a1K3E7esHdNAprpLhgYeg9i6t09pKsGyulFZCS	t	f	108	\N	\N	f
138	X0226028	Rakup Suresh	Kumar	X0226028@sriramachandradigilearn.edu.in	918500021384	$2b$12$OxFGgAYf1k9QNLuCfftnWu00.C9KEAL/HwpsR0DmOYk.dD8Xy8t3.	t	f	110	\N	\N	f
139	X0226029	Subhendu	Mohanty	X0226029@sriramachandradigilearn.edu.in	919920788404	$2b$12$Nkvjoa.Z0LBxeUmF2Hl6pOQ6g7MPl.Twq/xYNgRIgfnB3u74zD5XW	t	f	121	\N	\N	f
140	X0226030	Balamurugan	K	X0226030@sriramachandradigilearn.edu.in	918531969943	$2b$12$Ex8rMjLXUI.MxKXWhEWWEeajPL4Zm5JrEhlYcFyHKBf6NQxdMfEBW	t	f	131	\N	\N	f
141	X0226031	Dr. K.	Shashidhar	X0226031@sriramachandradigilearn.edu.in	918686138181	$2b$12$3PG1ZkW2Bp8EV4yCVGyGb.nKjhvY.1HQU3ZdWFSpcn.IjdtNPiF96	t	f	133	\N	\N	f
142	X0226032	BETHI	NAVYA	X0226032@sriramachandradigilearn.edu.in	919032166566	$2b$12$20IJnm.lt3HA2/O1CVux4eWjA.ZyDDckZACUSdVDLMayEO7tY6c32	t	f	134	\N	\N	f
143	X0226033	SADHNA	VERMA	X0226033@sriramachandradigilearn.edu.in	919981502302	$2b$12$W4OLxI7PnRb773cyPtNqVuM5idDKAIUbyxi.OWqWNhDto7zvBkF/i	t	f	140	\N	\N	f
118	X0226008	Dr Kiran	.Adabala	X0226008@sriramachandradigilearn.edu.in	918977941002	$2b$12$pieNknWuHAderGbSZNjHB.9D1KF1WcnzTaOIKrYS2ayqsRlBRA4SC	t	f	67	\N	\N	f
134	X0226024	Dilip	Kapse	X0226024@sriramachandradigilearn.edu.in	919930078379	$2b$12$7U69Ti5o3V9yaZLK8tL7wuKfglXov1KWncLnbypDcNtX1qicO1tfa	t	f	101	\N	\N	f
144	X0326048	Monika	Choraria	X0326048@sriramachandradigilearn.edu.in	919940319820	$2b$12$.MiXI0xrU4d0QEULhl/YUemMOvNnWQ/NGJKilVWMnKON7lls0AyMK	t	f	139	\N	\N	f
120	X0226010	Dr. Syed	Asif Hussain	X0226010@sriramachandradigilearn.edu.in	918341513539	$2b$12$IVd46iXTa2wlygSQ33lHhOiWwKFQSCP5h/7FtYH028fdAGxfbtjbu	t	f	69	\N	\N	f
156	0271	Hari	krishnan	mharikrishnan1105@gmail.com	9600366652	$2b$12$DKG6qZZTAKkCgxFMTE86VuPDgdDk0/LLHW3AYPus1lvkWQfsniJoK	t	f	\N	\N	\N	f
162	0272	mohamed	yesthin	mohamed.yesthin@sriramachandra.edu.in	9600366651	$2b$12$.d6oBm1dhXJ.Lz/ozCqW.OTibbXSJszeglhu1xubUGULl9N9eG/HW	t	f	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtb2hhbWVkLnllc3RoaW5Ac3JpcmFtYWNoYW5kcmEuZWR1LmluIiwiZXhwIjoxNzc0NTE0Njk0fQ.R0qEqnR8KT6b_aSn5k3muwvwfEJFOWW6rvo1aK2G3Ik	2026-03-27 08:34:54.648127	t
\.


--
-- Name: academic_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.academic_details_id_seq', 174, true);


--
-- Name: academic_years_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.academic_years_id_seq', 2, true);


--
-- Name: account_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.account_groups_id_seq', 4, true);


--
-- Name: account_heads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.account_heads_id_seq', 8, true);


--
-- Name: account_master_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.account_master_id_seq', 1, false);


--
-- Name: address_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.address_details_id_seq', 173, true);


--
-- Name: address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.address_id_seq', 1, false);


--
-- Name: api_keys_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.api_keys_id_seq', 1, false);


--
-- Name: application_fees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.application_fees_id_seq', 154, true);


--
-- Name: batches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.batches_id_seq', 2, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 1, false);


--
-- Name: city_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.city_id_seq', 1, false);


--
-- Name: countries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.countries_id_seq', 1, false);


--
-- Name: course_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.course_category_id_seq', 1, false);


--
-- Name: course_code_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.course_code_id_seq', 1, false);


--
-- Name: course_components_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.course_components_id_seq', 2, true);


--
-- Name: course_results_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.course_results_id_seq', 1, true);


--
-- Name: course_title_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.course_title_id_seq', 1, false);


--
-- Name: courses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.courses_id_seq', 1, true);


--
-- Name: deb_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.deb_details_id_seq', 172, true);


--
-- Name: declaration_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.declaration_details_id_seq', 172, true);


--
-- Name: departments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.departments_id_seq', 4, true);


--
-- Name: district_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.district_id_seq', 1, false);


--
-- Name: document_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.document_details_id_seq', 172, true);


--
-- Name: exam_timetables_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exam_timetables_id_seq', 5, true);


--
-- Name: exams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exams_id_seq', 3, true);


--
-- Name: fee_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.fee_details_id_seq', 124, true);


--
-- Name: groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.groups_id_seq', 6, true);


--
-- Name: hsc_board_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hsc_board_id_seq', 1, false);


--
-- Name: lookup_master_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lookup_master_id_seq', 1, false);


--
-- Name: main_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.main_groups_id_seq', 37, true);


--
-- Name: marks_entries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.marks_entries_id_seq', 3, true);


--
-- Name: menus_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.menus_id_seq', 1, false);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_id_seq', 324, true);


--
-- Name: permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permissions_id_seq', 1, false);


--
-- Name: program_payment_workflow_scopes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.program_payment_workflow_scopes_id_seq', 1, true);


--
-- Name: programs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.programs_id_seq', 13, true);


--
-- Name: schemes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.schemes_id_seq', 1, true);


--
-- Name: semester_fees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.semester_fees_id_seq', 142, true);


--
-- Name: semester_masters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.semester_masters_id_seq', 12, true);


--
-- Name: semester_results_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.semester_results_id_seq', 1, true);


--
-- Name: semesters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.semesters_id_seq', 1, true);


--
-- Name: ssc_board_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ssc_board_id_seq', 1, false);


--
-- Name: staff_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.staff_id_seq', 9, true);


--
-- Name: states_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.states_id_seq', 1, false);


--
-- Name: student_course_registrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.student_course_registrations_id_seq', 25, true);


--
-- Name: student_exam_registrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.student_exam_registrations_id_seq', 35, true);


--
-- Name: student_mark_temp_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.student_mark_temp_id_seq', 6, true);


--
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.students_id_seq', 180, true);


--
-- Name: sub_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sub_groups_id_seq', 172, true);


--
-- Name: subjects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subjects_id_seq', 2, true);


--
-- Name: submenus_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.submenus_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 162, true);


--
-- Name: academic_details academic_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.academic_details
    ADD CONSTRAINT academic_details_pkey PRIMARY KEY (id);


--
-- Name: academic_details academic_details_student_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.academic_details
    ADD CONSTRAINT academic_details_student_id_key UNIQUE (student_id);


--
-- Name: academic_years academic_years_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.academic_years
    ADD CONSTRAINT academic_years_pkey PRIMARY KEY (id);


--
-- Name: account_groups account_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_groups
    ADD CONSTRAINT account_groups_pkey PRIMARY KEY (id);


--
-- Name: account_heads account_heads_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_heads
    ADD CONSTRAINT account_heads_pkey PRIMARY KEY (id);


--
-- Name: account_master account_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_master
    ADD CONSTRAINT account_master_pkey PRIMARY KEY (id);


--
-- Name: address_details address_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.address_details
    ADD CONSTRAINT address_details_pkey PRIMARY KEY (id);


--
-- Name: address_details address_details_student_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.address_details
    ADD CONSTRAINT address_details_student_id_key UNIQUE (student_id);


--
-- Name: address address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.address
    ADD CONSTRAINT address_pkey PRIMARY KEY (id);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: api_keys api_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_pkey PRIMARY KEY (id);


--
-- Name: application_fees application_fees_payment_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_fees
    ADD CONSTRAINT application_fees_payment_id_key UNIQUE (payment_id);


--
-- Name: application_fees application_fees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_fees
    ADD CONSTRAINT application_fees_pkey PRIMARY KEY (id);


--
-- Name: batches batches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.batches
    ADD CONSTRAINT batches_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: city city_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.city
    ADD CONSTRAINT city_pkey PRIMARY KEY (id);


--
-- Name: countries countries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (id);


--
-- Name: course_category course_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_category
    ADD CONSTRAINT course_category_pkey PRIMARY KEY (id);


--
-- Name: course_code course_code_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_code
    ADD CONSTRAINT course_code_pkey PRIMARY KEY (id);


--
-- Name: course_components course_components_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_components
    ADD CONSTRAINT course_components_pkey PRIMARY KEY (id);


--
-- Name: course_results course_results_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_results
    ADD CONSTRAINT course_results_pkey PRIMARY KEY (id);


--
-- Name: course_title course_title_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_title
    ADD CONSTRAINT course_title_pkey PRIMARY KEY (id);


--
-- Name: courses courses_course_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_course_code_key UNIQUE (course_code);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: deb_details deb_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.deb_details
    ADD CONSTRAINT deb_details_pkey PRIMARY KEY (id);


--
-- Name: deb_details deb_details_student_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.deb_details
    ADD CONSTRAINT deb_details_student_id_key UNIQUE (student_id);


--
-- Name: declaration_details declaration_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.declaration_details
    ADD CONSTRAINT declaration_details_pkey PRIMARY KEY (id);


--
-- Name: declaration_details declaration_details_student_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.declaration_details
    ADD CONSTRAINT declaration_details_student_id_key UNIQUE (student_id);


--
-- Name: departments departments_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_key UNIQUE (name);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: district district_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.district
    ADD CONSTRAINT district_pkey PRIMARY KEY (id);


--
-- Name: document_details document_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_details
    ADD CONSTRAINT document_details_pkey PRIMARY KEY (id);


--
-- Name: document_details document_details_student_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_details
    ADD CONSTRAINT document_details_student_id_key UNIQUE (student_id);


--
-- Name: exam_timetables exam_timetables_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_timetables
    ADD CONSTRAINT exam_timetables_pkey PRIMARY KEY (id);


--
-- Name: exams exams_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exams
    ADD CONSTRAINT exams_pkey PRIMARY KEY (id);


--
-- Name: fee_details fee_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fee_details
    ADD CONSTRAINT fee_details_pkey PRIMARY KEY (id);


--
-- Name: group_permission group_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_permission
    ADD CONSTRAINT group_permission_pkey PRIMARY KEY (group_id, permission_id);


--
-- Name: groups groups_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_name_key UNIQUE (name);


--
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- Name: hsc_board hsc_board_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hsc_board
    ADD CONSTRAINT hsc_board_pkey PRIMARY KEY (id);


--
-- Name: lookup_master lookup_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lookup_master
    ADD CONSTRAINT lookup_master_pkey PRIMARY KEY (id);


--
-- Name: main_groups main_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.main_groups
    ADD CONSTRAINT main_groups_pkey PRIMARY KEY (id);


--
-- Name: marks_entries marks_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marks_entries
    ADD CONSTRAINT marks_entries_pkey PRIMARY KEY (id);


--
-- Name: menus menus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menus
    ADD CONSTRAINT menus_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_codename_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_codename_key UNIQUE (codename);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: program_payment_workflow_scopes program_payment_workflow_scopes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.program_payment_workflow_scopes
    ADD CONSTRAINT program_payment_workflow_scopes_pkey PRIMARY KEY (id);


--
-- Name: programs programs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.programs
    ADD CONSTRAINT programs_pkey PRIMARY KEY (id);


--
-- Name: programs programs_programe_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.programs
    ADD CONSTRAINT programs_programe_code_key UNIQUE (programe_code);


--
-- Name: schemes schemes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schemes
    ADD CONSTRAINT schemes_pkey PRIMARY KEY (id);


--
-- Name: semester_fees semester_fees_payment_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.semester_fees
    ADD CONSTRAINT semester_fees_payment_id_key UNIQUE (payment_id);


--
-- Name: semester_fees semester_fees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.semester_fees
    ADD CONSTRAINT semester_fees_pkey PRIMARY KEY (id);


--
-- Name: semester_masters semester_masters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.semester_masters
    ADD CONSTRAINT semester_masters_pkey PRIMARY KEY (id);


--
-- Name: semester_results semester_results_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.semester_results
    ADD CONSTRAINT semester_results_pkey PRIMARY KEY (id);


--
-- Name: semesters semesters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.semesters
    ADD CONSTRAINT semesters_pkey PRIMARY KEY (id);


--
-- Name: ssc_board ssc_board_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ssc_board
    ADD CONSTRAINT ssc_board_pkey PRIMARY KEY (id);


--
-- Name: staff staff_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_email_key UNIQUE (email);


--
-- Name: staff staff_employee_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_employee_id_key UNIQUE (employee_id);


--
-- Name: staff staff_phone_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_phone_key UNIQUE (phone);


--
-- Name: staff staff_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_pkey PRIMARY KEY (id);


--
-- Name: staff staff_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_user_id_key UNIQUE (user_id);


--
-- Name: states states_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.states
    ADD CONSTRAINT states_pkey PRIMARY KEY (id);


--
-- Name: student_course_registrations student_course_registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_course_registrations
    ADD CONSTRAINT student_course_registrations_pkey PRIMARY KEY (id);


--
-- Name: student_exam_registrations student_exam_registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_exam_registrations
    ADD CONSTRAINT student_exam_registrations_pkey PRIMARY KEY (id);


--
-- Name: student_mark_temp student_mark_temp_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_mark_temp
    ADD CONSTRAINT student_mark_temp_pkey PRIMARY KEY (id);


--
-- Name: students students_aadhaar_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_aadhaar_number_key UNIQUE (aadhaar_number);


--
-- Name: students students_application_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_application_no_key UNIQUE (application_no);


--
-- Name: students students_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_email_key UNIQUE (email);


--
-- Name: students students_mobile_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_mobile_number_key UNIQUE (mobile_number);


--
-- Name: students students_pan_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pan_number_key UNIQUE (pan_number);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: students students_registration_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_registration_no_key UNIQUE (registration_no);


--
-- Name: sub_groups sub_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sub_groups
    ADD CONSTRAINT sub_groups_pkey PRIMARY KEY (id);


--
-- Name: subjects subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_pkey PRIMARY KEY (id);


--
-- Name: submenus submenus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submenus
    ADD CONSTRAINT submenus_pkey PRIMARY KEY (id);


--
-- Name: student_mark_temp unique_student_course; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_mark_temp
    ADD CONSTRAINT unique_student_course UNIQUE (student_id, course_name);


--
-- Name: course_results uq_course_result_version; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_results
    ADD CONSTRAINT uq_course_result_version UNIQUE (student_id, exam_id, course_id, component_id, result_version);


--
-- Name: exam_timetables uq_exam_component; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_timetables
    ADD CONSTRAINT uq_exam_component UNIQUE (exam_id, component_id);


--
-- Name: semester_masters uq_program_type_semester; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.semester_masters
    ADD CONSTRAINT uq_program_type_semester UNIQUE (program_type, semester_number);


--
-- Name: semester_results uq_semester_result_version; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.semester_results
    ADD CONSTRAINT uq_semester_result_version UNIQUE (student_id, exam_id, semester_id);


--
-- Name: student_exam_registrations uq_student_exam; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_exam_registrations
    ADD CONSTRAINT uq_student_exam UNIQUE (student_id, exam_id);


--
-- Name: marks_entries uq_student_exam_component; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marks_entries
    ADD CONSTRAINT uq_student_exam_component UNIQUE (student_id, exam_id, course_id, component_id);


--
-- Name: student_course_registrations uq_student_exam_course; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_course_registrations
    ADD CONSTRAINT uq_student_exam_course UNIQUE (student_exam_registration_id, course_id);


--
-- Name: user_group user_group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_group
    ADD CONSTRAINT user_group_pkey PRIMARY KEY (user_id, group_id);


--
-- Name: user_permission user_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_permission
    ADD CONSTRAINT user_permission_pkey PRIMARY KEY (user_id, permission_id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_student_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_student_id_key UNIQUE (student_id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: ix_academic_years_year_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_academic_years_year_code ON public.academic_years USING btree (year_code);


--
-- Name: ix_account_groups_grpcode; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_account_groups_grpcode ON public.account_groups USING btree (grpcode);


--
-- Name: ix_account_heads_ano; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_account_heads_ano ON public.account_heads USING btree (ano);


--
-- Name: ix_api_keys_api_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_api_keys_api_key ON public.api_keys USING btree (api_key);


--
-- Name: ix_api_keys_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_api_keys_id ON public.api_keys USING btree (id);


--
-- Name: ix_batches_academic_year_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_batches_academic_year_id ON public.batches USING btree (academic_year_id);


--
-- Name: ix_categories_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_categories_name ON public.categories USING btree (name);


--
-- Name: ix_countries_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_countries_name ON public.countries USING btree (name);


--
-- Name: ix_course_category_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_course_category_name ON public.course_category USING btree (name);


--
-- Name: ix_course_code_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_course_code_code ON public.course_code USING btree (code);


--
-- Name: ix_course_title_title; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_course_title_title ON public.course_title USING btree (title);


--
-- Name: ix_departments_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_departments_id ON public.departments USING btree (id);


--
-- Name: ix_district_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_district_id ON public.district USING btree (id);


--
-- Name: ix_fee_details_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_fee_details_id ON public.fee_details USING btree (id);


--
-- Name: ix_groups_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_groups_id ON public.groups USING btree (id);


--
-- Name: ix_hsc_board_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_hsc_board_name ON public.hsc_board USING btree (name);


--
-- Name: ix_lookup_master_category_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_lookup_master_category_id ON public.lookup_master USING btree (category_id);


--
-- Name: ix_lookup_master_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_lookup_master_key ON public.lookup_master USING btree (key);


--
-- Name: ix_main_groups_maincode; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_main_groups_maincode ON public.main_groups USING btree (maincode);


--
-- Name: ix_menus_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_menus_id ON public.menus USING btree (id);


--
-- Name: ix_program_payment_workflow_scopes_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_program_payment_workflow_scopes_id ON public.program_payment_workflow_scopes USING btree (id);


--
-- Name: ix_program_payment_workflow_scopes_program_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_program_payment_workflow_scopes_program_id ON public.program_payment_workflow_scopes USING btree (program_id);


--
-- Name: ix_programs_programe; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_programs_programe ON public.programs USING btree (programe);


--
-- Name: ix_semester_masters_program_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_semester_masters_program_type ON public.semester_masters USING btree (program_type);


--
-- Name: ix_ssc_board_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_ssc_board_name ON public.ssc_board USING btree (name);


--
-- Name: ix_staff_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_staff_id ON public.staff USING btree (id);


--
-- Name: ix_states_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_states_name ON public.states USING btree (name);


--
-- Name: ix_student_mark_temp_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_student_mark_temp_id ON public.student_mark_temp USING btree (id);


--
-- Name: ix_student_mark_temp_student_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_student_mark_temp_student_id ON public.student_mark_temp USING btree (student_id);


--
-- Name: ix_students_aadhaar; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_students_aadhaar ON public.students USING btree (aadhaar_number);


--
-- Name: ix_students_pan; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_students_pan ON public.students USING btree (pan_number);


--
-- Name: ix_students_phone; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_students_phone ON public.students USING btree (mobile_number);


--
-- Name: ix_sub_groups_subcode; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_sub_groups_subcode ON public.sub_groups USING btree (subcode);


--
-- Name: ix_subjects_course_category_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_subjects_course_category_id ON public.subjects USING btree (course_category_id);


--
-- Name: ix_subjects_course_code_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_subjects_course_code_id ON public.subjects USING btree (course_code_id);


--
-- Name: ix_subjects_course_title_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_subjects_course_title_id ON public.subjects USING btree (course_title_id);


--
-- Name: ix_subjects_programe_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_subjects_programe_id ON public.subjects USING btree (programe_id);


--
-- Name: ix_subjects_semester; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_subjects_semester ON public.subjects USING btree (semester);


--
-- Name: ix_submenus_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_submenus_id ON public.submenus USING btree (id);


--
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- Name: academic_details academic_details_hsc_board_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.academic_details
    ADD CONSTRAINT academic_details_hsc_board_id_fkey FOREIGN KEY (hsc_board_id) REFERENCES public.hsc_board(id);


--
-- Name: academic_details academic_details_ssc_board_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.academic_details
    ADD CONSTRAINT academic_details_ssc_board_id_fkey FOREIGN KEY (ssc_board_id) REFERENCES public.ssc_board(id);


--
-- Name: academic_details academic_details_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.academic_details
    ADD CONSTRAINT academic_details_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: account_heads account_heads_sub_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_heads
    ADD CONSTRAINT account_heads_sub_group_id_fkey FOREIGN KEY (sub_group_id) REFERENCES public.sub_groups(id) ON DELETE CASCADE;


--
-- Name: account_master account_master_account_head_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_master
    ADD CONSTRAINT account_master_account_head_id_fkey FOREIGN KEY (account_head_id) REFERENCES public.account_heads(id) ON DELETE CASCADE;


--
-- Name: address address_city_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.address
    ADD CONSTRAINT address_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.city(id);


--
-- Name: address address_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.address
    ADD CONSTRAINT address_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries(id);


--
-- Name: address_details address_details_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.address_details
    ADD CONSTRAINT address_details_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: address address_district_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.address
    ADD CONSTRAINT address_district_id_fkey FOREIGN KEY (district_id) REFERENCES public.district(id);


--
-- Name: address address_state_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.address
    ADD CONSTRAINT address_state_id_fkey FOREIGN KEY (state_id) REFERENCES public.states(id);


--
-- Name: application_fees application_fees_payment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_fees
    ADD CONSTRAINT application_fees_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payments(id);


--
-- Name: batches batches_academic_year_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.batches
    ADD CONSTRAINT batches_academic_year_id_fkey FOREIGN KEY (academic_year_id) REFERENCES public.academic_years(id) ON DELETE CASCADE;


--
-- Name: city city_state_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.city
    ADD CONSTRAINT city_state_id_fkey FOREIGN KEY (state_id) REFERENCES public.states(id);


--
-- Name: course_components course_components_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_components
    ADD CONSTRAINT course_components_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: course_results course_results_component_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_results
    ADD CONSTRAINT course_results_component_id_fkey FOREIGN KEY (component_id) REFERENCES public.course_components(id);


--
-- Name: course_results course_results_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_results
    ADD CONSTRAINT course_results_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: course_results course_results_exam_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_results
    ADD CONSTRAINT course_results_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES public.exams(id);


--
-- Name: course_results course_results_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_results
    ADD CONSTRAINT course_results_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: courses courses_semester_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_semester_id_fkey FOREIGN KEY (semester_id) REFERENCES public.semesters(id);


--
-- Name: deb_details deb_details_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.deb_details
    ADD CONSTRAINT deb_details_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: declaration_details declaration_details_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.declaration_details
    ADD CONSTRAINT declaration_details_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: district district_state_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.district
    ADD CONSTRAINT district_state_id_fkey FOREIGN KEY (state_id) REFERENCES public.states(id);


--
-- Name: document_details document_details_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_details
    ADD CONSTRAINT document_details_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: exam_timetables exam_timetables_component_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_timetables
    ADD CONSTRAINT exam_timetables_component_id_fkey FOREIGN KEY (component_id) REFERENCES public.course_components(id);


--
-- Name: exam_timetables exam_timetables_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_timetables
    ADD CONSTRAINT exam_timetables_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: exam_timetables exam_timetables_exam_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_timetables
    ADD CONSTRAINT exam_timetables_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES public.exams(id);


--
-- Name: exams exams_scheme_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exams
    ADD CONSTRAINT exams_scheme_id_fkey FOREIGN KEY (scheme_id) REFERENCES public.schemes(id);


--
-- Name: exams exams_semester_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exams
    ADD CONSTRAINT exams_semester_id_fkey FOREIGN KEY (semester_id) REFERENCES public.semesters(id);


--
-- Name: fee_details fee_details_programe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fee_details
    ADD CONSTRAINT fee_details_programe_id_fkey FOREIGN KEY (programe_id) REFERENCES public.programs(id);


--
-- Name: group_permission group_permission_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_permission
    ADD CONSTRAINT group_permission_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id);


--
-- Name: group_permission group_permission_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_permission
    ADD CONSTRAINT group_permission_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id);


--
-- Name: lookup_master lookup_master_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lookup_master
    ADD CONSTRAINT lookup_master_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: main_groups main_groups_account_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.main_groups
    ADD CONSTRAINT main_groups_account_group_id_fkey FOREIGN KEY (account_group_id) REFERENCES public.account_groups(id) ON DELETE CASCADE;


--
-- Name: marks_entries marks_entries_component_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marks_entries
    ADD CONSTRAINT marks_entries_component_id_fkey FOREIGN KEY (component_id) REFERENCES public.course_components(id);


--
-- Name: marks_entries marks_entries_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marks_entries
    ADD CONSTRAINT marks_entries_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: marks_entries marks_entries_entered_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marks_entries
    ADD CONSTRAINT marks_entries_entered_by_fkey FOREIGN KEY (entered_by) REFERENCES public.staff(id);


--
-- Name: marks_entries marks_entries_exam_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marks_entries
    ADD CONSTRAINT marks_entries_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES public.exams(id);


--
-- Name: marks_entries marks_entries_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marks_entries
    ADD CONSTRAINT marks_entries_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: payments payments_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: program_payment_workflow_scopes program_payment_workflow_scopes_program_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.program_payment_workflow_scopes
    ADD CONSTRAINT program_payment_workflow_scopes_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.programs(id) ON DELETE CASCADE;


--
-- Name: schemes schemes_programe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schemes
    ADD CONSTRAINT schemes_programe_id_fkey FOREIGN KEY (programe_id) REFERENCES public.programs(id);


--
-- Name: semester_fees semester_fees_payment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.semester_fees
    ADD CONSTRAINT semester_fees_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payments(id);


--
-- Name: semester_results semester_results_exam_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.semester_results
    ADD CONSTRAINT semester_results_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES public.exams(id);


--
-- Name: semester_results semester_results_semester_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.semester_results
    ADD CONSTRAINT semester_results_semester_id_fkey FOREIGN KEY (semester_id) REFERENCES public.semesters(id);


--
-- Name: semester_results semester_results_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.semester_results
    ADD CONSTRAINT semester_results_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: semesters semesters_scheme_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.semesters
    ADD CONSTRAINT semesters_scheme_id_fkey FOREIGN KEY (scheme_id) REFERENCES public.schemes(id);


--
-- Name: staff staff_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: staff staff_role_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_role_fkey FOREIGN KEY (role) REFERENCES public.groups(id);


--
-- Name: staff staff_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: states states_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.states
    ADD CONSTRAINT states_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries(id);


--
-- Name: student_course_registrations student_course_registrations_component_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_course_registrations
    ADD CONSTRAINT student_course_registrations_component_id_fkey FOREIGN KEY (component_id) REFERENCES public.course_components(id);


--
-- Name: student_course_registrations student_course_registrations_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_course_registrations
    ADD CONSTRAINT student_course_registrations_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: student_course_registrations student_course_registrations_student_exam_registration_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_course_registrations
    ADD CONSTRAINT student_course_registrations_student_exam_registration_id_fkey FOREIGN KEY (student_exam_registration_id) REFERENCES public.student_exam_registrations(id);


--
-- Name: student_exam_registrations student_exam_registrations_exam_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_exam_registrations
    ADD CONSTRAINT student_exam_registrations_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES public.exams(id);


--
-- Name: student_exam_registrations student_exam_registrations_scheme_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_exam_registrations
    ADD CONSTRAINT student_exam_registrations_scheme_id_fkey FOREIGN KEY (scheme_id) REFERENCES public.schemes(id);


--
-- Name: student_exam_registrations student_exam_registrations_semester_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_exam_registrations
    ADD CONSTRAINT student_exam_registrations_semester_id_fkey FOREIGN KEY (semester_id) REFERENCES public.semesters(id);


--
-- Name: student_exam_registrations student_exam_registrations_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_exam_registrations
    ADD CONSTRAINT student_exam_registrations_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: student_mark_temp student_mark_temp_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_mark_temp
    ADD CONSTRAINT student_mark_temp_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: students students_program_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.programs(id);


--
-- Name: sub_groups sub_groups_main_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sub_groups
    ADD CONSTRAINT sub_groups_main_group_id_fkey FOREIGN KEY (main_group_id) REFERENCES public.main_groups(id) ON DELETE CASCADE;


--
-- Name: subjects subjects_course_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_course_category_id_fkey FOREIGN KEY (course_category_id) REFERENCES public.course_category(id);


--
-- Name: subjects subjects_course_code_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_course_code_id_fkey FOREIGN KEY (course_code_id) REFERENCES public.course_code(id);


--
-- Name: subjects subjects_course_title_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_course_title_id_fkey FOREIGN KEY (course_title_id) REFERENCES public.course_title(id);


--
-- Name: subjects subjects_programe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_programe_id_fkey FOREIGN KEY (programe_id) REFERENCES public.programs(id);


--
-- Name: submenus submenus_menu_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submenus
    ADD CONSTRAINT submenus_menu_id_fkey FOREIGN KEY (menu_id) REFERENCES public.menus(id);


--
-- Name: user_group user_group_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_group
    ADD CONSTRAINT user_group_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id);


--
-- Name: user_group user_group_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_group
    ADD CONSTRAINT user_group_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_permission user_permission_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_permission
    ADD CONSTRAINT user_permission_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id);


--
-- Name: user_permission user_permission_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_permission
    ADD CONSTRAINT user_permission_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: users users_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict WBZye12cuzJzWU1bs1sUPskqS9tohVrWf24CdpxtyDwS70xqxPQpWVMCIk3SSxl

