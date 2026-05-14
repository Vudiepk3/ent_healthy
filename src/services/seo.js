import { HOME_DESCRIPTION, SITE_NAME } from '../config/site.js';
import { getEmbedUrl, truncateText } from '../utils/site.js';

export function updateHomeSeo(tab = 'videos') {
    const seoByTab = {
        videos: {
            title: `${SITE_NAME} - Medical Education Center`,
            description: HOME_DESCRIPTION,
            canonicalUrl: `${window.location.origin}/`
        },
        news: {
            title: `Medical News | ${SITE_NAME}`,
            description: 'Stay updated with medical breakthroughs and research in ENT.',
            canonicalUrl: `${window.location.origin}/?section=news`
        },
        saved: {
            title: `Saved Videos | ${SITE_NAME}`,
            description: 'Saved ENT educational videos from ENT Health Hub.',
            canonicalUrl: `${window.location.origin}/?section=saved`
        },
        products: {
            title: `Recommended Products | ${SITE_NAME}`,
            description: 'Recommended products for ENT care.',
            canonicalUrl: `${window.location.origin}/?section=products`
        }
    };

    const seo = seoByTab[tab] || seoByTab.videos;

    updateSeo({
        ...seo,
        type: 'website',
        schema: {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: SITE_NAME,
            url: `${window.location.origin}/`,
            description: HOME_DESCRIPTION
        }
    });
}

export function updateArticleSeo({ title, description, category, publishDate, image, canonicalPath, articleBody, videoUrl }) {
    const canonicalUrl = `${window.location.origin}${canonicalPath}`;
    const cleanDescription = truncateText(description || articleBody || HOME_DESCRIPTION, 170);
    const fullTitle = `${title} | ${SITE_NAME}`;
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: cleanDescription,
        mainEntityOfPage: canonicalUrl,
        articleSection: category || 'Medical Education',
        author: {
            '@type': 'Organization',
            name: SITE_NAME
        },
        publisher: {
            '@type': 'Organization',
            name: SITE_NAME
        }
    };

    if (publishDate) {
        schema.datePublished = publishDate;
        schema.dateModified = publishDate;
    }

    if (image) {
        schema.image = [image];
    }

    if (videoUrl) {
        schema.associatedMedia = {
            '@type': 'VideoObject',
            name: title,
            description: cleanDescription,
            embedUrl: getEmbedUrl(videoUrl),
            uploadDate: publishDate || undefined
        };
    }

    updateSeo({
        title: fullTitle,
        description: cleanDescription,
        canonicalUrl,
        image,
        type: 'article',
        publishedTime: publishDate,
        section: category,
        schema
    });
}

export function updateSeo({ title, description, canonicalUrl, image, type = 'website', publishedTime, section, schema }) {
    const cleanDescription = truncateText(description || HOME_DESCRIPTION, 170);
    const cleanTitle = title || `${SITE_NAME} - Medical Education Center`;

    document.title = cleanTitle;

    setMetaName('description', cleanDescription);
    setMetaName('robots', 'index, follow');
    setCanonical(canonicalUrl || window.location.href);

    setMetaProperty('og:type', type);
    setMetaProperty('og:title', cleanTitle);
    setMetaProperty('og:description', cleanDescription);
    setMetaProperty('og:url', canonicalUrl || window.location.href);
    setMetaProperty('og:site_name', SITE_NAME);

    if (image) {
        setMetaProperty('og:image', image);
        setMetaName('twitter:image', image);
    }

    if (publishedTime) {
        setMetaProperty('article:published_time', publishedTime);
        setMetaProperty('article:modified_time', publishedTime);
    }

    if (section) {
        setMetaProperty('article:section', section);
    }

    setMetaName('twitter:card', image ? 'summary_large_image' : 'summary');
    setMetaName('twitter:title', cleanTitle);
    setMetaName('twitter:description', cleanDescription);
    setStructuredData(schema);
}

function setCanonical(url) {
    let canonical = document.querySelector('link[rel="canonical"]');

    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
    }

    canonical.setAttribute('href', url);
}

function setMetaName(name, content) {
    setMeta(`meta[name="${name}"]`, 'name', name, content);
}

function setMetaProperty(property, content) {
    setMeta(`meta[property="${property}"]`, 'property', property, content);
}

function setMeta(selector, attrName, attrValue, content) {
    if (!content) return;

    let meta = document.querySelector(selector);

    if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attrName, attrValue);
        document.head.appendChild(meta);
    }

    meta.setAttribute('content', content);
}

function setStructuredData(schema) {
    if (!schema) return;

    let script = document.getElementById('structured-data');

    if (!script) {
        script = document.createElement('script');
        script.id = 'structured-data';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(schema);
}
