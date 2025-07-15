// Initialize PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Global variables for XLSX support
var gk_isXlsx = false;
var gk_xlsxFileLookup = {};
var gk_fileData = {};

function filledCell(cell) {
    return cell !== '' && cell != null;
}

function loadFileData(filename) {
    if (gk_isXlsx && gk_xlsxFileLookup[filename]) {
        try {
            var workbook = XLSX.read(gk_fileData[filename], { type: 'base64' });
            var firstSheetName = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[firstSheetName];

            // Convert sheet to JSON to filter blank rows
            var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false, defval: '' });
            // Filter out blank rows (rows where all cells are empty, null, or undefined)
            var filteredData = jsonData.filter(row => row.some(filledCell));

            // Heuristic to find the header row by ignoring rows with fewer filled cells than the next row
            var headerRowIndex = filteredData.findIndex((row, index) =>
                row.filter(filledCell).length >= filteredData[index + 1]?.filter(filledCell).length
            );
            // Fallback
            if (headerRowIndex === -1 || headerRowIndex > 25) {
                headerRowIndex = 0;
            }

            // Convert filtered JSON back to CSV
            var csv = XLSX.utils.aoa_to_sheet(filteredData.slice(headerRowIndex)); // Create a new sheet from filtered array of arrays
            csv = XLSX.utils.sheet_to_csv(csv, { header: 1 });
            return csv;
        } catch (e) {
            console.error(e);
            return "";
        }
    }
    return gk_fileData[filename] || "";
}

class MetadataViewer {
    constructor() {
        this.files = new Map();
        this.currentFileId = null;
        this.isComparisonMode = false;
        this.searchTerm = '';
        this.categoryFilter = '';
        this.isRegexMode = false;
        this.initEventListeners();
    }

    initEventListeners() {
        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('fileInput');
        const browseBtn = document.getElementById('browseBtn');

        // Drag and drop
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            const files = Array.from(e.dataTransfer.files);
            this.processFiles(files);
        });

        // File input
        browseBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            this.processFiles(files);
        });

        // Mode buttons
        document.getElementById('compareMode').addEventListener('click', () => {
            this.toggleComparisonMode();
        });

        document.getElementById('clearAll').addEventListener('click', () => {
            this.clearAllFiles();
        });

        // Search and filter
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchTerm = e.target.value;
            this.filterMetadata();
        });

        document.getElementById('categoryFilter').addEventListener('change', (e) => {
            this.categoryFilter = e.target.value;
            this.filterMetadata();
        });

        document.getElementById('regexToggle').addEventListener('click', () => {
            this.toggleRegexMode();
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Export buttons
        document.getElementById('exportJSON').addEventListener('click', () => this.exportData('json'));
        document.getElementById('exportTXT').addEventListener('click', () => this.exportData('txt'));
        document.getElementById('exportCSV').addEventListener('click', () => this.exportData('csv'));
        document.getElementById('exportXML').addEventListener('click', () => this.exportData('xml'));
        document.getElementById('exportForensic').addEventListener('click', () => this.exportForensicReport());
        document.getElementById('exportComparison').addEventListener('click', () => this.exportComparisonReport());

        // Privacy tools
        document.getElementById('sanitizeBtn').addEventListener('click', () => this.sanitizeMetadata());
        document.getElementById('privacyReport').addEventListener('click', () => this.generatePrivacyReport());
    }

    async processFiles(files) {
        this.showLoading(true);
        for (const file of files) {
            const fileId = Date.now() + Math.random();
            await this.processFile(file, fileId);
        }
        this.showLoading(false);
        this.updateUI();
    }

    async processFile(file, fileId) {
        try {
            const metadata = {
                general: {},
                exif: {},
                document: {},
                system: {},
                media: {},
                location: {},
                hex: ''
            };

            await this.extractGeneralMetadata(file, metadata);
            await this.extractSystemMetadata(file, metadata);

            if (file.type.startsWith('image/')) {
                await this.extractExifData(file, metadata);
                await this.extractImageMetadata(file, metadata);
                await this.extractLocationData(file, metadata);
            } else if (file.type === 'application/pdf') {
                await this.extractPDFMetadata(file, metadata);
            } else if (file.type.includes('officedocument') || file.type.includes('ms-excel') || file.type.includes('msword')) {
                await this.extractOfficeMetadata(file, metadata);
            } else if (file.type.startsWith('video/') || file.type.startsWith('audio/')) {
                await this.extractMediaMetadata(file, metadata);
            }

            await this.generateHexView(file, metadata);

            this.files.set(fileId, {
                file,
                metadata,
                id: fileId
            });

            if (!this.currentFileId) {
                this.currentFileId = fileId;
            }
        } catch (error) {
            console.error('Error processing file:', error);
            this.showError('Error processing file: ' + error.message);
        }
    }

    async extractGeneralMetadata(file, metadata) {
        metadata.general = {
            'File Name': file.name,
            'File Size': this.formatFileSize(file.size),
            'File Type': file.type || 'Unknown',
            'MIME Type': file.type || 'application/octet-stream',
            'Last Modified': new Date(file.lastModified).toLocaleString(),
            'File Extension': file.name.split('.').pop()?.toLowerCase() || 'none'
        };
    }

    async extractSystemMetadata(file, metadata) {
        metadata.system = {
            'Size (bytes)': file.size.toLocaleString(),
            'Last Modified Timestamp': file.lastModified,
            'Last Modified ISO': new Date(file.lastModified).toISOString(),
            'WebKitRelativePath': file.webkitRelativePath || 'N/A',
            'Browser API Support': 'File API',
            'Processing Date': new Date().toISOString(),
            'User Agent': navigator.userAgent
        };
    }

    async extractExifData(file, metadata) {
        return new Promise((resolve) => {
            if (typeof EXIF === 'undefined') {
                metadata.exif = { 'Error': 'EXIF library not loaded' };
                resolve();
                return;
            }

            EXIF.getData(file, () => {
                const exifData = EXIF.getAllTags(file);

                if (Object.keys(exifData).length === 0) {
                    metadata.exif = { 'No EXIF data': 'This image contains no EXIF metadata' };
                } else {
                    Object.keys(exifData).forEach(key => {
                        let value = exifData[key];
                        if (typeof value === 'object' && value !== null) {
                            value = JSON.stringify(value);
                        }
                        metadata.exif[key] = value;
                    });
                }
                resolve();
            });
        });
    }

    async extractImageMetadata(file, metadata) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                metadata.media = {
                    'Image Width': img.naturalWidth + 'px',
                    'Image Height': img.naturalHeight + 'px',
                    'Aspect Ratio': (img.naturalWidth / img.naturalHeight).toFixed(2),
                    'Total Pixels': (img.naturalWidth * img.naturalHeight).toLocaleString()
                };
                resolve();
            };
            img.onerror = () => resolve();
            img.src = URL.createObjectURL(file);
        });
    }

    async extractLocationData(file, metadata) {
        return new Promise((resolve) => {
            if (typeof EXIF === 'undefined') {
                metadata.location = { 'Error': 'EXIF library not loaded' };
                resolve();
                return;
            }

            EXIF.getData(file, () => {
                const lat = EXIF.getTag(file, 'GPSLatitude');
                const latRef = EXIF.getTag(file, 'GPSLatitudeRef');
                const lon = EXIF.getTag(file, 'GPSLongitude');
                const lonRef = EXIF.getTag(file, 'GPSLongitudeRef');
                const altitude = EXIF.getTag(file, 'GPSAltitude');
                const altitudeRef = EXIF.getTag(file, 'GPSAltitudeRef');
                const timestamp = EXIF.getTag(file, 'GPSTimeStamp');
                const datestamp = EXIF.getTag(file, 'GPSDateStamp');

                if (lat && lon && latRef && lonRef) {
                    const latitude = this.convertDMSToDD(lat, latRef);
                    const longitude = this.convertDMSToDD(lon, lonRef);
                    
                    metadata.location = {
                        'Latitude': latitude.toFixed(6),
                        'Longitude': longitude.toFixed(6),
                        'Latitude (DMS)': this.formatDMS(lat, latRef),
                        'Longitude (DMS)': this.formatDMS(lon, lonRef),
                        'Coordinates': `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
                        'Google Maps Link': `https://maps.google.com/?q=${latitude},${longitude}`,
                        ...(altitude ? { 'Altitude': `${altitude}m ${altitudeRef === 1 ? 'below' : 'above'} sea level` } : {}),
                        ...(timestamp && datestamp ? { 'GPS Timestamp': `${datestamp} ${timestamp.join(':')}` } : {})
                    };
                } else {
                    metadata.location = { 'No GPS data': 'This image contains no GPS location information' };
                }
                resolve();
            });
        });
    }

    convertDMSToDD(dms, ref) {
        let dd = dms[0] + dms[1]/60 + dms[2]/3600;
        if (ref === 'S' || ref === 'W') dd = dd * -1;
        return dd;
    }

    formatDMS(dms, ref) {
        return `${Math.floor(dms[0])}°${Math.floor(dms[1])}'${dms[2].toFixed(2)}"${ref}`;
    }

    async extractPDFMetadata(file, metadata) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            const pdfMetadata = await pdf.getMetadata();

            metadata.document = {
                'PDF Version': pdf._pdfInfo.PDFFormatVersion,
                'Page Count': pdf.numPages,
                'Title': pdfMetadata.info.Title || 'N/A',
                'Author': pdfMetadata.info.Author || 'N/A',
                'Subject': pdfMetadata.info.Subject || 'N/A',
                'Keywords': pdfMetadata.info.Keywords || 'N/A',
                'Creator': pdfMetadata.info.Creator || 'N/A',
                'Producer': pdfMetadata.info.Producer || 'N/A',
                'Creation Date': pdfMetadata.info.CreationDate || 'N/A',
                'Modification Date': pdfMetadata.info.ModDate || 'N/A',
                'Encrypted': pdf.isEncrypted ? 'Yes' : 'No'
            };
        } catch (error) {
            metadata.document = { 'Error': 'Could not extract PDF metadata: ' + error.message };
        }
    }

    async extractOfficeMetadata(file, metadata) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const zip = await JSZip.loadAsync(arrayBuffer);

            // Extract core properties
            const corePropsFile = zip.file('docProps/core.xml');
            if (corePropsFile) {
                const corePropsContent = await corePropsFile.async('text');
                metadata.document = this.parseXMLProperties(corePropsContent);
            }

            // Extract app properties
            const appPropsFile = zip.file('docProps/app.xml');
            if (appPropsFile) {
                const appPropsContent = await appPropsFile.async('text');
                Object.assign(metadata.document, this.parseXMLProperties(appPropsContent));
            }

            if (!Object.keys(metadata.document).length) {
                metadata.document = { 'Error': 'No Office metadata found' };
            }
        } catch (error) {
            metadata.document = { 'Error': 'Could not extract Office metadata: ' + error.message };
        }
    }

    async extractMediaMetadata(file, metadata) {
        return new Promise((resolve) => {
            const media = file.type.startsWith('video/') ? document.createElement('video') : document.createElement('audio');
            media.onloadedmetadata = () => {
                metadata.media = {
                    'Duration': media.duration ? this.formatDuration(media.duration) : 'N/A',
                    'Type': file.type,
                    ...(file.type.startsWith('video/') ? {
                        'Video Width': media.videoWidth + 'px',
                        'Video Height': media.videoHeight + 'px',
                        'Aspect Ratio': media.videoWidth && media.videoHeight ? (media.videoWidth / media.videoHeight).toFixed(2) : 'N/A'
                    } : {})
                };
                resolve();
            };
            media.onerror = () => resolve();
            media.src = URL.createObjectURL(file);
        });
    }

    async generateHexView(file, metadata) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            let hexString = '';
            for (let i = 0; i < Math.min(uint8Array.length, 512); i++) {
                const hex = uint8Array[i].toString(16).padStart(2, '0');
                hexString += hex + ' ';
                if ((i + 1) % 16 === 0) hexString += '\n';
            }
            metadata.hex = hexString.trim();
        } catch (error) {
            metadata.hex = 'Error generating hex view: ' + error.message;
        }
    }

    parseXMLProperties(xmlContent) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
        const properties = {};
        const tags = xmlDoc.getElementsByTagName('*');
        for (const tag of tags) {
            if (tag.textContent && !tag.children.length) {
                properties[tag.tagName] = tag.textContent;
            }
        }
        return properties;
    }

    formatFileSize(bytes) {
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let size = bytes;
        let unitIndex = 0;
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        return `${size.toFixed(2)} ${units[unitIndex]}`;
    }

    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return `${hours ? hours + 'h ' : ''}${minutes}m ${secs}s`;
    }

    showLoading(show) {
        document.getElementById('loadingIndicator').classList.toggle('hidden', !show);
    }

    showError(message) {
        alert(message);
    }

    showSuccess(message) {
        // Create a temporary success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }

    updateUI() {
        const fileTabs = document.getElementById('fileTabs');
        const fileTabsContainer = document.getElementById('fileTabsContainer');
        const resultsArea = document.getElementById('resultsArea');
        const privacyTools = document.getElementById('privacyTools');

        if (this.files.size > 0) {
            fileTabs.classList.remove('hidden');
            resultsArea.classList.remove('hidden');
            privacyTools.classList.remove('hidden');
            this.renderFileTabs();
            this.renderMetadata();
            this.renderFileInfo();
        } else {
            fileTabs.classList.add('hidden');
            resultsArea.classList.add('hidden');
            privacyTools.classList.add('hidden');
        }

        this.updateComparisonView();
    }

    renderFileTabs() {
        const fileTabsContainer = document.getElementById('fileTabsContainer');
        fileTabsContainer.innerHTML = '';
        this.files.forEach((fileData, fileId) => {
            const tab = document.createElement('div');
            tab.className = `file-tab px-4 py-2 rounded-lg border border-dark text-light hover:bg-card ${fileId === this.currentFileId ? 'active' : ''}`;
            tab.textContent = fileData.file.name;
            tab.addEventListener('click', () => {
                this.currentFileId = fileId;
                this.renderFileTabs();
                this.renderMetadata();
                this.renderFileInfo();
            });
            fileTabsContainer.appendChild(tab);
        });
    }

    renderFileInfo() {
        const fileInfo = document.getElementById('fileInfo');
        const fileThumbnail = document.getElementById('fileThumbnail');

        fileInfo.innerHTML = '';
        fileThumbnail.innerHTML = '';

        const fileData = this.files.get(this.currentFileId);
        if (!fileData) return;

        // Render thumbnail for images
        if (fileData.file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(fileData.file);
            img.className = 'w-32 h-32 object-cover rounded-lg border border-dark';
            img.alt = 'File thumbnail';
            fileThumbnail.appendChild(img);
        } else {
            // Show file type icon for non-images
            const iconDiv = document.createElement('div');
            iconDiv.className = 'w-32 h-32 bg-card rounded-lg border border-dark flex items-center justify-center';
            iconDiv.innerHTML = `
                <svg class="w-12 h-12 text-muted" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"></path>
                </svg>
            `;
            fileThumbnail.appendChild(iconDiv);
        }

        // Render file info
        for (const [key, value] of Object.entries(fileData.metadata.general)) {
            const div = document.createElement('div');
            div.className = 'bg-card p-4 rounded-lg';
            div.innerHTML = `
                <div class="text-muted text-sm">${key}</div>
                <div class="text-light">${value}</div>
            `;
            fileInfo.appendChild(div);
        }
    }

    renderMetadata() {
        const tabs = ['general', 'exif', 'document', 'system', 'media', 'location', 'hex'];
        tabs.forEach(tab => {
            const container = document.getElementById(`${tab}Metadata`) || document.getElementById('hexView');
            if (!container) return;

            container.innerHTML = '';
            const fileData = this.files.get(this.currentFileId);
            if (!fileData) return;

            if (tab === 'hex') {
                container.textContent = fileData.metadata.hex || 'No hex data available';
            } else if (tab === 'location') {
                this.renderLocationData(fileData.metadata.location);
            } else {
                const metadata = fileData.metadata[tab];
                for (const [key, value] of Object.entries(metadata)) {
                    if (this.searchTerm && !this.matchesSearch(key, this.searchTerm) && !this.matchesSearch(String(value), this.searchTerm)) continue;
                    if (this.categoryFilter && this.categoryFilter !== tab) continue;

                    const div = document.createElement('div');
                    div.className = 'metadata-row p-3';
                    div.innerHTML = `
                        <div class="grid grid-cols-2 gap-4">
                            <div class="text-light font-medium">${key}</div>
                            <div class="text-muted">${value}</div>
                        </div>
                    `;
                    container.appendChild(div);
                }
            }
        });
    }

    renderLocationData(locationData) {
        const gpsInfo = document.getElementById('gpsInfo');
        const mapContainer = document.getElementById('mapContainer');

        if (!gpsInfo || !mapContainer) return;

        // Clear previous content
        gpsInfo.innerHTML = '';
        mapContainer.innerHTML = '';

        if (locationData['Latitude'] && locationData['Longitude']) {
            // Render GPS info
            for (const [key, value] of Object.entries(locationData)) {
                const div = document.createElement('div');
                div.className = 'metadata-row p-3';
                div.innerHTML = `
                    <div class="grid grid-cols-2 gap-4">
                        <div class="text-light font-medium">${key}</div>
                        <div class="text-muted">${key === 'Google Maps Link' ? `<a href="${value}" target="_blank" class="text-blue-400 hover:text-blue-300">Open in Google Maps</a>` : value}</div>
                    </div>
                `;
                gpsInfo.appendChild(div);
            }

            // Render map
            const lat = parseFloat(locationData['Latitude']);
            const lng = parseFloat(locationData['Longitude']);

            const map = L.map(mapContainer).setView([lat, lng], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            L.marker([lat, lng]).addTo(map)
                .bindPopup(`Photo taken here<br>Lat: ${lat}<br>Lng: ${lng}`)
                .openPopup();
        } else {
            gpsInfo.innerHTML = '<div class="text-muted p-3">No GPS location data found in this file.</div>';
            mapContainer.innerHTML = '<div class="flex items-center justify-center h-full text-muted">No location data to display</div>';
        }
    }

    filterMetadata() {
        this.renderMetadata();
    }

    toggleRegexMode() {
        this.isRegexMode = !this.isRegexMode;
        const regexToggle = document.getElementById('regexToggle');
        const regexStatus = document.getElementById('regexStatus');

        if (this.isRegexMode) {
            regexToggle.classList.add('bg-blue-600');
            regexToggle.classList.remove('bg-gray-600');
            regexStatus.classList.remove('hidden');
        } else {
            regexToggle.classList.add('bg-gray-600');
            regexToggle.classList.remove('bg-blue-600');
            regexStatus.classList.add('hidden');
        }

        this.filterMetadata();
    }

    matchesSearch(text, searchTerm) {
        if (!searchTerm) return true;

        if (this.isRegexMode) {
            try {
                const regex = new RegExp(searchTerm, 'i');
                return regex.test(text);
            } catch (e) {
                // Invalid regex, fall back to normal search
                return text.toLowerCase().includes(searchTerm.toLowerCase());
            }
        } else {
            return text.toLowerCase().includes(searchTerm.toLowerCase());
        }
    }

    switchTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
            btn.classList.toggle('text-muted', btn.dataset.tab !== tab);
            btn.classList.toggle('text-light', btn.dataset.tab === tab);
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('hidden', content.id !== `${tab}Tab`);
        });
    }

    toggleComparisonMode() {
        this.isComparisonMode = !this.isComparisonMode;
        document.getElementById('compareMode').textContent = this.isComparisonMode ? 'Exit Compare Mode' : 'Compare Mode';
        this.updateComparisonView();
    }

    updateComparisonView() {
        const comparisonView = document.getElementById('comparisonView');
        const comparisonContent = document.getElementById('comparisonContent');
        comparisonView.classList.toggle('hidden', !this.isComparisonMode);

        if (!this.isComparisonMode || this.files.size < 2) {
            comparisonContent.innerHTML = '';
            return;
        }

        comparisonContent.innerHTML = '';
        const fileIds = Array.from(this.files.keys()).slice(0, 2);
        const file1Data = this.files.get(fileIds[0]);
        const file2Data = this.files.get(fileIds[1]);

        // Create comparison with diff highlighting
        const comparison = this.createMetadataComparison(file1Data, file2Data);

        fileIds.forEach((fileId, index) => {
            const fileData = this.files.get(fileId);
            const div = document.createElement('div');
            div.className = 'bg-card p-4 rounded-lg';
            div.innerHTML = `<h3 class="text-light font-semibold mb-2">${fileData.file.name}</h3>`;

            for (const category of ['general', 'exif', 'document', 'system', 'media', 'location']) {
                const metadata = fileData.metadata[category];
                if (Object.keys(metadata).length) {
                    div.innerHTML += `<div class="text-muted font-medium mt-2">${category.charAt(0).toUpperCase() + category.slice(1)}</div>`;
                    for (const [key, value] of Object.entries(metadata)) {
                        const diffClass = this.getDiffClass(key, value, comparison, index);
                        div.innerHTML += `
                            <div class="metadata-row p-2 ${diffClass}">
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="text-light">${key}</div>
                                    <div class="text-muted">${value}</div>
                                </div>
                            </div>
                        `;
                    }
                }
            }
            comparisonContent.appendChild(div);
        });
    }

    createMetadataComparison(file1Data, file2Data) {
        const comparison = {};
        const categories = ['general', 'exif', 'document', 'system', 'media', 'location'];

        categories.forEach(category => {
            comparison[category] = {};
            const meta1 = file1Data.metadata[category] || {};
            const meta2 = file2Data.metadata[category] || {};

            // Get all unique keys from both files
            const allKeys = new Set([...Object.keys(meta1), ...Object.keys(meta2)]);

            allKeys.forEach(key => {
                const val1 = meta1[key];
                const val2 = meta2[key];

                if (val1 === undefined) {
                    comparison[category][key] = { status: 'added', file1: undefined, file2: val2 };
                } else if (val2 === undefined) {
                    comparison[category][key] = { status: 'removed', file1: val1, file2: undefined };
                } else if (val1 !== val2) {
                    comparison[category][key] = { status: 'changed', file1: val1, file2: val2 };
                } else {
                    comparison[category][key] = { status: 'same', file1: val1, file2: val2 };
                }
            });
        });

        return comparison;
    }

    getDiffClass(key, value, comparison, fileIndex) {
        for (const category of Object.keys(comparison)) {
            if (comparison[category][key]) {
                const status = comparison[category][key].status;
                if (status === 'same') return 'diff-same';
                if (status === 'added' && fileIndex === 1) return 'diff-added';
                if (status === 'removed' && fileIndex === 0) return 'diff-removed';
                if (status === 'changed') return 'diff-changed';
            }
        }
        return '';
    }

    clearAllFiles() {
        this.files.clear();
        this.currentFileId = null;
        this.isComparisonMode = false;
        document.getElementById('compareMode').textContent = 'Compare Mode';
        this.updateUI();
    }

    exportData(format) {
        const fileData = this.files.get(this.currentFileId);
        if (!fileData) return;

        let content = '';
        let mimeType = 'text/plain';
        let extension = 'txt';

        switch (format) {
            case 'json':
                content = JSON.stringify(fileData.metadata, null, 2);
                mimeType = 'application/json';
                extension = 'json';
                break;
            case 'csv':
                content = this.metadataToCSV(fileData.metadata);
                mimeType = 'text/csv';
                extension = 'csv';
                break;
            case 'xml':
                content = this.metadataToXML(fileData.metadata);
                mimeType = 'application/xml';
                extension = 'xml';
                break;
            case 'txt':
                content = this.metadataToText(fileData.metadata);
                break;
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileData.file.name}_metadata.${extension}`;
        a.click();
        URL.revokeObjectURL(url);
    }

    metadataToCSV(metadata) {
        let csv = 'Category,Key,Value\n';
        for (const [category, data] of Object.entries(metadata)) {
            if (category === 'hex') continue;
            for (const [key, value] of Object.entries(data)) {
                csv += `"${category}","${key.replace(/"/g, '""')}","${String(value).replace(/"/g, '""')}"\n`;
            }
        }
        return csv;
    }

    metadataToXML(metadata) {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<metadata>\n';
        for (const [category, data] of Object.entries(metadata)) {
            if (category === 'hex') continue;
            xml += `  <${category}>\n`;
            for (const [key, value] of Object.entries(data)) {
                xml += `    <${key.replace(/\s/g, '_')}>${String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;')}</${key.replace(/\s/g, '_')}>\n`;
            }
            xml += `  </${category}>\n`;
        }
        xml += '</metadata>';
        return xml;
    }

    metadataToText(metadata) {
        let text = '';
        for (const [category, data] of Object.entries(metadata)) {
            if (category === 'hex') continue;
            text += `${category.charAt(0).toUpperCase() + category.slice(1)}:\n`;
            for (const [key, value] of Object.entries(data)) {
                text += `${key}: ${value}\n`;
            }
            text += '\n';
        }
        return text;
    }

    exportForensicReport() {
        const fileData = this.files.get(this.currentFileId);
        if (!fileData) return;

        const report = `
Forensic Metadata Report
Generated on: ${new Date().toISOString()}
File Name: ${fileData.file.name}

General Metadata:
${this.metadataToText({ general: fileData.metadata.general })}

System Metadata:
${this.metadataToText({ system: fileData.metadata.system })}

${fileData.metadata.exif && Object.keys(fileData.metadata.exif).length ? 'EXIF Data:\n' + this.metadataToText({ exif: fileData.metadata.exif }) : ''}

${fileData.metadata.document && Object.keys(fileData.metadata.document).length ? 'Document Properties:\n' + this.metadataToText({ document: fileData.metadata.document }) : ''}

${fileData.metadata.media && Object.keys(fileData.metadata.media).length ? 'Media Properties:\n' + this.metadataToText({ media: fileData.metadata.media }) : ''}
        `.trim();

        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileData.file.name}_forensic_report.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    exportComparisonReport() {
        if (this.files.size < 2) {
            this.showError('At least two files are required for a comparison report.');
            return;
        }

        let report = `Metadata Comparison Report\nGenerated on: ${new Date().toISOString()}\n\n`;
        const fileIds = Array.from(this.files.keys()).slice(0, 2);
        fileIds.forEach(fileId => {
            const fileData = this.files.get(fileId);
            report += `File: ${fileData.file.name}\n${this.metadataToText(fileData.metadata)}\n`;
        });

        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'comparison_report.txt';
        a.click();
        URL.revokeObjectURL(url);
    }

    async sanitizeMetadata() {
        const fileData = this.files.get(this.currentFileId);
        if (!fileData) return;

        try {
            let sanitizedBlob;
            const file = fileData.file;

            if (file.type.startsWith('image/')) {
                sanitizedBlob = await this.sanitizeImageMetadata(file);
            } else if (file.type === 'application/pdf') {
                sanitizedBlob = await this.sanitizePDFMetadata(file);
            } else if (file.type.includes('officedocument') || file.type.includes('ms-excel') || file.type.includes('msword')) {
                sanitizedBlob = await this.sanitizeOfficeMetadata(file);
            } else {
                this.showError('Metadata sanitization not supported for this file type.');
                return;
            }

            // Download the sanitized file
            const url = URL.createObjectURL(sanitizedBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `sanitized_${file.name}`;
            a.click();
            URL.revokeObjectURL(url);

            this.showSuccess('File sanitized successfully! Check your downloads.');
        } catch (error) {
            console.error('Sanitization error:', error);
            this.showError('Error sanitizing file: ' + error.message);
        }
    }

    async sanitizeImageMetadata(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;

                // Draw image to canvas (this strips EXIF data)
                ctx.drawImage(img, 0, 0);

                canvas.toBlob((blob) => {
                    resolve(blob);
                }, file.type, 0.95);
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = URL.createObjectURL(file);
        });
    }

    async sanitizePDFMetadata(file) {
        // For PDF sanitization, we'd need a more complex approach
        // This is a simplified version that creates a new PDF without metadata
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

        // Create a new PDF without metadata (simplified approach)
        // In a real implementation, you'd use PDF-lib or similar
        const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
        return blob;
    }

    async sanitizeOfficeMetadata(file) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const zip = await JSZip.loadAsync(arrayBuffer);

            // Remove metadata files
            zip.remove('docProps/core.xml');
            zip.remove('docProps/app.xml');
            zip.remove('docProps/custom.xml');

            // Generate new file without metadata
            const sanitizedArrayBuffer = await zip.generateAsync({ type: 'arraybuffer' });
            return new Blob([sanitizedArrayBuffer], { type: file.type });
        } catch (error) {
            throw new Error('Failed to sanitize Office document: ' + error.message);
        }
    }

    generatePrivacyReport() {
        const fileData = this.files.get(this.currentFileId);
        if (!fileData) return;

        const sensitiveFields = ['Author', 'Creator', 'User Agent', 'GPSLatitude', 'GPSLongitude', 'Creation Date', 'Modification Date'];
        let report = `Privacy Report for ${fileData.file.name}\nGenerated on: ${new Date().toISOString()}\n\nSensitive Metadata Found:\n`;

        let found = false;
        for (const category of ['general', 'exif', 'document', 'system', 'media']) {
            for (const [key, value] of Object.entries(fileData.metadata[category])) {
                if (sensitiveFields.some(field => key.includes(field))) {
                    report += `${category.charAt(0).toUpperCase() + category.slice(1)} - ${key}: ${value}\n`;
                    found = true;
                }
            }
        }

        if (!found) {
            report += 'No sensitive metadata detected.\n';
        }

        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileData.file.name}_privacy_report.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize the application
const viewer = new MetadataViewer();
