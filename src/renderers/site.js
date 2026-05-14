import { DETAIL_AD_CLIENT, DETAIL_AD_SLOT, SITE_NAME } from '../config/site.js';
import { updateSeo } from '../services/seo.js';
import {
    createLucideIcons,
    escapeAttr,
    escapeHtml,
    getEmbedUrl,
    getNewsPath,
    getRelatedItems,
    getVideoPath,
    inlineString,
    renderArticleText
} from '../utils/site.js';

export function renderCategories({ videos, filterCategory }) {
    const container = document.getElementById('category-filters');

    if (!container) return;

    const categories = [
        'All',
        ...new Set(
            videos
                .map(video => String(video.category || '').trim())
                .filter(Boolean)
        )
    ];

    container.innerHTML = categories.map(category => {
        const isActive = filterCategory.toLowerCase().trim() === category.toLowerCase().trim();

        return `
            <button
                onclick='setCategory(${inlineString(category)})'
                class="px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive
                ? 'bg-[#2F80ED] text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-[#2F80ED]'
            }">
                ${escapeHtml(category)}
            </button>
        `;
    }).join('');

    requestAnimationFrame(createLucideIcons);
}

export function renderVideos({ videos, filterCategory, searchQuery, savedVideos }) {
    const grid = document.getElementById('video-grid');

    if (!grid) return;

    const filteredVideos = videos.filter(video => {
        const videoCategory = String(video.category || '').trim().toLowerCase();
        const currentCategory = String(filterCategory || '').trim().toLowerCase();
        const matchesCategory = currentCategory === 'all' || videoCategory === currentCategory;
        const title = String(video.title || '').toLowerCase();
        const description = String(video.description || '').toLowerCase();
        const matchesSearch = title.includes(searchQuery) || description.includes(searchQuery);

        return matchesCategory && matchesSearch;
    });

    if (filteredVideos.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-20 text-gray-400">
                No videos found.
            </div>
        `;
        return;
    }

    grid.innerHTML = filteredVideos
        .map(video => createVideoCard(video, savedVideos))
        .join('');

    requestAnimationFrame(createLucideIcons);
}

export function createVideoCard(video, savedVideos) {
    const isSaved = savedVideos.includes(String(video.id));
    const title = video.title || 'No Title';
    const description = video.description || 'No description';
    const videoPath = getVideoPath(title, video.id);

    return `
        <div class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group border border-gray-50 flex flex-col h-full">
            <div class="p-5 flex-1 flex flex-col space-y-3">
                <div class="flex gap-2">
                    <span class="px-2 py-0.5 bg-blue-50 text-[#2F80ED] text-[10px] font-bold uppercase rounded tracking-wide">
                        ${escapeHtml(video.category || 'Uncategorized')}
                    </span>
                </div>

                <a href="${escapeAttr(videoPath)}"
                    onclick='event.preventDefault(); goToVideo(${inlineString(title)}, ${inlineString(video.id)})'
                    class="font-bold text-lg leading-tight line-clamp-2 group-hover:text-[#2F80ED] transition-colors cursor-pointer">
                    ${escapeHtml(video.id)}. ${escapeHtml(title)}
                </a>

                <p class="text-sm text-gray-500 line-clamp-2">
                    ${escapeHtml(description)}
                </p>

                <div class="flex items-center justify-between pt-2 border-t border-gray-50 mt-auto">
                    <div class="flex items-center gap-2">
                        <i data-lucide="check-circle" class="w-4 h-4 text-[#27AE60]"></i>
                        <span class="text-[11px] font-semibold text-gray-400">Verified</span>
                    </div>

                    <button onclick="toggleSave('${escapeAttr(video.id)}')"
                        class="p-1 px-2 rounded-lg ${isSaved ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'} transition-colors">
                        <i data-lucide="heart" class="w-4 h-4" ${isSaved ? 'fill="red"' : ''}></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

export function renderSaved({ videos, savedVideos }) {
    const grid = document.getElementById('saved-grid');

    if (!grid) return;

    const saved = videos.filter(video => savedVideos.includes(String(video.id)));

    grid.innerHTML = saved.length === 0
        ? '<div class="col-span-full py-20 text-center text-gray-400">No saved videos yet.</div>'
        : saved.map(video => createVideoCard(video, savedVideos)).join('');

    createLucideIcons();
}

export function renderNews(news) {
    const container = document.getElementById('news-container');

    if (!container) return;

    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${news.map(createNewsCard).join('')}
        </div>
    `;
}

function createNewsCard(article) {
    const title = article.title || 'No Title';
    const description = article.description || 'No description';
    const newsPath = getNewsPath(title, article.id);

    return `
        <a href="${escapeAttr(newsPath)}"
            onclick='event.preventDefault(); goToNews(${inlineString(title)}, ${inlineString(article.id)})'
            class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50 group hover:border-[#2F80ED]/30 transition-all cursor-pointer">

            <div class="aspect-video overflow-hidden">
                <img src="${escapeAttr(article.image || '')}"
                    alt="${escapeAttr(title)}"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            </div>

            <div class="p-5">
                <div class="text-[10px] font-bold text-[#27AE60] uppercase mb-2">
                    ${escapeHtml(article.category || 'Medical News')}
                </div>

                <h4 class="font-bold text-lg mb-3 group-hover:text-[#2F80ED] transition-colors">
                    ${escapeHtml(title)}
                </h4>

                <p class="text-sm text-gray-500 leading-relaxed line-clamp-3">
                    ${escapeHtml(description)}
                </p>

                <div class="mt-4 text-xs font-semibold text-gray-400">
                    ${escapeHtml(article.publishDate || '')}
                </div>
            </div>
        </a>
    `;
}

export function renderProducts(products) {
    const container = document.getElementById('products-container');

    if (!container) return;

    if (!products || products.length === 0) {
        container.innerHTML = '<div class="col-span-full text-center text-gray-400">No products available.</div>';
        return;
    }

    const groupedProducts = products.reduce((groups, product) => {
        const category = product.category || 'Recommended Products';
        groups[category] = groups[category] || [];
        groups[category].push(product);
        return groups;
    }, {});

    container.innerHTML = Object.entries(groupedProducts)
        .map(([category, categoryProducts]) => `
            <div class="space-y-4">
                <h3 class="text-xl font-bold text-[#1F2D3D] mb-4">${escapeHtml(category)}</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${categoryProducts.map(createProductCard).join('')}
                </div>
            </div>
        `)
        .join('');

    createLucideIcons();
}

function createProductCard(product) {
    return `
        <a href="${escapeAttr(product.url || '#')}" target="_blank" rel="noopener noreferrer" class="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#FF6B6B]/50 hover:shadow-lg transition-all group">
            <div class="flex-1">
                <h4 class="font-bold text-lg text-[#1F2D3D] group-hover:text-[#FF6B6B] transition-colors">${escapeHtml(product.name || 'Product')}</h4>
                <p class="text-sm text-gray-500 mt-1 mb-3">${escapeHtml(product.description || 'Recommended product')}</p>
                <div class="flex items-center justify-between">
                    <span class="px-2 py-1 bg-red-50 text-[#FF6B6B] text-[10px] font-bold uppercase rounded tracking-wide">Buy on Amazon</span>
                    <i data-lucide="external-link" class="w-4 h-4 text-gray-400 group-hover:text-[#FF6B6B]"></i>
                </div>
            </div>
        </a>
    `;
}

export function renderVideoDetail(video, videos) {
    const container = document.getElementById('video-detail-content');

    if (!container) return;

    const relatedVideos = getRelatedItems(videos, video);

    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div class="lg:col-span-2 space-y-6">
                <div id="video-player-top" class="video-box">
                    <div class="video-wrapper" style="aspect-ratio:16/9;width:100%;border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
                        <iframe
                            src="${escapeAttr(getEmbedUrl(video.videoUrl))}"
                            title="${escapeAttr(video.id + '. ' + video.title || 'ENT video')}"
                            style="width:100%;height:100%;border:none;"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen>
                        </iframe>
                    </div>

                    <div style="text-align:center;margin-top:15px;">
                        <a href="${escapeAttr(video.videoUrl || '#')}"
                            target="_blank"
                            rel="noopener noreferrer"
                            style="color:#6b7280;text-decoration:none;font-size:14px;">
                            Can't embed? Watch directly on YouTube
                        </a>
                    </div>
                </div>

                ${detailAdSlot()}

                <article class="space-y-4">
                    <div class="flex flex-wrap items-center gap-3">
                        <span class="px-3 py-1 bg-blue-50 text-[#2F80ED] text-[11px] font-bold uppercase rounded-full inline-block">
                            ${escapeHtml(video.category || 'ENT Video')}
                        </span>
                        ${video.publishDate ? `<span class="text-xs font-semibold text-gray-400">${escapeHtml(video.publishDate)}</span>` : ''}
                    </div>

                    <h1 class="text-3xl font-bold leading-tight">
                        ${escapeHtml(video.id)}. ${escapeHtml(video.title || 'No Title')}
                    </h1>

                    <p class="text-gray-600 leading-relaxed text-lg">
                        ${escapeHtml(video.description || 'No description')}
                    </p>

                </article>
            </div>

            <aside class="space-y-6">
                <h3 class="font-bold text-lg">Related Videos</h3>
                <div class="space-y-4 max-h-[800px] overflow-y-auto pr-2">
                    ${relatedVideos.map(createRelatedVideoLink).join('')}
                </div>
            </aside>
        </div>
    `;

    createLucideIcons();
}

function createRelatedVideoLink(video) {
    const path = getVideoPath(video.title, video.id);

    return `
        <a href="${escapeAttr(path)}"
            onclick='event.preventDefault(); goToVideo(${inlineString(video.title)}, ${inlineString(video.id)})'
            class="block p-3 rounded-2xl cursor-pointer transition-all border bg-white border-gray-100 hover:bg-gray-50 hover:border-[#2F80ED]/30">
            <span class="text-[10px] font-bold uppercase text-[#2F80ED]">
                ${escapeHtml(video.category || 'ENT Video')}
            </span>
            <h5 class="text-sm font-bold line-clamp-2 mt-1">
                ${escapeHtml(video.id + '. ' + video.title || 'No Title')}
            </h5>
        </a>
    `;
}

export function renderNewsDetail(article, news) {
    const container = document.getElementById('news-detail-content');

    if (!container) return;

    const relatedArticles = getRelatedItems(news, article);

    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <article class="lg:col-span-2 space-y-6">
                <div class="w-full rounded-3xl overflow-hidden shadow-xl">
                    <img src="${escapeAttr(article.image || '')}" alt="${escapeAttr(article.title || 'Medical news')}" class="w-full h-auto">
                </div>

                ${detailAdSlot()}

                <div>
                    <span class="px-3 py-1 bg-green-50 text-[#27AE60] text-[10px] font-bold uppercase rounded tracking-wide inline-block mb-4">
                        ${escapeHtml(article.category || 'Medical News')}
                    </span>

                    <h1 class="text-3xl font-bold mb-2">
                        ${escapeHtml(article.title || 'No Title')}
                    </h1>

                    <p class="text-sm text-gray-400">
                        ${escapeHtml(article.publishDate || '')}
                    </p>
                </div>

                <div class="text-gray-600 leading-relaxed text-lg space-y-5">
                    ${renderArticleText(article.content || article.article || article.description)}
                </div>
            </article>

            <aside class="space-y-6">
                <h3 class="font-bold text-lg">Related Articles</h3>
                <div class="space-y-4 max-h-[800px] overflow-y-auto pr-2">
                    ${relatedArticles.map(createRelatedNewsLink).join('')}
                </div>
            </aside>
        </div>
    `;

    createLucideIcons();
}

function createRelatedNewsLink(article) {
    const path = getNewsPath(article.title, article.id);

    return `
        <a href="${escapeAttr(path)}"
            onclick='event.preventDefault(); goToNews(${inlineString(article.title)}, ${inlineString(article.id)})'
            class="block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:bg-gray-50 hover:border-[#2F80ED]/30 transition-all">
            <div class="aspect-video overflow-hidden">
                <img src="${escapeAttr(article.image || '')}" alt="${escapeAttr(article.title || 'Medical news')}" class="w-full h-full object-cover">
            </div>
            <div class="p-3">
                <span class="text-[10px] font-bold uppercase text-[#27AE60]">
                    ${escapeHtml(article.category || 'Medical News')}
                </span>
                <h5 class="text-sm font-bold line-clamp-2 mt-1">
                    ${escapeHtml(article.title || 'No Title')}
                </h5>
                <p class="text-xs font-semibold text-gray-400 mt-2">
                    ${escapeHtml(article.publishDate || '')}
                </p>
            </div>
        </a>
    `;
}

export function renderNotFound(type, id) {
    const section = type === 'news' ? 'news-detail' : 'detail';
    const container = document.getElementById(type === 'news' ? 'news-detail-content' : 'video-detail-content');

    document.querySelectorAll('main > section').forEach(sectionElement => {
        sectionElement.classList.add('hidden');
    });
    document.getElementById(`section-${section}`)?.classList.remove('hidden');

    if (container) {
        container.innerHTML = `
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center max-w-2xl mx-auto">
                <h1 class="text-3xl font-bold text-[#1F2D3D] mb-3">Content not found</h1>
                <p class="text-gray-500 mb-6">We could not find ${escapeHtml(type)} item ${escapeHtml(id || '')}.</p>
                <a href="/" class="inline-flex items-center justify-center px-5 py-2 bg-[#2F80ED] text-white rounded-full font-medium">
                    Back to homepage
                </a>
            </div>
        `;
    }

    updateSeo({
        title: `Content not found | ${SITE_NAME}`,
        description: 'The requested ENT Health Hub page could not be found.',
        canonicalUrl: window.location.href,
        type: 'website'
    });
}

function detailAdSlot() {
    return `
        <div class="my-6">
            <ins class="adsbygoogle"
                style="display:block"
                data-ad-client="${DETAIL_AD_CLIENT}"
                data-ad-slot="${DETAIL_AD_SLOT}"
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
        </div>
    `;
}
