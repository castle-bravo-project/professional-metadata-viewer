# 🔍 Professional Metadata Viewer

**The Ultimate Privacy-First Tool for Digital File Analysis**

> **Perfect for:** Journalists, Legal Professionals, Privacy Advocates, Digital Forensics, Content Creators, and Anyone Who Cares About Digital Privacy

![Professional Metadata Viewer](https://img.shields.io/badge/Status-Active-green) ![License](https://img.shields.io/badge/License-MIT-blue) ![Privacy](https://img.shields.io/badge/Privacy-100%25%20Local-brightgreen) ![No Signup](https://img.shields.io/badge/No%20Signup-Required-orange)

---

## 🎯 **What Does This Tool Do?**

**In Simple Terms:** This tool reveals hidden information in your digital files and helps you remove it before sharing.

Every digital file contains **hidden metadata** - invisible information about:
- 📸 **Photos**: Where they were taken, what camera was used, when they were shot
- 📄 **Documents**: Who created them, when, what software was used, revision history
- 🎵 **Media Files**: Recording details, software used, timestamps
- 💾 **All Files**: Creation dates, modification history, system information

**Why This Matters:**
- **Privacy Protection**: Remove personal info before sharing files online
- **Legal Evidence**: Verify authenticity and track document history
- **Digital Forensics**: Investigate file origins and modifications
- **Content Creation**: Understand technical details of media files
- **Security Auditing**: Check what information your files reveal

---

## ✨ **Key Features (All Working Now!)**

### 🛡️ **100% Private & Secure**
- ✅ **No Internet Required** - Works completely offline
- ✅ **No File Uploads** - Everything stays on your computer
- ✅ **No Registration** - Use immediately, no accounts needed
- ✅ **No Tracking** - We don't collect any data about you

### 🔧 **Powerful Analysis Tools**
- 🗺️ **GPS Mapping** - See exactly where photos were taken on interactive maps
- 🔍 **Smart Search** - Find specific metadata with regular expressions
- 📊 **File Comparison** - Compare metadata between files with visual highlighting
- 🖼️ **Image Previews** - See thumbnails of your photos
- 📈 **Export Reports** - Generate professional forensic reports

### 🧹 **Metadata Sanitization**
- 🖼️ **Clean Images** - Remove EXIF data from photos (GPS, camera info, etc.)
- 📄 **Clean Documents** - Strip author info and revision history from PDFs/Office files
- 💾 **Download Clean Files** - Get sanitized versions ready for safe sharing

### 📁 **Supported File Types**
- **Images**: JPEG, PNG, TIFF, GIF
- **Documents**: PDF, Word (DOCX), Excel (XLSX)
- **Media**: MP4, MP3, AVI, MOV
- **More formats coming soon!**

---

## 🚀 **Quick Start Guide (No Technical Skills Required!)**

### **Method 1: Use Online (Easiest)**
1. 🌐 **Visit**: [https://castle-bravo-project.github.io/professional-metadata-viewer/](https://castle-bravo-project.github.io/professional-metadata-viewer/)
2. 📁 **Upload Files**: Drag & drop or click "Browse Files"
3. 🔍 **Analyze**: Click through the tabs to see all metadata
4. 🧹 **Clean Files**: Use "Sanitize Current File" to remove metadata
5. 📊 **Export**: Generate reports or download clean files

### **Method 2: Download & Run Locally (Most Secure)**
1. 📥 **Download**: Click the green "Code" button → "Download ZIP"
2. 📂 **Extract**: Unzip the downloaded file to your computer
3. 🌐 **Open**: Double-click `index.html` to open in your browser
4. ✅ **Done**: Start analyzing files immediately!

### **Method 3: For Developers**
```bash
git clone https://github.com/castle-bravo-project/professional-metadata-viewer.git
cd professional-metadata-viewer
# Open index.html in your browser or run a local server
python -m http.server 8000
```

---

## 📖 **How to Use (Step-by-Step)**

### **🔍 Basic Analysis**
1. **Upload a File**
   - Drag & drop any supported file onto the upload area
   - Or click "Browse Files" to select from your computer

2. **Explore the Tabs**
   - **General**: File size, type, dates
   - **EXIF Data**: Camera settings, photo details
   - **GPS Location**: Interactive map showing where photo was taken
   - **Document Properties**: Author, creation software, revision history
   - **System**: Technical file information
   - **Hex View**: Raw file data (for advanced users)

3. **Search & Filter**
   - Use the search box to find specific metadata
   - Click the ".*" button to enable regex search for power users
   - Filter by category to focus on specific types of data

### **🗺️ GPS Location Features**
- **View Photo Locations**: See exactly where photos were taken
- **Interactive Maps**: Zoom, pan, and explore the location
- **Coordinate Details**: Get precise latitude/longitude
- **Google Maps Links**: Open location in Google Maps with one click

### **📊 File Comparison**
1. Upload 2 or more files
2. Click "Compare Mode"
3. See visual differences:
   - 🟢 **Green**: Data only in second file
   - 🔴 **Red**: Data only in first file
   - 🟡 **Orange**: Different values between files
   - **Gray**: Identical data

### **🧹 Cleaning Files (Removing Metadata)**
1. Select the file you want to clean
2. Click "Sanitize Current File" in the Privacy Tools section
3. Download the cleaned file (original stays unchanged)
4. Share the clean file safely!

### **📈 Generating Reports**
- **Privacy Report**: Lists potentially sensitive metadata
- **Forensic Report**: Professional analysis document
- **Comparison Report**: Detailed differences between files
- **Export Formats**: JSON, CSV, XML, or plain text

---

## 📚 **Reference Guide**

### **🔍 What Metadata Can Reveal About You**

#### **📸 Photo Metadata (EXIF Data)**
- **Location**: Exact GPS coordinates where photo was taken
- **Camera Info**: Make, model, serial number
- **Settings**: ISO, aperture, shutter speed, flash settings
- **Software**: Photo editing apps used
- **Timestamps**: When photo was taken vs. when file was created
- **Personal Info**: Copyright, artist name, comments

#### **📄 Document Metadata**
- **Author Information**: Creator's name, organization
- **Revision History**: Who edited the document and when
- **Software Details**: What program created/edited the file
- **Template Info**: Document templates used
- **Comments & Annotations**: Hidden reviewer comments
- **Print History**: When and where document was printed

#### **🎵 Media File Metadata**
- **Recording Details**: When and where recorded
- **Equipment Info**: Microphones, cameras, software used
- **Creator Information**: Artist, producer, studio details
- **Technical Specs**: Bitrate, codec, resolution
- **Editing History**: Software used for post-production

### **🛠 Supported File Types & What We Extract**

| File Type | Extensions | Key Metadata Extracted |
|-----------|------------|------------------------|
| **📸 Images** | `.jpg`, `.jpeg`, `.png`, `.tiff`, `.gif` | EXIF data, GPS coordinates, camera settings, dimensions, color profiles |
| **📄 Documents** | `.pdf`, `.docx`, `.xlsx`, `.pptx` | Author, creation/modification dates, software used, revision history, comments |
| **🎵 Audio** | `.mp3`, `.wav`, `.m4a`, `.flac` | Artist, album, recording date, bitrate, duration, encoding software |
| **🎬 Video** | `.mp4`, `.avi`, `.mov`, `.mkv` | Resolution, codec, duration, creation date, camera/software info |
| **📦 Archives** | `.zip`, `.rar` (basic) | File structure, compression details, creation dates |

### **🔒 Privacy Risk Levels**

#### **🔴 HIGH RISK** - Remove Before Sharing
- GPS coordinates in photos
- Author names in documents
- Personal comments/annotations
- Software serial numbers
- Network/computer names

#### **🟡 MEDIUM RISK** - Consider Removing
- Camera make/model
- Software versions used
- Creation timestamps
- File modification history
- Technical specifications

#### **🟢 LOW RISK** - Usually Safe
- File size and format
- Basic technical specs
- Color profiles
- Compression settings

---

## 💡 **Tips & Tricks**

### **🔍 Smart Search Techniques**

#### **Basic Search Examples**
- `GPS` - Find all GPS-related metadata
- `Author` - Find document creator information
- `2023` - Find dates from 2023
- `iPhone` - Find photos taken with iPhone

#### **🧙‍♂️ Advanced Regex Search Examples**
*Click the ".*" button to enable regex mode*

| Search Pattern | What It Finds | Example Use Case |
|----------------|---------------|------------------|
| `GPS.*` | All GPS-related fields | Find location data in photos |
| `\d{4}-\d{2}-\d{2}` | Date patterns (YYYY-MM-DD) | Find creation dates |
| `Canon\|Nikon\|Sony` | Major camera brands | Find photos from specific cameras |
| `[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}` | Email addresses | Find contact info in documents |
| `\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}` | IP addresses | Find network information |
| `(Author\|Creator)` | Author or creator fields | Find who made the file |

### **🗺️ Understanding GPS Data**

#### **Coordinate Formats**
- **Decimal Degrees (DD)**: `41.40338, 2.17403`
- **Degrees, Minutes, Seconds (DMS)**: `41°24'12.2"N 2°10'26.5"E`

*Our tool shows both formats and converts between them automatically!*

#### **How to Use the Map**
- **Zoom**: Scroll wheel or pinch gesture
- **Pan**: Click and drag
- **Get Details**: Click the marker for more info
- **Open in Google Maps**: Click the link in the GPS info panel

### **📊 Comparison Mode Tips**

#### **Color Coding**
- **🟢 Green**: Data only in the second file
- **🔴 Red**: Data only in the first file
- **🟡 Orange**: Different values between files
- **Gray**: Identical data in both files

#### **Best Uses**
- Compare original vs. edited photos
- Check if metadata was properly removed
- Verify document revisions
- Detect tampering or modifications

### **🧹 Effective Metadata Cleaning**

#### **For Photos**
1. Remove GPS data before sharing vacation photos
2. Clean camera info for professional photography
3. Remove timestamps for privacy

#### **For Documents**
1. Remove author info before sharing publicly
2. Clean revision history for final documents
3. Remove comments and annotations

#### **Verification**
Always re-upload your sanitized file to verify all sensitive data was removed!

---

## ❓ **Frequently Asked Questions**

### **🔒 Privacy & Security**

**Q: Is my data safe? Do you store my files?**
A: Absolutely safe! Everything runs in your browser. We never see, store, or transmit your files. No internet connection is even required after the page loads.

**Q: Can I use this offline?**
A: Yes! After loading the page once, you can disconnect from the internet and continue using the tool.

**Q: Do I need to create an account?**
A: No! No registration, no accounts, no tracking. Just open and use.

### **🛠 Technical Questions**

**Q: What browsers are supported?**
A: All modern browsers: Chrome, Firefox, Safari, Edge. Works on desktop, tablet, and mobile.

**Q: Why can't I see GPS data in my photo?**
A: Not all photos have GPS data. Check your camera/phone settings - location services must be enabled when taking the photo.

**Q: The metadata sanitization didn't work. Why?**
A: Some file types have complex metadata structures. Try re-uploading the sanitized file to verify what was removed. For maximum security, consider using specialized tools for highly sensitive files.

**Q: Can I process multiple files at once?**
A: Yes! Upload multiple files and switch between them using the file tabs. Comparison mode works with 2+ files.

### **🚨 Troubleshooting**

**Q: The tool isn't loading properly**
A: Try refreshing the page or clearing your browser cache. Ensure JavaScript is enabled.

**Q: Large files are slow to process**
A: This is normal for very large files (>50MB). The tool processes everything locally, so speed depends on your device.

**Q: I found a bug or have a suggestion**
A: Please report it on our [GitHub Issues page](https://github.com/castle-bravo-project/professional-metadata-viewer/issues)!

---

## 🎯 **Use Cases & Examples**

### **👩‍💼 For Professionals**

#### **🏛️ Legal & Forensics**
- Verify document authenticity and creation timeline
- Extract evidence from digital files
- Generate court-ready forensic reports
- Track document revision history

#### **📰 Journalism**
- Verify photo authenticity and source
- Remove identifying metadata before publication
- Investigate digital evidence
- Protect source anonymity

#### **🏢 Corporate Security**
- Audit files before external sharing
- Remove sensitive company information
- Verify document origins
- Compliance checking (GDPR, HIPAA)

### **👤 For Personal Use**

#### **📱 Social Media Safety**
- Remove GPS data before posting photos
- Clean personal info from shared documents
- Verify what information you're sharing
- Protect family privacy

#### **🏠 Real Estate & Travel**
- Remove home location from property photos
- Clean vacation photos before sharing
- Verify photo authenticity when buying/selling
- Protect personal addresses

#### **💼 Freelancers & Creators**
- Remove client info from portfolio pieces
- Clean metadata from stock photos
- Verify image licensing and origins
- Prepare files for client delivery

---

## 🚀 **Coming Soon (Development Roadmap)**

### **📁 More File Formats**
- RAW camera files (CR2, NEF, ARW, DNG)
- Modern image formats (HEIC, WebP, AVIF)
- Advanced document types
- Archive analysis (ZIP, RAR, 7Z contents)

### **🎨 Enhanced Features**
- Batch processing for multiple files
- Advanced visualization and charts
- Mobile app versions
- Collaborative analysis tools
- API for developers

### **🔐 Advanced Security**
- File integrity verification (hashes)
- Tampering detection
- Chain of custody logging
- Enhanced privacy scoring

---

## 🤝 **Contributing & Support**

### **🐛 Found a Bug?**
[Report it here](https://github.com/castle-bravo-project/professional-metadata-viewer/issues) - we fix issues quickly!

### **💡 Have an Idea?**
[Share your suggestion](https://github.com/castle-bravo-project/professional-metadata-viewer/discussions) - we love hearing from users!

### **👩‍💻 Want to Contribute Code?**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### **📖 Improve Documentation**
Help make this tool more accessible by improving our documentation, adding examples, or translating to other languages.

---

## 📄 **License & Legal**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**What this means:**
- ✅ Free to use for any purpose (personal, commercial, educational)
- ✅ Free to modify and distribute
- ✅ No warranty or liability from the creators
- ✅ Must include the original license when redistributing

---

## 🙏 **Credits & Acknowledgments**

### **🛠 Built With Amazing Open Source Tools**
- **[EXIF.js](https://github.com/exif-js/exif-js)** - EXIF data extraction from images
- **[PDF.js](https://github.com/mozilla/pdf.js)** - PDF parsing and metadata extraction
- **[JSZip](https://github.com/Stuk/jszip)** - ZIP file handling for Office documents
- **[Leaflet](https://leafletjs.com/)** - Interactive mapping for GPS visualization
- **[Tailwind CSS](https://tailwindcss.com/)** - Beautiful, responsive styling
- **[OpenStreetMap](https://www.openstreetmap.org/)** - Free, open map data

### **🌟 Special Thanks**
- Digital forensics community for feedback and testing
- Privacy advocates who inspired this project
- Open source contributors who make tools like this possible

---

## 🔗 **Important Links**

| Link | Purpose |
|------|---------|
| **[🌐 Live Demo](https://castle-bravo-project.github.io/professional-metadata-viewer/)** | Try the tool online |
| **[📥 Download](https://github.com/castle-bravo-project/professional-metadata-viewer/archive/refs/heads/main.zip)** | Download for offline use |
| **[🐛 Report Issues](https://github.com/castle-bravo-project/professional-metadata-viewer/issues)** | Bug reports and problems |
| **[💡 Feature Requests](https://github.com/castle-bravo-project/professional-metadata-viewer/discussions)** | Suggest new features |
| **[📚 Documentation](https://github.com/castle-bravo-project/professional-metadata-viewer/wiki)** | Detailed guides and tutorials |

---

## 📊 **Project Stats**

![GitHub stars](https://img.shields.io/github/stars/castle-bravo-project/professional-metadata-viewer?style=social)
![GitHub forks](https://img.shields.io/github/forks/castle-bravo-project/professional-metadata-viewer?style=social)
![GitHub issues](https://img.shields.io/github/issues/castle-bravo-project/professional-metadata-viewer)
![GitHub last commit](https://img.shields.io/github/last-commit/castle-bravo-project/professional-metadata-viewer)

---

<div align="center">

**🔒 Made with ❤️ for Digital Privacy & Security**

*Empowering users to understand and control their digital footprint*

**[⭐ Star this project](https://github.com/castle-bravo-project/professional-metadata-viewer) if you find it useful!**

</div>
