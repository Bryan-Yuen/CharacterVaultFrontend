

export const R2ImageLoader = ({ src }: any) => {
  // Use the `src` provided and return the full URL
  const imagePath = src.split("/").pop();;
  const optimizedCdnImageUrl = process.env.NEXT_PUBLIC_BUNNY_CDN_URL + imagePath;
  return optimizedCdnImageUrl;
};
