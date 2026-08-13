import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import privacyMd from "../content/privacy.md?raw";
import "../styles/markdown.css";

export default function Privacy() {
  return (
    <main className="privacy main-app">
      <div className="privacy-content markdown-body">
        <Markdown 
          remarkPlugins={[remarkGfm]}
        >
          {privacyMd}
        </Markdown>
      </div>
    </main>
  )
}