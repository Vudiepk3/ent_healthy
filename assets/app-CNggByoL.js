(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const d of r.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&o(d)}).observe(document,{childList:!0,subtree:!0});function n(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(i){if(i.ep)return;i.ep=!0;const r=n(i);fetch(i.href,r)}})();const D={videos:"/src/data/videos.json",news:"/src/data/news.json",products:"/src/data/products.json"},C={videos:"https://raw.githubusercontent.com/Vudiepk3/Test_MockAPI/main/data/json/videos.json",news:"https://raw.githubusercontent.com/Vudiepk3/Test_MockAPI/main/data/json/news.json",products:"https://raw.githubusercontent.com/Vudiepk3/Test_MockAPI/main/data/json/products.json"},l="ENT Health Hub",x="ENT Health Hub provides educational ENT videos, medical news, and recommended care products.",k="",A=["videos","news","saved","products"],X="hicau",Z="ca-pub-6213581630049772",ee="YOUR_SLOT_ID";async function w(e){const t=await fetch(e);if(!t.ok)throw new Error(`${e} returned ${t.status}`);return t.json()}async function te(){let e,t,n;try{e=await w(D.videos),t=await w(D.news),n=await w(D.products)}catch(o){console.warn("Local JSON data failed, falling back to remote:",o.message),e=await w(C.videos),t=await w(C.news),n=await w(C.products)}return{videos:I(e,"videos"),news:I(t,"news"),products:I(n,"products")}}function I(e,t){return e&&typeof e=="object"&&!Array.isArray(e)?e.data||e[t]||Object.values(e):Array.isArray(e)?e:[]}function V(e){return String(e||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[\u0111\u0110]/g,"d").toLowerCase().replace(/&/g," and ").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"content"}function B(e=window.location.pathname){const t=new URLSearchParams(window.location.search).get("id");if(t)return t;const n=String(e).split("?")[0].split("#")[0].split("/").filter(Boolean).pop()||"",o=n.match(/-([^-]+)$/)||n.match(/^([^-]+)$/);return o?decodeURIComponent(o[1]):null}function b(e,t){return`/video.html?${new URLSearchParams({id:String(t),slug:V(e)}).toString()}`}function $(e,t){return`/news.html?${new URLSearchParams({id:String(t),slug:V(e)}).toString()}`}function ne(e="videos"){return e&&e!=="videos"?`/?section=${encodeURIComponent(e)}`:"/"}function M(){var n,o;const e=window.location.pathname,t=(o=(n=document.body)==null?void 0:n.dataset)==null?void 0:o.page;return e.startsWith("/video/")||e.endsWith("/video.html")||t==="video-detail"?"video-detail":e.startsWith("/news/")||e.endsWith("/news.html")||t==="news-detail"?"news-detail":"home"}function oe(){const e=new URLSearchParams(window.location.search).get("section");return A.includes(e)?e:"videos"}function H(e){var n;if(!e)return"";try{const o=new URL(e),i=o.hostname.replace(/^www\./,"");if(i==="youtu.be")return`https://www.youtube-nocookie.com/embed/${o.pathname.split("/").filter(Boolean)[0]}`;if(i.includes("youtube.com")){const r=o.searchParams.get("v"),d=o.pathname.split("/").filter(Boolean).pop();return`https://www.youtube-nocookie.com/embed/${r||d}`}}catch(o){console.warn("Invalid video URL:",e,o)}return`https://www.youtube-nocookie.com/embed/${((n=String(e).split("v=")[1])==null?void 0:n.split("&")[0])||String(e).split("/").pop()}`}function j(e,t){const n=e.filter(i=>String(i.id)!==String(t.id)&&i.category===t.category),o=e.filter(i=>String(i.id)!==String(t.id));return(n.length>0?n:o).slice(0,12)}function ie(e){const t=String(e||"").trim();return t?t.split(/\n{2,}/).map(n=>`
            <p class="text-gray-600 leading-relaxed text-lg">
                ${s(n).replace(/\n/g,"<br>")}
            </p>
        `).join(""):`
            <p class="text-gray-600 leading-relaxed text-lg">
                This educational content is part of the ENT Health Hub medical education library.
            </p>
        `}function O(e,t){const n=String(e||"").replace(/\s+/g," ").trim();return n.length<=t?n:`${n.slice(0,t-1).trim()}...`}function s(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function c(e){return s(e)}function f(e){return JSON.stringify(String(e??"")).replace(/'/g,"\\u0027").replace(/&/g,"\\u0026").replace(/</g,"\\u003C").replace(/>/g,"\\u003E")}function m(){window.lucide&&window.lucide.createIcons()}function re(e="videos"){const t={videos:{title:`${l} - Medical Education Center`,description:x,canonicalUrl:`${window.location.origin}/`},news:{title:`Medical News | ${l}`,description:"Stay updated with medical breakthroughs and research in ENT.",canonicalUrl:`${window.location.origin}/?section=news`},saved:{title:`Saved Videos | ${l}`,description:"Saved ENT educational videos from ENT Health Hub.",canonicalUrl:`${window.location.origin}/?section=saved`},products:{title:`Recommended Products | ${l}`,description:"Recommended products for ENT care.",canonicalUrl:`${window.location.origin}/?section=products`}},n=t[e]||t.videos;F({...n,type:"website",schema:{"@context":"https://schema.org","@type":"WebSite",name:l,url:`${window.location.origin}/`,description:x}})}function U({title:e,description:t,category:n,publishDate:o,image:i,canonicalPath:r,articleBody:d,videoUrl:v}){const u=`${window.location.origin}${r}`,p=O(t||d||x,170),L=`${e} | ${l}`,h={"@context":"https://schema.org","@type":"Article",headline:e,description:p,mainEntityOfPage:u,articleSection:n||"Medical Education",author:{"@type":"Organization",name:l},publisher:{"@type":"Organization",name:l}};o&&(h.datePublished=o,h.dateModified=o),i&&(h.image=[i]),v&&(h.associatedMedia={"@type":"VideoObject",name:e,description:p,embedUrl:H(v),uploadDate:o||void 0}),F({title:L,description:p,canonicalUrl:u,image:i,type:"article",publishedTime:o,section:n,schema:h})}function F({title:e,description:t,canonicalUrl:n,image:o,type:i="website",publishedTime:r,section:d,schema:v}){const u=O(t||x,170),p=e||`${l} - Medical Education Center`;document.title=p,y("description",u),y("robots","index, follow"),ae(n||window.location.href),g("og:type",i),g("og:title",p),g("og:description",u),g("og:url",n||window.location.href),g("og:site_name",l),o&&(g("og:image",o),y("twitter:image",o)),r&&(g("article:published_time",r),g("article:modified_time",r)),d&&g("article:section",d),y("twitter:card",o?"summary_large_image":"summary"),y("twitter:title",p),y("twitter:description",u),se(v)}function ae(e){let t=document.querySelector('link[rel="canonical"]');t||(t=document.createElement("link"),t.setAttribute("rel","canonical"),document.head.appendChild(t)),t.setAttribute("href",e)}function y(e,t){_(`meta[name="${e}"]`,"name",e,t)}function g(e,t){_(`meta[property="${e}"]`,"property",e,t)}function _(e,t,n,o){if(!o)return;let i=document.querySelector(e);i||(i=document.createElement("meta"),i.setAttribute(t,n),document.head.appendChild(i)),i.setAttribute("content",o)}function se(e){if(!e)return;let t=document.getElementById("structured-data");t||(t=document.createElement("script"),t.id="structured-data",t.type="application/ld+json",document.head.appendChild(t)),t.textContent=JSON.stringify(e)}function R({videos:e,filterCategory:t}){const n=document.getElementById("category-filters");if(!n)return;const o=["All",...new Set(e.map(i=>String(i.category||"").trim()).filter(Boolean))];n.innerHTML=o.map(i=>{const r=t.toLowerCase().trim()===i.toLowerCase().trim();return`
            <button
                onclick='setCategory(${f(i)})'
                class="px-4 py-2 rounded-full text-sm font-medium transition-all ${r?"bg-[#2F80ED] text-white":"bg-white border border-gray-200 text-gray-600 hover:border-[#2F80ED]"}">
                ${s(i)}
            </button>
        `}).join(""),requestAnimationFrame(m)}function E({videos:e,filterCategory:t,searchQuery:n,savedVideos:o}){const i=document.getElementById("video-grid");if(!i)return;const r=e.filter(d=>{const v=String(d.category||"").trim().toLowerCase(),u=String(t||"").trim().toLowerCase(),p=u==="all"||v===u,L=String(d.title||"").toLowerCase(),h=String(d.description||"").toLowerCase(),K=L.includes(n)||h.includes(n);return p&&K});if(r.length===0){i.innerHTML=`
            <div class="col-span-full text-center py-20 text-gray-400">
                No videos found.
            </div>
        `;return}i.innerHTML=r.map(d=>q(d,o)).join(""),requestAnimationFrame(m)}function q(e,t){const n=t.includes(String(e.id)),o=e.title||"No Title",i=e.description||"No description",r=b(o,e.id);return`
        <div class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group border border-gray-50 flex flex-col h-full">
            <div class="p-5 flex-1 flex flex-col space-y-3">
                <div class="flex gap-2">
                    <span class="px-2 py-0.5 bg-blue-50 text-[#2F80ED] text-[10px] font-bold uppercase rounded tracking-wide">
                        ${s(e.category||"Uncategorized")}
                    </span>
                </div>

                <a href="${c(r)}"
                    onclick='event.preventDefault(); goToVideo(${f(o)}, ${f(e.id)})'
                    class="font-bold text-lg leading-tight line-clamp-2 group-hover:text-[#2F80ED] transition-colors cursor-pointer">
                    ${s(e.id)}. ${s(o)}
                </a>

                <p class="text-sm text-gray-500 line-clamp-2">
                    ${s(i)}
                </p>

                <div class="flex items-center justify-between pt-2 border-t border-gray-50 mt-auto">
                    <div class="flex items-center gap-2">
                        <i data-lucide="check-circle" class="w-4 h-4 text-[#27AE60]"></i>
                        <span class="text-[11px] font-semibold text-gray-400">Verified</span>
                    </div>

                    <button onclick="toggleSave('${c(e.id)}')"
                        class="p-1 px-2 rounded-lg ${n?"text-red-500 bg-red-50":"text-gray-400 hover:text-red-500"} transition-colors">
                        <i data-lucide="heart" class="w-4 h-4" ${n?'fill="red"':""}></i>
                    </button>
                </div>
            </div>
        </div>
    `}function z({videos:e,savedVideos:t}){const n=document.getElementById("saved-grid");if(!n)return;const o=e.filter(i=>t.includes(String(i.id)));n.innerHTML=o.length===0?'<div class="col-span-full py-20 text-center text-gray-400">No saved videos yet.</div>':o.map(i=>q(i,t)).join(""),m()}function de(e){const t=document.getElementById("news-container");t&&(t.innerHTML=`
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${e.map(ce).join("")}
        </div>
    `)}function ce(e){const t=e.title||"No Title",n=e.description||"No description",o=$(t,e.id);return`
        <a href="${c(o)}"
            onclick='event.preventDefault(); goToNews(${f(t)}, ${f(e.id)})'
            class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50 group hover:border-[#2F80ED]/30 transition-all cursor-pointer">

            <div class="aspect-video overflow-hidden">
                <img src="${c(e.image||"")}"
                    alt="${c(t)}"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            </div>

            <div class="p-5">
                <div class="text-[10px] font-bold text-[#27AE60] uppercase mb-2">
                    ${s(e.category||"Medical News")}
                </div>

                <h4 class="font-bold text-lg mb-3 group-hover:text-[#2F80ED] transition-colors">
                    ${s(t)}
                </h4>

                <p class="text-sm text-gray-500 leading-relaxed line-clamp-3">
                    ${s(n)}
                </p>

                <div class="mt-4 text-xs font-semibold text-gray-400">
                    ${s(e.publishDate||"")}
                </div>
            </div>
        </a>
    `}function le(e){const t=document.getElementById("products-container");if(!t)return;if(!e||e.length===0){t.innerHTML='<div class="col-span-full text-center text-gray-400">No products available.</div>';return}const n=e.reduce((o,i)=>{const r=i.category||"Recommended Products";return o[r]=o[r]||[],o[r].push(i),o},{});t.innerHTML=Object.entries(n).map(([o,i])=>`
            <div class="space-y-4">
                <h3 class="text-xl font-bold text-[#1F2D3D] mb-4">${s(o)}</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${i.map(ue).join("")}
                </div>
            </div>
        `).join(""),m()}function ue(e){return`
        <a href="${c(e.url||"#")}" target="_blank" rel="noopener noreferrer" class="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#FF6B6B]/50 hover:shadow-lg transition-all group">
            <div class="flex-1">
                <h4 class="font-bold text-lg text-[#1F2D3D] group-hover:text-[#FF6B6B] transition-colors">${s(e.name||"Product")}</h4>
                <p class="text-sm text-gray-500 mt-1 mb-3">${s(e.description||"Recommended product")}</p>
                <div class="flex items-center justify-between">
                    <span class="px-2 py-1 bg-red-50 text-[#FF6B6B] text-[10px] font-bold uppercase rounded tracking-wide">Buy on Amazon</span>
                    <i data-lucide="external-link" class="w-4 h-4 text-gray-400 group-hover:text-[#FF6B6B]"></i>
                </div>
            </div>
        </a>
    `}function pe(e,t){const n=document.getElementById("video-detail-content");if(!n)return;const o=j(t,e);n.innerHTML=`
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div class="lg:col-span-2 space-y-6">
                <div id="video-player-top" class="video-box">
                    <div class="video-wrapper" style="aspect-ratio:16/9;width:100%;border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
                        <iframe
                            src="${c(H(e.videoUrl))}"
                            title="${c(e.id+". "+e.title||"ENT video")}"
                            style="width:100%;height:100%;border:none;"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen>
                        </iframe>
                    </div>

                    <div style="text-align:center;margin-top:15px;">
                        <a href="${c(e.videoUrl||"#")}"
                            target="_blank"
                            rel="noopener noreferrer"
                            style="color:#6b7280;text-decoration:none;font-size:14px;">
                            Can't embed? Watch directly on YouTube
                        </a>
                    </div>
                </div>

                ${J()}

                <article class="space-y-4">
                    <div class="flex flex-wrap items-center gap-3">
                        <span class="px-3 py-1 bg-blue-50 text-[#2F80ED] text-[11px] font-bold uppercase rounded-full inline-block">
                            ${s(e.category||"ENT Video")}
                        </span>
                        ${e.publishDate?`<span class="text-xs font-semibold text-gray-400">${s(e.publishDate)}</span>`:""}
                    </div>

                    <h1 class="text-3xl font-bold leading-tight">
                        ${s(e.id)}. ${s(e.title||"No Title")}
                    </h1>

                    <p class="text-gray-600 leading-relaxed text-lg">
                        ${s(e.description||"No description")}
                    </p>

                </article>
            </div>

            <aside class="space-y-6">
                <h3 class="font-bold text-lg">Related Videos</h3>
                <div class="space-y-4 max-h-[800px] overflow-y-auto pr-2">
                    ${o.map(ge).join("")}
                </div>
            </aside>
        </div>
    `,m()}function ge(e){const t=b(e.title,e.id);return`
        <a href="${c(t)}"
            onclick='event.preventDefault(); goToVideo(${f(e.title)}, ${f(e.id)})'
            class="block p-3 rounded-2xl cursor-pointer transition-all border bg-white border-gray-100 hover:bg-gray-50 hover:border-[#2F80ED]/30">
            <span class="text-[10px] font-bold uppercase text-[#2F80ED]">
                ${s(e.category||"ENT Video")}
            </span>
            <h5 class="text-sm font-bold line-clamp-2 mt-1">
                ${s(e.id+". "+e.title||"No Title")}
            </h5>
        </a>
    `}function fe(e,t){const n=document.getElementById("news-detail-content");if(!n)return;const o=j(t,e);n.innerHTML=`
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <article class="lg:col-span-2 space-y-6">
                <div class="w-full rounded-3xl overflow-hidden shadow-xl">
                    <img src="${c(e.image||"")}" alt="${c(e.title||"Medical news")}" class="w-full h-auto">
                </div>

                ${J()}

                <div>
                    <span class="px-3 py-1 bg-green-50 text-[#27AE60] text-[10px] font-bold uppercase rounded tracking-wide inline-block mb-4">
                        ${s(e.category||"Medical News")}
                    </span>

                    <h1 class="text-3xl font-bold mb-2">
                        ${s(e.title||"No Title")}
                    </h1>

                    <p class="text-sm text-gray-400">
                        ${s(e.publishDate||"")}
                    </p>
                </div>

                <div class="text-gray-600 leading-relaxed text-lg space-y-5">
                    ${ie(e.content||e.article||e.description)}
                </div>
            </article>

            <aside class="space-y-6">
                <h3 class="font-bold text-lg">Related Articles</h3>
                <div class="space-y-4 max-h-[800px] overflow-y-auto pr-2">
                    ${o.map(me).join("")}
                </div>
            </aside>
        </div>
    `,m()}function me(e){const t=$(e.title,e.id);return`
        <a href="${c(t)}"
            onclick='event.preventDefault(); goToNews(${f(e.title)}, ${f(e.id)})'
            class="block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:bg-gray-50 hover:border-[#2F80ED]/30 transition-all">
            <div class="aspect-video overflow-hidden">
                <img src="${c(e.image||"")}" alt="${c(e.title||"Medical news")}" class="w-full h-full object-cover">
            </div>
            <div class="p-3">
                <span class="text-[10px] font-bold uppercase text-[#27AE60]">
                    ${s(e.category||"Medical News")}
                </span>
                <h5 class="text-sm font-bold line-clamp-2 mt-1">
                    ${s(e.title||"No Title")}
                </h5>
                <p class="text-xs font-semibold text-gray-400 mt-2">
                    ${s(e.publishDate||"")}
                </p>
            </div>
        </a>
    `}function W(e,t){var i;const n=e==="news"?"news-detail":"detail",o=document.getElementById(e==="news"?"news-detail-content":"video-detail-content");document.querySelectorAll("main > section").forEach(r=>{r.classList.add("hidden")}),(i=document.getElementById(`section-${n}`))==null||i.classList.remove("hidden"),o&&(o.innerHTML=`
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center max-w-2xl mx-auto">
                <h1 class="text-3xl font-bold text-[#1F2D3D] mb-3">Content not found</h1>
                <p class="text-gray-500 mb-6">We could not find ${s(e)} item ${s(t||"")}.</p>
                <a href="/" class="inline-flex items-center justify-center px-5 py-2 bg-[#2F80ED] text-white rounded-full font-medium">
                    Back to homepage
                </a>
            </div>
        `),F({title:`Content not found | ${l}`,description:"The requested ENT Health Hub page could not be found.",canonicalUrl:window.location.href,type:"website"})}function J(){return`
        <div class="my-6">
            <ins class="adsbygoogle"
                style="display:block"
                data-ad-client="${Z}"
                data-ad-slot="${ee}"
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
        </div>
    `}const a={videos:[],news:[],products:[],filterCategory:"All",searchQuery:"",savedVideos:G()};document.addEventListener("DOMContentLoaded",he);async function he(){Pe(),Ae(X),m(),ye();try{Object.assign(a,await te()),ve()}catch(e){console.error("Error loading data:",e),alert("Failed to load data. Check console for details. Error: "+e.message)}}function ve(){const e=M();if(e==="video-detail"){$e();return}if(e==="news-detail"){Ee();return}we()}function we(){R({videos:a.videos,filterCategory:a.filterCategory}),E(T()),de(a.news),le(a.products),S(oe())}function ye(){const e=document.getElementById("global-search");e&&e.addEventListener("input",t=>{a.searchQuery=t.target.value.toLowerCase(),E(T())})}function S(e){if(M()!=="home"&&A.includes(e)){P(e);return}const t=document.getElementById(`section-${e}`);if(!t){A.includes(e)&&P(e);return}document.querySelectorAll("main > section").forEach(n=>{n.classList.add("hidden")}),t.classList.remove("hidden"),xe(e),be(e),e==="saved"&&(a.savedVideos=G(),z({videos:a.videos,savedVideos:a.savedVideos})),M()==="home"&&re(e),m()}function xe(e){document.querySelectorAll("nav button").forEach(n=>{n.classList.remove("text-[#2F80ED]","border-[#2F80ED]","border-b-2"),n.classList.add("text-gray-500")});const t=document.getElementById(`nav-${e}`);t&&(t.classList.add("text-[#2F80ED]","border-[#2F80ED]","border-b-2"),t.classList.remove("text-gray-500"))}function be(e){const t=document.querySelector("header");t&&t.classList.toggle("hidden",e==="detail"||e==="news-detail")}function $e(){S("detail");const e=B(),t=N(a.videos,e);if(!t){W("video",e);return}pe(t,a.videos),U({title:t.title||"ENT Video",description:t.description||`${t.title||"ENT video"} from ENT Health Hub.`,category:t.category,publishDate:t.publishDate,image:t.image||k,canonicalPath:b(t.title,t.id),articleBody:t.description,videoUrl:t.videoUrl})}function Ee(){S("news-detail");const e=B(),t=N(a.news,e);if(!t){W("news",e);return}fe(t,a.news),U({title:t.title||"Medical News",description:t.description||`${t.title||"Medical news"} from ENT Health Hub.`,category:t.category,publishDate:t.publishDate,image:t.image||k,canonicalPath:$(t.title,t.id),articleBody:t.description})}function Se(e){a.filterCategory=e,R({videos:a.videos,filterCategory:a.filterCategory}),E(T())}function Te(e){const t=String(e);a.savedVideos=a.savedVideos.includes(t)?a.savedVideos.filter(n=>n!==t):[...a.savedVideos,t],Me(a.savedVideos),E(T()),z({videos:a.videos,savedVideos:a.savedVideos})}function Ne(e){const t=N(a.videos,e);if(!t){console.error("Video not found:",e);return}Q(t.title,t.id)}function Le(e){const t=N(a.news,e);if(!t){console.error("News item not found:",e);return}Y(t.title,t.id)}function Q(e,t){window.location.href=b(e,t)}function Y(e,t){window.location.href=$(e,t)}function P(e="videos"){window.location.href=ne(e)}function De(){var e;(e=document.getElementById("donate-modal"))==null||e.classList.add("active"),m()}function Ce(){var e;(e=document.getElementById("donate-modal"))==null||e.classList.remove("active")}function Ie(){var t;const e=(t=document.getElementById("paypal-account"))==null?void 0:t.textContent;e&&navigator.clipboard.writeText(e).then(()=>{alert("Copied to clipboard: "+e)})}function Ae(e){const t=document.getElementById("paypal-account"),n=document.getElementById("paypal-link");t&&(t.textContent=e),n&&(n.href=`https://paypal.me/${e.split("@")[0]}`)}function T(){return{videos:a.videos,filterCategory:a.filterCategory,searchQuery:a.searchQuery,savedVideos:a.savedVideos}}function N(e,t){return e.find(n=>String(n.id)===String(t))}function G(){try{return JSON.parse(localStorage.getItem("ent_saved")||"[]")}catch{return[]}}function Me(e){localStorage.setItem("ent_saved",JSON.stringify(e))}function Pe(){Object.assign(window,{navigate:S,generateSlug:V,getIdFromSlug:B,goToVideo:Q,goToNews:Y,goHome:P,viewDetail:Ne,viewNewsDetail:Le,setCategory:Se,toggleSave:Te,openDonateModal:De,closeDonateModal:Ce,copyPayPal:Ie})}
