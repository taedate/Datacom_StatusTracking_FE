export function ThaiBahtText(number) {
  if (isNaN(number) || number === null || number === undefined) return "";
  let numStr = parseFloat(number).toFixed(2);
  let bahtStr = numStr.split(".")[0];
  let satangStr = numStr.split(".")[1];

  const numberTexts = ["ศูนย์", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"];
  const unitTexts = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];

  function getDigitText(str) {
    if (str === "0" || str === "") return "";
    let result = "";
    let length = str.length;

    for (let i = 0; i < length; i++) {
      let digit = parseInt(str.charAt(i));
      let pos = length - 1 - i;

      if (digit === 0) continue;

      let text = numberTexts[digit];
      if (pos === 1 && digit === 1) text = "";
      if (pos === 1 && digit === 2) text = "ยี่";
      if (pos === 0 && digit === 1 && length > 1 && str.charAt(length - 2) !== "0") text = "เอ็ด";

      result += text + unitTexts[pos % 6];
      if (pos > 0 && pos % 6 === 0) result += "ล้าน"; // Handle multi-millions
    }
    return result;
  }

  let bahtText = getDigitText(bahtStr);
  let satangText = getDigitText(satangStr);

  if (bahtStr === "0" && satangStr === "00") return "ศูนย์บาทถ้วน";
  
  let result = "";
  if (bahtText) result += bahtText + "บาท";
  if (satangText) result += satangText + "สตางค์";
  else result += "ถ้วน";

  return `( ${result} )`;
}
