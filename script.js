// ==UserScript==
// @name         Newtoki downloader
// @namespace    -
// @version      0.1
// @description  Download  raw manhwa images from Newtoki 
// @author       Hanif Anggara
// @match        https://newtoki.help/*
// @grant        GM_download
// ==/UserScript==


(function() {
    'use strict';

    // Function to download images
    function downloadImage(url, index) {
        GM_download({
            url: url,
            name: `image_${index}.jpg` // Rename the downloaded file
        });
    }

    // Wait for all images to load
    function waitForImagesToLoad() {
        return new Promise(resolve => {
            const images = document.querySelectorAll('img[src^="https://nownowcdn"]');
            if (images.length > 0) {
                let imageCount = 0;
                images.forEach((img, index) => {
                    if (img.complete || img.naturalWidth !== 0) {
                        imageCount++;
                        if (imageCount === images.length) {
                            resolve();
                        }
                    } else {
                        img.addEventListener('load', () => {
                            imageCount++;
                            if (imageCount === images.length) {
                                resolve();
                            }
                        });
                    }
                });
            } else {
                resolve();
            }
        });
    }

    // Function to add a download button
    function addDownloadButton() {
        const button = document.createElement('button');
        button.innerText = 'Download All Manga Images';
        button.style.position = 'fixed';
        button.style.top = '20px';
        button.style.right = '20px';
        button.style.zIndex = '9999';
        button.addEventListener('click', async () => {
            await waitForImagesToLoad();
            const images = document.querySelectorAll('img[src^="https://nownowcdn"]');
            images.forEach((img, index) => {
                downloadImage(img.src, index + 1);
            });
        });
        document.body.appendChild(button);
    }

    // Add download button when the DOM is ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        addDownloadButton();
    } else {
        document.addEventListener('DOMContentLoaded', addDownloadButton);
    }

})();
