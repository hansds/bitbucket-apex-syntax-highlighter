import Prism from 'prismjs';
import 'prismjs/components/prism-apex';

import './content_styles.css';

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

function highlightLinesWrapper(el: HTMLElement) {
  const preElements = el.querySelectorAll('pre.code-component');

  // The first div child has an id, we parse it to get the language
  const language = el.firstElementChild?.id ?? '';
  // Use regex to capture the first three characters after the last dot
  const extensionRegex = /\.(\w{3})[A-Za-z0-9]*$/;
  const match = language.match(extensionRegex);
  const isApex = match && match[1] === 'cls';

  if (!isApex) {
    return;
  }

  preElements.forEach((pre) => {
    // Get the text content of the pre element
    const codeText = pre.textContent || '';

    // Create a new code element
    const codeElement = document.createElement('code');
    codeElement.className = 'language-apex';
    codeElement.textContent = codeText;

    // Apply Prism highlighting
    Prism.highlightElement(codeElement);

    // Replace the content of the pre element with the highlighted code
    pre.innerHTML = '';
    pre.appendChild(codeElement);
  });
}
