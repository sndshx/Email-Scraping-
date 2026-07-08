// ─── Full landing page translations ───────────────────────────────────────────
// Covers the 20 most widely spoken languages in the world.
// Any language not listed falls back to English.

export interface Translation {
  // Navbar
  nav_home: string
  nav_features: string
  nav_how: string
  nav_pricing: string
  nav_faq: string
  nav_signup: string
  nav_login: string

  // Hero
  hero_headline1: string
  hero_headline2: string
  hero_headline_gradient: string
  hero_sub: string
  hero_cta_primary: string
  hero_cta_secondary: string
  hero_trusted: string

  // How it works
  how_title: string
  how_sub: string
  how_step1_tab: string
  how_step2_tab: string
  how_step3_tab: string
  how_step4_tab: string
  how_step5_tab: string

  // Features
  features_title: string
  features_sub: string

  // Pricing
  pricing_title: string
  pricing_sub: string
  pricing_monthly: string
  pricing_yearly: string
  pricing_save: string
  pricing_most_popular: string
  pricing_free_name: string
  pricing_free_desc: string
  pricing_free_cta: string
  pricing_starter_name: string
  pricing_starter_desc: string
  pricing_starter_cta: string
  pricing_plus_name: string
  pricing_plus_desc: string
  pricing_plus_cta: string
  pricing_per_month: string
  pricing_per_year: string

  // FAQ
  faq_title: string
  faq_sub: string
  faq_q1: string
  faq_a1: string
  faq_q2: string
  faq_a2: string
  faq_q3: string
  faq_a3: string
  faq_q4: string
  faq_a4: string
  faq_q5: string
  faq_a5: string

  // Footer / CTA
  footer_cta_title: string
  footer_cta_sub: string
  footer_cta_btn: string
  footer_rights: string
  footer_tagline: string
  footer_scrapers: string
  footer_product: string
  footer_legal: string
  footer_contact: string
}

// ─── Helper ──────────────────────────────────────────────────────────────────
export function getTranslation(code: string): Translation {
  return TRANSLATIONS[code] ?? TRANSLATIONS['en']
}

// ─── English (default) ───────────────────────────────────────────────────────
const en: Translation = {
  nav_home: 'Home',
  nav_features: 'Features',
  nav_how: 'How It Works',
  nav_pricing: 'Pricing',
  nav_faq: 'FAQ',
  nav_signup: 'Sign up',
  nav_login: 'Login',

  hero_headline1: 'Extract Verified Leads',
  hero_headline2: 'From',
  hero_headline_gradient: 'Social Media',
  hero_sub: 'Find verified emails and build clean, targeted contact lists in seconds. Turn profile data into ready-to-use CSVs with zero manual effort.',
  hero_cta_primary: 'Get started for free',
  hero_cta_secondary: 'Watch how it works',
  hero_trusted: 'Trusted by 2,400+ sales teams',

  how_title: 'How It Works',
  how_sub: 'Extract verified contact lists and target exact profiles in five simple, automated stages.',
  how_step1_tab: '01. Sign In',
  how_step2_tab: '02. Set Up Targeting',
  how_step3_tab: '03. Scraper Runs',
  how_step4_tab: '04. Download CSV',
  how_step5_tab: '05. Launch Outreach',

  features_title: 'Everything You Need to Scale Outreach',
  features_sub: 'A complete lead generation toolkit — from extraction to delivery — built for speed and accuracy.',

  pricing_title: 'Simple, transparent pricing',
  pricing_sub: 'Choose the perfect plan for your lead generation needs. Start free and scale up as you grow.',
  pricing_monthly: 'Monthly',
  pricing_yearly: 'Yearly',
  pricing_save: 'Save 43%',
  pricing_most_popular: 'Most Popular',
  pricing_free_name: 'Free',
  pricing_free_desc: 'Try it out, no credit card needed',
  pricing_free_cta: 'Start for Free',
  pricing_starter_name: 'Starter',
  pricing_starter_desc: 'More leads for growing outreach',
  pricing_starter_cta: 'Get Started',
  pricing_plus_name: 'Plus',
  pricing_plus_desc: 'Best for high-volume lead gen',
  pricing_plus_cta: 'Upgrade to Plus',
  pricing_per_month: '/mo',
  pricing_per_year: '/yr',

  faq_title: 'Frequently Asked Questions',
  faq_sub: 'Have questions about ScrapeEngine? Here are answers to our most common inquiries.',
  faq_q1: 'What is ScrapeEngine?',
  faq_a1: 'ScrapeEngine is an AI-powered B2B lead generation tool that helps you scrape and verify email addresses, phone numbers, and profile details from platforms like LinkedIn, Google Maps, and Apollo.io.',
  faq_q2: 'How do you verify emails?',
  faq_a2: 'We connect directly to MX servers and perform an SMTP handshake to verify if the email inbox exists in real-time, without ever sending a real message. This ensures your bounce rate remains below 2%.',
  faq_q3: 'Can I export data to my CRM?',
  faq_a3: 'Yes, all scraped lists are ready to be downloaded as clean, standardized CSV files that you can import directly into HubSpot, Mailchimp, Apollo, lem-list, or any other outreach software.',
  faq_q4: 'Is there a free trial?',
  faq_a4: 'Yes! Our Free Plan includes 50 verified email extractions per month so you can try out our scrapers with zero commitments or credit cards.',
  faq_q5: 'Can I cancel my subscription anytime?',
  faq_a5: 'Absolutely. You can cancel, upgrade, or downgrade your paid subscription at any time directly from your billing dashboard settings page.',

  footer_cta_title: 'Ready to extract your first leads?',
  footer_cta_sub: 'Join 2,400+ sales teams already using ScrapeEngine.',
  footer_cta_btn: 'Start for free',
  footer_rights: '© 2026 ScrapeEngine Lead Systems. All rights reserved.',
  footer_tagline: 'The fastest way to extract verified business leads. Built for modern outreach teams who demand results.',
  footer_scrapers: 'Scrapers',
  footer_product: 'Product',
  footer_legal: 'Legal',
  footer_contact: 'Contact',
}

// ─── Spanish ─────────────────────────────────────────────────────────────────
const es: Translation = {
  nav_home: 'Inicio',
  nav_features: 'Características',
  nav_how: 'Cómo Funciona',
  nav_pricing: 'Precios',
  nav_faq: 'Preguntas',
  nav_signup: 'Registrarse',
  nav_login: 'Iniciar sesión',

  hero_headline1: 'Extrae Leads Verificados',
  hero_headline2: 'Desde',
  hero_headline_gradient: 'Redes Sociales',
  hero_sub: 'Encuentra correos verificados y crea listas de contactos específicas en segundos. Convierte datos de perfil en CSVs listos para usar.',
  hero_cta_primary: 'Empieza gratis',
  hero_cta_secondary: 'Ver cómo funciona',
  hero_trusted: 'Confiado por más de 2,400 equipos de ventas',

  how_title: 'Cómo Funciona',
  how_sub: 'Extrae listas de contactos verificados en cinco etapas simples y automatizadas.',
  how_step1_tab: '01. Iniciar Sesión',
  how_step2_tab: '02. Configurar Objetivo',
  how_step3_tab: '03. Raspador Ejecuta',
  how_step4_tab: '04. Descargar CSV',
  how_step5_tab: '05. Lanzar Campaña',

  features_title: 'Todo lo que Necesitas para Escalar',
  features_sub: 'Un kit completo de generación de leads — desde la extracción hasta la entrega.',

  pricing_title: 'Precios simples y transparentes',
  pricing_sub: 'Elige el plan perfecto para tus necesidades. Empieza gratis y escala mientras creces.',
  pricing_monthly: 'Mensual',
  pricing_yearly: 'Anual',
  pricing_save: 'Ahorra 43%',
  pricing_most_popular: 'Más Popular',
  pricing_free_name: 'Gratis',
  pricing_free_desc: 'Pruébalo, sin tarjeta de crédito',
  pricing_free_cta: 'Empieza Gratis',
  pricing_starter_name: 'Básico',
  pricing_starter_desc: 'Más leads para campañas en crecimiento',
  pricing_starter_cta: 'Comenzar',
  pricing_plus_name: 'Plus',
  pricing_plus_desc: 'Ideal para generación de leads masiva',
  pricing_plus_cta: 'Actualizar a Plus',
  pricing_per_month: '/mes',
  pricing_per_year: '/año',

  faq_title: 'Preguntas Frecuentes',
  faq_sub: '¿Tienes preguntas sobre ScrapeEngine? Aquí están las respuestas más comunes.',
  faq_q1: '¿Qué es ScrapeEngine?',
  faq_a1: 'ScrapeEngine es una herramienta de generación de leads B2B impulsada por IA que te ayuda a extraer y verificar correos, teléfonos y perfiles de LinkedIn, Google Maps y Apollo.io.',
  faq_q2: '¿Cómo verifican los correos?',
  faq_a2: 'Nos conectamos directamente a servidores MX y realizamos un apretón de manos SMTP para verificar si el buzón existe en tiempo real, sin enviar ningún mensaje real.',
  faq_q3: '¿Puedo exportar datos a mi CRM?',
  faq_a3: 'Sí, todas las listas están listas para descargarse como archivos CSV que puedes importar directamente en HubSpot, Mailchimp, Apollo o cualquier otro software.',
  faq_q4: '¿Hay una prueba gratuita?',
  faq_a4: '¡Sí! Nuestro Plan Gratuito incluye 50 extracciones de correo verificadas por mes sin compromisos ni tarjetas de crédito.',
  faq_q5: '¿Puedo cancelar mi suscripción en cualquier momento?',
  faq_a5: 'Por supuesto. Puedes cancelar, actualizar o bajar de categoría tu suscripción en cualquier momento desde tu panel de facturación.',

  footer_cta_title: '¿Listo para extraer tus primeros leads?',
  footer_cta_sub: 'Únete a más de 2,400 equipos de ventas que ya usan ScrapeEngine.',
  footer_cta_btn: 'Empieza gratis',
  footer_rights: '© 2026 ScrapeEngine Lead Systems. Todos los derechos reservados.',
  footer_tagline: 'La forma más rápida de extraer leads de negocios verificados.',
  footer_scrapers: 'Extractores',
  footer_product: 'Producto',
  footer_legal: 'Legal',
  footer_contact: 'Contacto',
}

// ─── French ──────────────────────────────────────────────────────────────────
const fr: Translation = {
  nav_home: 'Accueil',
  nav_features: 'Fonctionnalités',
  nav_how: 'Comment ça Marche',
  nav_pricing: 'Tarifs',
  nav_faq: 'FAQ',
  nav_signup: "S'inscrire",
  nav_login: 'Connexion',

  hero_headline1: 'Extrayez des Leads Vérifiés',
  hero_headline2: 'Depuis les',
  hero_headline_gradient: 'Réseaux Sociaux',
  hero_sub: 'Trouvez des e-mails vérifiés et créez des listes de contacts ciblées en quelques secondes. Transformez les données de profil en CSV prêts à l\'emploi.',
  hero_cta_primary: 'Commencer gratuitement',
  hero_cta_secondary: 'Voir comment ça marche',
  hero_trusted: 'Approuvé par plus de 2 400 équipes commerciales',

  how_title: 'Comment Ça Marche',
  how_sub: 'Extrayez des listes de contacts vérifiés en cinq étapes simples et automatisées.',
  how_step1_tab: '01. Connexion',
  how_step2_tab: '02. Configurer Ciblage',
  how_step3_tab: '03. Scraper Exécute',
  how_step4_tab: '04. Télécharger CSV',
  how_step5_tab: '05. Lancer Campagne',

  features_title: 'Tout ce dont Vous Avez Besoin',
  features_sub: 'Un kit complet de génération de leads — de l\'extraction à la livraison.',

  pricing_title: 'Tarification simple et transparente',
  pricing_sub: 'Choisissez le plan parfait pour vos besoins. Commencez gratuitement et évoluez.',
  pricing_monthly: 'Mensuel',
  pricing_yearly: 'Annuel',
  pricing_save: 'Économisez 43%',
  pricing_most_popular: 'Le Plus Populaire',
  pricing_free_name: 'Gratuit',
  pricing_free_desc: 'Essayez-le, sans carte bancaire',
  pricing_free_cta: 'Commencer Gratuitement',
  pricing_starter_name: 'Débutant',
  pricing_starter_desc: 'Plus de leads pour votre campagne',
  pricing_starter_cta: 'Commencer',
  pricing_plus_name: 'Plus',
  pricing_plus_desc: 'Idéal pour la génération de leads en volume',
  pricing_plus_cta: 'Passer à Plus',
  pricing_per_month: '/mois',
  pricing_per_year: '/an',

  faq_title: 'Questions Fréquentes',
  faq_sub: 'Des questions sur ScrapeEngine ? Voici les réponses à nos questions les plus courantes.',
  faq_q1: 'Qu\'est-ce que ScrapeEngine ?',
  faq_a1: 'ScrapeEngine est un outil de génération de leads B2B alimenté par l\'IA qui vous aide à extraire et vérifier les e-mails, numéros de téléphone et profils depuis LinkedIn, Google Maps et Apollo.io.',
  faq_q2: 'Comment vérifiez-vous les e-mails ?',
  faq_a2: 'Nous nous connectons directement aux serveurs MX et effectuons une liaison SMTP pour vérifier si la boîte mail existe en temps réel, sans jamais envoyer de vrai message.',
  faq_q3: 'Puis-je exporter des données vers mon CRM ?',
  faq_a3: 'Oui, toutes les listes peuvent être téléchargées en fichiers CSV propres que vous pouvez importer dans HubSpot, Mailchimp, Apollo ou tout autre logiciel.',
  faq_q4: 'Y a-t-il un essai gratuit ?',
  faq_a4: 'Oui ! Notre Plan Gratuit inclut 50 extractions d\'e-mails vérifiées par mois sans engagement ni carte de crédit.',
  faq_q5: 'Puis-je annuler mon abonnement à tout moment ?',
  faq_a5: 'Absolument. Vous pouvez annuler, mettre à niveau ou rétrograder votre abonnement à tout moment depuis votre tableau de bord de facturation.',

  footer_cta_title: 'Prêt à extraire vos premiers leads ?',
  footer_cta_sub: 'Rejoignez plus de 2 400 équipes commerciales utilisant déjà ScrapeEngine.',
  footer_cta_btn: 'Commencer gratuitement',
  footer_rights: '© 2026 ScrapeEngine Lead Systems. Tous droits réservés.',
  footer_tagline: 'La façon la plus rapide d\'extraire des leads d\'affaires vérifiés.',
  footer_scrapers: 'Extracteurs',
  footer_product: 'Produit',
  footer_legal: 'Légal',
  footer_contact: 'Contact',
}

// ─── German ──────────────────────────────────────────────────────────────────
const de: Translation = {
  nav_home: 'Startseite',
  nav_features: 'Funktionen',
  nav_how: 'Wie es Funktioniert',
  nav_pricing: 'Preise',
  nav_faq: 'FAQ',
  nav_signup: 'Registrieren',
  nav_login: 'Anmelden',

  hero_headline1: 'Verifizierte Leads Extrahieren',
  hero_headline2: 'Aus',
  hero_headline_gradient: 'Sozialen Medien',
  hero_sub: 'Finden Sie verifizierte E-Mails und erstellen Sie gezielte Kontaktlisten in Sekunden. Verwandeln Sie Profildaten in fertige CSVs.',
  hero_cta_primary: 'Kostenlos starten',
  hero_cta_secondary: 'Wie es funktioniert',
  hero_trusted: 'Vertraut von über 2.400 Vertriebsteams',

  how_title: 'Wie Es Funktioniert',
  how_sub: 'Extrahieren Sie verifizierte Kontaktlisten in fünf einfachen, automatisierten Schritten.',
  how_step1_tab: '01. Anmelden',
  how_step2_tab: '02. Targeting Einrichten',
  how_step3_tab: '03. Scraper Läuft',
  how_step4_tab: '04. CSV Herunterladen',
  how_step5_tab: '05. Kampagne Starten',

  features_title: 'Alles, was Sie zum Skalieren Brauchen',
  features_sub: 'Ein komplettes Lead-Generierungs-Toolkit — von der Extraktion bis zur Lieferung.',

  pricing_title: 'Einfache, transparente Preise',
  pricing_sub: 'Wählen Sie den perfekten Plan für Ihre Bedürfnisse. Starten Sie kostenlos und wachsen Sie.',
  pricing_monthly: 'Monatlich',
  pricing_yearly: 'Jährlich',
  pricing_save: '43% Sparen',
  pricing_most_popular: 'Am Beliebtesten',
  pricing_free_name: 'Kostenlos',
  pricing_free_desc: 'Ausprobieren, keine Kreditkarte nötig',
  pricing_free_cta: 'Kostenlos Starten',
  pricing_starter_name: 'Starter',
  pricing_starter_desc: 'Mehr Leads für wachsende Kampagnen',
  pricing_starter_cta: 'Loslegen',
  pricing_plus_name: 'Plus',
  pricing_plus_desc: 'Ideal für hohe Lead-Generierung',
  pricing_plus_cta: 'Zu Plus Upgraden',
  pricing_per_month: '/Mo.',
  pricing_per_year: '/Jahr',

  faq_title: 'Häufig Gestellte Fragen',
  faq_sub: 'Haben Sie Fragen zu ScrapeEngine? Hier sind Antworten auf unsere häufigsten Anfragen.',
  faq_q1: 'Was ist ScrapeEngine?',
  faq_a1: 'ScrapeEngine ist ein KI-gestütztes B2B-Lead-Generierungstool, das Ihnen hilft, E-Mail-Adressen, Telefonnummern und Profildetails von LinkedIn, Google Maps und Apollo.io zu scrapen und zu verifizieren.',
  faq_q2: 'Wie verifizieren Sie E-Mails?',
  faq_a2: 'Wir verbinden uns direkt mit MX-Servern und führen einen SMTP-Handshake durch, um zu überprüfen, ob der E-Mail-Posteingang in Echtzeit existiert, ohne jemals eine echte Nachricht zu senden.',
  faq_q3: 'Kann ich Daten in mein CRM exportieren?',
  faq_a3: 'Ja, alle gescrapten Listen können als saubere CSV-Dateien heruntergeladen werden, die Sie direkt in HubSpot, Mailchimp, Apollo oder andere Software importieren können.',
  faq_q4: 'Gibt es eine kostenlose Testversion?',
  faq_a4: 'Ja! Unser kostenloser Plan enthält 50 verifizierte E-Mail-Extraktionen pro Monat ohne Verpflichtungen oder Kreditkarten.',
  faq_q5: 'Kann ich mein Abonnement jederzeit kündigen?',
  faq_a5: 'Absolut. Sie können Ihr bezahltes Abonnement jederzeit direkt über Ihr Abrechnungs-Dashboard kündigen, upgraden oder downgraden.',

  footer_cta_title: 'Bereit, Ihre ersten Leads zu extrahieren?',
  footer_cta_sub: 'Schließen Sie sich über 2.400 Vertriebsteams an, die ScrapeEngine bereits nutzen.',
  footer_cta_btn: 'Kostenlos starten',
  footer_rights: '© 2026 ScrapeEngine Lead Systems. Alle Rechte vorbehalten.',
  footer_tagline: 'Der schnellste Weg, verifizierte Geschäftskontakte zu extrahieren.',
  footer_scrapers: 'Scraper',
  footer_product: 'Produkt',
  footer_legal: 'Rechtliches',
  footer_contact: 'Kontakt',
}

// ─── Portuguese ──────────────────────────────────────────────────────────────
const pt: Translation = {
  nav_home: 'Início',
  nav_features: 'Funcionalidades',
  nav_how: 'Como Funciona',
  nav_pricing: 'Preços',
  nav_faq: 'FAQ',
  nav_signup: 'Cadastrar',
  nav_login: 'Entrar',

  hero_headline1: 'Extraia Leads Verificados',
  hero_headline2: 'Das',
  hero_headline_gradient: 'Redes Sociais',
  hero_sub: 'Encontre e-mails verificados e crie listas de contatos direcionadas em segundos. Transforme dados de perfil em CSVs prontos para uso.',
  hero_cta_primary: 'Comece de graça',
  hero_cta_secondary: 'Ver como funciona',
  hero_trusted: 'Confiado por mais de 2.400 equipes de vendas',

  how_title: 'Como Funciona',
  how_sub: 'Extraia listas de contatos verificados em cinco estágios simples e automatizados.',
  how_step1_tab: '01. Entrar',
  how_step2_tab: '02. Configurar Alvo',
  how_step3_tab: '03. Scraper Executa',
  how_step4_tab: '04. Baixar CSV',
  how_step5_tab: '05. Lançar Campanha',

  features_title: 'Tudo que Você Precisa para Escalar',
  features_sub: 'Um kit completo de geração de leads — da extração à entrega.',

  pricing_title: 'Preços simples e transparentes',
  pricing_sub: 'Escolha o plano perfeito para suas necessidades. Comece de graça e escale enquanto cresce.',
  pricing_monthly: 'Mensal',
  pricing_yearly: 'Anual',
  pricing_save: 'Economize 43%',
  pricing_most_popular: 'Mais Popular',
  pricing_free_name: 'Grátis',
  pricing_free_desc: 'Experimente, sem cartão de crédito',
  pricing_free_cta: 'Começar Grátis',
  pricing_starter_name: 'Starter',
  pricing_starter_desc: 'Mais leads para campanhas em crescimento',
  pricing_starter_cta: 'Começar',
  pricing_plus_name: 'Plus',
  pricing_plus_desc: 'Ideal para geração de leads em volume',
  pricing_plus_cta: 'Atualizar para Plus',
  pricing_per_month: '/mês',
  pricing_per_year: '/ano',

  faq_title: 'Perguntas Frequentes',
  faq_sub: 'Tem perguntas sobre o ScrapeEngine? Aqui estão as respostas para nossas consultas mais comuns.',
  faq_q1: 'O que é o ScrapeEngine?',
  faq_a1: 'O ScrapeEngine é uma ferramenta de geração de leads B2B movida por IA que ajuda você a extrair e verificar endereços de e-mail, números de telefone e detalhes de perfil do LinkedIn, Google Maps e Apollo.io.',
  faq_q2: 'Como vocês verificam os e-mails?',
  faq_a2: 'Nos conectamos diretamente aos servidores MX e realizamos um handshake SMTP para verificar se a caixa de entrada existe em tempo real, sem enviar uma mensagem real.',
  faq_q3: 'Posso exportar dados para meu CRM?',
  faq_a3: 'Sim, todas as listas extraídas estão prontas para download como arquivos CSV que você pode importar diretamente no HubSpot, Mailchimp, Apollo ou qualquer outro software.',
  faq_q4: 'Há um teste gratuito?',
  faq_a4: 'Sim! Nosso Plano Gratuito inclui 50 extrações de e-mail verificadas por mês sem compromissos ou cartões de crédito.',
  faq_q5: 'Posso cancelar minha assinatura a qualquer momento?',
  faq_a5: 'Com certeza. Você pode cancelar, atualizar ou rebaixar sua assinatura paga a qualquer momento diretamente do seu painel de faturamento.',

  footer_cta_title: 'Pronto para extrair seus primeiros leads?',
  footer_cta_sub: 'Junte-se a mais de 2.400 equipes de vendas que já usam o ScrapeEngine.',
  footer_cta_btn: 'Começar de graça',
  footer_rights: '© 2026 ScrapeEngine Lead Systems. Todos os direitos reservados.',
  footer_tagline: 'A maneira mais rápida de extrair leads de negócios verificados.',
  footer_scrapers: 'Scrapers',
  footer_product: 'Produto',
  footer_legal: 'Legal',
  footer_contact: 'Contato',
}

// ─── Hindi ───────────────────────────────────────────────────────────────────
const hi: Translation = {
  nav_home: 'होम',
  nav_features: 'विशेषताएं',
  nav_how: 'यह कैसे काम करता है',
  nav_pricing: 'मूल्य निर्धारण',
  nav_faq: 'सवाल-जवाब',
  nav_signup: 'साइन अप',
  nav_login: 'लॉगिन',

  hero_headline1: 'सत्यापित लीड्स निकालें',
  hero_headline2: 'से',
  hero_headline_gradient: 'सोशल मीडिया',
  hero_sub: 'सेकंडों में सत्यापित ईमेल खोजें और लक्षित संपर्क सूचियां बनाएं। प्रोफ़ाइल डेटा को उपयोग के लिए तैयार CSV में बदलें।',
  hero_cta_primary: 'मुफ्त में शुरू करें',
  hero_cta_secondary: 'देखें यह कैसे काम करता है',
  hero_trusted: '2,400+ बिक्री टीमों द्वारा भरोसेमंद',

  how_title: 'यह कैसे काम करता है',
  how_sub: 'पांच सरल, स्वचालित चरणों में सत्यापित संपर्क सूचियां निकालें।',
  how_step1_tab: '01. साइन इन',
  how_step2_tab: '02. लक्ष्य सेटअप',
  how_step3_tab: '03. स्क्रेपर चलता है',
  how_step4_tab: '04. CSV डाउनलोड',
  how_step5_tab: '05. अभियान शुरू करें',

  features_title: 'आउटरीच बढ़ाने के लिए सब कुछ',
  features_sub: 'एक संपूर्ण लीड जनरेशन टूलकिट — निष्कर्षण से डिलीवरी तक।',

  pricing_title: 'सरल, पारदर्शी मूल्य निर्धारण',
  pricing_sub: 'अपनी ज़रूरतों के लिए सही योजना चुनें। मुफ्त में शुरू करें।',
  pricing_monthly: 'मासिक',
  pricing_yearly: 'वार्षिक',
  pricing_save: '43% बचाएं',
  pricing_most_popular: 'सबसे लोकप्रिय',
  pricing_free_name: 'मुफ्त',
  pricing_free_desc: 'इसे आज़माएं, कोई क्रेडिट कार्ड नहीं चाहिए',
  pricing_free_cta: 'मुफ्त में शुरू करें',
  pricing_starter_name: 'स्टार्टर',
  pricing_starter_desc: 'बढ़ते अभियान के लिए अधिक लीड',
  pricing_starter_cta: 'शुरू करें',
  pricing_plus_name: 'प्लस',
  pricing_plus_desc: 'उच्च-मात्रा लीड जनरेशन के लिए सर्वश्रेष्ठ',
  pricing_plus_cta: 'प्लस में अपग्रेड करें',
  pricing_per_month: '/माह',
  pricing_per_year: '/वर्ष',

  faq_title: 'अक्सर पूछे जाने वाले सवाल',
  faq_sub: 'ScrapeEngine के बारे में सवाल हैं? यहां सबसे सामान्य सवालों के जवाब हैं।',
  faq_q1: 'ScrapeEngine क्या है?',
  faq_a1: 'ScrapeEngine एक AI-संचालित B2B लीड जनरेशन टूल है जो LinkedIn, Google Maps और Apollo.io से ईमेल, फोन नंबर और प्रोफ़ाइल विवरण निकालने में मदद करता है।',
  faq_q2: 'आप ईमेल कैसे सत्यापित करते हैं?',
  faq_a2: 'हम MX सर्वर से सीधे कनेक्ट होते हैं और SMTP हैंडशेक करते हैं, बिना कोई वास्तविक संदेश भेजे।',
  faq_q3: 'क्या मैं CRM में डेटा निर्यात कर सकता हूं?',
  faq_a3: 'हां, सभी स्क्रेप की गई सूचियां CSV फ़ाइलों के रूप में डाउनलोड के लिए तैयार हैं।',
  faq_q4: 'क्या कोई मुफ्त परीक्षण है?',
  faq_a4: 'हां! हमारी मुफ्त योजना में प्रति माह 50 सत्यापित ईमेल निष्कर्षण शामिल हैं।',
  faq_q5: 'क्या मैं अपनी सदस्यता कभी भी रद्द कर सकता हूं?',
  faq_a5: 'बिल्कुल। आप अपने बिलिंग डैशबोर्ड से कभी भी रद्द, अपग्रेड या डाउनग्रेड कर सकते हैं।',

  footer_cta_title: 'अपने पहले लीड्स निकालने के लिए तैयार हैं?',
  footer_cta_sub: '2,400+ बिक्री टीमें पहले से ScrapeEngine का उपयोग कर रही हैं।',
  footer_cta_btn: 'मुफ्त में शुरू करें',
  footer_rights: '© 2026 ScrapeEngine Lead Systems. सर्वाधिकार सुरक्षित।',
  footer_tagline: 'सत्यापित व्यावसायिक लीड निकालने का सबसे तेज़ तरीका।',
  footer_scrapers: 'स्क्रेपर्स',
  footer_product: 'उत्पाद',
  footer_legal: 'कानूनी',
  footer_contact: 'संपर्क',
}

// ─── Arabic ──────────────────────────────────────────────────────────────────
const ar: Translation = {
  nav_home: 'الرئيسية',
  nav_features: 'المميزات',
  nav_how: 'كيف يعمل',
  nav_pricing: 'الأسعار',
  nav_faq: 'الأسئلة الشائعة',
  nav_signup: 'إنشاء حساب',
  nav_login: 'تسجيل الدخول',

  hero_headline1: 'استخرج عملاء محتملين موثقين',
  hero_headline2: 'من',
  hero_headline_gradient: 'وسائل التواصل الاجتماعي',
  hero_sub: 'ابحث عن بريد إلكتروني موثق وأنشئ قوائم اتصال مستهدفة في ثوانٍ.',
  hero_cta_primary: 'ابدأ مجاناً',
  hero_cta_secondary: 'شاهد كيف يعمل',
  hero_trusted: 'موثوق به من قبل أكثر من 2,400 فريق مبيعات',

  how_title: 'كيف يعمل',
  how_sub: 'استخرج قوائم الاتصال الموثقة في خمس مراحل بسيطة وآلية.',
  how_step1_tab: '01. تسجيل الدخول',
  how_step2_tab: '02. إعداد الاستهداف',
  how_step3_tab: '03. تشغيل الماسح',
  how_step4_tab: '04. تحميل CSV',
  how_step5_tab: '05. إطلاق الحملة',

  features_title: 'كل ما تحتاجه لتوسيع نطاق عملك',
  features_sub: 'مجموعة أدوات كاملة لتوليد العملاء المحتملين.',

  pricing_title: 'أسعار بسيطة وشفافة',
  pricing_sub: 'اختر الخطة المثالية لاحتياجاتك. ابدأ مجاناً.',
  pricing_monthly: 'شهري',
  pricing_yearly: 'سنوي',
  pricing_save: 'وفر 43%',
  pricing_most_popular: 'الأكثر شعبية',
  pricing_free_name: 'مجاني',
  pricing_free_desc: 'جربه، لا بطاقة ائتمان مطلوبة',
  pricing_free_cta: 'ابدأ مجاناً',
  pricing_starter_name: 'المبتدئ',
  pricing_starter_desc: 'المزيد من العملاء للحملات المتنامية',
  pricing_starter_cta: 'ابدأ الآن',
  pricing_plus_name: 'بلس',
  pricing_plus_desc: 'الأفضل لتوليد العملاء بحجم كبير',
  pricing_plus_cta: 'الترقية إلى بلس',
  pricing_per_month: '/شهر',
  pricing_per_year: '/سنة',

  faq_title: 'الأسئلة الشائعة',
  faq_sub: 'هل لديك أسئلة حول ScrapeEngine؟ إليك إجابات لاستفساراتنا الأكثر شيوعاً.',
  faq_q1: 'ما هو ScrapeEngine؟',
  faq_a1: 'ScrapeEngine هي أداة توليد عملاء B2B مدعومة بالذكاء الاصطناعي تساعدك على استخراج والتحقق من عناوين البريد الإلكتروني وأرقام الهواتف وتفاصيل الملف الشخصي من LinkedIn وخرائط Google وApollo.io.',
  faq_q2: 'كيف تتحقق من رسائل البريد الإلكتروني؟',
  faq_a2: 'نتصل مباشرة بخوادم MX ونجري مصافحة SMTP للتحقق مما إذا كان صندوق البريد الوارد موجوداً في الوقت الفعلي.',
  faq_q3: 'هل يمكنني تصدير البيانات إلى CRM الخاص بي؟',
  faq_a3: 'نعم، جميع القوائم المستخرجة جاهزة للتنزيل كملفات CSV نظيفة.',
  faq_q4: 'هل هناك تجربة مجانية؟',
  faq_a4: 'نعم! تتضمن خطتنا المجانية 50 استخراج بريد إلكتروني موثق شهرياً.',
  faq_q5: 'هل يمكنني إلغاء اشتراكي في أي وقت؟',
  faq_a5: 'بالتأكيد. يمكنك إلغاء أو ترقية أو تخفيض اشتراكك المدفوع في أي وقت.',

  footer_cta_title: 'هل أنت مستعد لاستخراج عملائك المحتملين الأوائل؟',
  footer_cta_sub: 'انضم إلى أكثر من 2,400 فريق مبيعات يستخدمون ScrapeEngine بالفعل.',
  footer_cta_btn: 'ابدأ مجاناً',
  footer_rights: '© 2026 ScrapeEngine Lead Systems. جميع الحقوق محفوظة.',
  footer_tagline: 'الطريقة الأسرع لاستخراج عملاء تجاريين موثقين.',
  footer_scrapers: 'الماسحات',
  footer_product: 'المنتج',
  footer_legal: 'قانوني',
  footer_contact: 'اتصل بنا',
}

// ─── Chinese ─────────────────────────────────────────────────────────────────
const zh: Translation = {
  nav_home: '首页',
  nav_features: '功能',
  nav_how: '工作原理',
  nav_pricing: '定价',
  nav_faq: '常见问题',
  nav_signup: '注册',
  nav_login: '登录',

  hero_headline1: '从社交媒体提取',
  hero_headline2: '经过验证的',
  hero_headline_gradient: '潜在客户',
  hero_sub: '在几秒钟内找到经过验证的电子邮件，建立精准的联系人列表。将个人资料数据转换为随时可用的CSV文件。',
  hero_cta_primary: '免费开始',
  hero_cta_secondary: '查看工作原理',
  hero_trusted: '受到2,400多个销售团队的信赖',

  how_title: '工作原理',
  how_sub: '通过五个简单的自动化阶段提取经过验证的联系人列表。',
  how_step1_tab: '01. 登录',
  how_step2_tab: '02. 设置目标',
  how_step3_tab: '03. 爬虫运行',
  how_step4_tab: '04. 下载CSV',
  how_step5_tab: '05. 启动推广',

  features_title: '扩展外联所需的一切',
  features_sub: '完整的潜在客户生成工具包——从提取到交付。',

  pricing_title: '简单透明的定价',
  pricing_sub: '为您的需求选择完美的计划。免费开始，随着成长而扩展。',
  pricing_monthly: '月付',
  pricing_yearly: '年付',
  pricing_save: '节省43%',
  pricing_most_popular: '最受欢迎',
  pricing_free_name: '免费',
  pricing_free_desc: '无需信用卡即可试用',
  pricing_free_cta: '免费开始',
  pricing_starter_name: '入门版',
  pricing_starter_desc: '为增长中的外联活动提供更多潜在客户',
  pricing_starter_cta: '开始使用',
  pricing_plus_name: 'Plus版',
  pricing_plus_desc: '适合高容量潜在客户生成',
  pricing_plus_cta: '升级到Plus',
  pricing_per_month: '/月',
  pricing_per_year: '/年',

  faq_title: '常见问题',
  faq_sub: '对ScrapeEngine有疑问？以下是我们最常见问题的答案。',
  faq_q1: 'ScrapeEngine是什么？',
  faq_a1: 'ScrapeEngine是一款AI驱动的B2B潜在客户生成工具，可帮助您从LinkedIn、Google Maps和Apollo.io抓取和验证电子邮件地址、电话号码和个人资料详情。',
  faq_q2: '你们如何验证电子邮件？',
  faq_a2: '我们直接连接到MX服务器并执行SMTP握手，实时验证电子邮件收件箱是否存在，而无需发送任何实际消息。',
  faq_q3: '我可以将数据导出到我的CRM吗？',
  faq_a3: '可以，所有抓取的列表都可以下载为干净的CSV文件，直接导入HubSpot、Mailchimp、Apollo等。',
  faq_q4: '有免费试用吗？',
  faq_a4: '有！我们的免费计划每月包含50次经过验证的电子邮件提取，无需承诺或信用卡。',
  faq_q5: '我可以随时取消订阅吗？',
  faq_a5: '当然可以。您可以随时直接从您的计费控制面板取消、升级或降级您的付费订阅。',

  footer_cta_title: '准备好提取您的第一批潜在客户了吗？',
  footer_cta_sub: '加入已经使用ScrapeEngine的2,400多个销售团队。',
  footer_cta_btn: '免费开始',
  footer_rights: '© 2026 ScrapeEngine Lead Systems. 版权所有。',
  footer_tagline: '提取经过验证的商业潜在客户的最快方式。',
  footer_scrapers: '爬虫',
  footer_product: '产品',
  footer_legal: '法律',
  footer_contact: '联系我们',
}

// ─── Japanese ─────────────────────────────────────────────────────────────────
const ja: Translation = {
  nav_home: 'ホーム',
  nav_features: '機能',
  nav_how: '使い方',
  nav_pricing: '料金',
  nav_faq: 'よくある質問',
  nav_signup: '新規登録',
  nav_login: 'ログイン',

  hero_headline1: '認証済みリードを抽出',
  hero_headline2: 'から',
  hero_headline_gradient: 'ソーシャルメディア',
  hero_sub: '数秒で認証済みメールを見つけ、ターゲットを絞った連絡先リストを作成。プロフィールデータをすぐに使えるCSVに変換。',
  hero_cta_primary: '無料で始める',
  hero_cta_secondary: '使い方を見る',
  hero_trusted: '2,400以上の営業チームに信頼されています',

  how_title: '使い方',
  how_sub: '5つのシンプルな自動化ステップで認証済み連絡先リストを抽出。',
  how_step1_tab: '01. サインイン',
  how_step2_tab: '02. ターゲット設定',
  how_step3_tab: '03. スクレイパー実行',
  how_step4_tab: '04. CSVダウンロード',
  how_step5_tab: '05. アウトリーチ開始',

  features_title: 'アウトリーチを拡大するために必要なすべて',
  features_sub: '抽出から配信まで、完全なリード生成ツールキット。',

  pricing_title: 'シンプルで透明な料金',
  pricing_sub: 'ニーズに合わせた最適なプランを選択。無料で始めて、成長に合わせてスケールアップ。',
  pricing_monthly: '月払い',
  pricing_yearly: '年払い',
  pricing_save: '43%節約',
  pricing_most_popular: '最も人気',
  pricing_free_name: '無料',
  pricing_free_desc: 'クレジットカード不要でお試し',
  pricing_free_cta: '無料で始める',
  pricing_starter_name: 'スターター',
  pricing_starter_desc: '成長するアウトリーチのためのより多くのリード',
  pricing_starter_cta: '始める',
  pricing_plus_name: 'プラス',
  pricing_plus_desc: '大量リード生成に最適',
  pricing_plus_cta: 'プラスにアップグレード',
  pricing_per_month: '/月',
  pricing_per_year: '/年',

  faq_title: 'よくある質問',
  faq_sub: 'ScrapeEngineについてご質問がありますか？最もよくある質問への回答はこちらです。',
  faq_q1: 'ScrapeEngineとは？',
  faq_a1: 'ScrapeEngineはAI搭載のB2Bリード生成ツールで、LinkedIn、Googleマップ、Apollo.ioからメールアドレス、電話番号、プロフィール詳細をスクレイピング・認証するのに役立ちます。',
  faq_q2: 'メールをどうやって認証しますか？',
  faq_a2: 'MXサーバーに直接接続し、実際のメッセージを送信することなくSMTPハンドシェイクを実行して、受信ボックスがリアルタイムで存在するかを確認します。',
  faq_q3: 'CRMにデータをエクスポートできますか？',
  faq_a3: 'はい、スクレイピングされたすべてのリストはHubSpot、Mailchimp、Apolloなどに直接インポートできるCSVファイルとしてダウンロードできます。',
  faq_q4: '無料トライアルはありますか？',
  faq_a4: 'はい！無料プランには月50回の認証済みメール抽出が含まれており、コミットメントやクレジットカードなしでお試しいただけます。',
  faq_q5: 'いつでもサブスクリプションをキャンセルできますか？',
  faq_a5: 'もちろんです。請求ダッシュボードからいつでも有料サブスクリプションをキャンセル、アップグレード、またはダウングレードできます。',

  footer_cta_title: '最初のリードを抽出する準備はできましたか？',
  footer_cta_sub: 'ScrapeEngineをすでに使用している2,400以上の営業チームに参加しましょう。',
  footer_cta_btn: '無料で始める',
  footer_rights: '© 2026 ScrapeEngine Lead Systems. 全著作権所有。',
  footer_tagline: '認証済みビジネスリードを抽出する最速の方法。',
  footer_scrapers: 'スクレイパー',
  footer_product: '製品',
  footer_legal: '法律',
  footer_contact: 'お問い合わせ',
}

// ─── Korean ───────────────────────────────────────────────────────────────────
const ko: Translation = {
  nav_home: '홈',
  nav_features: '기능',
  nav_how: '작동 방식',
  nav_pricing: '가격',
  nav_faq: 'FAQ',
  nav_signup: '회원가입',
  nav_login: '로그인',

  hero_headline1: '검증된 리드 추출',
  hero_headline2: '소셜 미디어에서',
  hero_headline_gradient: '잠재 고객 발굴',
  hero_sub: '몇 초 안에 검증된 이메일을 찾고 타겟 연락처 목록을 만드세요. 프로필 데이터를 즉시 사용 가능한 CSV로 변환하세요.',
  hero_cta_primary: '무료로 시작하기',
  hero_cta_secondary: '작동 방식 보기',
  hero_trusted: '2,400개 이상의 영업팀이 신뢰',

  how_title: '작동 방식',
  how_sub: '5단계의 간단한 자동화 프로세스로 검증된 연락처 목록을 추출하세요.',
  how_step1_tab: '01. 로그인',
  how_step2_tab: '02. 타겟팅 설정',
  how_step3_tab: '03. 스크래퍼 실행',
  how_step4_tab: '04. CSV 다운로드',
  how_step5_tab: '05. 아웃리치 시작',

  features_title: '아웃리치 확장에 필요한 모든 것',
  features_sub: '추출부터 전달까지 완벽한 리드 생성 툴킷.',

  pricing_title: '간단하고 투명한 가격',
  pricing_sub: '리드 생성 요구에 맞는 완벽한 플랜을 선택하세요.',
  pricing_monthly: '월간',
  pricing_yearly: '연간',
  pricing_save: '43% 절약',
  pricing_most_popular: '가장 인기 있는',
  pricing_free_name: '무료',
  pricing_free_desc: '신용카드 없이 체험해보세요',
  pricing_free_cta: '무료로 시작하기',
  pricing_starter_name: '스타터',
  pricing_starter_desc: '성장하는 아웃리치를 위한 더 많은 리드',
  pricing_starter_cta: '시작하기',
  pricing_plus_name: '플러스',
  pricing_plus_desc: '대용량 리드 생성에 최적',
  pricing_plus_cta: '플러스로 업그레이드',
  pricing_per_month: '/월',
  pricing_per_year: '/년',

  faq_title: '자주 묻는 질문',
  faq_sub: 'ScrapeEngine에 대해 궁금한 점이 있으신가요?',
  faq_q1: 'ScrapeEngine이란 무엇인가요?',
  faq_a1: 'ScrapeEngine은 LinkedIn, Google Maps, Apollo.io에서 이메일, 전화번호, 프로필 세부 정보를 스크래핑하고 검증하는 AI 기반 B2B 리드 생성 도구입니다.',
  faq_q2: '이메일을 어떻게 검증하나요?',
  faq_a2: 'MX 서버에 직접 연결하여 실제 메시지를 보내지 않고 SMTP 핸드셰이크를 수행해 실시간으로 이메일 수신함 존재 여부를 확인합니다.',
  faq_q3: 'CRM으로 데이터를 내보낼 수 있나요?',
  faq_a3: '네, 모든 스크래핑된 목록은 HubSpot, Mailchimp, Apollo 등에 직접 가져올 수 있는 CSV 파일로 다운로드 가능합니다.',
  faq_q4: '무료 체험이 있나요?',
  faq_a4: '네! 무료 플랜에는 월 50회의 검증된 이메일 추출이 포함되어 있습니다.',
  faq_q5: '언제든지 구독을 취소할 수 있나요?',
  faq_a5: '물론입니다. 청구 대시보드에서 언제든지 유료 구독을 취소, 업그레이드 또는 다운그레이드할 수 있습니다.',

  footer_cta_title: '첫 번째 리드를 추출할 준비가 되셨나요?',
  footer_cta_sub: '이미 ScrapeEngine을 사용하는 2,400개 이상의 영업팀에 합류하세요.',
  footer_cta_btn: '무료로 시작하기',
  footer_rights: '© 2026 ScrapeEngine Lead Systems. 모든 권리 보유.',
  footer_tagline: '검증된 비즈니스 리드를 추출하는 가장 빠른 방법.',
  footer_scrapers: '스크래퍼',
  footer_product: '제품',
  footer_legal: '법적 고지',
  footer_contact: '문의',
}

// ─── Russian ─────────────────────────────────────────────────────────────────
const ru: Translation = {
  nav_home: 'Главная',
  nav_features: 'Функции',
  nav_how: 'Как это Работает',
  nav_pricing: 'Цены',
  nav_faq: 'Вопросы',
  nav_signup: 'Регистрация',
  nav_login: 'Войти',

  hero_headline1: 'Извлеките Проверенные Лиды',
  hero_headline2: 'Из',
  hero_headline_gradient: 'Социальных Сетей',
  hero_sub: 'Найдите проверенные email-адреса и создайте целевые списки контактов за секунды.',
  hero_cta_primary: 'Начать бесплатно',
  hero_cta_secondary: 'Смотреть как работает',
  hero_trusted: 'Доверяют более 2400 отделов продаж',

  how_title: 'Как Это Работает',
  how_sub: 'Извлекайте проверенные списки контактов в пять простых автоматизированных этапов.',
  how_step1_tab: '01. Войти',
  how_step2_tab: '02. Настроить Таргетинг',
  how_step3_tab: '03. Скрапер Запускается',
  how_step4_tab: '04. Скачать CSV',
  how_step5_tab: '05. Запустить Рассылку',

  features_title: 'Всё необходимое для масштабирования',
  features_sub: 'Полный инструментарий для генерации лидов — от извлечения до доставки.',

  pricing_title: 'Простые и прозрачные цены',
  pricing_sub: 'Выберите идеальный план для ваших потребностей. Начните бесплатно.',
  pricing_monthly: 'Ежемесячно',
  pricing_yearly: 'Ежегодно',
  pricing_save: 'Сэкономьте 43%',
  pricing_most_popular: 'Самый популярный',
  pricing_free_name: 'Бесплатно',
  pricing_free_desc: 'Попробуйте, кредитная карта не нужна',
  pricing_free_cta: 'Начать бесплатно',
  pricing_starter_name: 'Стартер',
  pricing_starter_desc: 'Больше лидов для растущих кампаний',
  pricing_starter_cta: 'Начать',
  pricing_plus_name: 'Плюс',
  pricing_plus_desc: 'Лучший для массовой генерации лидов',
  pricing_plus_cta: 'Обновить до Плюс',
  pricing_per_month: '/мес.',
  pricing_per_year: '/год',

  faq_title: 'Часто Задаваемые Вопросы',
  faq_sub: 'Есть вопросы о ScrapeEngine? Вот ответы на наши самые распространённые запросы.',
  faq_q1: 'Что такое ScrapeEngine?',
  faq_a1: 'ScrapeEngine — это инструмент для генерации лидов B2B на базе ИИ, который помогает извлекать и проверять email-адреса, номера телефонов и детали профилей из LinkedIn, Google Maps и Apollo.io.',
  faq_q2: 'Как вы проверяете email-адреса?',
  faq_a2: 'Мы подключаемся напрямую к MX-серверам и выполняем SMTP-рукопожатие для проверки существования почтового ящика в реальном времени.',
  faq_q3: 'Могу ли я экспортировать данные в CRM?',
  faq_a3: 'Да, все извлечённые списки готовы для загрузки в виде CSV-файлов, которые можно импортировать в HubSpot, Mailchimp, Apollo и другие.',
  faq_q4: 'Есть ли бесплатный пробный период?',
  faq_a4: 'Да! Наш бесплатный план включает 50 проверенных извлечений email в месяц без обязательств и кредитных карт.',
  faq_q5: 'Могу ли я отменить подписку в любое время?',
  faq_a5: 'Абсолютно. Вы можете отменить, обновить или понизить платную подписку в любое время из панели управления.',

  footer_cta_title: 'Готовы извлечь ваши первые лиды?',
  footer_cta_sub: 'Присоединяйтесь к более чем 2400 отделам продаж, уже использующим ScrapeEngine.',
  footer_cta_btn: 'Начать бесплатно',
  footer_rights: '© 2026 ScrapeEngine Lead Systems. Все права защищены.',
  footer_tagline: 'Самый быстрый способ извлечь проверенные бизнес-контакты.',
  footer_scrapers: 'Скраперы',
  footer_product: 'Продукт',
  footer_legal: 'Юридическое',
  footer_contact: 'Контакты',
}

// ─── Turkish ─────────────────────────────────────────────────────────────────
const tr: Translation = {
  nav_home: 'Ana Sayfa',
  nav_features: 'Özellikler',
  nav_how: 'Nasıl Çalışır',
  nav_pricing: 'Fiyatlandırma',
  nav_faq: 'SSS',
  nav_signup: 'Kayıt Ol',
  nav_login: 'Giriş Yap',

  hero_headline1: 'Doğrulanmış Potansiyel Müşteri Çıkar',
  hero_headline2: 'Sosyal Medyadan',
  hero_headline_gradient: 'Müşteri Bulun',
  hero_sub: 'Saniyeler içinde doğrulanmış e-postalar bulun ve hedefli iletişim listeleri oluşturun.',
  hero_cta_primary: 'Ücretsiz Başlayın',
  hero_cta_secondary: 'Nasıl çalıştığını izle',
  hero_trusted: '2.400+ satış ekibi tarafından güveniliyor',

  how_title: 'Nasıl Çalışır',
  how_sub: 'Beş basit, otomatik aşamada doğrulanmış iletişim listelerini çıkarın.',
  how_step1_tab: '01. Giriş Yap',
  how_step2_tab: '02. Hedefleme Ayarla',
  how_step3_tab: '03. Toplayıcı Çalışır',
  how_step4_tab: '04. CSV İndir',
  how_step5_tab: '05. Kampanya Başlat',

  features_title: 'Erişimi Ölçeklendirmek İçin Her Şey',
  features_sub: 'Çıkarımdan teslimata kadar eksiksiz bir müşteri adayı oluşturma araç seti.',

  pricing_title: 'Basit, şeffaf fiyatlandırma',
  pricing_sub: 'İhtiyaçlarınız için mükemmel planı seçin. Ücretsiz başlayın.',
  pricing_monthly: 'Aylık',
  pricing_yearly: 'Yıllık',
  pricing_save: '%43 Tasarruf Et',
  pricing_most_popular: 'En Popüler',
  pricing_free_name: 'Ücretsiz',
  pricing_free_desc: 'Kredi kartı gerekmeden deneyin',
  pricing_free_cta: 'Ücretsiz Başlayın',
  pricing_starter_name: 'Başlangıç',
  pricing_starter_desc: 'Büyüyen kampanyalar için daha fazla potansiyel müşteri',
  pricing_starter_cta: 'Başlayın',
  pricing_plus_name: 'Plus',
  pricing_plus_desc: 'Yüksek hacimli müşteri adayı oluşturma için en iyisi',
  pricing_plus_cta: "Plus'a Yükseltin",
  pricing_per_month: '/ay',
  pricing_per_year: '/yıl',

  faq_title: 'Sıkça Sorulan Sorular',
  faq_sub: "ScrapeEngine hakkında sorularınız mı var? İşte en yaygın sorularımızın cevapları.",
  faq_q1: 'ScrapeEngine nedir?',
  faq_a1: "ScrapeEngine, LinkedIn, Google Haritalar ve Apollo.io'dan e-posta adresleri, telefon numaraları ve profil ayrıntılarını kazımanıza ve doğrulamanıza yardımcı olan yapay zeka destekli bir B2B potansiyel müşteri oluşturma aracıdır.",
  faq_q2: 'E-postaları nasıl doğruluyorsunuz?',
  faq_a2: 'Gerçek bir mesaj göndermeden e-posta gelen kutusunun var olup olmadığını gerçek zamanlı olarak doğrulamak için MX sunucularına doğrudan bağlanır ve SMTP el sıkışması gerçekleştiririz.',
  faq_q3: 'Verileri CRM\'ime aktarabilir miyim?',
  faq_a3: "Evet, tüm kazınan listeler HubSpot, Mailchimp, Apollo veya diğer yazılımlara doğrudan içe aktarılabilen CSV dosyaları olarak indirilebilir.",
  faq_q4: 'Ücretsiz deneme var mı?',
  faq_a4: 'Evet! Ücretsiz Planımız, taahhüt veya kredi kartı olmaksızın ayda 50 doğrulanmış e-posta çıkarımı içerir.',
  faq_q5: 'Aboneliğimi istediğim zaman iptal edebilir miyim?',
  faq_a5: 'Kesinlikle. Ödeme panosu ayarlar sayfanızdan istediğiniz zaman ücretli aboneliğinizi iptal edebilir, yükseltebilir veya düşürebilirsiniz.',

  footer_cta_title: 'İlk potansiyel müşterilerinizi çıkarmaya hazır mısınız?',
  footer_cta_sub: "ScrapeEngine'i zaten kullanan 2.400+ satış ekibine katılın.",
  footer_cta_btn: 'Ücretsiz başlayın',
  footer_rights: '© 2026 ScrapeEngine Lead Systems. Tüm hakları saklıdır.',
  footer_tagline: 'Doğrulanmış iş potansiyel müşterilerini çıkarmanın en hızlı yolu.',
  footer_scrapers: 'Toplayıcılar',
  footer_product: 'Ürün',
  footer_legal: 'Yasal',
  footer_contact: 'İletişim',
}

// ─── Indonesian ───────────────────────────────────────────────────────────────
const id: Translation = {
  nav_home: 'Beranda',
  nav_features: 'Fitur',
  nav_how: 'Cara Kerja',
  nav_pricing: 'Harga',
  nav_faq: 'FAQ',
  nav_signup: 'Daftar',
  nav_login: 'Masuk',

  hero_headline1: 'Ekstrak Prospek Terverifikasi',
  hero_headline2: 'Dari',
  hero_headline_gradient: 'Media Sosial',
  hero_sub: 'Temukan email terverifikasi dan buat daftar kontak bertarget dalam hitungan detik.',
  hero_cta_primary: 'Mulai Gratis',
  hero_cta_secondary: 'Lihat cara kerjanya',
  hero_trusted: 'Dipercaya oleh 2.400+ tim penjualan',

  how_title: 'Cara Kerja',
  how_sub: 'Ekstrak daftar kontak terverifikasi dalam lima tahap sederhana dan otomatis.',
  how_step1_tab: '01. Masuk',
  how_step2_tab: '02. Atur Target',
  how_step3_tab: '03. Scraper Berjalan',
  how_step4_tab: '04. Unduh CSV',
  how_step5_tab: '05. Mulai Kampanye',

  features_title: 'Semua yang Anda Butuhkan untuk Berkembang',
  features_sub: 'Toolkit generasi prospek lengkap — dari ekstraksi hingga pengiriman.',

  pricing_title: 'Harga sederhana dan transparan',
  pricing_sub: 'Pilih paket yang tepat untuk kebutuhan Anda. Mulai gratis.',
  pricing_monthly: 'Bulanan',
  pricing_yearly: 'Tahunan',
  pricing_save: 'Hemat 43%',
  pricing_most_popular: 'Paling Populer',
  pricing_free_name: 'Gratis',
  pricing_free_desc: 'Coba, tanpa kartu kredit',
  pricing_free_cta: 'Mulai Gratis',
  pricing_starter_name: 'Pemula',
  pricing_starter_desc: 'Lebih banyak prospek untuk kampanye yang berkembang',
  pricing_starter_cta: 'Mulai',
  pricing_plus_name: 'Plus',
  pricing_plus_desc: 'Terbaik untuk generasi prospek volume tinggi',
  pricing_plus_cta: 'Tingkatkan ke Plus',
  pricing_per_month: '/bln',
  pricing_per_year: '/thn',

  faq_title: 'Pertanyaan yang Sering Diajukan',
  faq_sub: 'Punya pertanyaan tentang ScrapeEngine? Berikut jawaban atas pertanyaan paling umum kami.',
  faq_q1: 'Apa itu ScrapeEngine?',
  faq_a1: 'ScrapeEngine adalah alat generasi prospek B2B bertenaga AI yang membantu Anda mengikis dan memverifikasi alamat email, nomor telepon, dan detail profil dari LinkedIn, Google Maps, dan Apollo.io.',
  faq_q2: 'Bagaimana cara memverifikasi email?',
  faq_a2: 'Kami terhubung langsung ke server MX dan melakukan SMTP handshake untuk memverifikasi apakah kotak masuk email ada secara real-time.',
  faq_q3: 'Bisakah saya mengekspor data ke CRM saya?',
  faq_a3: 'Ya, semua daftar yang diikis siap diunduh sebagai file CSV bersih yang dapat diimpor langsung ke HubSpot, Mailchimp, Apollo, atau perangkat lunak apa pun.',
  faq_q4: 'Apakah ada uji coba gratis?',
  faq_a4: 'Ya! Paket Gratis kami mencakup 50 ekstraksi email terverifikasi per bulan tanpa komitmen atau kartu kredit.',
  faq_q5: 'Bisakah saya membatalkan langganan kapan saja?',
  faq_a5: 'Tentu saja. Anda dapat membatalkan, meningkatkan, atau menurunkan langganan berbayar Anda kapan saja langsung dari halaman pengaturan dasbor penagihan Anda.',

  footer_cta_title: 'Siap mengekstrak prospek pertama Anda?',
  footer_cta_sub: 'Bergabunglah dengan 2.400+ tim penjualan yang sudah menggunakan ScrapeEngine.',
  footer_cta_btn: 'Mulai gratis',
  footer_rights: '© 2026 ScrapeEngine Lead Systems. Semua hak dilindungi.',
  footer_tagline: 'Cara tercepat untuk mengekstrak prospek bisnis terverifikasi.',
  footer_scrapers: 'Scraper',
  footer_product: 'Produk',
  footer_legal: 'Legal',
  footer_contact: 'Kontak',
}

// ─── Vietnamese ───────────────────────────────────────────────────────────────
const vi: Translation = {
  nav_home: 'Trang chủ',
  nav_features: 'Tính năng',
  nav_how: 'Cách Hoạt Động',
  nav_pricing: 'Bảng giá',
  nav_faq: 'FAQ',
  nav_signup: 'Đăng ký',
  nav_login: 'Đăng nhập',

  hero_headline1: 'Trích Xuất Khách Hàng Tiềm Năng',
  hero_headline2: 'Từ',
  hero_headline_gradient: 'Mạng Xã Hội',
  hero_sub: 'Tìm email đã xác minh và xây dựng danh sách liên hệ mục tiêu trong vài giây.',
  hero_cta_primary: 'Bắt đầu miễn phí',
  hero_cta_secondary: 'Xem cách hoạt động',
  hero_trusted: 'Được tin tưởng bởi 2.400+ đội ngũ bán hàng',

  how_title: 'Cách Hoạt Động',
  how_sub: 'Trích xuất danh sách liên hệ đã xác minh qua năm giai đoạn đơn giản, tự động.',
  how_step1_tab: '01. Đăng Nhập',
  how_step2_tab: '02. Thiết Lập Mục Tiêu',
  how_step3_tab: '03. Scraper Chạy',
  how_step4_tab: '04. Tải CSV',
  how_step5_tab: '05. Khởi Chạy Chiến Dịch',

  features_title: 'Mọi Thứ Bạn Cần Để Mở Rộng',
  features_sub: 'Bộ công cụ tạo khách hàng tiềm năng hoàn chỉnh — từ trích xuất đến phân phối.',

  pricing_title: 'Giá đơn giản, minh bạch',
  pricing_sub: 'Chọn gói hoàn hảo cho nhu cầu của bạn. Bắt đầu miễn phí.',
  pricing_monthly: 'Hàng tháng',
  pricing_yearly: 'Hàng năm',
  pricing_save: 'Tiết kiệm 43%',
  pricing_most_popular: 'Phổ biến nhất',
  pricing_free_name: 'Miễn phí',
  pricing_free_desc: 'Dùng thử, không cần thẻ tín dụng',
  pricing_free_cta: 'Bắt đầu miễn phí',
  pricing_starter_name: 'Khởi đầu',
  pricing_starter_desc: 'Nhiều khách hàng tiềm năng hơn cho chiến dịch đang phát triển',
  pricing_starter_cta: 'Bắt đầu',
  pricing_plus_name: 'Plus',
  pricing_plus_desc: 'Tốt nhất cho tạo khách hàng tiềm năng khối lượng lớn',
  pricing_plus_cta: 'Nâng cấp lên Plus',
  pricing_per_month: '/tháng',
  pricing_per_year: '/năm',

  faq_title: 'Câu hỏi thường gặp',
  faq_sub: 'Có câu hỏi về ScrapeEngine? Đây là câu trả lời cho các câu hỏi phổ biến nhất.',
  faq_q1: 'ScrapeEngine là gì?',
  faq_a1: 'ScrapeEngine là công cụ tạo khách hàng tiềm năng B2B dùng AI giúp bạn thu thập và xác minh địa chỉ email, số điện thoại và thông tin hồ sơ từ LinkedIn, Google Maps và Apollo.io.',
  faq_q2: 'Bạn xác minh email như thế nào?',
  faq_a2: 'Chúng tôi kết nối trực tiếp đến máy chủ MX và thực hiện SMTP handshake để xác minh hộp thư đến có tồn tại trong thời gian thực hay không.',
  faq_q3: 'Tôi có thể xuất dữ liệu sang CRM không?',
  faq_a3: 'Có, tất cả danh sách đã thu thập đều sẵn sàng tải xuống dưới dạng file CSV sạch có thể nhập trực tiếp vào HubSpot, Mailchimp, Apollo hoặc bất kỳ phần mềm nào khác.',
  faq_q4: 'Có bản dùng thử miễn phí không?',
  faq_a4: 'Có! Gói miễn phí bao gồm 50 lần trích xuất email đã xác minh mỗi tháng mà không cần cam kết hay thẻ tín dụng.',
  faq_q5: 'Tôi có thể hủy đăng ký bất kỳ lúc nào không?',
  faq_a5: 'Hoàn toàn có thể. Bạn có thể hủy, nâng cấp hoặc hạ cấp đăng ký trả phí bất kỳ lúc nào từ trang cài đặt bảng điều khiển thanh toán.',

  footer_cta_title: 'Sẵn sàng trích xuất khách hàng tiềm năng đầu tiên?',
  footer_cta_sub: 'Tham gia cùng 2.400+ đội ngũ bán hàng đang sử dụng ScrapeEngine.',
  footer_cta_btn: 'Bắt đầu miễn phí',
  footer_rights: '© 2026 ScrapeEngine Lead Systems. Bảo lưu mọi quyền.',
  footer_tagline: 'Cách nhanh nhất để trích xuất khách hàng tiềm năng đã xác minh.',
  footer_scrapers: 'Scrapers',
  footer_product: 'Sản phẩm',
  footer_legal: 'Pháp lý',
  footer_contact: 'Liên hệ',
}

// ─── Italian ─────────────────────────────────────────────────────────────────
const it: Translation = {
  nav_home: 'Home',
  nav_features: 'Funzionalità',
  nav_how: 'Come Funziona',
  nav_pricing: 'Prezzi',
  nav_faq: 'FAQ',
  nav_signup: 'Registrati',
  nav_login: 'Accedi',

  hero_headline1: 'Estrai Lead Verificati',
  hero_headline2: 'Dai',
  hero_headline_gradient: 'Social Media',
  hero_sub: 'Trova email verificate e crea liste di contatti mirate in pochi secondi.',
  hero_cta_primary: 'Inizia gratis',
  hero_cta_secondary: 'Guarda come funziona',
  hero_trusted: 'Scelto da oltre 2.400 team di vendita',

  how_title: 'Come Funziona',
  how_sub: 'Estrai elenchi di contatti verificati in cinque fasi semplici e automatizzate.',
  how_step1_tab: '01. Accedi',
  how_step2_tab: '02. Imposta Targeting',
  how_step3_tab: '03. Scraper in Esecuzione',
  how_step4_tab: '04. Scarica CSV',
  how_step5_tab: '05. Lancia la Campagna',

  features_title: 'Tutto ciò di cui hai bisogno per scalare',
  features_sub: 'Un toolkit completo per la generazione di lead — dall\'estrazione alla consegna.',

  pricing_title: 'Prezzi semplici e trasparenti',
  pricing_sub: 'Scegli il piano perfetto per le tue esigenze. Inizia gratis.',
  pricing_monthly: 'Mensile',
  pricing_yearly: 'Annuale',
  pricing_save: 'Risparmia 43%',
  pricing_most_popular: 'Più Popolare',
  pricing_free_name: 'Gratuito',
  pricing_free_desc: 'Prova, senza carta di credito',
  pricing_free_cta: 'Inizia Gratis',
  pricing_starter_name: 'Starter',
  pricing_starter_desc: 'Più lead per campagne in crescita',
  pricing_starter_cta: 'Inizia',
  pricing_plus_name: 'Plus',
  pricing_plus_desc: 'Ideale per la generazione di lead ad alto volume',
  pricing_plus_cta: 'Passa a Plus',
  pricing_per_month: '/mese',
  pricing_per_year: '/anno',

  faq_title: 'Domande Frequenti',
  faq_sub: 'Hai domande su ScrapeEngine? Ecco le risposte alle nostre domande più comuni.',
  faq_q1: 'Cos\'è ScrapeEngine?',
  faq_a1: 'ScrapeEngine è uno strumento di lead generation B2B basato sull\'intelligenza artificiale che ti aiuta a raccogliere e verificare indirizzi email, numeri di telefono e dettagli del profilo da LinkedIn, Google Maps e Apollo.io.',
  faq_q2: 'Come verificate le email?',
  faq_a2: 'Ci connettiamo direttamente ai server MX ed eseguiamo un handshake SMTP per verificare se la casella di posta esiste in tempo reale, senza mai inviare un messaggio reale.',
  faq_q3: 'Posso esportare i dati nel mio CRM?',
  faq_a3: 'Sì, tutti gli elenchi estratti sono pronti per il download come file CSV che puoi importare direttamente in HubSpot, Mailchimp, Apollo o qualsiasi altro software.',
  faq_q4: 'C\'è una prova gratuita?',
  faq_a4: 'Sì! Il nostro Piano Gratuito include 50 estrazioni email verificate al mese senza impegni o carte di credito.',
  faq_q5: 'Posso cancellare il mio abbonamento in qualsiasi momento?',
  faq_a5: 'Assolutamente. Puoi annullare, aggiornare o effettuare il downgrade del tuo abbonamento a pagamento in qualsiasi momento dal tuo pannello di fatturazione.',

  footer_cta_title: 'Pronto a estrarre i tuoi primi lead?',
  footer_cta_sub: 'Unisciti a oltre 2.400 team di vendita che già usano ScrapeEngine.',
  footer_cta_btn: 'Inizia gratis',
  footer_rights: '© 2026 ScrapeEngine Lead Systems. Tutti i diritti riservati.',
  footer_tagline: 'Il modo più veloce per estrarre lead aziendali verificati.',
  footer_scrapers: 'Scrapers',
  footer_product: 'Prodotto',
  footer_legal: 'Legale',
  footer_contact: 'Contatto',
}

// ─── Nepali ───────────────────────────────────────────────────────────────────
const ne: Translation = {
  nav_home: 'गृहपृष्ठ',
  nav_features: 'सुविधाहरू',
  nav_how: 'कसरी काम गर्छ',
  nav_pricing: 'मूल्य',
  nav_faq: 'प्रश्नहरू',
  nav_signup: 'दर्ता गर्नुहोस्',
  nav_login: 'लग इन',

  hero_headline1: 'प्रमाणित लिडहरू निकाल्नुहोस्',
  hero_headline2: 'बाट',
  hero_headline_gradient: 'सोशल मिडिया',
  hero_sub: 'केही सेकेन्डमा प्रमाणित इमेलहरू फेला पार्नुहोस् र लक्षित सम्पर्क सूचीहरू बनाउनुहोस्।',
  hero_cta_primary: 'निःशुल्क सुरु गर्नुहोस्',
  hero_cta_secondary: 'कसरी काम गर्छ हेर्नुहोस्',
  hero_trusted: '२,४०० भन्दा बढी बिक्री टोलीले विश्वास गर्छन्',

  how_title: 'कसरी काम गर्छ',
  how_sub: 'पाँच सरल, स्वचालित चरणहरूमा प्रमाणित सम्पर्क सूचीहरू निकाल्नुहोस्।',
  how_step1_tab: '०१. साइन इन',
  how_step2_tab: '०२. लक्ष्य सेटअप',
  how_step3_tab: '०३. स्क्रेपर चल्छ',
  how_step4_tab: '०४. CSV डाउनलोड',
  how_step5_tab: '०५. अभियान सुरु',

  features_title: 'आउटरिच बढाउन आवश्यक सबै कुरा',
  features_sub: 'निष्कर्षणदेखि डेलिभरीसम्म पूर्ण लिड जेनेरेशन टूलकिट।',

  pricing_title: 'सरल, पारदर्शी मूल्य निर्धारण',
  pricing_sub: 'आफ्नो आवश्यकताको लागि सही योजना छान्नुहोस्। निःशुल्क सुरु गर्नुहोस्।',
  pricing_monthly: 'मासिक',
  pricing_yearly: 'वार्षिक',
  pricing_save: '४३% बचत गर्नुहोस्',
  pricing_most_popular: 'सबैभन्दा लोकप्रिय',
  pricing_free_name: 'निःशुल्क',
  pricing_free_desc: 'क्रेडिट कार्ड बिना प्रयास गर्नुहोस्',
  pricing_free_cta: 'निःशुल्क सुरु गर्नुहोस्',
  pricing_starter_name: 'स्टार्टर',
  pricing_starter_desc: 'बढ्दो अभियानका लागि थप लिडहरू',
  pricing_starter_cta: 'सुरु गर्नुहोस्',
  pricing_plus_name: 'प्लस',
  pricing_plus_desc: 'उच्च-मात्रा लिड जेनेरेशनका लागि सर्वोत्तम',
  pricing_plus_cta: 'प्लसमा अपग्रेड गर्नुहोस्',
  pricing_per_month: '/महिना',
  pricing_per_year: '/वर्ष',

  faq_title: 'बारम्बार सोधिने प्रश्नहरू',
  faq_sub: 'ScrapeEngine बारे प्रश्नहरू छन्? यहाँ सबैभन्दा सामान्य प्रश्नहरूका उत्तरहरू छन्।',
  faq_q1: 'ScrapeEngine के हो?',
  faq_a1: 'ScrapeEngine एक AI-संचालित B2B लिड जेनेरेशन उपकरण हो जसले LinkedIn, Google Maps र Apollo.io बाट इमेल, फोन नम्बर र प्रोफाइल विवरण निकाल्न र प्रमाणित गर्न मद्दत गर्छ।',
  faq_q2: 'तपाईंले इमेल कसरी प्रमाणित गर्नुहुन्छ?',
  faq_a2: 'हामी MX सर्भरहरूमा सिधा जडान हुन्छौं र वास्तविक समयमा इमेल इनबक्स अवस्थित छ कि छैन भनेर प्रमाणित गर्न SMTP ह्यान्डशेक गर्छौं।',
  faq_q3: 'के म मेरो CRM मा डाटा निर्यात गर्न सक्छु?',
  faq_a3: 'हो, सबै स्क्रेप गरिएका सूचीहरू CSV फाइलहरूको रूपमा डाउनलोड गर्नका लागि तयार छन्।',
  faq_q4: 'के निःशुल्क परीक्षण छ?',
  faq_a4: 'हो! हाम्रो निःशुल्क योजनामा प्रति महिना ५० प्रमाणित इमेल निष्कर्षण समावेश छ।',
  faq_q5: 'के म मेरो सदस्यता कुनै पनि समयमा रद्द गर्न सक्छु?',
  faq_a5: 'बिल्कुल। तपाईं आफ्नो बिलिङ ड्यासबोर्डबाट जुनसुकै समयमा आफ्नो सशुल्क सदस्यता रद्द, अपग्रेड वा डाउनग्रेड गर्न सक्नुहुन्छ।',

  footer_cta_title: 'आफ्नो पहिलो लिडहरू निकाल्न तयार हुनुहुन्छ?',
  footer_cta_sub: 'पहिले नै ScrapeEngine प्रयोग गर्दै आएका २,४०० भन्दा बढी बिक्री टोलीमा सामेल हुनुहोस्।',
  footer_cta_btn: 'निःशुल्क सुरु गर्नुहोस्',
  footer_rights: '© २०२६ ScrapeEngine Lead Systems. सर्वाधिकार सुरक्षित।',
  footer_tagline: 'प्रमाणित व्यापार लिडहरू निकाल्ने सबैभन्दा छिटो तरिका।',
  footer_scrapers: 'स्क्रेपरहरू',
  footer_product: 'उत्पादन',
  footer_legal: 'कानुनी',
  footer_contact: 'सम्पर्क',
}

// ─── Map ─────────────────────────────────────────────────────────────────────
export const TRANSLATIONS: Record<string, Translation> = {
  en, es, fr, de, pt, hi, ar, zh, ja, ko, ru, tr, id, vi, it, ne,
}
