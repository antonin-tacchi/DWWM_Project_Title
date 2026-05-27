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
    id: 'objet',
    number: 'Art. 1.',
    title: 'Objet et champ d\'application',
    content: (
      <>
        <P>Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») régissent l'accès et l'utilisation de la plateforme <B>Clap!</B>, un service de découverte cinématographique permettant de consulter des informations sur des films et séries, de gérer des listes personnelles et d'interagir avec une communauté de cinéphiles.</P>
        <P><B>Clap!</B> est un projet pédagogique réalisé dans le cadre d'une formation DWWM par Antonin Tacchi. Toute utilisation du service implique l'acceptation pleine et entière des présentes CGU.</P>
      </>
    ),
  },
  {
    id: 'acces',
    number: 'Art. 2.',
    title: 'Accès au service',
    content: (
      <>
        <P>L'accès aux fonctionnalités de base de <B>Clap!</B> (consultation du catalogue, navigation) est libre et gratuit. Certaines fonctionnalités avancées (listes personnelles, notation, commentaires, notifications) nécessitent la création d'un compte.</P>
        <P>L'éditeur se réserve le droit de modifier, suspendre ou interrompre tout ou partie du service à tout moment, notamment pour des opérations de maintenance, sans préavis ni indemnité.</P>
        <P>Le service est accessible via un navigateur web moderne. L'utilisateur est responsable de la configuration et du bon fonctionnement de son équipement informatique.</P>
      </>
    ),
  },
  {
    id: 'compte',
    number: 'Art. 3.',
    title: 'Création et gestion du compte',
    content: (
      <>
        <P>Pour créer un compte sur <B>Clap!</B>, l'utilisateur doit :</P>
        <ul className="space-y-1 mt-2 mb-4">
          <Li>Fournir une adresse e-mail valide et un nom d'utilisateur unique</Li>
          <Li>Choisir un mot de passe sécurisé (minimum 8 caractères)</Li>
          <Li>Confirmer son mot de passe lors de l'inscription</Li>
          <Li>Être âgé d'au moins 13 ans</Li>
        </ul>
        <P>L'utilisateur est seul responsable de la confidentialité de ses identifiants. Toute activité effectuée depuis son compte lui est directement imputable. En cas de suspicion de compromission, il doit contacter immédiatement l'éditeur.</P>
        <P>L'éditeur se réserve le droit de supprimer tout compte en cas de non-respect des présentes CGU, sans préavis ni remboursement.</P>
      </>
    ),
  },
  {
    id: 'regles',
    number: 'Art. 4.',
    title: 'Règles d\'utilisation',
    content: (
      <>
        <P>L'utilisateur s'engage à utiliser <B>Clap!</B> de manière loyale et conforme aux lois en vigueur. Sont notamment interdits :</P>
        <ul className="space-y-1 mt-2 mb-4">
          <Li>Toute tentative d'accès non autorisé au système ou aux données d'autres utilisateurs</Li>
          <Li>La publication de contenus illicites, diffamatoires, haineux ou contraires aux bonnes mœurs</Li>
          <Li>L'utilisation de scripts automatisés ou de robots pour accéder au service</Li>
          <Li>La revente ou l'exploitation commerciale du service sans autorisation expresse</Li>
          <Li>L'usurpation d'identité ou la création de faux comptes</Li>
          <Li>Toute action susceptible de porter atteinte à l'intégrité ou à la disponibilité du service</Li>
        </ul>
        <P>Le non-respect de ces règles peut entraîner la suspension immédiate du compte et, le cas échéant, des poursuites judiciaires.</P>
      </>
    ),
  },
  {
    id: 'propriete',
    number: 'Art. 5.',
    title: 'Propriété intellectuelle',
    content: (
      <>
        <P>L'ensemble des éléments constitutifs de <B>Clap!</B> (code source, design, architecture, logo, textes originaux) sont la propriété exclusive de l'éditeur et sont protégés par le droit de la propriété intellectuelle.</P>
        <P>Les données cinématographiques (affiches, synopsis, fiches techniques) proviennent de l'<B>API TMDB</B> et restent la propriété de leurs ayants droit. Clap! n'en revendique aucune propriété.</P>
        <P>L'utilisateur conserve la propriété de tout contenu qu'il publie (commentaires, listes) et accorde à l'éditeur une licence non exclusive d'affichage et de diffusion au sein du service.</P>
      </>
    ),
  },
  {
    id: 'responsabilite',
    number: 'Art. 6.',
    title: 'Limitation de responsabilité',
    content: (
      <>
        <P><B>Clap!</B> est fourni « en l'état », à des fins pédagogiques. L'éditeur ne saurait être tenu responsable :</P>
        <ul className="space-y-1 mt-2 mb-4">
          <Li>D'une interruption de service, d'un dysfonctionnement ou d'une perte de données</Li>
          <Li>De l'inexactitude des informations issues de TMDB ou de sources tierces</Li>
          <Li>Des dommages directs ou indirects résultant de l'utilisation ou de l'impossibilité d'utiliser le service</Li>
          <Li>Des agissements de tiers sur la plateforme</Li>
        </ul>
        <P>La responsabilité de l'éditeur ne pourra en aucun cas excéder le montant des sommes versées par l'utilisateur au titre du service (dans le cas présent : zéro, le service étant gratuit).</P>
      </>
    ),
  },
  {
    id: 'modification',
    number: 'Art. 7.',
    title: 'Modification des CGU',
    content: (
      <>
        <P>L'éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés de toute modification substantielle par notification dans l'application ou par e-mail.</P>
        <P>La poursuite de l'utilisation du service après notification des modifications vaut acceptation des nouvelles CGU. L'utilisateur qui refuse les nouvelles conditions doit cesser d'utiliser le service et peut demander la suppression de son compte.</P>
      </>
    ),
  },
  {
    id: 'droit',
    number: 'Art. 8.',
    title: 'Droit applicable & juridiction',
    content: (
      <>
        <P>Les présentes CGU sont soumises au <B>droit français</B>. Tout litige relatif à leur interprétation ou à leur exécution relève de la compétence exclusive des tribunaux français.</P>
        <P>En cas de différend, l'utilisateur peut tenter une résolution amiable en contactant l'éditeur à l'adresse : <a href="mailto:antonin.tacchi2005@gmail.com" className="underline underline-offset-2" style={{ color: '#C9A96E' }}>antonin.tacchi2005@gmail.com</a>.</P>
        <P>Si aucun accord amiable n'est trouvé dans un délai de 30 jours, le litige pourra être porté devant les juridictions compétentes.</P>
      </>
    ),
  },
];

export default function Terms() {
  return (
    <LegalLayout
      badge="Clap! · CGU"
      title="Conditions d'utilisation"
      subtitle="Règles et conditions régissant l'accès et l'utilisation de la plateforme Clap!"
      lastUpdated="Mai 2026"
      backLink={{ to: '/', label: 'Retour à l\'accueil' }}
      sections={SECTIONS}
    />
  );
}
