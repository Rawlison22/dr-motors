// Fotos dos modelos, apontando direto para o site oficial da Shineray do Brasil.
// Para ajustar um modelo, use EXATAMENTE o nome do card do App.tsx como chave em `modelMedia`.
//
// - cover:   foto principal da moto (a mesma "og:image" da página da Shineray) — só a moto inteira
// - gallery: fotos da galeria da moto (aparecem no hover do card e no visualizador)
// - colors:  (opcional) fotos da moto inteira nas cores disponíveis (entram no visualizador e no banner)
// - video:   (opcional) link do YouTube ou .mp4. Sem ele, o botão leva à página da moto na Shineray
//
// Ajuste fino da foto de capa no card (opcionais):
// - position: '50% 50%' (centro), '50% 30%' (sobe), '70% 50%' (direita)
// - zoom:     1.15 aproxima 15%, 0.9 afasta
// - fit:      'contain' (moto inteira, padrão) ou 'cover' (preenche cortando as bordas)
export type ModelMedia = {
  page: string;
  cover: string;
  gallery: string[];
  colors?: string[];
  video?: string;
  poster?: string;
  position?: string;
  zoom?: number;
  fit?: 'contain' | 'cover';
};

const SH = 'https://www.shineray.com.br/wp-content/uploads';
const nums = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

const phoenix: ModelMedia = {
  page: 'https://www.shineray.com.br/produto/phoenix-50/',
  cover: `${SH}/2023/07/Phoenix-S.webp`,
  gallery: [
    ...['S1', 'S2', 'S3', 'S4', 'S6', 'S8', 'S9', 'S10'].map((n) => `${SH}/2023/07/Phoenix-${n}.webp`),
    `${SH}/2023/07/10.webp`,
    `${SH}/2023/07/Galeria-01.webp`,
  ],
};

// New Jet 125 (site oficial — fotos oficiais da Shineray)
const newJet125: ModelMedia = {
  page: 'https://www.shineray.com.br/produto/jet-125/',
  cover: `${SH}/2026/02/NEW-JET-MENU.webp`,
  gallery: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'].map((n) => `${SH}/2026/02/${n}-scaled.webp`),
};

// Jet 125C (estoque / fotos próprias da loja — modelo que a Shineray parou de fabricar)
const jet125: ModelMedia = {
  page: 'https://www.shineray.com.br/produto/jet-125/',
  cover: `${import.meta.env.BASE_URL}motos/jet-125c/JET_125.png`,
  gallery: [
    `${import.meta.env.BASE_URL}motos/jet-125c/IMG_3718.jpg`,
    `${import.meta.env.BASE_URL}motos/jet-125c/IMG_3719.jpg`,
    `${import.meta.env.BASE_URL}motos/jet-125c/IMG_3721.jpg`,
    `${import.meta.env.BASE_URL}motos/jet-125c/IMG_3725.jpg`,
    `${import.meta.env.BASE_URL}motos/jet-125c/IMG_3726.jpg`,
    `${import.meta.env.BASE_URL}motos/jet-125c/IMG_3727.jpg`,
    `${import.meta.env.BASE_URL}motos/jet-125c/IMG_3728.jpg`,
  ],
  video: `${import.meta.env.BASE_URL}motos/jet-125c/IMG_3736_720p.mp4`,
  poster: `${import.meta.env.BASE_URL}motos/jet-125c/thumbnail.jpg`,
  position: '50% 40%',
  zoom: 1.05,
  fit: 'contain',
};

const rio125: ModelMedia = {
  page: 'https://www.shineray.com.br/produto/rio-125-efi/',
  cover: `${SH}/2023/12/Home-RIO-125-EFI.webp`,
  gallery: [
    `${SH}/2023/12/Galeria-RIO-125-EFI-1-2.webp`,
    `${SH}/2023/12/Galeria-RIO-125-EFI-2-2.webp`,
    `${SH}/2023/12/Galeria-RIO-125-EFI-3-2.webp`,
    `${SH}/2023/12/Galeria-RIO-125-EFI-4-2.webp`,
    `${SH}/2023/12/Galeria-RIO-125-EFI-5-2.webp`,
    `${SH}/2023/12/Galeria-RIO-125-EFI-6-2.webp`,
    `${SH}/2023/12/Galeria-RIO-125-EFI-7-1.webp`,
    `${SH}/2023/12/Galeria-RIO-125-EFI-8-1.webp`,
    `${SH}/2023/12/Galeria-RIO-125-EFI-9-1.webp`,
    `${SH}/2023/12/Galeria-RIO-125-EFI-10-1.webp`,
  ],
};

const jef150: ModelMedia = {
  page: 'https://www.shineray.com.br/produto/jef-150/',
  cover: `${SH}/2026/03/JEF-150-Menu.webp`,
  gallery: [
    `${SH}/2023/08/Galeria-JEF-150-1-1-scaled.webp`,
    `${SH}/2023/08/Galeria-JEF-150-2-1-scaled.webp`,
    `${SH}/2023/08/Galeria-JEF-150-3-1-scaled.webp`,
    `${SH}/2023/08/Galeria-JEF-150-4-1-scaled.webp`,
    `${SH}/2023/08/Galeria-JEF-150-5-1-scaled.webp`,
    `${SH}/2023/08/GALERIA-JEF-150-3-scaled.webp`,
    `${SH}/2023/08/GALERIA-JEF-150-5-scaled.webp`,
    `${SH}/2023/08/GALERIA-JEF-150-6-scaled.webp`,
    `${SH}/2023/08/GALERIA-JEF-150-8-scaled.webp`,
    `${SH}/2023/08/GALERIA-JEF-150-10-scaled.webp`,
  ],
};

const jef170: ModelMedia = {
  page: 'https://www.shineray.com.br/produto/jef-170/',
  cover: `${SH}/2026/06/JEF-170-500x500-1.webp`,
  gallery: [
    `${SH}/2026/06/01-scaled.webp`,
    ...[1, 2, 3, 4, 5, 6, 7, 8, 10].map((n) => `${SH}/2026/06/Galeria-JEF-170-${n}-1-scaled.webp`),
  ],
};

// Página "SHI 175" (carburada) → card "New SHI 175 S"
const shi175: ModelMedia = {
  page: 'https://www.shineray.com.br/produto/shi-175/',
  cover: `${SH}/2026/04/500x500-SHI-175.webp`,
  gallery: nums(10).map((n) => `${SH}/2026/04/Galeria-SHI-175-${n}.webp`),
};

// Página "SHI 175ss" → card "SHI 175 EFI"
const shi175sEfi: ModelMedia = {
  page: 'https://www.shineray.com.br/produto/shi-175ss/',
  cover: `${SH}/2026/09/SHI-175ss-Cores-1.webp`,
  gallery: [
    `${SH}/2026/09/Itens-de-Serie-SHI-175ss-1-1024x682.webp`,
    `${SH}/2026/09/Itens-de-Serie-SHI-175ss-2-1024x682.webp`,
    `${SH}/2026/09/Itens-de-Serie-SHI-175ss-3-1024x682.webp`,
    `${SH}/2026/09/Itens-de-Serie-SHI-175ss-4-1024x682.webp`,
    `${SH}/2026/09/Itens-de-Serie-SHI-175ss-5-1024x682.webp`,
  ],
  colors: [
    `${SH}/2026/09/SHI-175ss-Cores-1.webp`,
    `${SH}/2026/09/SHI-175ss-Cores-3.webp`,
    `${SH}/2026/09/SHI-175ss-Cores-4.webp`,
    `${SH}/2026/09/SHI-175ss-Cores-5.webp`,
    `${SH}/2026/09/SHI-175ss-Cores-6.webp`,
  ],
};

// Página "250F" (248,92 cc · 27,9 cv · ABS) → card "Flash 250 EFI"
const flash250f: ModelMedia = {
  page: 'https://www.shineray.com.br/produto/250f/',
  cover: `${SH}/2024/12/250F.webp`,
  gallery: [
    `${SH}/2024/12/GALERIA-250F-1-1.webp`,
    ...[2, 3, 4, 5, 6, 7, 8, 9].map((n) => `${SH}/2024/12/GALERIA-250F-${n}-1.webp`),
    `${SH}/2024/12/GALERIA-250F-10.webp`,
  ],
  colors: [1, 2, 3].map((n) => `${SH}/2024/12/250F-COR-${n}-1.webp`),
};

export const modelMedia: Record<string, ModelMedia> = {
  'Phoenix 50C': phoenix,
  'Jet 125C': jet125,           // fotos próprias da loja (estoque)
  'New Jet 125C': newJet125,    // fotos oficiais do site Shineray
  'Rio 125': rio125,
  'New JEF 150': jef150,
  'New JEF 170': jef170,
  'New SHI 175 S': shi175,
  'SHI 175 EFI': shi175sEfi,
  'Flash 250 EFI': flash250f,
};

// Todas as fotos do visualizador: capa, galeria e cores
export const viewerImages = (m: ModelMedia) => [m.cover, ...m.gallery, ...(m.colors ?? [])];

// Banner da home: SÓ fotos da moto inteira (capas + cores), sem repetir
export const heroPhotos: { src: string; name: string }[] = (() => {
  const seen = new Set<string>();
  const out: { src: string; name: string }[] = [];
  for (const [name, m] of Object.entries(modelMedia)) {
    for (const src of [m.cover, ...(m.colors ?? [])]) {
      if (!seen.has(src)) {
        seen.add(src);
        out.push({ src, name });
      }
    }
  }
  return out;
})();