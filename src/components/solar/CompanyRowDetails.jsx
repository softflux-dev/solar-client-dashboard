import { useTranslation } from "react-i18next";
import { ChevronUp } from "lucide-react";

import { Button } from "@/components/ui/button";

/* ─── tiny chat SVG ─────────────────────────────────────────────────────── */
function ChatIcon({ className }) {
  return (
    <svg
      viewBox="0 0 16 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3.97836 0.0186119C2.73661 0.0792742 1.96536 0.161168 1.65269 0.264294C1.10775 0.443248 0.59854 0.898214 0.327559 1.44721C0.196536 1.70806 0.148891 1.90824 0.0684897 2.5088C0.00893344 2.95467 0 3.13059 0 4.23464C0 5.49945 0.0268003 5.89072 0.151868 6.53981C0.208447 6.82795 0.413916 7.25866 0.604496 7.4922C0.893344 7.84708 1.33108 8.14129 1.73606 8.25655L1.92069 8.30811L2.54901 9.32724C2.89741 9.88836 3.20115 10.3737 3.22795 10.404C3.29942 10.4889 3.49893 10.5738 3.63293 10.5738C3.76693 10.5738 3.96645 10.492 4.03494 10.407C4.05876 10.3797 4.33569 9.94296 4.64539 9.43946L5.21117 8.5265L5.68762 8.50526C7.48026 8.42337 8.24556 8.36574 8.59099 8.28081C9.36522 8.08973 10.0412 7.40424 10.2288 6.61563C10.3866 5.95442 10.467 4.58951 10.4134 3.54309C10.33 1.92644 10.1931 1.42901 9.67789 0.870916C9.27886 0.437181 8.80539 0.21273 8.12943 0.139936C7.08422 0.0277109 5.0325 -0.0329514 3.97836 0.0186119ZM7.96267 2.73325C8.15921 2.83637 8.26045 3.05476 8.21876 3.28528C8.19196 3.43693 8.01627 3.60982 7.84654 3.65835C7.74231 3.68868 7.12293 3.69171 5.09504 3.67958L2.47456 3.65835L2.34056 3.59162C2.18869 3.51276 2.08745 3.3793 2.05767 3.21551C2.03087 3.07296 2.13509 2.85154 2.27505 2.75751L2.37629 2.68775H5.12779C7.48622 2.68775 7.8912 2.69382 7.96267 2.73325ZM5.27966 4.93832C5.65189 5.00808 5.81269 5.43272 5.58042 5.733C5.45237 5.89982 5.40473 5.90892 4.58881 5.90285C3.28155 5.89679 2.51327 5.86039 2.40905 5.80276C2.21251 5.6966 2.07554 5.44485 2.11127 5.25073C2.13509 5.12334 2.26016 4.96865 2.37927 4.91709C2.48945 4.86856 5.02357 4.88676 5.27966 4.93832Z"
        fill="currentColor"
      />
      <path
        d="M11.1132 3.9071C11.14 4.7958 11.0567 5.96052 10.9137 6.67937C10.6993 7.77432 9.7375 8.74795 8.64464 8.97847C8.33197 9.0452 7.63516 9.10889 6.81924 9.14832C6.44404 9.16652 6.01225 9.18776 5.86038 9.19685L5.58643 9.21505L5.60131 9.30908C5.61025 9.36368 5.65194 9.5214 5.69363 9.66092C5.8991 10.3312 6.55421 10.9318 7.23613 11.0744C7.60836 11.1502 9.26998 11.2685 10.0651 11.2715L10.3331 11.2745L10.8542 12.1238C11.14 12.5909 11.4229 13.0186 11.4825 13.0762C11.6641 13.243 11.9679 13.2461 12.1495 13.0823C12.1912 13.0459 12.492 12.5848 12.8166 12.0601L13.4032 11.1047L13.5997 11.041C14.0583 10.8893 14.4663 10.586 14.7402 10.1947C14.9874 9.84594 15.0588 9.60936 15.1631 8.82985C15.2286 8.31725 15.2375 6.40336 15.175 5.88773C15.0678 4.98689 14.9546 4.64112 14.6539 4.26501C14.3352 3.87374 13.8499 3.57953 13.3853 3.4946C13.0458 3.43394 11.679 3.32474 11.2204 3.32474H11.0954L11.1132 3.9071Z"
        fill="currentColor"
      />
    </svg>
  );
}


export default function CompanyRowDetails({
  company,
  onCollapse,
  onExpand,
  onGetQuotations,
}) {
  const { t } = useTranslation();
  const images = company.images ?? [];
  const visibleImgs = images;

  return (
    <div className="crd-panel">
      {/* ── Images ──────────────────────────────────────────────── */}
      <div className="crd-images-section">
        <p className="crd-images-label">{t("solar.projectImages")}</p>
        <div className="crd-images-grid">
          {visibleImgs.map((src, index) => (
            <div key={index} className="crd-img-wrapper">
              <img
                src={src}
                alt={`${company.name} project ${index + 1}`}
                loading="lazy"
                className="crd-img"
              />
            </div>
          ))}


        </div>
      </div>

      {/* ── Bottom bar: right-aligned action buttons ─────────────── */}
      <div className="crd-bottom-bar">
        <div className="crd-actions">
          <Button
            variant="outline"
            size="sm"
            className="crd-btn-outline"
            onClick={onExpand}
          >
            {t("solar.viewDetail")}
          </Button>
          <Button size="sm" onClick={onGetQuotations}>
            {t("solar.getQuotations")}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title={t("solar.chatSoon")}
            aria-label={t("solar.chat")}
            className="crd-btn-chat"
          >
            <ChatIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ── See Less footer ──────────────────────────────────────── */}
      <div className="crd-footer">
        <button
          type="button"
          onClick={onCollapse}
          className="crd-see-less"
        >
          {t("solar.seeLess")}
          <ChevronUp className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
