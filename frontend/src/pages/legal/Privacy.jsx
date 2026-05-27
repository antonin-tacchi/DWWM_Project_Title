import LegalLayout from '../../components/legal/LegalLayout';

const P = ({ children }) => <p>{children}</p>;
const B = ({ children }) => <span className="text-white/90 font-semibold">{children}</span>;
const Li = ({ children }) => (
  <li className="flex items-start gap-2">
    <span style={{ color: '#C9A96E' }} className="mt-1 flex-shrink-0">›</span>
    <span>{children}</span>
  </li>
);

/* Highlight box */
const InfoBox = ({ children }) => (
  <div
    className="rounded-xl px-5 py-4 my-4 text-sm"
    style={{ background: 'rgba(201,169,110,0.07)', border: '1px solid rgba(201,169,110,0.2)' }}
  >
    {children}
  </div>
);

const SECTIONS = [
  {
    id: 'responsable',
    number: 'Art. 1.',
    title: 'Responsable du traitement',
    content: (
      <>
        <InfoBox>
          <p style={{ color: '#C9A96E' }} className="font-semibold mb-1">Responsable du traitement des données</p>
          <p className="text-white/70">Antonin Tacchi · Projet DWWM</p>
          <p className="text-white/50 text-xs mt-1">antonin.tacchi2005@gmail.com</p>
        </InfoBox>
        <P>Conformément au Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679) et à la loi Informatique et Libertés, vous disposez de droits sur vos données personnelles collectées par <B>Clap!</B>.</P>
      </>
    ),
  },
  {
    id: 'collecte',
    number: 'Art. 2.',
    title: 'Données collectées',
    content: (
      <>
        <P>Lors de la création et de l'utilisation d'un compte, <B>Clap!</B> collecte les données suivantes :</P>
        <div className="mt-3 mb-3 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(201,169,110,0.2)' }}>
                <th className="text-left py-2 pr-4 font-semibold text-white/80">Donnée</th>
                <th className="text-left py-2 pr-4 font-semibold text-white/80">Obligatoire</th>
                <th className="text-left py-2 font-semibold text-white/80">Finalité</th>
              </tr>
            </thead>
            <tbody className="text-white/55">
              {[
                ['Adresse e-mail', 'Oui', 'Identification, authentification'],
                ['Nom d\'utilisateur', 'Oui', 'Affichage public sur le profil'],
                ['Mot de passe (hashé)', 'Oui', 'Sécurisation du compte'],
                ['Biographie', 'Non', 'Personnalisation du profil'],
                ['Avatar (URL)', 'Non', 'Personnalisation du profil'],
                ['Historique de navigation', 'Non', 'Films/séries consultés récemment'],
                ['Favoris & listes', 'Non', 'Fonctionnalités sociales'],
              ].map(([d, o, f]) => (
                <tr key={d} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td className="py-2 pr-4">{d}</td>
                  <td className="py-2 pr-4">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: o === 'Oui' ? 'rgba(201,169,110,0.15)' : 'rgba(255,255,255,0.07)', color: o === 'Oui' ? '#C9A96E' : 'rgba(255,255,255,0.4)' }}
                    >
                      {o}
                    </span>
                  </td>
                  <td className="py-2">{f}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>Les mots de passe sont <B>systématiquement hachés</B> (bcrypt) avant stockage. Ils ne sont jamais conservés en clair.</P>
      </>
    ),
  },
  {
    id: 'finalites',
    number: 'Art. 3.',
    title: 'Finalités et bases légales',
    content: (
      <>
        <P>Vos données sont traitées aux fins suivantes, sur les bases légales correspondantes :</P>
        <ul className="space-y-2 mt-3">
          <Li><B>Gestion du compte et authentification</B> — Base légale : exécution du contrat (art. 6.1.b RGPD)</Li>
          <Li><B>Personnalisation de l'expérience</B> (favoris, listes, historique) — Base légale : exécution du contrat</Li>
          <Li><B>Envoi de notifications</B> (nouveautés, badges, activité) — Base légale : intérêt légitime (art. 6.1.f)</Li>
          <Li><B>Amélioration du service</B> (analyse des usages anonymisés) — Base légale : intérêt légitime</Li>
          <Li><B>Respect des obligations légales</B> — Base légale : obligation légale (art. 6.1.c)</Li>
        </ul>
      </>
    ),
  },
  {
    id: 'conservation',
    number: 'Art. 4.',
    title: 'Durée de conservation',
    content: (
      <>
        <P>Vos données sont conservées pendant toute la durée de votre compte actif, puis :</P>
        <ul className="space-y-1 mt-2 mb-3">
          <Li>Supprimées dans un délai de <B>30 jours</B> après la fermeture du compte, sauf obligation légale contraire</Li>
          <Li>Les données de journalisation (logs techniques) sont conservées <B>6 mois maximum</B></Li>
          <Li>Les données anonymisées à des fins statistiques peuvent être conservées indéfiniment</Li>
        </ul>
        <P>Vous pouvez demander la suppression de votre compte à tout moment depuis les paramètres de votre profil ou en nous contactant.</P>
      </>
    ),
  },
  {
    id: 'destinataires',
    number: 'Art. 5.',
    title: 'Destinataires des données',
    content: (
      <>
        <P><B>Clap!</B> ne vend, ne loue et ne cède pas vos données personnelles à des tiers.</P>
        <P>Vos données peuvent toutefois être partagées avec :</P>
        <ul className="space-y-1 mt-2 mb-3">
          <Li><B>TMDB (The Movie Database)</B> — données cinématographiques uniquement, aucune donnée personnelle</Li>
          <Li><B>Hébergeurs techniques</B> — dans le cadre de l'infrastructure de déploiement</Li>
          <Li><B>Autorités compétentes</B> — sur réquisition judiciaire ou légale</Li>
        </ul>
        <P>Aucun transfert de données hors de l'Union Européenne n'est effectué à ce jour.</P>
      </>
    ),
  },
  {
    id: 'droits',
    number: 'Art. 6.',
    title: 'Vos droits (RGPD)',
    content: (
      <>
        <P>Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles :</P>
        <ul className="space-y-2 mt-3 mb-4">
          <Li><B>Droit d'accès</B> — obtenir une copie de l'ensemble de vos données</Li>
          <Li><B>Droit de rectification</B> — corriger des données inexactes ou incomplètes</Li>
          <Li><B>Droit à l'effacement</B> ("droit à l'oubli") — demander la suppression de vos données</Li>
          <Li><B>Droit à la limitation</B> — restreindre temporairement le traitement de vos données</Li>
          <Li><B>Droit à la portabilité</B> — recevoir vos données dans un format structuré et lisible</Li>
          <Li><B>Droit d'opposition</B> — vous opposer à un traitement fondé sur l'intérêt légitime</Li>
        </ul>
        <InfoBox>
          <p className="text-white/70 text-sm">Pour exercer vos droits, contactez-nous à : <a href="mailto:antonin.tacchi2005@gmail.com" className="underline underline-offset-2" style={{ color: '#C9A96E' }}>antonin.tacchi2005@gmail.com</a></p>
          <p className="text-white/40 text-xs mt-1">Réponse sous 30 jours maximum.</p>
        </InfoBox>
        <P>Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la <B>CNIL</B> (Commission Nationale de l'Informatique et des Libertés) : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2" style={{ color: '#C9A96E' }}>www.cnil.fr</a>.</P>
      </>
    ),
  },
  {
    id: 'cookies',
    number: 'Art. 7.',
    title: 'Cookies & traceurs',
    content: (
      <>
        <P><B>Clap!</B> utilise exclusivement des <B>cookies techniques essentiels</B> :</P>
        <ul className="space-y-2 mt-2 mb-4">
          <Li><B>Token d'authentification</B> (localStorage) — maintien de la session utilisateur, durée : 24h</Li>
          <Li><B>Préférence de langue</B> (localStorage) — mémorisation du choix FR/EN, durée : permanente</Li>
        </ul>
        <P>Ces cookies sont <B>strictement nécessaires</B> au fonctionnement du service. Ils ne requièrent pas de consentement au sens du RGPD et de la directive ePrivacy.</P>
        <P>Aucun cookie publicitaire, analytique tiers ou traceur de comportement n'est utilisé.</P>
      </>
    ),
  },
  {
    id: 'securite',
    number: 'Art. 8.',
    title: 'Sécurité des données',
    content: (
      <>
        <P>L'éditeur met en œuvre les mesures techniques et organisationnelles appropriées pour protéger vos données :</P>
        <ul className="space-y-1 mt-2 mb-3">
          <Li>Mots de passe hachés avec <B>bcrypt</B> (algorithme de hachage adaptatif)</Li>
          <Li>Authentification par <B>JSON Web Token (JWT)</B> signé, expiration 24h</Li>
          <Li>Architecture microservices isolée avec <B>API Gateway</B></Li>
          <Li>Communications chiffrées en environnement de production</Li>
        </ul>
        <P>Malgré ces mesures, aucun système n'est infaillible. En cas de violation de données susceptible d'engendrer un risque pour vos droits, vous serez notifié dans les 72 heures, conformément à l'art. 33 RGPD.</P>
      </>
    ),
  },
];

export default function Privacy() {
  return (
    <LegalLayout
      badge="Clap! · RGPD"
      title="Confidentialité"
      subtitle="Politique de confidentialité et de protection des données personnelles conformément au RGPD"
      lastUpdated="Mai 2026"
      backLink={{ to: '/', label: 'Retour à l\'accueil' }}
      sections={SECTIONS}
    />
  );
}
