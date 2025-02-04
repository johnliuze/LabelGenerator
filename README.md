# SOHO Apparel Product Label Generator
# SOHO 服装产品标签生成器

一个用于生成服装产品标签的网页应用。支持批量生成标签并按BT号分组导出。

## Features 功能特点

- Spreadsheet-style data input interface / 电子表格式数据输入界面
- Real-time character limit validation / 实时字符限制验证
- Excel-style cell fill handle / Excel风格的单元格下拉填充
- Label generation grouped by BT number / 按BT号分组生成标签
- Data export/import functionality / 导出/导入数据功能
- Batch processing support / 支持批量处理

## Technical Specifications 技术规格

### Label Specifications 标签规格
- Size 尺寸：6 x 4 inches 英寸
- Resolution 分辨率：300 DPI
- Format 格式：JPEG

### Character Limits 字符限制
- Product 产品编号：19 characters 字符
- Description 描述：61 characters 字符
- BT# BT号：7 characters 字符

### Label Elements 标签元素
- Product barcode (CODE128 format) / 产品条形码 (CODE128格式)
- Product number / 产品编号
- Product description / 产品描述
- BT number / BT号
- BT number QR code / BT号二维码

## Instructions 使用说明

1. Data Input 数据输入
   - Enter product information in the table / 在表格中输入产品信息
   - Use Tab key to move between cells / 使用Tab键在单元格间移动
   - Use Enter key to move to next row / 使用Enter键移动到下一行
   - Copy data using fill handle / 可以通过下拉填充复制数据

2. Generate Labels 生成标签
   - Click "Generate Labels" button / 点击"Generate Labels"按钮
   - Labels are generated and grouped by BT number / 系统会按BT号分组生成标签
   - Each BT number generates a separate ZIP file / 每个BT号生成一个独立的ZIP文件
   - ZIP files are named after their BT numbers / ZIP文件名为对应的BT号

3. Export Data 导出数据
   - Click "Export Sheet & Clear" button / 点击"Export Sheet & Clear"按钮
   - Data is exported in CSV format / 导出CSV格式的数据文件
   - Filename includes timestamp / 文件名包含导出时间戳
   - Table is cleared after export / 导出后自动清空表格

## Technology Stack 技术栈

- Handsontable (Table component 表格组件)
- JsBarcode (Barcode generation 条形码生成)
- QRCode.js (QR code generation 二维码生成)
- html2canvas (Label rendering 标签渲染)
- JSZip (ZIP file generation ZIP文件生成)

## File Structure 文件结构

label-generator/
├── css/
│ ├── app.css # Interface styles / 界面样式
│ └── label.css # Label styles / 标签样式
├── js/
│ ├── app.js # Table and export functionality / 表格和导出功能
│ └── label.js # Label generation functionality / 标签生成功能
└── index.html # Main page / 主页面

## Browser Compatibility 浏览器兼容性

- Chrome (Recommended 推荐)
- Firefox
- Edge
- Safari

## Notes 注意事项

1. Data Validation 数据验证
   - All fields are required / 所有字段都必须填写
   - Cannot exceed character limits / 不能超过字符限制
   - Empty rows are automatically skipped / 空行会被自动跳过

2. File Naming 文件命名
   - Label images are named after product numbers / 标签图片以产品编号命名
   - ZIP files are named after BT numbers / ZIP文件以BT号命名
   - Exported CSV files include timestamps / 导出的CSV文件包含时间戳

3. Performance Considerations 性能考虑
   - Large batch processing may take time / 大量标签生成可能需要一定时间
   - Recommended to process less than 100 labels per batch / 建议每批处理不超过100个标签

## Development Guide 开发说明

### Local Development 本地开发
1. Clone repository / 克隆仓库
2. Run with local server (e.g., Live Server) / 使用本地服务器运行（如 Live Server）
3. Access via browser / 打开浏览器访问

### Configuration 修改配置
- Label dimensions: modify label.css / 标签尺寸：修改 label.css
- Character limits: modify app.js / 字符限制：修改 app.js
- Style adjustments: modify corresponding CSS files / 样式调整：修改对应的 CSS 文件

### Deployment 部署
- Supports any static file server / 支持任何静态文件服务器
- No backend required / 无需后端服务
- All processing done in browser / 所有处理在浏览器端完成