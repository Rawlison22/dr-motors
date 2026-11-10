import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, MapPin } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const MAPS_LINK = 'https://maps.app.goo.gl/jV4Pj3RnmuiubyxB9';
const MAP_EMBED_URL =
  'https://www.google.com/maps?q=-7.1589043,-34.8964214&z=16&output=embed';

type LocationPopoverProps = {
  variant: 'header' | 'footer';
};

export function LocationPopover({ variant }: LocationPopoverProps) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHeader = variant === 'header';

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openOnHover = () => {
    cancelClose();
    setOpen(true);
  };

  const closeAfterHover = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 180);
  };

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`location-trigger location-trigger--${variant}`}
          aria-label="Ver localização da DR Motors no Google Maps"
          aria-haspopup="dialog"
          aria-expanded={open}
          onMouseEnter={openOnHover}
          onMouseLeave={closeAfterHover}
          onFocus={openOnHover}
          data-testid={`button-location-${variant}`}
        >
          <MapPin size={15} strokeWidth={1.8} />
          <span>{isHeader ? 'João Pessoa, PB' : 'Oitizeiro e Conde'}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="location-popover"
        align={isHeader ? 'end' : 'start'}
        side="bottom"
        sideOffset={8}
        onMouseEnter={openOnHover}
        onMouseLeave={closeAfterHover}
      >
        <div className="location-popover-heading">
          <div>
            <strong>DR Motors</strong>
            <span>Revendedora Oficial Shineray · João Pessoa, PB</span>
          </div>
        </div>
        <iframe
          className="location-map"
          title="Mapa da localização da DR Motors em João Pessoa"
          src={MAP_EMBED_URL}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <a
          className="location-map-link"
          href={MAPS_LINK}
          target="_blank"
          rel="noopener noreferrer"
        >
          Abrir no Google Maps <ArrowUpRight size={15} />
        </a>
      </PopoverContent>
    </Popover>
  );
}
