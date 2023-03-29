-- general admins
insert into "accounts" (id, name, email, hashed_password, role, is_confirmed) values ('b453ad3a-36fa-447b-b1c6-c2b35b0662e3', 'General Admin', 'general_admin@mail.com', '$2b$12$3wpYrAN3ATDKMLNHiFmEcOlt8gB7BVn.YWFTHUHAZlCHjUhVOq7qG', 'GENERAL_ADMIN', true);

-- companies
insert into "companies" (id, name, reservation_price, reservation_time_in_minutes) values ('74bc7e66-4468-4485-923a-48f762e317c2', 'Company Test 01', 50, 60);

-- company admins
insert into "accounts" (id, name, email, company_id, hashed_password, role, is_confirmed) values ('8b3602cd-4d51-4cdd-b4d7-7a1973354da5', 'Company Admin', 'company_admin@mail.com', '74bc7e66-4468-4485-923a-48f762e317c2', '$2b$12$3wpYrAN3ATDKMLNHiFmEcOlt8gB7BVn.YWFTHUHAZlCHjUhVOq7qG', 'COMPANY_ADMIN', true);

-- employees
insert into "accounts" (id, name, email, company_id, hashed_password, role, is_confirmed) values ('142dae7a-6894-4e46-94c7-bf0b74b40873', 'Employee 01', 'employee_01@mail.com', '74bc7e66-4468-4485-923a-48f762e317c2', '$2b$12$3wpYrAN3ATDKMLNHiFmEcOlt8gB7BVn.YWFTHUHAZlCHjUhVOq7qG', 'EMPLOYEE', true);
insert into "accounts" (id, name, email, company_id, hashed_password, role, is_confirmed) values ('87cccb60-821b-4917-9fec-5eefb1c4b370', 'Employee 02', 'employee_02@mail.com', '74bc7e66-4468-4485-923a-48f762e317c2', '$2b$12$3wpYrAN3ATDKMLNHiFmEcOlt8gB7BVn.YWFTHUHAZlCHjUhVOq7qG', 'EMPLOYEE', true);
insert into "accounts" (id, name, email, company_id, hashed_password, role, is_confirmed) values ('5103e00e-b941-4925-b500-b76203040125', 'Employee 03', 'employee_03@mail.com', '74bc7e66-4468-4485-923a-48f762e317c2', '$2b$12$3wpYrAN3ATDKMLNHiFmEcOlt8gB7BVn.YWFTHUHAZlCHjUhVOq7qG', 'EMPLOYEE', true);

-- courts
insert into "courts" (id, name, company_id) values ('a9425af9-f8f7-4306-956d-bb98e57488a8', 'Court 01', '74bc7e66-4468-4485-923a-48f762e317c2');
insert into "courts" (id, name, company_id) values ('8059f719-6d2c-4583-8b5b-df6914d0eb08', 'Court 02', '74bc7e66-4468-4485-923a-48f762e317c2');
insert into "courts" (id, name, company_id) values ('8685c132-c262-4b0a-84ea-39b4aea8df5b', 'Court 03', '74bc7e66-4468-4485-923a-48f762e317c2');
