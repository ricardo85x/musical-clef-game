export interface LineProps {
    notes: {
      index: number;
      enabled: boolean;
      additional: boolean;
      hasNote: boolean;
      hasLine: boolean;
      base: boolean;
      type: number[];
      notation: string;
    }[];
    previous: number;
}

export interface EnabledTypesProps {
    index: number;
    type: number;
    enabled: boolean;
}