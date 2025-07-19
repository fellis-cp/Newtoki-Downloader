(async () => {
    // using jszip
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    document.head.appendChild(script);

    // Wait for JSZip to load
    await new Promise(resolve => {
        script.onload = resolve;
    });

    const zip = new JSZip();
    const folder = zip.folder('webtoon_images');

    const images = Array.from(document.querySelectorAll('img'))
        .filter(img => img.src.includes('/data/file/webtoon/'));

    console.log(`Found ${images.length} images`);

    for (let i = 0; i < images.length; i++) {
        const url = images[i].src;
        const filename = url.split('/').pop().split('?')[0] || `image_${i + 1}.jpg`;

        const blob = await fetch(url).then(res => res.blob());
        folder.file(filename, blob);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });

    const a = document.createElement('a');
    a.href = URL.createObjectURL(zipBlob);
    a.download = 'webtoon_images.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
})();

// sync method using console
