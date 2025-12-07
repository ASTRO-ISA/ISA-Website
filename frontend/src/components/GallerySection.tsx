import api from '@/lib/api';
import { useEffect, useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/plugins/captions.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import { CircularProgress, Skeleton } from '@mui/material';

const GallerySection = () => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [lightboxImages, setLightboxImages] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const loadMoreImages = async () => {
    if (!hasMore || loadingMore) return;

    setLoadingMore(true);

    try {
      const res = await api.get(`/gallery?page=${page + 1}&limit=4`);
      const { data, total } = res.data;

      if (data.length === 0) {
        setHasMore(false);
        return;
      }

      const newImages = data.map((img: any) => ({
        _id: img._id,
        src: img.imageUrl,
        caption: img.caption || '',
      }));

      setLightboxImages((prev) => [...prev, ...newImages]);
      setPage((prev) => prev + 1);
      setHasMore(lightboxImages.length + newImages.length < total);
    } catch (err) {
      console.error('Error fetching more images', err);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    api.get('/gallery?page=1&limit=4').then((res) => {
      const { data, total } = res.data;
      const images = data.map((img: any) => ({
        _id: img._id,
        src: img.imageUrl,
        caption: img.caption || '',
      }));

      setGalleryImages(images);
      setLightboxImages(images);
      setHasMore(images.length < total);
      setInitialLoading(false);
    });
  }, []);

  return (
    <section className="py-10 bg-space-dark">
      <div className="container mx-auto px-4">
                <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">ISA Club Gallery</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto hidden md:block">
            Explore our community activities, workshops, and astronomical observations.
          </p>
        </div>
        {/* Mobile Horizontal Scroll */}
<div className="flex md:hidden gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
  {initialLoading
    ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 snap-start w-60 h-60 rounded-xl bg-space-dark/70 border border-space-purple/30 overflow-hidden"
                >
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="100%"
                    animation="wave"
                  />
                </div>
      ))
    : galleryImages.map((img, i) => (
        <div
          key={img._id}
          className="relative group h-60 w-60 rounded overflow-hidden cursor-pointer flex-shrink-0 snap-start"
          onClick={() => {
            setOpen(true);
            setIndex(i);
          }}
        >
          <img
            src={img.src}
            alt={img.caption || 'Gallery image'}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-white text-lg font-semibold text-center px-4">
              {img.caption}
            </p>
          </div>
        </div>
      ))}
</div>
        <div className="hidden md:grid grid-cols-4 gap-4">
          {initialLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" height={256} />
              ))
            : galleryImages.map((img, i) => (
                <div
                  key={img._id}
                  className="relative group h-64 w-full rounded overflow-hidden cursor-pointer"
                  onClick={() => {
                    setOpen(true);
                    setIndex(i);
                  }}
                >
                  <img
                    src={img.src}
                    alt={img.caption || 'Gallery image'}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-lg font-semibold text-center px-4">
                      {img.caption}
                    </p>
                  </div>
                </div>
              ))}
        </div>

        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={index}
          slides={lightboxImages.map((img) => ({
            src: img.src,
            description: img.caption,
          }))}
          plugins={[Zoom, Captions]}
          on={{
            view: ({ index: current }) => {
              setIndex(current);
              if (
                current >= lightboxImages.length - 2 &&
                hasMore &&
                !loadingMore
              ) {
                loadMoreImages();
              }
            },
          }}
          render={{
            controls: () =>
              loadingMore ? (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                  <CircularProgress />
                </div>
              ) : null,
          }}
        />
      </div>
    </section>
  );
};

export default GallerySection;