import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";

import { TreeViewPlugin } from "./plugins";
import { Placeholder } from "./ui";

import styles from "./RichTextEditor.module.css";

export const RichTextEditor = () => {
  return (
    <>
      <div className={styles.editor_container}>
        <AutoFocusPlugin />
        <RichTextPlugin
          contentEditable={
            <div className={styles.editor}>
              <ContentEditable className={styles.textarea} />
            </div>
          }
          placeholder={
            <Placeholder className={styles.placeholder}>
              Enter some rich text here
            </Placeholder>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <TablePlugin hasCellMerge hasCellBackgroundColor />
      </div>
      <TreeViewPlugin />
    </>
  );
};
