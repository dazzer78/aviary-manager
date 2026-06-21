type BirdPhoto = {
  ring: string;
  species: string;
  mutation: string;
  sex: string;
  status: string;
  image: string;
};

export default function BirdPhotoGallery({ birds }: { birds: BirdPhoto[] }) {
  return (
    <div className="card bird-photo-card mb-3">
      <div className="card-header d-flex align-items-center justify-content-between">
        <div>
          <h3 className="card-title mb-0">Featured Birds</h3>
          <div className="text-muted small">Photo-first view for quick bird identification</div>
        </div>
        <a href="/dashboard/gallery" className="btn btn-sm btn-outline-primary">Open gallery</a>
      </div>

      <div className="card-body">
        <div className="bird-photo-grid">
          {birds.slice(0, 5).map((bird) => (
            <a href={`/dashboard/birds/${bird.ring}`} className="bird-photo-tile" key={bird.ring}>
              <div className="bird-photo-frame">
                <img src={bird.image} alt={`${bird.ring} ${bird.species}`} />
                <span className="bird-photo-status">{bird.status}</span>
              </div>
              <div className="bird-photo-info">
                <strong>{bird.ring}</strong>
                <span>{bird.species}</span>
                <small>{bird.mutation} · {bird.sex}</small>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
