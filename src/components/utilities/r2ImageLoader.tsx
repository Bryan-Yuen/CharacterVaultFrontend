

export const r2ImageLoader = ({ src, width }: any) => {
  // Use the `src` provided and return the full URL
  const imagePath = src.split("/").pop();;
  const optimizedCdnImageUrl = process.env.NEXT_PUBLIC_BUNNY_CDN_URL + imagePath + "?width=" + Math.round(width * 1.5);
  return optimizedCdnImageUrl;
};
