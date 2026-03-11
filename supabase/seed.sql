-- Seed providers
INSERT INTO providers (name, category, description, address, phone, email, instagram) VALUES
  ('Curl & Crown Studio',     'Hair',      'Specializing in natural hair care, silk presses, and protective styles. Over 10 years of experience with all curl types.',                     '142 Magnolia Ave, Atlanta, GA 30310',            '(404) 555-0182', 'curlncrown@example.com',      'https://curlncrown.example.com'),
  ('The Mane Event',          'Hair',      'Full-service salon offering cuts, color, treatments, and extensions for all hair textures.',                                                  '87 Peach St, Atlanta, GA 30315',                 '(404) 555-0234', 'mainevent@example.com',       NULL),
  ('Lash Lab ATL',            'Lashes',    'Classic, hybrid, and volume lash sets using premium mink and synthetic extensions. Refills available.',                                       '230 Auburn Ave, Atlanta, GA 30303',              '(404) 555-0391', 'lashlab@example.com',         'https://lashlab.example.com'),
  ('Flutter & Glam',          'Lashes',    'Luxury lash studio offering mega volume, wispy, and wet-look sets. Sensitive-eye friendly adhesives.',                                        '55 Edgewood Ave, Atlanta, GA 30303',             '(404) 555-0458', 'flutterglam@example.com',     NULL),
  ('Arch Artistry',           'Brows',     'Microblading, ombre brows, brow lamination, and threading. Precision shaping for every face.',                                               '310 Ponce de Leon Ave, Atlanta, GA 30308',       '(404) 555-0512', 'archartistry@example.com',    'https://archartistry.example.com'),
  ('Pressed & Pretty',        'Nails',     'Custom press-on nails, gel manicures, dip powder, and nail art. Walk-ins welcome.',                                                          '19 Joseph E. Lowery Blvd, Atlanta, GA 30314',   '(404) 555-0627', 'pressedpretty@example.com',   NULL),
  ('Luxe Nail Lounge',        'Nails',     'Upscale nail lounge specializing in gel-x, hard gel extensions, and intricate 3D nail art.',                                                 '401 Lee St SW, Atlanta, GA 30310',              '(404) 555-0744', 'luxenail@example.com',        'https://luxenail.example.com'),
  ('Fresh Cuts Barbershop',   'Barbering', 'Classic and modern cuts, fades, shape-ups, and beard trims. Walk-ins and appointments available.',                                           '728 Martin Luther King Jr Dr, Atlanta, GA 30314','(404) 555-0813', 'freshcuts@example.com',       NULL),
  ('The Sharp Edge',          'Barbering', 'Premium barbershop with licensed barbers specializing in textured hair, line-ups, and hot towel shaves.',                                    '502 Ralph David Abernathy Blvd, Atlanta, GA 30312','(404) 555-0967','sharpedge@example.com',      'https://sharpedge.example.com'),
  ('Glow Up Beauty',          'Makeup',    'Bridal, editorial, and everyday glam makeup services. Airbrush available. Mobile bookings accepted.',                                        '88 John Wesley Dobbs Ave, Atlanta, GA 30303',   '(404) 555-1023', 'glowup@example.com',          'https://glowup.example.com'),
  ('Queens Braiding Studio',  'Braiding',  'Box braids, knotless braids, Senegalese twists, goddess locs, and more. Natural hair specialists.',                                          '161 Pryor St SW, Atlanta, GA 30303',            '(404) 555-1145', 'queensbraiding@example.com',  NULL),
  ('African Heritage Braids', 'Braiding',  'Traditional and contemporary African braiding styles. Fast, meticulous service with quality hair included.',                                  '45 Northside Dr NW, Atlanta, GA 30314',         '(404) 555-1267', 'africanheritage@example.com', 'https://africanheritage.example.com'),
  ('Restore Wellness Spa',    'Massage',   'Swedish, deep tissue, hot stone, and prenatal massage. Licensed therapists in a calming spa environment.',                                   '990 Cascade Ave SW, Atlanta, GA 30310',         '(404) 555-1389', 'restorewellness@example.com', 'https://restorewellness.example.com'),
  ('Inkwell Tattoo Collective','Tattoos',  'Custom tattoos in fine line, blackwork, traditional, and watercolor styles. Consultations required for large pieces.',                       '333 Edgewood Ave SE, Atlanta, GA 30312',        '(404) 555-1502', 'inkwell@example.com',         'https://inkwell.example.com'),
  ('Sacred Skin Studio',      'Tattoos',   'Specializing in melanin-rich skin tattoos, cover-ups, and scar camouflage. Appointment only.',                                              '210 Memorial Dr SE, Atlanta, GA 30312',         '(404) 555-1634', 'sacredskin@example.com',      NULL);

-- Seed reviews (user_id is NULL for seed data — these are not tied to real accounts)
INSERT INTO reviews (provider_id, user_id, author, rating, comment, date) VALUES
  -- Curl & Crown Studio
  ((SELECT id FROM providers WHERE name = 'Curl & Crown Studio'),     NULL, 'Destiny W.',   5, 'Best silk press I''ve ever had. My hair was so shiny and bouncy!',                                        '2025-11-14'),
  ((SELECT id FROM providers WHERE name = 'Curl & Crown Studio'),     NULL, 'Tanya R.',     5, 'She really knows how to handle 4c hair. Will not go anywhere else.',                                       '2025-10-02'),
  -- The Mane Event
  ((SELECT id FROM providers WHERE name = 'The Mane Event'),          NULL, 'Jasmine L.',   4, 'Great color job. The salon is very clean and welcoming.',                                                  '2025-09-20'),
  ((SELECT id FROM providers WHERE name = 'The Mane Event'),          NULL, 'Keisha B.',    5, 'Got a full install and it looks amazing. Booking my next appointment already.',                             '2025-08-15'),
  -- Lash Lab ATL
  ((SELECT id FROM providers WHERE name = 'Lash Lab ATL'),            NULL, 'Monique T.',   5, 'My lashes lasted over 4 weeks. So full and natural-looking.',                                              '2025-12-01'),
  ((SELECT id FROM providers WHERE name = 'Lash Lab ATL'),            NULL, 'Brianna H.',   4, 'Great technique. A little wait time but worth it.',                                                        '2025-11-05'),
  -- Flutter & Glam
  ((SELECT id FROM providers WHERE name = 'Flutter & Glam'),          NULL, 'Sierra M.',    5, 'The wet look set is everything! Got so many compliments.',                                                 '2025-10-18'),
  -- Arch Artistry
  ((SELECT id FROM providers WHERE name = 'Arch Artistry'),           NULL, 'Aaliyah J.',   5, 'My microblading healed perfectly. Looks so natural.',                                                      '2025-09-30'),
  ((SELECT id FROM providers WHERE name = 'Arch Artistry'),           NULL, 'Camille F.',   5, 'Brow lamination changed my life. Highly recommend.',                                                       '2025-07-12'),
  -- Pressed & Pretty
  ((SELECT id FROM providers WHERE name = 'Pressed & Pretty'),        NULL, 'Imani G.',     5, 'My custom set lasted three weeks without a chip. Obsessed!',                                              '2025-11-22'),
  ((SELECT id FROM providers WHERE name = 'Pressed & Pretty'),        NULL, 'Zoe A.',       4, 'Really cute nail art. She''s super creative.',                                                             '2025-10-30'),
  -- Luxe Nail Lounge
  ((SELECT id FROM providers WHERE name = 'Luxe Nail Lounge'),        NULL, 'Nadia P.',     5, 'The 3D flowers on my set were stunning. Worth every penny.',                                               '2025-12-05'),
  -- Fresh Cuts Barbershop
  ((SELECT id FROM providers WHERE name = 'Fresh Cuts Barbershop'),   NULL, 'Marcus D.',    5, 'Best fade in the city. My guy never misses.',                                                              '2025-11-28'),
  ((SELECT id FROM providers WHERE name = 'Fresh Cuts Barbershop'),   NULL, 'Devon K.',     5, 'Great atmosphere and the line-up was crispy. Coming back every week.',                                     '2025-10-14'),
  -- The Sharp Edge
  ((SELECT id FROM providers WHERE name = 'The Sharp Edge'),          NULL, 'Jordan T.',    4, 'Hot towel shave was relaxing. Clean shop, professional staff.',                                            '2025-09-08'),
  -- Glow Up Beauty
  ((SELECT id FROM providers WHERE name = 'Glow Up Beauty'),          NULL, 'Tiara N.',     5, 'She did my bridal makeup and I cried happy tears looking in the mirror. Perfection.',                     '2025-08-22'),
  ((SELECT id FROM providers WHERE name = 'Glow Up Beauty'),          NULL, 'Rae C.',       5, 'Airbrush foundation looked flawless in every photo. Booked again already.',                               '2025-07-04'),
  -- Queens Braiding Studio
  ((SELECT id FROM providers WHERE name = 'Queens Braiding Studio'),  NULL, 'Layla S.',     5, 'Knotless braids were so lightweight and neat. No tension at all.',                                        '2025-11-01'),
  ((SELECT id FROM providers WHERE name = 'Queens Braiding Studio'),  NULL, 'Fatima O.',    4, 'Goddess locs came out beautiful. Took a while but the result was worth it.',                              '2025-09-17'),
  -- African Heritage Braids
  ((SELECT id FROM providers WHERE name = 'African Heritage Braids'), NULL, 'Amara K.',     5, 'Fastest braider I''ve ever been to and the quality was incredible.',                                      '2025-10-25'),
  -- Restore Wellness Spa
  ((SELECT id FROM providers WHERE name = 'Restore Wellness Spa'),    NULL, 'Vanessa H.',   5, 'The hot stone massage melted away two weeks of stress. I floated out of there.',                         '2025-12-02'),
  ((SELECT id FROM providers WHERE name = 'Restore Wellness Spa'),    NULL, 'Deja M.',      5, 'Prenatal massage was so gentle and relieving. Will be back every month.',                                 '2025-11-10'),
  -- Inkwell Tattoo Collective
  ((SELECT id FROM providers WHERE name = 'Inkwell Tattoo Collective'),NULL, 'Elijah R.',   5, 'Fine line portrait came out better than I imagined. Healed beautifully.',                                '2025-10-07'),
  ((SELECT id FROM providers WHERE name = 'Inkwell Tattoo Collective'),NULL, 'Cassandra P.',4, 'Really talented artists. Consultation process made me feel very comfortable.',                            '2025-09-03'),
  -- Sacred Skin Studio
  ((SELECT id FROM providers WHERE name = 'Sacred Skin Studio'),      NULL, 'Renee V.',     5, 'She specializes in darker skin and it shows. My tattoo is vibrant and perfect.',                         '2025-11-19');
