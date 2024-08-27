import {
  SerializedTableCellNode,
  TableCellHeaderStates,
  TableCellNode,
} from "@lexical/table";
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
      type: this.getType(),
      version: 1,
    };
  }

  static clone(node: TableCellNode): TableCellNode {
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
    const dom = super.createDOM(config);
    return dom;
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
