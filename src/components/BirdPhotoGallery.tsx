import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

type BirdPhoto = {
  ring: string;
  species: string;
  mutation: string;
  sex: string;
  status: string;
  image: string;
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "1rem",
};

const tileStyle: CSSProperties = {
  display: "block",
  border: "1px solid var(--am-border)",
  borderRadius: 18,
  overflow: "hidden",
  background: "linear-gradient(180deg, #ffffff, #f8fafc)",
  boxShadow: "0 12px 28px rgba(15, 23, 42, 0.06)",
  transition: "all 0.2s ease",
};

const frameStyle: CSSProperties = {
  position: "relative",
  display: "grid",
  placeItems: "center",
  minHeight: 150,
  background: "radial-gradient(circle at top, rgba(37,99,235,0.12), rgba(124,58,237,0.08))",
};

const imageStyle: CSSProperties = {
  width: 116,
  height: 116,
  borderRadius: "50%",
  objectFit: "cover",
  background: "white",
  border: "6px solid rgba(255,255,255,0.88)",
  boxShadow: "0 14px 34px rgba(15, 23, 42, 0.18)",
};

const statusStyle: CSSProperties = {
  position: "absolute",
  right: 12,
  top: 12,
  borderRadius: 999,
  padding: "5px 9px",
  background: "rgba(22, 163, 74, 0.12)",
  color: "#15803d",
  fontSize: "0.72rem",
  fontWeight: 800,
};

const infoStyle: CSSProperties = {
  display: "grid",
  gap: 2,
  padding: "0.9rem 1rem 1rem",
};

export default function BirdPhotoGallery({ birds }: { birds: BirdPhoto[] }) {
  return (
    <div className="card mb-3">
      <div className="card-header d-flex align-items-center justify-content-between">
        <div>
          <h3 className="card-title mb-0">Featured Birds</h3>
          <div className="text-muted small">Photo-first view for quick bird identification</div>
        </div>
        <Link href="/dashboard/photos" className="btn btn-sm btn-outline-primary">Open gallery</Link>
      </div>

      <div className="card-body">
        <div style={gridStyle}>
          {birds.slice(0, 5).map((bird) => (
            <Link href={`/dashboard/birds/${bird.ring}`} style={tileStyle} key={bird.ring}>
              <div style={frameStyle}>
                <Image unoptimized src={bird.image} alt={`${bird.ring} ${bird.species}`} width={116} height={116} style={imageStyle} />
                <span style={statusStyle}>{bird.status}</span>
              </div>
              <div style={infoStyle}>
                <strong>{bird.ring}</strong>
                <span className="text-secondary">{bird.species}</span>
                <small className="text-muted">{bird.mutation} · {bird.sex}</small>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
