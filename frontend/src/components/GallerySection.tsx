import api from '@/lib/api';
import { useEffect, useRef, useState } from 'react';
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
        <Skeleton
          key={i}
          variant="rectangular"
          width={240}
          height={240}
          className="flex-shrink-0 snap-start"
        />
      ))
    : galleryImages.map((img, i) => (
        <img
          key={img._id}
          src={img.src}
          className="h-60 w-60 object-cover rounded cursor-pointer flex-shrink-0 snap-start"
          onClick={() => {
            setOpen(true);
            setIndex(i);
          }}
        />
      ))}
</div>
        <div className="hidden md:grid grid-cols-4 gap-4">
          {initialLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" height={256} />
              ))
            : galleryImages.map((img, i) => (
                <img
                  key={img._id}
                  src={img.src}
                  className="h-64 w-full object-cover rounded cursor-pointer"
                  onClick={() => {
                    setOpen(true);
                    setIndex(i);
                  }}
                />
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