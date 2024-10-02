export const postData = async (url = "", data = {}) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (e) {
    console.log("error", e);
    return e;
  }
};

export const addParsedContent = (
  content: string
): { missionStatement: string; projectDetails: string } | undefined => {
  try {
    const obj = JSON.parse(content);
    return obj;
  } catch (e) {
    console.log("err", e);
    return;
  }
};

export const nowInSeconds = (): string => {
  const now = new Date();
  return Math.floor(now.getTime()).toString();
};
