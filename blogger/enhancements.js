/* Progressive enhancements only: Blogger renders all content and metadata. */
(function () {
  'use strict';
  var root = document.documentElement;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var knownPosts = [];
  var themeData = {};
  try { themeData = JSON.parse(document.getElementById('blogger-theme-data').textContent); } catch (_) { /* Optional site defaults. */ }
  try { knownPosts = JSON.parse(document.getElementById('blogger-post-data').textContent); } catch (_) { /* Native posts do not need the migration manifest. */ }
  function knownPost(href) {
    var path;
    try { path = new URL(href, location.href).pathname; } catch (_) { return null; }
    return knownPosts.find(function (post) { return post.path === path; }) || null;
  }
  // Preserve source metadata even when Blogger formats an imported timestamp
  // in a different blog timezone or alphabetizes its topic/tag labels.
  function syncDate(time, post) {
    if (!time) return;
    time.textContent = post.date;
    var parsed = new Date(post.date + ' 00:00:00 GMT');
    if (!isNaN(parsed.getTime())) time.dateTime = parsed.toISOString().slice(0, 10);
  }
  document.querySelectorAll('#Blog1 article').forEach(function (article) {
    if (article.querySelector('[data-article-body]')) return;
    var link = article.querySelector('h2 a');
    var post = link && knownPost(link.href);
    if (!post) return;
    var excerpt = article.querySelector('p');
    if (excerpt) excerpt.textContent = post.excerpt;
    syncDate(article.querySelector('time'), post);
    var reading = article.querySelector('[data-card-reading]');
    if (reading) reading.textContent = post.readTime || '';
    // Some imported posts have no Blogger featuredImage even though their
    // original cover is present in the body; retain that cover on the card.
    if (!article.querySelector('img[width="192"]')) {
      var imageLink = document.createElement('a');
      imageLink.href = link.href;
      imageLink.className = 'hidden sm:block flex-shrink-0 w-40 h-28 md:w-48 md:h-32 rounded-lg overflow-hidden';
      imageLink.tabIndex = -1; imageLink.setAttribute('aria-hidden', 'true');
      var img = document.createElement('img');
      img.src = post.imageUrl; img.alt = ''; img.width = 192; img.height = 128; img.loading = 'lazy';
      img.className = 'w-full h-full object-cover';
      imageLink.appendChild(img); article.prepend(imageLink);
    }
  });
  document.querySelectorAll('[data-card-reading]').forEach(function (reading) { if (!reading.textContent.trim()) reading.textContent = '5 min read'; });
  // Keep popular tags first without relying on an unsupported gadget setting.
  document.querySelectorAll('.blogger-labels').forEach(function (list) {
    Array.from(list.querySelectorAll('a')).sort(function (a, b) {
      return Number(b.getAttribute('data-label-count')) - Number(a.getAttribute('data-label-count')) || a.textContent.trim().localeCompare(b.textContent.trim());
    }).forEach(function (link) { list.appendChild(link); });
  });
  // A transferred Layout may retain an unconfigured Profile gadget.
  document.querySelectorAll('.sidebar .Profile').forEach(function (widget) {
    var content = widget.cloneNode(true);
    content.querySelectorAll('h2, h3, .widget-title').forEach(function (heading) { heading.remove(); });
    if (!content.textContent.trim() && !content.querySelector('img, a')) widget.hidden = true;
  });
  var commentEditor = document.getElementById('comment-editor');
  if (commentEditor && !commentEditor.title) commentEditor.title = 'Blogger comment editor';
  function setTheme(dark) {
    root.classList.toggle('dark', dark);
    document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
      button.setAttribute('aria-pressed', String(dark));
      button.setAttribute('aria-label', dark ? 'Use light theme' : 'Use dark theme');
    });
  }
  setTheme(root.classList.contains('dark'));
  document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
    button.hidden = false;
    button.addEventListener('click', function () {
      var dark = !root.classList.contains('dark');
      setTheme(dark);
      try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (_) { /* Storage may be blocked. */ }
    });
  });
  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    // Without JavaScript, navigation stays visible and usable on mobile.
    menu.hidden = true;
    toggle.hidden = false;
    function closeMenu() { menu.hidden = true; toggle.setAttribute('aria-expanded', 'false'); }
    toggle.addEventListener('click', function () {
      menu.hidden = !menu.hidden;
      toggle.setAttribute('aria-expanded', String(!menu.hidden));
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !menu.hidden) { closeMenu(); toggle.focus(); }
    });
    menu.addEventListener('click', function (event) { if (event.target.closest('a')) closeMenu(); });
  }
  document.querySelectorAll('nav a, .listing-sidebar a').forEach(function (link) {
    var target = new URL(link.href, location.href);
    if (target.origin === location.origin && target.pathname === location.pathname) link.setAttribute('aria-current', 'page');
  });
  var body = document.querySelector('[data-article-body]');
  if (body) {
    var currentPost = knownPost(location.href);
    if (currentPost) syncDate(document.querySelector('.article-meta time'), currentPost);
    // Keep imported FAQ/related sections out of the prose and TOC, matching the
    // original article order. This also repairs already-published imports.
    var faq = body.querySelector('[itemtype="https://schema.org/FAQPage"]');
    var faqTarget = document.querySelector('[data-post-faq]');
    if (faq && faqTarget) faqTarget.appendChild(faq);
    if (document.querySelector('[data-curated-related]')) {
      body.querySelectorAll('section').forEach(function (section) {
        var title = section.querySelector('h2');
        if (title && title.textContent.trim() === 'More from the blog') section.remove();
      });
    }
    // Keep Blogger expressions simple; URL-encode share parameters in JavaScript.
    // The server-rendered links already share the canonical URL without script.
    var canonical = document.querySelector('link[rel="canonical"]');
    var heading = document.querySelector('h1');
    var shareUrl = encodeURIComponent(canonical ? canonical.href : location.href.split('#')[0]);
    var shareTitle = encodeURIComponent(heading ? heading.textContent : document.title);
    var shareLinks = {
      twitter: 'https://twitter.com/intent/tweet?url=' + shareUrl + '&text=' + shareTitle,
      linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=' + shareUrl,
      facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + shareUrl,
      email: 'mailto:?subject=' + shareTitle + '&body=' + shareUrl
    };
    document.querySelectorAll('[data-share]').forEach(function (link) {
      if (Object.prototype.hasOwnProperty.call(shareLinks, link.dataset.share)) link.href = shareLinks[link.dataset.share];
    });
    var nativeShare = document.querySelector('[data-native-share]');
    if (nativeShare && typeof navigator.share === 'function') {
      nativeShare.hidden = false;
      document.querySelectorAll('[data-share]').forEach(function (link) { link.hidden = true; });
      nativeShare.addEventListener('click', function () {
        navigator.share({ title: heading ? heading.textContent : document.title, url: canonical ? canonical.href : location.href }).catch(function () { /* Cancelled native share. */ });
      });
    }
    var text = body.textContent.trim();
    var reading = document.querySelector('[data-reading-time]');
    if (reading && !reading.textContent.trim()) reading.textContent = currentPost && currentPost.readTime ? currentPost.readTime : Math.max(1, Math.round(text.split(/\s+/).length / 238)) + ' min read';
    var headings = Array.from(body.querySelectorAll('h2, h3'));
    var toc = document.querySelector('[data-toc]');
    var tocList = document.querySelector('[data-toc-list]');
    var ids = new Set(Array.from(document.querySelectorAll('[id]')).map(function (el) { return el.id; }));
    if (toc && tocList && headings.length >= 3) {
      headings.forEach(function (heading, index) {
        if (!heading.id) {
          var base = heading.textContent.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') || 'section';
          var id = base;
          var suffix = 1;
          while (ids.has(id)) id = base + '-' + suffix++;
          heading.id = id;
          ids.add(id);
        }
        var link = document.createElement('a');
        link.href = '#' + heading.id;
        link.textContent = heading.textContent;
        if (heading.tagName === 'H3') link.className = 'toc-sub';
        tocList.appendChild(link);
      });
      toc.hidden = false;
      function activateToc(id) {
        tocList.querySelectorAll('a').forEach(function (link) {
          if (link.hash === '#' + id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
      activateToc(headings[0].id);
      if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
          var visible = entries.filter(function (entry) { return entry.isIntersecting; }).sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });
          if (visible.length) activateToc(visible[0].target.id);
        }, { rootMargin: '-80px 0px -60% 0px', threshold: [0, 1] });
        headings.forEach(function (item) { observer.observe(item); });
      }
    }
    body.querySelectorAll('pre').forEach(function (pre) {
      var container = pre.parentElement;
      var button = container.classList.contains('code-block') ? container.querySelector('[data-copy-code]') : null;
      var hasIcon = Boolean(button);
      if (!button) {
        button = document.createElement('button');
        button.type = 'button';
        button.textContent = 'Copy code';
        button.className = 'text-xs text-primary px-4 py-2';
        button.setAttribute('data-copy-code', '');
        pre.before(button);
      }
      var originalButton = button.innerHTML;
      button.addEventListener('click', async function () {
        try {
          await navigator.clipboard.writeText(pre.textContent);
          button.setAttribute('aria-label', 'Copied!');
          if (hasIcon) button.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m20 6-11 11-5-5"/></svg>';
          else button.textContent = 'Copied!';
        } catch (_) {
          button.setAttribute('aria-label', 'Select and copy the code');
          if (!hasIcon) button.textContent = 'Select and copy the code';
        }
        setTimeout(function () { button.innerHTML = originalButton; button.setAttribute('aria-label', 'Copy code'); }, 2000);
      });
    });
    var progress = document.getElementById('reading-progress');
    var topButton = document.querySelector('[data-back-top]');
    var ticking = false;
    function updateProgress() {
      var distance = document.documentElement.scrollHeight - window.innerHeight;
      var percent = distance > 0 ? Math.min(100, Math.max(0, window.scrollY / distance * 100)) : 0;
      if (progress) progress.style.width = percent + '%';
      if (topButton) topButton.hidden = window.scrollY < 300;
      ticking = false;
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(updateProgress); } }, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
    if (topButton) topButton.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' }); });
    var copy = document.querySelector('[data-copy-link]');
    if (copy) {
      copy.hidden = false;
      var originalCopy = copy.innerHTML;
      copy.addEventListener('click', async function () {
        try {
          await navigator.clipboard.writeText(document.querySelector('link[rel="canonical"]').href);
          copy.setAttribute('aria-label', 'Link copied');
          copy.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m20 6-11 11-5-5"/></svg>';
          setTimeout(function () { copy.innerHTML = originalCopy; copy.setAttribute('aria-label', 'Copy link'); }, 2000);
        } catch (_) { copy.setAttribute('aria-label', 'Copy the address from your browser'); }
      });
    }
    var citation = document.querySelector('[data-citation]');
    if (citation) {
      var year = currentPost ? new Date(currentPost.date).getFullYear() : new Date(document.querySelector('.article-meta time').dateTime).getFullYear();
      citation.textContent = (currentPost && themeData.citationName ? themeData.citationName : document.querySelector('[data-post-author]').textContent + '.') + ' (' + year + '). ' + document.querySelector('h1').textContent + '. ' + (themeData.title || document.title) + '. ' + document.querySelector('link[rel="canonical"]').href;
    }
    // Related posts are optional: feed access can be disabled by the blog owner.
    var related = document.querySelector('[data-related]');
    if (related && related.dataset.label) {
      var url = new URL('feeds/posts/default/-/' + encodeURIComponent(related.dataset.label), document.querySelector('[data-home]').href);
      url.search = '?alt=json&max-results=6';
      fetch(url.href, { credentials: 'same-origin' }).then(function (response) {
        if (!response.ok) throw new Error('Feed unavailable');
        return response.json();
      }).then(function (data) {
        var list = related.querySelector('[data-related-list]');
        (data.feed.entry || []).forEach(function (entry) {
          var alternate = (entry.link || []).find(function (link) { return link.rel === 'alternate'; });
          if (!alternate || list.children.length >= 3) return;
          var href = new URL(alternate.href);
          if (href.origin !== location.origin || href.pathname === location.pathname) return;
          var link = document.createElement('a');
          link.href = href.href;
          link.className = 'group flex gap-3 p-3 rounded-lg border border-divider hover:border-primary/40';
          var thumbnail = entry.media$thumbnail && entry.media$thumbnail.url;
          if (thumbnail) {
            var image = document.createElement('img'); image.src = thumbnail; image.alt = ''; image.width = 48; image.height = 48; image.loading = 'lazy'; image.className = 'w-12 h-12 rounded-md object-cover flex-shrink-0'; link.appendChild(image);
          }
          var details = document.createElement('div'); details.className = 'min-w-0';
          var title = document.createElement('h3'); title.className = 'font-display text-sm font-medium group-hover:text-primary line-clamp-2'; title.textContent = entry.title.$t; details.appendChild(title);
          if (entry.published && entry.published.$t) {
            var time = document.createElement('time'); time.dateTime = entry.published.$t; time.className = 'text-xs text-muted-foreground'; time.textContent = new Date(entry.published.$t).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); details.appendChild(time);
          }
          link.appendChild(details);
          list.appendChild(link);
        });
        related.hidden = !list.children.length;
      }).catch(function () { /* Core post and native label links remain available. */ });
    }
  }
  document.querySelectorAll('[data-current-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
}());
