import { Template } from './types';

export const TEMPLATES: Template[] = [
  {
    id: 'blank',
    title: 'Document vierge',
    description: 'Créez un document à partir de zéro avec une mise en page standard. [Modèle Professionnel]',
    thumbnail: '📄',
    content: '<p><br></p>',
    style: {
      fontFamily: 'Calibri',
      fontSize: 11,
      textColor: '#000000',
      backgroundColor: '#ffffff',
      margin: 'normal',
      orientation: 'portrait',
      lineSpacing: 1.15,
      theme: 'Office'
    },
    headerText: 'Document1',
    footerText: 'Page 1'
  },
  // 1. PROFESSIONNEL
  {
    id: 'rapport_activite',
    title: 'Rapport professionnel d\'activité',
    description: 'Structure complète de rapport d\'entreprise avec couverture, sections bien structurées. [Modèle Professionnel]',
    thumbnail: '📊',
    content: `
      <div style="text-align: center; border: 3px double #2b579a; padding: 40px; margin-top: 50px; margin-bottom: 80px;">
        <h1 style="color: #1a365d; font-size: 32px; font-family: 'Times New Roman', serif; margin-bottom: 10px;">RAPPORT ANNUEL D'ACTIVITÉ</h1>
        <p style="font-size: 18px; color: #555;">Analyse Stratégique - Exercice 2025/2026</p>
        <div style="width: 100px; height: 3px; background-color: #2b579a; margin: 20px auto;"></div>
        <p style="font-size: 14px; color: #777;">Rédigé par kalengamushimbilina@gmail.com</p>
      </div>

      <h2>1. Introduction Générale</h2>
      <p>L'année écoulée a marqué une étape décisive dans le développement de nos activités. Grâce à la mise en œuvre de solutions d'IA génératives performantes, nous avons accru l'efficacité opérationnelle globale et accéléré la production de documents de direction complexes.</p>

      <h2>2. Performance Opérationnelle</h2>
      <p>Les indicateurs économiques révèlent une croissance nette de l'engagement utilisateur de l'ordre de 25%. Ce succès repose sur trois axes fondamentaux :</p>
      <ul>
        <li>Une interface WYSIWYG épurée reproduisant Microsoft Word à la perfection.</li>
        <li>Un outil de recherche internet en temps réel pour collecter des sources pertinentes et les copier à la volée.</li>
        <li>Une synchronisation cloud immédiate sans perte de données.</li>
      </ul>

      <h2>3. Recommandations Clés</h2>
      <p>Pour l'exercice suivant, l'accent sera mis sur le renforcement des fonctionnalités de collaboration interactive multiplateforme et d'exportation de documents certifiés.</p>
    `,
    style: {
      fontFamily: 'Georgia',
      fontSize: 11,
      textColor: '#111111',
      backgroundColor: '#ffffff',
      margin: 'wide',
      orientation: 'portrait',
      lineSpacing: 1.5,
      theme: 'Moderne'
    },
    headerText: 'RAPPORT ANNUEL D\'ACTIVITÉ',
    footerText: 'Confidentiel Office'
  },
  {
    id: 'business_plan',
    title: 'Plan d\'affaires stratégique (Business Plan)',
    description: 'Modèle professionnel pour business plan de start-up ou d\'entreprise. [Modèle Professionnel]',
    thumbnail: '📈',
    content: `
      <div style="border-bottom: 4px solid #1e3a8a; padding-bottom: 15px; margin-bottom: 40px;">
        <h1 style="color: #1e3a8a; font-family: Arial, sans-serif; font-size: 28pt; margin: 0;">BUSINESS PLAN</h1>
        <p style="color: #4b5563; font-size: 14pt; margin: 5px 0 0 0;">Projet d'Expansion Technologique - ManixGPT</p>
      </div>

      <h2>1. Sommaire Exécutif (Executive Summary)</h2>
      <p>Ce projet vise à introduire l'application collaborative de traitement de documents <strong>ManixGPT</strong>. Il s'agit d'une plateforme bureautique intelligente full-stack qui comble l'écart entre la rédaction Word simplifiée, les templates haut de gamme et la recherche internet de confiance intégrée.</p>

      <h2>2. Analyse de Marché et Concurrentielle</h2>
      <p>Le marché de la productivité de documents complexes exige une fluidité maximale et de vrais outils de conversion de documents Word sans altération de mise en page. Notre solution propose une réédition WYSIWYG s'exécutant sur des serveurs Cloud Run performants.</p>

      <h2>3. Stratégie de Financement et Budgets</h2>
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <thead>
          <tr style="background-color: #f1f5f9;">
            <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">Secteur de dépense</th>
            <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: right;">Budget estimé (€)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 10px; border: 1px solid #cbd5e1;">Infrastructure Serveurs & API AI</td>
            <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: right;">15 000 €</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #cbd5e1;">Design UI/UX & Templates</td>
            <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: right;">8 500 €</td>
          </tr>
          <tr style="font-weight: bold; background-color: #fafafa;">
            <td style="padding: 10px; border: 1px solid #cbd5e1;">Total Général</td>
            <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: right;">23 500 €</td>
          </tr>
        </tbody>
      </table>
    `,
    style: {
      fontFamily: 'Arial',
      fontSize: 11,
      textColor: '#1f2937',
      backgroundColor: '#ffffff',
      margin: 'normal',
      orientation: 'portrait',
      lineSpacing: 1.15,
      theme: 'Office'
    },
    headerText: 'MANIXGPT - STRATÉGIE CORPORATE',
    footerText: 'ManixGPT Inc.'
  },
  {
    id: 'compte_rendu',
    title: 'Compte rendu de réunion standard',
    description: 'Modèle de compte-rendu pour enregistrer les notes, décisions et actions de réunion. [Modèle Professionnel]',
    thumbnail: '📝',
    content: `
      <div style="background-color: #f8fafc; padding: 20px; border-left: 5px solid #0f172a; margin-bottom: 25px;">
        <h1 style="color: #0f172a; font-size: 20pt; margin: 0 0 5px 0;">COMPTE RENDU DE RÉUNION</h1>
        <p style="color: #64748b; font-size: 10pt; margin: 0;"><strong>Date :</strong> 25 Mai 2026 | <strong>Lieu :</strong> Salle de conférence Alpha & Teams</p>
      </div>

      <h2>Présentation générale</h2>
      <p>La séance est ouverte à 10h00 sous la présidence de kalengamushimbilina@gmail.com. L'ordre du jour concerne la révision des documents corporatifs importés.</p>

      <h2>Sujets abordés et Décisions prises</h2>
      <ol>
        <li><strong>Optimisation de la conversion Word :</strong> Il a été convenu d'intégrer des feuilles de style consolidées afin que les styles CSS des fichiers DOCX soient respectés scrupuleusement d'une page à l'autre.</li>
        <li><strong>Impression PDF :</strong> Intégration de la directive @media print garantissant que l'export se fait au millimètre près en s'adaptant à la marge de l'utilisateur.</li>
      </ol>

      <h2>Tableau des actions et prochaines étapes</h2>
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <thead>
          <tr style="background-color: #cbd5e1;">
            <th style="padding: 8px; border: 1px solid #94a3b8; text-align: left;">Action à mener</th>
            <th style="padding: 8px; border: 1px solid #94a3b8; text-align: left;">Responsable</th>
            <th style="padding: 8px; border: 1px solid #94a3b8; text-align: left;">Échéance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px; border: 1px solid #bfdbfe;">Ajuster les CSS de marge de page</td>
            <td style="padding: 8px; border: 1px solid #bfdbfe;">Zuraide Elorriaga</td>
            <td style="padding: 8px; border: 1px solid #bfdbfe;">Immédiat</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #bfdbfe;">Créer de nouveaux modèles festifs et d'éducation</td>
            <td style="padding: 8px; border: 1px solid #bfdbfe;">L'Assistant IA</td>
            <td style="padding: 8px; border: 1px solid #bfdbfe;">Complété</td>
          </tr>
        </tbody>
      </table>
    `,
    style: {
      fontFamily: 'Calibri',
      fontSize: 11,
      textColor: '#0f172a',
      backgroundColor: '#ffffff',
      margin: 'normal',
      orientation: 'portrait',
      lineSpacing: 1.15,
      theme: 'Officiel'
    },
    headerText: 'COMPTE RENDU DU CONSEIL',
    footerText: 'Confidentiel Interne'
  },

  // 2. CARTES
  {
    id: 'carte_visite',
    title: 'Carte de Visite Corporate',
    description: 'Une mise en page miniature pour structurer et imprimer ses cartes de visite d\'entreprise. [Modèle Cartes]',
    thumbnail: '📇',
    content: `
      <div style="border: 1px solid #000; padding: 15px; width: 330px; height: 180px; margin: 40px auto; background-color: #fafbfc; position: relative;">
        <div style="border-left: 5px solid #2b579a; padding-left: 10px; height: 100%;">
          <h3 style="color: #2b579a; font-family: 'Arial', sans-serif; margin: 0 0 5px 0; font-size: 16px;">MANIXGPT CORPORATE</h3>
          <p style="font-weight: bold; margin: 0; font-size: 11px;">Directeur de Rédaction Éditoriale</p>
          <p style="color: #666; font-style: italic; margin: 2px 0 10px 0; font-size: 9px;">Le Traitement de Texte Révolutionnaire par l'IA</p>
          
          <div style="position: absolute; bottom: 15px; font-size: 9px; color: #444; line-height: 1.3;">
            <p style="margin: 0;">📍 12 Rue de la Paix, Paris, France</p>
            <p style="margin: 0;">✉️ kalengamushimbilina@gmail.com</p>
            <p style="margin: 0;">🌐 www.manixgpt.com | Tel: +33 6 12 34 56 78</p>
          </div>
        </div>
      </div>
    `,
    style: {
      fontFamily: 'Arial',
      fontSize: 10,
      textColor: '#1f2937',
      backgroundColor: '#ffffff',
      margin: 'narrow',
      orientation: 'portrait',
      lineSpacing: 1.0,
      theme: 'Office'
    },
    headerText: 'Gabarit de Impression de Cartes',
    footerText: 'Format standard 85mm x 55mm'
  },
  {
    id: 'carte_invitation',
    title: 'Carte d\'Invitation Officielle (Gala)',
    description: 'Format d\'aide pour une invitation raffinée d\'un événement caritatif, inauguration ou gala. [Modèle Cartes]',
    thumbnail: '✉️',
    content: `
      <div style="text-align: center; border: 2px solid #d4af37; padding: 30px; background-color: #faf8f5; max-width: 500px; margin: 40px auto; font-family: 'Times New Roman', serif;">
        <p style="color: #d4af37; font-size: 12pt; letter-spacing: 2px; text-transform: uppercase;">Invitation Exclusive</p>
        <h1 style="color: #1a1a1a; font-size: 22pt; font-weight: normal; margin: 15px 0;">SOIRÉE DE GALA DU PRINTEMPS</h1>
        <p style="font-style: italic; color: #555; font-size: 11pt; margin-bottom: 25px;">Organisée en l'honneur du lancement de ManixGPT</p>
        
        <div style="width: 50px; height: 1px; background-color: #d4af37; margin: 15px auto;"></div>
        
        <p style="font-size: 11pt; margin-bottom: 5px;"><strong>Date :</strong> Vendredi 12 Juin 2026 à 19h00</p>
        <p style="font-size: 11pt; margin-bottom: 20px;"><strong>Lieu :</strong> Salons du Ritz, Place Vendôme, Paris</p>
        
        <p style="font-size: 9pt; color: #888; text-transform: uppercase; letter-spacing: 1px;">R.S.V.P. avant le 1er Juin | Tenue de soirée exigée</p>
      </div>
    `,
    style: {
      fontFamily: 'Times New Roman',
      fontSize: 11,
      textColor: '#1a1a1a',
      backgroundColor: '#ffffff',
      margin: 'normal',
      orientation: 'portrait',
      lineSpacing: 1.2,
      theme: 'Officiel'
    },
    headerText: 'Invitation Gala Ritz',
    footerText: 'Ritz Paris'
  },

  // 3. PROSPECTUS
  {
    id: 'flyer_commercial',
    title: 'Prospectus Commercial (Flyer)',
    description: 'Flyer publicitaire avec colonnes, accroches visuelles et design percutant. [Modèle Prospectus]',
    thumbnail: '📢',
    content: `
      <div style="text-align: center; background-color: #2b579a; color: white; padding: 25px; border-radius: 4px; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 1px;">RÉVOLUTIONNEZ VOS ÉCRITS !</h1>
        <p style="margin: 5px 0 0 0; font-size: 16px;">Découvrez ManixGPT, le logiciel bureautique intelligent</p>
      </div>

      <h2 style="color: #2b579a; font-size: 18px; text-align: center;">VOTRE BUREAU DU FUTUR, DÈS AUJOURD'HUI</h2>
      <p style="text-align: center; color: #555;">Une suite complète pensée pour les professionnels de l'édition documentaire.</p>

      <div style="display: flex; gap: 20px; margin-top: 30px;">
        <div style="flex: 1; border: 1px solid #ddd; padding: 15px; border-radius: 4px; background-color: #fafafa;">
          <h3 style="color: #2b579a; margin-top: 0;">✨ Intelligence Artificielle</h3>
          <p style="font-size: 12px; line-height: 1.4; color: #444;">Formatez, résumez et réécrivez vos textes d'importation instantanément sans rompre les colonnes ni les tableaux.</p>
        </div>
        <div style="flex: 1; border: 1px solid #ddd; padding: 15px; border-radius: 4px; background-color: #fafafa;">
          <h3 style="color: #2b579a; margin-top: 0;">📁 Multi-Formats Réels</h3>
          <p style="font-size: 12px; line-height: 1.4; color: #444;">Exportez de véritables fichiers .docx et .pdf conformes, avec système d'impression pixel-perfect intégré.</p>
        </div>
      </div>

      <div style="margin-top: 40px; text-align: center; font-weight: bold; font-size: 14px; border-top: 2px dashed #cbd5e1; padding-top: 20px; color: #2b579a;">
        Contactez-nous à kalengamushimbilina@gmail.com pour tester la version premium !
      </div>
    `,
    style: {
      fontFamily: 'Arial',
      fontSize: 11,
      textColor: '#333333',
      backgroundColor: '#ffffff',
      margin: 'normal',
      orientation: 'portrait',
      lineSpacing: 1.15,
      theme: 'Créatif'
    },
    headerText: 'PRÉSENTATION FLYER MANIXGPT',
    footerText: 'Disponibilité immédiate'
  },
  {
    id: 'affiche_evt',
    title: 'Planète Événement (Affiche)',
    description: 'Mise en page d\'affiche ou de prospectus promotionnel pour fêter un lancement de produit. [Modèle Prospectus]',
    thumbnail: '🖼️',
    content: `
      <div style="text-align: center; padding: 50px 20px; background-image: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; border-radius: 6px;">
        <p style="text-transform: uppercase; font-size: 12px; letter-spacing: 3px; font-weight: bold; margin: 0 0 15px 0;">Grand Événement Inaugural</p>
        <h1 style="font-size: 36px; margin: 0 0 10px 0; font-family: 'Trebuchet MS', sans-serif;">DÉMONSTRATION MANIXGPT</h1>
        <p style="font-size: 16px; font-light: true; max-width: 500px; margin: 0 auto 30px auto;">Venez assister en temps réel à l'édition auto-paginée comme sur Microsoft Word avec notre assistant vocal.</p>
        
        <div style="display: inline-block; background-color: white; color: #1e3a8a; padding: 10px 25px; border-radius: 99px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          INSCRIPTION EN LIGNE GRATUITE
        </div>
      </div>

      <div style="margin-top: 35px; text-align: center;">
        <h3 style="color: #1e3a8a;">Sujets forts de la conférence :</h3>
        <p style="color: #666; font-size: 13px;">Génération automatique de tableaux de valeurs | Correction grammaticale IA de pointe | Importateur de fichiers .docx</p>
      </div>
    `,
    style: {
      fontFamily: 'Trebuchet MS',
      fontSize: 11,
      textColor: '#111111',
      backgroundColor: '#ffffff',
      margin: 'normal',
      orientation: 'portrait',
      lineSpacing: 1.2,
      theme: 'Créatif'
    },
    headerText: 'Événement Technologique',
    footerText: 'ManixGPT Lancement'
  },

  // 4. LETTRES
  {
    id: 'lettre_affaires',
    title: 'Lettre d\'affaires formelle',
    description: 'Courrier officiel aux normes professionnelles pour la correspondance d\'affaires. [Modèle Lettres]',
    thumbnail: '✉️',
    content: `
      <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
        <div>
          <p><strong>MANIXGPT SOLUTIONS</strong><br/>12 Rue de la Paix<br/>75002 Paris, France</p>
        </div>
        <div style="text-align: right;">
          <p><strong>Société Alpha Systèmes</strong><br/>À l'attention de M. Jean Dupont<br/>45 Avenue des Champs-Élysées<br/>75008 Paris</p>
        </div>
      </div>

      <div style="text-align: right; margin-bottom: 30px;">
        <p>Paris, le 25 Mai 2026</p>
      </div>

      <p style="margin-bottom: 25px;"><strong>Objet : Proposition d'intégration des solutions bureautiques d'IA</strong></p>

      <p>Monsieur Directeur,</p>

      <p>Nous faisons suite à notre conversation téléphonique de la semaine dernière concernant l'amélioration continue de votre chaîne documentaire interne. À cet effet, l'utilisation de plateformes autonomes de traitement représente un levier de productivité essentiel.</p>

      <p>Notre suite logicielle <strong>ManixGPT</strong> permet à vos collaborateurs de rédiger et structurer des pièces à haute valeur ajoutée, en s'appuyant sur des templates de rapports pré-intégrés (Plan strat, C.V., brochures, prospectus) garantissant le respect parfait de vos chartes graphiques.</p>

      <p>Nous restons à votre entière disposition pour planifier un rendez-vous ou une démonstration en direct dans votre espace de travail.</p>

      <p>Veuillez agréer, Monsieur Directeur, l'assurance de notre considération distinguée.</p>

      <div style="margin-top: 60px; border-top: 1px solid #eaeaea; padding-top: 10px; width: 250px;">
        <p><strong>Zuraide Elorriaga</strong><br/>Directeur Éditorial, ManixGPT</p>
      </div>
    `,
    style: {
      fontFamily: 'Calibri',
      fontSize: 11,
      textColor: '#1f2937',
      backgroundColor: '#ffffff',
      margin: 'normal',
      orientation: 'portrait',
      lineSpacing: 1.15,
      theme: 'Officiel'
    },
    headerText: 'CORRESPONDANCE OFFICIELLE',
    footerText: 'ManixGPT - Confidentiality Assured'
  },
  {
    id: 'lettre_remerciement',
    title: 'Lettre de Remerciement client',
    description: 'Mise en page de remerciement formel pour clients, collaborateurs ou donateurs. [Modèle Lettres]',
    thumbnail: '🤝',
    content: `
      <div style="text-align: center; margin-bottom: 40px; font-family: Georgia, serif;">
        <span style="font-size: 24px; color: #2b579a; letter-spacing: 4px;">MERCI</span>
        <div style="width: 60px; height: 1px; background-color: #cbd5e1; margin: 10px auto;"></div>
      </div>

      <p>Chers Clients, Chers Partenaires,</p>

      <p>Nous tenons à vous exprimer notre profonde gratitude pour la confiance que vous nous témoignez chaque jour. Grâce à votre collaboration active, l'application <strong>ManixGPT</strong> franchit de nouveaux paliers de performance éditoriale.</p>

      <p>Chaque relecture, chaque document Word importé et repensé par notre IA nous conforte dans l'excellence de notre concept bureautique d'auto-pagination et d'assemblage en grille.</p>

      <p>Nous formulons le vœu de poursuivre durablees aventures à vos côtés et de parfaire constamment nos modèles professionnels et académiques.</p>

      <p>Avec nos salutations les plus chaleureuses,</p>

      <div style="margin-top: 50px;">
        <p><strong>Zuraide Elorriaga</strong><br/>Et toute l'équipe de ManixGPT</p>
      </div>
    `,
    style: {
      fontFamily: 'Georgia',
      fontSize: 11,
      textColor: '#334155',
      backgroundColor: '#ffffff',
      margin: 'wide',
      orientation: 'portrait',
      lineSpacing: 1.3,
      theme: 'Moderne'
    },
    headerText: 'Lettre de Reconnaissance client',
    footerText: 'Fidélité client'
  },

  // 5. ÉDUCATION
  {
    id: 'syllabus_cours',
    title: 'Plan de cours enseignant (Syllabus)',
    description: 'Modèle académique structurant les cours, ressources et examens d\'un semestre. [Modèle Éducation]',
    thumbnail: '🎓',
    content: `
      <div style="background-color: #1e3a8a; color: white; padding: 25px; border-radius: 4px; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 22pt;">SYLLABUS DE COURS : BUREAUTIQUE RE-PENSÉE</h1>
        <p style="margin: 5px 0 0 0; font-size: 11pt; color: #93c5fd;">Université des Sciences Technologiques | Semestre Automne</p>
      </div>

      <h2>Descriptif de la formation</h2>
      <p>Ce cours étudie la conversion, le traitement de texte et la mise en page de documents complexes par l'intermédiaire d'outils WYSIWYG avancés et d'intelligence artificielle locale.</p>

      <h2>Calendrier des leçons</h2>
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <thead>
          <tr style="background-color: #f1f5f9;">
            <th style="padding: 8px; border: 1px solid #cbd5e1; text-align: left;">Semaine</th>
            <th style="padding: 8px; border: 1px solid #cbd5e1; text-align: left;">Sujet d'étude principal</th>
            <th style="padding: 8px; border: 1px solid #cbd5e1; text-align: left;">Travail à remettre</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">Semaine 1-3</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">Les règles d'autodétectives de marges et de grilles de page</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">Devoir de typographie</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">Semaine 4-6</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">Les structures de CV et lettres d'affaires d'importation réelle</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">TP de mise en forme</td>
          </tr>
        </tbody>
      </table>

      <h2>Critères de Notation</h2>
      <ul>
        <li><strong>Projet Pratique de mise en page :</strong> 50% de la note.</li>
        <li><strong>Contrôle de connaissances théoriques :</strong> 30% de la note.</li>
        <li><strong>Participation active en atelier interactif :</strong> 20% de la note.</li>
      </ul>
    `,
    style: {
      fontFamily: 'Calibri',
      fontSize: 11,
      textColor: '#111827',
      backgroundColor: '#ffffff',
      margin: 'normal',
      orientation: 'portrait',
      lineSpacing: 1.15,
      theme: 'Office'
    },
    headerText: 'ACADÉMIE DE TECHNOLOGIE - SYLLABUS',
    footerText: 'Syllabus Universitaire - Page 1'
  },
  {
    id: 'rapport_stage',
    title: 'Rapport de stage universitaire',
    description: 'Rapport de stage complet avec sections d\'introduction et de développement. [Modèle Éducation]',
    thumbnail: '📘',
    content: `
      <div style="text-align: center; border: 1px solid #ccc; padding: 40px; margin-top: 40px; margin-bottom: 60px;">
        <span style="font-size: 14px; text-transform: uppercase; color: #444; letter-spacing: 2px;">Rapport de Stage Pré-Professionnel</span>
        <h1 style="color: #2b579a; font-size: 26pt; margin: 15px 0 10px 0; font-family: 'Times New Roman', serif;">ASSISTANT DE DIRECTION ÉDITORIALE</h1>
        <div style="width: 80px; height: 1px; background-color: #2b579a; margin: 15px auto;"></div>
        <p style="font-weight: bold; font-size: 12pt;">Présenté par : kalengamushimbilina@gmail.com</p>
        <p style="font-size: 10pt; color: #666;">Filière : Lettres Modernes & Techniques Multimédia<br/>Maître de stage : Mme. Zuraide Elorriaga</p>
      </div>

      <h2>Remerciements</h2>
      <p>Je tiens tout d'abord à remercier chaleureusement ma maître de stage, Mme Zuraide Elorriaga, pour son soutien continu et sa transmission éclairée des processus d'autonomisation bureautique.</p>

      <h2>1. Présentation de la Structure d'Accueil</h2>
      <p>L'entreprise d'édition qui m'a accueilli se positionne à l'avant-garde des plateformes collaboratives. Elle s'illustre particulièrement en proposant un traitement de texte révolutionnaire qui supprime les barrières d'orientation et d'affichage.</p>
    `,
    style: {
      fontFamily: 'Times New Roman',
      fontSize: 11,
      textColor: '#1a1a1a',
      backgroundColor: '#ffffff',
      margin: 'normal',
      orientation: 'portrait',
      lineSpacing: 1.5,
      theme: 'Officiel'
    },
    headerText: 'RAPPORT DE STAGE - ASSISTANT ÉDITORIAL',
    footerText: 'Soutenance de Stage'
  },

  // 6. CV ET LETTRES DE MOTIVATION
  {
    id: 'cv',
    title: 'C.V. chronologique moderne',
    description: 'Modèle de curriculum vitae élégant avec profil, expériences et format moderne. [Modèle C.V. et lettres de motivation]',
    thumbnail: '🧑‍💼',
    content: `
      <div style="border-bottom: 2px solid #b53826; padding-bottom: 10px; margin-bottom: 20px;">
        <h1 style="color: #b53826; font-family: 'Trebuchet MS', sans-serif; margin-bottom: 5px; text-transform: uppercase;">ZURAIDE ELORRIAGA</h1>
        <p style="color: #666; font-size: 14px; margin: 0;"><strong>kalengamushimbilina@gmail.com</strong> | +33 6 12 34 56 78 | Paris, France</p>
      </div>

      <h2 style="color: #b53826; font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 4px; text-transform: uppercase;">PROFIL</h2>
      <p>Professionnel dynamique et force de proposition avec plus de 5 ans d'expérience dans la gestion de projets éditoriaux. Reconnu pour ma rigueur de mise en page et ma capacité d'analyse stratégique.</p>

      <h2 style="color: #b53826; font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 4px; text-transform: uppercase; margin-top: 20px;">EXPÉRIENCE PROFESSIONNELLE</h2>
      
      <div style="margin-bottom: 15px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="font-weight: bold; font-size: 14px; color: #333;">Directeur de Rédaction | Office Corp</td>
            <td style="text-align: right; color: #b53826; font-weight: bold;">2022 - Présent</td>
          </tr>
        </table>
        <p style="margin-top: 5px; font-style: italic; color: #666;">Gestion de l'équipe éditoriale et révision de la charte graphique.</p>
        <ul style="margin-top: 5px;">
          <li>Mise en œuvre d'un système de relecture assistée par intelligence artificielle.</li>
          <li>Amélioration à hauteur de 40% des processus de livraison de rapports docx.</li>
        </ul>
      </div>

      <h2 style="color: #b53826; font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 4px; text-transform: uppercase; margin-top: 20px;">COMPÉTENCES</h2>
      <table style="width: 100%;">
        <tr>
          <td><strong>Logiciels :</strong> MS Word, Excel, Teams, D3.js</td>
          <td><strong>Langues :</strong> Français (Maternelle), Anglais (C1)</td>
        </tr>
      </table>
    `,
    style: {
      fontFamily: 'Arial',
      fontSize: 11,
      textColor: '#000000',
      backgroundColor: '#ffffff',
      margin: 'normal',
      orientation: 'portrait',
      lineSpacing: 1.15,
      theme: 'Créatif'
    },
    headerText: 'Curriculum Vitae - Zuraide Elorriaga',
    footerText: 'Page 1 de 1'
  },
  {
    id: 'lette_motivation',
    title: 'Lettre de motivation chromatique',
    description: 'Une lettre formelle professionnelle et personnalisée prête pour vos candidatures. [Modèle C.V. et lettres de motivation]',
    thumbnail: '✉️',
    content: `
      <div style="text-align: right; margin-bottom: 30px;">
        <p><strong>Zuraide Elorriaga</strong><br/>Paris, le 25 Mai 2026</p>
      </div>
      
      <div style="margin-bottom: 30px;">
        <p><strong>À l'attention du Responsable Recrutement</strong><br/>Société Générale de Technologie<br/>La Défense, Paris</p>
      </div>

      <p style="margin-bottom: 20px;"><strong>Objet : Candidature au poste de Chargé de Documentation Éditoriale</strong></p>

      <p>Madame, Monsieur,</p>

      <p>C'est avec un vif intérêt que j'ai pris connaissance de votre offre d'emploi pour le poste de Chargé de Documentation Éditoriale au sein de votre entreprise de renom.</p>

      <p>Ayant acquis une solide expérience dans la structuration de documents complexes, la mise en page sous Microsoft Word et la mise en conformité de documents administratifs, je suis convaincu de pouvoir apporter une contribution constructive à vos projets.</p>

      <p>Grâce à mon excellente maîtrise des règles typographiques et de l'intégration des méthodologies de rédaction assistée par IA, j'optimise la qualité de restitution finale des rapports de direction.</p>

      <p>Je serais ravi de vous exposer mes motivations de vive voix lors d'un prochain entretien s'en tenant à vos disponibilités.</p>

      <p>Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.</p>

      <div style="margin-top: 40px;">
        <p><strong>Zuraide Elorriaga</strong></p>
      </div>
    `,
    style: {
      fontFamily: 'Calibri',
      fontSize: 11,
      textColor: '#1a1a1a',
      backgroundColor: '#ffffff',
      margin: 'normal',
      orientation: 'portrait',
      lineSpacing: 1.2,
      theme: 'Officiel'
    },
    headerText: 'Lettre de Motivation',
    footerText: 'Paris - France'
  },
  {
    id: 'cv_minimaliste',
    title: 'C.V. Minimaliste Classique',
    description: 'C.V. sobre et compact axé sur l\'élégance des polices traditionnelles du monde professionnel. [Modèle C.V. et lettres de motivation]',
    thumbnail: '💼',
    content: `
      <div style="text-align: center; margin-bottom: 25px;">
        <h1 style="font-family: 'Times New Roman', serif; font-size: 26px; margin: 0 0 5px 0;">Zuraide Elorriaga</h1>
        <p style="font-size: 10px; color: #555; text-transform: uppercase; letter-spacing: 1px;">Rédacteur Spécialisé & Webmestre</p>
        <p style="font-size: 11px; margin-top: 5px;">Paris, France | +33 6 12 34 56 78 | kalengamushimbilina@gmail.com</p>
        <div style="width: 100%; height: 1px; background-color: #333; margin-top: 10px;"></div>
      </div>

      <h3 style="font-family: 'Times New Roman', serif; border-bottom: 1px solid #555; padding-bottom: 2px;">EXPÉRIENCES CLÉS</h3>
      <p style="margin-top: 5px;"><strong>Chef de Projet Contenus - ManixGPT Corp</strong> (2024 - Présent)</p>
      <ul style="margin-top: 4px;">
        <li>Supervision éditoriale de l'importateur automatique DOCX et de la mise à niveau A4.</li>
        <li>Formatage en grilles de page et correction automatique du style.</li>
      </ul>

      <p style="margin-top: 10px;"><strong>Adjoint Rédactionnel - Presse Alpha</strong> (2021 - 2024)</p>
      <ul style="margin-top: 4px;">
        <li>Correction d'épreuves d'écriture et modélisation de cartes et prospectus de fêtes.</li>
      </ul>

      <h3 style="font-family: 'Times New Roman', serif; border-bottom: 1px solid #555; padding-bottom: 2px; margin-top: 20px;">DIPLÔMES</h3>
      <p style="margin-top: 5px;"><strong>Master en Technologie Collaborative & Multimédia</strong> | Sorbonne (2021)</p>
    `,
    style: {
      fontFamily: 'Times New Roman',
      fontSize: 11,
      textColor: '#111111',
      backgroundColor: '#ffffff',
      margin: 'normal',
      orientation: 'portrait',
      lineSpacing: 1.15,
      theme: 'Officiel'
    },
    headerText: 'CV - Zuraide Elorriaga',
    footerText: 'C.V. Classique'
  },

  // 7. FÊTE
  {
    id: 'invit_anniv',
    title: 'Invitation Anniversaire festive',
    description: 'Modèle coloré d\'invitation de fête d\'anniversaire d\'adulte ou d\'enfant. [Modèle Fête]',
    thumbnail: '🎂',
    content: `
      <div style="text-align: center; background-color: #ff6b6b; color: white; padding: 40px 20px; border-radius: 8px; font-family: 'Arial', sans-serif;">
        <span style="font-size: 40px;">🎉 🎂 🎉</span>
        <h1 style="font-size: 30px; font-weight: bold; margin: 15px 0 5px 0; text-transform: uppercase;">MON ANNIVERSAIRE !</h1>
        <p style="font-size: 16px; margin: 0 0 25px 0;">J'ai le plaisir de vous inviter à venir souffler mes bougies !</p>
        
        <div style="background-color: white; color: #ff6b6b; padding: 15px; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 13px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
          RDV : Samedi 27 Juin à partir de 19h00
        </div>
      </div>

      <div style="margin-top: 35px; text-align: center; color: #444;">
        <h3>Où se passe la fête ?</h3>
        <p style="font-size: 14px;"><strong>L'Atelier des Festivités</strong> - 45 Rue de la Gaité, Paris</p>
        <p style="font-size: 12px; color: #777;">Apéro, buffet dînatoire et danse jusqu'au bout de la nuit ! Nous vous attendons nombreux.</p>
        
        <p style="font-style: italic; font-size: 11px; margin-top: 30px; color: #ff6b6b;">Réponse souhaitée par email à kalengamushimbilina@gmail.com</p>
      </div>
    `,
    style: {
      fontFamily: 'Arial',
      fontSize: 11,
      textColor: '#333333',
      backgroundColor: '#ffffff',
      margin: 'normal',
      orientation: 'portrait',
      lineSpacing: 1.15,
      theme: 'Créatif'
    },
    headerText: 'INVITATION ANNIVERSAIRE',
    footerText: 'Invitation Personnelle'
  },
  {
    id: 'menu_fete',
    title: 'Menu de Fête Privée (Mariage)',
    description: 'Menu élégant à imprimer pour les grandes occasions familiales, fêtes, réceptions ou mariages. [Modèle Fête]',
    thumbnail: '🍷',
    content: `
      <div style="text-align: center; border: 1px dashed #e08e79; padding: 35px; background-color: #fffaf9; max-width: 450px; margin: 40px auto; font-family: 'Georgia', serif; border-radius: 10px;">
        <span style="font-size: 11pt; color: #e08e79; text-transform: uppercase; letter-spacing: 2px;">Menu de Célébration</span>
        <h1 style="color: #4a3b32; font-size: 24pt; font-weight: normal; margin: 10px 0 25px 0;">REPAS DE NOCES</h1>
        
        <h3 style="color: #e08e79; font-size: 12pt; margin-top: 20px;">ENTRÉES CHAMPÊTRES</h3>
        <p style="font-size: 10pt; color: #555; font-style: italic; margin-bottom: 15px;">Feuilleté de chèvre chaud au miel sauvage, salade de saison aux cerneaux de noix</p>
        
        <div style="color: #e08e79;">✿</div>
        
        <h3 style="color: #e08e79; font-size: 12pt; margin-top: 15px;">PLATS DE RÉSISTANCE</h3>
        <p style="font-size: 10pt; color: #555; font-style: italic; margin-bottom: 15px;">Suprême de volaille rôti de fête et son jus au romarin, écrasé de pommes de terre à l'huile de truffe</p>
        
        <div style="color: #e08e79;">✿</div>
        
        <h3 style="color: #e08e79; font-size: 12pt; margin-top: 15px;">DESSERTS ROYAUX</h3>
        <p style="font-size: 10pt; color: #555; font-style: italic; margin-bottom: 25px;">Pièce montée traditionnelle à la crème vanillée des îles, macarons croquants au chocolat noir</p>
        
        <p style="font-size: 8pt; color: #999; text-transform: uppercase; letter-spacing: 1px;">Bon appétit à tous nos convives d'honneur !</p>
      </div>
    `,
    style: {
      fontFamily: 'Georgia',
      fontSize: 11,
      textColor: '#111111',
      backgroundColor: '#ffffff',
      margin: 'normal',
      orientation: 'portrait',
      lineSpacing: 1.2,
      theme: 'Moderne'
    },
    headerText: 'Menu de Noces - Mariage',
    footerText: 'Fête de Mariage'
  }
];
