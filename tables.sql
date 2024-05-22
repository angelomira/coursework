-- Table: public.Checkbook

-- DROP TABLE IF EXISTS public."Checkbook";

CREATE TABLE IF NOT EXISTS public."Checkbook"
(
    id bigint NOT NULL DEFAULT nextval('"HistoryChecks_check_id_seq"'::regclass),
    id_operation bigint NOT NULL,
    date timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_dup boolean,
    is_gen boolean,
    CONSTRAINT "Checkbook_pkey" PRIMARY KEY (id),
    CONSTRAINT "Checkbook_fkey_id_operation" FOREIGN KEY (id_operation)
        REFERENCES public."Operabook" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Checkbook"
    OWNER to postgres;

-- Table: public.Fund

-- DROP TABLE IF EXISTS public."Fund";

CREATE TABLE IF NOT EXISTS public."Fund"
(
    id bigint NOT NULL DEFAULT nextval('"UserFund_fund_id_seq"'::regclass),
    curr_naming character varying(3) COLLATE pg_catalog."default" NOT NULL,
    curr_volume double precision NOT NULL,
    id_user bigint NOT NULL DEFAULT nextval('"UserFund_fund_userid_seq"'::regclass),
    CONSTRAINT "Fund_pkey" PRIMARY KEY (id),
    CONSTRAINT "Fund_fkey_id_user" FOREIGN KEY (id_user)
        REFERENCES public."User" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Fund"
    OWNER to postgres;

-- Table: public.Interaction

-- DROP TABLE IF EXISTS public."Interaction";

CREATE TABLE IF NOT EXISTS public."Interaction"
(
    id bigint NOT NULL DEFAULT nextval('"UserActivity_activity_id_seq"'::regclass),
    id_type bigint NOT NULL,
    id_user bigint NOT NULL,
    CONSTRAINT "Interaction_pkey" PRIMARY KEY (id),
    CONSTRAINT "Interaction_fkey_id_type" FOREIGN KEY (id_type)
        REFERENCES public."Type" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "Interaction_fkey_id_user" FOREIGN KEY (id_user)
        REFERENCES public."User" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Interaction"
    OWNER to postgres;

-- Table: public.Operabook

-- DROP TABLE IF EXISTS public."Operabook";

CREATE TABLE IF NOT EXISTS public."Operabook"
(
    id bigint NOT NULL DEFAULT nextval('"HistoryOperations_operation_id_seq"'::regclass),
    id_user bigint NOT NULL,
    result integer NOT NULL DEFAULT 0,
    status integer NOT NULL DEFAULT 0,
    curr text COLLATE pg_catalog."default",
    curr_sum double precision,
    date timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Operabook_pkey" PRIMARY KEY (id),
    CONSTRAINT "Operabook_fkey_id_user" FOREIGN KEY (id_user)
        REFERENCES public."User" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Operabook"
    OWNER to postgres;

-- Table: public.Role

-- DROP TABLE IF EXISTS public."Role";

CREATE TABLE IF NOT EXISTS public."Role"
(
    id bigint NOT NULL DEFAULT nextval('"Role_role_id_seq"'::regclass),
    naming text COLLATE pg_catalog."default" NOT NULL,
    access integer NOT NULL,
    CONSTRAINT "Role_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Role"
    OWNER to postgres;

-- Table: public.Type

-- DROP TABLE IF EXISTS public."Type";

CREATE TABLE IF NOT EXISTS public."Type"
(
    id bigint NOT NULL DEFAULT nextval('"Type_id_seq"'::regclass),
    naming text COLLATE pg_catalog."default" NOT NULL,
    status integer NOT NULL,
    CONSTRAINT "Type_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Type"
    OWNER to postgres;

-- Table: public.User

-- DROP TABLE IF EXISTS public."User";

CREATE TABLE IF NOT EXISTS public."User"
(
    id bigint NOT NULL DEFAULT nextval('"User_user_id_seq"'::regclass),
    name_forename text COLLATE pg_catalog."default" NOT NULL,
    name_cognomen text COLLATE pg_catalog."default" NOT NULL,
    name_patronim text COLLATE pg_catalog."default",
    email text COLLATE pg_catalog."default",
    phone text COLLATE pg_catalog."default",
    id_role bigint NOT NULL,
    passp text COLLATE pg_catalog."default" NOT NULL,
    login text COLLATE pg_catalog."default" NOT NULL,
    passw text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY (id),
    CONSTRAINT "User_fkey_id_role" FOREIGN KEY (id_role)
        REFERENCES public."Role" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."User"
    OWNER to postgres;