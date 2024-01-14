CREATE TABLE IF NOT EXISTS public.documentos
(
    id_documento integer NOT NULL DEFAULT nextval('documentos_id_documento_seq'::regclass),
    conteudo bytea NOT NULL,
    data_upload timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_pedido integer,
    CONSTRAINT documentos_pkey PRIMARY KEY (id_documento),
    CONSTRAINT fk_id_pedido FOREIGN KEY (id_pedido)
        REFERENCES public.pedido_primeira_avaliacao (id_pedido)
)


CREATE TABLE IF NOT EXISTS public.estado
(
    id_estado integer NOT NULL DEFAULT nextval('estado_id_estado_seq'::regclass),
    nome_estado character varying(100)" NOT NULL,
    CONSTRAINT estado_pkey PRIMARY KEY (id_estado)
)

CREATE TABLE IF NOT EXISTS public.medicos
(
    id_medico bigint NOT NULL DEFAULT nextval('seq_id_medicos'::regclass),
    id_user_medico bigint NOT NULL,
    nome character varying(100) NOT NULL,
    numero_cedula bigint NOT NULL,
    CONSTRAINT medicos_pkey PRIMARY KEY (id_medico),
    CONSTRAINT medicos_id_user_medico_fkey FOREIGN KEY (id_user_medico)
        REFERENCES public.users (id_user) 
)

CREATE TABLE IF NOT EXISTS public.pedido_junta_medica
(
    id_pedido_junta_medica integer NOT NULL DEFAULT nextval('pedido_junta_medica_id_pedido_junta_medica_seq'::regclass),
    id_pedido_avaliacao integer NOT NULL,
    estado integer NOT NULL,
    descricao character varying(255)  DEFAULT NULL::character varying,
    id_grupo_medico integer,
    CONSTRAINT pedido_junta_medica_pkey PRIMARY KEY (id_pedido_junta_medica),
    CONSTRAINT pedido_junta_medica_id_grupo_medico_fkey FOREIGN KEY (id_grupo_medico)
        REFERENCES public.grupos_medicos (id_grupo_medico),
    CONSTRAINT pedido_junta_medica_id_pedido_avaliacao_fkey FOREIGN KEY (id_pedido_avaliacao)
        REFERENCES public.pedido_primeira_avaliacao (id_pedido),
     
)

CREATE TABLE IF NOT EXISTS public.utenteusf
(
    id_utenteusf integer NOT NULL DEFAULT nextval('utenteusf_id_utenteusf_seq'::regclass),
    id_utente integer NOT NULL,
    id_usf integer NOT NULL,
    CONSTRAINT utenteusf_pkey PRIMARY KEY (id_utenteusf),
    CONSTRAINT "unique" UNIQUE (id_utente)
        INCLUDE(id_usf),
    CONSTRAINT utenteusf_id_usf_fkey FOREIGN KEY (id_usf)
        REFERENCES public.usf (id_usf) ,
    CONSTRAINT utenteusf_id_utente_fkey FOREIGN KEY (id_utente)
        REFERENCES public.utentes (id_utente),
)

CREATE TABLE IF NOT EXISTS public.utentes
(
    id_utente bigint NOT NULL DEFAULT nextval('seq_id_utentes'::regclass),
    id_user_utente bigint NOT NULL,
    numero_utente bigint NOT NULL,
    nome character varying  NOT NULL,
    CONSTRAINT utentes_pkey PRIMARY KEY (id_utente),
    CONSTRAINT utentes_id_user_utente_fkey FOREIGN KEY (id_user_utente)
        REFERENCES public.users (id_user),
)

CREATE TABLE IF NOT EXISTS public.medicousf
(
    id_medicousf integer NOT NULL DEFAULT nextval('medicousf_id_medicousf_seq'::regclass),
    id_medico integer NOT NULL,
    id_usf integer NOT NULL,
    CONSTRAINT medicousf_pkey PRIMARY KEY (id_medicousf),
    CONSTRAINT medicousf_id_medico_fkey FOREIGN KEY (id_medico)
        REFERENCES public.medicos (id_medico),
    CONSTRAINT medicousf_id_usf_fkey FOREIGN KEY (id_usf)
        REFERENCES public.usf (id_usf)
)
CREATE TABLE IF NOT EXISTS public.medicos_grupos
(
    id_medico_grupo integer NOT NULL DEFAULT nextval('medicos_grupos_id_medico_grupo_seq'::regclass),
    id_medico integer NOT NULL,
    id_grupo_medico integer NOT NULL,
    CONSTRAINT medicos_grupos_pkey PRIMARY KEY (id_medico_grupo),
    CONSTRAINT medicos_grupos_id_grupo_medico_fkey FOREIGN KEY (id_grupo_medico)
        REFERENCES public.grupos_medicos (id_grupo_medico),
    CONSTRAINT medicos_grupos_id_medico_fkey FOREIGN KEY (id_medico)
        REFERENCES public.medicos (id_medico) 
)

CREATE TABLE IF NOT EXISTS public.grupos_medicos
(
    id_grupo_medico integer NOT NULL DEFAULT nextval('grupos_medicos_id_grupo_medico_seq'::regclass),
    nome_grupo character varying(100) NOT NULL,
    CONSTRAINT grupos_medicos_pkey PRIMARY KEY (id_grupo_medico)
)

CREATE TABLE IF NOT EXISTS public.pedido_primeira_avaliacao
(
    id_pedido integer NOT NULL DEFAULT nextval('pedido_primeira_avaliacao_id_pedido_seq'::regclass),
    id_utente integer NOT NULL,
    id_medico integer NOT NULL,
    estado character varying(255)  NOT NULL,
    descricao character varying(255)
    nome_completo character varying(255)  NOT NULL,
    data_nascimento date NOT NULL,
    n_identificacao character varying(255)  NOT NULL,
    n_utente_saude character varying(255) NOT NULL,
    nif character varying(255) NOT NULL,
    data_validade date,
    rua character varying(255) NOT NULL,
    codigo_postal character varying(255) NOT NULL,
    localidade character varying(255) NOT NULL,
    concelho character varying(255)  NOT NULL,
    distrito character varying(255) NOT NULL,
    telemovel character varying(20) NOT NULL,
    email character varying(255) NOT NULL,
    multiuso boolean,
    importacao_veiculo boolean,
    submissao_reavaliacao boolean,
    data_submissao_reavaliacao date,
    data_submissao date,
    valor_invalidez integer,
    data_validacao date,
    CONSTRAINT pedido_primeira_avaliacao_pkey PRIMARY KEY (id_pedido),
    CONSTRAINT check_multiuso_importacao CHECK (multiuso IS NULL OR multiuso = false OR importacao_veiculo IS NULL OR importacao_veiculo = false),
    CONSTRAINT check_multiuso_importacao_false CHECK (NOT (multiuso = false AND importacao_veiculo = false)) NOT VALID
)

CREATE TABLE IF NOT EXISTS public.users
(
    id_user bigint NOT NULL DEFAULT nextval('seq_id_user'::regclass),
    id_perfil integer NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    estadodeatividade bigint DEFAULT 1,
    CONSTRAINT users_pkey PRIMARY KEY (id_user),
    CONSTRAINT "email_unico " UNIQUE (email),
    CONSTRAINT users_id_perfil_fkey FOREIGN KEY (id_perfil)
        REFERENCES public.perfis (id_perfil) 

	CREATE TABLE IF NOT EXISTS public.usf
(
    id_usf integer NOT NULL DEFAULT nextval('usf_id_usf_seq'::regclass),
    nomeusf character varying(100) NOT NULL,
    CONSTRAINT usf_pkey PRIMARY KEY (id_usf)
)

CREATE TABLE IF NOT EXISTS public.perfis
(
    id_perfil integer NOT NULL DEFAULT nextval('seq_id_perfil'::regclass),
    nome character varying(50) NOT NULL,
    CONSTRAINT perfis_pkey PRIMARY KEY (id_perfil)
)


CREATE TABLE IF NOT EXISTS public.horarios
(
    id_horario integer NOT NULL DEFAULT nextval('horarios_id_horario_seq'::regclass),
    id_medico integer NOT NULL,
    dia_semana integer NOT NULL,
    hora_inicio_manha time without time zone NOT NULL,
    hora_fim_manha time without time zone NOT NULL,
    hora_inicio_tarde time without time zone NOT NULL,
    hora_fim_tarde time without time zone NOT NULL,
    CONSTRAINT horarios_pkey PRIMARY KEY (id_horario),
    CONSTRAINT unique_medico_dia_semana UNIQUE (id_medico, dia_semana),
    CONSTRAINT horarios_id_medico_fkey FOREIGN KEY (id_medico)
        REFERENCES public.medicos (id_medico),
    CONSTRAINT check_horarios_manha CHECK (hora_inicio_manha < hora_fim_manha),
    CONSTRAINT check_horarios_tarde CHECK (hora_inicio_tarde < hora_fim_tarde),
    CONSTRAINT check_horario_inicio CHECK (hora_inicio_manha < hora_inicio_tarde),
    CONSTRAINT check_horario_fim CHECK (hora_fim_manha < hora_fim_tarde)
)

