const PORT = +process.env.PORT || 3000;
const HOST = process.env.HOST || `localhost:3000`;
const SESSION_SECRET = process.env.SESSION_SECRET;
const SESSION_NAME = process.env.SESSION_NAME;
const DB_HOST = process.env.DB_HOST || `mongodb://localhost:27017`;
const DB_NAME = process.env.DB_NAME || `quiz`;
const FB_APP_ID = process.env.FB_APP_ID || `1749739928442230`;
const VK_APP_ID = process.env.VK_APP_ID || `6633717`;

const getImageRef = (imgFileName) => {
  return (imgFileName) ? `/img/${imgFileName}` : null;
};

const getPassUrl = (permalink, id) => {
  return `${getTestLinkUrl(permalink)}/${id}`;
};

const getImageUrl = (imgFileName) => {
  const imageRef = getImageRef(imgFileName);

  return (imageRef) ? `https://${HOST}${imageRef}` : null;
};

const getTestLinkRef = (linkName) => {
  return (linkName) ? `/links/${linkName}` : null;
};

const getTestLinkUrl = (linkName) => {
  return `https://${HOST}${getTestLinkRef(linkName)}`;
};

module.exports = {
  DB_HOST,
  DB_NAME,
  SESSION_SECRET,
  SESSION_NAME,
  PORT,
  HOST,
  getImageRef,
  getImageUrl,
  getTestLinkRef,
  getTestLinkUrl,
  FB_APP_ID,
  VK_APP_ID,
  getPassUrl
};
