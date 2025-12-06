import { useEffect, useState } from "react";
import api from "@/lib/api";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/captions.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const POTDSection = () => {
  const [pictureOfTheDay, setPictureOfTheDay] = useState(null);
  const [featuredImageData, setFeaturedImageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openFeaturedPic, setOpenFeaturedPic] = useState(false);
  const [openLightbox, setOpenLightbox] = useState(false);
  const { isLoggedIn } = useAuth();

  const fetchPOTD = async () => {
    try {
      setLoading(true);
      const res = await api.get("/picture/potd");
      const image = {
        copyright: res.data.copyright,
        date: res.data.date,
        src: res.data.hdurl,
        explanation: res.data.explanation,
        title: res.data.title,
      };
      setPictureOfTheDay(image);
    } catch (err) {
      console.error("Error fetching potd");
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedImage = async () => {
    try {
      const res = await api.get("/gallery/featured");
      setFeaturedImageData(res.data[0]);
    } catch (err) {
      console.error("Error fetching featured image");
    }
  };

  useEffect(() => {
    fetchPOTD();
    fetchFeaturedImage();
  }, []);

  const pictureSlides = pictureOfTheDay
    ? [
        {
          src: pictureOfTheDay.src,
          alt: pictureOfTheDay.title,
          description: pictureOfTheDay.explanation,
        },
      ]
    : [];

  const featuredSlides = featuredImageData
    ? [
        {
          src: featuredImageData.imageUrl,
          alt: featuredImageData.title,
          description: featuredImageData.caption,
        },
      ]
    : [];

    // if none exist; hide this section
  if (!pictureOfTheDay && !featuredImageData) return null;

  return (
    <section className="mb-4 py-4 px-4 sm:px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          Spotlight Gallery
        </h2>
        <p className="text-xl hidden md:block text-gray-400 max-w-3xl mx-auto">
          A daily glimpse into the wonders of space from official NASA
          selections to exceptional images by our own club members.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* POTD Card */}
        {pictureOfTheDay && (
          <div
            className="cosmic-card overflow-hidden shadow-lg cursor-pointer"
            onClick={() => setOpenLightbox(true)}
          >
            <div className="relative aspect-[16/9] sm:aspect-video">
              <img
                src={pictureOfTheDay.src}
                alt={pictureOfTheDay.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0" />
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold mb-2">
                Picture of the Day
              </h3>
              <p className="text-sm text-gray-300 mb-3">
                {pictureOfTheDay.title}
              </p>
              <div className="text-sm text-gray-400 mb-3 hidden sm:block overflow-y-auto max-h-24 pr-2">
                {pictureOfTheDay.explanation}
              </div>
              <p className="text-xs text-gray-500">
                Courtesy: {pictureOfTheDay.copyright || "NASA"}
              </p>
            </div>
          </div>
        )}

        {/* Club Featured Card */}
        {featuredImageData && (
          <div className="cosmic-card overflow-hidden shadow-lg">
            <div
              className="relative aspect-[16/9] sm:aspect-video"
              onClick={() => setOpenFeaturedPic(true)}
            >
              <img
                src={featuredImageData.imageUrl}
                alt="Featured by Club Member"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0" />
            </div>
            <div className="p-4 sm:p-6">
              <p className="uppercase text-xs font-bold tracking-widest text-space-accent mb-2">
                Featured Pic
              </p>
              <h3 className="text-lg sm:text-xl font-bold mb-2">
                Club Member’s Featured Picture
              </h3>
              <p className="text-sm text-gray-400 mb-3">
                {featuredImageData.caption}
              </p>
              <div className="flex items-center gap-2 pb-1">
                {/* <img
                  src={featuredImageData.author?.avatar}
                  loading="lazy"
                  alt={featuredImageData.author?.name}
                  className="w-8 h-8 mb-2 rounded-full object-cover"
                /> */}
                <Avatar>
                <AvatarImage
                  src={featuredImageData.author?.avatar}
                  alt={featuredImageData.author?.name}
                />{" "}
                <AvatarFallback className="bg-space-purple">
                  {featuredImageData.author?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
                <div>
                  <h4 className="text-sm font-semibold">
                    <a href={featuredImageData.socialLink} className="text-white hover:text-space-accent">{featuredImageData.author?.name}</a>
                  </h4>
                  <p className="text-xs text-gray-400 mb-2">ISA Club</p>
                </div>
              </div>
              <hr className="mb-2" />
              <p className="text-xs text-gray-400">
                    * We’re looking for amazing space shots from the community!
                    Send us your best astro photos for a chance to be featured
                    here. {!isLoggedIn && <span>Login to see the details.</span>} {isLoggedIn && <Link to={'/upload-pic'} className="text-space-accent underline">Send here</Link>}
                  </p>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox for potd */}
      {openLightbox && pictureOfTheDay && (
        <Lightbox
          open={openLightbox}
          close={() => setOpenLightbox(false)}
          slides={pictureSlides}
          plugins={[Captions, Zoom]}
          carousel={{
            finite: true, // disables infinite loop if we hae single image
          }}
          controller={{
            closeOnBackdropClick: true,
          }}
          render={{
            buttonPrev: pictureSlides.length > 1 ? undefined : () => null,
            buttonNext: pictureSlides.length > 1 ? undefined : () => null,
          }}
        />
      )}

      {/* Lightbox for featured */}
      {openFeaturedPic && pictureOfTheDay && (
        <Lightbox
          open={openFeaturedPic}
          close={() => setOpenFeaturedPic(false)}
          slides={featuredSlides}
          plugins={[Captions]}
        />
      )}
    </section>
  );
};

export default POTDSection;
