const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const tempDir = path.join(__dirname, 'dist_temp');
const tarFile = path.join(__dirname, 'package.tar');

// Cleanup old files
if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
if (fs.existsSync(tarFile)) {
  fs.unlinkSync(tarFile);
}

// Ensure temp directory exists
fs.mkdirSync(tempDir);

// Folders/files to ignore entirely
const ignoreList = [
  'node_modules',
  '.next',
  '.git',
  'dist_temp',
  'package.tar',
  'next_built.tar',
  'guncelleme.tar',
  'mevzuatadam.zip',
  'read_db.js',
  'package-source.js'
];

// Helper to copy recursively while filtering out databases, logs, and caches
function copyRecursiveSync(src, dest) {
  const stats = fs.statSync(src);
  const isDirectory = stats.isDirectory();
  const baseName = path.basename(src);

  // Exclude ignored names
  if (ignoreList.includes(baseName)) return;

  // Exclude file extensions (databases, compressed archives)
  if (!isDirectory) {
    const ext = path.extname(src).toLowerCase();
    if (['.db', '.db-wal', '.db-shm', '.db-journal', '.tar', '.zip', '.tgz', '.rar'].includes(ext)) {
      return;
    }
  }

  if (isDirectory) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((childItem) => {
      copyRecursiveSync(path.join(src, childItem), path.join(dest, childItem));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('Starting safe packaging process...');
fs.readdirSync(__dirname).forEach((item) => {
  copyRecursiveSync(path.join(__dirname, item), path.join(tempDir, item));
});

console.log('Creating tar archive...');
try {
  // Run native tar command on the clean temp folder
  execSync(`tar -cf package.tar -C dist_temp .`, { stdio: 'inherit' });
  console.log('Archive created successfully: package.tar');
} catch (error) {
  console.error('Failed to create archive:', error.message);
} finally {
  // Cleanup temp folder
  fs.rmSync(tempDir, { recursive: true, force: true });
}

// Print archive details
if (fs.existsSync(tarFile)) {
  const stats = fs.statSync(tarFile);
  console.log(`Success! package.tar is ready. Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  console.log('NOTE: SQLite databases (*.db) have been safely excluded to prevent overwriting server databases.');
}
