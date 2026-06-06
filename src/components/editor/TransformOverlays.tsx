import { TransformEditorModal } from "./TransformEditorModal";
import { TransformMenu } from "./TransformMenu";
import { TransformStatusToast } from "./TransformStatusToast";

export function TransformOverlays() {
  return (
    <>
      <TransformMenu />
      <TransformEditorModal />
      <TransformStatusToast />
    </>
  );
}
