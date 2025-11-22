
-- Portfolio Table Schema

-- Bio Table
CREATE TABLE Bio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    roles TEXT[],
    description TEXT,
    github TEXT,
    resume TEXT,
    linkedin TEXT,
    twitter TEXT,
    insta TEXT,
    image VARCHAR
);

-- Skills Table
CREATE TABLE Skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES "Skill Categories"(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    image TEXT
);

-- Skill Categories Table
CREATE TABLE "Skill Categories" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL
);

-- Experiences Table
CREATE TABLE Experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    img TEXT,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    date TEXT,
    description TEXT,
    description2 TEXT,
    description3 TEXT,
    skills TEXT[],
    doc TEXT
);

-- Projects Table
CREATE TABLE Projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    description2 TEXT,
    description3 TEXT,
    image TEXT,
    tags TEXT[],
    category TEXT,
    github TEXT,
    dashboard TEXT
);

-- Education Table
CREATE TABLE Education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    img TEXT,
    school TEXT NOT NULL,
    date TEXT,
    grade TEXT,
    description TEXT,
    degree TEXT
);

-- Associations Table
CREATE TABLE Associations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES Projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    img TEXT
);

-- Members Table
CREATE TABLE Members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES Projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    img TEXT,
    github TEXT,
    linkedin TEXT
);

-- Copyright Table
CREATE TABLE Copyright (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    copyright VARCHAR NOT NULL
);

-- Contacts Table
CREATE TABLE contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);
