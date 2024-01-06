create sequence seq_id_perfil start 1  increment 1;
create sequence seq_id_user start 1 increment 1;
create sequence seq_id_utentes start 1 increment 1;
create sequence seq_id_medicos start 1 increment 1;


create table perfis(
id_perfil  bigint DEFAULT nextval('seq_id_perfil'::regclass) NOT NULL primary key,
nome varchar(50) not null
);

insert into perfis(nome) values ('admin');
insert into perfis(nome) values ('utente');
insert into perfis(nome) values ('medico');


create sequence seq_id_user start 1 increment 1;

create table users (
    id_user bigint default nextval('seq_id_user'::regclass) not null primary key,
    id_perfil int not null references perfis(id_perfil),
    email varchar(100) not null,
    password varchar(255) not null 
);


create table utentes(
	id_utente bigint default nextval('seq_id_utentes'::regclass) primary key,
	id_user_utente bigint not null references users(id_user),
	numero_utente bigint not null
);

create table medicos(
	id_medico bigint default nextval('seq_id_medicos'::regclass) primary key,
	id_user_medico bigint not null references users(id_user),
	nome varchar(100) not null,
	numero_cedula bigint not null,
	data_nascimento date not null
);



create table USF(
	id_USF serial primary key,
	nomeUSF varchar(100) not null
)

create table medicoUSF(
	id_medicoUSF serial primary key,
	id_medico int not null,
	id_USF int not null,
	foreign key (id_medico) references medicos(id_medico),
	foreign key (id_USF) references USF(id_USF)
)

create table utenteUSF(
	id_utenteUSF serial primary key,
	id_utente int not null,
	id_USF int not null,
	foreign key (id_utente) references utentes(id_utente),
	foreign key (id_USF) references USF(id_USF)
)



create table pedido_primeira_avaliacao(
	id_pedido serial primary key,
	id_utente int not null,
	id_medico int not null,
	estado int not null,
	descricao varchar(255) default null,
	foreign key (id_utente) references utentes(id_utente),
	foreign key (id_medico) references medicos(id_medico)
)


create table pedido_junta_medica(
	id_pedido serial primary key,
	id_utente int not null,
	id_medico int not null,
	estado int not null,
	descricao varchar(255) default null,
	foreign key (id_utente) references utentes(id_utente),
	foreign key (id_medico) references medicos(id_medico)
)

create table estado (
	id_estado serial primary key,
	nome_estado varchar(100) not null
)

insert into estado(nome_estado) values ('pendente');
insert into estado(nome_estado) values ('aceite');
insert into estado(nome_estado) values ('recusado');


CREATE TABLE pedido_primeira_avaliacao (
    id_pedido SERIAL PRIMARY KEY,
    id_utente INT NOT NULL,
    id_medico INT NOT NULL,
    estado VARCHAR(255) NOT NULL,
    descricao VARCHAR(255),
    nome_completo VARCHAR(255) NOT NULL,
    data_nascimento DATE NOT NULL,
    n_identificacao VARCHAR(255) NOT NULL,
    n_utente_saude VARCHAR(255) NOT NULL,
    nif VARCHAR(255) NOT NULL,
    data_validade DATE,
    rua VARCHAR(255) NOT NULL,
    codigo_postal VARCHAR(255) NOT NULL,
    localidade VARCHAR(255) NOT NULL,
    concelho VARCHAR(255) NOT NULL,
    distrito VARCHAR(255) NOT NULL,
    telemovel VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    multiuso BOOLEAN,
    importacao_veiculo BOOLEAN,
    submissao_reavaliacao BOOLEAN,
    data_submissao_reavaliacao DATE,
    
    CONSTRAINT check_multiuso_importacao CHECK (
        (multiuso IS NULL OR multiuso = FALSE) OR
        (importacao_veiculo IS NULL OR importacao_veiculo = FALSE)
    )
);


CREATE TABLE documentos (
    id_documento SERIAL PRIMARY KEY,
    nome_arquivo VARCHAR(255) NOT NULL,
    conteudo BYTEA,  
    data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pedido_documentos (
    id_pedido_documento SERIAL PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_documento INT NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedido_primeira_avaliacao(id_pedido),
    FOREIGN KEY (id_documento) REFERENCES documentos(id_documento)
);