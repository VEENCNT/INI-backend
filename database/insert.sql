INSERT INTO users (username, login, password_hash) VALUES
('Иван Иванов', 'ivan_user', 'password123'),
('Анна Смирнова', 'anna_s', 'qwerty123'),
('Петр Петров', 'petr_p', 'ptr123'),
('Елена Сидорова', 'elena_s', 'pass1234'),
('Алексей Кузнецов', 'alex_k', 'user2026');

INSERT INTO biochemical_indicators (
    title,
    description,
    lower_reference_limit,
    upper_reference_limit,
    image_url,
    video_url,
    status,
    creator_id,
    created_at,
    formed_at
) VALUES
(
    'Крайне низкий Альбумин',
    'Серьезный дефицит основного белка крови.',
    0.00,
    25.00,
    'http://localhost:9000/media/albumin.png',
    'http://localhost:9000/media/albumin.mp4',
    'FORMED',
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'Низкое число Лимфоцитов',
    'Снижение уровня лимфоцитов, указывающее на иммунодефицит и нутритивный риск.',
    800.00,
    1200.00,
    'http://localhost:9000/media/lymphocytes.png',
    'http://localhost:9000/media/lymphocytes.mp4',
    'FORMED',
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'Нормальный Альбумин',
    'Оптимальный уровень сывороточного альбумина.',
    35.00,
    50.00,
    'http://localhost:9000/media/albumin.png',
    'http://localhost:9000/media/albumin.mp4',
    'FORMED',
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'Нормальный Холестерин',
    'Уровень общего холестерина в норме для расчета INI.',
    4.50,
    5.20,
    'http://localhost:9000/media/cholesterol.png',
    'http://localhost:9000/media/cholesterol.mp4',
    'FORMED',
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO likes (user_id, indicator_id) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 1),

(2, 2),
(3, 2),
(5, 2),

(1, 3),
(3, 3),
(4, 3),
(5, 3),

(1, 4),
(2, 4),
(4, 4);