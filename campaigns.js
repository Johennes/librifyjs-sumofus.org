// Copyright 2019 Johannes Marbach
//
// This file is part of "LibrifyJS: sumofus.org", hereafter referred
// to as the program.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.

(() => {
    let container = document.querySelector(".campaign-tiles")
    if (!container) {
        return
    }

    fetch(new Request('https://actions.sumofus.org/api/pages/featured.json'))
        .then(response => response.json())
        .catch(onError)
        .then(onResponse)
    
    function onResponse(json) {
        for (let i = 0; i < json.length; ++i) {
            let tile = createTile(json[i].title, json[i].url, json[i].image,
                json[i].campaign_action_count || json[i].action_count)
            container.insertAdjacentHTML('beforeend', tile)
        }
        container.querySelector('.campaign-tiles__loading').classList.add('hidden-irrelevant')
    }

    function onError() {
        container.querySelector('.campaign-tiles__loading').classList.add('hidden-irrelevant')
        container.querySelector('.campaign-tiles__failed').classList.remove('hidden-irrelevant')
    }
    
    function createTile(title, pageUrl, imageUrl, actionCount) {
        let backgroundStyle = ''
        if (imageUrl.length) {
            backgroundStyle = `background-image: url(${imageUrl})`
        }
        let overlay = `<div class="campaign-tile__overlay">${actionCount}</div>`
        return `
            <a class="campaign-tile campaign-tile--compact" href="${pageUrl}">
                <div class="campaign-tile__image" style="${backgroundStyle}">${overlay}</div>
                <div class="campaign-tile__lead">${title}</div>
                <div class="campaign-tile__cta campaign-tile__open-cta">Learn more &raquo;</div>
            </a>`
    }
})()
