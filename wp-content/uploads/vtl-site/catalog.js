(async function () {
    const script = document.currentScript;
    const form = document.querySelector('form.v-filter');
    const listing = document.querySelector('.v-main');
    if (!form || !listing) return;
    const data = await fetch(script.dataset.vtlCatalog).then(response => {
        if (!response.ok) throw new Error('Catalog unavailable');
        return response.json();
    });
    const query = new URLSearchParams(location.search);
    const term = (query.get('q') || '').trim().toLocaleLowerCase();
    const english = document.documentElement.lang.toLowerCase().startsWith('en');
    form.elements.q.value = query.get('q') || '';
    for (const input of form.querySelectorAll('input[type=checkbox]')) {
        input.checked = query.getAll(input.name).includes(input.value);
    }
    if (![...query.keys()].some(key => ['q','hang','giaiphap','p'].includes(key))) return;
    const filtered = data.items.filter(item => {
        if (term) {
            const card = document.createElement('template');
            card.innerHTML = item.html;
            const title = card.content.querySelector('.v-card__title')?.textContent || '';
            const summary = card.content.querySelector('.v-card__text')?.textContent || '';
            if (![title,summary,item.model || ''].some(text => text.toLocaleLowerCase().includes(term))) return false;
        }
        return ['hang','giaiphap'].every(key => {
            const values = query.getAll(key);
            return !values.length || values.some(value => item.filters[key]?.includes(value));
        });
    });
    const pageCount = Math.max(1,Math.ceil(filtered.length / data.size));
    const page = Math.min(pageCount,Math.max(1,parseInt(query.get('p'),10) || 1));
    const toolbar = listing.querySelector('.v-toolbar span');
    if (toolbar) toolbar.textContent = filtered.length + (english ? ' products' : ' sản phẩm');
    listing.querySelector('.v-cards, .v-empty')?.remove();
    listing.querySelector('.v-pager')?.closest('nav')?.remove();
    const results = document.createElement(filtered.length ? 'div' : 'p');
    results.className = filtered.length ? 'v-cards' : 'v-empty';
    if (filtered.length) results.innerHTML = filtered.slice((page-1)*data.size,page*data.size).map(item => item.html).join('');
    else results.textContent = english ? 'No matching results.' : 'Không có kết quả phù hợp.';
    listing.append(results);
    if (pageCount < 2) return;
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label','Pagination');
    const list = document.createElement('ul');
    list.className = 'v-pager';
    for (let number=1; number<=pageCount; number++) {
        const entry = document.createElement('li');
        const link = document.createElement('a');
        const params = new URLSearchParams(query);
        if (number === 1) params.delete('p'); else params.set('p',number);
        link.href = location.pathname + (params.size ? '?' + params.toString() : '');
        link.textContent = number;
        if (number === page) link.setAttribute('aria-current','page');
        entry.append(link);
        list.append(entry);
    }
    nav.append(list);
    listing.append(nav);
})().catch(error => console.error(error));
