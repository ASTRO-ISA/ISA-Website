function extractYouTubeId(url) {
    if (!url || typeof url !== "string") return null;

  const regExp =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|live\/)|youtu\.be\/)([^?&"'>]+)/;

  const match = url.match(regExp);
  return match ? match[1] : null;
  }
  
  module.exports = extractYouTubeId