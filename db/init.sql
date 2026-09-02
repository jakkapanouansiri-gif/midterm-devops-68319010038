CREATE TABLE IF NOT EXISTS computers (
    id SERIAL PRIMARY KEY,
    asset_code VARCHAR(50) NOT NULL UNIQUE,
    brand_model VARCHAR(100) NOT NULL,
    cpu VARCHAR(100) NOT NULL,
    ram_gb INTEGER NOT NULL,
    room VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL
);

INSERT INTO computers
(asset_code, brand_model, cpu, ram_gb, room, status)
VALUES
('PC001', 'Dell OptiPlex 7090', 'Intel Core i5-11500', 16, 'Room 301', 'ใช้งาน'),
('PC002', 'HP ProDesk 400', 'Intel Core i5-10500', 16, 'Room 301', 'ใช้งาน'),
('PC003', 'Lenovo ThinkCentre M720', 'Intel Core i7-8700', 32, 'Room 302', 'ส่งซ่อม')
ON CONFLICT (asset_code) DO NOTHING;