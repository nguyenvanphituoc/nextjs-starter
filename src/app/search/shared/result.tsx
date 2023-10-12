import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux";
import { FormInput } from "@/redux/search/type";
import PencilIcon from "@heroicons/react/24/solid/PencilIcon";
import ClipboardDocumentIcon from "@heroicons/react/24/outline/ClipboardDocumentIcon";
import { useCallback } from "react";
import { useClipboard } from "@/hook/useClipboard";

export default function Form({
  formData,
  onRequestEdit,
}: {
  formData: FormInput;
  onRequestEdit: (focus: keyof FormInput) => void;
}) {
  const { copy, state } = useClipboard();

  const _renderEditablePart = useCallback(
    (text: string, onPress: () => void) => {
      return (
        <div
          onClick={onPress}
          className="inline-flex items-center mr-2 cursor-pointer border-b-2 border-dashed border-gray-500 group transition duration-300"
        >
          <span className="text-gray-500 group-hover:scale-95 text-lg font-bold">
            {text}
          </span>
          <PencilIcon className="opacity-0 w-3 h-3 group-hover:opacity-100" />
        </div>
      );
    },
    []
  );

  const onCopy = useCallback(() => {
    copy(
      `${formData["element"]?.[0] ?? ""} ${formData["entity"] ?? ""} ${
        formData["tone"]?.[0] ?? ""
      } ${formData["visual_style"]?.[0] ?? ""}`
    );
  }, [copy, formData]);

  const onPressEditElement = useCallback(() => {
    onRequestEdit("element");
  }, [onRequestEdit]);

  const onPressEditEntity = useCallback(() => {
    onRequestEdit("entity");
  }, [onRequestEdit]);

  const onPressEditTone = useCallback(() => {
    onRequestEdit("tone");
  }, [onRequestEdit]);

  const onPressEditVisualStyle = useCallback(() => {
    onRequestEdit("visual_style");
  }, [onRequestEdit]);

  return (
    <div className="max-w-md mx-auto">
      <p>Từ khoá tìm kiếm</p>
      <div className="whitespace-nowrap">
        {_renderEditablePart(formData["element"]?.[0], onPressEditElement)}
        {_renderEditablePart(formData["entity"], onPressEditEntity)}
        {_renderEditablePart(formData["tone"]?.[0], onPressEditTone)}
        {_renderEditablePart(
          formData["visual_style"]?.[0],
          onPressEditVisualStyle
        )}
        <div
          className="inline-flex items-center cursor-pointer group"
          onClick={onCopy}
        >
          <span className="text-gray-500 group-hover:scale-95"></span>
          <ClipboardDocumentIcon className="w-7 h-7" />
        </div>
      </div>
      {state === "SUCCESS" && <p>Đã sao chép vào clipboard</p>}
    </div>
  );
}
