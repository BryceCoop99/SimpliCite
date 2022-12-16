export class DocumentError {
  constructor(error, type, secIndex, index) {
    this.error = error;
    this.secIndex = secIndex;
    this.index = index;
    this.type = type;
  }
  
  getError() {
    return this.error;
  }
  
  getType() {
    return this.type;
  }
  
  getSection() {
    return this.secIndex;
  }
  
  getIndex() {
    return this.index;
  }
}