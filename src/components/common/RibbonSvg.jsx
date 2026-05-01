/**
 * Pure ribbon SVG shape. No data, no animation — just the visual.
 * Use as a background by absolutely positioning it inside a relative parent.
 *
 * @param {string} className - position/size classes (e.g. "absolute inset-0 w-full h-full")
 */
const RibbonSvg = ({ className = "absolute inset-0 w-full h-full" }) => (
  <svg
    className={className}
    viewBox="0 0 900 72"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="ribGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#1d4ed8" />
        <stop offset="25%" stopColor="#4f46e5" />
        <stop offset="50%" stopColor="#7c3aed" />
        <stop offset="70%" stopColor="#c026d3" />
        <stop offset="85%" stopColor="#dc2626" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
      <linearGradient id="shineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
        <stop offset="40%" stopColor="rgba(255,255,255,0.04)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0.18)" />
      </linearGradient>
      <linearGradient id="foldL" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="foldR" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ea580c" stopOpacity="0" />
        <stop offset="100%" stopColor="#7c2d12" stopOpacity="0.85" />
      </linearGradient>
    </defs>

    {/* Main ribbon body */}
    <path d="M0,8 L34,36 L0,64 L900,64 L866,36 L900,8 Z" fill="url(#ribGrad)" />
    {/* Shine overlay */}
    <path d="M0,8 L34,36 L0,64 L900,64 L866,36 L900,8 Z" fill="url(#shineGrad)" />
    {/* Left fold shadow */}
    <path d="M0,8 L46,36 L0,64 L90,64 L90,8 Z" fill="url(#foldL)" opacity="0.5" />
    {/* Right fold shadow */}
    <path d="M810,8 L810,64 L900,64 L866,36 L900,8 Z" fill="url(#foldR)" opacity="0.5" />
    {/* Top highlight */}
    <path d="M34,8 L866,8" stroke="rgba(255,255,255,0.28)" strokeWidth="1" fill="none" />
    {/* Bottom edge */}
    <path d="M0,64 L900,64" stroke="rgba(0,0,0,0.15)" strokeWidth="1" fill="none" />
  </svg>
);

export default RibbonSvg;