// ==UserScript==
// @name         VirusTotal Linkify
// @namespace    https://www.virustotal.com/
// @version      2.0.0
// @description  Changes SHA-256 hash on VirusTotal result pages to VTi search links and always displays menu.
// @author       fwosar
// @match        *://*.virustotal.com/
// @match        *://virustotalcloud.appspot.com/nui/index.html
// @grant        none
// @updateURL    https://openuserjs.org/meta/fwosar/VirusTotal_Linkify.meta.js
// @run-at       document-idle
// ==/UserScript==


function updateVtiLink(hash)
{
    document.getElementById('lookup_in_vti').setAttribute("href", "https://www.virustotal.com/intelligence/search/?query=" + hash);
}

function tagHash() {
    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
    function searchUrl(h) {
        return 'https://www.virustotal.com/intelligence/search/?query=' + h.trim();
    }

    var xpath = '//*[@id="file-summary"]/tbody/tr[1]/td';
    var hashElement = getElementByXpath(xpath);

    if (hashElement) {
        hashElement.id = 'vt_result_hash';
        updateVtiLink(hashElement.innerHTML);
    }
}

function adjustMenu() {
    if (!document.getElementById("itemActionsMenu").classList.contains("opened"))
    {
        var menu = document.getElementById("itemActions");
        var button = document.createElement("a");
        console.log(menu);
        document.getElementById("itemActionsMenu").classList.add("opened");
        button.id = "lookup_in_vti";
        button.setAttribute("class", "paper-fab-0");
        button.setAttribute("mini", "");
        button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><path d="M497.9 430.1L380.5 312.6c-17.5 27.2-40.7 50.4-67.9 67.9l117.5 117.5c18.8 18.8 49.2 18.8 67.9 0C516.7 479.2 516.7 448.8 497.9 430.1z"/><path d="M384 192C384 86 298 0 192 0S0 86 0 192s86 192 192 192S384 298 384 192zM192 336c-79.4 0-144-64.6-144-144S112.6 48 192 48s144 64.6 144 144S271.4 336 192 336z"/><path d="M80 192h32c0-44.1 35.9-80 80-80V80C130.3 80 80 130.3 80 192z"/></svg>';
        menu.insertBefore(button, menu.firstChild);
    }
}

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

(function(){
    addGlobalStyle('.vt-result-header-0 #itemActions { top:45px !important; } .vt-result-header-0 #itemActions>paper-fab,#lookup_in_vti { margin-bottom: 5px !important; } #lookup_in_vti { fill: #ffffff; color: #ffffff; background-color: #394eff; width: 40px; height: 40px; padding: 8px; box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2); cursor: pointer; min-width: 0; outline: none; }');
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes) {
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    var node = mutation.addedNodes[i];
                    if (node.id == "itemActionsMenu")
                    {
                        adjustMenu();
                        tagHash();
                    }
                }
            }

            if ((mutation.type == "characterData") && (mutation.target.parentNode.id == "vt_result_hash"))
            {
                updateVtiLink(mutation.target.data);
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: true,
    });
})();