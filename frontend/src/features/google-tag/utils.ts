export const sendGTMEvent = (eventName: string, eventParams?: object) => {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({ event: eventName, ...eventParams });
  }
};
