import { Values as ModelValues } from "@/redux/search/type";

export function getDisplayValue(item: ModelValues["0"]): string {
  return `${item.value} ${item.note ? `( ${item.note})` : ""}`.trim();
}
