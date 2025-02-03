// 标签生成和下载功能
document.getElementById('generateLabels').addEventListener('click', async function() {
    // 从全局获取表格实例
    const hot = window.appTable;
    const data = hot.getData();
    const labelContainer = document.getElementById('labelContainer');
    const messageArea = document.getElementById('messageArea');
    
    // 清空容器和消息区域
    labelContainer.innerHTML = '';
    messageArea.innerHTML = '';

    // 数据验证部分
    const validData = [];
    const errorMessages = [];

    // 遍历每一行数据进行验证
    data.forEach((row, index) => {
        const [product, description, bt] = row;
        // 跳过完全空行
        if (!product && !description && !bt) return;

        const rowNum = index + 1;
        const missing = [];
        
        // 检查必填字段
        if (!product) missing.push('Product');
        if (!description) missing.push('Description');
        if (!bt) missing.push('BT#');

        // 收集错误信息或有效数据
        if (missing.length > 0) {
            errorMessages.push(`Row ${rowNum}: Missing ${missing.join(', ')}`);
        } else {
            validData.push(row);
        }
    });

    // 检查是否有有效数据
    if (validData.length === 0) {
        messageArea.innerHTML = 'No valid data to generate labels';
        return;
    }

    // 显示跳过的行信息
    if (errorMessages.length > 0) {
        messageArea.innerHTML = 'Skipped rows:\n' + errorMessages.join('\n');
    }

    // 设置标签容器样式（用于离屏渲染）
    labelContainer.style.cssText = `
        position: fixed;
        left: -9999px;
        top: -9999px;
    `;

    // 按BT号分组数据，便于生成单独的ZIP文件
    const groupedByBT = validData.reduce((acc, row) => {
        const [product, description, bt] = row;
        if (!acc[bt]) {
            acc[bt] = [];
        }
        acc[bt].push([product, description, bt]);
        return acc;
    }, {});

    // 为每个BT创建单独的ZIP文件
    for (const [bt, products] of Object.entries(groupedByBT)) {
        const zip = new JSZip();

        // 处理每个产品标签
        for (const [product, description] of products) {
            // 生成标签图片
            const label = await createLabel(product, description, bt);
            if (label) {
                // 提取base64图片数据
                const imgData = label.split(',')[1];
                // 清理文件名中的特殊字符
                const cleanFileName = product.replace(/[\/:\\]/g, '_') + '.jpg';
                // 添加到ZIP文件
                zip.file(cleanFileName, imgData, {base64: true});
            }
        }

        // 生成并下载ZIP文件
        try {
            const content = await zip.generateAsync({type: 'blob'});
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            // 使用BT号作为文件名
            link.download = `${bt.replace(/[\/:\\]/g, '_')}.zip`;
            link.click();
            URL.revokeObjectURL(link.href);
        } catch (e) {
            console.error('ZIP generation failed:', e);
            messageArea.innerHTML += `\nFailed to generate ZIP file for BT: ${bt}`;
        }
    }

    // 清理标签容器
    labelContainer.innerHTML = '';
});

// 创建单个标签的函数
async function createLabel(product, description, bt) {
    // 创建标签DOM结构
    const label = document.createElement('div');
    label.className = 'label';
    
    // 设置标签HTML内容
    label.innerHTML = `
        <div class="label-content">
            <div class="barcode-section">
                <canvas class="barcode"></canvas>
                <div class="product-text">${product}</div>
            </div>
            <div class="description-section">
                <div class="description-text">${description}</div>
            </div>
            <div class="bt-section">
                <div class="qrcode-wrapper">
                    <div class="qrcode-container">
                        <canvas class="qrcode"></canvas>
                    </div>
                    <div class="bt-text">${bt}</div>
                </div>
            </div>
        </div>
    `;

    // 添加到容器中以便渲染
    document.getElementById('labelContainer').appendChild(label);

    try {
        // 生成条形码
        JsBarcode(label.querySelector('.barcode'), product, {
            format: "CODE128", // 使用CODE128编码格式
            width: 5, // 条形码线条宽度
            height: 300, // 条形码高度
            displayValue: false, // 不显示文本
            margin: 10, // 边距
            background: '#ffffff' // 背景色
        });

        // 生成二维码
        await QRCode.toCanvas(label.querySelector('.qrcode'), bt, {
            width: 250, // 二维码大小
            margin: 0, // 无边距
            color: {
                dark: '#000000', // 二维码颜色
                light: '#ffffff' // 背景色
            }
        });

        // 等待渲染完成（防止图片未完全渲染）
        await new Promise(resolve => setTimeout(resolve, 200));

        // 将DOM转换为图片
        const canvas = await html2canvas(label, {
            width: 6 * 300, // 6英寸 * 300DPI
            height: 4 * 300, // 4英寸 * 300DPI
            scale: 1,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            imageTimeout: 0,
            removeContainer: true,
            letterRendering: true
        });

        // 转换为base64图片数据
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        canvas.remove();
        return imgData;
    } catch (e) {
        console.error('Label generation failed:', e);
        return null;
    }
} 