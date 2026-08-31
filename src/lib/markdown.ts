import type { Element as HastElement, Nodes as HastNodes, Root as HastRoot } from 'hast';
import type { Root as MdastRoot } from 'mdast';
import type { ContainerDirective, LeafDirective, TextDirective } from 'mdast-util-directive';
import { h } from 'hastscript';
import { toHtml } from 'hast-util-to-html';
import { toHast } from 'mdast-util-to-hast';
import { visit } from 'unist-util-visit';

type AnyDirective = ContainerDirective | LeafDirective | TextDirective;

function addExternalLinkIcon(tree: HastNodes): void {
  visit(tree, (node) => {
    if (node.type !== 'element') return;
    const el = node as HastElement;
    if (el.tagName !== 'a') return;
    const href = el.properties.href;
    if (typeof href !== 'string' || !(href.startsWith('http') || href.startsWith('//'))) return;
    el.properties.target = '_blank';
    el.children.push(
      { type: 'text', value: ' ' },
      {
        type: 'element',
        tagName: 'span',
        properties: { className: ['ms'], dataIcon: ['open_in_new'] } as HastElement['properties'],
        children: [],
      },
    );
  });
}

export function remarkQuoteDirective() {
  return (tree: MdastRoot): void => {
    visit(tree, (node) => {
      if (
        node.type !== 'containerDirective' &&
        node.type !== 'leafDirective' &&
        node.type !== 'textDirective'
      ) return;

      const directive = node as AnyDirective;
      if (directive.name !== 'quote') return;

      const data = directive.data ?? (directive.data = {});
      data.hName = 'blockquote';
      data.hProperties = { class: ['quote'] };

      const labelIndex = directive.children.findIndex(
        (c) => (c.data as { directiveLabel?: unknown } | undefined)?.directiveLabel !== undefined,
      );
      if (labelIndex === -1) return;

      const [labelNode] = directive.children.splice(labelIndex, 1);
      const labelHast = toHast(labelNode);
      addExternalLinkIcon(labelHast);
      directive.children.push({
        type: 'html',
        value: toHtml(h('cite', { class: ['tg'] }, labelHast)),
      });
    });
  };
}

export function rehypeTargetBlank() {
  return (tree: HastRoot): void => {
    addExternalLinkIcon(tree);
  };
}
