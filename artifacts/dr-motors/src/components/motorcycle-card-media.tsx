import { useEffect, useRef, useState } from 'react';

interface MotorcycleCardMediaProps {
  coverUrl: string;
  images?: string[]; // fotos da galeria (a capa NÃO entra no carrossel do hover)
  name: string;
  fit?: 'contain' | 'cover';
  position?: string;
  zoom?: number;
  onClickGallery: () => void;
}

const SLIDE_MS = 3200; // tempo de cada foto enquanto o mouse está em cima
const LEAVE_MS = 450;  // tempo para a foto anterior sumir de vez

export function MotorcycleCardMedia({
  coverUrl,
  images = [],
  name,
  fit = 'contain',
  position = '50% 50%',
  zoom = 1,
  onClickGallery,
}: MotorcycleCardMediaProps) {
  const gallery = images.filter((src) => src !== coverUrl);
  // -1 = foto de capa (moto inteira) · 0..n = fotos da galeria
  const [index, setIndex] = useState(-1);
  const [prev, setPrev] = useState<number | null>(null);
  const [changed, setChanged] = useState(false);
  const [playing, setPlaying] = useState(false);
  const indexRef = useRef(-1);

  const show = (next: number) => {
    if (next === indexRef.current) return;
    setPrev(indexRef.current);
    indexRef.current = next;
    setIndex(next);
    setChanged(true);
  };

  // a foto anterior é removida logo depois de sumir (nada fica "atrás")
  useEffect(() => {
    if (prev === null) return;
    const t = window.setTimeout(() => setPrev(null), LEAVE_MS);
    return () => window.clearTimeout(t);
  }, [prev, index]);

  // deixa as primeiras fotos prontas para o hover começar na hora
  useEffect(() => {
    gallery.slice(0, 2).forEach((src) => {
      const img = new Image();
      img.referrerPolicy = 'no-referrer';
      img.src = src;
    });
  }, [coverUrl]);

  // começa na hora ao entrar com o mouse e para ao sair
  useEffect(() => {
    if (!playing || gallery.length === 0) return;
    let i = 0;
    show(0);
    const preloadNext = (n: number) => {
      const img = new Image();
      img.referrerPolicy = 'no-referrer';
      img.src = gallery[(n + 1) % gallery.length];
    };
    preloadNext(0);
    const timer = window.setInterval(() => {
      i = (i + 1) % gallery.length;
      show(i);
      preloadNext(i);
    }, SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [playing, gallery.length]);

  const start = () => setPlaying(true);
  const stop = () => {
    setPlaying(false);
    show(-1); // volta para a foto da moto
  };

  const layer = (i: number, role: 'current' | 'leaving') => {
    const isCover = i < 0;
    const src = isCover ? coverUrl : gallery[i];
    const cls = [
      'photo-layer',
      isCover ? 'is-contain' : 'is-fill',
      role === 'leaving' ? 'is-out' : changed ? (isCover ? 'is-in' : 'is-in is-drift') : '',
    ].join(' ');
    return (
      <img
        key={`${role}-${i}`}
        src={src}
        alt={role === 'current' ? name : ''}
        loading={isCover ? 'lazy' : 'eager'}
        referrerPolicy="no-referrer"
        draggable={false}
        className={cls}
        style={isCover ? { objectFit: fit, objectPosition: position, ['--zoom' as string]: zoom } : undefined}
      />
    );
  };

  return (
    <button
      type="button"
      className="visual-photo"
      onClick={onClickGallery}
      onMouseEnter={start}
      onMouseLeave={stop}
      onFocus={start}
      onBlur={stop}
      aria-label={`Ver fotos de ${name}`}
    >
      {prev !== null && layer(prev, 'leaving')}
      {layer(index, 'current')}
    </button>
  );
}
