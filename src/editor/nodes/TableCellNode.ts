import {
  SerializedTableCellNode,
  TableCellHeaderStates,
  TableCellNode,
} from "@lexical/table";
import { addClassNamesToElement } from "@lexical/utils";
import { EditorConfig, LexicalNode, NodeKey, Spread } from "lexical";

export type TableCellHeaderState =
  (typeof TableCellHeaderStates)[keyof typeof TableCellHeaderStates];

export type SerializedCustomTableCellNode = Spread<
  SerializedTableCellNode,
  {
    customProperty: any;
  }
>;

export class ExtendedTableCellNode extends TableCellNode {
  /** @internal */
  __customProperty: any;

  static getType() {
    return "extended-tablecell";
  }

  constructor(
    headerState = TableCellHeaderStates.NO_STATUS,
    colSpan = 1,
    width?: number,
    key?: NodeKey
  ) {
    super(headerState, colSpan, width, key);
    this.__backgroundColor = null;
    this.__customProperty = null;
  }

  static importJSON(
    serializedNode: SerializedCustomTableCellNode
  ): ExtendedTableCellNode {
    const colSpan = serializedNode.colSpan || 1;
    const rowSpan = serializedNode.rowSpan || 1;
    const cellNode = $createCustomTableCellNode(
      serializedNode.headerState,
      colSpan,
      serializedNode.width || undefined
    );
    cellNode.__rowSpan = rowSpan;
    cellNode.__backgroundColor = serializedNode.backgroundColor || null;
    cellNode.__customProperty = serializedNode.customProperty || null;
    return cellNode;
  }

  exportJSON(): SerializedCustomTableCellNode {
    return {
      ...super.exportJSON(),
      customProperty: this.__customProperty,
      type: "extended-tablecell",
    };
  }

  static clone(node: ExtendedTableCellNode): ExtendedTableCellNode {
    const cellNode = new ExtendedTableCellNode(
      node.__headerState,
      node.__colSpan,
      node.__width,
      node.__key
    );
    cellNode.__rowSpan = node.__rowSpan;
    cellNode.__backgroundColor = node.__backgroundColor;
    cellNode.__customProperty = null;
    return cellNode;
  }

  createDOM(config: EditorConfig): HTMLElement {
    console.log("create dom?");
    const element = document.createElement(
      this.getTag()
    ) as HTMLTableCellElement;

    if (this.__width) {
      element.style.width = `${this.__width}px`;
    }
    if (this.__colSpan > 1) {
      element.colSpan = this.__colSpan;
    }
    if (this.__rowSpan > 1) {
      element.rowSpan = this.__rowSpan;
    }
    if (this.__backgroundColor !== null) {
      element.style.backgroundColor = this.__backgroundColor;
    }

    addClassNamesToElement(
      element,
      config.theme.tableCell,
      this.hasHeader() && config.theme.tableCellHeader
    );

    return element;
  }
}

export function $createCustomTableCellNode(
  headerState: TableCellHeaderState,
  colSpan = 1,
  width?: number
): ExtendedTableCellNode {
  return new ExtendedTableCellNode(headerState, colSpan, width);
}

export function $isCustomTableCellNode(
  node: LexicalNode | null | undefined
): node is ExtendedTableCellNode {
  return node instanceof ExtendedTableCellNode;
}
