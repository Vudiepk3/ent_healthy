import { DEFAULT_IMAGE, HOME_TABS, PAYPAL_ACCOUNT } from './config/site.js';
import { loadSiteData } from './services/data.js';
import {
    renderCategories,
    renderNews,
    renderNewsDetail,
    renderNotFound,
    renderProducts,
    renderSaved,
    renderVideoDetail,
    renderVideos
} from './renderers/site.js';
import { updateArticleSeo, updateHomeSeo } from './services/seo.js';
import {
    createLucideIcons,
    generateSlug,
    getHomeUrl,
    getIdFromSlug,
    getInitialHomeTab,
    getNewsPath,
    getPageType,
    getVideoPath
} from './utils/site.js';

const state = {
    videos: [],
    news: [],
    products: [],
    filterCategory: 'All',
    searchQuery: '',
    savedVideos: readSavedVideos()
};

document.addEventListener('DOMContentLoaded', init);

async function init() {
    registerGlobals();
    setPayPalAccount(PAYPAL_ACCOUNT);
    createLucideIcons();
    setupEventListeners();

    try {
        Object.assign(state, await loadSiteData());
        initializePage();
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Failed to load data. Check console for details. Error: ' + error.message);
    }
}

function initializePage() {
    const pageType = getPageType();

    if (pageType === 'video-detail') {
        renderVideoDetailFromUrl();
        return;
    }

    if (pageType === 'news-detail') {
        renderNewsDetailFromUrl();
        return;
    }

    renderHomePage();
}

function renderHomePage() {
    renderCategories({
        videos: state.videos,
        filterCategory: state.filterCategory
    });
    renderVideos(getVideoRenderState());
    renderNews(state.news);
    renderProducts(state.products);
    navigate(getInitialHomeTab());
}

function setupEventListeners() {
    const searchInput = document.getElementById('global-search');

    if (!searchInput) return;

    searchInput.addEventListener('input', event => {
        state.searchQuery = event.target.value.toLowerCase();
        renderVideos(getVideoRenderState());
    });
}

function navigate(tab) {
    if (getPageType() !== 'home' && HOME_TABS.includes(tab)) {
        goHome(tab);
        return;
    }

    const targetSection = document.getElementById(`section-${tab}`);

    if (!targetSection) {
        if (HOME_TABS.includes(tab)) {
            goHome(tab);
        }
        return;
    }

    document.querySelectorAll('main > section').forEach(section => {
        section.classList.add('hidden');
    });

    targetSection.classList.remove('hidden');
    updateNavState(tab);
    updateHeaderVisibility(tab);

    if (tab === 'saved') {
        state.savedVideos = readSavedVideos();
        renderSaved({
            videos: state.videos,
            savedVideos: state.savedVideos
        });
    }

    if (getPageType() === 'home') {
        updateHomeSeo(tab);
    }

    createLucideIcons();
}

function updateNavState(tab) {
    document.querySelectorAll('nav button').forEach(button => {
        button.classList.remove('text-[#2F80ED]', 'border-[#2F80ED]', 'border-b-2');
        button.classList.add('text-gray-500');
    });

    const activeNav = document.getElementById(`nav-${tab}`);

    if (!activeNav) return;

    activeNav.classList.add('text-[#2F80ED]', 'border-[#2F80ED]', 'border-b-2');
    activeNav.classList.remove('text-gray-500');
}

function updateHeaderVisibility(tab) {
    const header = document.querySelector('header');

    if (!header) return;

    header.classList.toggle('hidden', tab === 'detail' || tab === 'news-detail');
}

function renderVideoDetailFromUrl() {
    navigate('detail');

    const id = getIdFromSlug();
    const video = findById(state.videos, id);

    if (!video) {
        renderNotFound('video', id);
        return;
    }

    renderVideoDetail(video, state.videos);
    updateArticleSeo({
        title: video.title || 'ENT Video',
        description: video.description || `${video.title || 'ENT video'} from ENT Health Hub.`,
        category: video.category,
        publishDate: video.publishDate,
        image: video.image || DEFAULT_IMAGE,
        canonicalPath: getVideoPath(video.title, video.id),
        articleBody: video.description,
        videoUrl: video.videoUrl
    });
}

function renderNewsDetailFromUrl() {
    navigate('news-detail');

    const id = getIdFromSlug();
    const article = findById(state.news, id);

    if (!article) {
        renderNotFound('news', id);
        return;
    }

    renderNewsDetail(article, state.news);
    updateArticleSeo({
        title: article.title || 'Medical News',
        description: article.description || `${article.title || 'Medical news'} from ENT Health Hub.`,
        category: article.category,
        publishDate: article.publishDate,
        image: article.image || DEFAULT_IMAGE,
        canonicalPath: getNewsPath(article.title, article.id),
        articleBody: article.description
    });
}

function setCategory(category) {
    state.filterCategory = category;
    renderCategories({
        videos: state.videos,
        filterCategory: state.filterCategory
    });
    renderVideos(getVideoRenderState());
}

function toggleSave(id) {
    const videoId = String(id);

    state.savedVideos = state.savedVideos.includes(videoId)
        ? state.savedVideos.filter(savedId => savedId !== videoId)
        : [...state.savedVideos, videoId];

    writeSavedVideos(state.savedVideos);
    renderVideos(getVideoRenderState());
    renderSaved({
        videos: state.videos,
        savedVideos: state.savedVideos
    });
}

function viewDetail(id) {
    const video = findById(state.videos, id);

    if (!video) {
        console.error('Video not found:', id);
        return;
    }

    goToVideo(video.title, video.id);
}

function viewNewsDetail(id) {
    const article = findById(state.news, id);

    if (!article) {
        console.error('News item not found:', id);
        return;
    }

    goToNews(article.title, article.id);
}

function goToVideo(title, id) {
    window.location.href = getVideoPath(title, id);
}

function goToNews(title, id) {
    window.location.href = getNewsPath(title, id);
}

function goHome(tab = 'videos') {
    window.location.href = getHomeUrl(tab);
}

function openDonateModal() {
    document.getElementById('donate-modal')?.classList.add('active');
    createLucideIcons();
}

function closeDonateModal() {
    document.getElementById('donate-modal')?.classList.remove('active');
}

function copyPayPal() {
    const account = document.getElementById('paypal-account')?.textContent;

    if (!account) return;

    navigator.clipboard.writeText(account).then(() => {
        alert('Copied to clipboard: ' + account);
    });
}

function setPayPalAccount(account) {
    const accountElement = document.getElementById('paypal-account');
    const linkElement = document.getElementById('paypal-link');

    if (accountElement) {
        accountElement.textContent = account;
    }

    if (linkElement) {
        linkElement.href = `https://paypal.me/${account.split('@')[0]}`;
    }
}

function getVideoRenderState() {
    return {
        videos: state.videos,
        filterCategory: state.filterCategory,
        searchQuery: state.searchQuery,
        savedVideos: state.savedVideos
    };
}

function findById(items, id) {
    return items.find(item => String(item.id) === String(id));
}

function readSavedVideos() {
    try {
        return JSON.parse(localStorage.getItem('ent_saved') || '[]');
    } catch {
        return [];
    }
}

function writeSavedVideos(savedVideos) {
    localStorage.setItem('ent_saved', JSON.stringify(savedVideos));
}

function registerGlobals() {
    Object.assign(window, {
        navigate,
        generateSlug,
        getIdFromSlug,
        goToVideo,
        goToNews,
        goHome,
        viewDetail,
        viewNewsDetail,
        setCategory,
        toggleSave,
        openDonateModal,
        closeDonateModal,
        copyPayPal
    });
}
