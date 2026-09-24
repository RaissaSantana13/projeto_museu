-- Baseline anterior à IndependentMedia, derivada do DDL fornecido em 24/09/2026.
-- Não executar manualmente; __SCHEMA__ é substituído pela migration.
CREATE TYPE __SCHEMA__."shape" AS ENUM (
	'square',
	'rectangle');

CREATE TYPE __SCHEMA__."works_status_enum" AS ENUM (
	'em_exibicao',
	'no_acervo',
	'em_restauracao',
	'aguardando_restauracao',
	'inativa');

CREATE TABLE __SCHEMA__.colaborators (
	id_colaborator serial4 NOT NULL,
	"name" varchar(150) NOT NULL,
	logo_url text NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	deleted_at timestamptz NULL,
	CONSTRAINT colaborators_pkey PRIMARY KEY (id_colaborator)
);

CREATE TABLE __SCHEMA__.contact (
	id_contact serial4 NOT NULL,
	first_name varchar(100) NOT NULL,
	last_name varchar(100) NOT NULL,
	phone varchar(50) NOT NULL,
	email varchar(100) NOT NULL,
	message text NOT NULL,
	agreed_to_privacy bool DEFAULT false NOT NULL,
	created_at timestamptz DEFAULT now() NULL,
	CONSTRAINT contact_pkey PRIMARY KEY (id_contact)
);

CREATE TABLE __SCHEMA__.events (
	id_event serial4 NOT NULL,
	title text NOT NULL,
	description text NULL,
	start_date timestamptz NOT NULL,
	end_date timestamptz NOT NULL,
	"location" varchar(100) NULL,
	max_capacity int4 NULL,
	color varchar(30) NOT NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	deleted_at timestamptz NULL,
	CONSTRAINT events_pkey PRIMARY KEY (id_event)
);

CREATE TABLE __SCHEMA__.images (
	id_img serial4 NOT NULL,
	title varchar(255) NOT NULL,
	description text NULL,
	form __SCHEMA__."shape" NULL,
	is_cover bool NULL,
	is_front bool NULL,
	url_img text NULL,
	CONSTRAINT images_pkey PRIMARY KEY (id_img)
);

CREATE TABLE __SCHEMA__.prints (
	id_print serial4 NOT NULL,
	title varchar(255) NOT NULL,
	description text NULL,
	url_print text NULL,
	CONSTRAINT prints_pkey PRIMARY KEY (id_print)
);

CREATE TABLE __SCHEMA__.resources (
	id_recurso serial4 NOT NULL,
	nome_recurso varchar(50) NOT NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	deleted_at timestamptz NULL,
	CONSTRAINT resources_nome_recurso_key UNIQUE (nome_recurso),
	CONSTRAINT resources_pkey PRIMARY KEY (id_recurso)
);

CREATE TABLE __SCHEMA__.roles (
	id_role serial4 NOT NULL,
	nome_role varchar(50) NOT NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	deleted_at timestamptz NULL,
	CONSTRAINT roles_nome_role_key UNIQUE (nome_role),
	CONSTRAINT roles_pkey PRIMARY KEY (id_role)
);

CREATE TABLE __SCHEMA__.schools (
	id_school serial4 NOT NULL,
	"name" varchar(255) NOT NULL,
	cnpj varchar(18) NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	deleted_at timestamptz NULL,
	CONSTRAINT schools_cnpj_key UNIQUE (cnpj),
	CONSTRAINT schools_pkey PRIMARY KEY (id_school)
);

CREATE TABLE __SCHEMA__.student (
	id_student serial4 NOT NULL,
	full_name varchar(300) NOT NULL,
	phone varchar(20) NULL,
	email varchar(100) NOT NULL,
	identification varchar(14) NOT NULL,
	CONSTRAINT student_pkey PRIMARY KEY (id_student)
);

CREATE TABLE __SCHEMA__."user" (
	id_user serial4 NOT NULL,
	firstname varchar(150) NOT NULL,
	lastname varchar(150) NOT NULL,
	username varchar(150) NOT NULL,
	phone varchar(20) NULL,
	active bool DEFAULT false NOT NULL,
	image_path varchar(255) NULL,
	emailverified bool DEFAULT false NULL,
	istwofactorauthenticationenabled bool DEFAULT false NULL,
	currenthashedrefreshtoken varchar(255) NULL,
	mfa_code text NULL,
	mfa_expires_at timestamp NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	deleted_at timestamptz NULL,
	CONSTRAINT user_pkey PRIMARY KEY (id_user),
	CONSTRAINT user_username_key UNIQUE (username)
);

CREATE TABLE __SCHEMA__.visitors (
	id_visitor serial4 NOT NULL,
	firstname varchar(150) NOT NULL,
	lastname varchar(150) NOT NULL,
	email varchar(150) NOT NULL,
	phone varchar(20) NULL,
	created_at timestamptz DEFAULT now() NULL,
	CONSTRAINT visitors_email_key UNIQUE (email),
	CONSTRAINT visitors_pkey PRIMARY KEY (id_visitor)
);

CREATE TABLE __SCHEMA__.works (
	id_artwork serial4 NOT NULL,
	title varchar(255) NOT NULL,
	"type" varchar(100) NOT NULL,
	artist_name varchar(255) DEFAULT 'Autor Desconhecido'::character varying NOT NULL,
	creation_year int2 NULL,
	description text NULL,
	technique varchar(255) NULL,
	height numeric(10, 2) NULL,
	width numeric(10, 2) NULL,
	"depth" numeric(10, 2) NULL,
	dimension_unit varchar(10) DEFAULT 'cm'::character varying NOT NULL,
	acquisition_date date NULL,
	acquisition_method varchar(100) NULL,
	"status" __SCHEMA__."works_status_enum" DEFAULT 'em_exibicao'::__SCHEMA__.works_status_enum NOT NULL,
	"location" varchar(255) NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	deleted_at timestamp NULL,
	CONSTRAINT works_pkey PRIMARY KEY (id_artwork)
);
CREATE INDEX idx_works_status ON __SCHEMA__.works USING btree (status);

CREATE TABLE __SCHEMA__.account (
	id_account uuid DEFAULT gen_random_uuid() NOT NULL,
	id_user int4 NOT NULL,
	account_id text NULL,
	provider_id varchar(50) NOT NULL,
	access_token text NULL,
	refresh_token text NULL,
	access_token_expires_at timestamp NULL,
	refresh_token_expires_at timestamp NULL,
	"scope" varchar(255) NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	deleted_at timestamptz NULL,
	CONSTRAINT account_pkey PRIMARY KEY (id_account),
	CONSTRAINT account_id_user_fkey FOREIGN KEY (id_user) REFERENCES __SCHEMA__."user"(id_user) ON DELETE CASCADE
);

CREATE TABLE __SCHEMA__.artwork_media (
	id_media serial4 NOT NULL,
	id_artwork int4 NOT NULL,
	media_type varchar(20) NOT NULL,
	url text NULL,
	is_main bool DEFAULT false NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	deleted_at timestamp NULL,
	file_data bytea NULL,	CONSTRAINT artwork_media_pkey PRIMARY KEY (id_media),
	CONSTRAINT fk_artwork_media_artwork FOREIGN KEY (id_artwork) REFERENCES __SCHEMA__.works(id_artwork) ON DELETE CASCADE
);
CREATE INDEX idx_artwork_media_id_artwork ON __SCHEMA__.artwork_media USING btree (id_artwork);
CREATE INDEX idx_artwork_media_media_type ON __SCHEMA__.artwork_media USING btree (media_type);

CREATE TABLE __SCHEMA__.credentials (
	id_credentials serial4 NOT NULL,
	id_user int4 NOT NULL,
	email varchar(150) NOT NULL,
	"password" varchar(255) NOT NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	deleted_at timestamptz NULL,
	CONSTRAINT credentials_email_key UNIQUE (email),
	CONSTRAINT credentials_id_user_key UNIQUE (id_user),
	CONSTRAINT credentials_pkey PRIMARY KEY (id_credentials),
	CONSTRAINT credentials_id_user_fkey FOREIGN KEY (id_user) REFERENCES __SCHEMA__."user"(id_user) ON DELETE CASCADE
);

CREATE TABLE __SCHEMA__.event_colaborator_relation (
	id_event int4 NOT NULL,
	id_colaborator int4 NOT NULL,
	CONSTRAINT event_colaborator_relation_pkey PRIMARY KEY (id_event, id_colaborator),
	CONSTRAINT event_colaborator_relation_id_colaborator_fkey FOREIGN KEY (id_colaborator) REFERENCES __SCHEMA__.colaborators(id_colaborator) ON DELETE CASCADE,
	CONSTRAINT event_colaborator_relation_id_event_fkey FOREIGN KEY (id_event) REFERENCES __SCHEMA__.events(id_event) ON DELETE CASCADE
);

CREATE TABLE __SCHEMA__.event_spotlight (
	id_event_spotlight serial4 NOT NULL,
	id_event int4 NULL,
	start_date timestamptz NULL,
	end_date timestamptz NULL,
	CONSTRAINT event_spotlight_pkey PRIMARY KEY (id_event_spotlight),
	CONSTRAINT event_spotlight_id_event_fkey FOREIGN KEY (id_event) REFERENCES __SCHEMA__.events(id_event) ON DELETE CASCADE
);

CREATE TABLE __SCHEMA__.img_spotlight (
	id_img_spotlight serial4 NOT NULL,
	id_img int4 NULL,
	start_date timestamptz NULL,
	end_date timestamptz NULL,
	CONSTRAINT img_spotlight_pkey PRIMARY KEY (id_img_spotlight),
	CONSTRAINT img_spotlight_id_img_fkey FOREIGN KEY (id_img) REFERENCES __SCHEMA__.images(id_img) ON DELETE CASCADE
);

CREATE TABLE __SCHEMA__.permissions (
	id_permission serial4 NOT NULL,
	id_role int4 NOT NULL,
	id_recurso int4 NOT NULL,
	"action" varchar(20) NOT NULL,
	possession varchar(10) DEFAULT 'any'::character varying NULL,
	"attributes" varchar(10) DEFAULT '*'::character varying NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT permissions_pkey PRIMARY KEY (id_permission),
	CONSTRAINT permissions_id_recurso_fkey FOREIGN KEY (id_recurso) REFERENCES __SCHEMA__.resources(id_recurso) ON DELETE CASCADE,
	CONSTRAINT permissions_id_role_fkey FOREIGN KEY (id_role) REFERENCES __SCHEMA__.roles(id_role) ON DELETE CASCADE
);

CREATE TABLE __SCHEMA__.school_representatives (
	id_representative serial4 NOT NULL,
	id_school int4 NOT NULL,
	id_user int4 NOT NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	deleted_at timestamptz NULL,
	CONSTRAINT school_representatives_id_user_key UNIQUE (id_user),
	CONSTRAINT school_representatives_pkey PRIMARY KEY (id_representative),
	CONSTRAINT school_representatives_id_school_fkey FOREIGN KEY (id_school) REFERENCES __SCHEMA__.schools(id_school) ON DELETE CASCADE,
	CONSTRAINT school_representatives_id_user_fkey FOREIGN KEY (id_user) REFERENCES __SCHEMA__."user"(id_user) ON DELETE CASCADE
);

CREATE TABLE __SCHEMA__."session" (
	id_session serial4 NOT NULL,
	id_user int4 NOT NULL,
	"token" varchar(255) NOT NULL,
	expires_at timestamptz NOT NULL,
	ip_address varchar(45) NULL,
	user_agent text NULL,
	CONSTRAINT session_pkey PRIMARY KEY (id_session),
	CONSTRAINT session_token_key UNIQUE (token),
	CONSTRAINT session_id_user_fkey FOREIGN KEY (id_user) REFERENCES __SCHEMA__."user"(id_user) ON DELETE CASCADE
);

CREATE TABLE __SCHEMA__.user_roles (
	id_user int4 NOT NULL,
	id_role int4 NOT NULL,
	CONSTRAINT user_roles_pkey PRIMARY KEY (id_user, id_role),
	CONSTRAINT user_roles_id_role_fkey FOREIGN KEY (id_role) REFERENCES __SCHEMA__.roles(id_role) ON DELETE CASCADE,
	CONSTRAINT user_roles_id_user_fkey FOREIGN KEY (id_user) REFERENCES __SCHEMA__."user"(id_user) ON DELETE CASCADE
);

CREATE TABLE __SCHEMA__.school_groups (
	id_group serial4 NOT NULL,
	id_school int4 NOT NULL,
	id_representative int4 NULL,
	group_name varchar(150) NOT NULL,
	total_students int4 DEFAULT 0 NOT NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	deleted_at timestamptz NULL,
	CONSTRAINT school_groups_pkey PRIMARY KEY (id_group),
	CONSTRAINT school_groups_id_representative_fkey FOREIGN KEY (id_representative) REFERENCES __SCHEMA__.school_representatives(id_representative) ON DELETE SET NULL,
	CONSTRAINT school_groups_id_school_fkey FOREIGN KEY (id_school) REFERENCES __SCHEMA__.schools(id_school) ON DELETE CASCADE
);

CREATE TABLE __SCHEMA__.students_in_group (
	id_student int4 NOT NULL,
	id_group int4 NOT NULL,
	CONSTRAINT students_in_group_pkey PRIMARY KEY (id_student, id_group),
	CONSTRAINT students_in_group_id_group_fkey FOREIGN KEY (id_group) REFERENCES __SCHEMA__.school_groups(id_group) ON DELETE CASCADE,
	CONSTRAINT students_in_group_id_student_fkey FOREIGN KEY (id_student) REFERENCES __SCHEMA__.student(id_student) ON DELETE CASCADE
);

CREATE TABLE __SCHEMA__.event_bookings (
	id_booking serial4 NOT NULL,
	id_event int4 NOT NULL,
	id_visitor int4 NULL,
	id_user int4 NULL,
	id_group int4 NULL,
	expected_participant_count int4 DEFAULT 1 NOT NULL,
	booking_date timestamptz DEFAULT now() NULL,
	"status" varchar(20) DEFAULT 'pending'::character varying NULL,
	notes text NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	deleted_at timestamptz NULL,
	CONSTRAINT check_booking_origin CHECK ((((id_visitor IS NOT NULL) AND (id_user IS NULL) AND (id_group IS NULL)) OR ((id_user IS NOT NULL) AND (id_visitor IS NULL) AND (id_group IS NULL)) OR ((id_group IS NOT NULL) AND (id_visitor IS NULL) AND (id_user IS NULL)))),
	CONSTRAINT event_bookings_pkey PRIMARY KEY (id_booking),
	CONSTRAINT event_bookings_id_event_fkey FOREIGN KEY (id_event) REFERENCES __SCHEMA__.events(id_event) ON DELETE CASCADE,
	CONSTRAINT event_bookings_id_group_fkey FOREIGN KEY (id_group) REFERENCES __SCHEMA__.school_groups(id_group) ON DELETE CASCADE,
	CONSTRAINT event_bookings_id_user_fkey FOREIGN KEY (id_user) REFERENCES __SCHEMA__."user"(id_user) ON DELETE CASCADE,
	CONSTRAINT event_bookings_id_visitor_fkey FOREIGN KEY (id_visitor) REFERENCES __SCHEMA__.visitors(id_visitor) ON DELETE CASCADE
);

CREATE TABLE __SCHEMA__.event_booking_groups (
	id_booking int4 NOT NULL,
	id_group int4 NOT NULL,
	attending_students jsonb DEFAULT '[]'::jsonb NOT NULL,
	CONSTRAINT event_booking_groups_pkey PRIMARY KEY (id_booking, id_group),
	CONSTRAINT event_booking_groups_id_booking_fkey FOREIGN KEY (id_booking) REFERENCES __SCHEMA__.event_bookings(id_booking) ON DELETE CASCADE,
	CONSTRAINT event_booking_groups_id_group_fkey FOREIGN KEY (id_group) REFERENCES __SCHEMA__.school_groups(id_group) ON DELETE CASCADE
);

CREATE TABLE __SCHEMA__.documents (
	id_doc serial4 NOT NULL,
	title varchar(255) NOT NULL,
	origin varchar(255) NOT NULL,
	creation_year int4 NULL,
	description text NULL,
	dimensions varchar(100) NULL,
	"type" varchar(100) NULL,
	category varchar(100) NULL,
	"location" varchar(150) NULL,
	id_print int4 NULL,
	"status" varchar(50) DEFAULT 'disponivel'::character varying NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	deleted_at timestamp NULL,
	CONSTRAINT documents_pkey PRIMARY KEY (id_doc)
);

ALTER TABLE __SCHEMA__.documents ADD CONSTRAINT documents_id_print_fkey FOREIGN KEY (id_print) REFERENCES __SCHEMA__.prints(id_print) ON DELETE CASCADE;
