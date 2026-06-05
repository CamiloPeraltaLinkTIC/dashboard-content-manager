// =============================================================================
// CNE Colombia — Tablero de Narrativa — Extracted Mock Data
// Source: /assets/index-xQVWxsuZ.js (Vite bundle, 1.4MB)
// Extracted: 2026-06-03
// =============================================================================

// =============================================================================
// 1. NAVIGATION / SIDEBAR
// =============================================================================

// Icon names reference the original lucide-react icon components:
//   Wj = Vote (ballot box), $j = ShieldCheck, QR = Scale, tO = UserRound,
//   fc = Newspaper, zj = Share2, kp = Globe2
export const sidebarItems = [
  { path: "/elecciones", label: "Elecciones Presidenciales 2026", icon: "Vote", badge: "HOT" },
  { path: "/testigos", label: "Testigos Electorales", icon: "ShieldCheck" },
  { path: "/legitimidad", label: "Legitimidad y Transparencia", icon: "Scale" },
  { path: "/quiroz", label: "Cristian Quiroz", icon: "UserRound" },
  { path: "/medios", label: "Conversación en Medios", icon: "Newspaper" },
  { path: "/social", label: "Conversación en Redes", icon: "Share2", badge: "LIVE" },
  { path: "/mapa", label: "Mapa Global", icon: "Globe2", badge: "NEW" },
  { path: "/admin", label: "Administración", icon: "Settings" },
];

// Routes (wouter hash router):
// "/" and "/elecciones" => same component (mP)
// "/testigos" => Vue
// "/legitimidad" => $ue
// "/quiroz" => Yue
// "/medios" => Que
// "/social" => rfe
// "/mapa" => ade
// fallback => 404

// =============================================================================
// 2. COLOR SCHEME / THEME TOKENS
// =============================================================================

export const colors = {
  primary: "hsl(213, 85%, 55%)",       // Blue — informativa, institucional, convocatoria
  accent: "hsl(42, 90%, 52%)",          // Gold — emocional, impacto, liderazgo
  success: "hsl(160, 60%, 45%)",        // Green — institucional, formacion, proactividad
  danger: "hsl(0, 72%, 55%)",           // Red — urgencia, contranarativa
  purple: "hsl(280, 65%, 60%)",         // Purple — emocional, tecnologia

  // Platform colors
  instagram: "#E1306C",
  facebook: "#1877f2",
  x: "#fff",
  tiktok: "#69C9D0",

  // Sentiment colors
  positivo: "#4ade80",
  negativo: "#f87171",
  neutral: "#888",

  // Background tones (from CSS)
  cardBg: "hsl(222, 30%, 12%)",
  surfaceBg: "hsl(222, 40%, 9%)",
  borderColor: "hsl(222, 30%, 18%)",
};

// Narrative arc type -> color mapping
export const narrativeTypeColors: Record<string, string> = {
  informativa: colors.primary,
  emocional: colors.purple,
  movilizadora: colors.accent,
  institucional: colors.success,
  convocatoria: colors.primary,
  impacto: colors.accent,
  legitimacion: colors.success,
  demostracion: colors.primary,
  proactividad: colors.success,
  contranarativa: colors.danger,
  liderazgo: colors.accent,
  cercania: colors.success,
  posicionamiento: colors.primary,
  formacion: colors.success,
  urgencia: colors.danger,
  humanizacion: colors.purple,
};

// News category -> color mapping
export const newsCategoryColors: Record<string, string> = {
  institucional: colors.primary,
  auditoria: colors.primary,
  tecnologia: colors.purple,
  testigos: colors.success,
  desinformacion: colors.danger,
  exterior: colors.accent,
  convocatoria: colors.primary,
  internacional: colors.success,
  reconocimiento: colors.accent,
  innovacion: colors.purple,
  capacitacion: colors.success,
  indice: colors.accent,
  veeduria: colors.primary,
  debate: colors.purple,
  declaracion: colors.primary,
  defensa: colors.danger,
  anuncio: colors.success,
  respuesta: colors.accent,
  entrevista: colors.purple,
  fact_check: colors.danger,
};

// =============================================================================
// 3. SOCIAL URLS (CNE official accounts)
// =============================================================================

export const socialUrls = {
  facebook: "https://web.facebook.com/consejonacionalelectoral",
  instagram: "https://www.instagram.com/cne_colombia/",
  tiktok: "https://www.tiktok.com/@consejonacionalelectoral",
  x: "https://x.com/CNE_COLOMBIA",
};

// =============================================================================
// 4. ELECTIONS PAGE DATA (/elecciones)
// =============================================================================

export const eleccionesKpis = [
  { label: "Potencial Electoral", value: "38.8M", delta: "+2.4%", trend: "up" as const },
  { label: "Mesas Habilitadas", value: "115,432", delta: "+1.1%", trend: "up" as const },
  { label: "Candidatos Presidenciales", value: "18", delta: "+3", trend: "up" as const },
  { label: "Días para Elección", value: "247", delta: null, trend: "neutral" as const },
];

export const participacionHistorica = [
  { año: "2006", pct: 45.1 },
  { año: "2010", pct: 49.3 },
  { año: "2014", pct: 47.9 },
  { año: "2018", pct: 53 },
  { año: "2022", pct: 58.1 },
  { año: "2026", pct: 61.2 },
];

export const calendarioElectoral = [
  { fecha: "Ene 2026", evento: "Cierre inscripción candidatos", estado: "completado" as const },
  { fecha: "Feb 2026", evento: "Inicio campaña electoral", estado: "completado" as const },
  { fecha: "Mar 2026", evento: "Debate presidencial CNE", estado: "activo" as const },
  { fecha: "Abr 2026", evento: "Auditorías software votación", estado: "pendiente" as const },
  { fecha: "25 May 2026", evento: "Jornada electoral 1ra vuelta", estado: "pendiente" as const },
  { fecha: "Jun 2026", evento: "2da vuelta (si aplica)", estado: "pendiente" as const },
];

export const estadoLabels = {
  completado: { color: "#4ade80", label: "Completado" },
  activo: { color: "hsl(42,90%,52%)", label: "En curso" },
  pendiente: { color: "#555", label: "Pendiente" },
};

// Each page has sub-tabs with this structure (elections version shown):
export const eleccionesTabs = [
  { key: "overview", label: "📊 Panorama" },
  { key: "narrativa", label: "📖 Narrativa" },
  { key: "pilares", label: "🏛️ Pilares" },
  { key: "noticias", label: "📰 Noticias" },
  { key: "contenido", label: "🎨 Ideas de Contenido" },
  { key: "conversacion", label: "💬 Conversación en Redes" },
  { key: "pauta", label: "📣 Ideas para Pauta" },
];

// =============================================================================
// 5. NARRATIVE DATA (gancho + arco) — per topic
// =============================================================================

export const narrativaElecciones = {
  gancho: "El voto de cada colombiano construye el futuro del país. Las Elecciones Presidenciales 2026 son el momento más importante de la democracia colombiana en esta década.",
  tipoConversacion: "Informativa + Emocional + Movilizadora",
  mensajeClave: "El CNE garantiza elecciones limpias, transparentes y accesibles para todos los colombianos. Tu voto vale, y nosotros lo protegemos.",
  arco: [
    { fase: "Educación electoral", mensaje: "¿Sabes cómo funciona tu voto? Te explicamos todo.", tipo: "informativa" },
    { fase: "Confianza institucional", mensaje: "El CNE trabaja para que cada voto cuente.", tipo: "emocional" },
    { fase: "Movilización", mensaje: "El 25 de mayo, Colombia decide. ¡Participa!", tipo: "movilizadora" },
    { fase: "Legitimación", mensaje: "Los resultados son el reflejo fiel de tu voluntad.", tipo: "institucional" },
  ],
};

export const narrativaTestigos = {
  gancho: "Más de 142.000 colombianos y observadores internacionales velan porque tu voto sea respetado. Los testigos electorales son los guardianes de la democracia.",
  tipoConversacion: "Institucional + Movilizadora + De confianza",
  mensajeClave: "Ser testigo electoral es el acto más directo de defensa de la democracia. El CNE forma, acredita y despliega la red de vigilancia más grande de la historia electoral colombiana.",
  arco: [
    { fase: "Convocatoria", mensaje: "¿Quieres ser testigo electoral? Te decimos cómo.", tipo: "convocatoria" },
    { fase: "Formación", mensaje: "Los testigos del CNE son los más capacitados del país.", tipo: "institucional" },
    { fase: "Despliegue", mensaje: "142.800 ojos vigilando cada mesa de votación.", tipo: "impacto" },
    { fase: "Confianza", mensaje: "Con testigos en cada mesa, el resultado es inobjetable.", tipo: "legitimacion" },
  ],
};

export const narrativaLegitimidad = {
  gancho: "El proceso electoral colombiano 2026 cuenta con los más altos estándares de transparencia y seguridad de su historia. El CNE no solo lo garantiza — lo demuestra.",
  tipoConversacion: "Institucional + Defensiva + Proactiva",
  mensajeClave: "El CNE Colombia actúa con total transparencia: auditorías abiertas, software verificado, cadena de custodia trazable y veeduría internacional. La legitimidad del proceso es inobjetable.",
  arco: [
    { fase: "Demostración", mensaje: "Así auditamos el software electoral de forma pública y verificable.", tipo: "demostracion" },
    { fase: "Certificación", mensaje: "El CNE cumple estándares internacionales ISO y OEA.", tipo: "institucional" },
    { fase: "Proactividad", mensaje: "Publicamos todo antes de que nos pregunten.", tipo: "proactividad" },
    { fase: "Contra-narrativa", mensaje: "Combatimos la desinformación con datos y hechos verificables.", tipo: "contranarativa" },
  ],
};

export const narrativaQuiroz = {
  gancho: "Cristian Quiroz lidera el CNE en el año electoral más importante de Colombia. Su presencia pública es clave para humanizar la institución y generar confianza en el proceso.",
  tipoConversacion: "Institucional + Personal + Liderazgo",
  mensajeClave: "Cristian Quiroz es el garante de que las Elecciones Presidenciales 2026 sean las más transparentes de la historia. Su liderazgo representa el compromiso del CNE con todos los colombianos.",
  arco: [
    { fase: "Presentación institucional", mensaje: "Quién es el presidente del CNE y qué hace.", tipo: "informativa" },
    { fase: "Liderazgo en acción", mensaje: "Cristian Quiroz supervisa personalmente las auditorías.", tipo: "liderazgo" },
    { fase: "Comunicación directa", mensaje: "El presidente del CNE le habla directamente a los ciudadanos.", tipo: "cercania" },
    { fase: "Posicionamiento", mensaje: "La voz de la institucionalidad electoral colombiana.", tipo: "posicionamiento" },
  ],
};

// =============================================================================
// 6. PILARES (strategy pillars) — per topic
// =============================================================================

export const pilaresElecciones = [
  { pilar: "Transparencia del proceso", descripcion: "Auditorías, cadena de custodia, software verificado y veeduría ciudadana.", icono: "🛡️", color: "hsl(213,85%,55%)" },
  { pilar: "Participación ciudadana", descripcion: "Movilización del censo electoral de 38.8M colombianos para ejercer el voto.", icono: "🗳️", color: "hsl(42,90%,52%)" },
  { pilar: "Educación electoral", descripcion: "Conoce tus derechos, el proceso de votación y cómo reportar irregularidades.", icono: "📚", color: "hsl(160,60%,45%)" },
  { pilar: "Equidad en campaña", descripcion: "Vigilancia de topes de campaña, financiación y publicidad electoral.", icono: "⚖️", color: "hsl(280,65%,60%)" },
  { pilar: "Candidatos y partidos", descripcion: "18 fórmulas presidenciales inscritas, representación plural de la democracia colombiana.", icono: "👥", color: "hsl(0,72%,55%)" },
];

export const pilaresTestigos = [
  { pilar: "Formación y capacitación", descripcion: "Cursos virtuales y presenciales del CNE para testigos en todo el país.", icono: "🎓", color: "hsl(213,85%,55%)" },
  { pilar: "Acreditación oficial", descripcion: "Proceso de acreditación transparente con 98.430 testigos ya habilitados.", icono: "✅", color: "hsl(42,90%,52%)" },
  { pilar: "Red internacional", descripcion: "12 países y organismos como OEA, Carter Center y Misión UE observan las elecciones.", icono: "🌍", color: "hsl(160,60%,45%)" },
  { pilar: "Cobertura total", descripcion: "Los 32 departamentos y 1.122 municipios de Colombia cubiertos por la red de testigos.", icono: "📍", color: "hsl(280,65%,60%)" },
];

export const pilaresLegitimidad = [
  { pilar: "Auditorías técnicas públicas", descripcion: "Auditorías abiertas al software Smartmatic y la plataforma de resultados.", icono: "🔍", color: "hsl(213,85%,55%)" },
  { pilar: "Cadena de custodia", descripcion: "Trazabilidad completa del voto desde la urna hasta el escrutinio final.", icono: "🔗", color: "hsl(42,90%,52%)" },
  { pilar: "Certificaciones internacionales", descripcion: "ISO 27001, certificación OEA, auditoría BID Electoral vigentes.", icono: "🏅", color: "hsl(160,60%,45%)" },
  { pilar: "Veeduría ciudadana", descripcion: "Participación activa de MOE, partidos políticos y sociedad civil en el control.", icono: "👁️", color: "hsl(280,65%,60%)" },
  { pilar: "Combate a la desinformación", descripcion: "Sala de monitoreo del CNE con respuesta proactiva a noticias falsas sobre el proceso.", icono: "🛡️", color: "hsl(0,72%,55%)" },
];

export const pilaresQuiroz = [
  { pilar: "Liderazgo visible e institucional", descripcion: "Apariciones públicas, declaraciones y ruedas de prensa que humanicen al CNE.", icono: "🎙️", color: "hsl(213,85%,55%)" },
  { pilar: "Vocero técnico de confianza", descripcion: "Cristian Quiroz explica en lenguaje ciudadano los aspectos técnicos del proceso.", icono: "📊", color: "hsl(42,90%,52%)" },
  { pilar: "Presencia en medios", descripcion: "89 apariciones en medios nacionales en lo que va del año, presencia equilibrada.", icono: "📺", color: "hsl(160,60%,45%)" },
  { pilar: "Gestión de crisis comunicacional", descripcion: "Respuesta rápida y proactiva ante críticas, rumores y desinformación institucional.", icono: "⚡", color: "hsl(0,72%,55%)" },
];

// =============================================================================
// 7. NEWS ARTICLES — per topic
// =============================================================================

export const noticiasElecciones = [
  { titulo: "CNE inscribe 18 fórmulas presidenciales para las elecciones del 25 de mayo", medio: "El Tiempo", fecha: "02 Jun 2026", url: "#", categoria: "institucional" },
  { titulo: "Debate presidencial organizado por el CNE: fechas y formatos confirmados", medio: "Semana", fecha: "01 Jun 2026", url: "#", categoria: "debate" },
  { titulo: "Smartmatic y el CNE cierran auditoría técnica del software electoral", medio: "Caracol Radio", fecha: "31 May 2026", url: "#", categoria: "tecnologia" },
  { titulo: "Registro de testigos electorales supera los 98.000 acreditados", medio: "RCN Noticias", fecha: "30 May 2026", url: "#", categoria: "testigos" },
  { titulo: "CNE advierte sobre desinformación electoral en redes sociales", medio: "Blu Radio", fecha: "29 May 2026", url: "#", categoria: "desinformacion" },
  { titulo: "Mesas en el exterior: 28 países participarán en elecciones colombianas 2026", medio: "La W", fecha: "28 May 2026", url: "#", categoria: "exterior" },
];

export const noticiasTestigos = [
  { titulo: "CNE lanza segunda convocatoria de testigos electorales departamentales", medio: "El Colombiano", fecha: "02 Jun 2026", url: "#", categoria: "convocatoria" },
  { titulo: "Misión de observación de la OEA confirma 12 integrantes para Colombia 2026", medio: "El Espectador", fecha: "01 Jun 2026", url: "#", categoria: "internacional" },
  { titulo: "Centro Carter felicita al CNE por la transparencia en el proceso de acreditación", medio: "Semana", fecha: "31 May 2026", url: "#", categoria: "reconocimiento" },
  { titulo: "Testigos electorales digitales: cómo reportar irregularidades desde el celular", medio: "La Silla Vacía", fecha: "30 May 2026", url: "#", categoria: "innovacion" },
  { titulo: "MOE Colombia capacita a 8.000 nuevos testigos electorales para el 25 de mayo", medio: "RCN Radio", fecha: "29 May 2026", url: "#", categoria: "capacitacion" },
];

export const noticiasLegitimidad = [
  { titulo: "CNE publica informe completo de auditoría del software electoral 2026", medio: "El Tiempo", fecha: "02 Jun 2026", url: "#", categoria: "auditoria" },
  { titulo: "Indice de transparencia electoral Colombia 2026 sube a 81/100 según BID", medio: "Portafolio", fecha: "01 Jun 2026", url: "#", categoria: "indice" },
  { titulo: "CNE activa sala de desmentidos para combatir desinformación electoral", medio: "La Silla Vacía", fecha: "31 May 2026", url: "#", categoria: "desinformacion" },
  { titulo: "Veeduría electoral acredita a 47 organizaciones de sociedad civil para el 25 de mayo", medio: "El Espectador", fecha: "30 May 2026", url: "#", categoria: "veeduria" },
  { titulo: "Colombia recibe reconocimiento internacional por transparencia electoral 2026", medio: "Semana", fecha: "29 May 2026", url: "#", categoria: "reconocimiento" },
];

export const noticiasQuiroz = [
  { titulo: "Quiroz: «Las elecciones 2026 tendrán el mayor nivel de veeduría en la historia de Colombia»", medio: "El Tiempo", fecha: "02 Jun 2026", url: "#", categoria: "declaracion" },
  { titulo: "Presidente del CNE defiende software Smartmatic ante cuestionamientos del Congreso", medio: "Semana", fecha: "01 Jun 2026", url: "#", categoria: "defensa" },
  { titulo: "Cristian Quiroz anuncia apertura de más puestos de votación en zonas rurales", medio: "Caracol Radio", fecha: "31 May 2026", url: "#", categoria: "anuncio" },
  { titulo: "El CNE bajo la lupa: Quiroz responde a las críticas de los partidos de oposición", medio: "La W", fecha: "30 May 2026", url: "#", categoria: "respuesta" },
  { titulo: "Quiroz en entrevista exclusiva: «Quien cometa fraude electoral irá a la cárcel»", medio: "Blu Radio", fecha: "29 May 2026", url: "#", categoria: "entrevista" },
];

// =============================================================================
// 8. CONTENT IDEAS (organic) — per topic, per platform
// =============================================================================

export const contenidoElecciones = {
  instagram: [
    { formato: "Carrusel", idea: "«Todo lo que necesitas saber antes del 25 de mayo» — 10 slides educativos sobre el proceso electoral", tipo: "educativo" },
    { formato: "Reels 30s", idea: "Timelapse del recorrido de un voto: desde la urna hasta el escrutinio", tipo: "narrativo" },
    { formato: "Stories interactivas", idea: "Quiz: ¿Cuánto sabes del proceso electoral colombiano? con sticker de encuesta", tipo: "interaccion" },
    { formato: "Infografía estática", idea: "El mapa de Colombia con los departamentos y su potencial electoral 2026", tipo: "datos" },
  ],
  facebook: [
    { formato: "Video explicativo 2min", idea: "El presidente del CNE explica en detalle cómo se protege el voto", tipo: "institucional" },
    { formato: "Álbum fotográfico", idea: "Detrás de cámaras: preparativos logísticos del CNE para las elecciones", tipo: "humanizacion" },
    { formato: "Facebook Live", idea: "Mesa redonda: «¿Es seguro votar en Colombia?» con expertos electorales", tipo: "debate" },
    { formato: "Post informativo", idea: "Cronología completa del proceso electoral 2026 con fechas clave", tipo: "informativo" },
  ],
  x: [
    { formato: "Hilo (Thread)", idea: "HILO: Todo lo que pasa desde que depositas tu voto hasta que se cuentan los resultados 🧵", tipo: "educativo" },
    { formato: "Tweet con dato", idea: "38.8 millones de colombianos pueden votar el #25Mayo. ¿Tienes tu cédula al día? #Elecciones2026", tipo: "datos" },
    { formato: "Respuesta proactiva", idea: "Monitoreo de hashtags y respuesta a preguntas frecuentes sobre el proceso", tipo: "atencion" },
    { formato: "Cita visual", idea: "Frase destacada del debate presidencial acompañada de diseño institucional", tipo: "debate" },
  ],
  tiktok: [
    { formato: "Video educativo 60s", idea: "«¿Cómo votar en Colombia? Guía en 60 segundos» con texto animado y música trending", tipo: "educativo" },
    { formato: "Duet/Stitch", idea: "Responder videos virales con desinformación electoral con la versión oficial del CNE", tipo: "contranarativa" },
    { formato: "Behind the scenes", idea: "Un día en el CNE: así preparamos las elecciones (POV del funcionario)", tipo: "humanizacion" },
    { formato: "Tendencia adaptada", idea: "Usar sonido/trend viral para explicar el conteo de votos de forma entretenida", tipo: "viral" },
  ],
};

export const contenidoTestigos = {
  instagram: [
    { formato: "Reels 45s", idea: "«Ser testigo electoral en 3 pasos» — video animado con música motivadora", tipo: "convocatoria" },
    { formato: "Carrusel educativo", idea: "«Mitos y verdades sobre los testigos electorales» — 8 slides desmintiendo desinformación", tipo: "educativo" },
    { formato: "Story countdown", idea: "Cuenta regresiva para el cierre de inscripciones con sticker de preguntas", tipo: "urgencia" },
    { formato: "Foto + copy", idea: "Galería de testigos de diferentes regiones con su testimonio personal", tipo: "humanizacion" },
  ],
  facebook: [
    { formato: "Facebook Live", idea: "Sesión de preguntas y respuestas con el equipo de testigos electorales del CNE", tipo: "interaccion" },
    { formato: "Video testimonial", idea: "«Mi primera experiencia como testigo electoral» — historias reales de testigos 2022", tipo: "testimonial" },
    { formato: "Evento virtual", idea: "Capacitación gratuita para testigos electorales transmitida en vivo por FB", tipo: "formacion" },
    { formato: "Infografía compartible", idea: "Mapa de Colombia con el número de testigos por departamento", tipo: "datos" },
  ],
  x: [
    { formato: "Hilo con datos", idea: "HILO: Los números de la red de testigos más grande de Colombia en 2026 🗺️🧵", tipo: "datos" },
    { formato: "Convocatoria directa", idea: "¿Eres de Bogotá, Medellín o Cali? Necesitamos testigos. Inscríbete en [link] #TestigosElectorales", tipo: "convocatoria" },
    { formato: "Reconocimiento", idea: "Retweet + destacar a testigos que comparten su experiencia con el hashtag", tipo: "comunidad" },
    { formato: "Update en tiempo real", idea: "Contador en vivo de testigos acreditados el día de las elecciones", tipo: "tiempo_real" },
  ],
  tiktok: [
    { formato: "Video POV", idea: "«POV: Eres testigo electoral por primera vez» — día completo de elecciones", tipo: "inmersivo" },
    { formato: "Dueto con ciudadanos", idea: "Responder a la pregunta ¿Para qué sirven los testigos? con la respuesta oficial del CNE", tipo: "educativo" },
    { formato: "Challenge", idea: "#SoyTestigoElectoral — reto viral para que testigos compartan por qué se inscribieron", tipo: "viral" },
    { formato: "Mini documental", idea: "3 partes: formación, despliegue y jornada electoral desde la perspectiva de un testigo", tipo: "narrativo" },
  ],
};

export const contenidoLegitimidad = {
  instagram: [
    { formato: "Carrusel técnico visual", idea: "«Paso a paso: así auditamos el software electoral» — infografía simplificada para ciudadanos", tipo: "educativo" },
    { formato: "Reels explicativos", idea: "«¿Qué es la cadena de custodia del voto?» en 45 segundos con animación", tipo: "explicativo" },
    { formato: "Stories Q&A", idea: "Responder en stories preguntas frecuentes sobre seguridad del proceso electoral", tipo: "interaccion" },
    { formato: "Certificaciones highlight", idea: "Serie de posts «Somos el proceso más auditado de Colombia» con badges de certificación", tipo: "branding" },
  ],
  facebook: [
    { formato: "Live con expertos", idea: "«La seguridad del voto en Colombia 2026» — panel con auditores y representantes CNE", tipo: "debate" },
    { formato: "Video de desmitificación", idea: "«Top 5 fake news sobre las elecciones 2026: la verdad del CNE»", tipo: "fact-check" },
    { formato: "Documento descargable", idea: "Publicación del informe de auditoría con resumen ejecutivo para ciudadanos", tipo: "transparencia" },
    { formato: "Album fotográfico", idea: "Galería del proceso de auditoría técnica con acceso de periodistas y partidos", tipo: "evidencia" },
  ],
  x: [
    { formato: "Thread fact-check", idea: "HILO: Desmentimos los 10 rumores más virales sobre las elecciones 2026 con fuentes 🧵", tipo: "fact-check" },
    { formato: "Datos en tiempo real", idea: "Live tweeting durante la jornada de auditoría pública del software", tipo: "transparencia" },
    { formato: "Sello institucional", idea: "Respuesta rápida etiquetada como #VerificadoCNE a desinformación viral", tipo: "contranarativa" },
    { formato: "Reconocimientos", idea: "Compartir reconocimientos internacionales al proceso electoral colombiano", tipo: "legitimacion" },
  ],
  tiktok: [
    { formato: "Video de realidad del proceso", idea: "«Lo que los medios NO te muestran de las auditorías electorales» — acceso exclusivo", tipo: "exclusivo" },
    { formato: "Explicación trending", idea: "Usar formato trending para explicar «¿Por qué es imposible hacer fraude en Colombia?»", tipo: "viral" },
    { formato: "Reacción + fact-check", idea: "Reaccionar a videos virales con desinformación y mostrar la realidad del proceso", tipo: "contranarativa" },
    { formato: "Mini documental", idea: "«72 horas antes de las elecciones: preparativos del CNE» — acceso interno exclusivo", tipo: "humanizacion" },
  ],
};

export const contenidoQuiroz = {
  instagram: [
    { formato: "Reels entrevista corta", idea: "Cortes de 30–45 segundos de las mejores declaraciones de Quiroz en medios", tipo: "declaracion" },
    { formato: "Foto editorial", idea: "Sesión fotográfica del presidente del CNE en las instalaciones y en campo", tipo: "imagen" },
    { formato: "Stories behind-the-scenes", idea: "Un día normal del presidente del CNE supervisando operativos electorales", tipo: "humanizacion" },
    { formato: "Carrusel de logros", idea: "«Lo que hemos logrado en los primeros 6 meses del año electoral»", tipo: "rendicion_cuentas" },
  ],
  facebook: [
    { formato: "Video declaración", idea: "Mensajes directos de Cristian Quiroz a los colombianos sobre el proceso electoral", tipo: "institucional" },
    { formato: "Live Q&A", idea: "El presidente del CNE responde en vivo preguntas ciudadanas sobre las elecciones", tipo: "interaccion" },
    { formato: "Nota biográfica con video", idea: "«Quién es Cristian Quiroz» — presentación humanizada del presidente del CNE", tipo: "presentacion" },
    { formato: "Cobertura ruedas de prensa", idea: "Transmisión en vivo de las principales ruedas de prensa del CNE", tipo: "prensa" },
  ],
  x: [
    { formato: "Citas textuales", idea: "Las mejores frases de Quiroz en declaraciones públicas con diseño visual institucional", tipo: "citas" },
    { formato: "Hilo declaración", idea: "HILO: Los puntos clave de la declaración del presidente del CNE de hoy 🧵", tipo: "comunicado" },
    { formato: "Posición institucional", idea: "Respuesta oficial del CNE / Quiroz a críticas virales con datos y argumentos", tipo: "respuesta" },
    { formato: "Agenda pública", idea: "Publicar la agenda pública semanal de Quiroz para transparentar su gestión", tipo: "transparencia" },
  ],
  tiktok: [
    { formato: "Clip declaración trending", idea: "Los mejores cortes de Quiroz con subtítulos en gran formato, estilo TikTok news", tipo: "noticias" },
    { formato: "Explainer en primera persona", idea: "Quiroz explica directamente en TikTok cómo funciona el CNE en 60 segundos", tipo: "directo" },
    { formato: "Reacción a preguntas ciudadanas", idea: "Quiroz reacciona y responde a las preguntas más populares del proceso electoral", tipo: "interaccion" },
    { formato: "Día a día del presidente CNE", idea: "«Así es un día de trabajo antes de las elecciones» — vlog institucional", tipo: "humanizacion" },
  ],
};

// =============================================================================
// 9. SOCIAL CONVERSATION DATA — per topic (platform-level metrics)
// =============================================================================

export const conversacionElecciones = {
  instagram: { menciones: 28_400, sentimiento: 68, topHashtags: ["#Elecciones2026", "#VotoColombia", "#CNEColombia", "#DemocraciaCO"], volumePeak: "Viernes 18h–20h" },
  facebook: { menciones: 41_200, sentimiento: 62, topHashtags: ["#Elecciones2026Colombia", "#PresidencialesCO", "#VotaEnPaz"], volumePeak: "Miércoles 12h–14h" },
  x: { menciones: 89_700, sentimiento: 54, topHashtags: ["#Elecciones2026", "#Colombia2026", "#CNE_COLOMBIA", "#Voto"], volumePeak: "Lunes 9h–11h" },
  tiktok: { menciones: 156_000, sentimiento: 71, topHashtags: ["#Elecciones2026", "#VotemosJuntos", "#ColombiaVota", "#25Mayo"], volumePeak: "Viernes–Sábado 20h–22h" },
};

export const conversacionTestigos = {
  instagram: { menciones: 8_200, sentimiento: 74, topHashtags: ["#TestigosElectorales", "#CNEColombia", "#Elecciones2026"], volumePeak: "Martes–Jueves 17h–19h" },
  facebook: { menciones: 12_400, sentimiento: 70, topHashtags: ["#TestigosElectorales2026", "#VeedoriaElectoral"], volumePeak: "Martes 10h–12h" },
  x: { menciones: 19_800, sentimiento: 65, topHashtags: ["#TestigosElectorales", "#CNE_COLOMBIA", "#DemocraciaCO"], volumePeak: "Lunes–Miércoles 8h–10h" },
  tiktok: { menciones: 43_000, sentimiento: 78, topHashtags: ["#TestigoElectoral", "#ColombiaVota", "#Elecciones2026CO"], volumePeak: "Jueves–Sábado 19h–21h" },
};

export const conversacionLegitimidad = {
  instagram: { menciones: 14_200, sentimiento: 72, topHashtags: ["#TransparenciaElectoral", "#CNEColombia", "#VotoSeguro"], volumePeak: "Miércoles–Jueves 16h–18h" },
  facebook: { menciones: 22_800, sentimiento: 67, topHashtags: ["#EleccionesTransparentes", "#AuditoriaElectoral", "#CNE2026"], volumePeak: "Martes 9h–11h" },
  x: { menciones: 38_400, sentimiento: 59, topHashtags: ["#TransparenciaElectoral", "#AuditoriaSmartmatic", "#CNE_COLOMBIA"], volumePeak: "Lunes 8h–10h / Viernes 14h" },
  tiktok: { menciones: 67_000, sentimiento: 74, topHashtags: ["#VotoSeguro", "#CNEColombia", "#NoAlFraude", "#Elecciones2026"], volumePeak: "Sábado–Domingo 19h–22h" },
};

export const conversacionQuiroz = {
  instagram: { menciones: 6_800, sentimiento: 64, topHashtags: ["#CristianQuiroz", "#CNEColombia", "#PresidenteCNE"], volumePeak: "Martes–Jueves 11h–13h" },
  facebook: { menciones: 9_200, sentimiento: 60, topHashtags: ["#Quiroz", "#CNEColombia", "#ConsejoNacionalElectoral"], volumePeak: "Miércoles 14h–16h" },
  x: { menciones: 21_400, sentimiento: 52, topHashtags: ["#Quiroz", "#CNE_COLOMBIA", "#PresidenteCNE", "#TransparenciaElectoral"], volumePeak: "Lunes–Martes 9h–11h" },
  tiktok: { menciones: 38_000, sentimiento: 69, topHashtags: ["#CristianQuiroz", "#CNEColombia", "#Elecciones2026"], volumePeak: "Viernes–Sábado 18h–21h" },
};

// =============================================================================
// 10. PAID ADVERTISING IDEAS (pauta) — per topic
// =============================================================================

export const pautaElecciones = [
  { formato: "Video 15s", objetivo: "Recordación de fecha", plataforma: ["Facebook", "Instagram"], cta: "El 25 de mayo es tu día — ¡Vota!", segmento: "Colombianos 18–35 años", presupuesto: "Awareness" },
  { formato: "Carrusel patrocinado", objetivo: "Educación electoral", plataforma: ["Instagram", "Facebook"], cta: "Aprende cómo votar", segmento: "Primera vez votantes", presupuesto: "Educacion" },
  { formato: "Video in-feed", objetivo: "Contra desinformación", plataforma: ["TikTok"], cta: "Conoce la verdad sobre el proceso", segmento: "18–29 años", presupuesto: "Defensa narrativa" },
  { formato: "Promoted tweet", objetivo: "Posicionamiento institucional", plataforma: ["X/Twitter"], cta: "El CNE garantiza tu voto", segmento: "Periodistas y líderes de opinión", presupuesto: "Influencia" },
];

export const pautaTestigos = [
  { formato: "Video 20s convocatoria", objetivo: "Inscripción testigos", plataforma: ["Facebook", "Instagram"], cta: "Inscríbete ahora → cnecolombia.gov.co", segmento: "18–45 años, activos políticamente", presupuesto: "Captacion" },
  { formato: "Video storytelling", objetivo: "Elevar percepción positiva", plataforma: ["TikTok"], cta: "Sé parte del cambio", segmento: "Gen Z 18–24 años", presupuesto: "Branding" },
  { formato: "Banner remarketing", objetivo: "Retargeting inscritos", plataforma: ["Instagram"], cta: "Completa tu acreditación", segmento: "Usuarios que visitaron formulario", presupuesto: "Conversion" },
];

export const pautaLegitimidad = [
  { formato: "Video 30s institucional", objetivo: "Combatir desinformación", plataforma: ["Facebook", "Instagram", "TikTok"], cta: "Conoce la verdad del proceso electoral", segmento: "Todos los colombianos +18", presupuesto: "Contra-narrativa" },
  { formato: "Video explicativo auditoria", objetivo: "Generar confianza", plataforma: ["YouTube", "Facebook"], cta: "Así protegemos tu voto", segmento: "35–60 años, escépticos del proceso", presupuesto: "Confianza" },
  { formato: "Promoted content", objetivo: "Amplificar certificaciones", plataforma: ["X/Twitter"], cta: "Colombia tiene el proceso electoral más auditado", segmento: "Periodistas, académicos, líderes", presupuesto: "Influencia" },
];

export const pautaQuiroz = [
  { formato: "Video presentación institucional", objetivo: "Posicionamiento del vocero", plataforma: ["Facebook", "Instagram"], cta: "Conoce quién lidera el proceso electoral", segmento: "Colombianos +25 años", presupuesto: "Branding institucional" },
  { formato: "Clip declaración impactante", objetivo: "Amplificar mensajes clave", plataforma: ["TikTok", "Instagram Reels"], cta: "El CNE lo garantiza", segmento: "18–35 años, interés político", presupuesto: "Alcance masivo" },
  { formato: "Respuesta a desinformación", objetivo: "Defensa reputacional", plataforma: ["X/Twitter", "Facebook"], cta: "La verdad del proceso electoral", segmento: "Usuarios que interactúan con contenido negativo", presupuesto: "Crisis management" },
];

// =============================================================================
// 11. LEGITIMIDAD PAGE DATA (/legitimidad)
// =============================================================================

export const legitimidadData = {
  indiceConfianza: 72,
  indiceTransparencia: 81,
  indiceProcesos: 68,
  encuestas: [
    { mes: "Ago", confianza: 65, transparencia: 70 },
    { mes: "Sep", confianza: 68, transparencia: 73 },
    { mes: "Oct", confianza: 67, transparencia: 75 },
    { mes: "Nov", confianza: 70, transparencia: 78 },
    { mes: "Dic", confianza: 71, transparencia: 80 },
    { mes: "Ene", confianza: 72, transparencia: 81 },
  ],
  certificaciones: [
    { nombre: "ISO 27001 Seguridad", estado: "vigente", exp: "2027" },
    { nombre: "Auditoría BID Electoral", estado: "vigente", exp: "2026" },
    { nombre: "Certificación OEA", estado: "vigente", exp: "2026" },
    { nombre: "NICSP Contabilidad", estado: "vigente", exp: "2028" },
  ],
  acciones: [
    { accion: "Auditorías software Smartmatic", avance: 92 },
    { accion: "Capacitación jurados de votación", avance: 78 },
    { accion: "Actualización censo electoral", avance: 100 },
    { accion: "Sistema de cadena de custodia", avance: 65 },
  ],
};

// =============================================================================
// 12. QUIROZ PROFILE DATA (/quiroz)
// =============================================================================

export const quirozData = {
  nombre: "Cristian Quiroz",
  cargo: "Presidente del CNE Colombia",
  desde: "2024",
  partido: "Independiente",
  menciones: { total: 8421, positivo: 52, neutral: 31, negativo: 17 },
  apariciones: [
    { medio: "RCN Noticias", fecha: "02 Jun 2026", tema: "Auditoría Electoral", sentimiento: "neutral" },
    { medio: "Caracol Radio", fecha: "01 Jun 2026", tema: "Registro candidatos", sentimiento: "positivo" },
    { medio: "El Tiempo", fecha: "31 May 2026", tema: "Testigos electorales", sentimiento: "positivo" },
    { medio: "Semana", fecha: "30 May 2026", tema: "Software de votación", sentimiento: "neutral" },
    { medio: "La FM", fecha: "29 May 2026", tema: "Presupuesto CNE", sentimiento: "neutral" },
    { medio: "Blu Radio", fecha: "28 May 2026", tema: "Transparencia proceso", sentimiento: "positivo" },
  ],
  kpis: [
    { label: "Declaraciones públicas", value: "134", mes: "Ene–Jun 2026" },
    { label: "Apariciones en medios", value: "89", mes: "Ene–Jun 2026" },
    { label: "Cuentas verificadas", value: "12", mes: "Plataformas" },
    { label: "Entrevistas en TV", value: "47", mes: "Ene–Jun 2026" },
  ],
  semanalMenciones: [
    { dia: "L", n: 120 },
    { dia: "M", n: 98 },
    { dia: "X", n: 145 },
    { dia: "J", n: 132 },
    { dia: "V", n: 187 },
    { dia: "S", n: 76 },
    { dia: "D", n: 54 },
  ],
};

// =============================================================================
// 13. MEDIOS PAGE DATA (/medios)
// =============================================================================

export const mediosData = {
  kpis: [
    { label: "Notas publicadas", value: "3,241", delta: "+18%", trend: "up" as const },
    { label: "Alcance estimado", value: "12.8M", delta: "+24%", trend: "up" as const },
    { label: "Sentimiento positivo", value: "54%", delta: "+6pp", trend: "up" as const },
    { label: "Medios cubiertos", value: "187", delta: "+12", trend: "up" as const },
  ],
  topMedios: [
    { medio: "El Tiempo", notas: 487, sentimiento: 62, tipo: "Prensa escrita" },
    { medio: "Semana", notas: 412, sentimiento: 55, tipo: "Revista" },
    { medio: "Caracol Radio", notas: 389, sentimiento: 68, tipo: "Radio" },
    { medio: "RCN Televisión", notas: 341, sentimiento: 58, tipo: "TV" },
    { medio: "Blu Radio", notas: 298, sentimiento: 72, tipo: "Radio" },
    { medio: "La W", notas: 267, sentimiento: 65, tipo: "Radio" },
    { medio: "Pulzo", notas: 234, sentimiento: 60, tipo: "Digital" },
    { medio: "Infobae Colombia", notas: 198, sentimiento: 63, tipo: "Digital" },
  ],
  tendenciaSemanal: [
    { dia: "Lun", notas: 412, positivas: 224, negativas: 80 },
    { dia: "Mar", notas: 388, positivas: 210, negativas: 72 },
    { dia: "Mié", notas: 521, positivas: 298, negativas: 95 },
    { dia: "Jue", notas: 467, positivas: 267, negativas: 88 },
    { dia: "Vie", notas: 598, positivas: 341, negativas: 102 },
    { dia: "Sáb", notas: 312, positivas: 178, negativas: 58 },
    { dia: "Dom", notas: 224, positivas: 128, negativas: 42 },
  ],
  temasTendencia: [
    { tema: "#Elecciones2026", count: 8412 },
    { tema: "CNE Colombia", count: 7841 },
    { tema: "Testigos Electorales", count: 5234 },
    { tema: "Cristian Quiroz", count: 4821 },
    { tema: "Transparencia Electoral", count: 4102 },
    { tema: "Registraduría", count: 3987 },
  ],
};

// =============================================================================
// 14. SOCIAL PAGE DATA (/social) — platform profiles + live feed
// =============================================================================

export const socialProfiles = {
  instagram: {
    handle: "@cne_colombia",
    url: "https://www.instagram.com/cne_colombia/",
    seguidores: "48.2K",
    interacciones: 12847,
    alcance: "892K",
    posts: 34,
    sentimiento: 68,
    tendencia: [
      { hora: "06h", mentions: 42 }, { hora: "08h", mentions: 98 }, { hora: "10h", mentions: 187 },
      { hora: "12h", mentions: 241 }, { hora: "14h", mentions: 198 }, { hora: "16h", mentions: 312 },
      { hora: "18h", mentions: 428 }, { hora: "20h", mentions: 389 }, { hora: "22h", mentions: 198 },
    ],
    topPosts: [
      { texto: "✅ Auditoría de software electoral en marcha", likes: 4821, comments: 342 },
      { texto: "📢 Jornada de inscripción de testigos electorales", likes: 3912, comments: 287 },
      { texto: "🗳️ Así funciona la cadena de custodia del voto", likes: 3241, comments: 198 },
    ],
  },
  facebook: {
    handle: "consejonacionalelectoral",
    url: "https://web.facebook.com/consejonacionalelectoral",
    seguidores: "124.8K",
    interacciones: 28940,
    alcance: "2.1M",
    posts: 28,
    sentimiento: 62,
    tendencia: [
      { hora: "06h", mentions: 78 }, { hora: "08h", mentions: 142 }, { hora: "10h", mentions: 234 },
      { hora: "12h", mentions: 312 }, { hora: "14h", mentions: 267 }, { hora: "16h", mentions: 389 },
      { hora: "18h", mentions: 512 }, { hora: "20h", mentions: 467 }, { hora: "22h", mentions: 234 },
    ],
    topPosts: [
      { texto: "El CNE garantiza elecciones libres y transparentes", likes: 9821, comments: 1242 },
      { texto: "Capacitación de jurados de votación 2026", likes: 7814, comments: 987 },
      { texto: "Convocatoria testigos electorales departamentales", likes: 6234, comments: 843 },
    ],
  },
  x: {
    handle: "@CNE_COLOMBIA",
    url: "https://x.com/CNE_COLOMBIA",
    seguidores: "89.4K",
    interacciones: 18420,
    alcance: "1.4M",
    posts: 87,
    sentimiento: 54,
    tendencia: [
      { hora: "06h", mentions: 112 }, { hora: "08h", mentions: 198 }, { hora: "10h", mentions: 312 },
      { hora: "12h", mentions: 421 }, { hora: "14h", mentions: 367 }, { hora: "16h", mentions: 489 },
      { hora: "18h", mentions: 634 }, { hora: "20h", mentions: 578 }, { hora: "22h", mentions: 312 },
    ],
    topPosts: [
      { texto: "#CNEColombia inicia auditoría pública del software Smartmatic", rt: 2841, likes: 8912 },
      { texto: "Comunicado: Proceso de inscripción de candidatos cierra el viernes", rt: 1987, likes: 6234 },
      { texto: "HILO: Todo lo que debes saber sobre la cadena de custodia", rt: 1654, likes: 5421 },
    ],
  },
  tiktok: {
    handle: "@consejonacionalelectoral",
    url: "https://www.tiktok.com/@consejonacionalelectoral",
    seguidores: "31.7K",
    interacciones: 89240,
    alcance: "3.8M",
    posts: 22,
    sentimiento: 71,
    tendencia: [
      { hora: "06h", mentions: 34 }, { hora: "08h", mentions: 67 }, { hora: "10h", mentions: 112 },
      { hora: "12h", mentions: 187 }, { hora: "14h", mentions: 234 }, { hora: "16h", mentions: 412 },
      { hora: "18h", mentions: 867 }, { hora: "20h", mentions: 1234 }, { hora: "22h", mentions: 987 },
    ],
    topPosts: [
      { texto: "¿Cómo funciona la mesa de votación? 🗳️ #Elecciones2026", views: "2.8M", likes: 48200 },
      { texto: "El CNE en 60 segundos 📋 #ColombiaSeDemocratiza", views: "1.9M", likes: 32100 },
      { texto: "Así se cuentan los votos en Colombia 🇨🇴", views: "1.4M", likes: 24800 },
    ],
  },
};

export const liveFeed = [
  { id: 1, red: "x", usuario: "@PoliticaCol", texto: "El @CNE_COLOMBIA acaba de confirmar la auditoría para las próximas semanas #Transparencia", tiempo: "hace 2 min", tipo: "positivo" },
  { id: 2, red: "instagram", usuario: "@candidato2026", texto: "Inscribimos nuestros testigos electorales en todo el país 🇨🇴 gracias @cne_colombia", tiempo: "hace 4 min", tipo: "positivo" },
  { id: 3, red: "facebook", usuario: "Voto Colombia", texto: "¿Por qué el CNE no ha respondido sobre el software? Necesitamos más transparencia", tiempo: "hace 6 min", tipo: "negativo" },
  { id: 4, red: "tiktok", usuario: "@democracia_co", texto: "Video: Así funciona el conteo de votos en Colombia ft. @consejonacionalelectoral", tiempo: "hace 8 min", tipo: "positivo" },
  { id: 5, red: "x", usuario: "@ElectoralCO", texto: "#Elecciones2026 El proceso avanza con normalidad según el @CNE_COLOMBIA", tiempo: "hace 11 min", tipo: "neutral" },
  { id: 6, red: "facebook", usuario: "Colombia Vota", texto: "Excelente la iniciativa de los testigos electorales departamentales del @consejonacionalelectoral!", tiempo: "hace 13 min", tipo: "positivo" },
  { id: 7, red: "instagram", usuario: "@periodismo_electoral", texto: "En directo desde la sede del CNE: conferencia de Cristian Quiroz 🎙️ @cne_colombia", tiempo: "hace 15 min", tipo: "neutral" },
  { id: 8, red: "tiktok", usuario: "@juanvota", texto: "Por fin alguien explica bien cómo funciona el CNE 👏 @consejonacionalelectoral #Elecciones2026", tiempo: "hace 17 min", tipo: "positivo" },
];

// =============================================================================
// 15. MAPA GLOBAL DATA (/mapa) — Globe markers (12 observation missions)
// =============================================================================

export const globeMarkers = [
  { pais: "México", ciudad: "Ciudad de México", lat: 19.4, lng: -99.1, count: 3, tipo: "Misión OEA", narrativa: "Interés creciente en modelo electoral colombiano", tendencia: "Positiva ↑" },
  { pais: "Argentina", ciudad: "Buenos Aires", lat: -34.6, lng: -58.4, count: 5, tipo: "Observadores UNASUR", narrativa: "Solidez institucional del CNE es referente regional", tendencia: "Positiva ↑" },
  { pais: "España", ciudad: "Madrid", lat: 40.4, lng: -3.7, count: 8, tipo: "Misión UE", narrativa: "Colombia consolida democracia de calidad en Latam", tendencia: "Muy positiva ↑↑" },
  { pais: "Estados Unidos", ciudad: "Washington D.C.", lat: 38.9, lng: -77, count: 12, tipo: "Carter Center", narrativa: "Proceso técnico sólido, seguimiento del software electoral", tendencia: "Positiva ↑" },
  { pais: "Brasil", ciudad: "Brasilia", lat: -15.8, lng: -47.9, count: 4, tipo: "UNASUR", narrativa: "Experiencia colombiana aporta a la integración electoral regional", tendencia: "Neutral →" },
  { pais: "Francia", ciudad: "París", lat: 48.9, lng: 2.3, count: 6, tipo: "Misión UE", narrativa: "Estándares europeos aplicados al contexto colombiano", tendencia: "Positiva ↑" },
  { pais: "Venezuela", ciudad: "Caracas", lat: 10.5, lng: -66.9, count: 2, tipo: "UNASUR", narrativa: "Contraste con proceso interno genera atención al modelo CNE", tendencia: "Mixta ↔" },
  { pais: "Chile", ciudad: "Santiago", lat: -33.5, lng: -70.6, count: 3, tipo: "UNIORE", narrativa: "Referente de transparencia para sistemas postransición", tendencia: "Positiva ↑" },
  { pais: "Perú", ciudad: "Lima", lat: -12, lng: -77, count: 4, tipo: "UNIORE", narrativa: "Benchmarking técnico con proceso colombiano", tendencia: "Neutral →" },
  { pais: "Alemania", ciudad: "Berlín", lat: 52.5, lng: 13.4, count: 5, tipo: "Misión UE", narrativa: "Monitoreo de estándares democráticos OCDE en Colombia", tendencia: "Positiva ↑" },
  { pais: "Japón", ciudad: "Tokio", lat: 35.7, lng: 139.7, count: 2, tipo: "Observadores", narrativa: "Interés técnico en sistemas de votación electrónica", tendencia: "Neutral →" },
  { pais: "Canadá", ciudad: "Ottawa", lat: 45.4, lng: -75.7, count: 3, tipo: "Carter Center", narrativa: "Énfasis en participación de minorías y zonas rurales", tendencia: "Positiva ↑" },
];

// =============================================================================
// 16. COUNTRIES DATA (27 countries — social narrative monitoring)
// =============================================================================

export const countriesData = [
  {
    id: "CO", pais: "Colombia", emoji: "🇨🇴", lat: 4.5, lng: -74.3,
    tema: "Elecciones Presidenciales 2026 — CNE",
    keywords: ["CNE Colombia", "Elecciones2026", "CristianQuiroz", "VotoColombia", "TestigosElectorales"],
    sentimiento: "positivo",
    sentimientoPct: { positivo: 64, neutral: 24, negativo: 12 },
    volumen: 187_400,
    plataformaDominante: "TikTok",
    plataformas: { X: 52_000, Instagram: 38_000, Facebook: 41_000, TikTok: 56_400 },
    resumen: "Alta conversación sobre el proceso electoral presidencial. El CNE lidera el debate sobre transparencia y participación. Cristian Quiroz concentra menciones mediáticas positivas. Tendencia de movilización ciudadana creciente en todas las plataformas.",
    tendencia: "sube",
    pctCambio: 18.4,
    topHashtags: ["#Elecciones2026", "#CNEColombia", "#VotoColombia", "#25Mayo", "#DemocraciaCO"],
    updateTime: "hace 3 min",
  },
  {
    id: "US", pais: "Estados Unidos", emoji: "🇺🇸", lat: 38.9, lng: -77,
    tema: "Diáspora colombiana y voto en el exterior",
    keywords: ["VotoColombia", "ColombiansAbroad", "Elecciones2026", "DiasporaVota"],
    sentimiento: "positivo",
    sentimientoPct: { positivo: 58, neutral: 31, negativo: 11 },
    volumen: 34_200,
    plataformaDominante: "Instagram",
    plataformas: { X: 9_800, Instagram: 14_200, Facebook: 7_400, TikTok: 2_800 },
    resumen: "La diáspora colombiana en Miami, Nueva York y Houston debate activamente el voto en el exterior. Fuerte movilización de comunidades en Instagram. El consulado amplió horarios de inscripción al censo.",
    tendencia: "sube",
    pctCambio: 12.1,
    topHashtags: ["#ColombianosEnElExterior", "#VotoColombia", "#DiasporaVota", "#Elecciones2026"],
    updateTime: "hace 7 min",
  },
  {
    id: "ES", pais: "España", emoji: "🇪🇸", lat: 40.4, lng: -3.7,
    tema: "Misión UE y comunidad colombiana en Madrid",
    keywords: ["MisionUE", "ColombiaEspaña", "TestigosElectorales", "Democracia"],
    sentimiento: "positivo",
    sentimientoPct: { positivo: 72, neutral: 21, negativo: 7 },
    volumen: 28_700,
    plataformaDominante: "X",
    plataformas: { X: 12_400, Instagram: 8_900, Facebook: 6_200, TikTok: 1_200 },
    resumen: "España alberga la mayor comunidad colombiana en Europa. La Misión de Observación Electoral de la UE generó cobertura positiva. Los medios españoles destacan la solidez institucional del CNE.",
    tendencia: "sube",
    pctCambio: 9.3,
    topHashtags: ["#ColombiaEnEspaña", "#MisionUE", "#Elecciones2026", "#CNEColombia"],
    updateTime: "hace 11 min",
  },
  {
    id: "MX", pais: "México", emoji: "🇲🇽", lat: 19.4, lng: -99.1,
    tema: "Comparativa electoral latinoamericana",
    keywords: ["EleccionesLatam", "Democracia", "MisionOEA", "CNE"],
    sentimiento: "neutral",
    sentimientoPct: { positivo: 44, neutral: 41, negativo: 15 },
    volumen: 21_500,
    plataformaDominante: "X",
    plataformas: { X: 9_800, Instagram: 5_400, Facebook: 4_800, TikTok: 1_500 },
    resumen: "Analistas políticos mexicanos comparan el modelo electoral colombiano con procesos regionales. La OEA despachó misión de observación. Conversación técnica sobre software electoral domina el debate.",
    tendencia: "estable",
    pctCambio: 1.2,
    topHashtags: ["#DemocraciaLatam", "#EleccionesLatam", "#OEA", "#Colombia2026"],
    updateTime: "hace 15 min",
  },
  {
    id: "AR", pais: "Argentina", emoji: "🇦🇷", lat: -34.6, lng: -58.4,
    tema: "Referente regional — UNASUR observa el proceso",
    keywords: ["UNASUR", "ArgentinaColombia", "Democracia", "ObservacionElectoral"],
    sentimiento: "positivo",
    sentimientoPct: { positivo: 61, neutral: 28, negativo: 11 },
    volumen: 18_900,
    plataformaDominante: "Instagram",
    plataformas: { X: 7_200, Instagram: 8_100, Facebook: 2_800, TikTok: 800 },
    resumen: "Politólogos argentinos señalan al CNE como referente de independencia institucional en la región. La delegación UNASUR asistirá como observadora. Fuerte interés académico en el modelo de transparencia.",
    tendencia: "sube",
    pctCambio: 7.8,
    topHashtags: ["#UNASUR", "#ColombiaDemocrática", "#Elecciones2026", "#ObservacionElectoral"],
    updateTime: "hace 9 min",
  },
  {
    id: "VE", pais: "Venezuela", emoji: "🇻🇪", lat: 10.5, lng: -66.9,
    tema: "Contraste electoral Venezuela–Colombia",
    keywords: ["VenezuelaColombia", "DiasporaVenezolana", "DemocraciaReal", "Elecciones"],
    sentimiento: "mixto",
    sentimientoPct: { positivo: 38, neutral: 22, negativo: 40 },
    volumen: 24_600,
    plataformaDominante: "X",
    plataformas: { X: 14_200, Instagram: 6_400, Facebook: 3_200, TikTok: 800 },
    resumen: "El proceso colombiano genera debate intenso en Venezuela. Sectores opositores lo usan como contraste. Venezolanos con residencia en Colombia analizan opciones de participación. Alta polarización en X.",
    tendencia: "sube",
    pctCambio: 31.2,
    topHashtags: ["#ColombiaVota", "#DemocraciaReal", "#Venezuela", "#Elecciones2026"],
    updateTime: "hace 5 min",
  },
  {
    id: "BR", pais: "Brasil", emoji: "🇧🇷", lat: -15.8, lng: -47.9,
    tema: "Integración electoral regional — TSE y CNE",
    keywords: ["TSEBrasil", "CNEColombia", "CooperacionElectoral", "Latam"],
    sentimiento: "positivo",
    sentimientoPct: { positivo: 55, neutral: 35, negativo: 10 },
    volumen: 15_400,
    plataformaDominante: "Facebook",
    plataformas: { X: 4_800, Instagram: 4_200, Facebook: 5_200, TikTok: 1_200 },
    resumen: "El Tribunal Superior Electoral de Brasil intercambió experiencias con el CNE sobre sistemas de escrutinio. Medios brasileños cubren el proceso como caso de estudio de democracia latinoamericana funcional.",
    tendencia: "estable",
    pctCambio: 2.4,
    topHashtags: ["#DemocraciaLatam", "#TSEBrasil", "#CNEColombia", "#Eleicoes"],
    updateTime: "hace 22 min",
  },
  {
    id: "CL", pais: "Chile", emoji: "🇨🇱", lat: -33.5, lng: -70.6,
    tema: "Benchmarking UNIORE — transparencia electoral",
    keywords: ["UNIORE", "SERVELChile", "TransparenciaElectoral", "Colombia"],
    sentimiento: "positivo",
    sentimientoPct: { positivo: 67, neutral: 27, negativo: 6 },
    volumen: 12_800,
    plataformaDominante: "X",
    plataformas: { X: 5_600, Instagram: 3_800, Facebook: 2_800, TikTok: 600 },
    resumen: "SERVEL Chile mantiene acuerdo de cooperación con el CNE. Expertos en sistemas electorales destacan los avances en cadena de custodia del voto colombiano. Cobertura académica y especializada.",
    tendencia: "estable",
    pctCambio: 3.1,
    topHashtags: ["#UNIORE", "#TransparenciaElectoral", "#Chile", "#CNE"],
    updateTime: "hace 18 min",
  },
  {
    id: "FR", pais: "Francia", emoji: "🇫🇷", lat: 48.9, lng: 2.3,
    tema: "Misión UE y comunidad colombiana en París",
    keywords: ["MisionUE", "ColombiaParis", "EleccionesColombia", "Democracia"],
    sentimiento: "positivo",
    sentimientoPct: { positivo: 69, neutral: 24, negativo: 7 },
    volumen: 11_200,
    plataformaDominante: "Instagram",
    plataformas: { X: 4_200, Instagram: 5_100, Facebook: 1_500, TikTok: 400 },
    resumen: "Francia lidera la delegación de la Misión de Observación de la UE. Comunidad colombiana en París organiza jornadas de inscripción electoral. Cobertura positiva de Le Monde sobre la institucionalidad del CNE.",
    tendencia: "sube",
    pctCambio: 5.9,
    topHashtags: ["#ColombieFrance", "#MissionUE", "#Elecciones2026", "#DiasporaColombia"],
    updateTime: "hace 14 min",
  },
  {
    id: "DE", pais: "Alemania", emoji: "🇩🇪", lat: 52.5, lng: 13.4,
    tema: "Estándares OCDE y democracia colombiana",
    keywords: ["OCDEDemocracia", "Alemania", "Elecciones", "EstandaresElectorales"],
    sentimiento: "positivo",
    sentimientoPct: { positivo: 71, neutral: 25, negativo: 4 },
    volumen: 9_800,
    plataformaDominante: "X",
    plataformas: { X: 4_800, Instagram: 2_600, Facebook: 1_900, TikTok: 500 },
    resumen: "Fundaciones alemanas Konrad Adenauer y Friedrich Ebert acompañan el proceso electoral colombiano. Medios como Frankfurter Allgemeine destacan la solidez técnica del sistema. Alta cobertura académica.",
    tendencia: "estable",
    pctCambio: 1.8,
    topHashtags: ["#Kolumbien", "#DemokratieLatam", "#OCDE", "#Elecciones2026"],
    updateTime: "hace 31 min",
  },
  {
    id: "CA", pais: "Canadá", emoji: "🇨🇦", lat: 45.4, lng: -75.7,
    tema: "Carter Center y voto en el exterior — comunidad colombiana",
    keywords: ["CarterCenter", "ColombiansInCanada", "VotoExterior", "Democracia"],
    sentimiento: "positivo",
    sentimientoPct: { positivo: 63, neutral: 30, negativo: 7 },
    volumen: 8_400,
    plataformaDominante: "Instagram",
    plataformas: { X: 2_800, Instagram: 3_900, Facebook: 1_400, TikTok: 300 },
    resumen: "El Carter Center coordina observación desde Canadá con énfasis en inclusión de comunidades rurales y afrodescendientes. Colombianos en Toronto y Vancouver activos en redes sobre voto en el exterior.",
    tendencia: "sube",
    pctCambio: 6.4,
    topHashtags: ["#CarterCenter", "#ColombiansInCanada", "#Elecciones2026", "#VotoColombia"],
    updateTime: "hace 26 min",
  },
  {
    id: "PE", pais: "Perú", emoji: "🇵🇪", lat: -12, lng: -77,
    tema: "Benchmarking ONPE-CNE y cooperación técnica",
    keywords: ["ONPE", "CNEColombia", "CooperacionElectoral", "Latam"],
    sentimiento: "neutral",
    sentimientoPct: { positivo: 48, neutral: 38, negativo: 14 },
    volumen: 7_600,
    plataformaDominante: "Facebook",
    plataformas: { X: 2_400, Instagram: 2_100, Facebook: 2_800, TikTok: 300 },
    resumen: "La ONPE peruana estudia el modelo de software electoral colombiano. Debate académico sobre implementación de tecnología en el voto. La crisis política interna opaca la cobertura del proceso colombiano.",
    tendencia: "estable",
    pctCambio: 0.8,
    topHashtags: ["#ONPE", "#Elecciones", "#CooperacionElectoral", "#Colombia"],
    updateTime: "hace 40 min",
  },
  {
    id: "EC", pais: "Ecuador", emoji: "🇪🇨", lat: -0.2, lng: -78.5,
    tema: "CNE Ecuador y proceso presidencial colombiano",
    keywords: ["CNEEcuador", "Colombia", "Elecciones", "DemocraciaAndina"],
    sentimiento: "positivo",
    sentimientoPct: { positivo: 57, neutral: 32, negativo: 11 },
    volumen: 9_200,
    plataformaDominante: "X",
    plataformas: { X: 4_200, Instagram: 2_600, Facebook: 1_900, TikTok: 500 },
    resumen: "Ecuador vive su propia coyuntura electoral y mira con atención el modelo colombiano. El CNE Ecuador solicitó cooperación técnica. Fuertes lazos fronterizos generan interés en la diáspora colombiana en Quito.",
    tendencia: "sube",
    pctCambio: 8.7,
    topHashtags: ["#CNEEcuador", "#DemocraciaAndina", "#Elecciones2026", "#ColombiaCuenta"],
    updateTime: "hace 12 min",
  },
  {
    id: "BO", pais: "Bolivia", emoji: "🇧🇴", lat: -16.5, lng: -68.1,
    tema: "UNIORE y observación andina",
    keywords: ["UNIORE", "Democracia", "Bolivia", "ObservadorElectoral"],
    sentimiento: "neutral",
    sentimientoPct: { positivo: 42, neutral: 45, negativo: 13 },
    volumen: 4_800,
    plataformaDominante: "Facebook",
    plataformas: { X: 1_400, Instagram: 1_200, Facebook: 1_900, TikTok: 300 },
    resumen: "Bolivia participa en el bloque UNIORE de observación electoral. Medios bolivianos cubren el proceso colombiano en el contexto de la democracia andina. Baja intensidad pero conversación técnica.",
    tendencia: "estable",
    pctCambio: -0.4,
    topHashtags: ["#UNIORE", "#DemocraciaAndina", "#Bolivia", "#Elecciones"],
    updateTime: "hace 52 min",
  },
  {
    id: "PY", pais: "Paraguay", emoji: "🇵🇾", lat: -25.3, lng: -57.6,
    tema: "UNASUR observa desde Paraguay",
    keywords: ["UNASUR", "Paraguay", "DemocraciaLatam", "ObservacionElectoral"],
    sentimiento: "neutral",
    sentimientoPct: { positivo: 46, neutral: 40, negativo: 14 },
    volumen: 3_200,
    plataformaDominante: "Facebook",
    plataformas: { X: 900, Instagram: 800, Facebook: 1_300, TikTok: 200 },
    resumen: "Participación técnica de Paraguay en la misión UNASUR. Cobertura modesta centrada en el aspecto regional de la observación electoral andina.",
    tendencia: "estable",
    pctCambio: 0.2,
    topHashtags: ["#UNASUR", "#ObservacionElectoral", "#Paraguay", "#Democracia"],
    updateTime: "hace 1h 10min",
  },
  {
    id: "UY", pais: "Uruguay", emoji: "🇺🇾", lat: -34.9, lng: -56.2,
    tema: "Modelo democrático uruguayo y referencias al CNE",
    keywords: ["Uruguay", "DemocraciaLatam", "CNE", "Transparencia"],
    sentimiento: "positivo",
    sentimientoPct: { positivo: 74, neutral: 21, negativo: 5 },
    volumen: 5_600,
    plataformaDominante: "X",
    plataformas: { X: 2_800, Instagram: 1_400, Facebook: 1_100, TikTok: 300 },
    resumen: "Uruguay, referente democrático regional, celebra los avances institucionales del CNE Colombia. Politólogos uruguayos destacan la independencia del organismo. Cobertura académica y editorial positiva.",
    tendencia: "estable",
    pctCambio: 2.6,
    topHashtags: ["#Uruguay", "#DemocraciaLatam", "#CNEColombia", "#Transparencia"],
    updateTime: "hace 38 min",
  },
  {
    id: "GB", pais: "Reino Unido", emoji: "🇬🇧", lat: 51.5, lng: -0.1,
    tema: "Misión UE y cobertura BBC sobre Colombia",
    keywords: ["BBCMundo", "Colombia", "Elecciones", "LatinAmerica"],
    sentimiento: "positivo",
    sentimientoPct: { positivo: 60, neutral: 33, negativo: 7 },
    volumen: 8_900,
    plataformaDominante: "X",
    plataformas: { X: 4_600, Instagram: 2_400, Facebook: 1_500, TikTok: 400 },
    resumen: "BBC Mundo y The Guardian cubren las elecciones colombianas como un test clave para la democracia latinoamericana. Comunidad colombiana en Londres organiza eventos en consulado. Misión UE incluye observadores británicos.",
    tendencia: "sube",
    pctCambio: 4.2,
    topHashtags: ["#Colombia2026", "#LatinAmerica", "#BBCMundo", "#Elecciones"],
    updateTime: "hace 20 min",
  },
  {
    id: "IT", pais: "Italia", emoji: "🇮🇹", lat: 41.9, lng: 12.5,
    tema: "Diáspora colombiana Italia — voto exterior",
    keywords: ["ColombiaItalia", "VotoExterior", "Elecciones2026", "DiasporaColombia"],
    sentimiento: "positivo",
    sentimientoPct: { positivo: 65, neutral: 28, negativo: 7 },
    volumen: 6_200,
    plataformaDominante: "Instagram",
    plataformas: { X: 1_800, Instagram: 3_200, Facebook: 1_000, TikTok: 200 },
    resumen: "Importante comunidad colombiana en Roma y Milán movilizada por el voto en el exterior. Consulado colombiano en Roma reporta alta demanda de inscripción. Instagram lidera la conversación de la diáspora italiana.",
    tendencia: "sube",
    pctCambio: 9.1,
    topHashtags: ["#ColombiaEnItalia", "#VotoExterior", "#Elecciones2026", "#DiasporaCO"],
    updateTime: "hace 28 min",
  },
  {
    id: "JP", pais: "Japón", emoji: "🇯🇵", lat: 35.7, lng: 139.7,
    tema: "Tecnología electoral — observadores asiáticos",
    keywords: ["TecnologiaElectoral", "Japon", "Colombia", "SoftwareVotacion"],
    sentimiento: "neutral",
    sentimientoPct: { positivo: 52, neutral: 42, negativo: 6 },
    volumen: 3_800,
    plataformaDominante: "X",
    plataformas: { X: 2_100, Instagram: 900, Facebook: 600, TikTok: 200 },
    resumen: "Delegación técnica japonesa interesada en el sistema de software electoral de Colombia. Enfoque académico y tecnológico. Medios especializados japoneses cubren el proceso como caso de modernización democrática.",
    tendencia: "estable",
    pctCambio: 1.4,
    topHashtags: ["#EleccionTech", "#Colombia", "#Democracia", "#Smartmatic"],
    updateTime: "hace 45 min",
  },
  {
    id: "AU", pais: "Australia", emoji: "🇦🇺", lat: -35.3, lng: 149.1,
    tema: "AEC intercambio y colombianos en Sydney",
    keywords: ["AustraliaElectoral", "ColombiaSydney", "VotoExterior", "DiasporaCO"],
    sentimiento: "positivo",
    sentimientoPct: { positivo: 61, neutral: 32, negativo: 7 },
    volumen: 4_200,
    plataformaDominante: "Instagram",
    plataformas: { X: 1_200, Instagram: 2_100, Facebook: 700, TikTok: 200 },
    resumen: "La Australian Electoral Commission compartió mejores prácticas con el CNE. Colombianos en Sydney y Melbourne activos en redes para coordinar voto exterior. Cobertura positiva de medios multiculturales.",
    tendencia: "estable",
    pctCambio: 2.1,
    topHashtags: ["#ColombiansInAustralia", "#VotoExterior", "#Elecciones2026", "#AEC"],
    updateTime: "hace 55 min",
  },
  {
    id: "CN", pais: "China", emoji: "🇨🇳", lat: 39.9, lng: 116.4,
    tema: "Cobertura Xinhua — relaciones Colombia-China",
    keywords: ["Xinhua", "ChinaColombia", "Relaciones", "EleccionesLatam"],
    sentimiento: "neutral",
    sentimientoPct: { positivo: 38, neutral: 55, negativo: 7 },
    volumen: 5_100,
    plataformaDominante: "X",
    plataformas: { X: 3_200, Instagram: 800, Facebook: 900, TikTok: 200 },
    resumen: "Agencia Xinhua cubre las elecciones colombianas en el contexto de las relaciones bilaterales. Énfasis en estabilidad institucional y perspectivas económicas post-electoral. Narrativa de negocios e inversión.",
    tendencia: "estable",
    pctCambio: 0.6,
    topHashtags: ["#Xinhua", "#ChinaColombia", "#LatinAmerica", "#Elecciones2026"],
    updateTime: "hace 1h",
  },
  {
    id: "PA", pais: "Panamá", emoji: "🇵🇦", lat: 8.9, lng: -79.5,
    tema: "Zona libre y diáspora colombiana",
    keywords: ["Panama", "DiasporaCO", "VotoExterior", "Colombia"],
    sentimiento: "positivo",
    sentimientoPct: { positivo: 58, neutral: 34, negativo: 8 },
    volumen: 7_800,
    plataformaDominante: "Instagram",
    plataformas: { X: 2_200, Instagram: 3_600, Facebook: 1_700, TikTok: 300 },
    resumen: "Panamá alberga importante colonia colombiana activa en el proceso electoral. La proximidad geográfica y los lazos comerciales mantienen alta la conversación. Consulado en Ciudad de Panamá con alta demanda.",
    tendencia: "sube",
    pctCambio: 6.8,
    topHashtags: ["#ColombiaEnPanama", "#VotoExterior", "#Elecciones2026", "#DiasporaVota"],
    updateTime: "hace 16 min",
  },
  {
    id: "CR", pais: "Costa Rica", emoji: "🇨🇷", lat: 9.9, lng: -84.1,
    tema: "TSE Costa Rica — cooperación democrática",
    keywords: ["TSECostaRica", "DemocraciaLatam", "CNE", "CooperacionElectoral"],
    sentimiento: "positivo",
    sentimientoPct: { positivo: 70, neutral: 24, negativo: 6 },
    volumen: 6_400,
    plataformaDominante: "X",
    plataformas: { X: 3_100, Instagram: 1_800, Facebook: 1_300, TikTok: 200 },
    resumen: "El TSE de Costa Rica, referente centroamericano, celebra el avance institucional del CNE Colombia. Conversación técnica entre organismos electorales. Alta valoración de la independencia institucional.",
    tendencia: "estable",
    pctCambio: 3.4,
    topHashtags: ["#TSECostaRica", "#DemocraciaLatam", "#CNEColombia", "#CooperacionElectoral"],
    updateTime: "hace 42 min",
  },
  {
    id: "DO", pais: "Rep. Dominicana", emoji: "🇩🇴", lat: 18.5, lng: -69.9,
    tema: "JCE y modelo caribeno observan a Colombia",
    keywords: ["JCEDominicana", "Caribe", "Democracia", "Elecciones"],
    sentimiento: "positivo",
    sentimientoPct: { positivo: 55, neutral: 36, negativo: 9 },
    volumen: 5_200,
    plataformaDominante: "Instagram",
    plataformas: { X: 1_800, Instagram: 2_400, Facebook: 800, TikTok: 200 },
    resumen: "La JCE dominicana envía observadores al proceso colombiano. Comunidad colombiana en Santo Domingo activa en redes. Interés en el modelo de software electoral y transparencia de resultados.",
    tendencia: "estable",
    pctCambio: 2.8,
    topHashtags: ["#JCE", "#Elecciones", "#Colombia2026", "#DemocraciaCaribe"],
    updateTime: "hace 48 min",
  },
  {
    id: "ZA", pais: "Sudáfrica", emoji: "🇿🇦", lat: -25.7, lng: 28.2,
    tema: "IEC y observación africana",
    keywords: ["IECSudafrica", "ObservacionElectoral", "Africa", "Colombia"],
    sentimiento: "neutral",
    sentimientoPct: { positivo: 45, neutral: 47, negativo: 8 },
    volumen: 2_800,
    plataformaDominante: "X",
    plataformas: { X: 1_600, Instagram: 600, Facebook: 500, TikTok: 100 },
    resumen: "La Comisión Electoral Independiente de Sudáfrica participa en intercambio de experiencias. Cobertura técnica moderada centrada en procesos comparados de consolidación democrática.",
    tendencia: "estable",
    pctCambio: 0.3,
    topHashtags: ["#IEC", "#EleccionesLatam", "#DemocraciaComparada", "#Colombia"],
    updateTime: "hace 1h 20min",
  },
  {
    id: "KR", pais: "Corea del Sur", emoji: "🇰🇷", lat: 37.6, lng: 127,
    tema: "NEC Corea — tecnología electoral avanzada",
    keywords: ["NECCorea", "TechElectoral", "Colombia", "SoftwareVotacion"],
    sentimiento: "positivo",
    sentimientoPct: { positivo: 60, neutral: 36, negativo: 4 },
    volumen: 3_400,
    plataformaDominante: "X",
    plataformas: { X: 2_000, Instagram: 800, Facebook: 500, TikTok: 100 },
    resumen: "La NEC de Corea del Sur comparte tecnología de e-voting con el CNE Colombia. Acuerdo de cooperación técnica para modernización electoral. Medios especializados coreanos destacan el avance.",
    tendencia: "sube",
    pctCambio: 5.2,
    topHashtags: ["#NECKorea", "#TechElectoral", "#Colombia", "#EsVoting"],
    updateTime: "hace 50 min",
  },
  {
    id: "IN", pais: "India", emoji: "🇮🇳", lat: 28.6, lng: 77.2,
    tema: "ECI India — elecciones democráticas más grandes del mundo",
    keywords: ["ECIIndia", "Democracia", "Elecciones", "Colombia"],
    sentimiento: "neutral",
    sentimientoPct: { positivo: 48, neutral: 45, negativo: 7 },
    volumen: 4_600,
    plataformaDominante: "X",
    plataformas: { X: 2_800, Instagram: 1_000, Facebook: 600, TikTok: 200 },
    resumen: "La Comisión Electoral de India y el CNE Colombia establecen diálogo de buenas prácticas. India aporta escala y logística; Colombia, transparencia tecnológica. Cobertura técnica especializada.",
    tendencia: "estable",
    pctCambio: 1.1,
    topHashtags: ["#ECIIndia", "#DemocraciaGlobal", "#Colombia", "#EleccionesComparadas"],
    updateTime: "hace 1h 5min",
  },
];

// =============================================================================
// 17. TESTIGOS PAGE — Department breakdown (chart data)
// =============================================================================

export const testigosPorDepartamento = [
  { depto: "Bogotá", count: 28_000 },
  { depto: "Antioquia", count: 22_000 },
  { depto: "Valle", count: 18_500 },
  { depto: "Atlántico", count: 12_000 },
  { depto: "Cundinamarca", count: 9_800 },
  { depto: "Otros", count: 8_130 },
];

// Testigos page tabs
export const testigosTabs = [
  { key: "overview", label: "🌍 Mapa Global" },
  { key: "narrativa", label: "📖 Narrativa" },
  { key: "pilares", label: "🏛️ Pilares" },
  { key: "noticias", label: "📰 Noticias" },
  { key: "contenido", label: "🎨 Ideas de Contenido" },
  { key: "conversacion", label: "💬 Conversación en Redes" },
  { key: "pauta", label: "📣 Ideas para Pauta" },
];

// Legitimidad page tabs
export const legitimidadTabs = [
  { key: "overview", label: "📊 Índices" },
  { key: "narrativa", label: "📖 Narrativa" },
  { key: "pilares", label: "🏛️ Pilares" },
  { key: "noticias", label: "📰 Noticias" },
  { key: "contenido", label: "🎨 Ideas de Contenido" },
  { key: "conversacion", label: "💬 Conversación en Redes" },
  { key: "pauta", label: "📣 Ideas para Pauta" },
];

// Quiroz page tabs
export const quirozTabs = [
  { key: "overview", label: "👤 Perfil" },
  { key: "narrativa", label: "📖 Narrativa" },
  { key: "pilares", label: "🏛️ Pilares" },
  { key: "noticias", label: "📰 Noticias" },
  { key: "contenido", label: "🎨 Ideas de Contenido" },
  { key: "conversacion", label: "💬 Conversación en Redes" },
  { key: "pauta", label: "📣 Ideas para Pauta" },
];

// =============================================================================
// 18. PAGE HEADER METADATA (badges + titles + descriptions)
// =============================================================================

export const pageHeaders = {
  elecciones: {
    badges: [
      { text: "PRESIDENCIALES", color: "hsl(213, 85%, 55%)" },
      { text: "COLOMBIA 2026", color: "hsl(42, 90%, 52%)" },
    ],
    title: "Elecciones Presidenciales Colombia 2026",
    description: "Gestión de narrativa y contenidos para el proceso electoral presidencial.",
  },
  testigos: {
    badges: [
      { text: "TESTIGOS", color: "hsl(213, 85%, 55%)" },
      { text: "RED GLOBAL", color: "hsl(42, 90%, 52%)" },
    ],
    title: "Testigos Electorales",
    description: "Red nacional e internacional de observadores electorales del CNE Colombia.",
  },
  legitimidad: {
    badges: [
      { text: "TRANSPARENCIA", color: "hsl(160, 60%, 45%)" },
      { text: "CNE 2026", color: "hsl(213, 85%, 55%)" },
    ],
    title: "Legitimidad y Transparencia",
    description: "Estrategia de comunicación institucional para el proceso electoral colombiano.",
  },
  quiroz: {
    badges: [
      { text: "PERFIL", color: "hsl(213, 85%, 55%)" },
      { text: "MONITOREO CNE", color: "hsl(42, 90%, 52%)" },
    ],
    title: "Cristian Quiroz",
    description: "Presidente del CNE Colombia — Narrativa mediática y estrategia de presencia digital.",
  },
  medios: {
    badges: [
      { text: "MEDIOS", color: "hsl(213, 85%, 55%)" },
      { text: "COBERTURA", color: "hsl(160, 60%, 45%)" },
    ],
    title: "Conversación en Medios",
    description: "Monitoreo de cobertura en prensa, radio, televisión y medios digitales.",
  },
  social: {
    badges: [
      { text: "EN VIVO", color: "hsl(160, 60%, 45%)", live: true },
      { text: "4 PLATAFORMAS", color: "hsl(213, 85%, 55%)" },
    ],
    title: "Conversación en Redes Sociales",
    description: "Monitoreo en tiempo real de Instagram, Facebook, X y TikTok.",
  },
};

// =============================================================================
// 19. CONVENIENCE: Grouped data per topic (for easy page-level imports)
// =============================================================================

export const topicData = {
  elecciones: {
    narrativa: narrativaElecciones,
    pilares: pilaresElecciones,
    noticias: noticiasElecciones,
    contenido: contenidoElecciones,
    conversacion: conversacionElecciones,
    pauta: pautaElecciones,
  },
  testigos: {
    narrativa: narrativaTestigos,
    pilares: pilaresTestigos,
    noticias: noticiasTestigos,
    contenido: contenidoTestigos,
    conversacion: conversacionTestigos,
    pauta: pautaTestigos,
  },
  legitimidad: {
    narrativa: narrativaLegitimidad,
    pilares: pilaresLegitimidad,
    noticias: noticiasLegitimidad,
    contenido: contenidoLegitimidad,
    conversacion: conversacionLegitimidad,
    pauta: pautaLegitimidad,
  },
  quiroz: {
    narrativa: narrativaQuiroz,
    pilares: pilaresQuiroz,
    noticias: noticiasQuiroz,
    contenido: contenidoQuiroz,
    conversacion: conversacionQuiroz,
    pauta: pautaQuiroz,
  },
};
