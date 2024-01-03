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
    id_utente INT,
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



INSERT INTO distrito (nome_distrito) VALUES
    ('Braga'),
    ('Porto'),
    ('Vila Real');


INSERT INTO concelho (nome_concelho, id_distrito) VALUES
    ('Guimarães', 1),
    ('Vila Verde', 1),
    ('Vila Nova de Famalicão', 1);


INSERT INTO freguesia (nome_freguesia, id_concelho) VALUES
    ('Caldelas', 1),
    ('Portela das Cabras', 2),
    ('Sande São Clemente', 1),
    ('Freiriz', 2);


INSERT INTO medico (nome, especialidade) VALUES
    ('Frederico Varandas', 'Cardiologia'),
    ('Jorge Jesus', 'Pediatria'),
    ('Jesualdo Ferreira', 'Ginecologia');


INSERT INTO enfermeiro (nome) VALUES
    ('Pinto da Costa'),
    ('Bruno de Carvalho'),
    ('Sérgio Conceição');


INSERT INTO usfmedico (id_usf, id_medico) VALUES
    (1, 1),
    (2, 2),
    (3, 3);


INSERT INTO usfenfermeiro (id_usf, id_enfermeiro) VALUES
    (1, 1),
    (2, 2),
    (3, 3);
