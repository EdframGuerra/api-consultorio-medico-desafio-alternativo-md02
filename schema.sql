create database consultorio_medico;

create table medicos(
  id serial primary key,
  nome text,
  especialidade text
);

create table consultas(
  id serial primary key,
  tipo_consulta text,
  medico_id int,
  finalizada boolean default false,
  valor_consulta int,
  paciente text
);


create table pacientes(
  id serial primary key,
  nome text,
  cpf text unique,
  data_nascimento text,
  celular text,
  email text,
  senha text
);



create table consulta_finalizada(
  id serial primary key,
  tipo_consulta text,
  medico_id int,
  finalizada boolean default false,
  laudo_id int,
  valor_consulta int,
  paciente_id int  
);

create table laudo(
  id serial primary key,
  consulta_id int,
  medico_id int,
  laudo text,
  paciente_id int
);