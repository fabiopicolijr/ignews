import styles from './styles.module.scss';

interface SubstribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubstribeButtonProps) {
  return (
    <button type="button" className={styles.subscribeButton}>
      Subscribe now
    </button>
  );
}
