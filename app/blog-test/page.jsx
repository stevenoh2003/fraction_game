import React from "react";
import { NotionAPI } from "notion-client";
import { NotionRenderer } from "react-notion-x";
// Optional: import CSS for react-notion-x and any third-party components you use
import "react-notion-x/src/styles.css";
import "prismjs/themes/prism-tomorrow.css"; // For code syntax highlighting (optional)
import "katex/dist/katex.min.css"; // For rendering equations (optional)

// Your page component
const NotionPage = ({ recordMap }) => {
  return (
    <div className="mx-auto max-w-4xl py-12 sm:py-20 lg:py-30">
      <NotionRenderer recordMap={recordMap} fullPage={true} darkMode={false} />
    </div>
  );
};

export default NotionPage;

export async function getServerData(context) {
  const notion = new NotionAPI();
  const pageId = "your-notion-page-id"; // Replace with your actual Notion page ID
  const recordMap = await notion.getPage(pageId);

  return {
    props: {
      recordMap,
    },
  };
}
