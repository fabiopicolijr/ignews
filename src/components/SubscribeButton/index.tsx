import { signIn, useSession } from 'next-auth/react';
import styles from './styles.module.scss';

interface SubstribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubstribeButtonProps) {
  const { data: session } = useSession();
  function handleSubscribe() {
    if (!session) {
      signIn('github');
      return;
    }

    // criar checkout session do stripe
  }

  return (
    <button type="button" className={styles.subscribeButton}>
      Subscribe now
    </button>
  );
}
