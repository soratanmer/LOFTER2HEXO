/*
 * @author       : soratanmer
 * @Github       : https://github.com/soratanmer
 * @Date         : 2020-06-14 21:10:34
 * @LastEditors  : soratanmer
 * @LastEditTime : 2020-06-20 15:17:55
 * @FilePath     : \LOFTER2HEXO\index.js
 * @Description  : 将 LOFTER 导出的 XML 文件转换为 Markdown 文件
 */

const fs = require('fs')
const xml2js = require('xml2js')
const toMarkdown = require('to-markdown')
const argv = require('commander')
const path = require('path')
const imageDownloader = require('image-downloader')
const cwd = process.cwd()
const parser = new xml2js.Parser()

argv
  .version('1.0.0')
  .usage('[options]')
  .option('-i --input <lang>', 'lofter xml file')
  .option('-n, --notag', 'Without tags')
  .option('-j, --jekyll', 'jekyll type')
  .option('-a, --author <lang>', 'set author in header in jekyll type')
  .parse(process.argv)

class Lofter2md {
  constructor() {
    this.outputFilePath = path.resolve(cwd, 'LOFTER')
    this.outputImgPath = path.resolve(cwd, 'LOFTER/img')
    this.file = argv.input || path.resolve(cwd, 'LOFTER.xml')
    this.author = argv.author || ''
  }
  run() {
    if (!fs.existsSync(this.outputFilePath)) {
      fs.mkdirSync(this.outputFilePath)
    }
    if (!fs.existsSync(this.outputImgPath)) {
      fs.mkdirSync(this.outputImgPath)
    }
    this.getPostArray(this.file, (postArray) => {
      this.parsePost(postArray)
    })
  }
  getPostArray(file, callback) {
    fs.readFile(file, (err, data) => {
      if (err) {
        console.error(`读取文件 ${file} 出错：`, err)
        return
      }
      parser.parseString(data, (error, result) => {
        callback(result.lofterBlogExport.PostItem)
      })
    })
  }
  parsePost(postArray) {
    postArray.forEach((article, index) => {
      const newDate = new Date(parseInt(article.publishTime)).Format(
        'yy-MM-dd hh:mm:ss'
      )
      let fileName =
        newDate.substring(0, 10) + '-' + article.title + '-' + ++index + '.md'
      const allWord = this.parseHeader(article) + this.parseContent(article)
      if (fileName.indexOf('/') != null) {
        fileName = fileName.replace(/\//g, '_')
      }
      if (fileName.indexOf('*') != null) {
        fileName = fileName.replace(/\*/g, '_')
      }
      if (fileName.indexOf('?') != null) {
        fileName = fileName.replace(/\?/g, '_')
      }
      this.createMD(fileName, allWord, index)
    })
  }
  createMD(fileName, allWord, index) {
    fs.open(path.resolve(this.outputFilePath, fileName), 'w', (err) => {
      if (err) {
        throw err
      }
      fs.writeFile(
        path.resolve(this.outputFilePath, fileName),
        allWord,
        (err) => {
          if (err) {
            throw err
          }
          console.log(`${index}. Create ${fileName} successfully!`)
        }
      )
    })
  }
  parseHeader(article) {
    const tags = argv.notag ? '' : article.tag
    const newDate = new Date(parseInt(article.publishTime)).Format(
      'yyyy-MM-dd hh:mm:ss'
    )
    let headline = ''
    if (argv.author) {
      const res = ''
      if (tags) {
        tags.forEach((tag) => {
          res += '    - ' + tag + '\n'
        })
      }
      headline = `---\nlayout: post\ntitle: ${article.title}\ndate: ${newDate}\nauthor: ${this.author}\ncatalog: 随笔\ntags: [${res}]\n\n---\n`
    } else {
      headline = `---\nlayout: post\ntitle: ${article.title}\ndate: ${newDate}\ntags: [${tags}]\n\n---\n`
    }
    return headline
  }
  parseContent(article) {
    let content = ''
    let imgArray = []
    if (article.content) {
      content = toMarkdown(article.content.toString())
      imgArray = content.match(/!\[.*?\]\((.*?)\)/g)
      if (imgArray && imgArray.length) {
        imgArray.forEach((imgURL) => {
          imgURL = imgURL.match(/http.*\.(jpg|jpeg|gif|png)/)[0]
          const imgName = imgURL.split('/').pop()
          content = content.replace(/!\[(.*?)\]\((http.*?)\)/, `![图片](./img/${imgName})`)
          this.downloadImg(imgURL)
        })
      }
    } else if (article.photoLinks != null) {
      content = toMarkdown(article.caption.toString()) + '\n\n'
      const text = article.photoLinks[0]
      imgArray = JSON.parse(text)
      imgArray.forEach((img) => {
        const imgURL = img.orign.split('?')[0]
        const imgName = imgURL.split('/').pop()
        content += `\n![图片](./img/${imgName})\n`
        this.downloadImg(imgURL)
      })
    } else if (article.caption != null) {
      content = toMarkdown(article.caption.toString())
    } else {
      console.log(article)
    }
    return content
  }
  downloadImg(imgURL) {
    imageDownloader
      .image({
        url: imgURL,
        dest: this.outputImgPath,
      })
      .then(({ filename }) => {
        console.log('Image save to', filename)
      })
      .catch((err) => {
        console.error(err)
      })
  }
}

Date.prototype.Format = function (fmt) {
  const o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds(),
  }
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  for (const k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
  return fmt
}

const lofter = new Lofter2md()

lofter.run()
