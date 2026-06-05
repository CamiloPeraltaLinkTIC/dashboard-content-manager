CREATE TABLE IF NOT EXISTS content_manager_mapa_countries (
    id TEXT PRIMARY KEY,
    pais TEXT NOT NULL,
    emoji TEXT,
    lat NUMERIC,
    lng NUMERIC,
    tema TEXT,
    keywords JSONB, -- store array as jsonb
    sentimiento TEXT,
    sentimiento_pct JSONB,
    volumen NUMERIC,
    plataforma_dominante TEXT,
    plataformas JSONB,
    resumen TEXT,
    tendencia TEXT,
    pct_cambio NUMERIC,
    top_hashtags JSONB,
    update_time TEXT
);

CREATE TABLE IF NOT EXISTS content_manager_globe_markers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pais TEXT,
    ciudad TEXT,
    lat NUMERIC,
    lng NUMERIC,
    count_num INTEGER,
    tipo TEXT,
    narrativa TEXT,
    tendencia TEXT
);

-- Insert sample for Colombia
INSERT INTO content_manager_mapa_countries (id, pais, emoji, lat, lng, tema, keywords, sentimiento, sentimiento_pct, volumen, plataforma_dominante, plataformas, resumen, tendencia, pct_cambio, top_hashtags, update_time) VALUES
('CO', 'Colombia', '🇨🇴', 4.5, -74.3, 'Elecciones Presidenciales 2026 — CNE', '["CNE Colombia", "Elecciones2026", "CristianQuiroz", "VotoColombia", "TestigosElectorales"]', 'positivo', '{"positivo": 64, "neutral": 24, "negativo": 12}', 187400, 'TikTok', '{"X": 52000, "Instagram": 38000, "Facebook": 41000, "TikTok": 56400}', 'Alta conversación sobre el proceso electoral presidencial...', 'sube', 18.4, '["#Elecciones2026", "#CNEColombia", "#VotoColombia", "#25Mayo", "#DemocraciaCO"]', 'hace 3 min');

INSERT INTO content_manager_globe_markers (pais, ciudad, lat, lng, count_num, tipo, narrativa, tendencia) VALUES
('México', 'Ciudad de México', 19.4, -99.1, 3, 'Misión OEA', 'Interés creciente en modelo electoral colombiano', 'Positiva ↑');
