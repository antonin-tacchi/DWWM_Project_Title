import LegalLayout from '../../components/legal/LegalLayout';

const P = ({ children }) => <p>{children}</p>;
const B = ({ children }) => <span className="text-white/90 font-semibold">{children}</span>;
const Li = ({ children }) => (
  <li className="flex items-start gap-2">
    <span style={{ color: '#C9A96E' }} className="mt-1 flex-shrink-0">›</span>
    <span>{children}</span>
  </li>
);

const SECTIONS = [
  {
    id: 'editeur',
    number: 'Art. 1.',
    title: 'Éditeur du site',
    content: (
      <>
        <P>Le site <B>Clap!</B> est un projet pédagogique réalisé dans le cadre d'une formation <B>Développeur Web et Web Mobile (DWWM)</B>.</P>
        <P>Éditeur responsable : <B>Antonin Tacchi</B></P>
        <P>Contact : <a href="mailto:antonin.tacchi2005@gmail.com" className="underline underline-offset-2 transition-colors" style={{ color: '#C9A96E' }}>antonin.tacchi2005@gmail.com</a></P>
        <P>Ce site est développé et maintenu à titre personnel dans le cadre d'un projet de formation et ne constitue pas un service commercial.</P>
      </>
    ),
  },
  {
    id: 'hebergement',
    number: 'Art. 2.',
    title: 'Hébergement',
    content: (
      <>
        <P>Dans sa version de démonstration, le site <B>Clap!</B> est hébergé localement via des conteneurs <B>Docker</B> sur l'infrastructure personnelle du développeur.</P>
        <P>Technologies utilisées :</P>
        <ul className="space-y-1 mt-2">
          <Li>Frontend : React (Vite) servi par Nginx</Li>
          <Li>Backend : microservices Spring Boot (Java 17)</Li>
          <Li>Base de données : MySQL 8.0</Li>
          <Li>Orchestration : Docker Compose</Li>
          <Li>Données films/séries : The Movie Database (TMDB) — API tierce</Li>
        </ul>
      </>
    ),
  },
  {
    id: 'propriete',
    number: 'Art. 3.',
    title: 'Propriété intellectuelle',
    content: (
      <>
        <P>Le code source, la conception graphique, les textes et l'architecture de <B>Clap!</B> sont la propriété exclusive d'<B>Antonin Tacchi</B>, sauf mention contraire.</P>
        <P>Les données relatives aux films, séries et personnalités (titres, synopsis, affiches, notes) sont issues de l'<B>API TMDB (The Movie Database)</B> et restent la propriété de leurs détenteurs respectifs. L'utilisation de ces données est soumise aux <a href="https://www.themoviedb.org/terms-of-use" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2" style={{ color: '#C9A96E' }}>conditions d'utilisation de TMDB</a>.</P>
        <P>Toute reproduction, même partielle, du contenu produit par l'éditeur est soumise à son autorisation préalable écrite.</P>
      </>
    ),
  },
  {
    id: 'responsabilite',
    number: 'Art. 4.',
    title: 'Limitation de responsabilité',
    content: (
      <>
        <P>Ce site est fourni <B>à des fins de démonstration pédagogique</B>. L'éditeur ne garantit pas :</P>
        <ul className="space-y-1 mt-2">
          <Li>La disponibilité permanente du service</Li>
          <Li>L'exactitude ou l'exhaustivité des informations affichées</Li>
          <Li>L'absence d'interruptions liées à la maintenance ou aux mises à jour</Li>
        </ul>
        <P className="mt-4">L'éditeur décline toute responsabilité quant aux dommages directs ou indirects pouvant résulter de l'utilisation du site.</P>
      </>
    ),
  },
  {
    id: 'donnees',
    number: 'Art. 5.',
    title: 'Données personnelles',
    content: (
      <>
        <P>Les données personnelles collectées sur <B>Clap!</B> (adresse e-mail, nom d'utilisateur) sont traitées conformément au <B>Règlement Général sur la Protection des Données (RGPD)</B>.</P>
        <P>Pour toute information sur le traitement de vos données, consultez notre <a href="/privacy" className="underline underline-offset-2" style={{ color: '#C9A96E' }}>Politique de confidentialité</a>.</P>
      </>
    ),
  },
  {
    id: 'cookies',
    number: 'Art. 6.',
    title: 'Cookies',
    content: (
      <>
        <P>Le site utilise des <B>cookies techniques essentiels</B> pour assurer son bon fonctionnement (maintien de session, préférences de langue). Aucun cookie publicitaire ou traceur tiers n'est déposé.</P>
        <P>En naviguant sur ce site, vous acceptez l'utilisation de ces cookies strictement nécessaires.</P>
      </>
    ),
  },
  {
    id: 'droit',
    number: 'Art. 7.',
    title: 'Droit applicable',
    content: (
      <>
        <P>Les présentes mentions légales sont régies par le <B>droit français</B>. En cas de litige, les tribunaux français seront seuls compétents.</P>
        <P>Références légales applicables :</P>
        <ul className="space-y-1 mt-2">
          <Li>Loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN)</Li>
          <Li>Règlement (UE) 2016/679 (RGPD)</Li>
          <Li>Loi n° 78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés</Li>
        </ul>
      </>
    ),
  },
];

export default function LegalNotice() {
  return (
    <LegalLayout
      badge="Clap! · Projet DWWM"
      title="Mentions légales"
      subtitle="Informations légales relatives à l'éditeur, à l'hébergement et à l'utilisation du site Clap!"
      lastUpdated="Mai 2026"
      backLink={{ to: '/', label: 'Retour à l\'accueil' }}
      sections={SECTIONS}
    />
  );
}
