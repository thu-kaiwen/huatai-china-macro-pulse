import huataiLogoUrl from "../assets/huatai-logo.png";

interface BrandLockupProps {
  onNavigate?: () => void;
}

export function BrandLockup({ onNavigate }: BrandLockupProps) {
  return (
    <a className="brand-lockup" href="#research-home" aria-label="华泰证券宏观研究图谱首页" onClick={onNavigate}>
      <img src={huataiLogoUrl} alt="华泰证券标志" width="127" height="32" />
      <span className="brand-copy">
        <span className="brand-name">华泰证券</span>
        <span className="brand-english">HUATAI SECURITIES</span>
      </span>
      <span className="product-name">研究所 · 华泰宏观研究图谱</span>
    </a>
  );
}
