import { ChangeEvent, useCallback, useEffect, useRef } from "react";

export type ItemType = {
  id: string;
  value: string;
};

export type ComponentProps = {
  ref?: any;
  list: Array<ItemType>;
  defaultValues: Array<ItemType>;
  onChange?: (selectItems: Array<ItemType>) => void;
};

const MultipleChoice = ({ list, defaultValues, onChange }: ComponentProps) => {
  const selectedItems = useRef<Array<ItemType>>([]);

  const onSelectedItem = useCallback(
    (item: ItemType) => (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        selectedItems.current.push(item);
      } else {
        selectedItems.current = selectedItems.current.filter(
          (selectedItem) => selectedItem.id !== item.id
        );
      }

      onChange?.(selectedItems.current);
    },
    [onChange]
  );

  useEffect(() => {
    if (defaultValues && defaultValues?.length) {
      selectedItems.current.push(...defaultValues);
    }
  }, []);

  return (
    <div className="flex flex-wrap -mx-2">
      {list.map((item, index) => (
        <div
          key={index}
          className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-2 mb-4"
        >
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-gray-600 text-primary focus:ring-primary"
              value={item.value}
              id={item.id}
              onChange={onSelectedItem(item)}
              checked={selectedItems.current.some(
                (i) => i.value === item.value
              )}
            />

            <span className="ml-2 text-gray-700">{item.value}</span>
          </label>
        </div>
      ))}
    </div>
  );
};

export default MultipleChoice;
