
CREATE SEQUENCE utente_id_sequence START WITH 1 INCREMENT BY 1 NO MAXVALUE NO CYCLE;

CREATE SEQUENCE morada_id_sequence START WITH 1 INCREMENT BY 1 NO MAXVALUE NO CYCLE;

CREATE SEQUENCE usf_id_sequence START WITH 1 INCREMENT BY 1 NO MAXVALUE NO CYCLE;

CREATE SEQUENCE medico_id_sequence START WITH 1 INCREMENT BY 1 NO MAXVALUE NO CYCLE;

CREATE SEQUENCE enfermeiro_id_sequence START WITH 1 INCREMENT BY 1 NO MAXVALUE NO CYCLE;

create sequence distrito_id_sequence start with 1 increment by 1 no maxvalue no cycle;

create sequence concelho_id_sequence start with 1 increment by 1 no maxvalue no cycle;

create sequence freguesia_id_sequence start with 1 increment by 1 no maxvalue no cycle;


CREATE TABLE Utente (
    id_utente INT DEFAULT nextval('utente_id_sequence') PRIMARY KEY,
    nome VARCHAR(255) not null,
    numero_telemovel VARCHAR(20),
    email VARCHAR(255),
    data_nascimento DATE not null,
    nif VARCHAR(20) not null unique,
    numero_utente VARCHAR(20) not null unique,
    numero_cc VARCHAR(20) not null unique,
    validade_cc DATE not null

);


CREATE TABLE Morada (
    id_morada INT DEFAULT nextval('morada_id_sequence') PRIMARY KEY,
    id_utente INT,
    rua VARCHAR(255) not null,
    codigo_postal VARCHAR(20)  not null,
    freguesia VARCHAR(255) not null,
    concelho VARCHAR(255) not null,
    distrito VARCHAR(255) not null,
    FOREIGN KEY (id_utente) REFERENCES Utente(id_utente)
);

create table freguesia (
    id_freguesia  int default nextval('freguesia_id_sequence'::regclass) primary key,
    nome_freguesia varchar(255) not null,
    id_concelho int,
    foreign key (id_concelho) references concelho(id_concelho)
);

create table concelho (
    id_concelho int default nextval('concelho_id_sequence'::regclass) primary key,
    nome_concelho varchar(255) not null,
    id_distrito int,
    foreign key (id_distrito) references distrito(id_distrito)

);

create table distrito (
    id_distrito int default nextval('distrito_id_sequence'::regclass) primary key,
    nome_distrito varchar(255) not null
);


CREATE TABLE USF (
    id_usf INT DEFAULT nextval('usf_id_sequence') PRIMARY KEY,
    nome_usf VARCHAR(100) 
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
    id_usf INT,
    id_utente INT,
    id_medico INT,
    id_enfermeiro INT,
    PRIMARY KEY (id_usf, id_utente),
    FOREIGN KEY (id_usf) REFERENCES USF(id_usf),
    FOREIGN KEY (id_utente) REFERENCES Utente(id_utente),
    FOREIGN KEY (id_medico) REFERENCES Medico(id_medico),
    FOREIGN KEY (id_enfermeiro) REFERENCES Enfermeiro(id_enfermeiro),
    FOREIGN KEY (id_usf, id_medico) REFERENCES USFMedico(id_usf, id_medico),
    FOREIGN KEY (id_usf, id_enfermeiro) REFERENCES USFEnfermeiro(id_usf, id_enfermeiro)
);


-- Inserting data into Distrito table
INSERT INTO distrito (nome_distrito) VALUES
    ('Distrito 1'),
    ('Distrito 2'),
    ('Distrito 3');

-- Inserting data into Concelho table
INSERT INTO concelho (nome_concelho, id_distrito) VALUES
    ('Concelho 1', 1),
    ('Concelho 2', 1),
    ('Concelho 3', 2),
    ('Concelho 4', 2),
    ('Concelho 5', 3);

-- Inserting data into USF table
INSERT INTO usf (nome_usf) VALUES
    ('USF A'),
    ('USF B'),
    ('USF C');

-- Inserting data into Freguesia table
INSERT INTO freguesia (nome_freguesia, id_concelho) VALUES
    ('Freguesia 1', 1),
    ('Freguesia 2', 1),
    ('Freguesia 3', 2),
    ('Freguesia 4', 3),
    ('Freguesia 5', 3);

-- Inserting data into Medico table
INSERT INTO medico (nome, especialidade) VALUES
    ('Dr. Medico 1', 'Cardiologia'),
    ('Dr. Medico 2', 'Pediatria'),
    ('Dr. Medico 3', 'Ginecologia');

-- Inserting data into Enfermeiro table
INSERT INTO enfermeiro (nome) VALUES
    ('Enfermeiro 1'),
    ('Enfermeiro 2'),
    ('Enfermeiro 3');

-- Inserting data into USFMedico table
INSERT INTO usfmedico (id_usf, id_medico) VALUES
    (1, 1),
    (2, 2),
    (3, 3);

-- Inserting data into USFEnfermeiro table
INSERT INTO usfenfermeiro (id_usf, id_enfermeiro) VALUES
    (1, 1),
    (2, 2),
    (3, 3);
