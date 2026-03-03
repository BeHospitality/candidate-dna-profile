import html2canvas from "html2canvas";

export async function exportDNACard(
  cardElement: HTMLElement,
  format: "linkedin" | "instagram",
  fileName: string
): Promise<void> {
  await document.fonts.ready;

  const canvas = await html2canvas(cardElement, {
    scale: 2,
    backgroundColor: null,
    useCORS: true,
    logging: false,
    width: format === "linkedin" ? 600 : 540,
    height: format === "linkedin" ? 315 : 540,
  });

  const link = document.createElement("a");
  link.download = fileName;
  link.href = canvas.toDataURL("image/png", 1.0);
  link.click();
}
