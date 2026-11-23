import { useEffect, useState } from 'react';

/* aviso rápido de confirmação; "aviso" muda de id a cada nova mensagem */
export default function Toast({ aviso }) {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    if (!aviso) return;
    setVisivel(true);
    const timer = setTimeout(() => setVisivel(false), 2800);
    return () => clearTimeout(timer);
  }, [aviso]);

  return (
    <div className={'toast' + (visivel ? ' visivel' : '')} role="status" aria-live="polite">
      {aviso ? aviso.msg : ''}
    </div>
  );
}
