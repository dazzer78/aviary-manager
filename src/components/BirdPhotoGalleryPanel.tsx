import { deleteBirdPhoto, setPrimaryPhoto, uploadBirdPhoto } from "@/app/(app)/dashboard/birds/[ring]/photos/actions";

type Photo = {
  id: string;
  image_url: string;
  caption: string | null;
  is_primary: boolean;
  file_name: string | null;
};

export default function BirdPhotoGalleryPanel({ ring, photos }: { ring: string; photos: Photo[] }) {
  const uploadAction = uploadBirdPhoto.bind(null, ring);
  const primaryAction = setPrimaryPhoto.bind(null, ring);
  const deleteAction = deleteBirdPhoto.bind(null, ring);

  return (
    <div className="card mb-3">
      <div className="card-header"><h3 className="card-title mb-0">Bird Photos</h3></div>
      <div className="card-body">
        <form action={uploadAction} className="mb-4">
          <div className="row g-3 align-items-end">
            <div className="col-md-5"><label className="form-label">Upload photo</label><input name="photo" type="file" accept="image/*" capture="environment" className="form-control" required /></div>
            <div className="col-md-5"><label className="form-label">Caption</label><input name="caption" className="form-control" placeholder="Optional caption" /></div>
            <div className="col-md-2"><button className="btn btn-primary w-100" type="submit">Upload</button></div>
          </div>
        </form>

        <div className="row g-3">
          {photos.map((photo) => (
            <div className="col-sm-6 col-lg-4" key={photo.id}>
              <div className="card h-100">
                <img src={photo.image_url} alt={photo.caption || photo.file_name || "Bird photo"} style={{ width: "100%", height: 180, objectFit: "cover" }} />
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                    <div>
                      <strong>{photo.caption || photo.file_name || "Bird photo"}</strong>
                      {photo.is_primary ? <div><span className="badge bg-green-lt text-green mt-2">Primary</span></div> : null}
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    {!photo.is_primary ? <form action={primaryAction}><input type="hidden" name="photo_id" value={photo.id} /><button className="btn btn-sm btn-outline-primary" type="submit">Set primary</button></form> : null}
                    <form action={deleteAction}><input type="hidden" name="photo_id" value={photo.id} /><button className="btn btn-sm btn-outline-danger" type="submit">Delete</button></form>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {photos.length === 0 ? <div className="col-12 text-muted">No photos uploaded yet.</div> : null}
        </div>
      </div>
    </div>
  );
}
