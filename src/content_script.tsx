import hljs from 'highlight.js/lib/core';
import hljsApex from 'highlightjs-apex';

import './content_styles.css';
import { LanguageFn } from 'highlight.js';

// Check if the current domain is bitbucket.org
if (window.location.hostname === 'bitbucket.org') {
  // Create a MutationObserver to watch for DOM changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          // Direct lines-wrapper
          if (node instanceof HTMLElement && node.classList.contains('lines-wrapper')) {
            highlightLinesWrapper(node);
          }
          // Indirect lines-wrapper added in chunk-wrapper
          else if (node instanceof HTMLElement && node.classList.contains('chunk-wrapper')) {
            node.querySelectorAll('.lines-wrapper').forEach((linesWrapper) => {
              highlightLinesWrapper(linesWrapper as HTMLElement);
            });
          }
        });
      }
    });
  });

  // Start observing the document with the configured parameters
  observer.observe(document.body, { childList: true, subtree: true });
}

// Register the Apex language with highlight.js
hljs.registerLanguage('apex', hljsApex);

function highlightLinesWrapper(el: HTMLElement) {
  const preElements = el.querySelectorAll('pre.code-component');

  preElements.forEach((pre) => {
    // Get the text content of the pre element
    const codeText = pre.textContent || '';

    // Create a new code element
    const codeElement = document.createElement('code');
    codeElement.className = 'language-apex';
    codeElement.textContent = codeText;

    // Apply highlight.js
    hljs.highlightElement(codeElement);

    // Replace the content of the pre element with the highlighted code
    pre.innerHTML = '';
    pre.appendChild(codeElement);
  });
}
