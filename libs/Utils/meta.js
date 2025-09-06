// meta.js

const defaultTitle = "Peduli Bangsa - Coming Soon";
const defaultDescription =
  "Peduli Bangsa adalah organisasi sosial kemanusiaan di Brebes, Jawa Tengah. Website resmi sedang dalam pembangunan.";
const defaultKeywords =
  "peduli bangsa, organisasi sosial, kemanusiaan, brebes, jawa tengah, bantuan, relawan";
const defaultRobots = "index, follow";
const defaultURL = "https://pedulibangsa.web.id/";

/**
 * Generate SEO, Open Graph, and Twitter meta tags
 * @param {Object} param
 * @param {string} param.title
 * @param {string} param.description
 * @param {string} param.keywords
 * @param {string} param.robots
 * @param {string} param.url
 * @returns {Object} meta tags grouped by type
 */
const meta = async ({
  title = defaultTitle,
  description = defaultDescription,
  keywords = defaultKeywords,
  robots = defaultRobots,
  url = defaultURL,
} = {}) => {
  const seoMetaTags = {
    title,
    description,
    keywords,
    robots,
  };

  const ogTags = {
    title,
    description,
    type: "website",
    url,
  };

  const twitterTags = {
    card: "summary",
    title,
    description,
  };

  return { seoMetaTags, ogTags, twitterTags };
};

/**
 * Generate dynamic description
 * @param {Object} data
 * @param {string} data.title
 * @param {string} data.content
 */
const generateDescription = (data = {}) => {
  try {
    const title = data.title || defaultTitle;
    const content = data.content?.split(".")[0] || defaultDescription;
    return `${title} - ${content}`;
  } catch (err) {
    console.error("generateDescription error:", err);
    return defaultDescription;
  }
};

/**
 * Generate dynamic keywords
 * @param {Object} data
 * @param {string} data.tag
 * @param {string} data.content
 */
const generateKeywords = (data = {}) => {
  try {
    const tag = data.tag || "";
    const content = data.content || "";
    return `${tag}, ${content}`.toLowerCase() || defaultKeywords;
  } catch (err) {
    console.error("generateKeywords error:", err);
    return defaultKeywords;
  }
};

/**
 * Generate robots meta tag
 * @param {Object} data
 * @param {string} data.robots
 */
const generateRobots = (data = {}) => {
  try {
    return data.robots || defaultRobots;
  } catch (err) {
    console.error("generateRobots error:", err);
    return defaultRobots;
  }
};

/**
 * Generate page title
 * @param {Object} data
 * @param {string} data.title
 */
const generateTitle = (data = {}) => {
  try {
    return data.title || defaultTitle;
  } catch (err) {
    console.error("generateTitle error:", err);
    return defaultTitle;
  }
};

/**
 * Generate canonical URL
 * @param {Object} data
 * @param {string} data.url
 */
const generateURL = (data = {}) => {
  try {
    return data.url || defaultURL;
  } catch (err) {
    console.error("generateURL error:", err);
    return defaultURL;
  }
};

module.exports = {
  meta,
  generateTitle,
  generateDescription,
  generateKeywords,
  generateRobots,
  generateURL,
};
