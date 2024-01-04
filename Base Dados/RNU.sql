CREATE SEQUENCE utente_id_sequence START 1 INCREMENT 1;
CREATE SEQUENCE morada_id_sequence START 1 INCREMENT 1;
CREATE SEQUENCE usf_id_sequence START 1 INCREMENT 1;
CREATE SEQUENCE medico_id_sequence START 1 INCREMENT 1;
CREATE SEQUENCE enfermeiro_id_sequence START 1 INCREMENT 1;
CREATE SEQUENCE distrito_id_sequence START 1 INCREMENT 1;
CREATE SEQUENCE concelho_id_sequence START 1 INCREMENT 1;
CREATE SEQUENCE freguesia_id_sequence START 1 INCREMENT 1;
CREATE SEQUENCE localidadeUSF_id_sequence START 1 INCREMENT 1;

CREATE TABLE Utente (
    id_utente INT DEFAULT nextval('utente_id_sequence') PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    numero_telemovel VARCHAR(20),
    email VARCHAR(255),
    data_nascimento DATE NOT NULL,
    nif VARCHAR(20) NOT NULL UNIQUE,
    numero_utente VARCHAR(20) NOT NULL UNIQUE,
    numero_cc VARCHAR(20) NOT NULL UNIQUE,
    validade_cc DATE NOT NULL
);

CREATE TABLE Morada (
    id_morada INT DEFAULT nextval('morada_id_sequence') PRIMARY KEY,
    rua VARCHAR(255) NOT NULL,
    codigo_postal VARCHAR(20) NOT NULL,
    freguesia VARCHAR(255) NOT NULL,
    concelho VARCHAR(255) NOT NULL,
    distrito VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_utente) REFERENCES Utente(id_utente)
);

CREATE TABLE freguesia (
    id_freguesia INT DEFAULT nextval('freguesia_id_sequence'::regclass) PRIMARY KEY,
    nome_freguesia VARCHAR(255) NOT NULL,
    id_concelho INT,
    FOREIGN KEY (id_concelho) REFERENCES concelho(id_concelho)
);

CREATE TABLE concelho (
    id_concelho INT DEFAULT nextval('concelho_id_sequence'::regclass) PRIMARY KEY,
    nome_concelho VARCHAR(255) NOT NULL,
    id_distrito INT,
    FOREIGN KEY (id_distrito) REFERENCES distrito(id_distrito)
);

CREATE TABLE distrito (
    id_distrito INT DEFAULT nextval('distrito_id_sequence'::regclass) PRIMARY KEY,
    nome_distrito VARCHAR(255) NOT NULL
);


CREATE TABLE Medico (
    id_medico INT DEFAULT nextval('medico_id_sequence') PRIMARY KEY,
    nome VARCHAR(255),
    especialidade VARCHAR(100)
);

CREATE TABLE Enfermeiro (
    id_enfermeiro INT DEFAULT nextval('enfermeiro_id_sequence') PRIMARY KEY,
    nome VARCHAR(255)
);


CREATE TABLE IF NOT EXISTS public.usf
(
    id_usf integer NOT NULL DEFAULT nextval('usf_id_sequence'::regclass) primary key,
    nome_usf varchar(100),
    id_concelho integer,
    id_distrito integer,
    id_freguesia integer,
   	FOREIGN KEY (id_concelho) REFERENCES public.concelho (id_concelho),
    FOREIGN KEY (id_distrito) REFERENCES public.distrito (id_distrito),
    FOREIGN KEY (id_freguesia) REFERENCES public.freguesia (id_freguesia) 
)

CREATE TABLE USFMedico (
    id_usf INT,
    id_medico INT,
    PRIMARY KEY (id_usf, id_medico),
    FOREIGN KEY (id_usf) REFERENCES USF(id_usf),
    FOREIGN KEY (id_medico) REFERENCES Medico(id_medico)
);

CREATE TABLE USFEnfermeiro (
    id_usf INT,
    id_enfermeiro INT,
    PRIMARY KEY (id_usf, id_enfermeiro),
    FOREIGN KEY (id_usf) REFERENCES USF(id_usf),
    FOREIGN KEY (id_enfermeiro) REFERENCES Enfermeiro(id_enfermeiro)
);

CREATE TABLE USFUtente (
	id_UsfUtente serial primary key,
    id_usf INT,
    id_utente INT,
    id_medico INT,
    id_enfermeiro INT,
    FOREIGN KEY (id_usf) REFERENCES USF(id_usf),
    FOREIGN KEY (id_utente) REFERENCES Utente(id_utente),
    FOREIGN KEY (id_medico) REFERENCES Medico(id_medico),
    FOREIGN KEY (id_enfermeiro) REFERENCES Enfermeiro(id_enfermeiro),
    FOREIGN KEY (id_usf, id_medico) REFERENCES USFMedico(id_usf, id_medico),
    FOREIGN KEY (id_usf, id_enfermeiro) REFERENCES USFEnfermeiro(id_usf, id_enfermeiro)
);

CREATE TABLE LocalidadesUSF (
    id_LocalidadeUSF BIGINT DEFAULT nextval('localidadeUSF_id_sequence'::regclass) PRIMARY KEY,
    id_freguesia INT NOT NULL,
    id_concelho INT NOT NULL,
    id_distrito INT NOT NULL,
    id_usf INT NOT NULL,
    FOREIGN KEY (id_freguesia) REFERENCES freguesia(id_freguesia),
    FOREIGN KEY (id_concelho) REFERENCES concelho(id_concelho),
    FOREIGN KEY (id_distrito) REFERENCES distrito(id_distrito),
    FOREIGN KEY (id_usf) REFERENCES USF(id_usf)
);


-- Inserting data into Distrito table
INSERT INTO distrito (nome_distrito) VALUES
    ('Lisboa');
	
select * from distrito

-- Inserting data into Concelho table
INSERT INTO concelho (nome_concelho, id_distrito) VALUES 
('Barcelos',1);

select * from concelho

-- Inserting data into Freguesia table
INSERT INTO freguesia (nome_freguesia, id_concelho) VALUES
    ('Vila nova de sande', 1);
	
select * from freguesia

-- Inserting data into Medico table
INSERT INTO medico (nome, especialidade) VALUES
    ('Joaquim Alfredo', 'neurologia');
delete from medico
select * from medico

-- Inserting data into Enfermeiro table
INSERT INTO enfermeiro (nome) VALUES
    ('Pinto da Costa'),
    ('Bruno de Carvalho'),
    ('Sérgio Conceição');
	
select * from enfermeiro


INSERT INTO public.usf(
	id_usf, nome_usf, id_concelho, id_distrito, id_freguesia)
	VALUES (1,'USF Ara de trajano');

-- Inserting data into USFMedico table
INSERT INTO usfmedico (id_usf, id_medico) VALUES
    (1, 1),
    (2, 2);
select * from usfmedico


-- Inserting data into USFEnfermeiro table
INSERT INTO usfenfermeiro (id_usf, id_enfermeiro) VALUES
    (1, 1),
    (2, 2);

select * from usfenfermeiro

CREATE TABLE UtenteMorada (
    id_UtenteMorada SERIAl PRIMARY KEY,
    id_utente INT,
    id_morada INT,
    FOREIGN KEY (id_utente) REFERENCES utente(id_utente),
    FOREIGN KEY (id_morada) REFERENCES morada(id_morada)
);

INSERT INTO public.morada( rua, codigo_postal, freguesia, concelho, distrito)
	VALUES ('Rua bento ribeiro', '4805-085', 'Caldelas','Guimarães', 'Braga');
select * from morada
	
INSERT INTO public.utente (nome, numero_telemovel, email, data_nascimento, nif, numero_utente, numero_cc, validade_cc)
VALUES ('João Duarte', '915599842', 'joaopauloduarte2001@gmail.com', '2001-07-27', '254263828', '321345324', '20483277', '2026-05-16');

select * from utente

insert into UtenteMorada(id_utente,id_morada) values
(1,1)

select  * from UtenteMorada

INSERT INTO public.usfutente(
	id_usf, id_utente, id_medico, id_enfermeiro)
	VALUES (1, 1, 1, 1);
	
select * from usfUtente

INSERT INTO public.localidadesusf(id_freguesia, id_concelho, id_distrito, id_usf)
	VALUES (1, 1, 1, 1),(3,1,1,1);
	
select * from localidadesusf
