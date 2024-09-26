import Prism from 'prismjs';
import 'prismjs/components/prism-apex';

import './content_styles.css';

// Check if the current domain is bitbucket.org
const isBitbucketDiff = window.location.hostname === 'bitbucket.org'
const isPullRequest = window.location.pathname.includes('/pull-requests');
const isCommit = window.location.pathname.includes('/commits');

if (isBitbucketDiff && (isPullRequest || isCommit)) {
  // Create a MutationObserver to watch for DOM changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          else if (node.classList.contains('lines-wrapper')) {
            highlightLinesWrapper(node);
          }
          else {
            findLinesWrapperAndHighlight(node);
          }
        });
      }
    });
  });

  // Start observing the document with the configured parameters
  observer.observe(document.body, { childList: true, subtree: true });
}

function findLinesWrapperAndHighlight(el: HTMLElement) {
  el.querySelectorAll('.lines-wrapper').forEach((linesWrapper) => {
    highlightLinesWrapper(linesWrapper as HTMLElement);
  });
}

function highlightLinesWrapper(el: HTMLElement) {
  const codeElements = el.querySelectorAll('pre.code-component>span>span');
  // The first div child has an id, we parse it to get the language
  const language = el.firstElementChild?.id ?? '';
  // Use regex to capture the first three characters after the last dot
  const extensionRegex = /\.(\w{3})[A-Za-z0-9_]*$/;
  const match = language.match(extensionRegex);
  const isApex = match && match[1] === 'cls';

  if (!isApex) {
    return;
  }

  codeElements.forEach((codeElement) => {
    codeElement.innerHTML = getHighlightedCode(codeElement as HTMLElement);
  });
}

/**
 * We want to highlight the code inside the code element, but we want to keep the HTML tags such as <ins> and <del> for the diff view
 */
function getHighlightedCode(codeElement: HTMLElement) {
    const htmlContent = codeElement.innerHTML;

    // Use a regular expression to split the content into text and HTML tags
    const parts = htmlContent.split(/(<.*?>)/);

    const highlightedParts = parts.map(part => {
        if (part.startsWith('<') && part.endsWith('>')) {
            // If it's an HTML tag, return it as is
            return part;
        } else {
          // If it's text content, highlight it
          const cleanedPart = part.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

          return Prism.highlight(cleanedPart, Prism.languages.apex, 'apex');
        }
    });

    return highlightedParts.join('');
}
