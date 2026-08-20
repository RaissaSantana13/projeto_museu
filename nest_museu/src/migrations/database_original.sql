CREATE TABLE "user" (
    id_user SERIAL PRIMARY KEY,
    firstname VARCHAR(150) NOT NULL,
    lastname VARCHAR(150) NOT NULL,
    username VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20),
    active BOOLEAN DEFAULT false NOT NULL,
    image_path VARCHAR(255),
    emailverified BOOLEAN DEFAULT false,
    istwofactorauthenticationenabled BOOLEAN DEFAULT false,
    currenthashedrefreshtoken VARCHAR(255),
    mfa_code TEXT,
    mfa_expires_at TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE credentials (
    id_credentials SERIAL PRIMARY KEY,
    id_user INTEGER NOT NULL UNIQUE REFERENCES "user"(id_user) ON DELETE CASCADE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE account (
    id_account UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_user INTEGER NOT NULL REFERENCES "user"(id_user) ON DELETE CASCADE,
    provider_id VARCHAR(50) NOT NULL, -- ex: 'google', 'github'
    access_token TEXT,
    refresh_token TEXT,
    access_token_expires_at TIMESTAMP,
    refresh_token_expires_at TIMESTAMP,
    scope VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE session (
    id_session SERIAL PRIMARY KEY,
    id_user INTEGER NOT NULL REFERENCES "user"(id_user) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT
);

CREATE TABLE roles (
    id_role SERIAL PRIMARY KEY,
    nome_role VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE resources (
    id_recurso SERIAL PRIMARY KEY,
    nome_recurso VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE user_roles (
    id_user INTEGER REFERENCES "user"(id_user) ON DELETE CASCADE,
    id_role INTEGER REFERENCES roles(id_roles) ON DELETE CASCADE,
    PRIMARY KEY (id_user, id_role)
);

CREATE TABLE permissions (
    id_permission SERIAL PRIMARY KEY,
    id_role INTEGER NOT NULL REFERENCES roles(id_roles) ON DELETE CASCADE,
    id_recurso INTEGER NOT NULL REFERENCES resources(id_recurso) ON DELETE CASCADE,
    action VARCHAR(20) NOT NULL, 
    possession VARCHAR(10) DEFAULT 'any',
    attributes VARCHAR(10) DEFAULT '*',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE schools (
    id_school SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE colaborators (
    id_colaborator SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE school_representatives (
    id_representative SERIAL PRIMARY KEY,
    id_school INTEGER NOT NULL REFERENCES schools(id_school) ON DELETE CASCADE,
    id_user INTEGER NOT NULL UNIQUE REFERENCES "user"(id_user) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE events (
    id_event SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    location VARCHAR(100),
    max_capacity INTEGER,
    color VARCHAR(30) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

--remover
CREATE TABLE visitors (
    id_visitor SERIAL PRIMARY KEY,
    firstname VARCHAR(150) NOT NULL,
    lastname VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT now()
);

create TABLE school_groups (
    id_group SERIAL PRIMARY KEY,
    id_school INTEGER NOT NULL REFERENCES schools(id_school) ON DELETE CASCADE,
    id_representative INTEGER REFERENCES school_representatives(id_representative) ON DELETE SET NULL,
    group_name VARCHAR(150) NOT NULL,
    total_students INTEGER NOT NULL DEFAULT 0,
    student_list JSONB, -- Lista estática de alunos (ex: nomes e idades)
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE event_bookings (
    id_booking SERIAL PRIMARY KEY,
    id_event INTEGER NOT NULL REFERENCES events(id_event) ON DELETE CASCADE,
    id_visitor INTEGER REFERENCES visitors(id_visitor) ON DELETE CASCADE,
    id_user INTEGER REFERENCES "user"(id_user) ON DELETE CASCADE,
    id_group INTEGER REFERENCES school_groups(id_group) ON DELETE CASCADE,
    expected_participant_count INTEGER DEFAULT 1 NOT NULL,
    booking_date TIMESTAMPTZ DEFAULT now(),
    status VARCHAR(20) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    CONSTRAINT check_booking_origin CHECK (
        (id_visitor IS NOT NULL AND id_user IS NULL AND id_group IS NULL) OR
        (id_user IS NOT NULL AND id_visitor IS NULL AND id_group IS NULL) OR
        (id_group IS NOT NULL AND id_visitor IS NULL AND id_user IS NULL)
    )
);

CREATE TABLE event_booking_groups (
    id_booking INTEGER NOT NULL REFERENCES event_bookings(id_booking) ON DELETE CASCADE,
    id_group INTEGER NOT NULL REFERENCES school_groups(id_group) ON DELETE CASCADE,
    attending_students JSONB NOT NULL DEFAULT '[]'::jsonb
    PRIMARY KEY (id_booking, id_group)
);

CREATE TABLE event_colaborator_relation (
    id_event INTEGER REFERENCES events(id_event) ON DELETE CASCADE,
    id_colaborator INTEGER REFERENCES colaborators(id_colaborator) ON DELETE CASCADE,
    PRIMARY KEY (id_event, id_colaborator)
);

CREATE TABLE contact (
    id_contact SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    agreed_to_privacy BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

create type shape as enum('square', 'rectangle');
create table images (
	id_img SERIAL primary key,
	title VARCHAR(255) NOT NULL,
  	description TEXT,
	form shape,
  	is_cover bool,
  	is_front bool,
  	url_img TEXT
);

CREATE TABLE works (
   id_work SERIAL PRIMARY KEY,
   title VARCHAR(255) NOT NULL,
   artist VARCHAR(255) NOT NULL,
   creation_year INT,
   description TEXT,
   dimensions VARCHAR(100),
   type VARCHAR(100),
   category VARCHAR(100),
   location VARCHAR(150),
   id_img INTEGER references images(id_img) ON DELETE CASCADE,
   has_3D bool,
   url_3D TEXT,
   status VARCHAR(50) DEFAULT 'disponivel',
   created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT now() NOT NULL,
   deleted_at TIMESTAMP
);

create table prints (
	id_print SERIAL primary key,
	title VARCHAR(255) NOT NULL,
  	description TEXT,
  	url_print TEXT
);

CREATE TABLE documents (
   id_doc SERIAL PRIMARY KEY,
   title VARCHAR(255) NOT NULL,
   origin VARCHAR(255) NOT NULL,
   creation_year INT,
   description TEXT,
   dimensions VARCHAR(100),
   type VARCHAR(100),
   category VARCHAR(100),
   location VARCHAR(150),
   id_print INTEGER references prints(id_print) ON DELETE CASCADE,
   status VARCHAR(50) DEFAULT 'disponivel',
   created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT now() NOT NULL,
   deleted_at TIMESTAMP
);

create table img_spotlight (
	id_img_spotlight SERIAL primary key,
	id_img INTEGER references images(id_img) ON DELETE CASCADE,
	start_date TIMESTAMPTZ, 
	end_date TIMESTAMPTZ
);

create table event_spotlight (
	id_event_spotlight SERIAL primary key,
	id_event INTEGER references events(id_event) ON DELETE CASCADE,
	start_date TIMESTAMPTZ, 
	end_date TIMESTAMPTZ
);

-- 20/08/2026 - criação da tabela estudantes e seus relacionamentos
alter table school_groups drop column student_list;

create table student (
    id_student SERIAL primary key,
    full_name VARCHAR(300) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100) NOT NULL,
    identification VARCHAR(14) NOT NULL
);

create TABLE students_in_group (
    id_student INTEGER REFERENCES student(id_student) ON DELETE CASCADE,
    id_group INTEGER REFERENCES school_groups(id_group) ON DELETE CASCADE,
    PRIMARY KEY (id_student, id_group)
);