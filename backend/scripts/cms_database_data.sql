

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

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;


--

CREATE TABLE public.complaint_updates (
    id integer NOT NULL,
    complaint_id integer NOT NULL,
    user_id integer NOT NULL,
    note text NOT NULL,
    status_changed_to character varying(50),
    is_resolution boolean DEFAULT false,
    consumer_confirmed boolean,
    consumer_feedback text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT complaint_updates_status_changed_to_check CHECK (((status_changed_to)::text = ANY ((ARRAY['logged'::character varying, 'assigned'::character varying, 'in_progress'::character varying, 'resolved'::character varying, 'closed'::character varying])::text[])))
);


ALTER TABLE public.complaint_updates OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 17305)
-- Name: complaint_updates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.complaint_updates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.complaint_updates_id_seq OWNER TO postgres;

--
-- TOC entry 4965 (class 0 OID 0)
-- Dependencies: 223
-- Name: complaint_updates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.complaint_updates_id_seq OWNED BY public.complaint_updates.id;


--
-- TOC entry 222 (class 1259 OID 17276)
-- Name: complaints; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.complaints (
    id integer NOT NULL,
    tenant_id integer NOT NULL,
    consumer_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    category character varying(100),
    status character varying(50) DEFAULT 'logged'::character varying NOT NULL,
    priority character varying(20) DEFAULT 'medium'::character varying,
    assigned_to integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    resolved_at timestamp without time zone,
    closed_at timestamp without time zone,
    CONSTRAINT complaints_priority_check CHECK (((priority)::text = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying])::text[]))),
    CONSTRAINT complaints_status_check CHECK (((status)::text = ANY ((ARRAY['logged'::character varying, 'assigned'::character varying, 'in_progress'::character varying, 'resolved'::character varying, 'closed'::character varying])::text[])))
);


ALTER TABLE public.complaints OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 17275)
-- Name: complaints_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.complaints_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.complaints_id_seq OWNER TO postgres;

--
-- TOC entry 4966 (class 0 OID 0)
-- Dependencies: 221
-- Name: complaints_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.complaints_id_seq OWNED BY public.complaints.id;


--
-- TOC entry 218 (class 1259 OID 17245)
-- Name: tenants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tenants (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    type character varying(50) NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tenants_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying])::text[]))),
    CONSTRAINT tenants_type_check CHECK (((type)::text = ANY ((ARRAY['bank'::character varying, 'telecom'::character varying, 'airline'::character varying])::text[])))
);


ALTER TABLE public.tenants OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 17244)
-- Name: tenants_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tenants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tenants_id_seq OWNER TO postgres;

--
-- TOC entry 4967 (class 0 OID 0)
-- Dependencies: 217
-- Name: tenants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tenants_id_seq OWNED BY public.tenants.id;


--
-- TOC entry 220 (class 1259 OID 17257)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    tenant_id integer,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    role character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'consumer'::character varying, 'ha'::character varying, 'sp'::character varying, 'hm'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 17256)
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
-- TOC entry 4968 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4770 (class 2604 OID 17309)
-- Name: complaint_updates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.complaint_updates ALTER COLUMN id SET DEFAULT nextval('public.complaint_updates_id_seq'::regclass);


--
-- TOC entry 4765 (class 2604 OID 17279)
-- Name: complaints id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.complaints ALTER COLUMN id SET DEFAULT nextval('public.complaints_id_seq'::regclass);


--
-- TOC entry 4758 (class 2604 OID 17248)
-- Name: tenants id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenants ALTER COLUMN id SET DEFAULT nextval('public.tenants_id_seq'::regclass);


--
-- TOC entry 4762 (class 2604 OID 17260)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4958 (class 0 OID 17306)
-- Dependencies: 224
-- Data for Name: complaint_updates; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.complaint_updates VALUES (1, 1, 2, 'Complaint logged by consumer', 'logged', false, NULL, NULL, '2025-11-30 22:32:38.888');
INSERT INTO public.complaint_updates VALUES (2, 1, 6, 'Complaint assigned to Jon Support', 'assigned', false, NULL, NULL, '2025-11-30 22:56:54.852');
INSERT INTO public.complaint_updates VALUES (3, 2, 9, 'Complaint logged by consumer', 'logged', false, NULL, NULL, '2025-12-02 19:26:29.776');
INSERT INTO public.complaint_updates VALUES (4, 3, 10, 'Complaint logged by consumer', 'logged', false, NULL, NULL, '2025-12-02 19:28:35.565');
INSERT INTO public.complaint_updates VALUES (5, 1, 7, 'Checking with customer', 'in_progress', false, NULL, NULL, '2025-12-02 19:35:58.355');
INSERT INTO public.complaint_updates VALUES (6, 1, 7, 'Issue resolved', 'resolved', true, NULL, NULL, '2025-12-02 19:38:17.745');
INSERT INTO public.complaint_updates VALUES (7, 4, 2, 'Complaint logged by consumer', 'logged', false, NULL, NULL, '2025-12-02 19:48:16.305');
INSERT INTO public.complaint_updates VALUES (8, 5, 2, 'Complaint logged by consumer', 'logged', false, NULL, NULL, '2025-12-02 19:48:38.852');


--
-- TOC entry 4956 (class 0 OID 17276)
-- Dependencies: 222
-- Data for Name: complaints; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.complaints VALUES (2, 9, 9, 'Issue on network', 'qwertyuiopasdfghjkl;''zxcv bnṃxjknejkvjwekvbwhjvhewvh wv ewnv,w', 'Account problem', 'logged', 'medium', NULL, '2025-12-02 19:26:29.708', '2025-12-02 19:26:29.708', NULL, NULL);
INSERT INTO public.complaints VALUES (3, 1, 10, 'New Complaint', 'yfvewhvbewjvnewivnklbnrekbnrejkbnes nsjb jeskbnsjbjlbnerlkbnrekbkreb', 'Card issue', 'logged', 'low', NULL, '2025-12-02 19:28:35.395', '2025-12-02 19:28:35.395', NULL, NULL);
INSERT INTO public.complaints VALUES (1, 1, 2, 'No connection', '5 days no connection', NULL, 'resolved', 'medium', 7, '2025-11-30 22:32:38.675', '2025-12-02 19:38:17.736672', '2025-12-02 19:38:17.733', NULL);
INSERT INTO public.complaints VALUES (4, 1, 2, 'Issue2', 'qweklngksnbsjkbnsjbnejbnesjb ekbnksrnbhkrnbrklnkrlnmrn', 'Account Issue', 'logged', 'low', NULL, '2025-12-02 19:48:16.12', '2025-12-02 19:48:16.12', NULL, NULL);
INSERT INTO public.complaints VALUES (5, 1, 2, 'Issue 3', 'bmsdzklbnarhjbryegvn ewkvml;eovml; bjbyurhbvewjvnwembewbmkawbnjrbabjkasbn', 'Issue 23', 'logged', 'high', NULL, '2025-12-02 19:48:38.791', '2025-12-02 19:48:38.791', NULL, NULL);


--
-- TOC entry 4952 (class 0 OID 17245)
-- Dependencies: 218
-- Data for Name: tenants; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tenants VALUES (1, 'NatWest Bank', 'bank', 'active', '2025-11-30 21:35:37.878', '2025-11-30 21:35:37.878');
INSERT INTO public.tenants VALUES (2, 'Vodafone', 'telecom', 'active', '2025-11-30 21:52:52.556', '2025-11-30 21:52:52.556');
INSERT INTO public.tenants VALUES (3, 'British Airways', 'airline', 'active', '2025-11-30 21:53:03.862', '2025-11-30 21:53:03.862');
INSERT INTO public.tenants VALUES (4, 'Atlantic', 'airline', 'active', '2025-11-30 21:55:08.123', '2025-11-30 21:55:08.123');
INSERT INTO public.tenants VALUES (5, 'Itihad', 'airline', 'active', '2025-11-30 21:55:17.297', '2025-11-30 21:55:17.297');
INSERT INTO public.tenants VALUES (6, 'O2', 'telecom', 'active', '2025-11-30 21:55:48.507', '2025-11-30 21:55:48.507');
INSERT INTO public.tenants VALUES (7, 'Jio', 'telecom', 'active', '2025-11-30 21:55:54.779', '2025-11-30 21:55:54.779');
INSERT INTO public.tenants VALUES (8, 'Airtel', 'telecom', 'active', '2025-11-30 21:56:02.284', '2025-11-30 21:56:02.284');
INSERT INTO public.tenants VALUES (9, 'EE', 'telecom', 'active', '2025-11-30 21:56:16.549', '2025-11-30 21:56:16.549');
INSERT INTO public.tenants VALUES (10, 'SBI', 'bank', 'active', '2025-11-30 21:57:51.262', '2025-11-30 21:57:51.262');
INSERT INTO public.tenants VALUES (11, 'Jio2', 'telecom', 'active', '2025-12-02 19:41:08.309', '2025-12-02 19:41:08.309');


--
-- TOC entry 4954 (class 0 OID 17257)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES (1, NULL, 'admin@gmail.com', '$2b$10$Sx2fGQ2AFOVLR4LxdNfs1uUYnvG4auZXZgskIMQKpIznN1Y1VvNBe', 'System', 'Admin', 'admin', '2025-11-30 20:52:12.722', '2025-11-30 20:52:12.722');
INSERT INTO public.users VALUES (2, 1, 'ij@gmail.com', '$2b$10$ApuobMiy.6GJPOmiDsF9v.6h3HmsgxZKJS0H/YaMjvHtn5gQdmF7W', 'Sys', 'Ad', 'consumer', '2025-11-30 21:49:29.041', '2025-11-30 21:49:29.041');
INSERT INTO public.users VALUES (3, 2, 'mk@gmail.com', '$2b$10$i27WesAr2JrZXSUFlXA8MOFNkLzDnC83A2MawV7XlA3mRQMGeG3vK', 'Mys', 'Adhuj', 'hm', '2025-11-30 22:12:27.154', '2025-11-30 22:12:27.154');
INSERT INTO public.users VALUES (4, 3, 'agent@natwest.com', '$2b$10$zlRwLMqpxPAi0Y76zFLJuOCyUL5bhds/H2Y.MZy15AagTC1j0XrB6', 'John', 'Agent', 'hm', '2025-11-30 22:34:29.648', '2025-11-30 22:34:29.648');
INSERT INTO public.users VALUES (5, 2, 'support@natwest.com', '$2b$10$Wup33UbNhw5GK5TjN6jsL.KlJKGkHKJWGtEkJFpQpWQvo00zPMXDq', 'Jane', 'Support', 'sp', '2025-11-30 22:35:28.767', '2025-11-30 22:35:28.767');
INSERT INTO public.users VALUES (6, 1, 'agent2@natwest.com', '$2b$10$E1xoppPOF/8eiCPNeMRSE.oOqQ6jLSV1dyR0oUkXo4W/mMsvEEzSa', 'Jon', 'Support', 'ha', '2025-11-30 22:45:43.748', '2025-11-30 22:45:43.748');
INSERT INTO public.users VALUES (7, 1, 'support2@natwest.com', '$2b$10$70kZeaXThog3PPvcr/DeIusm6LaDuz8SyeKoI8NrcTNK6NaohZv5W', 'Jon', 'Support', 'sp', '2025-11-30 22:51:03.563', '2025-11-30 22:51:03.563');
INSERT INTO public.users VALUES (8, 2, 'support3@natwest.com', '$2b$10$4bXOmCHA6o/JthBzLPCUee6XedGigXbqQaZHx2uy1.3pE3rA51GoS', 'Jon', 'Support', 'sp', '2025-11-30 22:51:14.87', '2025-11-30 22:51:14.87');
INSERT INTO public.users VALUES (9, 9, 'tj@gmail.com', '$2b$10$qG/vPGSjJqTgGvLBVU6M/.uc5WZRN6gZbXIufAfrmL2GhjnOu2Squ', 'Tamal', 'Jana', 'consumer', '2025-12-02 19:25:38.099', '2025-12-02 19:25:38.099');
INSERT INTO public.users VALUES (10, 1, 'demo@gmail.com', '$2b$10$k38qJKxw8fqQBzmLbTJJO.o0bMIh8gMOiS4AZzaAOJOT8h1ErAXzq', 'Demo', 'd', 'consumer', '2025-12-02 19:28:08.178', '2025-12-02 19:28:08.178');
INSERT INTO public.users VALUES (11, 11, 's@gmail.com', '$2b$10$0t7Aq7MF0k1nwIulVDFmAuWliFpiuIP1NcXTah0jb2rg4gYH8QZ8q', 'ki', 'io', 'sp', '2025-12-02 21:43:31.629', '2025-12-02 21:43:31.629');
INSERT INTO public.users VALUES (12, 11, 'k@gmail.com', '$2b$10$CD3rw.yfPCwKXWuDl8F3s.DGwIruAUq5k5jvDhdBeRNHQOTMPbHbW', 'ki', 'ju', 'sp', '2025-12-02 21:47:12.164', '2025-12-02 21:47:12.164');
INSERT INTO public.users VALUES (13, 11, 'n@gmail.com', '$2b$10$Q/AblxUpC9szR9FcWyVklO8uzAfqBFxJH82gS4bcAQiuIZX7dy0JW', 'jh', ' n', 'sp', '2025-12-02 21:50:20.571', '2025-12-02 21:50:20.571');
INSERT INTO public.users VALUES (14, 11, 'g@mail.com', '$2b$10$FS9aNE7M6tNWDrr0wU563OwsSKI39V9DwSm0htCP8lQFVs5AxqDom', 'j', 'hu', 'sp', '2025-12-02 21:55:21.894', '2025-12-02 21:55:21.894');


--
-- TOC entry 4969 (class 0 OID 0)
-- Dependencies: 223
-- Name: complaint_updates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.complaint_updates_id_seq', 8, true);


--
-- TOC entry 4970 (class 0 OID 0)
-- Dependencies: 221
-- Name: complaints_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.complaints_id_seq', 5, true);


--
-- TOC entry 4971 (class 0 OID 0)
-- Dependencies: 217
-- Name: tenants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tenants_id_seq', 11, true);


--
-- TOC entry 4972 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 14, true);


--
-- TOC entry 4794 (class 2606 OID 17316)
-- Name: complaint_updates complaint_updates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.complaint_updates
    ADD CONSTRAINT complaint_updates_pkey PRIMARY KEY (id);


--
-- TOC entry 4788 (class 2606 OID 17289)
-- Name: complaints complaints_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_pkey PRIMARY KEY (id);


--
-- TOC entry 4780 (class 2606 OID 17255)
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (id);


--
-- TOC entry 4784 (class 2606 OID 17269)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4786 (class 2606 OID 17267)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4795 (class 1259 OID 17333)
-- Name: idx_complaint_updates_complaint_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_complaint_updates_complaint_id ON public.complaint_updates USING btree (complaint_id);


--
-- TOC entry 4796 (class 1259 OID 17334)
-- Name: idx_complaint_updates_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_complaint_updates_user_id ON public.complaint_updates USING btree (user_id);


--
-- TOC entry 4789 (class 1259 OID 17331)
-- Name: idx_complaints_assigned_to; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_complaints_assigned_to ON public.complaints USING btree (assigned_to);


--
-- TOC entry 4790 (class 1259 OID 17330)
-- Name: idx_complaints_consumer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_complaints_consumer_id ON public.complaints USING btree (consumer_id);


--
-- TOC entry 4791 (class 1259 OID 17332)
-- Name: idx_complaints_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_complaints_status ON public.complaints USING btree (status);


--
-- TOC entry 4792 (class 1259 OID 17329)
-- Name: idx_complaints_tenant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_complaints_tenant_id ON public.complaints USING btree (tenant_id);


--
-- TOC entry 4781 (class 1259 OID 17328)
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- TOC entry 4782 (class 1259 OID 17327)
-- Name: idx_users_tenant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_tenant_id ON public.users USING btree (tenant_id);


--
-- TOC entry 4805 (class 2620 OID 17337)
-- Name: complaints update_complaints_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON public.complaints FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4803 (class 2620 OID 17335)
-- Name: tenants update_tenants_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON public.tenants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4804 (class 2620 OID 17336)
-- Name: users update_users_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4801 (class 2606 OID 17317)
-- Name: complaint_updates complaint_updates_complaint_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.complaint_updates
    ADD CONSTRAINT complaint_updates_complaint_id_fkey FOREIGN KEY (complaint_id) REFERENCES public.complaints(id) ON DELETE CASCADE;


--
-- TOC entry 4802 (class 2606 OID 17322)
-- Name: complaint_updates complaint_updates_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.complaint_updates
    ADD CONSTRAINT complaint_updates_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4798 (class 2606 OID 17300)
-- Name: complaints complaints_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 4799 (class 2606 OID 17295)
-- Name: complaints complaints_consumer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_consumer_id_fkey FOREIGN KEY (consumer_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4800 (class 2606 OID 17290)
-- Name: complaints complaints_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- TOC entry 4797 (class 2606 OID 17270)
-- Name: users users_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


-- Completed on 2025-12-05 19:41:05

--
-- PostgreSQL database dump complete
--

\unrestrict 1xuzq5LHU4jcWxh5l4J7RbAoM9XPgjrFTfCDwSRTlwUqaTcszTnbrXb0GBA8BAg

