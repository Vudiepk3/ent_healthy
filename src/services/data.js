import { LOCAL_URLS, REMOTE_URLS } from '../config/site.js';

export async function fetchJson(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`${url} returned ${response.status}`);
    }

    return response.json();
}

export async function loadSiteData() {
    let videos;
    let news;
    let products;

    try {
        videos = await fetchJson(LOCAL_URLS.videos);
        news = await fetchJson(LOCAL_URLS.news);
        products = await fetchJson(LOCAL_URLS.products);
    } catch (localError) {
        console.warn('Local JSON data failed, falling back to remote:', localError.message);
        videos = await fetchJson(REMOTE_URLS.videos);
        news = await fetchJson(REMOTE_URLS.news);
        products = await fetchJson(REMOTE_URLS.products);
    }

    return {
        videos: normalizeCollection(videos, 'videos'),
        news: normalizeCollection(news, 'news'),
        products: normalizeCollection(products, 'products')
    };
}

function normalizeCollection(collection, key) {
    if (collection && typeof collection === 'object' && !Array.isArray(collection)) {
        return collection.data || collection[key] || Object.values(collection);
    }

    return Array.isArray(collection) ? collection : [];
}
