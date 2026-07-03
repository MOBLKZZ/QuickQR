export function exportSVG(el, qrCode) {
  el.addEventListener("click", () => {
    qrCode.download({ name: "qr", extension: "svg" });
  })
};

export function exportPNG(el, qrCode) {
  el.addEventListener("click", () => {
    qrCode.download({ name: "qr", extension: "png", options: {
        width: 1000,
        height: 1000
      } });
  })
};

export function exportPDF(el, qrCode) {
  el.addEventListener("click", () => {
    window.print()
  })
}; 