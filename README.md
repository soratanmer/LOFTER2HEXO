# LOFTER2HEXO
一个将 LOFTER 导出的 XML 文件转换为适合 Hexo 解析的 Markdown 文件工具。

项目地址：https://github.com/soratanmer/LOFTER2HEXO

此项目使用[LOFTER2Hexo](https://github.com/boboidream/LOFTER2Hexo)和[lofter2jekyll](https://github.com/FromEndWorld/lofter2jekyll/)修改而成。

## 

## 

## 使用说明

### 环境配置

### 

node.js : 如需安装请查看 [Node.js 下载](https://nodejs.org/en/download/)。

### 

### 使用程序

1. 将LOFTER导出的XML文件命名为`LOFTER.xml`并移至此项目所在文件夹。

2. 运行以下命令：

   ```powershell
   npm install
   ```

   ```powershell
   npm run start
   ```

### 运行结果

1. 在 `Terminal` 中会打印日志。
2. 生成 `LOFTER` 文件夹，包含所有 Markdown 文件；所有图片下载到 `LOFTER/img` 文件夹下。

### 参数说明

```powershell
Usage: npm run start [options]
Options:
    -h, --help           output usage information
    -V, --version        output the version number
    -i, --input <lang>   xml 文件路径，例如：`/Volumes/私人/Github/test.xml`
    -n, --notag          头部不生成 tags 标签（以避免生成太多 `Tags` 造成的不美观）
    -j, --jekyll         导出 jekyll 格式 Markdown 文件
    -a, --author <lang>  设置 jekyll 格式 Markdown 头部 author
```

命令举例

```powershell
npm run start -i ./Github/test.xml -n 
# 解析路径为 `./Github/test.xml` 文件，生成 Markdown 文件不带 Tags 标签
npm run start -n -j -a soratanmer 
# 解析当前目录下 LOFTER.xml 文件，生成不带 Tags 标签的 Jekyll 格式 Markdown 文件，头部 author: soratanmer
```

## 其他选项

另有功能类似的脚本[lofter2Hexo](https://github.com/alicewish/Lofter2Hexo)大家可以试试。

墨问太太的脚本基于Python，这个基于JS。

这个的优点大概是下载图片比较利索，直接根据图片URL下载并且链接到md文档中。

缺点是没有图形界面，需要安装node.js和使用命令行，还有它不能直接将导出内容再发布。