import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { getStrypeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface SubstribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubstribeButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();

  async function handleSubscribe() {
    if (!session) {
      signIn('github');
      return;
    }

    if (session.activeSubscription) {
      router.push('/posts');
      return;
    }

    try {
      const response = await api.post('/subscribe');

      const { sessionId } = response.data;

      const stripe = await getStrypeJs();

      await stripe.redirectToCheckout({ sessionId: sessionId.id });
    } catch (err) {
      alert(err.message);
    }

    // criar checkout session do stripe
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
