

export const CDNImageLoader = ({ src, width }: any) => {
  // returns the based r2 url because the cdn might not have time to grab the picture from r2
  if (src.includes("?new")) {
    return src
  } else {
    const imagePath = src.split("/").pop();
    const optimizedCdnImageUrl = process.env.NEXT_PUBLIC_BUNNY_CDN_URL + imagePath + "?width=" + width;
    return optimizedCdnImageUrl;
  }
};
