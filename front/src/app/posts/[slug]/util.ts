import { unified } from 'unified'
import rehypeDocument from 'rehype-document'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeSlug from 'rehype-slug'

interface IResultItem {
  tag: string
  id: string
  text: string
}

function parseHeadHtml(html: string) {
  const regex = /<(h[1-6]) id="([^"]*)">([^<]*)<\/\1>/g
  let match
  const result: IResultItem[] = []
  while ((match = regex.exec(html)) !== null) {
    result.push({
      tag: match[1],
      id: match[2],
      text: match[3],
    })
  }
  return result
}

function parseResult(result: IResultItem[]) {
  const trees: any[] = []

  if (result.length > 0) {
    let currentTag = parseInt(result[0].tag[1])
    let currentItem: any = {
      parent: null,
      tag: result[0].tag,
      label: result[0].text,
      targetId: result[0].id,
      children: [],
    }
    trees.push(currentItem)
    for (let i = 1; i < result.length; i++) {
      const itemTag = parseInt(result[i].tag[1])
      if (itemTag > currentTag) {
        const newItem = {
          parent: currentItem,
          tag: result[i].tag,
          label: result[i].text,
          targetId: result[i].id,
          children: [],
        }
        currentItem.children.push(newItem)
        currentItem = newItem
      } else {
        let temp = currentItem
        let flag = false
        while (temp.parent) {
          if (itemTag > parseInt(temp.parent.tag[1])) {
            const newItem = {
              parent: temp.parent,
              tag: result[i].tag,
              label: result[i].text,
              targetId: result[i].id,
              children: [],
            }
            temp.parent.children.push(newItem)
            currentItem = newItem
            flag = true
            break
          }
          temp = temp.parent
        }
        if (!flag) {
          currentItem = {
            parent: null,
            tag: result[i].tag,
            label: result[i].text,
            targetId: result[i].id,
            children: [],
          }
          trees.push(currentItem)
        }
      }
      currentTag = itemTag
    }
  }
  return trees
}

export async function getTree(content: string) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeDocument)
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(content)
  const html = String(file)
  const result = parseHeadHtml(html)
  const tree = parseResult(result)
  return tree
}
