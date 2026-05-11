// Data URLs
const LOCAL_URLS = {
    videos: 'src/data/videos.json',
    news: 'src/data/news.json',
    products: 'src/data/products.json'
};

const REMOTE_URLS = {
    videos: 'https://raw.githubusercontent.com/Vudiepk3/Test_MockAPI/main/data/json/videos.json',
    news: 'https://raw.githubusercontent.com/Vudiepk3/Test_MockAPI/main/data/json/news.json',
    products: 'https://raw.githubusercontent.com/Vudiepk3/Test_MockAPI/main/data/json/products.json'
};

// Data
let videos = [];
let news = [];
let products = [];
let paypalAccount = 'hicau'; // Will be updated later

// State
let currentTab = 'videos';
let filterCategory = 'All';
let searchQuery = '';
let savedVideos = JSON.parse(localStorage.getItem('ent_saved') || '[]');

// Functions
async function fetchJson(url) {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`${url} returned ${res.status}`);
    }
    return res.json();
}

async function loadData() {
    try {
        // Attempt local data first, then fallback to remote if needed.
        try {
            videos = await fetchJson(LOCAL_URLS.videos);
            news = await fetchJson(LOCAL_URLS.news);
            products = await fetchJson(LOCAL_URLS.products);
            console.log('Loaded local JSON data.');
        } catch (localError) {
            console.warn('Local JSON data failed, falling back to remote:', localError.message);
            videos = await fetchJson(REMOTE_URLS.videos);
            news = await fetchJson(REMOTE_URLS.news);
            products = await fetchJson(REMOTE_URLS.products);
            console.log('Loaded remote JSON data.');
        }

        // Handle if data is wrapped in an object
        if (videos && typeof videos === 'object' && !Array.isArray(videos)) {
            videos = videos.data || videos.videos || Object.values(videos);
        }
        if (news && typeof news === 'object' && !Array.isArray(news)) {
            news = news.data || news.news || Object.values(news);
        }
        if (products && typeof products === 'object' && !Array.isArray(products)) {
            products = products.data || products.products || Object.values(products);
        }

        console.log('Videos length:', videos.length);
        console.log('News length:', news.length);

        renderCategories();
        renderVideos();
        renderNews();
        renderProducts();
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Failed to load data. Check console for details. Error: ' + error.message);
    }
}

function setupEventListeners() {
    document.getElementById('global-search').addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderVideos();
    });
}

async function init() {
    setPayPalAccount(paypalAccount);
    lucide.createIcons();
    setupEventListeners();

    // Load and render data
    await loadData();
}

function navigate(tab) {
    currentTab = tab;

    document.querySelectorAll('main > section')
        .forEach(s => s.classList.add('hidden'));

    document.getElementById(`section-${tab}`)
        .classList.remove('hidden');

    document.querySelectorAll('nav button').forEach(b => {
        b.classList.remove(
            'text-[#2F80ED]',
            'border-[#2F80ED]',
            'border-b-2'
        );

        b.classList.add('text-gray-500');
    });

    const activeNav = document.getElementById(`nav-${tab}`);

    if (activeNav) {
        activeNav.classList.add(
            'text-[#2F80ED]',
            'border-[#2F80ED]',
            'border-b-2'
        );

        activeNav.classList.remove('text-gray-500');
    }

    const header = document.querySelector('header');

    if (tab === 'detail' || tab === 'news-detail') {
        header.classList.add('hidden');
    } else {
        header.classList.remove('hidden');
    }

    if (tab === 'saved') {
        savedVideos = JSON.parse(
            localStorage.getItem('ent_saved') || '[]'
        );

        renderSaved();
    }

    lucide.createIcons();
}

function renderCategories() {

    const categories = [
        ...new Set(
            videos
                .map(v => (v.category || '').toString().trim())
                .filter(cat => cat.length > 0)
        )
    ];

    const cats = ['All', ...categories];

    const container = document.getElementById('category-filters');

    if (!container) return;

    container.innerHTML = cats.map(cat => {

        const active =
            filterCategory.toLowerCase().trim() ===
            cat.toLowerCase().trim();

        return `
            <button
                onclick='setCategory(${JSON.stringify(cat)})'
                class="
                    px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${active
                ? 'bg-[#2F80ED] text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-[#2F80ED]'
            }
                ">

                ${cat}

            </button>
        `;
    }).join('');

    requestAnimationFrame(() => {
        lucide.createIcons();
    });
}

function setCategory(cat) {
    filterCategory = cat;
    renderCategories();
    renderVideos();
}

function renderVideos() {

    const grid = document.getElementById('video-grid');

    if (!grid) return;

    const filtered = videos.filter(v => {

        const videoCategory = (v.category || '')
            .toString()
            .trim()
            .toLowerCase();

        const currentCategory = (filterCategory || '')
            .toString()
            .trim()
            .toLowerCase();

        const matchCat =
            currentCategory === 'all' ||
            videoCategory === currentCategory;

        const title = (v.title || '').toLowerCase();
        const description = (v.description || '').toLowerCase();

        const matchSearch =
            title.includes(searchQuery) ||
            description.includes(searchQuery);

        return matchCat && matchSearch;
    });

    console.log('FILTER RESULT:', filtered.length);

    if (filtered.length === 0) {

        grid.innerHTML = `
            <div class="col-span-full text-center py-20 text-gray-400">
                No videos found.
            </div>
        `;

        return;
    }

    grid.innerHTML = filtered
        .map(v => createVideoCard(v))
        .join('');

    requestAnimationFrame(() => {
        lucide.createIcons();
    });
}

function createVideoCard(v) {
    const isSaved = savedVideos.includes(String(v.id));

    return `
        <div class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group border border-gray-50 flex flex-col h-full">
            
                      <div class="p-5 flex-1 flex flex-col space-y-3">
                <div class="flex gap-2">
                    <span class="px-2 py-0.5 bg-blue-50 text-[#2F80ED] text-[10px] font-bold uppercase rounded tracking-wide">
                        ${v.category || 'Uncategorized'}
                    </span>
                </div>

                <h3 class="font-bold text-lg leading-tight line-clamp-2 group-hover:text-[#2F80ED] transition-colors cursor-pointer"
                    onclick="viewDetail('${v.id}')">
                    ${v.title || 'No Title'}
                </h3>

                <p class="text-sm text-gray-500 line-clamp-2">
                    ${v.description || 'No description'}
                </p>

                <div class="flex items-center justify-between pt-2 border-t border-gray-50 mt-auto">
                    <div class="flex items-center gap-2">
                        <i data-lucide="check-circle" class="w-4 h-4 text-[#27AE60]"></i>
                        <span class="text-[11px] font-semibold text-gray-400">Verified</span>
                    </div>

                    <button onclick="toggleSave('${v.id}')"
                        class="p-1 px-2 rounded-lg ${isSaved ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'} transition-colors">

                        <i data-lucide="heart" class="w-4 h-4" ${isSaved ? 'fill="red"' : ''}></i>

                    </button>
                </div>
            </div>
        </div>
    `;
}

function toggleSave(id) {
    id = String(id);

    if (savedVideos.includes(id)) {
        savedVideos = savedVideos.filter(i => i !== id);
    } else {
        savedVideos.push(id);
    }

    localStorage.setItem('ent_saved', JSON.stringify(savedVideos));

    savedVideos = JSON.parse(localStorage.getItem('ent_saved') || '[]');

    renderVideos();
    renderSaved();
}

function renderSaved() {
    savedVideos = JSON.parse(localStorage.getItem('ent_saved') || '[]');
    const saved = videos.filter(v =>
        savedVideos.includes(String(v.id))
    );
    const grid = document.getElementById('saved-grid');
    if (saved.length === 0) {
        grid.innerHTML = `<div class="col-span-full py-20 text-center text-gray-400">No saved videos yet.</div>`;
    } else {
        grid.innerHTML = saved.map(v => createVideoCard(v)).join('');
    }
    lucide.createIcons();
}

function renderNews() {
    const container = document.getElementById('news-container');

    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${news.map(n => `
                <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50 group hover:border-[#2F80ED]/30 transition-all cursor-pointer"
                    onclick="viewNewsDetail('${n.id}')">

                    <div class="aspect-video overflow-hidden">
                        <img src="${n.image}"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    </div>

                    <div class="p-5">
                        <div class="text-[10px] font-bold text-[#27AE60] uppercase mb-2">
                            ${n.category}
                        </div>

                        <h4 class="font-bold text-lg mb-3 group-hover:text-[#2F80ED] transition-colors">
                            ${n.title}
                        </h4>

                        <p class="text-sm text-gray-500 leading-relaxed line-clamp-3">
                            ${n.description}
                        </p>

                        <div class="mt-4 text-xs font-semibold text-gray-400">
                            ${n.publishDate}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function getEmbedUrl(url) {
    const videoId = url.split('v=')[1]?.split('&')[0]
        || url.split('/').pop();

    return `https://www.youtube-nocookie.com/embed/${videoId}`;
}

function viewDetail(id) {

    const video = videos.find(v => String(v.id) === String(id));

    if (!video) {
        console.error('Video not found:', id);
        return;
    }

    const embedUrl = getEmbedUrl(video.videoUrl);


    const container = document.getElementById('video-detail-content');

    container.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">

      <!-- LEFT -->
      <div class="lg:col-span-2 space-y-6">

        <div id="video-player-top" class="video-box">

          <div class="video-wrapper"
            style="aspect-ratio:16/9;width:100%;border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.3);">

            <iframe 
              src="${embedUrl}"
              title="${video.title}"
              style="width:100%;height:100%;border:none;"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen>
            </iframe>

          </div>

          <div style="text-align:center;margin-top:15px;">

            <a href="${video.videoUrl}" 
              target="_blank" 
              rel="noopener noreferrer"
              style="color:#6b7280;text-decoration:none;font-size:14px;">

              Can't embed? Watch directly on YouTube

            </a>

          </div>

        </div>

        <!-- TITLE -->
        <div class="space-y-4">

          <span class="px-3 py-1 bg-blue-50 text-[#2F80ED] text-[11px] font-bold uppercase rounded-full inline-block">
            ${video.category}
          </span>

          <h2 class="text-3xl font-bold leading-tight">
            ${video.title}
          </h2>

          <p class="text-gray-600 leading-relaxed text-lg">
            ${video.description}
          </p>

        </div>

        <!-- INFO BOX -->
        <div class="p-6 bg-[#F1F5F9] rounded-2xl border-l-4 border-[#2F80ED]">

          <h4 class="font-bold text-[#1F2D3D] mb-2 flex items-center gap-2">

            <i data-lucide="info" class="text-[#2F80ED]"></i>

            Important Note

          </h4>

          <p class="text-xs text-gray-400 uppercase tracking-wider">
            This content has been verified by ENT Health Hub for community education purposes.
          </p>

        </div>

      </div>

      <!-- RIGHT -->
      <div class="space-y-6">

        <h3 class="font-bold text-lg">
          Related Videos
        </h3>

        <div class="space-y-4 max-h-[800px] overflow-y-auto pr-2">

  ${videos
            .filter(v => v.category === video.category)
            .map(v => {

                const active = String(v.id) === String(id);

                return `

        <div
  class="
    p-3 rounded-2xl cursor-pointer transition-all border
    ${active
                        ? 'bg-blue-50 border-[#2F80ED]'
                        : 'bg-white border-gray-100 hover:bg-gray-50 hover:border-[#2F80ED]/30'}
  "
  onclick="viewDetail('${v.id}')">

  <span class="text-[10px] font-bold uppercase text-[#2F80ED]">
    ${v.category}
  </span>

  <h5 class="text-sm font-bold line-clamp-2 mt-1">
    ${v.title}
  </h5>

</div>

      `;
            }).join('')}

</div>

      </div>

    </div>
  `;

    if (currentTab !== 'detail') {
        navigate('detail');
    }

    setTimeout(() => {
        document.getElementById('video-player-top')
            ?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
    }, 100);

    lucide.createIcons();
}

function viewNewsDetail(id) {
    const newsItem = news.find(n => String(n.id) === String(id));

    if (!newsItem) {
        console.error('News item not found:', id);
        console.log('Available news IDs:', news.map(n => n.id));
        return;
    }

    const container = document.getElementById('news-detail-content');
    container.innerHTML = `
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div class="lg:col-span-2 space-y-6">
                        <div class="w-full rounded-3xl overflow-hidden shadow-xl">
                            <img src="${newsItem.image}" class="w-full h-auto">
                        </div>
                        <div>
                            <span class="px-3 py-1 bg-green-50 text-[#27AE60] text-[10px] font-bold uppercase rounded tracking-wide inline-block mb-4">${newsItem.category}</span>
                            <h2 class="text-3xl font-bold mb-2">${newsItem.title}</h2>
                            <p class="text-sm text-gray-400">${newsItem.publishDate}</p>
                        </div>
                        <p class="text-gray-600 leading-relaxed text-lg">
    ${newsItem.description.replace(/\n/g, '<br><br>')}
</p>

${newsItem.content
            ? `
    <div class="text-gray-600 leading-relaxed">
        ${newsItem.content}
    </div>
`
            : ''
        }
                        <div class="p-6 bg-[#F1F5F9] rounded-2xl border-l-4 border-[#27AE60]">
                            <h4 class="font-bold text-[#1F2D3D] mb-2 flex items-center gap-2">
                                <i data-lucide="info" class="text-[#27AE60]"></i> Medical Information
                            </h4>
                            <p class="text-xs text-gray-400 uppercase tracking-wider">This news has been reviewed by ENT Health Hub for accuracy and relevance.</p>
                        </div>
                    </div>
                    <div class="space-y-6">
                        <h3 class="font-bold text-lg">More News</h3>
                        <div class="space-y-4">
                            ${news.filter(n => n.id !== id).slice(0, 7).map(n => `
                                <div class="bg-white p-4 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors border border-gray-50" onclick="viewNewsDetail('${n.id}')">
                                    <p class="text-[10px] font-bold text-[#27AE60] uppercase mb-2">${n.category}</p>
                                    <h5 class="text-sm font-bold line-clamp-2 mb-2">${n.title}</h5>
                                    <p class="text-[10px] text-gray-400">${n.publishDate}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
    navigate('news-detail');
}

function openDonateModal() {
    document.getElementById('donate-modal').classList.add('active');
    lucide.createIcons();
}

function closeDonateModal() {
    document.getElementById('donate-modal').classList.remove('active');
}

function copyPayPal() {
    const account = document.getElementById('paypal-account').textContent;
    navigator.clipboard.writeText(account).then(() => {
        alert('Copied to clipboard: ' + account);
    });
}

function setPayPalAccount(account) {
    paypalAccount = account;
    document.getElementById('paypal-account').textContent = account;
    document.getElementById('paypal-link').href = `https://paypal.me/${account.split('@')[0]}`;
}

function renderProducts() {
    const container = document.getElementById('products-container');
    if (!products || products.length === 0) {
        container.innerHTML = '<div class="col-span-full text-center text-gray-400">No products available.</div>';
        return;
    }

    const grouped = {};
    products.forEach(p => {
        if (!grouped[p.category]) {
            grouped[p.category] = [];
        }
        grouped[p.category].push(p);
    });

    let html = '';
    Object.keys(grouped).forEach(category => {
        html += `
                    <div class="space-y-4">
                        <h3 class="text-xl font-bold text-[#1F2D3D] mb-4">${category}</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            ${grouped[category].map(p => `
                                <a href="${p.url}" target="_blank" rel="noopener noreferrer" class="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#FF6B6B]/50 hover:shadow-lg transition-all group">
                                    <div class="flex-1">
                                        <h4 class="font-bold text-lg text-[#1F2D3D] group-hover:text-[#FF6B6B] transition-colors">${p.name}</h4>
                                        <p class="text-sm text-gray-500 mt-1 mb-3">${p.description || 'Recommended product'}</p>
                                        <div class="flex items-center justify-between">
                                            <span class="px-2 py-1 bg-red-50 text-[#FF6B6B] text-[10px] font-bold uppercase rounded tracking-wide">Buy on Amazon</span>
                                            <i data-lucide="external-link" class="w-4 h-4 text-gray-400 group-hover:text-[#FF6B6B]"></i>
                                        </div>
                                    </div>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                `;
    });

    container.innerHTML = html;
    lucide.createIcons();
}

window.navigate = navigate;
window.viewDetail = viewDetail;
window.viewNewsDetail = viewNewsDetail;
window.setCategory = setCategory;
window.toggleSave = toggleSave;
window.openDonateModal = openDonateModal;
window.closeDonateModal = closeDonateModal;
window.copyPayPal = copyPayPal;

window.onload = init;
