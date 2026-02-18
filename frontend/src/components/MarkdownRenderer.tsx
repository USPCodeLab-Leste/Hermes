import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../styles/markdown.css";

export default function MarkdownRenderer({ children }: { children: string }) {
  return (
    <div className="markdown-body">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          // code({ children }) {
          //   return (
          //     <pre className="markdown-code">
          //       <code>{children}</code>
          //     </pre>
          //   );
          // },
          tr(props) {
            return <tr {...props} className="border-b border-violet-light bg-violet-light dark:bg-violet-dark even:bg-violet-mid/50" />
          },
          th(props) {
            return <th {...props} className="text-center font-semibold p-2 border border-violet-dark! dark:border-violet-light/50!" />
          },
          td(props) {
            return <td {...props} className="p-2 border border-violet-dark! dark:border-violet-light/50!" />
          }
        }}
      >
        {children}
      </Markdown>
    </div>
  );
}