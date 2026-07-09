export function LiquidGlassFilter() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <filter
        id="liquid-glass-refract"
        x="-20%"
        y="-20%"
        width="140%"
        height="140%"
        colorInterpolationFilters="sRGB"
      >
        <feTurbulence type="fractalNoise" baseFrequency="0.018 0.032" numOctaves={2} seed={7} result="noise" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale={8}
          xChannelSelector="R"
          yChannelSelector="G"
          result="displaced"
        />
        <feGaussianBlur in="displaced" stdDeviation="0.18" result="softened" />
        <feSpecularLighting
          in="noise"
          surfaceScale={4}
          specularConstant={0.38}
          specularExponent={18}
          lightingColor="#ffffff"
          result="specular"
        >
          <fePointLight x={-120} y={-80} z={220} />
        </feSpecularLighting>
        <feComposite in="specular" in2="softened" operator="arithmetic" k1={0} k2={1} k3={0.22} k4={0} result="lit" />
        <feComposite in="lit" in2="SourceAlpha" operator="in" />
      </filter>
    </svg>
  );
}
