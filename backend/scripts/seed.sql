-- =========================
-- SEED DATA
-- =========================

-- Seed tenants
INSERT INTO tenants (id, name, type, status, created_at, updated_at) VALUES
(1, 'NatWest Bank',      'bank',    'active', '2025-11-30 21:35:37.878', '2025-11-30 21:35:37.878'),
(2, 'Vodafone',          'telecom', 'active', '2025-11-30 21:52:52.556', '2025-11-30 21:52:52.556'),
(3, 'British Airways',   'airline', 'active', '2025-11-30 21:53:03.862', '2025-11-30 21:53:03.862'),
(4, 'Atlantic',          'airline', 'active', '2025-11-30 21:55:08.123', '2025-11-30 21:55:08.123'),
(5, 'Itihad',            'airline', 'active', '2025-11-30 21:55:17.297', '2025-11-30 21:55:17.297'),
(6, 'O2',                'telecom', 'active', '2025-11-30 21:55:48.507', '2025-11-30 21:55:48.507'),
(7, 'Jio',               'telecom', 'active', '2025-11-30 21:55:54.779', '2025-11-30 21:55:54.779'),
(8, 'Airtel',            'telecom', 'active', '2025-11-30 21:56:02.284', '2025-11-30 21:56:02.284'),
(9, 'EE',                'telecom', 'active', '2025-11-30 21:56:16.549', '2025-11-30 21:56:16.549');

-- Seed users
-- Note: extra users 1, 9, 10 are added so complaints can reference them
INSERT INTO users (id, tenant_id, email, password_hash, first_name, last_name, role)
VALUES
    -- helper admin user (you can change email later)
    (1, [null], 'admin@natwest.com',
     '$2b$10$ApuobMiy.6GJPOmiDsF9v.6h3HmsgxZKJS0H/YaMjvHtn5gQdmF7W',
     'Natwest', 'Admin', 'admin'),

    (2, 1, 'ij@gmail.com',
     '$2b$10$ApuobMiy.6GJPOmiDsF9v.6h3HmsgxZKJS0H/YaMjvHtn5gQdmF7W',
     'Sys', 'Ad', 'consumer'),

    (3, 2, 'mk@gmail.com',
     '$2b$10$i27WesAr2JrZXSUFlXA8MOFNkLzDnC83A2MawV7XlA3mRQMGeG3vK',
     'Mys', 'Adhuj', 'hm'),

    (4, 3, 'agent@natwest.com',
     '$2b$10$zlRwLMqpxPAi0Y76zFLJuOCyUL5bhds/H2Y.MZy15AagTC1j0XrB6',
     'John', 'Agent', 'hm'),

    (5, 2, 'support@natwest.com',
     '$2b$10$Wup33UbNhw5GK5TjN6jsL.KlJKGkHKJWGtEkJFpQpWQvo00zPMXDq',
     'Jane', 'Support', 'sp'),

    (6, 1, 'agent2@natwest.com',
     '$2b$10$E1xoppPOF/8eiCPNeMRSE.oOqQ6jLSV1dyR0oUkXo4W/mMsvEEzSa',
     'Jon', 'Support', 'ha'),

    (7, 1, 'support2@natwest.com',
     '$2b$10$70kZeaXThog3PPvcr/DeIusm6LaDuz8SyeKoI8NrcTNK6NaohZv5W',
     'Jon', 'Support', 'sp'),

    -- consumer for tenant 9 (EE), used in complaint 2
    (9, 9, 'consumer.ee@example.com',
     '$2b$10$ApuobMiy.6GJPOmiDsF9v.6h3HmsgxZKJS0H/YaMjvHtn5gQdmF7W',
     'EE', 'Consumer', 'consumer'),

    -- consumer for tenant 1 (NatWest), used in complaint 3
    (10, 1, 'consumer.natwest@example.com',
     '$2b$10$ApuobMiy.6GJPOmiDsF9v.6h3HmsgxZKJS0H/YaMjvHtn5gQdmF7W',
     'Natwest', 'Consumer', 'consumer');

-- Seed complaints
INSERT INTO complaints (
    id, tenant_id, consumer_id, title, description, category,
    status, priority, assigned_to,
    created_at, updated_at, resolved_at, closed_at
) VALUES
    (1, 1, 2,
     'No connection',
     '5 days no connection',
     NULL,
     'resolved', 'medium', 7,
     '2025-11-30 22:32:38.675',
     '2025-12-02 19:38:17.736672',
     '2025-12-02 19:38:17.733',
     NULL),

    (2, 9, 9,
     'Issue on network',
     'qwertyuiopasdfghjkl;''zxcv bnṃxjknejkvjwekvbwhjvhewvh wv ewnv,w',
     'Account problem',
     'logged', 'medium', NULL,
     '2025-12-02 19:26:29.708',
     '2025-12-02 19:26:29.708',
     NULL,
     NULL),

    (3, 1, 10,
     'New Complaint',
     'yfvewhvbewjvnewivnklbnrekbnrejkbnes nsjb jeskbnsjbjlbnerlkbnrekbkreb',
     'Card issue',
     'logged', 'low', NULL,
     '2025-12-02 19:28:35.395',
     '2025-12-02 19:28:35.395',
     NULL,
     NULL);

-- Seed complaint_updates
INSERT INTO complaint_updates (
    id, complaint_id, user_id, note, status_changed_to,
    is_resolution, consumer_confirmed, consumer_feedback, created_at
) VALUES
    (1, 1, 2,
     'Complaint logged by consumer',
     'logged',
     FALSE, NULL, NULL,
     '2025-11-30 22:32:38.888'),

    (2, 1, 6,
     'Complaint assigned to Jon Support',
     'assigned',
     FALSE, NULL, NULL,
     '2025-11-30 22:56:54.852'),

    (3, 2, 9,
     'Complaint logged by consumer',
     'logged',
     FALSE, NULL, NULL,
     '2025-12-02 19:26:29.776'),

    (4, 3, 10,
     'Complaint logged by consumer',
     'logged',
     FALSE, NULL, NULL,
     '2025-12-02 19:28:35.565');

