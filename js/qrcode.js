const colorTargets = {
  "label-color-1": (color) => ({ dotsOptions: { color } }),
  "label-color-2": (color) => ({ cornersSquareOptions: { color } }),
  "label-color-3": (color) => ({ backgroundOptions: { color } })
};

export function updateColor(el, qrCode) {
  el.addEventListener("input", () => {
    const getUpdateConfig = colorTargets[el.id];
    if (getUpdateConfig) {
      qrCode.update(getUpdateConfig(el.value));
    }
  });
}

export function updateURL(el, la, qrCode) {
  el.addEventListener("input", () => {
    el.value = el.value.replace(/\s/g, "").trim();
    la.textContent = el.value.length;
    qrCode.update({ data: el.value || "https://google.com" });
  });
}

export function updateDotsPattern(els, qrCode) {
  els.forEach((el) => {
    el.addEventListener("change", () => {
      qrCode.update({ dotsOptions: { type: el.dataset.border } });
    });
  });
}

export function updateCornersPattern(els, qrCode) {
  els.forEach((el) => {
    el.addEventListener("change", () => {
      const borderType = el.dataset.border;
      let cornerType = "square";
      if (borderType === "extra-rounded") cornerType = "extra-rounded";
      if (borderType === "dots") cornerType = "dot";
      qrCode.update({ cornersSquareOptions: { type: cornerType } });
    });
  });
}

const rangeTargets = {
  "rangeMargin": (val) => ({ imageOptions: { margin: (parseInt(val, 10) / 4) || 0 } }),
  "rangeSize": (val) => ({ imageOptions: { imageSize: (parseInt(val, 10) / 100) || 0 } })
};

export function rangeQR(el, qrCode) {
  const getParamConfig = rangeTargets[el.id];
  if (getParamConfig) {
    qrCode.update(getParamConfig(el.value));
  }
}

export function importImage(elFile, qrCode) {
  elFile.addEventListener("change", () => {
    const file = elFile.files[0];
    const maxSizeInByte = 2 * 1024 * 1024;
    if (!file) return;
    if (file.size > maxSizeInByte) {
      elFile.value = "";
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      const base64image = e.target.result;
      qrCode.update({
        image: base64image
      });
    };
    reader.readAsDataURL(file);
  });
}

export function removeImage(el, qrCode) {
  el.addEventListener("click", () => {
    qrCode.update({
      image: ""
    });
  });
}

export function whatsappQR(el, txt, qrCode) {
  const numberClear = el.value.replace(/\D/g, "");
  
  const textEncode = encodeURIComponent(txt.value);

  qrCode.update({ 
    data: `https://wa.me/${numberClear}?text=${text}`
  });
}
 