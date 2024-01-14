CREATE TABLE IF NOT EXISTS public.concelho
(
    id_concelho integer NOT NULL DEFAULT nextval('concelho_id_sequence'::regclass),
    nome_concelho character varying(255) COLLATE pg_catalog."default" NOT NULL,
    id_distrito integer,
    CONSTRAINT concelho_pkey PRIMARY KEY (id_concelho),
    CONSTRAINT concelho_id_distrito_fkey FOREIGN KEY (id_distrito)
        REFERENCES public.distrito (id_distrito) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE IF NOT EXISTS public.utentemorada
(
    id_utentemorada integer NOT NULL DEFAULT nextval('utentemorada_id_utentemorada_seq'::regclass),
    id_utente integer,
    id_morada integer,
    CONSTRAINT utentemorada_pkey PRIMARY KEY (id_utentemorada),
    CONSTRAINT utentemorada_id_morada_fkey FOREIGN KEY (id_morada)
        REFERENCES public.morada (id_morada) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT utentemorada_id_utente_fkey FOREIGN KEY (id_utente)
        REFERENCES public.utente (id_utente) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE IF NOT EXISTS public.utente
(
    id_utente integer NOT NULL DEFAULT nextval('utente_id_sequence'::regclass),
    nome character varying(255) COLLATE pg_catalog."default" NOT NULL,
    numero_telemovel character varying(20) COLLATE pg_catalog."default",
    email character varying(255) COLLATE pg_catalog."default",
    data_nascimento date NOT NULL,
    nif character varying(20) COLLATE pg_catalog."default" NOT NULL,
    numero_utente character varying(20) COLLATE pg_catalog."default" NOT NULL,
    numero_cc character varying(20) COLLATE pg_catalog."default" NOT NULL,
    validade_cc date NOT NULL,
    CONSTRAINT utente_pkey PRIMARY KEY (id_utente),
    CONSTRAINT utente_nif_key UNIQUE (nif),
    CONSTRAINT utente_numero_cc_key UNIQUE (numero_cc),
    CONSTRAINT utente_numero_utente_key UNIQUE (numero_utente)
)

CREATE TABLE IF NOT EXISTS public.usfutente
(
    id_usf integer NOT NULL,
    id_utente integer NOT NULL,
    id_medico integer,
    id_enfermeiro integer,
    "id_UsfUtente" integer NOT NULL DEFAULT nextval('"usfutente_id_UsfUtente_seq"'::regclass),
    CONSTRAINT "pk_id_UsfUtente" PRIMARY KEY ("id_UsfUtente"),
    CONSTRAINT usfutente_id_enfermeiro_fkey FOREIGN KEY (id_enfermeiro)
        REFERENCES public.enfermeiro (id_enfermeiro) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT usfutente_id_medico_fkey FOREIGN KEY (id_medico)
        REFERENCES public.medico (id_medico) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT usfutente_id_usf_fkey FOREIGN KEY (id_usf)
        REFERENCES public.usf (id_usf) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT usfutente_id_usf_id_enfermeiro_fkey FOREIGN KEY (id_usf, id_enfermeiro)
        REFERENCES public.usfenfermeiro (id_usf, id_enfermeiro) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT usfutente_id_usf_id_medico_fkey FOREIGN KEY (id_usf, id_medico)
        REFERENCES public.usfmedico (id_usf, id_medico) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT usfutente_id_utente_fkey FOREIGN KEY (id_utente)
        REFERENCES public.utente (id_utente) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE IF NOT EXISTS public.usfmedico
(
    id_usf integer NOT NULL,
    id_medico integer NOT NULL,
    CONSTRAINT usfmedico_pkey PRIMARY KEY (id_usf, id_medico),
    CONSTRAINT usfmedico_id_medico_fkey FOREIGN KEY (id_medico)
        REFERENCES public.medico (id_medico) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT usfmedico_id_usf_fkey FOREIGN KEY (id_usf)
        REFERENCES public.usf (id_usf) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE IF NOT EXISTS public.usfenfermeiro
(
    id_usf integer NOT NULL,
    id_enfermeiro integer NOT NULL,
    CONSTRAINT usfenfermeiro_pkey PRIMARY KEY (id_usf, id_enfermeiro),
    CONSTRAINT usfenfermeiro_id_enfermeiro_fkey FOREIGN KEY (id_enfermeiro)
        REFERENCES public.enfermeiro (id_enfermeiro) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT usfenfermeiro_id_usf_fkey FOREIGN KEY (id_usf)
        REFERENCES public.usf (id_usf) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE IF NOT EXISTS public.usf
(
    id_usf integer NOT NULL DEFAULT nextval('usf_id_sequence'::regclass),
    nome_usf character varying(100) COLLATE pg_catalog."default",
    CONSTRAINT usf_pkey PRIMARY KEY (id_usf)
)

CREATE TABLE IF NOT EXISTS public.morada
(
    id_morada integer NOT NULL DEFAULT nextval('morada_id_sequence'::regclass),
    rua character varying(255) COLLATE pg_catalog."default" NOT NULL,
    codigo_postal character varying(20) COLLATE pg_catalog."default" NOT NULL,
    freguesia character varying(255) COLLATE pg_catalog."default" NOT NULL,
    concelho character varying(255) COLLATE pg_catalog."default" NOT NULL,
    distrito character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT morada_pkey PRIMARY KEY (id_morada)
)

CREATE TABLE IF NOT EXISTS public.medico
(
    id_medico integer NOT NULL DEFAULT nextval('medico_id_sequence'::regclass),
    nome character varying(255) COLLATE pg_catalog."default",
    especialidade character varying(100) COLLATE pg_catalog."default",
    numero_cedula bigint,
    CONSTRAINT medico_pkey PRIMARY KEY (id_medico)
)



CREATE TABLE IF NOT EXISTS public.localidadesusf
(
    id_localidadeusf bigint NOT NULL DEFAULT nextval('localidadeusf_id_sequence'::regclass),
    id_freguesia integer NOT NULL,
    id_concelho integer NOT NULL,
    id_distrito integer NOT NULL,
    id_usf integer NOT NULL,
    CONSTRAINT localidadesusf_pkey PRIMARY KEY (id_localidadeusf),
    CONSTRAINT localidadesusf_id_concelho_fkey FOREIGN KEY (id_concelho)
        REFERENCES public.concelho (id_concelho) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT localidadesusf_id_distrito_fkey FOREIGN KEY (id_distrito)
        REFERENCES public.distrito (id_distrito) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT localidadesusf_id_freguesia_fkey FOREIGN KEY (id_freguesia)
        REFERENCES public.freguesia (id_freguesia) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT localidadesusf_id_usf_fkey FOREIGN KEY (id_usf)
        REFERENCES public.usf (id_usf) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)


CREATE TABLE IF NOT EXISTS public.distrito
(
    id_distrito integer NOT NULL DEFAULT nextval('distrito_id_sequence'::regclass),
    nome_distrito character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT distrito_pkey PRIMARY KEY (id_distrito)
)


CREATE TABLE IF NOT EXISTS public.enfermeiro
(
    id_enfermeiro integer NOT NULL DEFAULT nextval('enfermeiro_id_sequence'::regclass),
    nome character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT enfermeiro_pkey PRIMARY KEY (id_enfermeiro)
)

CREATE TABLE IF NOT EXISTS public.freguesia
(
    id_freguesia integer NOT NULL DEFAULT nextval('freguesia_id_sequence'::regclass),
    nome_freguesia character varying(255) COLLATE pg_catalog."default" NOT NULL,
    id_concelho integer,
    CONSTRAINT freguesia_pkey PRIMARY KEY (id_freguesia),
    CONSTRAINT freguesia_id_concelho_fkey FOREIGN KEY (id_concelho)
        REFERENCES public.concelho (id_concelho) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
