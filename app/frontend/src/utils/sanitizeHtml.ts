const ALLOWED_TAGS = new Set([
  'a', 'b', 'br', 'div', 'em', 'i', 'li', 'ol', 'p', 'span', 'strong', 'u', 'ul',
]);

const ALLOWED_ATTRIBUTES: Record<string, Set<string>> = {
  a: new Set(['href', 'target', 'rel', 'title']),
  '*': new Set(['class']),
};

function isSafeUrl(value: string): boolean {
  const trimmedValue = value.trim().toLowerCase();
  return (
    trimmedValue.startsWith('http://') ||
    trimmedValue.startsWith('https://') ||
    trimmedValue.startsWith('mailto:') ||
    trimmedValue.startsWith('/') ||
    trimmedValue.startsWith('#')
  );
}

export function sanitizeHtml(html: string): string {
  const template = document.createElement('template');
  template.innerHTML = html;

  const walk = (node: Node): void => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const element = child as HTMLElement;
        const tagName = element.tagName.toLowerCase();

        if (!ALLOWED_TAGS.has(tagName)) {
          element.replaceWith(document.createTextNode(element.textContent ?? ''));
          return;
        }

        Array.from(element.attributes).forEach((attribute) => {
          const attributeName = attribute.name.toLowerCase();
          const allowedForTag = ALLOWED_ATTRIBUTES[tagName]?.has(attributeName);
          const allowedGlobal = ALLOWED_ATTRIBUTES['*'].has(attributeName);
          const isEventHandler = attributeName.startsWith('on');
          const isStyle = attributeName === 'style';

          if (isEventHandler || isStyle || (!allowedForTag && !allowedGlobal)) {
            element.removeAttribute(attribute.name);
            return;
          }

          if (attributeName === 'href' && !isSafeUrl(attribute.value)) {
            element.removeAttribute(attribute.name);
          }
        });

        if (tagName === 'a') {
          element.setAttribute('rel', 'noopener noreferrer');
          if (!element.getAttribute('target')) {
            element.setAttribute('target', '_blank');
          }
        }
      }

      walk(child);
    });
  };

  walk(template.content);
  return template.innerHTML;
}
