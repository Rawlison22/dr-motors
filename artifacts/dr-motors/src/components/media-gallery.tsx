import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Minus, PlayCircle, Plus, RotateCcw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { viewerImages, type ModelMedia } from '@/lib/media';

const MIN_ZOOM = 1;
const MAX_ZOOM = 6;

type View = { s: number; x: number; y: number };

function toEmbed(url: string) {
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  return yt ? `https://www.youtube.com/embed/${yt[1]}` : null;
}

// Visualizador com zoom (roda do mouse, pinça, botões, duplo clique) e arrastar para mover.
function ZoomStage({
  src,
  alt,
  position,
  count,
  onPrev,
  onNext,
  onError,
}: {
  src: string;
  alt: string;
  position: number;
  count: number;
  onPrev?: () => void;
  onNext?: () => void;
  onError: (src: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>({ s: 1, x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; s: number } | null>(null);
  const viewRef = useRef(view);
  viewRef.current = view;

  const clamp = (v: View): View => {
    const el = ref.current;
    const w = el?.clientWidth ?? 0;
    const h = el?.clientHeight ?? 0;
    const s = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, v.s));
    const mx = ((s - 1) * w) / 2;
    const my = ((s - 1) * h) / 2;
    return {
      s,
      x: s === 1 ? 0 : Math.min(mx, Math.max(-mx, v.x)),
      y: s === 1 ? 0 : Math.min(my, Math.max(-my, v.y)),
    };
  };

  // cx/cy: ponto do zoom, relativo ao centro do quadro
  const zoomBy = (factor: number, cx = 0, cy = 0) => {
    setView((prev) => {
      const s2 = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev.s * factor));
      const k = s2 / prev.s;
      return clamp({ s: s2, x: cx - (cx - prev.x) * k, y: cy - (cy - prev.y) * k });
    });
  };

  useEffect(() => setView({ s: 1, x: 0, y: 0 }), [src]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoomBy(Math.exp(-e.deltaY * 0.0015), e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const down = (e: ReactPointerEvent<HTMLDivElement>) => {
    ref.current?.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y) || 1, s: viewRef.current.s };
    }
    setDragging(true);
  };

  const move = (e: ReactPointerEvent<HTMLDivElement>) => {
    const p = pointers.current.get(e.pointerId);
    if (!p) return;
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const r = ref.current!.getBoundingClientRect();
      const target = pinch.current.s * (Math.hypot(a.x - b.x, a.y - b.y) / pinch.current.dist);
      zoomBy(target / viewRef.current.s, (a.x + b.x) / 2 - r.left - r.width / 2, (a.y + b.y) / 2 - r.top - r.height / 2);
    } else if (pointers.current.size === 1) {
      setView((prev) => clamp({ ...prev, x: prev.x + dx, y: prev.y + dy }));
    }
  };

  const up = (e: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    pinch.current = null;
    if (pointers.current.size === 0) setDragging(false);
  };

  const doubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (viewRef.current.s > 1) return setView({ s: 1, x: 0, y: 0 });
    const r = ref.current!.getBoundingClientRect();
    zoomBy(2.5, e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2);
  };

  const keys = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') onPrev?.();
    else if (e.key === 'ArrowRight') onNext?.();
    else if (e.key === '+' || e.key === '=') zoomBy(1.4);
    else if (e.key === '-') zoomBy(1 / 1.4);
    else if (e.key === '0') setView({ s: 1, x: 0, y: 0 });
  };

  const total = count;
  return (
    <>
      <div
        ref={ref}
        className={`media-stage${dragging ? ' is-dragging' : ''}${view.s > 1 ? ' is-zoomed' : ''}`}
        tabIndex={0}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onDoubleClick={doubleClick}
        onKeyDown={keys}
        aria-label={`${alt}. Role para dar zoom e arraste para mover.`}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          referrerPolicy="no-referrer"
          style={{
            transform: `translate(${view.x}px, ${view.y}px) scale(${view.s})`,
            transition: dragging ? 'none' : 'transform .16s ease-out',
          }}
          onError={() => onError(src)}
        />
      </div>
      <div className="media-toolbar">
        <div className="media-toolbar-group">
          <button type="button" onClick={onPrev} disabled={!onPrev} aria-label="Foto anterior"><ChevronLeft size={18} /></button>
          <span className="media-counter">{position} / {total}</span>
          <button type="button" onClick={onNext} disabled={!onNext} aria-label="Próxima foto"><ChevronRight size={18} /></button>
        </div>
        <span className="media-hint">Role para dar zoom · arraste para mover · duplo clique aproxima</span>
        <div className="media-toolbar-group">
          <button type="button" onClick={() => zoomBy(1 / 1.4)} aria-label="Diminuir zoom"><Minus size={16} /></button>
          <span className="media-counter">{Math.round(view.s * 100)}%</span>
          <button type="button" onClick={() => zoomBy(1.4)} aria-label="Aumentar zoom"><Plus size={16} /></button>
          <button type="button" onClick={() => setView({ s: 1, x: 0, y: 0 })} aria-label="Voltar ao tamanho original"><RotateCcw size={15} /></button>
        </div>
      </div>
    </>
  );
}

export function MediaGallery({
  model,
  media,
  onClose,
}: {
  model: string | null;
  media: ModelMedia | undefined;
  onClose: () => void;
}) {
  const [active, setActive] = useState(0);
  const [broken, setBroken] = useState<Set<string>>(new Set());

  useEffect(() => {
    setActive(0);
    setBroken(new Set());
  }, [model]);

  const images = (media ? viewerImages(media) : []).filter((src) => !broken.has(src));
  const current = Math.min(active, Math.max(images.length - 1, 0));
  const embed = media?.video ? toEmbed(media.video) : null;
  const many = images.length > 1;
  const go = (delta: number) => setActive((current + delta + images.length) % images.length);

  return (
    <Dialog open={!!model && !!media} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="media-dialog">
        <DialogHeader>
          <DialogTitle>{model}</DialogTitle>
          <DialogDescription>Fotos e vídeo do modelo, direto do site oficial da Shineray.</DialogDescription>
        </DialogHeader>

        {images.length > 0 && (
          <>
            <ZoomStage
              src={images[current]}
              alt={`${model} — foto ${current + 1} de ${images.length}`}
              position={current + 1}
              count={images.length}
              onPrev={many ? () => go(-1) : undefined}
              onNext={many ? () => go(1) : undefined}
              onError={(src) => setBroken((prev) => new Set(prev).add(src))}
            />
            <div className="media-thumbs" role="list">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  role="listitem"
                  className={`media-thumb${i === current ? ' is-active' : ''}`}
                  onClick={() => setActive(i)}
                  aria-label={`Ver foto ${i + 1}`}
                >
                  <img src={src} alt="" loading="lazy" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </>
        )}

        <div className="media-video">
          {embed ? (
            <iframe
              src={embed}
              title={`Vídeo ${model}`}
              loading="lazy"
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : media?.video ? (
            <video src={media.video} poster={media.poster} controls preload="none" playsInline />
          ) : (
            <a className="media-video-link" href={media?.page} target="_blank" rel="noreferrer">
              <PlayCircle size={20} />
              <span>Assistir ao vídeo no site da Shineray</span>
              <ExternalLink size={15} />
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
