-- tabelas sem dependências diretas.

-- tabela da escola 
CREATE TABLE schools (
    id_school SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    updated_at TIMESTAMP DEFAULT now() NOT NULL,
    deleted_at TIMESTAMP
);

-- tabela dos patrocinadores 
CREATE TABLE sponsors (
    id_sponsor SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT now() NOT NULL,
    deleted_at TIMESTAMP
);

-- tabela de visitantes e participantes dos eventos 
CREATE TABLE visitors (
    id_visitor SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    phone VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT now() NOT NULL,
    deleted_at TIMESTAMP
);

-- tabela de papeis de usuários
CREATE TABLE roles (
    id_role SERIAL PRIMARY KEY,
    nome_role VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    updated_at TIMESTAMP DEFAULT now() NOT NULL,
    deleted_at TIMESTAMP
);

-- tabela de recursos do sistema - usuário, events, etc.
CREATE TABLE resources (
    id_recurso SERIAL PRIMARY KEY,
    nome_recurso VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    updated_at TIMESTAMP DEFAULT now() NOT NULL,
    deleted_at TIMESTAMP
);

-- tabela de eventos do museu

CREATE TABLE events (
    id_event SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    all_day BOOLEAN DEFAULT false,
    location VARCHAR(100),
    color VARCHAR(30) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,
    start_time VARCHAR(5),
    duration_minutes INT,
    max_capacity INT
);

-- tabela dos representantes das escolas 

CREATE TABLE school_representatives (
    id_representative SERIAL PRIMARY KEY,
    id_school INTEGER REFERENCES schools(id_school) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT now() NOT NULL,
    deleted_at TIMESTAMP
);

-- tabela dos participantes dos eventos 

CREATE TABLE event_bookings (
    id_booking SERIAL PRIMARY KEY,
    id_event INTEGER NOT NULL REFERENCES events(id_event) ON DELETE CASCADE,
    id_representative INTEGER REFERENCES school_representatives(id_representative),
    id_visitor INTEGER REFERENCES visitors(id_visitor),
    expected_participant_count INTEGER DEFAULT 1 NOT NULL,
    booking_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT now() NOT NULL,
    deleted_at TIMESTAMP,
    CONSTRAINT check_booking_origin CHECK (
        (id_representative IS NOT NULL AND id_visitor IS NULL) OR
        (id_representative IS NULL AND id_visitor IS NOT NULL)
    )
);

-- tabela de estudantes 

CREATE TABLE students (
    id_student SERIAL PRIMARY KEY,
    id_booking INTEGER REFERENCES event_bookings(id_booking) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    attended BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT now() NOT NULL,
    deleted_at TIMESTAMP
);

-- tabela relação de patrocinadores do evento 

CREATE TABLE event_sponsors_relation (
    id_event INTEGER REFERENCES events(id_event) ON DELETE CASCADE,
    id_sponsor INTEGER REFERENCES sponsors(id_sponsor) ON DELETE CASCADE,
    PRIMARY KEY (id_event, id_sponsor)
);

-- tabela de usuários 

CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    firstname VARCHAR(150) NOT NULL,
    lastname VARCHAR(150) NOT NULL,
    username VARCHAR(150) NOT NULL,
    active BOOLEAN DEFAULT false NOT NULL,
    image_path VARCHAR(255),
    emailverified BOOLEAN DEFAULT false,
    istwofactorauthenticationenabled BOOLEAN DEFAULT false,
    currenthashedrefreshtoken VARCHAR(255),
    mfa_code TEXT,
    mfa_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    updated_at TIMESTAMP DEFAULT now() NOT NULL,
    deleted_at TIMESTAMP
);

-- tabela de credenciais 

-- public.credentials definição

-- Drop table

-- DROP TABLE public.credentials;

CREATE TABLE public.credentials (
	id_credentials serial4 NOT NULL,
	id_usuario int4 NOT NULL,
	email varchar(150) NOT NULL,
	"password" varchar(255) NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	deleted_at timestamp NULL,
	CONSTRAINT credentials_email_key UNIQUE (email),
	CONSTRAINT credentials_pkey PRIMARY KEY (id_credentials),
	CONSTRAINT credentials_usuario_id_key UNIQUE (id_usuario)
);


ALTER TABLE public.credentials ADD CONSTRAINT 
  fk_credentials_usuario FOREIGN KEY (id_usuario) 
  REFERENCES public.usuario(id_usuario) ON DELETE CASCADE;

-- tabela de usuários X roles 

CREATE TABLE usuario_roles (
    usuario_id INT REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    role_id INT REFERENCES roles(id_role) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    updated_at TIMESTAMP DEFAULT now() NOT NULL,
    deleted_at TIMESTAMP,
    PRIMARY KEY (usuario_id, role_id)
);

-- tabela de roles X permissions

CREATE TABLE permissions (
    id_permissions SERIAL PRIMARY KEY,
    role_id INT NOT NULL REFERENCES roles(id_role) ON DELETE CASCADE,
    recurso_id INT NOT NULL REFERENCES resources(id_recurso) ON DELETE CASCADE,
    action VARCHAR(20) NOT NULL,
    possession VARCHAR(10) DEFAULT 'any',
    attributes VARCHAR(10) DEFAULT '*',
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    updated_at TIMESTAMP DEFAULT now() NOT NULL,
    deleted_at TIMESTAMP
);

-- tabela de accounts - acesso via providers - google, x, github, facebooks, etc.
CREATE TABLE account (
    id_account UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_usuario INT NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    provider_id INT NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    access_token_expires_at TIMESTAMP,
    refresh_token_expires_at TIMESTAMP,
    scope VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- tabela de sessões - verificar quais usuários estão conectados. 

CREATE TABLE session (
    id_session SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT
);

-- tabela de contato - 

CREATE TABLE contact (
    id_contact SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    agreed_to_privacy BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);