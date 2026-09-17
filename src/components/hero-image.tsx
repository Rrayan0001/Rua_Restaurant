import { getImageProps } from "next/image";

export function HeroImage() {
  const shared = { alt: "Rua Yelahanka's open-air pergola strung with festoon lights over the stone courtyard", fill: true, sizes: "100vw" };
  const { props: mobile } = getImageProps({ ...shared, src: "/images/hero-mobile.jpg", quality: 65 });
  const { props: desktop } = getImageProps({ ...shared, src: "/images/hero.jpg", quality: 75 });
  return <>
    <link rel="preload" as="image" imageSrcSet={mobile.srcSet} imageSizes="100vw" media="(max-width: 760px)" />
    <link rel="preload" as="image" imageSrcSet={desktop.srcSet} imageSizes="100vw" media="(min-width: 761px)" />
    <picture className="hero-picture">
      <source media="(max-width: 760px)" srcSet={mobile.srcSet} sizes="100vw" />
      {/* getImageProps supplies Next.js optimized responsive sources for this art-directed picture. */}
      <img {...desktop} alt={shared.alt} className="hero-image" loading="eager" fetchPriority="high" />
    </picture>
  </>;
}
