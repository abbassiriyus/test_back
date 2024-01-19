 create table users(
       "id" serial primary key,
       "username" text not null,
       "password" text not null,
       "time_create" timestamp default current_timestamp not null,
       "time_update" timestamp default current_timestamp not null
    );

     create table books(
       "id" serial primary key,
       "title" varchar(50) not null,
       "cover" varchar(50) not null,
       "pages" integer not null,
       "published" integer not null, 
       "isbn" varchar(50) not null,
       "creator" varchar(100) not null,
       "type" integer default 0 not null,
       "time_create" timestamp default current_timestamp not null,
       "time_update" timestamp default current_timestamp not null
    );