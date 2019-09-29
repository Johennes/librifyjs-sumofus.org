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
    removeNoScriptSpan()
    positionLabels()
    resizeCountrySelect()

    document.querySelector('.action-form__submit-button').addEventListener('click', onFormSubmit)

    function removeNoScriptSpan() {
        let span = document.querySelector('.petition-bar__main > span')
        if (span) {
            span.remove()
        }
    }

    function positionLabels() {
        document.querySelectorAll('form.action-form [name]').forEach(node => {
            let label = node
            while (label && label.tagName != 'LABEL') {
                label = label.previousSibling
            }
            if (label) {
                label.classList.add('sweet-placeholder__label--full')
            }
        })
    }

    function resizeCountrySelect() {
        let select = document.querySelector('select[name=country]')
        if (select) {
            select.style.height = "auto"
        }
    }

    function onFormSubmit(event) {
        event.preventDefault()
        event.stopPropagation()

        unmarkInvalidFields()
      
        let form = document.querySelector('form.action-form')
        let url = `https://actions.sumofus.org${form.getAttribute('action')}`
        let request = new Request(url, {method: 'POST', body: new FormData(form)})
        
        fetch(request)
            .then(response => response.json())
            .catch(onFormSubmitError)
            .then(onFormSubmitSuccess)
    }

    function onFormSubmitError(error) {
        console.log(error)
    }

    function onFormSubmitSuccess(json) {
        if (json.errors) {
            markInvalidFields(json)
            return
        }

        let url = json['follow_up_url']
        window.location.href = url
    }

    function markInvalidFields(json) {
        for (property in json.errors) {
            if (!json.errors.hasOwnProperty(property)) {
                continue
            }
            let element = document.querySelector(`[name=${property}]`)
            if (!element) {
                continue
            }
            element.classList.add('has-error')
            element.parentNode.classList.add('has-error')
            element.parentNode.insertAdjacentHTML('beforeend', `<div class='error-msg'>${json.errors[property]}</div>`)
        }
    }

    function unmarkInvalidFields() {
        document.querySelectorAll('.has-error').forEach(node => node.classList.remove('has-error'))
        document.querySelectorAll('.error-msg').forEach(node => node.parentNode.removeChild(node))
    }
})()
