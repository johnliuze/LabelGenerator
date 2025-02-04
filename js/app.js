// 当DOM完全加载后执行初始化
document.addEventListener('DOMContentLoaded', function() {
    // 获取表格容器元素
    const container = document.querySelector('#spreadsheet');
    
    // 创建50行空白数据作为初始数据
    // 每行包含3列：Product, Description, BT#
    const data = Array(50).fill().map(() => ['', '', '']);

    // 创建并配置 Handsontable 实例
    const hot = new Handsontable(container, {
        data: data, // 初始数据
        rowHeaders: true, // 显示行号
        colHeaders: ['Product', 'Description', 'BT#'], // 设置列标题
        height: 'calc(100vh - 120px)', // 动态计算表格高度，减去页面其他元素的空间
        licenseKey: 'non-commercial-and-evaluation', // Handsontable 免费许可证
        contextMenu: true, // 启用右键菜单
        
        // 配置填充手柄（类似Excel的下拉填充功能）
        fillHandle: {
            direction: 'vertical', // 只允许垂直方向拖动
            autoInsertRow: false, // 禁止自动插入新行
        },
        
        stretchH: 'none', // 禁止列宽自动拉伸
        enterMoves: { row: 1, col: 0 }, // Enter键按下时移动到下一行
        tabMoves: { row: 0, col: 1 }, // Tab键按下时移动到右侧单元格
        enterBeginsEditing: true, // Enter键开始编辑单元格
        outsideClickDeselects: true, // 点击外部取消选择
        editor: 'text', // 使用文本编辑器
        dblClickRender: true, // 双击开始编辑
        
        // 复制粘贴配置
        copyPaste: {
            pasteMode: 'override', // 粘贴时覆盖现有内容
            copyColumnHeaders: false, // 不复制列标题
        },

        // 配置列属性
        columns: [
            {
                type: 'text',
                width: 200, // Product列宽度
            },
            {
                type: 'text',
                width: 500, // Description列宽度
            },
            {
                type: 'text',
                width: 130, // BT#列宽度
            }
        ],

        // 在数据改变前进行验证和处理
        beforeChange: function(changes) {
            if (!changes) return true;
            
            // 每列的最大字符限制
            const maxLengths = [19, 61, 7]; // Product, Description, BT# 的最大长度
            
            // 处理每个改变的单元格
            changes.forEach(change => {
                const [row, prop, oldValue, newValue] = change;
                if (newValue === null) return;
                
                // 获取当前列索引
                const col = this.propToCol(prop);
                const maxLength = maxLengths[col];
                
                // 如果输入超出长度限制，自动截断
                if (newValue && newValue.length > maxLength) {
                    change[3] = newValue.slice(0, maxLength);
                }
            });
            
            return true;
        }
    });

    // 导出功能
    document.getElementById('exportSheet').addEventListener('click', function() {
        const data = hot.getData();
        const messageArea = document.getElementById('messageArea');
        
        // 检查是否有任何非空数据
        const hasData = data.some(row => row.some(cell => cell && cell.trim()));
        
        // 如果表格完全为空，显示提示信息并返回
        if (!hasData) {
            messageArea.innerHTML = 'No data to export - sheet is empty';
            return;
        }
        
        // 过滤掉完全空行
        const validData = data.filter(row => row.some(cell => cell && cell.trim()));

        // 创建CSV内容，包含表头
        const csvContent = [
            ['Product', 'Description', 'BT#'].join(','), // 添加表头
            ...validData.map(row => row.map(cell => 
                // 处理单元格中的逗号和引号，确保CSV格式正确
                `"${(cell || '').replace(/"/g, '""')}"`
            ).join(','))
        ].join('\n');

        // 获取当前本地时间，用于文件名
        const now = new Date();
        const dateStr = [
            now.getFullYear(),
            String(now.getMonth() + 1).padStart(2, '0'), // 月份补零
            String(now.getDate()).padStart(2, '0'), // 日期补零
            '_',
            String(now.getHours()).padStart(2, '0'), // 小时补零
            String(now.getMinutes()).padStart(2, '0'), // 分钟补零
            String(now.getSeconds()).padStart(2, '0') // 秒数补零
        ].join('');

        // 创建并下载文件
        const fileName = `ProductLabel_${dateStr}.csv`;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(link.href); // 释放URL对象

        messageArea.innerHTML = 'Data exported successfully';
    });

    // 清空功能
    document.getElementById('clearSheet').addEventListener('click', function() {
        const messageArea = document.getElementById('messageArea');
        hot.loadData(Array(50).fill().map(() => ['', '', '']));
        messageArea.innerHTML = 'Sheet cleared';
    });

    // 导出表格实例到全局变量，供label.js使用
    window.appTable = hot;
}); 