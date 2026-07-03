import { exportSVG, exportPNG, exportPDF } from "./js/export.js";

const inputURL = document.querySelector(".inputURL");
const labelURL = document.querySelector(".valueInputURL");
const containerQrCode = document.querySelector(".containerQrCode");
const modeTheme = document.querySelector(".modeTheme");
const uploadFile = document.querySelector("#uploadFile");
const removeFileBtn = document.querySelector(".btn-remove");

const downloadSVG = document.querySelector(".btn-download-svg");
const downloadPNG = document.querySelector(".btn-download-png");
const downloadPDF = document.querySelector(".btn-download-pdf");

const dotsInputs = document.querySelectorAll('input[name="dots-forms"]');
const cornersInputs = document.querySelectorAll('input[name="corners-forms"]');

const labelColor1 = document.querySelector('#label-color-1');
const labelColor2 = document.querySelector('#label-color-2');
const labelColor3 = document.querySelector('#label-color-3');
const ranges = document.querySelectorAll(".range");

const tabButtons = document.querySelectorAll(".tab-btn");
const inputGroups = document.querySelectorAll(".input-group");
const dropdownButton = document.querySelector("#dropdownGroupButton");
const inputPhone = document.querySelector('.inputPhone');

inputPhone.addEventListener('input', (e) => {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length > 0) value = "+" + value;
  if (value.length > 3) value = value.replace(/^(\+\d{2})(\d)/, "$1 ($2");
  if (value.length > 7) value = value.replace(/^(\+\d{2}\s\(\d{2})(\d)/, "$1) $2");
  if (value.length >= 14) {
    value = value.replace(/^(\+\d{2}\s\(\d{2}\)\s\d{5})(\d{4})(.*)/, "$1-$2$3");
  } else if (value.length > 12) {
    value = value.replace(/^(\+\d{2}\s\(\d{2}\)\s\d{4})(\d)/, "$1-$2");
  }
  e.target.value = value;
});

labelColor1.value = "#000000";
labelColor2.value = "#000000";
labelColor3.value = "#FFFFFF";
if (inputURL) labelURL.textContent = inputURL.value.length;

const qrCode = new QRCodeStyling({
  width: 260,
  height: 260,
  type: "svg",
  data: "https://google.com",
  dotsOptions: { color: labelColor1.value, type: "square" },
  cornersSquareOptions: { color: labelColor2.value, type: "square" },
  backgroundOptions: { color: labelColor3.value },
  imageOptions: { hideBackgroundDots: true, imageSize: 0.4, margin: 10 }
});
qrCode.append(containerQrCode);

const colorTargets = {
  "label-color-1": (color) => ({ dotsOptions: { color } }),
  "label-color-2": (color) => ({ cornersSquareOptions: { color } }),
  "label-color-3": (color) => ({ backgroundOptions: { color } })
};

const createPicker = (selector, defaultColor, labelTarget) => {
  const picker = Pickr.create({
    el: selector,
    theme: 'nano',
    default: defaultColor,
    closeOnScroll: false,
    components: {
      preview: true, opacity: true, hue: true,
      interaction: { hex: true, input: true, save: true }
    }
  });

  picker.on('init', instance => {
    const parent = instance.getRoot().button.parentElement;
    if (parent) { parent.style.backgroundColor = defaultColor; parent.style.borderRadius = "3px"; }
    instance.getRoot().button.style.background = defaultColor;
  });
  
  picker.on('change', (color) => {
    if (!color) return;
    const hexColor = color.toHEXA().toString();
    labelTarget.value = hexColor;
    labelTarget.textContent = hexColor.toUpperCase();
    picker.getRoot().button.style.background = hexColor;
    if (picker.getRoot().button.parentElement) picker.getRoot().button.parentElement.style.backgroundColor = hexColor;
    
    const getUpdateConfig = colorTargets[labelTarget.id];
    if (getUpdateConfig) {
      qrCode.update(getUpdateConfig(hexColor));
    }
  });
  return picker;
};

createPicker('#color-picker-1', '#000000', labelColor1);
createPicker('#color-picker-2', '#000000', labelColor2);
createPicker('#color-picker-3', '#ffffff', labelColor3);

dotsInputs.forEach((el) => {
  el.addEventListener("change", () => {
    qrCode.update({ dotsOptions: { type: el.dataset.border } });
  });
});

cornersInputs.forEach((el) => {
  el.addEventListener("change", () => {
    const borderType = el.dataset.border;
    let cornerType = "square";
    if (borderType === "extra-rounded") cornerType = "extra-rounded";
    if (borderType === "dots") cornerType = "dot";
    qrCode.update({ cornersSquareOptions: { type: cornerType } });
  });
});

const groupGenerators = {
  "url": () => {
    const input = document.querySelector(".inputURL");
    if (input) labelURL.textContent = input.value.length;
    return input ? input.value.replace(/\s/g, "").trim() || "https://google.com" : "https://google.com";
  },
  
  "whatsapp": () => {
    const phone = document.querySelector(".inputPhone").value.replace(/\D/g, "");
    const msg = encodeURIComponent(document.querySelector(".inputMessage").value.trim());
    if (!phone) return "https://google.com";
    return msg ? `https://wa.me/${phone}?text=${msg}` : `https://wa.me/${phone}`;
  },

  "group-whatsapp": () => {
    const input = document.querySelector(".inputGroupWhatsApp");
    if (!input) return "https://google.com";
    return input.value.trim().replace(/\s/g, "") || "https://google.com";
  }
};

const updateQRCodeByActiveGroup = () => {
  const activeTab = document.querySelector(".tab-btn.active");
  if (!activeTab) return;
  
  const groupType = activeTab.dataset.group;
  const generateData = groupGenerators[groupType];
  
  if (generateData) {
    qrCode.update({ data: generateData() });
  }
};

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    tabButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    if (dropdownButton) dropdownButton.textContent = `Tipo: ${btn.textContent.trim()}`;

    const targetGroup = btn.dataset.group;
    inputGroups.forEach(group => {
      group.id === `group-${targetGroup}` ? group.classList.add("active") : group.classList.remove("active");
    });
    updateQRCodeByActiveGroup();
  });
});

inputGroups.forEach(group => group.addEventListener("input", updateQRCodeByActiveGroup));

const rangeTransformations = {
  "rangeMargin": (val) => `${parseInt(val, 10) * 2.5}`,
  "rangeSize": (val) => `${parseInt(val, 10) * 2.5}`
};

const rangeTargets = {
  "rangeMargin": (val) => ({ imageOptions: { margin: (parseInt(val, 10) ) || 0 } }),
  "rangeSize": (val) => ({ imageOptions: { imageSize: (parseInt(val, 10) / 100) || 0 } })
};

const updateRangeBackground = (range) => {
  const min = parseInt(range.min, 10) || 0;
  const max = parseInt(range.max, 10) || 100;
  const val = parseInt(range.value, 10);
  const percentage = ((val - min) / (max - min)) * 100;
  const bgTrack = modeTheme.checked ? "var(--bg-input)" : "var(--bg-group)";
  range.style.background = `linear-gradient(to right, var(--primary-color) ${percentage}%, ${bgTrack} ${percentage}%)`;
};

ranges.forEach((range) => {
  const labelEl = range.parentElement.querySelector(".valueRange");
  const updateLabelText = () => {
    if (labelEl) {
      const transformFn = rangeTransformations[range.id];
      labelEl.textContent = transformFn ? transformFn(range.value) : range.value;
    }
  };

  updateRangeBackground(range);
  updateLabelText();

  range.addEventListener("input", () => {
    updateRangeBackground(range);
    updateLabelText();
    
    const getParamConfig = rangeTargets[range.id];
    if (getParamConfig) {
      qrCode.update(getParamConfig(range.value));
    }
  });
});

if (localStorage.getItem("saveTheme") === "true") modeTheme.checked = true;
modeTheme.addEventListener("change", () => {
  localStorage.setItem("saveTheme", modeTheme.checked);
  ranges.forEach(updateRangeBackground);
});

exportSVG(downloadSVG, qrCode);
exportPNG(downloadPNG, qrCode);
exportPDF(downloadPDF, qrCode);

if (uploadFile) {
  uploadFile.addEventListener("change", () => {
    const file = uploadFile.files[0];
    const maxSizeInByte = 2 * 1024 * 1024;
    if (!file) return;
    if (file.size > maxSizeInByte) {
      uploadFile.value = "";
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      qrCode.update({ image: e.target.result });
    };
    reader.readAsDataURL(file);
  });
}

if (removeFileBtn) {
  removeFileBtn.addEventListener("click", () => {
    if (uploadFile) uploadFile.value = "";
    qrCode.update({ image: "" });
  });
}
 