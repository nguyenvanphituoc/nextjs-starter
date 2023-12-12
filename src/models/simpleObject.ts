interface SimpleDataType {
  value: string;
  label: string;
}

class SimpleDataObject {
  private data: SimpleDataType[];

  constructor(readPath: string);
  constructor(...data: SimpleDataType[]);

  constructor(...args: any[]) {
    if (Array.isArray(args[0])) {
      this.data = args[0];
    } else {
      this.data = new Array<SimpleDataType>();
    }
  }

  public getData(): SimpleDataType[] {
    return this.data;
  }
}

export default SimpleDataObject;
