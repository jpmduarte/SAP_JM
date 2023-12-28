create sequence seq_id_perfil start 1  increment 1;


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
    user_role int not null references perfis(id_perfil),
    email varchar(100) not null,
    password varchar(255) not null 
);

INSERT INTO users (id_user, user_role, email, password)
VALUES (
    DEFAULT,
    1, 
    'admin@admin.pt',
    SHA256('admin')
);

select * from users

create sequence seq_id_utentes start 1 increment 1;

create sequence seq_id_medicos start 1 increment 1;

create table utentes(
	id_utente bigint default nextval('seq_id_utentes'::regclass) primary key,
	id_user_utente bigint not null references users(id_user),
	nome varchar(100) not null,
	telemovel bigint,
	nif bigint not null,
	numero_utente bigint not null,
	data_nascimento date not null
);

create table medicos(
	id_medico bigint default nextval('seq_id_medicos'::regclass) primary key,
	id_user_medico bigint not null references users(id_user),
	nome varchar(100) not null,
	numero_cedula bigint not null,
	data_nascimento date not null
);


