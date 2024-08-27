import {
  BoldOutlined,
  ItalicOutlined,
  TableOutlined,
  UnderlineOutlined,
} from "@ant-design/icons";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createHeadingNode,
  $isHeadingNode,
  HeadingTagType,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import { Button, Flex, Select, Tooltip, Typography } from "antd";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_CRITICAL,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { useCallback, useEffect, useMemo, useState } from "react";

const blockTypeToBlockName = {
  paragraph: "Normal",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  h4: "Heading 4",
  h5: "Heading 5",
  h6: "Heading 6",
};

import styles from "./Toolbar.module.css";
import { INSERT_TABLE_COMMAND } from "@lexical/table";

export const Toolbar = () => {
  const [editor] = useLexicalComposerContext();

  const [activeEditor, setActiveEditor] = useState(editor);

  const [blockType, setBlockType] =
    useState<keyof typeof blockTypeToBlockName>("paragraph");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));

      if (elementDOM !== null) {
        const type = $isHeadingNode(element)
          ? element.getTag()
          : element.getType();
        if (type in blockTypeToBlockName) {
          setBlockType(type as keyof typeof blockTypeToBlockName);
        }
      }
    }
  }, [activeEditor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        $updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      })
    );
  }, [$updateToolbar, activeEditor]);

  const blockTypeOptions = useMemo(
    () =>
      Object.entries(blockTypeToBlockName).map(([key, value]) => ({
        value: key,
        label: <Typography>{value}</Typography>,
      })),
    []
  );

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      });
    }
  };

  return (
    <Flex gap="small" wrap="wrap">
      <Select
        className={styles.block_type_select}
        value={blockType}
        options={blockTypeOptions}
        onChange={(val) => {
          if (val === "paragraph") formatParagraph();
          formatHeading(val as HeadingTagType);
        }}
      />
      <Tooltip title="bold">
        <Button
          aria-checked={isBold}
          className={styles.button}
          icon={<BoldOutlined />}
          role="switch"
          type="text"
          onClick={() =>
            activeEditor?.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
          }
        />
      </Tooltip>
      <Tooltip title="italic">
        <Button
          aria-checked={isItalic}
          className={styles.button}
          icon={<ItalicOutlined />}
          role="switch"
          type="text"
          onClick={() =>
            activeEditor?.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
          }
        />
      </Tooltip>
      <Tooltip title="underline">
        <Button
          aria-checked={isUnderline}
          className={styles.button}
          icon={<UnderlineOutlined />}
          role="switch"
          type="text"
          onClick={() =>
            activeEditor?.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
          }
        />
      </Tooltip>
      <Button
        className={styles.button}
        icon={<TableOutlined />}
        iconPosition="end"
        type="text"
        onClick={() =>
          activeEditor?.dispatchCommand(INSERT_TABLE_COMMAND, {
            columns: "4",
            rows: "3",
            includeHeaders: false,
          })
        }
      >
        Insert Table
      </Button>
    </Flex>
  );
};
