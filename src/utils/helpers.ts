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

export const nowInSeconds = (): string => {
  const now = new Date();
  return Math.floor(now.getTime()).toString();
};

export const parseContent = (content: string | undefined) => {
  if (content) {
    try {
      return JSON.parse(content);
    } catch (e) {
      console.log("err", e);
      return;
    }
  }
};
