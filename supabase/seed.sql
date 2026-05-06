SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict RpIIS5kqJSmIjKJ0xVGxDkgCxksaAESxW09KEw4wIrwBXrVnZvF5fs7EOFPF9BV

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', 'f8ea1692-e0f4-4ded-b3e7-88d02efa702a', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"isiahmukasa@gmail.com","user_id":"55dd32f2-79c0-4226-82d2-4fdb5bc83234","user_phone":""}}', '2026-05-05 21:30:33.311176+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dfdcfb15-b3a3-41bf-a591-3b4d1cf92e93', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"isiahmukasa@gmail.com","user_id":"55dd32f2-79c0-4226-82d2-4fdb5bc83234","user_phone":""}}', '2026-05-05 21:31:22.357092+00', ''),
	('00000000-0000-0000-0000-000000000000', '7ba8b7bc-456e-4c01-8980-d1b2711210d7', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"isiahmukasa@gmail.com","user_id":"0424d2df-667d-4ee1-aa57-7a5e9ac9e790","user_phone":""}}', '2026-05-05 21:31:51.632228+00', ''),
	('00000000-0000-0000-0000-000000000000', '574c01f4-0c3f-45d2-8a3a-f8fcdf4474ae', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"isiahmukasa@gmail.com","user_id":"0424d2df-667d-4ee1-aa57-7a5e9ac9e790","user_phone":""}}', '2026-05-05 21:32:40.207062+00', ''),
	('00000000-0000-0000-0000-000000000000', '39f37693-5d66-4e87-9fba-10508b6c787d', '{"action":"user_signedup","actor_id":"b19fa520-e2bc-44aa-8cb4-767488ff9f29","actor_name":"Isiah","actor_username":"isiahmukasa@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-05-05 21:32:55.791136+00', ''),
	('00000000-0000-0000-0000-000000000000', '179ee9eb-a3f4-4b18-8fed-8064051aacc3', '{"action":"login","actor_id":"b19fa520-e2bc-44aa-8cb4-767488ff9f29","actor_name":"Isiah","actor_username":"isiahmukasa@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-05 21:32:55.809895+00', ''),
	('00000000-0000-0000-0000-000000000000', '2a62f093-8751-4417-bfe7-0db0de46b567', '{"action":"logout","actor_id":"b19fa520-e2bc-44aa-8cb4-767488ff9f29","actor_name":"Isiah","actor_username":"isiahmukasa@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-05-05 21:33:52.367451+00', '');


--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '825f72ca-be57-44c1-969c-d810e5c5ff20', 'authenticated', 'authenticated', 'admin@newbi.co.uk', '$2a$10$L72nbpElkB3sSVAMkZ1w2u5a82i9RXTlrTatmerDsrOsPrPWA6OjG', '2026-05-05 20:54:04.343388+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{"is_admin": true, "provider": "email", "providers": ["email"]}', '{"is_admin": true, "email_verified": true}', NULL, '2026-05-05 20:54:04.30461+00', '2026-05-05 21:09:01.305507+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '61fa4f6e-c8c5-460f-8a6c-bf19f6e43fd7', 'authenticated', 'authenticated', 'team@newbi.co.uk', '$2a$10$SJRT/gA40wAE4x9gkym8rumjbXVsZJFjPAYOZ6y0r97FcBbxbueWS', '2026-04-01 14:37:10.949454+00', NULL, '', '2026-04-01 14:36:52.859426+00', '', NULL, '', '', NULL, '2026-04-01 14:40:47.266779+00', '{"is_admin": true, "provider": "email", "providers": ["email"]}', '{"sub": "61fa4f6e-c8c5-460f-8a6c-bf19f6e43fd7", "email": "team@newbi.co.uk", "is_admin": true, "email_verified": true, "phone_verified": false}', NULL, '2026-04-01 14:36:52.844761+00', '2026-04-01 19:10:37.771672+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'b19fa520-e2bc-44aa-8cb4-767488ff9f29', 'authenticated', 'authenticated', 'isiahmukasa@gmail.com', '$2a$10$aj5hJjN./QrRWImCf1NL8.q5s9sSkhD/ITAt0UApNczEJY7Q4hUpy', '2026-05-05 21:32:55.792467+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-05-05 21:32:55.812085+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "b19fa520-e2bc-44aa-8cb4-767488ff9f29", "email": "isiahmukasa@gmail.com", "full_name": "Isiah", "email_verified": true, "phone_verified": false}', NULL, '2026-05-05 21:32:55.779122+00', '2026-05-05 21:32:55.818052+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('61fa4f6e-c8c5-460f-8a6c-bf19f6e43fd7', '61fa4f6e-c8c5-460f-8a6c-bf19f6e43fd7', '{"sub": "61fa4f6e-c8c5-460f-8a6c-bf19f6e43fd7", "email": "team@newbi.co.uk", "email_verified": true, "phone_verified": false}', 'email', '2026-04-01 14:36:52.854727+00', '2026-04-01 14:36:52.854781+00', '2026-04-01 14:36:52.854781+00', 'a72d74f7-2541-49b3-8c5b-b1885c6a12ba'),
	('b19fa520-e2bc-44aa-8cb4-767488ff9f29', 'b19fa520-e2bc-44aa-8cb4-767488ff9f29', '{"sub": "b19fa520-e2bc-44aa-8cb4-767488ff9f29", "email": "isiahmukasa@gmail.com", "full_name": "Isiah", "email_verified": false, "phone_verified": false}', 'email', '2026-05-05 21:32:55.786543+00', '2026-05-05 21:32:55.786575+00', '2026-05-05 21:32:55.786575+00', '6ace9350-b878-415c-86e8-86b6df4e8e05');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: listing_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: mailing_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."mailing_list" ("id", "email", "created_at") VALUES
	('99900e59-11bb-461d-9ef7-dfe0c59e3b2c', 'os.shared@hotmail.com', '2026-03-13 17:36:44.638478+00'),
	('2ae6ee56-6271-4473-9033-3f5bcfe0606c', 'noahmukasa07@gmail.com', '2026-03-15 20:56:03.866912+00'),
	('c7ec5138-e34d-469b-a35d-61a2261d9d4b', 'william.t.r.dunn@icloud.com', '2026-03-15 21:55:54.526307+00'),
	('1abab405-ac9c-4e59-89df-d34e0d0a74b6', '1rusty79@gmail.com', '2026-03-16 17:52:23.612432+00'),
	('1b7079b2-c583-42ff-b6d5-85a66ccdc42e', 'poppywasson@icloud.com', '2026-03-18 20:28:51.703318+00'),
	('f11fb915-a31a-4dd1-b78d-f85958bdb383', 'lucysarahseaman@gmail.com', '2026-03-18 20:34:07.506682+00'),
	('bb56eb64-0c6d-49f6-8b56-5f0a2669155b', 'paul@gogtm.biz', '2026-03-18 21:19:10.115248+00'),
	('e7841a46-2ede-4c23-94ad-f7274d524da0', 'bronwenroberts74@gmail.com', '2026-03-19 11:41:47.431175+00'),
	('b5a44597-6791-4dad-bead-e9c3678607ea', 'edenjbrady@hotmail.com', '2026-03-19 13:31:52.360242+00'),
	('926fa969-c739-444a-9e1e-1b24ade81000', 'isiahmukasa@gmail.com', '2026-03-19 23:06:24.646604+00'),
	('8cf868a0-e528-43c5-8007-bf0fe4e94775', 'tumininuakinleye423@gmail.com', '2026-03-19 23:32:02.799244+00'),
	('a8ad187c-3354-41c2-a702-bfd7e6beb530', 'james.ys.watt@outlook.com', '2026-03-25 13:52:55.540118+00');


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profiles" ("id", "email", "display_name", "created_at") VALUES
	('61fa4f6e-c8c5-460f-8a6c-bf19f6e43fd7', 'team@newbi.co.uk', NULL, '2026-04-01 14:36:52.844357+00');


--
-- Data for Name: provider_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."provider_profiles" ("id", "name", "description", "address", "phone", "email", "instagram", "website", "profile_picture_url", "categories", "created_at", "user_id") VALUES
	('e3e0ac0e-2f09-4766-82b7-1a1fee8af29b', '1002.nailz', '𝐀𝐂𝐑𝐋𝐈𝐂 | 𝐁𝐈𝐀𝐁 | 𝐆𝐄𝐋-𝐗
𝐐𝐮𝐚𝐥𝐢𝐟𝐢𝐞𝐝, 𝟓 𝐲𝐞𝐚𝐫𝐬 𝐄𝐱𝐩𝐞𝐫𝐢𝐞𝐧𝐜𝐞
𝐖𝐞𝐛𝐬𝐢𝐭𝐞 𝐋𝐢𝐧𝐤 𝐅𝐨𝐫 𝐏𝐫𝐢𝐜𝐞𝐬, 𝐈𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧 & 𝐁𝐨𝐨𝐤𝐢𝐧𝐠', NULL, NULL, NULL, '@1002.nailz', NULL, 'https://wbfpfgkpwxkqzarjtdwg.supabase.co/storage/v1/object/public/provider-images/1002.jpg', '{Nails}', '2026-04-01 13:03:16.902752+00', NULL),
	('cd31c094-0c6a-4031-ad4c-c7cc8b7eb8ea', 'SereneSilk', '𝐵𝑜𝓊𝓃𝒸𝓎 𝐵𝓁𝑜𝓌𝒹𝓇𝓎 𝒮𝓅𝑒𝒸𝒾𝒶𝓁𝒾𝓈𝓉', NULL, NULL, NULL, '@serenesilkx', NULL, 'https://wbfpfgkpwxkqzarjtdwg.supabase.co/storage/v1/object/public/provider-images/1775049483757.jpg', '{Hair}', '2026-04-01 13:18:04.284298+00', NULL),
	('fc1d275f-a6f4-43de-a255-3ec2cd328743', 'Lace Doc', '• WIG INSTALLs | SEW INs | Shop @lacedoccollection', NULL, NULL, NULL, 'https://www.instagram.com/thelacedocuk/', NULL, 'https://wbfpfgkpwxkqzarjtdwg.supabase.co/storage/v1/object/public/provider-images/1775049630999.jpg', '{hair}', '2026-04-01 13:20:31.242614+00', NULL),
	('1ffc6388-b0ca-44a9-a17c-e5bb35b540fa', 'Byameeera', '<p>SHEFFIELD NAILTECH/ NAILTRAINING</p><p>Self taught. 2+ YEARS experience</p><p>QUALIFIED.ACCREDITED</p><p><a target="_blank" rel="noopener noreferrer" href="https://app.acuityscheduling.com/schedule/6a6e3da9">Book here</a></p>', NULL, NULL, NULL, 'https://www.instagram.com/byameeera_/', 'https://app.acuityscheduling.com/schedule/6a6e3da9', 'https://wbfpfgkpwxkqzarjtdwg.supabase.co/storage/v1/object/public/provider-images/1775050039504.jpg', '{nails}', '2026-04-01 13:27:20.18048+00', NULL),
	('99ab3c9b-4ef2-4644-9ec3-adbb0ebff88d', 'Hairby_skyecawthorne', '<p>SKYE CAWTHORNE| SHEFFIELD HAIRDRESSER|EXTENSIONS| COLOUR| CUTS<br>🤍Dm for appointments<br>🤍Sheffield, ph2 hairdressing<br>🤍Level 2 qualified &amp; extension qualified</p>', NULL, NULL, NULL, 'https://www.instagram.com/hairby_skyecawthorne/', NULL, 'https://wbfpfgkpwxkqzarjtdwg.supabase.co/storage/v1/object/public/provider-images/1775051516495.jpg', '{hair}', '2026-04-01 13:51:57.190619+00', NULL),
	('8e715b7a-ead2-4ede-bb83-e2a61a5fb3ea', 'Hair.bykacee', '<p>☁️ 𝑄𝑢𝑎𝑙𝑖𝑓𝑖𝑒𝑑 𝐻𝑎𝑖𝑟𝑑𝑟𝑒𝑠𝑠𝑒𝑟<br>✃ 𝑄𝑢𝑎𝑙𝑖𝑑𝑖𝑒𝑑 𝑖𝑛 𝑒𝑥𝑡𝑒𝑛𝑠𝑖𝑜𝑛𝑠 －<br>𝑛𝑎𝑛𝑜 𝑏𝑒𝑎𝑑𝑠／𝑖 𝑡𝑖𝑝／𝑡𝑎𝑝𝑒𝑠／𝑤𝑒𝑎𝑣𝑒<br>📍 𝑆ℎ𝑒𝑓𝑓𝑖𝑒𝑙𝑑 - 𝐼𝑛 𝑆𝑎𝑙𝑜𝑛 𝑏𝑎𝑠𝑒𝑑<br>♡︎ 𝑇𝑎𝑘𝑖𝑛𝑔 𝑛𝑒𝑤 𝑐𝑙𝑖𝑒𝑛𝑡𝑠 𝑜𝑛</p>', NULL, NULL, NULL, 'https://www.instagram.com/Hair.bykacee/', NULL, 'https://wbfpfgkpwxkqzarjtdwg.supabase.co/storage/v1/object/public/provider-images/1775051584544.jpg', '{Hair,Weave}', '2026-04-01 13:53:04.844397+00', NULL),
	('a2d75c08-2065-4525-bede-871cecf97455', 'Hair.by.tp', '<p>DM to book 🤩<br>Mobile braider 💕<br>Home based 💞<br>Disclaimer:GIRLS ONLY SERVICE‼️<br>Beauty and holy 🌸<br>Deuteronomy 28:12<br>……and will bless all the work you do.✨</p>', NULL, NULL, NULL, 'https://www.instagram.com/Hair.by.tp/', NULL, 'https://wbfpfgkpwxkqzarjtdwg.supabase.co/storage/v1/object/public/provider-images/1775051663889.jpg', '{hair}', '2026-04-01 13:54:24.495757+00', NULL),
	('d3e0166e-8c5e-4177-9293-3d5ed3d2c1ca', 'Sleek3dbyb', '<p>APRIL AVAILABILITY OUT NOW🎀<br>Dm for emergency appointments &amp; enquiries<br><a target="_blank" rel="noopener noreferrer" href="https://sleek3dbyb.as.me/schedule/357f07bd">BOOK HERE</a></p>', NULL, NULL, NULL, 'https://www.instagram.com/sleek3dbyb/', 'https://sleek3dbyb.as.me/schedule/357f07bd', 'https://wbfpfgkpwxkqzarjtdwg.supabase.co/storage/v1/object/public/provider-images/1775051769453.jpg', '{hair}', '2026-04-01 13:56:09.713885+00', NULL),
	('2decada5-f4a5-4ca7-b0b3-2da2b7666e65', 'MORGLAM lashes and beauty ', '<p>Home based in Handsworth,S13✨<br>Specialise in Korean lash lifts🤩<br>DM/ <a target="_blank" rel="noopener noreferrer" href="https://booksolo.co/morglam?utm_source=ig&amp;utm_medium=social&amp;utm_content=link_in_bio&amp;fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnskXZoASTgegJe5z3eMDRzjvalNvsPHfpWw3rqJvRTrucxq3y7M1EzS_N2H4_aem_HxYf-XHz32iP1hPEglubJw">book here</a> 🖤<br></p>', NULL, NULL, NULL, 'https://www.instagram.com/morglam_lashes/', 'https://booksolo.co/morglam?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnskXZoASTgegJe5z3eMDRzjvalNvsPHfpWw3rqJvRTrucxq3y7M1EzS_N2H4_aem_HxYf-XHz32iP1hPEglubJw', 'https://wbfpfgkpwxkqzarjtdwg.supabase.co/storage/v1/object/public/provider-images/1775051902221.jpg', '{lashes}', '2026-04-01 13:57:54.838928+00', NULL),
	('7b835e60-b3db-427c-a081-12f92fec4443', 'Lowes.Beauty ', '✨ Sheffield Beauty Expert
💕 Lashes | Brows | SPMU | Fine Line Tattoo
🌸 FREE CONSULTATIONS
🛍️ UK Premium Lash Supplies - @lowes.lashes 💕', NULL, NULL, NULL, '@Lowes.Beauty ', NULL, 'https://wbfpfgkpwxkqzarjtdwg.supabase.co/storage/v1/object/public/provider-images/1775050154899.jpg', '{lashes,brows,tattoos}', '2026-04-01 13:28:50.9742+00', NULL),
	('c619eed5-30f1-4405-8e13-8fa118d08565', 'Maddiedtattoos', '<p>🦔resident artist🦔<br>🐇<a target="_blank" rel="noopener noreferrer" class="x1i10hfl xjbqb8w x1ejq31n x18oe1m7 x1sy0etr xstzfhl x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1ypdohk xt0psk2 x3ct3a4 xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz notranslate _a6hd" href="https://www.instagram.com/fortytwotattoo/">@fortytwotattoo</a>🐇</p><p><a target="_blank" rel="me nofollow noopener noreferrer" href="https://l.instagram.com/?u=https%3A%2F%2Fetsy.me%2F3dVg1l1%3Futm_source%3Dig%26utm_medium%3Dsocial%26utm_content%3Dlink_in_bio%26fbclid%3DPAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGne-iU9MffSWCB3CP87fRjZ6zILg4nLMl51xzWV9LmXxyfsUDJ-gHWMdfb4ao_aem_NrW7BnAFWPbRVDhg4yJExw&amp;e=AT4cLivAf64gLhFphL0CFKcPTu3DQcqzGlqrZfE9VN4zHQxw1mUL-O3U9mZ1L8p_ZrmitnpsUaw_25EE9KcoUQ7eCkAr2-wbC-uwA8FwZA"><strong>etsy.me/3dVg1l1</strong></a></p>', NULL, NULL, NULL, 'https://www.instagram.com/Maddiedtattoos/', NULL, 'https://wbfpfgkpwxkqzarjtdwg.supabase.co/storage/v1/object/public/provider-images/1775052015878.jpg', '{Tattoos}', '2026-04-01 14:00:16.399702+00', NULL),
	('a43ddda4-af74-457d-897a-8887bb3d9b52', 'Beautybyshantiuk', '<p>Advanced Lash &amp; Brow Artist✨<br>Enhancing natural beauty<br>Sheffield-based at <a target="_blank" rel="noopener noreferrer" class="x1i10hfl xjbqb8w x1ejq31n x18oe1m7 x1sy0etr xstzfhl x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1ypdohk xt0psk2 x3ct3a4 xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz notranslate _a6hd" href="https://www.instagram.com/thedreamloungeuk/">@thedreamloungeuk</a></p>', NULL, NULL, NULL, 'Beautybyshantiuk', 'https://that-time.co.uk/the-dream-lounge?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnIFGNadf-yPs48qOakNMutOKLONRFlTHWmB4gystrSxECd4DSAGfOwp9lYBM_aem_p5lnwn1K-o3m-mgq4WhXUg', 'https://wbfpfgkpwxkqzarjtdwg.supabase.co/storage/v1/object/public/provider-images/1775052247388.jpg', '{lashes,brows}', '2026-04-01 14:04:07.952168+00', NULL),
	('aba28bbd-3fee-4087-a33c-f9f669fd2827', 'The Radiance Room', '<p>☁️Private beauty studio designed for your comfort<br>Acrylic • BIAB • Lash lifts<br>📍94 Surrey street<br>⬇️book your next treatment below<br><a target="_blank" rel="noopener noreferrer" href="https://app.acuityscheduling.com/schedule/62c5c016">here</a></p>', NULL, NULL, NULL, '_the_radiance_room_', 'https://app.acuityscheduling.com/schedule/62c5c016', 'https://wbfpfgkpwxkqzarjtdwg.supabase.co/storage/v1/object/public/provider-images/1775052484954.jpg', '{lashes,nails}', '2026-04-01 14:08:05.597097+00', NULL),
	('2082c892-4c6f-438e-8719-ed555f9b8ea8', 'Sha.sha nails ', '<p>Sheffield Mobile Nail Technician 💅🏽<br>📍DM Me For Enquires</p>', NULL, NULL, NULL, 'https://www.instagram.com/sha.sha_nails/', NULL, 'https://wbfpfgkpwxkqzarjtdwg.supabase.co/storage/v1/object/public/provider-images/1775052657805.jpg', '{nails}', '2026-04-01 14:10:58.022701+00', NULL),
	('29e81334-5eb4-4e48-a974-51e3eefaaa8c', 'Braids By Semi', '<p>🤎SHEFFIELD BASED<br>🤎Experienced braider<br>🤎Dm for booking + enquiry<br>🤎April bookings out soon:)<br>🤎CEO: <a target="_blank" rel="noopener noreferrer" class="x1i10hfl xjbqb8w x1ejq31n x18oe1m7 x1sy0etr xstzfhl x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1ypdohk xt0psk2 x3ct3a4 xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz notranslate _a6hd" href="https://www.instagram.com/semi7067/">@semi7067</a></p>', NULL, NULL, NULL, 'https://www.instagram.com/_braidsbysemi_/', NULL, 'https://wbfpfgkpwxkqzarjtdwg.supabase.co/storage/v1/object/public/provider-images/1775052879553.jpg', '{hair}', '2026-04-01 14:14:40.560016+00', NULL),
	('3e666f80-7ef3-4fcc-aba4-bf5cc80727e1', 'Nails By Alice Mae', '<p>𝕊𝕙𝕖𝕗𝕗𝕚𝕖𝕝𝕕 𝕟𝕒𝕚𝕝 𝕥𝕖𝕔𝕙 🪩<br>Builder Gel, Acrylic &amp; Gel 🩷<br>S12 based📍<br>Booking <a target="_blank" rel="noopener noreferrer" href="https://booksolo.co/nailsbyalicemae?utm_source=ig&amp;utm_medium=social&amp;utm_content=link_in_bio&amp;fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnUlJNa2CknD3mIRCuNNQ2GU8kLI1r5Z0Pag0lB-xrC7Tw4uaoF5G6c0xUYyE_aem_lUWxdLC8mGziWVM-syqoQQ">here</a>🫧</p>', NULL, NULL, NULL, 'https://www.instagram.com/nailsbyalicemae/', 'https://booksolo.co/nailsbyalicemae?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnUlJNa2CknD3mIRCuNNQ2GU8kLI1r5Z0Pag0lB-xrC7Tw4uaoF5G6c0xUYyE_aem_lUWxdLC8mGziWVM-syqoQQ', 'https://wbfpfgkpwxkqzarjtdwg.supabase.co/storage/v1/object/public/provider-images/1775053369404.jpg', '{Nails}', '2026-04-01 14:22:17.326698+00', NULL);


--
-- Data for Name: provider_invites; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: suggestions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."suggestions" ("id", "name", "email", "message", "created_at") VALUES
	('67a0b1a5-aea5-4c9c-9f5f-edf5975c5653', 'Isiah', 'isiahmukasa@gmail.com', 'test suggestion', '2026-04-01 20:44:45.561557+00');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") VALUES
	('provider-images', 'provider-images', NULL, '2026-04-01 12:59:56.107299+00', '2026-04-01 12:59:56.107299+00', true, false, NULL, NULL, NULL, 'STANDARD');


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_namespaces; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_tables; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") VALUES
	('2cab21fb-d666-40ba-a951-c26b7d879525', 'provider-images', '1002.jpg', NULL, '2026-04-01 13:00:19.930461+00', '2026-04-01 13:00:19.930461+00', '2026-04-01 13:00:19.930461+00', '{"eTag": "\"a030d96410e628d11d40b85c9d8244f1-1\"", "size": 39970, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-01T13:00:20.000Z", "contentLength": 39970, "httpStatusCode": 200}', 'dd9c7c9c-d43c-4b7e-96c4-78dd47a7d8d1', NULL, NULL),
	('76bd60a9-3cc7-4a9e-9379-de98536478d1', 'provider-images', '1775049483757.jpg', NULL, '2026-04-01 13:18:04.004448+00', '2026-04-01 13:18:04.004448+00', '2026-04-01 13:18:04.004448+00', '{"eTag": "\"2975d0085231d5689211c34696e466fa\"", "size": 35202, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-01T13:18:04.000Z", "contentLength": 35202, "httpStatusCode": 200}', '87e98ec4-7a56-47dc-99ab-c0eb2c28e697', NULL, '{}'),
	('39a71ecd-e630-48f8-aae1-f338970c9ae5', 'provider-images', '1775049630999.jpg', NULL, '2026-04-01 13:20:31.071412+00', '2026-04-01 13:20:31.071412+00', '2026-04-01 13:20:31.071412+00', '{"eTag": "\"613dba8ec188efeb9914b818b67b32b6\"", "size": 43456, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-01T13:20:32.000Z", "contentLength": 43456, "httpStatusCode": 200}', 'c529f8fa-9c33-430e-9aa0-32d540a961ee', NULL, '{}'),
	('b2dd1010-adab-41b4-85d6-462a0a4fc877', 'provider-images', '1775049802481.jpg', NULL, '2026-04-01 13:23:22.907427+00', '2026-04-01 13:23:22.907427+00', '2026-04-01 13:23:22.907427+00', '{"eTag": "\"d3caeec902344ce1e5c4606b033426aa\"", "size": 107600, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-01T13:23:23.000Z", "contentLength": 107600, "httpStatusCode": 200}', 'c53bc8d1-7b83-471c-9600-f49ab6615d45', NULL, '{}'),
	('6e7c4180-4ca3-41b9-aed6-0061c5b18a6f', 'provider-images', '1775049938977.jpg', NULL, '2026-04-01 13:25:39.148595+00', '2026-04-01 13:25:39.148595+00', '2026-04-01 13:25:39.148595+00', '{"eTag": "\"d3caeec902344ce1e5c4606b033426aa\"", "size": 107600, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-01T13:25:40.000Z", "contentLength": 107600, "httpStatusCode": 200}', 'c3a17087-493e-481f-a24c-fc8ac1571e93', NULL, '{}'),
	('f34a9bef-1794-402d-9a21-4ea48d4de322', 'provider-images', '1775049945156.jpg', NULL, '2026-04-01 13:25:45.558355+00', '2026-04-01 13:25:45.558355+00', '2026-04-01 13:25:45.558355+00', '{"eTag": "\"d3caeec902344ce1e5c4606b033426aa\"", "size": 107600, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-01T13:25:46.000Z", "contentLength": 107600, "httpStatusCode": 200}', '97793a67-58f3-4181-949f-37f6e9e2e864', NULL, '{}'),
	('69721203-6a5f-45a3-bdfc-a1972cf4b263', 'provider-images', '1775050039504.jpg', NULL, '2026-04-01 13:27:19.854293+00', '2026-04-01 13:27:19.854293+00', '2026-04-01 13:27:19.854293+00', '{"eTag": "\"d3caeec902344ce1e5c4606b033426aa\"", "size": 107600, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-01T13:27:20.000Z", "contentLength": 107600, "httpStatusCode": 200}', 'fdf8ee34-5d2b-43f7-b5cb-011a4c76b136', NULL, '{}'),
	('c860ea6b-4778-42d2-9b9f-997e0f77a99d', 'provider-images', '1775050154899.jpg', NULL, '2026-04-01 13:29:15.370133+00', '2026-04-01 13:29:15.370133+00', '2026-04-01 13:29:15.370133+00', '{"eTag": "\"24452c950943b981537abaf1f96c0c9a\"", "size": 81367, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-01T13:29:16.000Z", "contentLength": 81367, "httpStatusCode": 200}', '680a440a-7258-4d07-9d48-3a431043d4ff', NULL, '{}'),
	('590d5811-baf6-4bde-b805-c6c5aaadcbe0', 'provider-images', '1775051516495.jpg', NULL, '2026-04-01 13:51:56.929082+00', '2026-04-01 13:51:56.929082+00', '2026-04-01 13:51:56.929082+00', '{"eTag": "\"065e82666f055fa1622ce750fcbfb0e8\"", "size": 136795, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-01T13:51:57.000Z", "contentLength": 136795, "httpStatusCode": 200}', '1ee5efb8-fb3e-4039-9f0d-26ab0633731f', NULL, '{}'),
	('673b7bcb-695d-46db-ac0a-7f03cd505ad9', 'provider-images', '1775051584544.jpg', NULL, '2026-04-01 13:53:04.652754+00', '2026-04-01 13:53:04.652754+00', '2026-04-01 13:53:04.652754+00', '{"eTag": "\"50b6cc9e14899947c1e97573388ba586\"", "size": 174072, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-01T13:53:05.000Z", "contentLength": 174072, "httpStatusCode": 200}', 'bbb4d934-fad8-4a04-bdc7-6d07ad7f8ad0', NULL, '{}'),
	('b1d2e5b3-5ff7-4547-b39d-d5b7e7c0bf5d', 'provider-images', '1775051663889.jpg', NULL, '2026-04-01 13:54:24.179312+00', '2026-04-01 13:54:24.179312+00', '2026-04-01 13:54:24.179312+00', '{"eTag": "\"f7d0ab56cec5ca90de3183c68a61777a\"", "size": 10680, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-01T13:54:25.000Z", "contentLength": 10680, "httpStatusCode": 200}', '2bc90219-2573-4b46-9e7a-a2b1755a7e11', NULL, '{}'),
	('ca1269be-8c2f-406a-9ab5-cae982a09d3e', 'provider-images', '1775051769453.jpg', NULL, '2026-04-01 13:56:09.530251+00', '2026-04-01 13:56:09.530251+00', '2026-04-01 13:56:09.530251+00', '{"eTag": "\"4e098b94474d9b512662fee5eaa6a339\"", "size": 77898, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-01T13:56:10.000Z", "contentLength": 77898, "httpStatusCode": 200}', '93b872ae-04d3-481b-b8ec-9fdadb8a090a', NULL, '{}'),
	('5d6b007d-9f29-495b-952f-359e5730955c', 'provider-images', '1775051902221.jpg', NULL, '2026-04-01 13:58:22.281006+00', '2026-04-01 13:58:22.281006+00', '2026-04-01 13:58:22.281006+00', '{"eTag": "\"6a5c2fd0f55d441cc02ec2a28bb7e2b9\"", "size": 49424, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-01T13:58:23.000Z", "contentLength": 49424, "httpStatusCode": 200}', 'a869bc78-1c22-4167-84c6-1dc85852ebc3', NULL, '{}'),
	('ddfb552d-2cb8-4416-a033-d2fbd5d41356', 'provider-images', '1775052015878.jpg', NULL, '2026-04-01 14:00:16.23578+00', '2026-04-01 14:00:16.23578+00', '2026-04-01 14:00:16.23578+00', '{"eTag": "\"c8477cdc01c682db59fbee2e08ad1991\"", "size": 107438, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-01T14:00:17.000Z", "contentLength": 107438, "httpStatusCode": 200}', '430e6f8f-86ae-475a-a69b-52e32e522571', NULL, '{}'),
	('c6ed006b-0155-47d1-88dd-e83f32fe9c10', 'provider-images', '1775052247388.jpg', NULL, '2026-04-01 14:04:07.647366+00', '2026-04-01 14:04:07.647366+00', '2026-04-01 14:04:07.647366+00', '{"eTag": "\"f9f5070f483cdd9474f8a9b153b7ac6e\"", "size": 68369, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-01T14:04:08.000Z", "contentLength": 68369, "httpStatusCode": 200}', '92b0a837-531b-4bea-b4c5-21ebf0d4592a', NULL, '{}'),
	('0312ca7d-5a32-400d-bda5-a845ae914032', 'provider-images', '1775052484954.jpg', NULL, '2026-04-01 14:08:05.10759+00', '2026-04-01 14:08:05.10759+00', '2026-04-01 14:08:05.10759+00', '{"eTag": "\"676cf4d52f51a7a728454216200946c7\"", "size": 25517, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-01T14:08:06.000Z", "contentLength": 25517, "httpStatusCode": 200}', '40b94e38-3560-48e6-9233-b73f93b75548', NULL, '{}'),
	('7f7bdd18-57ca-411d-9b8c-858923723046', 'provider-images', '1775052657805.jpg', NULL, '2026-04-01 14:10:57.83625+00', '2026-04-01 14:10:57.83625+00', '2026-04-01 14:10:57.83625+00', '{"eTag": "\"b2d9fe9fbd9e30e94b578608026a7c1c\"", "size": 35080, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-01T14:10:58.000Z", "contentLength": 35080, "httpStatusCode": 200}', 'b6356389-45f6-4954-b17b-615f4fccb44d', NULL, '{}'),
	('589f8d84-8d32-44e4-9253-faf01fe7cf57', 'provider-images', '1775052879553.jpg', NULL, '2026-04-01 14:14:40.228373+00', '2026-04-01 14:14:40.228373+00', '2026-04-01 14:14:40.228373+00', '{"eTag": "\"77f90c6f60aaf6bef50215fb99161c38\"", "size": 102906, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-01T14:14:41.000Z", "contentLength": 102906, "httpStatusCode": 200}', 'c22b5537-103f-47f7-b499-d9ba55557cd2', NULL, '{}'),
	('abaed603-8d19-4c80-b5a4-b82c4bcf65f5', 'provider-images', '1775053369404.jpg', NULL, '2026-04-01 14:22:49.695022+00', '2026-04-01 14:22:49.695022+00', '2026-04-01 14:22:49.695022+00', '{"eTag": "\"c48204fec4944c74c0e6531710d025b4\"", "size": 23692, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-01T14:22:50.000Z", "contentLength": 23692, "httpStatusCode": 200}', '7ace4b78-d49f-46c3-865a-222f1d440878', NULL, '{}');


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 31, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

-- \unrestrict RpIIS5kqJSmIjKJ0xVGxDkgCxksaAESxW09KEw4wIrwBXrVnZvF5fs7EOFPF9BV

RESET ALL;
