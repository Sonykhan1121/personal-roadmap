import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- Wide reference tables need a keyboard-focusable scroll container. */

export function StudyGuide({ content }: { content: string }) {
  return (
    <div className="study-guide">
      <Markdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        disallowedElements={['img']}
        components={{
          h1: ({ children }) => <h4>{children}</h4>,
          h2: ({ children }) => <h4>{children}</h4>,
          h3: ({ children }) => <h5>{children}</h5>,
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noreferrer">
              {children}
            </a>
          ),
          table: ({ children }) => (
            <section
              className="lesson-table"
              aria-label="Lesson reference table"
              tabIndex={0}
            >
              <table>{children}</table>
            </section>
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
