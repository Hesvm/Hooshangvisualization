type AppIconMarkOptions = {
  size: number;
  cornerRadius?: number;
  ghostScale?: number;
};

/** Ghost/robot mark on a blue-to-indigo gradient tile, shared by every generated icon route. */
export function AppIconMark({ size, cornerRadius = size * 0.22, ghostScale = 0.56 }: AppIconMarkOptions) {
  const ghostWidth = size * ghostScale;
  const ghostHeight = ghostWidth * 1.12;
  const eyeSize = ghostWidth * 0.16;

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #8B93F3 0%, #4B54E8 60%, #3D48E0 100%)",
        borderRadius: cornerRadius,
      }}
    >
      <div
        style={{
          width: ghostWidth,
          height: ghostHeight,
          background: "#FFFFFF",
          borderTopLeftRadius: ghostWidth / 2,
          borderTopRightRadius: ghostWidth / 2,
          borderBottomLeftRadius: ghostWidth * 0.16,
          borderBottomRightRadius: ghostWidth * 0.16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: ghostHeight * 0.14,
        }}
      >
        <div style={{ display: "flex", gap: ghostWidth * 0.16 }}>
          <div
            style={{
              width: eyeSize,
              height: eyeSize,
              borderRadius: eyeSize / 2,
              background: "#4B54E8",
            }}
          />
          <div
            style={{
              width: eyeSize,
              height: eyeSize,
              borderRadius: eyeSize / 2,
              background: "#4B54E8",
            }}
          />
        </div>
      </div>
    </div>
  );
}
