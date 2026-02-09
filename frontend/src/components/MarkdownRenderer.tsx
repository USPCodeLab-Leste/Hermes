import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import "../styles/markdown.css";

export default function MarkdownRenderer({ children }: { children: string }) {
  return (
    <div className="markdown-body">
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code(props) {
            const {children, className, node, ...rest} = props
            const match = /language-(\w+)/.exec(className || '')
            return match ? (
              <SyntaxHighlighter
                {...rest}
                PreTag="div"
                children={String(children).replace(/\n$/, '')}
                language={match[1]}
                style={dracula}
              />
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            )
          },
          tr(props) {
            return <tr {...props} className="border-b border-violet-light bg-violet-dark even:bg-violet-mid/50" />
          },
          th(props) {
            return <th {...props} className="text-center font-semibold p-2 border border-violet-light/50!" />
          },
          td(props) {
            return <td {...props} className="p-2 border border-violet-light/50!" />
          }
        }}
      >
        {children}
      </Markdown>
    </div>
  );
}