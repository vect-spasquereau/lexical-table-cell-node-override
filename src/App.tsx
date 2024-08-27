import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { HeadingNode } from "@lexical/rich-text";
import { TableNode, TableCellNode, TableRowNode } from "@lexical/table";
import { Flex } from "antd";
import { ParagraphNode, TextNode } from "lexical";

import { ExtendedTableCellNode, RichTextEditor, Toolbar } from "./editor";
import { theme } from "./theme";

function App() {
  const nodes = [
    HeadingNode,
    ParagraphNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    TextNode,
    ExtendedTableCellNode,
    {
      replace: TableCellNode,
      with: (node: TableCellNode) =>
        new ExtendedTableCellNode(
          node.__headerState,
          node.__colSpan,
          node.__width,
          node.__key
        ),
    },
  ];

  const initialConfig = {
    editorState: null,
    editable: true,
    namespace: "editor-demo",
    nodes,
    onError: (error: Error) => {
      throw error;
    },
    theme: theme,
  };

  return (
    <>
      <h1>Lexical Custom TableCellNode</h1>
      <LexicalComposer initialConfig={initialConfig}>
        <Flex vertical>
          <Toolbar />
          <RichTextEditor />
        </Flex>
      </LexicalComposer>
    </>
  );
}

export default App;
