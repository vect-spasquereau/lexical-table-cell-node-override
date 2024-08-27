import { $createHeadingNode } from "@lexical/rich-text";
import { $createTextNode, $getRoot } from "lexical";

export const prepopulatedRichText = () => {
  const root = $getRoot();

  if (root.getFirstChild() === null) {
    const heading = $createHeadingNode("h1");
    heading.append($createTextNode("Welcome to the playground"));
    root.append(heading);
  }
};
