import huataiLogoUrl from "../assets/huatai-logo.png";

export function BrandLockup() {
  return (
    <a className="brand-lockup" href="#overview" aria-label="华泰证券研究所中国宏观脉搏首页">
      <img src={huataiLogoUrl} alt="华泰证券标志" width="127" height="32" />
      <span className="brand-copy">
        <span className="brand-name">华泰证券</span>
        <span className="brand-english">HUATAI SECURITIES</span>
      </span>
      <span className="product-name">研究所 · 中国宏观脉搏</span>
    </a>
  );
}
