-- Tabla para los KPIs de Elecciones
CREATE TABLE IF NOT EXISTS content_manager_elecciones_kpis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    delta TEXT,
    trend TEXT CHECK (trend IN ('up', 'down', 'neutral')),
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Datos iniciales (migrando los mocks)
INSERT INTO content_manager_elecciones_kpis (label, value, delta, trend, progress) VALUES
('Potencial Electoral', '38.8M', '+2.4%', 'up', 70),
('Mesas Habilitadas', '115,432', '+1.1%', 'up', 70),
('Candidatos Presidenciales', '18', '+3', 'up', 70),
('Días para Elección', '247', NULL, 'neutral', 70);

-- Tabla para Calendario Electoral
CREATE TABLE IF NOT EXISTS content_manager_calendario_electoral (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fecha TEXT NOT NULL,
    evento TEXT NOT NULL,
    estado TEXT CHECK (estado IN ('completado', 'activo', 'pendiente', 'en-curso')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Datos iniciales
INSERT INTO content_manager_calendario_electoral (fecha, evento, estado) VALUES
('Ene 2026', 'Cierre inscripción candidatos', 'completado'),
('Feb 2026', 'Inicio campaña electoral', 'completado'),
('Mar 2026', 'Debate presidencial CNE', 'en-curso'),
('Abr 2026', 'Auditorías software votación', 'pendiente'),
('25 May 2026', 'Jornada electoral 1ra vuelta', 'pendiente'),
('Jun 2026', '2da vuelta (si aplica)', 'pendiente');
