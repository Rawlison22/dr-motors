import { useEffect, useMemo, useRef, useState } from 'react';
import { heroPhotos } from '@/lib/media';

const SHOW_MS = 5200; // tempo com a foto aparecendo
const OUT_MS = 900;   // tempo da foto sumindo
const GAP_MS = 350;   // pausa com o banner vazio antes da próxima entrar

function shuffle<T>(list: T[]) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Banner da home: UMA foto por vez (só moto inteira), em ordem aleatória,
// sumindo antes da próxima entrar, com zoom in / zoom out alternando.
export function HeroShowcase() {
  const total = heroPhotos.length;
  const bag = useRef<number[]>([]);
  const last = useRef(-1);

  const nextIndex = () => {
    if (bag.current.length === 0) {
      let fresh = shuffle(Array.from({ length: total }, (_, i) => i));
      if (fresh[0] === last.current && total > 1) fresh = [...fresh.slice(1), fresh[0]];
      bag.current = fresh;
    }
    const n = bag.current.shift() as number;
    last.current = n;
    return n;
  };

  const [slide, setSlide] = useState(() => ({ idx: nextIndex(), n: 0 }));
  const [leaving, setLeaving] = useState(false);
  const photos = useMemo(() => heroPhotos, []);

  useEffect(() => {
    photos.forEach((p) => {
      const img = new Image();
      img.referrerPolicy = 'no-referrer';
      img.src = p.src;
    });
  }, [photos]);

  useEffect(() => {
    if (total < 2) return;
    const t1 = window.setTimeout(() => setLeaving(true), SHOW_MS);
    const t2 = window.setTimeout(() => {
      setSlide((s) => ({ idx: nextIndex(), n: s.n + 1 }));
      setLeaving(false);
    }, SHOW_MS + OUT_MS + GAP_MS);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [slide.n, total]);

  if (total === 0) return null;
  const photo = photos[slide.idx];
  const zoomClass = slide.n % 2 === 0 ? 'zoom-in' : 'zoom-out';

  return (
    <div className="hero-showcase">
      <div key={slide.n} className={`hero-slide ${leaving ? 'is-leaving' : 'is-entering'}`}>
        <img className={`hero-photo ${zoomClass}`} src={photo.src} alt={`Shineray ${photo.name}`} referrerPolicy="no-referrer" draggable={false} />
        <span className="hero-photo-name">{photo.name}</span>
      </div>
    </div>
  );
}
