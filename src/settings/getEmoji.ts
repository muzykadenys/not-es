import emojiData from "./allEmojiData.json";

export const getRandEmoji = () => {
  const randomEmoji =
    emojiData.data[Math.floor(Math.random() * emojiData.data.length)];

  return randomEmoji;
};
