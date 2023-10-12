/**
 * 
 * @param data 
 * formData {
  composition: [ { id: 'C000', value: 'All' } ],
  element: [ { id: 'E001', value: 'Subject' } ],
  medium: [ { id: 'M000', value: 'All' } ],
  shaping: [ { id: 'G000', value: 'All' } ],
  time_context: [ { id: 'TC001', value: 'Ancient (BC)' } ],
  tone: [ { id: 'T000', value: 'All' } ],
  visual_style: [ { id: 'VS001', value: 'Pop Art' } ]
}

row {
  graphic_style: { prefix: '', values: [ 'Memphis' ] },
  time_context: { prefix: '', values: [ 'Cold War (1950s - 1990s)' ] },
  tone: { prefix: '', values: [ 'Neon', 'Bright', 'Pastel' ] },
  shaping: { prefix: '', values: [ 'Geometric', 'Stripe', 'Cute' ] },
  composition: { prefix: '', values: [ 'Pattern', 'Chaotic', 'Grid' ] },
  medium: { prefix: '', values: [ 'Digital', '3D', 'Collage' ] },
  industry: { prefix: '', values: [ '' ] }
}
 */
export const DATA_KEY_LIST = [
  "composition",
  "element",
  "medium",
  "shaping",
  "time_context",
  "tone",
  "visual_style",
] as const;

export type DataKey = (typeof DATA_KEY_LIST)[number];

export type RowDataType = {
  [key in DataKey]: {
    prefix?: string;
    values: string[];
  };
};

export type JSONModelType = {
  [key in DataKey]: Array<{
    value: string;
    label: string;
    note?: string;
  }>;
};

export type JSONModelKeys = keyof JSONModelType;
// export type Values = JSONModelType[JSONModelKeys];

export type FormInput = {
  [key in JSONModelKeys]: string[];
} & {
  entity: string;
};

export interface SliceState {
  formVisualStyle: RowDataType[];
  visualStyleComposition: RowDataType[];
}
