"use client";

export default function FieldSetComponent({
  children,
  legend,
}: {
  children: React.ReactNode;
  legend: string;
}) {
  return (
    <fieldset className="bg-white rounded-lg shadow-md p-4 mb-4">
      <legend className="text-lg font-medium mb-2">{legend}</legend>
      {children}
    </fieldset>
  );
}
