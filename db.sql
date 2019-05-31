CREATE TABLE public.users
(
    email text NOT NULL,
    pass text NOT NULL,
    profile json NOT NULL,
    PRIMARY KEY (email)
);