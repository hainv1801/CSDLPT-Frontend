import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Thiết lập __dirname thủ công vì trong ES Module không có sẵn
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const output = 'tong_hop_code.txt';

// Bỏ qua các thư mục build/thư viện
const ignoreDirs = ['node_modules', '.git', 'dist', 'build', 'target', '.mvn', '.idea'];

// Các đuôi file cần lấy (Java, React, Config...)
const includeExts = ['.js', '.jsx', '.ts', '.tsx', '.java', '.xml', '.properties', '.css'];

// Làm sạch hoặc tạo file mới
fs.writeFileSync(output, '');

function walk(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);

        // Bỏ qua nếu nằm trong danh sách thư mục rác
        if (ignoreDirs.some(d => fullPath.includes(d))) continue;

        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (includeExts.includes(path.extname(fullPath))) {
            const content = fs.readFileSync(fullPath, 'utf8');
            fs.appendFileSync(output, `\n\n=== FILE: ${fullPath} ===\n\n${content}`);
        }
    }
}

// Chạy hàm quét từ thư mục hiện tại
walk('.');
console.log(`✅ Đã gom xong toàn bộ code vào file: ${output}`);