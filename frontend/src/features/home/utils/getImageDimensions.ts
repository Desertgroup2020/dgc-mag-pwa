interface ImageDimensions {
  width: number;
  height: number;
}

export const getImageDimensions = (imageUrl: string): Promise<ImageDimensions> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => reject(new Error("Error loading image"));
    img.src = imageUrl;
  });
};
