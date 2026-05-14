import { HOME_TABS } from '../config/site.js';

export function generateSlug(title) {
    const slug = String(title || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[\u0111\u0110]/g, 'd')
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    return slug || 'content';
}

export function getIdFromSlug(slug = window.location.pathname) {
    const queryId = new URLSearchParams(window.location.search).get('id');

    if (queryId) {
        return queryId;
    }

    const cleanSlug = String(slug)
        .split('?')[0]
        .split('#')[0]
        .split('/')
        .filter(Boolean)
        .pop() || '';

    const match = cleanSlug.match(/-([^-]+)$/) || cleanSlug.match(/^([^-]+)$/);
    return match ? decodeURIComponent(match[1]) : null;
}

export function getVideoPath(title, id) {
    const params = new URLSearchParams({
        id: String(id),
        slug: generateSlug(title)
    });

    return `/video.html?${params.toString()}`;
}

export function getNewsPath(title, id) {
    const params = new URLSearchParams({
        id: String(id),
        slug: generateSlug(title)
    });

    return `/news.html?${params.toString()}`;
}

export function getHomeUrl(tab = 'videos') {
    return tab && tab !== 'videos' ? `/?section=${encodeURIComponent(tab)}` : '/';
}

export function getPageType() {
    const path = window.location.pathname;
    const declaredPage = document.body?.dataset?.page;

    if (path.startsWith('/video/') || path.endsWith('/video.html') || declaredPage === 'video-detail') {
        return 'video-detail';
    }

    if (path.startsWith('/news/') || path.endsWith('/news.html') || declaredPage === 'news-detail') {
        return 'news-detail';
    }

    return 'home';
}

export function getInitialHomeTab() {
    const tab = new URLSearchParams(window.location.search).get('section');
    return HOME_TABS.includes(tab) ? tab : 'videos';
}

export function getEmbedUrl(url) {
    if (!url) return '';

    try {
        const parsedUrl = new URL(url);
        const host = parsedUrl.hostname.replace(/^www\./, '');

        if (host === 'youtu.be') {
            return `https://www.youtube-nocookie.com/embed/${parsedUrl.pathname.split('/').filter(Boolean)[0]}`;
        }

        if (host.includes('youtube.com')) {
            const watchId = parsedUrl.searchParams.get('v');
            const embedId = parsedUrl.pathname.split('/').filter(Boolean).pop();
            return `https://www.youtube-nocookie.com/embed/${watchId || embedId}`;
        }
    } catch (error) {
        console.warn('Invalid video URL:', url, error);
    }

    const videoId = String(url).split('v=')[1]?.split('&')[0]
        || String(url).split('/').pop();

    return `https://www.youtube-nocookie.com/embed/${videoId}`;
}

export function getRelatedItems(items, currentItem) {
    const sameCategory = items.filter(item =>
        String(item.id) !== String(currentItem.id) &&
        item.category === currentItem.category
    );

    const fallback = items.filter(item => String(item.id) !== String(currentItem.id));
    return (sameCategory.length > 0 ? sameCategory : fallback).slice(0, 12);
}

export function renderArticleText(text) {
    const cleanText = String(text || '').trim();

    if (!cleanText) {
        return `
            <p class="text-gray-600 leading-relaxed text-lg">
                This educational content is part of the ENT Health Hub medical education library.
            </p>
        `;
    }

    return cleanText
        .split(/\n{2,}/)
        .map(paragraph => `
            <p class="text-gray-600 leading-relaxed text-lg">
                ${escapeHtml(paragraph).replace(/\n/g, '<br>')}
            </p>
        `)
        .join('');
}

export function truncateText(text, maxLength) {
    const cleanText = String(text || '')
        .replace(/\s+/g, ' ')
        .trim();

    if (cleanText.length <= maxLength) return cleanText;

    return `${cleanText.slice(0, maxLength - 1).trim()}...`;
}

export function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export function escapeAttr(value) {
    return escapeHtml(value);
}

export function inlineString(value) {
    return JSON.stringify(String(value ?? ''))
        .replace(/'/g, '\\u0027')
        .replace(/&/g, '\\u0026')
        .replace(/</g, '\\u003C')
        .replace(/>/g, '\\u003E');
}

export function createLucideIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}
