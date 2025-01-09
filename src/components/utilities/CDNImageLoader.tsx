if (!process.env.NEXT_PUBLIC_BUNNY_CDN_URL) {
  throw new Error("no bunny cdn url");
}

export const CDNImageLoader = ({ src, width }: any) => {
  // returns the based r2 url because the cdn might not have time to grab the picture from r2
  const imagePath = src.split("/").pop();
  const optimizedCdnImageUrl =
    process.env.NEXT_PUBLIC_BUNNY_CDN_URL + imagePath + "?width=" + width;
  return optimizedCdnImageUrl;
};
