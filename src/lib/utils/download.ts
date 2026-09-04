import { MEDIA_URLS } from "@/lib/utils/media";

/**
 * Downloads the CV file directly to the user's local disk as "Muhammed_Hany_CV.pdf".
 *
 * Prevents opening the PDF viewer in a new tab by fetching the file binary as a Blob,
 * generating a same-origin object URL, and triggering a programmatic anchor click.
 * Falls back through same-origin API, static public asset, and direct attachment links.
 */
export async function downloadCv(): Promise<void> {
  const filename = "Muhammed_Hany_CV.pdf";

  // Prioritize same-origin endpoints to ensure full browser download compliance
  const candidateEndpoints = [
    "/api/download-cv",
    "/cv.pdf",
    MEDIA_URLS.cv,
  ];

  for (const endpoint of candidateEndpoints) {
    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        const rawBlob = await response.blob();
        // Guarantee application/pdf MIME type
        const pdfBlob = rawBlob.type.includes("pdf")
          ? rawBlob
          : new Blob([rawBlob], { type: "application/pdf" });

        const blobUrl = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Revoke the blob URL after a safe interval
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 2500);
        return;
      }
    } catch {
      // Continue to next candidate endpoint
    }
  }

  // Final fallback: Direct navigation to the attachment endpoint
  const fallbackLink = document.createElement("a");
  fallbackLink.href = "/api/download-cv";
  fallbackLink.download = filename;
  fallbackLink.style.display = "none";
  document.body.appendChild(fallbackLink);
  fallbackLink.click();
  document.body.removeChild(fallbackLink);
}
