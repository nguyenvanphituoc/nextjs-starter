import { JSONModelType, JSONModelKeys } from "@/redux/search/type";

export function getDisplayValue(
  item: JSONModelType[JSONModelKeys]["0"]
): string {
  return `${item.value} ${item.note ? `( ${item.note})` : ""}`.trim();
}
