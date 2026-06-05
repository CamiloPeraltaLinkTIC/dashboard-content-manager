-- Tabla para la estrategia detallada de Cristian Quiroz (todas las pestañas extra)
CREATE TABLE IF NOT EXISTS content_manager_quiroz_strategy (
    id TEXT PRIMARY KEY, -- 'main'
    narrativa JSONB DEFAULT '{}',
    pilares JSONB DEFAULT '[]',
    noticias JSONB DEFAULT '[]',
    contenido JSONB DEFAULT '{}',
    conversacion JSONB DEFAULT '{}',
    pauta JSONB DEFAULT '[]'
);

-- Insertar datos iniciales basados en mock (simplificado para el script)
INSERT INTO content_manager_quiroz_strategy (id, narrativa, pilares, noticias, contenido, conversacion, pauta) VALUES
('main', 
 '{"gancho": "Cristian Quiroz lidera la transformación digital de la Registraduría con plenas garantías de transparencia.", "tipoConversacion": "Liderazgo + Tecnología + Transparencia", "mensajeClave": "Garantía total para la democracia del 2026.", "arco": [{"fase": "Expectativa", "tipo": "informativo", "mensaje": "Anuncio de las nuevas auditorías internacionales."}, {"fase": "Crecimiento", "tipo": "accion", "mensaje": "Despliegue regional de los kits de biometría."}, {"fase": "Clímax", "tipo": "resultado", "mensaje": "Éxito total en el primer simulacro nacional."}, {"fase": "Consolidación", "tipo": "confianza", "mensaje": "Respaldo unánime de los organismos internacionales."}]}',
 '[{"pilar": "Modernización", "icono": "💻", "color": "#2b82ee", "descripcion": "Uso de IA y biometría para blindar el voto."}, {"pilar": "Transparencia", "icono": "🔍", "color": "#f3b116", "descripcion": "Auditorías abiertas y datos en tiempo real."}, {"pilar": "Cercanía", "icono": "🤝", "color": "#2eb88a", "descripcion": "Diálogo permanente con partidos y ciudadanía."}]',
 '[{"medio": "El Tiempo", "titulo": "Quiroz garantiza que no habrá fallos en el escrutinio", "fecha": "Hace 2h", "categoria": "Electoral", "url": "#"}, {"medio": "Semana", "titulo": "El plan del Registrador para combatir la desinformación", "fecha": "Hace 4h", "categoria": "Seguridad", "url": "#"}]',
 '{"instagram": [{"formato": "Reel", "idea": "Detrás de cámaras: Cómo se protege tu voto", "tipo": "Orgánico"}], "facebook": [{"formato": "Video", "idea": "Tutorial de inscripción de cédulas", "tipo": "Educativo"}], "x": [{"formato": "Hilo", "idea": "10 mitos vs realidades sobre el software", "tipo": "Informativo"}], "tiktok": [{"formato": "Trend", "idea": "Mi día como registrador", "tipo": "Humor/Edu"}]}',
 '{"instagram": {"menciones": 1250, "sentimiento": 78, "volumePeak": "Martes 14:00", "topHashtags": ["#Quiroz", "#CNE"]}, "facebook": {"menciones": 850, "sentimiento": 62, "volumePeak": "Lunes 10:00", "topHashtags": ["#Registraduria", "#Voto"]}, "x": {"menciones": 4500, "sentimiento": 45, "volumePeak": "Jueves 18:00", "topHashtags": ["#SoftwareElectoral"]}, "tiktok": {"menciones": 3200, "sentimiento": 85, "volumePeak": "Miercoles 20:00", "topHashtags": ["#VotoJoven"]}}',
 '[{"formato": "Carousel", "objetivo": "Conversión", "presupuesto": "Alto", "cta": "Inscríbete aquí", "segmento": "Jóvenes 18-25", "plataforma": ["Instagram", "Facebook"]}]'
) ON CONFLICT (id) DO NOTHING;
