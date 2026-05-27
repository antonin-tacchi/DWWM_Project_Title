import ActorProfile from './ActorProfile';

/**
 * /crew/:id  → same design as ActorProfile but shows directing / production credits
 */
export default function CrewProfile() {
  return <ActorProfile mode="crew" />;
}
