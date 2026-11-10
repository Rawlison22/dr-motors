import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, MapPin } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const LOCATIONS = [
  {
    name: 'Oitizeiro',
    href: 'https://maps.app.goo.gl/jV4Pj3RnmuiubyxB9',
  },
  {
    name: 'Conde',
    href: 'https://maps.google.com/maps/search/DR%20MOTORS%20SHINERAY%20CONDE-PB/@-7.2608,-34.9078,17z?hl=pt-BR/',
  },
];

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
          aria-label="Escolher localização da DR Motors"
          aria-haspopup="dialog"
          aria-expanded={open}
          onMouseEnter={openOnHover}
          onMouseLeave={closeAfterHover}
          onFocus={openOnHover}
          data-testid={`button-location-${variant}`}
        >
          <MapPin size={15} strokeWidth={1.8} />
          <span>Oitizeiro e Conde</span>
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
            <strong>Escolha uma unidade</strong>
            <span>Selecione a localização para abrir no Google Maps.</span>
          </div>
        </div>
        <div className="location-option-list">
          {LOCATIONS.map(({ name, href }) => (
            <a
              key={name}
              className="location-option"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MapPin size={16} strokeWidth={1.8} />
              <span className="location-option-copy">
                <strong>{name}</strong>
                <small>Ver localização no Google Maps</small>
              </span>
              <ArrowUpRight size={15} />
            </a>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
